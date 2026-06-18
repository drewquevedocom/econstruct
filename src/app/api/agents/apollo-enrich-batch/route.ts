import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const maxDuration = 300; // up to 5 min for large batches

const KNOWN_PARTNER_TYPES = new Set([
  "Architect",
  "Realtor / Real Estate Agent",
  "Insurance Agent / Adjuster",
  "Expediter / Permit Runner",
  "Interior Designer",
  "Real Estate Attorney",
  "CPA / Wealth Advisor",
  "Escrow Officer",
  "Structural / Geotech Engineer",
  "Fire / Water Restoration",
  "HOA / Property Manager",
  "Other",
]);

type EnrichTarget = {
  first_name: string;
  last_name: string;
  organization_name?: string;
  partner_type: string;
  source?: string;
  notes?: string;
};

type ApolloMatch = {
  email?: string;
  email_status?: string;
  title?: string;
  linkedin_url?: string;
  phone_numbers?: Array<{ raw_number?: string; sanitized_number?: string }>;
  city?: string;
  state?: string;
  organization?: { name?: string; website_url?: string };
};

async function apolloMatch(t: EnrichTarget): Promise<ApolloMatch | null> {
  const apiKey = process.env.APOLLO_API_KEY;
  if (!apiKey) throw new Error("APOLLO_API_KEY not set");
  const res = await fetch("https://api.apollo.io/api/v1/people/match", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Api-Key": apiKey },
    body: JSON.stringify({
      first_name: t.first_name,
      last_name: t.last_name,
      organization_name: t.organization_name || undefined,
      reveal_personal_emails: true,
    }),
  });
  if (!res.ok) {
    throw new Error(`Apollo ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
  const body = await res.json();
  return (body.person ?? null) as ApolloMatch | null;
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  const expected = `Bearer ${process.env.CRON_SECRET || ""}`;
  if (!process.env.CRON_SECRET || auth !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { targets?: EnrichTarget[]; default_source?: string; dry_run?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const targets = (body.targets || []).filter(
    (t) => t && t.first_name && t.last_name && KNOWN_PARTNER_TYPES.has(t.partner_type)
  );
  if (targets.length === 0) {
    return NextResponse.json({ error: "No valid targets" }, { status: 400 });
  }
  if (targets.length > 200) {
    return NextResponse.json({ error: "Batch size capped at 200 — split into smaller calls" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const today = new Date().toISOString().slice(0, 10);

  // Existing email dedup
  const { data: existingRows } = await supabase
    .from("partner_leads")
    .select("contact_email");
  const existingEmails = new Set(
    (existingRows ?? []).map((r) => (r.contact_email || "").toLowerCase())
  );

  const matched: Array<EnrichTarget & { email: string; phone: string | null; title: string | null; linkedin: string | null; org: string | null }> = [];
  const noMatch: EnrichTarget[] = [];
  const noEmail: EnrichTarget[] = [];
  const apiErrors: Array<{ target: EnrichTarget; error: string }> = [];

  for (const t of targets) {
    try {
      const match = await apolloMatch(t);
      if (!match) {
        noMatch.push(t);
        continue;
      }
      const verifiedEmail =
        match.email && (match.email_status === "verified" || match.email_status === "likely_to_engage")
          ? match.email.toLowerCase()
          : null;
      if (!verifiedEmail) {
        noEmail.push(t);
        continue;
      }
      const phone = match.phone_numbers?.[0]?.sanitized_number || match.phone_numbers?.[0]?.raw_number || null;
      matched.push({
        ...t,
        email: verifiedEmail,
        phone,
        title: match.title || null,
        linkedin: match.linkedin_url || null,
        org: match.organization?.name || t.organization_name || null,
      });
    } catch (err) {
      apiErrors.push({ target: t, error: err instanceof Error ? err.message : String(err) });
    }
  }

  // Dedup against DB
  const toInsert = matched.filter((m) => !existingEmails.has(m.email));
  const dupesAgainstDb = matched.length - toInsert.length;

  if (body.dry_run) {
    return NextResponse.json({
      dry_run: true,
      targets: targets.length,
      matched: matched.length,
      no_match: noMatch.length,
      no_email: noEmail.length,
      api_errors: apiErrors.length,
      dupes_against_db: dupesAgainstDb,
      would_insert: toInsert.length,
      sample: toInsert.slice(0, 3).map((m) => ({ name: `${m.first_name} ${m.last_name}`, email: m.email, org: m.org })),
    });
  }

  let inserted = 0;
  for (const m of toInsert) {
    const partnerName = `${m.first_name} ${m.last_name}`.trim();
    const notesParts = [
      m.title ? `Title: ${m.title}` : null,
      m.linkedin ? `LinkedIn: ${m.linkedin}` : null,
      `Sourced + enriched via Apollo on ${today}`,
      m.notes,
    ].filter(Boolean);
    const { error } = await supabase.from("partner_leads").insert({
      partner_name: partnerName,
      company_firm: m.org,
      partner_type: m.partner_type,
      specialization: m.title,
      source: m.source || body.default_source || "Cold Outreach",
      contact_email: m.email,
      contact_phone: m.phone,
      linkedin_url: m.linkedin,
      referral_agreement_status: "Not Started",
      referral_fee: 5000,
      notes: notesParts.join(" | "),
      assigned_to: "Drew Quevedo",
      status: "New Lead",
    });
    if (!error) inserted++;
  }

  await supabase.from("agent_runs").insert({
    agent_name: "apollo-enrich-batch",
    run_type: "manual",
    status: apiErrors.length > 0 ? "partial" : "success",
    records_pulled: targets.length,
    records_created: inserted,
    metadata: {
      matched: matched.length,
      no_match: noMatch.length,
      no_email: noEmail.length,
      api_errors: apiErrors.length,
      dupes_against_db: dupesAgainstDb,
    },
    ended_at: new Date().toISOString(),
  });

  return NextResponse.json({
    inserted,
    matched: matched.length,
    targets: targets.length,
    no_match: noMatch.length,
    no_email: noEmail.length,
    api_errors: apiErrors.length,
    dupes_against_db: dupesAgainstDb,
    apollo_credits_used: matched.length + noEmail.length + noMatch.length,
  });
}
