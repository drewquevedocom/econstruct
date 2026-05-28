import { createServiceClient } from "@/lib/supabase/server";

export type DailyReportData = {
  date: string;
  yesterday: {
    coldEmailsEnrolled: number;
    repliesReceived: number;
    interestedReplies: number;
    newPartnerLeads: number;
    newPermits: number;
    ownersEnriched: number;
    agentRunsTotal: number;
    agentRunsFailed: number;
  };
  snapshot: {
    totalLeads: number;
    totalPermits: number;
    permitsEnriched: number;
    permitsMailReady: number;
    permitsIndividualOwners: number;
    totalPartners: number;
    partnersWithEmail: number;
    partnersContacted: number;
    partnersNewLead: number;
  };
  topActivity: Array<{ when: string; type: string; channel: string | null; detail?: string }>;
  recentFailures: Array<{ agent: string; when: string; error: string }>;
};

const PT_TZ_OFFSET_HOURS = 7; // PT is UTC-7 (PDT). Close enough for daily windows.

function ymdInPT(date: Date) {
  const adjusted = new Date(date.getTime() - PT_TZ_OFFSET_HOURS * 3600 * 1000);
  return adjusted.toISOString().slice(0, 10);
}

export async function buildDailyReport(): Promise<DailyReportData> {
  const supabase = createServiceClient();
  const now = new Date();
  const yesterdayCutoff = new Date(now.getTime() - 24 * 3600 * 1000).toISOString();

  // ── Yesterday's movement ────────────────────────────────────────
  const [
    enrolledRes,
    repliesRes,
    interestedRes,
    newPartnersRes,
    newPermitsRes,
    enrichedRes,
    runsRes,
    activityRes,
  ] = await Promise.all([
    supabase
      .from("lead_activities")
      .select("id", { count: "exact", head: true })
      .eq("type", "campaign_enrolled")
      .eq("channel", "instantly")
      .gte("created_at", yesterdayCutoff),
    supabase
      .from("lead_events")
      .select("id", { count: "exact", head: true })
      .eq("event_type", "reply_received")
      .gte("created_at", yesterdayCutoff),
    supabase
      .from("lead_events")
      .select("id", { count: "exact", head: true })
      .eq("event_type", "handoff_hot_lead")
      .gte("created_at", yesterdayCutoff),
    supabase
      .from("partner_leads")
      .select("id", { count: "exact", head: true })
      .gte("created_at", yesterdayCutoff),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("source", "ladbs_permits")
      .gte("created_at", yesterdayCutoff),
    supabase
      .from("lead_activities")
      .select("id", { count: "exact", head: true })
      .eq("type", "property_enriched")
      .gte("created_at", yesterdayCutoff),
    supabase
      .from("agent_runs")
      .select("agent_name, status, started_at, errors", { count: "exact" })
      .gte("started_at", yesterdayCutoff)
      .order("started_at", { ascending: false }),
    supabase
      .from("lead_activities")
      .select("type, channel, created_at, metadata")
      .gte("created_at", yesterdayCutoff)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const runs = runsRes.data ?? [];
  const failedRuns = runs.filter((r) => r.status === "failed");

  // ── Cumulative snapshot ─────────────────────────────────────────
  const [
    totalLeadsRes,
    totalPermitsRes,
    permitsEnrichedRes,
    permitsMailReadyRes,
    permitsIndividualRes,
    totalPartnersRes,
    partnersWithEmailRes,
    partnersContactedRes,
    partnersNewLeadRes,
  ] = await Promise.all([
    supabase.from("leads").select("id", { count: "exact", head: true }),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("source", "ladbs_permits"),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("source", "ladbs_permits")
      .not("owner_name", "is", null),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("source", "ladbs_permits")
      .eq("owner_type", "entity")
      .not("owner_mailing_address", "is", null),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("source", "ladbs_permits")
      .eq("owner_type", "individual"),
    supabase.from("partner_leads").select("id", { count: "exact", head: true }),
    supabase
      .from("partner_leads")
      .select("id", { count: "exact", head: true })
      .not("contact_email", "is", null),
    supabase.from("partner_leads").select("id", { count: "exact", head: true }).eq("status", "Contacted"),
    supabase
      .from("partner_leads")
      .select("id", { count: "exact", head: true })
      .eq("status", "New Lead")
      .not("contact_email", "is", null),
  ]);

  return {
    date: ymdInPT(now),
    yesterday: {
      coldEmailsEnrolled: enrolledRes.count ?? 0,
      repliesReceived: repliesRes.count ?? 0,
      interestedReplies: interestedRes.count ?? 0,
      newPartnerLeads: newPartnersRes.count ?? 0,
      newPermits: newPermitsRes.count ?? 0,
      ownersEnriched: enrichedRes.count ?? 0,
      agentRunsTotal: runs.length,
      agentRunsFailed: failedRuns.length,
    },
    snapshot: {
      totalLeads: totalLeadsRes.count ?? 0,
      totalPermits: totalPermitsRes.count ?? 0,
      permitsEnriched: permitsEnrichedRes.count ?? 0,
      permitsMailReady: permitsMailReadyRes.count ?? 0,
      permitsIndividualOwners: permitsIndividualRes.count ?? 0,
      totalPartners: totalPartnersRes.count ?? 0,
      partnersWithEmail: partnersWithEmailRes.count ?? 0,
      partnersContacted: partnersContactedRes.count ?? 0,
      partnersNewLead: partnersNewLeadRes.count ?? 0,
    },
    topActivity: (activityRes.data ?? []).slice(0, 10).map((a) => ({
      when: a.created_at,
      type: String(a.type ?? "—"),
      channel: a.channel as string | null,
      detail: a.metadata ? JSON.stringify(a.metadata).slice(0, 120) : undefined,
    })),
    recentFailures: failedRuns.slice(0, 5).map((r) => ({
      agent: r.agent_name,
      when: r.started_at,
      error: Array.isArray(r.errors) && r.errors.length ? String(r.errors[0]).slice(0, 200) : "see logs",
    })),
  };
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function fmtShort(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function recommendation(report: DailyReportData): { tone: "good" | "watch" | "act"; title: string; body: string } {
  const y = report.yesterday;
  const s = report.snapshot;

  if (y.agentRunsFailed > 0) {
    return {
      tone: "act",
      title: `${y.agentRunsFailed} agent run${y.agentRunsFailed === 1 ? "" : "s"} failed in the last 24h.`,
      body: "Check the failures section below. The system held off on sending to avoid bad data — once the failure is resolved, partners will auto-enroll on the next cron.",
    };
  }
  if (y.coldEmailsEnrolled === 0 && s.partnersNewLead > 0) {
    return {
      tone: "act",
      title: `${s.partnersNewLead} partners ready to send — but no enrollments in 24h.`,
      body: "Likely the Instantly campaign is paused or the API key isn't deployed. Resume the campaign in Instantly and trigger the partner-enroll agent.",
    };
  }
  if (y.coldEmailsEnrolled > 0 && y.repliesReceived === 0 && y.coldEmailsEnrolled >= 50) {
    return {
      tone: "watch",
      title: `${y.coldEmailsEnrolled} emails out, no replies yet.`,
      body: "Normal for the first 24-48h. Watch reply rate after day 3. If still 0 by day 5, audit copy or sender reputation.",
    };
  }
  if (y.interestedReplies > 0) {
    return {
      tone: "good",
      title: `${y.interestedReplies} interested ${y.interestedReplies === 1 ? "reply" : "replies"} yesterday.`,
      body: "Follow-up tasks are in the CRM dashboard. Hot-lead alerts were sent to marketing@ and frank@ as they came in.",
    };
  }
  if (y.coldEmailsEnrolled > 0) {
    return {
      tone: "good",
      title: `${y.coldEmailsEnrolled} cold emails enrolled yesterday.`,
      body: `Currently ramping. ${s.partnersNewLead} more partners queued for the next sends.`,
    };
  }
  return {
    tone: "watch",
    title: "Quiet day — no sends, no replies.",
    body: "Systems healthy. Add more leads or resume campaign to keep volume flowing.",
  };
}

export function renderDailyReportHtml(report: DailyReportData): string {
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
<html lang="en">
<head><meta charset="utf-8"><title>econstruct CRM Daily Report</title></head>
<body style="margin:0;padding:0;background:#F8F6F2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1C1C1E;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#F8F6F2;padding:24px 0;">
  <tr><td align="center">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="640" style="max-width:640px;background:#ffffff;border:1px solid #E8E4DC;border-radius:12px;overflow:hidden;">

      <!-- Header -->
      <tr>
        <td style="background:#1C1C1E;padding:24px 28px;">
          <p style="margin:0;font-size:11px;font-weight:bold;letter-spacing:0.22em;text-transform:uppercase;color:#D4B96A;">econstruct CRM · Daily Report</p>
          <h1 style="margin:6px 0 0 0;font-size:24px;font-weight:900;color:#FFF8E7;line-height:1.2;">${fmtDate(report.date)}</h1>
        </td>
      </tr>

      <!-- Recommendation -->
      <tr><td style="padding:20px 28px 4px 28px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${recBg};border-left:4px solid ${recColor};border-radius:6px;">
          <tr><td style="padding:14px 16px;">
            <p style="margin:0;font-size:11px;font-weight:bold;letter-spacing:0.16em;text-transform:uppercase;color:${recColor};">Today's call</p>
            <p style="margin:6px 0 4px 0;font-size:16px;font-weight:bold;color:#1C1C1E;">${rec.title}</p>
            <p style="margin:0;font-size:13px;line-height:1.5;color:#404040;">${rec.body}</p>
          </td></tr>
        </table>
      </td></tr>

      <!-- Yesterday's Movement -->
      <tr><td style="padding:24px 28px 8px 28px;">
        <p style="margin:0 0 12px 0;font-size:11px;font-weight:bold;letter-spacing:0.22em;text-transform:uppercase;color:#7E7468;">Last 24 hours</p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          ${movementRows
            .map(
              (r) => `
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #F0EDE5;font-size:14px;color:#404040;">
              <span style="display:inline-block;width:24px;">${r.icon}</span>${r.label}
            </td>
            <td align="right" style="padding:8px 0;border-bottom:1px solid #F0EDE5;font-size:18px;font-weight:bold;color:#1C1C1E;font-variant-numeric:tabular-nums;">${r.value.toLocaleString()}</td>
          </tr>`
            )
            .join("")}
        </table>
      </td></tr>

      <!-- Pipeline Snapshot -->
      <tr><td style="padding:24px 28px 8px 28px;">
        <p style="margin:0 0 12px 0;font-size:11px;font-weight:bold;letter-spacing:0.22em;text-transform:uppercase;color:#7E7468;">Pipeline snapshot</p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          ${snapshotRows
            .map(
              (r) => `
          <tr>
            <td style="padding:6px 0;font-size:13px;color:#5A5448;">${r.label}</td>
            <td align="right" style="padding:6px 0;font-size:14px;font-weight:bold;color:#1C1C1E;font-variant-numeric:tabular-nums;">${r.value.toLocaleString()}</td>
          </tr>`
            )
            .join("")}
        </table>
      </td></tr>

      ${
        report.recentFailures.length
          ? `
      <tr><td style="padding:20px 28px 0 28px;">
        <p style="margin:0 0 12px 0;font-size:11px;font-weight:bold;letter-spacing:0.22em;text-transform:uppercase;color:#B94A48;">Failures (last 24h)</p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#FBE7E6;border-left:3px solid #B94A48;border-radius:4px;">
          ${report.recentFailures
            .map(
              (f) => `
          <tr><td style="padding:8px 12px;font-size:12px;color:#1C1C1E;border-bottom:1px solid rgba(185,74,72,0.15);">
            <strong>${f.agent}</strong> · ${fmtShort(f.when)}<br>
            <span style="color:#7A2A28;font-family:Menlo,Consolas,monospace;font-size:11px;">${f.error}</span>
          </td></tr>`
            )
            .join("")}
        </table>
      </td></tr>`
          : ""
      }

      ${
        report.topActivity.length
          ? `
      <tr><td style="padding:24px 28px 8px 28px;">
        <p style="margin:0 0 12px 0;font-size:11px;font-weight:bold;letter-spacing:0.22em;text-transform:uppercase;color:#7E7468;">Recent activity feed</p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          ${report.topActivity
            .map(
              (a) => `
          <tr>
            <td style="padding:6px 0;font-size:12px;color:#404040;border-bottom:1px solid #F0EDE5;">
              <span style="color:#7E7468;font-variant-numeric:tabular-nums;">${fmtShort(a.when)}</span>
              &nbsp;·&nbsp; <strong style="color:#1C1C1E;">${a.type.replace(/_/g, " ")}</strong>${a.channel ? ` via ${a.channel}` : ""}
            </td>
          </tr>`
            )
            .join("")}
        </table>
      </td></tr>`
          : ""
      }

      <!-- Footer -->
      <tr><td style="padding:24px 28px;background:#FAF9F6;border-top:1px solid #E8E4DC;">
        <p style="margin:0 0 4px 0;font-size:11px;color:#7E7468;line-height:1.5;">
          Dashboard: <a href="https://econstructhomes.com/crm/dashboard" style="color:#B8963E;text-decoration:none;">econstructhomes.com/crm/dashboard</a>
        </p>
        <p style="margin:0;font-size:11px;color:#7E7468;line-height:1.5;">
          Generated automatically by the econstruct CRM. Replies to this address are not monitored.
        </p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

export async function sendDailyReport(recipients: string[]) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY not set");
  if (!recipients.length) throw new Error("No recipients provided");

  const report = await buildDailyReport();
  const html = renderDailyReportHtml(report);
  const subjectDate = new Date(report.date + "T12:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.DAILY_REPORT_FROM || "econstruct CRM <onboarding@resend.dev>",
      to: recipients,
      subject: `econstruct CRM — Daily Report — ${subjectDate}`,
      html,
    }),
  });

  const body = await res.json();
  if (!res.ok) {
    throw new Error(`Resend ${res.status}: ${JSON.stringify(body).slice(0, 200)}`);
  }
  return { report, response: body };
}
