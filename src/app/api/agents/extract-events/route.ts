import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const maxDuration = 60;

// Audience values must match the crm_events_audience_check constraint.
const VALID_AUDIENCES = new Set([
  "fire-victims",
  "architects",
  "realtors",
  "permit-runners",
  "insurance",
  "mixed-industry",
]);

type ExtractedEvent = {
  title: string;
  event_date: string | null;
  location: string | null;
  host_org: string | null;
  event_url: string | null;
  audience: string;
  notes: string | null;
};

/**
 * Send the raw email body to Claude Haiku, get back a list of LA-area events
 * relevant to econstruct (luxury rebuilds, fire victims in Altadena +
 * Palisades, new-home networking).
 */
async function extractWithClaude(emailText: string): Promise<ExtractedEvent[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `Extract LA-area events from the email below that an LA luxury general contractor (econstruct) should attend.

ICP: Frank Neimroozi runs econstruct. He targets two audiences:
1. Industry networking — architects, realtors, real estate attorneys, interior designers, CPAs, escrow officers, structural engineers, permit expediters, insurance adjusters, fire/water restoration firms
2. Fire victims who need rebuilds — Palisades Fire (Jan 2025) and Eaton Fire (Jan 2025), still actively rebuilding in 2026. Pacific Palisades, Malibu, Altadena, Pasadena.

INCLUDE: AIA|LA, ULI LA, BIA SoCal, Pacific Palisades Community Council, Altadena Town Council, Pali LTRG, LA Build Expo, chamber of commerce meetings in fire zones, fire-rebuild resource fairs, real-estate conferences in LA County.

EXCLUDE: anything outside LA County, anything for residential homeowners not in fire zones, anything for B2C consumer products.

For each event, extract:
- title: short clear name
- event_date: ISO format YYYY-MM-DD if a specific date is given, or null if recurring/TBD
- location: city + venue if given
- host_org: organization running it
- event_url: real URL if mentioned
- audience: ONE of [fire-victims, architects, realtors, permit-runners, insurance, mixed-industry]
- notes: one-sentence reason an LA luxury GC should attend

Email content:
"""
${emailText.slice(0, 12000)}
"""

Respond with ONLY a JSON array. No prose. No markdown. If no relevant events found, return [].`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Anthropic ${res.status}: ${txt.slice(0, 200)}`);
  }
  const data = await res.json();
  const raw = data?.content?.[0]?.text || "[]";
  // Strip ```json fences if Claude added them despite our request.
  const cleaned = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
  try {
    const parsed = JSON.parse(cleaned);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((e): e is ExtractedEvent => Boolean(e?.title));
  } catch {
    return [];
  }
}

export async function POST(req: NextRequest) {
  // Auth: require CRON_SECRET so the endpoint can't be abused publicly.
  const auth = req.headers.get("authorization") || "";
  const expected = `Bearer ${process.env.CRON_SECRET || ""}`;
  if (!process.env.CRON_SECRET || auth !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { email_text?: string; source?: string; dry_run?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const emailText = (body.email_text || "").trim();
  if (!emailText) {
    return NextResponse.json({ error: "email_text is required" }, { status: 400 });
  }

  let extracted: ExtractedEvent[];
  try {
    extracted = await extractWithClaude(emailText);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 502 }
    );
  }

  // Normalize + validate before insert.
  const today = new Date().toISOString().slice(0, 10);
  const normalized = extracted.map((e) => ({
    title: String(e.title).slice(0, 200),
    event_date: e.event_date && /^\d{4}-\d{2}-\d{2}$/.test(e.event_date) ? e.event_date : null,
    location: e.location ? String(e.location).slice(0, 300) : null,
    host_org: e.host_org ? String(e.host_org).slice(0, 200) : null,
    event_url: e.event_url ? String(e.event_url).slice(0, 500) : null,
    audience: VALID_AUDIENCES.has(e.audience) ? e.audience : "mixed-industry",
    notes: e.notes ? String(e.notes).slice(0, 500) : null,
  }));

  // Drop events whose date is more than 7 days in the past (stale).
  const fresh = normalized.filter(
    (e) => !e.event_date || e.event_date >= new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10)
  );

  if (body.dry_run) {
    return NextResponse.json({ dry_run: true, extracted: fresh, count: fresh.length });
  }

  if (fresh.length === 0) {
    return NextResponse.json({ inserted: 0, extracted: 0, note: "No relevant events found" });
  }

  // Dedupe: skip events where the (title, event_date) tuple already exists.
  const supabase = createServiceClient();
  const { data: existing } = await supabase.from("crm_events").select("title, event_date");
  const existingKey = new Set(
    (existing ?? []).map((e: { title: string; event_date: string | null }) => `${e.title}|${e.event_date || ""}`)
  );
  const toInsert = fresh.filter((e) => !existingKey.has(`${e.title}|${e.event_date || ""}`));

  if (toInsert.length === 0) {
    return NextResponse.json({ inserted: 0, extracted: fresh.length, note: "All extracted events already in DB" });
  }

  const { error } = await supabase.from("crm_events").insert(toInsert);
  if (error) {
    return NextResponse.json({ error: error.message, attempted: toInsert }, { status: 500 });
  }

  // Log the ingest run.
  await supabase.from("agent_runs").insert({
    agent_name: "extract-events",
    run_type: "manual",
    status: "success",
    records_pulled: extracted.length,
    records_created: toInsert.length,
    metadata: {
      source: body.source || "manual_paste",
      ingested_at: new Date().toISOString(),
      sample_event: toInsert[0]?.title,
      today,
    },
    ended_at: new Date().toISOString(),
  });

  return NextResponse.json({
    inserted: toInsert.length,
    extracted: fresh.length,
    duplicates_skipped: fresh.length - toInsert.length,
    events: toInsert,
  });
}
