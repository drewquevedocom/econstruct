import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const maxDuration = 30;

const PT_TZ_OFFSET_HOURS = 7;
function ymdInPT(date: Date) {
  const adjusted = new Date(date.getTime() - PT_TZ_OFFSET_HOURS * 3600 * 1000);
  return adjusted.toISOString().slice(0, 10);
}

const AUDIENCE_LABEL: Record<string, string> = {
  "fire-victims": "Fire victims (Palisades/Eaton)",
  architects: "Architects",
  realtors: "Realtors",
  "permit-runners": "Permit runners (LADBS)",
  insurance: "Insurance",
  "mixed-industry": "Industry mix",
};

function formatEventDate(iso: string | null): string {
  if (!iso) return "Date TBD — recurring";
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function buildHtml(events: Array<{
  title: string;
  event_date: string | null;
  location: string | null;
  host_org: string | null;
  event_url: string | null;
  audience: string;
  notes: string | null;
}>): string {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  if (events.length === 0) {
    return `<div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:1.65;color:#222;max-width:620px;">
<p>Frank + Drew —</p>
<p>No upcoming LA-area events this week. The Events table is empty or all past dates have been archived.</p>
<p>Drop new event intel into <code>/api/agents/extract-events</code> (forward any AIA|LA, PPCC, or Altadena Town Council newsletters and Claude extracts the events automatically).</p>
<p>— Drew (via CRM)</p>
</div>`;
  }

  const eventCards = events
    .map((e) => {
      const audience = AUDIENCE_LABEL[e.audience] || e.audience;
      const dateLabel = formatEventDate(e.event_date);
      const locationLine = [e.host_org, e.location].filter(Boolean).join(" · ") || "Location TBD";
      const url = e.event_url
        ? `<p style="margin:6px 0 0 0;"><a href="${e.event_url}" style="color:#B8963E;font-size:12px;text-decoration:none;">View details →</a></p>`
        : "";
      const notes = e.notes
        ? `<p style="margin:6px 0 0 0;color:#666;font-size:12px;font-style:italic;">${e.notes}</p>`
        : "";
      return `<table cellpadding="0" cellspacing="0" border="0" style="width:100%;margin:0 0 14px 0;border-collapse:collapse;background:#FAF9F6;border-radius:10px;">
<tr><td style="padding:14px 18px;">
<p style="margin:0;font-size:11px;font-weight:bold;color:#B8963E;letter-spacing:0.1em;">${dateLabel.toUpperCase()}</p>
<p style="margin:4px 0 0 0;font-size:15px;font-weight:bold;color:#1C1C1E;">${e.title}</p>
<p style="margin:4px 0 0 0;color:#666;font-size:12px;">${locationLine}</p>
<p style="margin:6px 0 0 0;"><span style="display:inline-block;padding:2px 8px;background:#fff;border:1px solid #E8E4DC;border-radius:999px;font-size:10px;font-weight:bold;color:#222;">${audience}</span></p>
${notes}${url}
</td></tr>
</table>`;
    })
    .join("");

  return `<div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:1.65;color:#222;max-width:620px;">

<p>Frank + Drew —</p>

<p>Here's the upcoming LA-area networking + fire-rebuild community events worth showing up to this week. Pulled live from the CRM event feed (${today}).</p>

<h2 style="margin:24px 0 12px 0;color:#1C1C1E;border-bottom:2px solid #B8963E;padding-bottom:6px;font-size:16px;">Upcoming Events (${events.length})</h2>

${eventCards}

<p style="margin-top:20px;">Pick 1-2 to attend in person — hand out cards, meet displaced homeowners actively choosing GCs, deepen relationships with the architects and permit folks. Showing up is the unfair advantage.</p>

<p style="font-size:12px;color:#666;">Full live list updates daily on the CRM dashboard at <a href="https://econstructhomes.com/crm/dashboard" style="color:#B8963E;">/crm/dashboard</a>. Past events auto-archive.</p>

<table cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;border-top:2px solid #B8963E;padding-top:14px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;line-height:1.5;color:#222;">
<tr><td><strong>Drew Quevedo</strong></td></tr>
<tr><td style="color:#666;">DQ Agentiq · CRM Operator for econstruct</td></tr>
<tr><td><a href="mailto:marketing@econstructinc.com" style="color:#222;text-decoration:none;">marketing@econstructinc.com</a></td></tr>
</table>

</div>`;
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  const expected = `Bearer ${process.env.CRON_SECRET || ""}`;
  if (!process.env.CRON_SECRET || auth !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "RESEND_API_KEY not set" }, { status: 500 });

  const supabase = createServiceClient();
  const todayPT = ymdInPT(new Date());

  // Get upcoming events (today or future, or recurring/TBD with null date).
  const { data: events, error } = await supabase
    .from("crm_events")
    .select("title, event_date, location, host_org, event_url, audience, notes")
    .eq("is_archived", false)
    .or(`event_date.gte.${todayPT},event_date.is.null`)
    .order("event_date", { ascending: true, nullsFirst: false })
    .limit(15);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const eventList = events ?? [];

  // Default recipients mirror the daily report.
  const to = (process.env.EVENTS_WEEKLY_TO || "frank@econstructinc.com,drewquevedo@gmail.com")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const cc = (process.env.EVENTS_WEEKLY_CC || "katie@econstructinc.com,marketing@econstructinc.com")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const from = process.env.DAILY_REPORT_FROM?.replace("CRM", "Events") || "econstruct Events <onboarding@resend.dev>";

  const subject = `econstruct — Weekly LA Events to Attend (${todayPT})`;
  const html = buildHtml(eventList);

  const payload: Record<string, unknown> = { from, to, subject, html };
  if (cc.length) payload.cc = cc;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await res.json();
  if (!res.ok) {
    return NextResponse.json({ error: `Resend ${res.status}`, body }, { status: 502 });
  }

  await supabase.from("agent_runs").insert({
    agent_name: "events-weekly",
    run_type: "scheduled",
    status: "success",
    records_pulled: eventList.length,
    records_updated: 1,
    metadata: { to, cc, event_count: eventList.length, resend_id: body?.id ?? null },
    ended_at: new Date().toISOString(),
  });

  return NextResponse.json({
    sent: true,
    event_count: eventList.length,
    resend_id: body?.id ?? null,
    to,
    cc,
  });
}
