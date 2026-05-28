// One-off: build today's daily CRM report and send via Resend.
// Standalone (no Next.js) so we can test before deploy.
// Run: node scripts/send-daily-report-now.mjs [--dry-run]

import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, "..", ".env.local") });

const DRY_RUN = process.argv.includes("--dry-run");
const RECIPIENTS = (process.env.DAILY_REPORT_RECIPIENTS || process.env.HOT_LEAD_NOTIFY_EMAILS || "frank@econstructinc.com,marketing@econstructinc.com")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

function ymdInPT(date) {
  const adjusted = new Date(date.getTime() - 7 * 3600 * 1000);
  return adjusted.toISOString().slice(0, 10);
}

function fmtDate(iso) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function fmtShort(iso) {
  return new Date(iso).toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

async function buildReport() {
  const now = new Date();
  const yesterdayCutoff = new Date(now.getTime() - 24 * 3600 * 1000).toISOString();
  const c = (q) => q.then((r) => r.count ?? 0);

  const [enrolled, replies, interested, newPartners, newPermits, enriched] = await Promise.all([
    c(supabase.from("lead_activities").select("id", { count: "exact", head: true }).eq("type", "campaign_enrolled").eq("channel", "instantly").gte("created_at", yesterdayCutoff)),
    c(supabase.from("lead_events").select("id", { count: "exact", head: true }).eq("event_type", "reply_received").gte("created_at", yesterdayCutoff)),
    c(supabase.from("lead_events").select("id", { count: "exact", head: true }).eq("event_type", "handoff_hot_lead").gte("created_at", yesterdayCutoff)),
    c(supabase.from("partner_leads").select("id", { count: "exact", head: true }).gte("created_at", yesterdayCutoff)),
    c(supabase.from("leads").select("id", { count: "exact", head: true }).eq("source", "ladbs_permits").gte("created_at", yesterdayCutoff)),
    c(supabase.from("lead_activities").select("id", { count: "exact", head: true }).eq("type", "property_enriched").gte("created_at", yesterdayCutoff)),
  ]);

  const { data: runs } = await supabase.from("agent_runs").select("agent_name, status, started_at, errors").gte("started_at", yesterdayCutoff).order("started_at", { ascending: false });
  // Filter out stale-timeout noise (Worker wall-clock cleanups, not real failures).
  const isStale = (errs) => Array.isArray(errs) && errs.some((e) => {
    const s = String(e);
    return s.includes("STALE_TIMEOUT") || s.includes("stale running timeout");
  });
  const failedRuns = (runs ?? []).filter((r) => r.status === "failed" && !isStale(r.errors));

  const { data: activity } = await supabase.from("lead_activities").select("type, channel, created_at").gte("created_at", yesterdayCutoff).order("created_at", { ascending: false }).limit(10);

  const [totalLeads, totalPermits, permitsEnriched, permitsMailReady, permitsIndividual, totalPartners, partnersWithEmail, partnersContacted, partnersNewLead] = await Promise.all([
    c(supabase.from("leads").select("id", { count: "exact", head: true })),
    c(supabase.from("leads").select("id", { count: "exact", head: true }).eq("source", "ladbs_permits")),
    c(supabase.from("leads").select("id", { count: "exact", head: true }).eq("source", "ladbs_permits").not("owner_name", "is", null)),
    c(supabase.from("leads").select("id", { count: "exact", head: true }).eq("source", "ladbs_permits").eq("owner_type", "entity").not("owner_mailing_address", "is", null)),
    c(supabase.from("leads").select("id", { count: "exact", head: true }).eq("source", "ladbs_permits").eq("owner_type", "individual")),
    c(supabase.from("partner_leads").select("id", { count: "exact", head: true })),
    c(supabase.from("partner_leads").select("id", { count: "exact", head: true }).not("contact_email", "is", null)),
    c(supabase.from("partner_leads").select("id", { count: "exact", head: true }).eq("status", "Contacted")),
    c(supabase.from("partner_leads").select("id", { count: "exact", head: true }).eq("status", "New Lead").not("contact_email", "is", null)),
  ]);

  return {
    date: ymdInPT(now),
    yesterday: {
      coldEmailsEnrolled: enrolled,
      repliesReceived: replies,
      interestedReplies: interested,
      newPartnerLeads: newPartners,
      newPermits: newPermits,
      ownersEnriched: enriched,
      agentRunsTotal: runs?.length ?? 0,
      agentRunsFailed: failedRuns.length,
    },
    snapshot: {
      totalLeads,
      totalPermits,
      permitsEnriched,
      permitsMailReady,
      permitsIndividualOwners: permitsIndividual,
      totalPartners,
      partnersWithEmail,
      partnersContacted,
      partnersNewLead,
    },
    topActivity: (activity ?? []).map((a) => ({ when: a.created_at, type: a.type, channel: a.channel })),
    recentFailures: failedRuns.slice(0, 5).map((r) => ({
      agent: r.agent_name,
      when: r.started_at,
      error: Array.isArray(r.errors) && r.errors.length ? String(r.errors[0]).slice(0, 200) : "see logs",
    })),
  };
}

function recommendation(report) {
  const y = report.yesterday;
  const s = report.snapshot;
  if (y.agentRunsFailed > 0)
    return { tone: "act", title: `${y.agentRunsFailed} agent run${y.agentRunsFailed === 1 ? "" : "s"} failed in the last 24h.`, body: "Check the failures section below. The system held off on sending to avoid bad data — once the failure is resolved, partners will auto-enroll on the next cron." };
  if (y.coldEmailsEnrolled === 0 && s.partnersNewLead > 0)
    return { tone: "act", title: `${s.partnersNewLead} partners ready to send — but no enrollments in 24h.`, body: "Likely the Instantly campaign is paused or the API key isn't deployed. Resume the campaign in Instantly and trigger the partner-enroll agent." };
  if (y.coldEmailsEnrolled > 0 && y.repliesReceived === 0 && y.coldEmailsEnrolled >= 50)
    return { tone: "watch", title: `${y.coldEmailsEnrolled} emails out, no replies yet.`, body: "Normal for the first 24-48h. Watch reply rate after day 3. If still 0 by day 5, audit copy or sender reputation." };
  if (y.interestedReplies > 0)
    return { tone: "good", title: `${y.interestedReplies} interested ${y.interestedReplies === 1 ? "reply" : "replies"} yesterday.`, body: "Follow-up tasks are in the CRM dashboard. Hot-lead alerts were sent to marketing@ and frank@ as they came in." };
  if (y.coldEmailsEnrolled > 0)
    return { tone: "good", title: `${y.coldEmailsEnrolled} cold emails enrolled yesterday.`, body: `Currently ramping. ${s.partnersNewLead} more partners queued for the next sends.` };
  return { tone: "watch", title: "Quiet day — no sends, no replies.", body: "Systems healthy. Add more leads or resume campaign to keep volume flowing." };
}

function renderHtml(report) {
  const rec = recommendation(report);
  const recColor = rec.tone === "good" ? "#0E7C5C" : rec.tone === "watch" ? "#B8963E" : "#B94A48";
  const recBg = rec.tone === "good" ? "#E6F5EF" : rec.tone === "watch" ? "#FAF1D5" : "#FBE7E6";
  const movementRows = [
    { label: "Cold emails sent", value: report.yesterday.coldEmailsEnrolled, icon: "📨" },
    { label: "Replies received", value: report.yesterday.repliesReceived, icon: "💬" },
    { label: "Interested replies (hot)", value: report.yesterday.interestedReplies, icon: "🔥" },
    { label: "New partner leads loaded", value: report.yesterday.newPartnerLeads, icon: "🤝" },
    { label: "New permits scraped", value: report.yesterday.newPermits, icon: "🏗️" },
    { label: "Owners enriched (ATTOM)", value: report.yesterday.ownersEnriched, icon: "🧭" },
  ];
  const snapshotRows = [
    { label: "Total leads", value: report.snapshot.totalLeads },
    { label: "New-build permits in pipeline", value: report.snapshot.totalPermits },
    { label: "Permits with owner data", value: report.snapshot.permitsEnriched },
    { label: "Direct-mail ready", value: report.snapshot.permitsMailReady },
    { label: "Individual owners (Apollo)", value: report.snapshot.permitsIndividualOwners },
    { label: "Partners loaded", value: report.snapshot.totalPartners },
    { label: "Partners with email", value: report.snapshot.partnersWithEmail },
    { label: "Partners already contacted", value: report.snapshot.partnersContacted },
    { label: "Partners queued to send", value: report.snapshot.partnersNewLead },
  ];

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>econstruct CRM Daily Report</title></head>
<body style="margin:0;padding:0;background:#F8F6F2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1C1C1E;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#F8F6F2;padding:24px 0;">
  <tr><td align="center">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="640" style="max-width:640px;background:#ffffff;border:1px solid #E8E4DC;border-radius:12px;overflow:hidden;">
      <tr><td style="background:#1C1C1E;padding:24px 28px;">
        <p style="margin:0;font-size:11px;font-weight:bold;letter-spacing:0.22em;text-transform:uppercase;color:#D4B96A;">econstruct CRM · Daily Report</p>
        <h1 style="margin:6px 0 0 0;font-size:24px;font-weight:900;color:#FFF8E7;line-height:1.2;">${fmtDate(report.date)}</h1>
      </td></tr>
      <tr><td style="padding:20px 28px 4px 28px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${recBg};border-left:4px solid ${recColor};border-radius:6px;">
          <tr><td style="padding:14px 16px;">
            <p style="margin:0;font-size:11px;font-weight:bold;letter-spacing:0.16em;text-transform:uppercase;color:${recColor};">Today's call</p>
            <p style="margin:6px 0 4px 0;font-size:16px;font-weight:bold;color:#1C1C1E;">${rec.title}</p>
            <p style="margin:0;font-size:13px;line-height:1.5;color:#404040;">${rec.body}</p>
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:24px 28px 8px 28px;">
        <p style="margin:0 0 12px 0;font-size:11px;font-weight:bold;letter-spacing:0.22em;text-transform:uppercase;color:#7E7468;">Last 24 hours</p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          ${movementRows.map((r) => `<tr><td style="padding:8px 0;border-bottom:1px solid #F0EDE5;font-size:14px;color:#404040;"><span style="display:inline-block;width:24px;">${r.icon}</span>${r.label}</td><td align="right" style="padding:8px 0;border-bottom:1px solid #F0EDE5;font-size:18px;font-weight:bold;color:#1C1C1E;font-variant-numeric:tabular-nums;">${r.value.toLocaleString()}</td></tr>`).join("")}
        </table>
      </td></tr>
      <tr><td style="padding:24px 28px 8px 28px;">
        <p style="margin:0 0 12px 0;font-size:11px;font-weight:bold;letter-spacing:0.22em;text-transform:uppercase;color:#7E7468;">Pipeline snapshot</p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          ${snapshotRows.map((r) => `<tr><td style="padding:6px 0;font-size:13px;color:#5A5448;">${r.label}</td><td align="right" style="padding:6px 0;font-size:14px;font-weight:bold;color:#1C1C1E;font-variant-numeric:tabular-nums;">${r.value.toLocaleString()}</td></tr>`).join("")}
        </table>
      </td></tr>
      ${report.recentFailures.length ? `<tr><td style="padding:20px 28px 0 28px;"><p style="margin:0 0 12px 0;font-size:11px;font-weight:bold;letter-spacing:0.22em;text-transform:uppercase;color:#B94A48;">Failures (last 24h)</p><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#FBE7E6;border-left:3px solid #B94A48;border-radius:4px;">${report.recentFailures.map((f) => `<tr><td style="padding:8px 12px;font-size:12px;color:#1C1C1E;border-bottom:1px solid rgba(185,74,72,0.15);"><strong>${f.agent}</strong> · ${fmtShort(f.when)}<br><span style="color:#7A2A28;font-family:Menlo,Consolas,monospace;font-size:11px;">${f.error}</span></td></tr>`).join("")}</table></td></tr>` : ""}
      ${report.topActivity.length ? `<tr><td style="padding:24px 28px 8px 28px;"><p style="margin:0 0 12px 0;font-size:11px;font-weight:bold;letter-spacing:0.22em;text-transform:uppercase;color:#7E7468;">Recent activity feed</p><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">${report.topActivity.map((a) => `<tr><td style="padding:6px 0;font-size:12px;color:#404040;border-bottom:1px solid #F0EDE5;"><span style="color:#7E7468;font-variant-numeric:tabular-nums;">${fmtShort(a.when)}</span>&nbsp;·&nbsp; <strong style="color:#1C1C1E;">${a.type.replace(/_/g, " ")}</strong>${a.channel ? ` via ${a.channel}` : ""}</td></tr>`).join("")}</table></td></tr>` : ""}
      <tr><td style="padding:24px 28px;background:#FAF9F6;border-top:1px solid #E8E4DC;">
        <p style="margin:0 0 4px 0;font-size:11px;color:#7E7468;line-height:1.5;">Dashboard: <a href="https://econstructhomes.com/crm/dashboard" style="color:#B8963E;text-decoration:none;">econstructhomes.com/crm/dashboard</a></p>
        <p style="margin:0;font-size:11px;color:#7E7468;line-height:1.5;">Generated automatically by the econstruct CRM. Replies to this address are not monitored.</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

async function main() {
  console.log("Building report...");
  const report = await buildReport();
  console.log(JSON.stringify({ yesterday: report.yesterday, snapshot: report.snapshot }, null, 2));
  const html = renderHtml(report);
  console.log(`HTML rendered: ${html.length} chars`);

  if (DRY_RUN) {
    const out = join(__dirname, "..", "daily-report-preview.html");
    const fs = await import("node:fs/promises");
    await fs.writeFile(out, html, "utf8");
    console.log(`DRY RUN — wrote preview to ${out}`);
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY missing");

  const subjectDate = new Date(report.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
  console.log(`Sending to: ${RECIPIENTS.join(", ")}`);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.DAILY_REPORT_FROM || "econstruct CRM <onboarding@resend.dev>",
      to: RECIPIENTS,
      subject: `econstruct CRM — Daily Report — ${subjectDate}`,
      html,
    }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`Resend ${res.status}: ${JSON.stringify(body)}`);
  console.log("Sent! Resend ID:", body.id);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
