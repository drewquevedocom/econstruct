import { createServiceClient } from "@/lib/supabase/server";

// ── Phase 0 rewrite ──────────────────────────────────────────────────────
// The bug this replaces: the old report counted contacts added to the
// enrollment queue as "emails sent" (Frank was told hundreds/day when the
// true number was ~12/day). Every number below comes from a real source of
// truth — Instantly's send/bounce/reply events, or a live count of what's
// actually eligible to send right now — never from queue/enrollment tables.
// A metric that can't be read from its source prints "unavailable", never 0.

const INSTANTLY_API = "https://api.instantly.ai/api/v2";
const NEW_BUILD_MIN_SCORE = Number(process.env.NEW_BUILD_MIN_SCORE ?? 40);
// All 3 sending mailboxes are Google Workspace on these domains (confirmed
// in the 2026-07-30 audit) — DKIM lives under the "google" selector for all of them.
const SENDING_DOMAINS = ["econstructllc.com", "econstructrebuild.com", "econstructtinyhomes.com"];
const DKIM_SELECTOR = "google";
const BOUNCE_RATE_ALERT_PCT = 3;
const VERIFICATION_CREDITS_LOW = 100;
const PT_TZ_OFFSET_HOURS = 7; // PT is UTC-7 (PDT). Same approximation the rest of the CRM uses.

/** A metric read from its source of truth, or null if that source couldn't
 * be reached. Renderers must print "unavailable" for null — never coerce to 0. */
type Metric = number | null;

export type DailyReportData = {
  /** The PT calendar day being reported — the most recently completed full
   * day as of send time (report goes out ~5pm PT, so "yesterday" is stable,
   * complete data; "today so far" would under-count and skew the bounce rate). */
  date: string;
  status: "GREEN" | "YELLOW" | "RED";
  headline: string;
  issues: Array<{ severity: "RED" | "YELLOW"; message: string }>;
  yesterday: {
    emailsSent: Metric;
    realReplies: Metric;
    oooFiltered: Metric;
    bounced: Metric;
  };
  last7Days: {
    emailsSent: Metric;
    realReplies: Metric;
    bounceRatePct: Metric;
  };
  pipeline: {
    queueDepth: Metric;
    newLeadsSourced7d: Metric;
  };
  sendingAutoPaused: boolean;
  pausedCampaigns: string[];
};

function ymdInPT(date: Date) {
  const adjusted = new Date(date.getTime() - PT_TZ_OFFSET_HOURS * 3600 * 1000);
  return adjusted.toISOString().slice(0, 10);
}

/** Adds `days` (can be negative) to a YYYY-MM-DD string. Operates on the
 * date at noon UTC so DST/month/year boundaries never shift the result. */
function addDaysYmd(ymd: string, days: number): string {
  const d = new Date(`${ymd}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** [start, end) UTC ISO bounds for one PT calendar day, for Supabase created_at filters. */
function ptDayBoundsUtc(ymd: string): { startIso: string; endIso: string } {
  const start = new Date(`${ymd}T00:00:00.000Z`);
  start.setUTCHours(start.getUTCHours() + PT_TZ_OFFSET_HOURS);
  return { startIso: start.toISOString(), endIso: new Date(start.getTime() + 24 * 3600 * 1000).toISOString() };
}

// ── Instantly: campaign send/bounce/status, scoped to a real date range ───
// /campaigns/analytics/overview totals emails_sent_count / bounced_count
// WITHIN [start_date, end_date] per campaign — unlike enrollment counts,
// these are actual delivery events Instantly recorded.
type InstantlyOverviewRow = {
  campaign_id?: string;
  campaign_name?: string;
  campaign_status?: number;
  emails_sent_count?: number;
  bounced_count?: number;
};

async function fetchInstantlyOverview(
  startDate: string,
  endDate: string
): Promise<{ ok: boolean; rows: InstantlyOverviewRow[] }> {
  const apiKey = process.env.INSTANTLY_API_KEY;
  if (!apiKey) return { ok: false, rows: [] };
  try {
    const res = await fetch(
      `${INSTANTLY_API}/campaigns/analytics/overview?start_date=${startDate}&end_date=${endDate}`,
      { headers: { Authorization: `Bearer ${apiKey}` }, signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) return { ok: false, rows: [] };
    const data = await res.json();
    return { ok: true, rows: Array.isArray(data) ? data : [] };
  } catch {
    return { ok: false, rows: [] };
  }
}

function sumSent(rows: InstantlyOverviewRow[]) {
  return rows.reduce((n, r) => n + (r.emails_sent_count ?? 0), 0);
}
function sumBounced(rows: InstantlyOverviewRow[]) {
  return rows.reduce((n, r) => n + (r.bounced_count ?? 0), 0);
}

// Campaign statuses that mean "someone turned this off" — excludes 3
// (Completed), which just means it ran out of leads (that's the empty-queue
// condition, not an on/off problem) and 1/4 (Active/RunningSubsequences).
const OFF_STATUSES = new Set([0, 2, -1, -2, -99]);
function statusLabel(status: number): string {
  switch (status) {
    case 0: return "Draft";
    case 2: return "Paused";
    case -1: return "flagged unhealthy";
    case -2: return "in bounce protect";
    case -99: return "suspended";
    default: return `status ${status}`;
  }
}

async function pauseCampaign(id: string): Promise<boolean> {
  const apiKey = process.env.INSTANTLY_API_KEY;
  if (!apiKey) return false;
  try {
    const res = await fetch(`${INSTANTLY_API}/campaigns/${id}/pause`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: "{}",
      signal: AbortSignal.timeout(8000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ── Verification credit balance ────────────────────────────────────────
// Instantly has no standalone "credits remaining" endpoint — the balance
// only comes back on the response of an actual verification call. Pinging
// Instantly just to read it would spend a real credit every single report
// (~365/year on monitoring alone), so instead we read the balance that
// partner-enroll already captured from its last real verification call
// today and stashed in agent_runs.metadata. If partner-enroll didn't run
// (or verified nothing) within the reported day, this is unavailable —
// never assumed or cached from an older day.
async function fetchVerificationCredits(
  supabase: ReturnType<typeof createServiceClient>,
  dayBounds: { startIso: string; endIso: string }
): Promise<Metric> {
  const { data, error } = await supabase
    .from("agent_runs")
    .select("metadata")
    .eq("agent_name", "partner-enroll")
    .eq("status", "success")
    .gte("started_at", dayBounds.startIso)
    .lt("started_at", dayBounds.endIso)
    .order("started_at", { ascending: false });
  if (error || !data) return null;

  for (const run of data) {
    const value = (run.metadata as Record<string, unknown> | null)?.verification_credits_remaining;
    if (typeof value === "number") return value;
  }
  return null;
}

// ── Verification halt — Phase 1 fail-closed check ──────────────────────
// partner-enroll now refuses to enroll anyone when verification is down for
// a whole batch and marks its own run "failed" with reason
// "verification_unavailable" (see AgentHaltError in lib/agents/runner.ts).
// That's a specific, known cause for zero partner sends — worth naming
// directly instead of letting it fall through to the generic "something is
// broken" message.
async function checkVerificationHalted(
  supabase: ReturnType<typeof createServiceClient>,
  dayBounds: { startIso: string; endIso: string }
): Promise<boolean> {
  const { data, error } = await supabase
    .from("agent_runs")
    .select("metadata")
    .eq("agent_name", "partner-enroll")
    .eq("status", "failed")
    .gte("started_at", dayBounds.startIso)
    .lt("started_at", dayBounds.endIso);
  if (error || !data) return false;
  return data.some(
    (run) => (run.metadata as Record<string, unknown> | null)?.reason === "verification_unavailable"
  );
}

// ── DNS auth check (SPF / DKIM / DMARC) via DNS-over-HTTPS ────────────────
// Instantly's API has no live "is this domain's DNS configured right now"
// field — the only real source of truth is the DNS itself, so we query it
// directly, the same way the 2026-07-30 audit did by hand.
type DnsCheckResult = { domain: string; missing: string[]; checkFailed: boolean };

async function lookupTxt(name: string): Promise<{ ok: boolean; records: string[] }> {
  try {
    const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(name)}&type=TXT`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return { ok: false, records: [] };
    const data = (await res.json()) as { Status?: number; Answer?: Array<{ data?: string }> };
    // Status 0 = NOERROR, 3 = NXDOMAIN — both are real, successful answers
    // (NXDOMAIN just means the record genuinely doesn't exist). Anything
    // else (e.g. 2 = SERVFAIL) is a lookup failure, not a missing record.
    if (data.Status !== 0 && data.Status !== 3) return { ok: false, records: [] };
    const records = (data.Answer ?? []).map((a) => (a.data ?? "").replace(/"/g, ""));
    return { ok: true, records };
  } catch {
    return { ok: false, records: [] };
  }
}

async function checkDomainAuth(domain: string): Promise<DnsCheckResult> {
  const [spf, dkim, dmarc] = await Promise.all([
    lookupTxt(domain),
    lookupTxt(`${DKIM_SELECTOR}._domainkey.${domain}`),
    lookupTxt(`_dmarc.${domain}`),
  ]);
  if (!spf.ok || !dkim.ok || !dmarc.ok) return { domain, missing: [], checkFailed: true };

  const missing: string[] = [];
  if (!spf.records.some((r) => r.startsWith("v=spf1"))) missing.push("SPF");
  if (!dkim.records.some((r) => r.includes("v=DKIM1"))) missing.push("DKIM");
  if (!dmarc.records.some((r) => r.startsWith("v=DMARC1"))) missing.push("DMARC");
  return { domain, missing, checkFailed: false };
}

// ── Build ───────────────────────────────────────────────────────────────
export async function buildDailyReport(): Promise<DailyReportData> {
  const supabase = createServiceClient();
  const now = new Date();
  const todayPT = ymdInPT(now);
  // Report goes out ~5pm PT (end of business); "yesterday" is the most
  // recently *completed* PT day, so every number below is a full, stable
  // 24h window instead of a partial "today so far" that would under-count.
  const reportDay = addDaysYmd(todayPT, -1);
  const sevenDayStart = addDaysYmd(reportDay, -6);
  const todayBounds = ptDayBoundsUtc(reportDay);
  const sevenDayStartBounds = ptDayBoundsUtc(sevenDayStart);

  const [
    overviewToday,
    overview7d,
    repliesTodayRes,
    oooTodayRes,
    replies7dRes,
    verificationCredits,
    verificationHalted,
    dnsResults,
    partnersEligibleRes,
    newBuildEligibleRes,
    newPartnerLeads7dRes,
    newBuildLeads7dRes,
  ] = await Promise.all([
    fetchInstantlyOverview(reportDay, reportDay),
    fetchInstantlyOverview(sevenDayStart, reportDay),
    supabase
      .from("lead_events")
      .select("id", { count: "exact", head: true })
      .eq("event_type", "reply_received")
      .gte("created_at", todayBounds.startIso)
      .lt("created_at", todayBounds.endIso),
    supabase
      .from("lead_events")
      .select("id", { count: "exact", head: true })
      .eq("event_type", "auto_reply_received")
      .gte("created_at", todayBounds.startIso)
      .lt("created_at", todayBounds.endIso),
    supabase
      .from("lead_events")
      .select("id", { count: "exact", head: true })
      .eq("event_type", "reply_received")
      .gte("created_at", sevenDayStartBounds.startIso)
      .lt("created_at", todayBounds.endIso),
    fetchVerificationCredits(supabase, todayBounds),
    checkVerificationHalted(supabase, todayBounds),
    Promise.all(SENDING_DOMAINS.map(checkDomainAuth)),
    // queue_depth: leads actually eligible to enroll right now — the exact
    // WHERE clause partner-enroll/campaign-enroll use to pull their batch,
    // not a count of everything ever loaded into the table.
    supabase
      .from("partner_leads")
      .select("id", { count: "exact", head: true })
      .eq("status", "New Lead")
      .not("contact_email", "is", null),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .gte("lead_score", NEW_BUILD_MIN_SCORE)
      .eq("lifecycle_stage", "new")
      .eq("outreach_status", "approved")
      .not("email", "is", null)
      .is("fire_damage_status", null)
      .or("dnc.is.null,dnc.eq.false"),
    supabase
      .from("partner_leads")
      .select("id", { count: "exact", head: true })
      .gte("created_at", sevenDayStartBounds.startIso)
      .lt("created_at", todayBounds.endIso),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .gte("created_at", sevenDayStartBounds.startIso)
      .lt("created_at", todayBounds.endIso),
  ]);

  const emailsSentToday: Metric = overviewToday.ok ? sumSent(overviewToday.rows) : null;
  const bouncedToday: Metric = overviewToday.ok ? sumBounced(overviewToday.rows) : null;
  const emailsSent7d: Metric = overview7d.ok ? sumSent(overview7d.rows) : null;
  const bounced7d: Metric = overview7d.ok ? sumBounced(overview7d.rows) : null;
  const bounceRatePct7d: Metric =
    emailsSent7d === null || bounced7d === null
      ? null
      : emailsSent7d === 0
        ? 0
        : (bounced7d / emailsSent7d) * 100;

  const realRepliesToday: Metric = repliesTodayRes.error ? null : (repliesTodayRes.count ?? 0);
  const oooFilteredToday: Metric = oooTodayRes.error ? null : (oooTodayRes.count ?? 0);
  const realReplies7d: Metric = replies7dRes.error ? null : (replies7dRes.count ?? 0);

  const queueDepth: Metric =
    partnersEligibleRes.error || newBuildEligibleRes.error
      ? null
      : (partnersEligibleRes.count ?? 0) + (newBuildEligibleRes.count ?? 0);
  const newLeadsSourced7d: Metric =
    newPartnerLeads7dRes.error || newBuildLeads7dRes.error
      ? null
      : (newPartnerLeads7dRes.count ?? 0) + (newBuildLeads7dRes.count ?? 0);

  // Campaign status, for "a campaign is turned off" — prefer today's rows,
  // fall back to the 7d call if today's fetch failed.
  const statusRows = overviewToday.ok ? overviewToday.rows : overview7d.rows;
  const offCampaigns = statusRows.filter(
    (r) => typeof r.campaign_status === "number" && OFF_STATUSES.has(r.campaign_status)
  );

  const dnsFailures = dnsResults.filter((d) => d.checkFailed);
  const dnsMissing = dnsResults.filter((d) => !d.checkFailed && d.missing.length > 0);

  // ── Auto-pause: RED condition 3 (bounce rate) must actually stop sending,
  // not just warn. Pause every campaign currently Active/RunningSubsequences.
  // Idempotent — pausing an already-paused campaign is a harmless no-op.
  //
  // Deliberately no auto-resume: a paused campaign stops sending, which
  // stops it from bouncing further, which pulls the 7d rate back under 3%
  // as the old high-bounce days roll out of the window — even if the root
  // cause (e.g. verification credits still exhausted) was never fixed.
  // Auto-resuming on that signal would just re-trigger the same spike.
  // Resuming is a human call; the RED message below states the fix and
  // names every campaign still sitting paused, every day, until someone
  // actually resumes it in Instantly.
  const alreadyPaused = statusRows
    .filter((r) => r.campaign_status === 2)
    .map((r) => r.campaign_name ?? r.campaign_id ?? "unknown");
  const pausedCampaigns: string[] = [];
  if (bounceRatePct7d !== null && bounceRatePct7d > BOUNCE_RATE_ALERT_PCT) {
    const toPause = statusRows.filter((r) => r.campaign_status === 1 || r.campaign_status === 4);
    const results = await Promise.all(
      toPause.map(async (c) => ({ name: c.campaign_name ?? c.campaign_id ?? "unknown", ok: c.campaign_id ? await pauseCampaign(c.campaign_id) : false }))
    );
    for (const r of results) if (r.ok) pausedCampaigns.push(r.name);
  }
  // Currently-paused-for-bounce, whether from this run or a prior day —
  // used for both the report's field and the persistent RED message.
  const pausedForBounce = Array.from(new Set([...alreadyPaused, ...pausedCampaigns]));
  const sendingAutoPaused = pausedForBounce.length > 0;

  // ── Health checks, evaluated in priority order. Condition 4 (spam
  // complaint rate) is not implemented — Instantly's API exposes no spam
  // complaint data for any account type. Faking a pass/fail here would be
  // exactly the "print a number that means broken" bug this rewrite exists
  // to kill, so it's omitted rather than guessed. See chat notes.
  const issues: Array<{ severity: "RED" | "YELLOW"; message: string }> = [];

  if (queueDepth === 0) {
    issues.push({ severity: "RED", message: "No one left to email. Need new contacts." });
  } else if (queueDepth === null) {
    issues.push({
      severity: "YELLOW",
      message: "We couldn't check how many people are left to email.",
    });
  }
  if (verificationHalted) {
    // Specific and takes priority over the generic "something is broken"
    // below — partner-enroll refused to send because it couldn't confirm
    // addresses were real, exactly as designed.
    issues.push({
      severity: "RED",
      message: "We couldn't check if partner addresses were safe to email, so none went out. Fix the address checker.",
    });
  }
  if (queueDepth !== null && queueDepth > 0) {
    if (emailsSentToday === 0 && !verificationHalted) {
      issues.push({ severity: "RED", message: "Nothing went out today — something is broken." });
    } else if (emailsSentToday === null) {
      issues.push({
        severity: "YELLOW",
        message: "We couldn't check today's send count — the email platform didn't respond.",
      });
    }
  }
  if (bounceRatePct7d !== null && bounceRatePct7d > BOUNCE_RATE_ALERT_PCT) {
    issues.push({
      severity: "RED",
      message: `Too many bad addresses (${bounceRatePct7d.toFixed(1)}% over the last 7 days, healthy is under 3%). Sending paused for: ${pausedForBounce.length ? pausedForBounce.join(", ") : "—"}. Fix the verification credits, then turn sending back on in Instantly — it won't resume on its own.`,
    });
  } else if (pausedForBounce.length > 0) {
    // The 7-day rate can drop back under 3% simply because these campaigns
    // stopped sending — not because the root cause was actually fixed. Keep
    // this RED every day so a stale pause can't quietly read as GREEN.
    issues.push({
      severity: "RED",
      message: `Sending is still paused from an earlier bounce problem: ${pausedForBounce.join(", ")}. If the verification credits are fixed, turn sending back on for these in Instantly.`,
    });
  } else if (bounceRatePct7d === null) {
    issues.push({
      severity: "YELLOW",
      message: "We couldn't check the bounce rate — the email platform didn't respond.",
    });
  }
  if (verificationCredits !== null && verificationCredits < VERIFICATION_CREDITS_LOW) {
    issues.push({ severity: "YELLOW", message: "Address checker running low." });
  } else if (verificationCredits === null) {
    issues.push({ severity: "YELLOW", message: "We couldn't check how many address-checks we have left." });
  }
  if (offCampaigns.length > 0) {
    const names = offCampaigns.map((c) => `${c.campaign_name ?? "a campaign"} is ${statusLabel(c.campaign_status!)}`);
    issues.push({ severity: "YELLOW", message: `A campaign is turned off. (${names.join("; ")})` });
  }
  if (dnsMissing.length > 0) {
    const names = dnsMissing.map((d) => `${d.domain} is missing ${d.missing.join("/")}`);
    issues.push({
      severity: "RED",
      message: `One of our email addresses isn't set up right. (${names.join("; ")})`,
    });
  }
  if (dnsFailures.length > 0) {
    issues.push({
      severity: "YELLOW",
      message: "We couldn't check one of our email address setups right now.",
    });
  }

  const hasRed = issues.some((i) => i.severity === "RED");
  const hasYellow = issues.some((i) => i.severity === "YELLOW");
  const status: DailyReportData["status"] = hasRed ? "RED" : hasYellow ? "YELLOW" : "GREEN";
  const headline =
    issues.find((i) => i.severity === "RED")?.message ??
    issues.find((i) => i.severity === "YELLOW")?.message ??
    "Everything running normally.";

  return {
    date: reportDay,
    status,
    headline,
    issues,
    yesterday: {
      emailsSent: emailsSentToday,
      realReplies: realRepliesToday,
      oooFiltered: oooFilteredToday,
      bounced: bouncedToday,
    },
    last7Days: {
      emailsSent: emailsSent7d,
      realReplies: realReplies7d,
      bounceRatePct: bounceRatePct7d,
    },
    pipeline: {
      queueDepth,
      newLeadsSourced7d,
    },
    sendingAutoPaused,
    pausedCampaigns: pausedForBounce,
  };
}

// ── Render ──────────────────────────────────────────────────────────────
function fmt(v: Metric): string {
  return v === null ? "unavailable" : v.toLocaleString();
}
function fmtPct(v: Metric): string {
  return v === null ? "unavailable" : `${v.toFixed(1)}%`;
}
function fmtDate(ymd: string) {
  return new Date(`${ymd}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/** "1 real reply (5 auto-replies filtered out)" / "unavailable" — shared by
 * both renderers so the wording can't drift between the email's HTML and
 * text parts. */
function realRepliesLine(report: DailyReportData): string {
  const n = report.yesterday.realReplies;
  if (n === null) return "unavailable";
  const ooo = report.yesterday.oooFiltered;
  const base = `${n} real ${n === 1 ? "reply" : "replies"}`;
  const suffix = ooo && ooo > 0 ? ` (${ooo} auto-${ooo === 1 ? "reply" : "replies"} filtered out)` : "";
  return `${base}${suffix}`;
}

/** Plain-text rendering — this is the literal source of truth for the report's
 * wording; the HTML version mirrors it, not the other way around. */
export function renderDailyReportText(report: DailyReportData): string {
  const lines: string[] = [];
  lines.push(`econstruct Daily Report — ${fmtDate(report.date)}`);
  lines.push("");
  lines.push(`STATUS: ${report.status} — ${report.headline}`);
  lines.push("");
  lines.push("YESTERDAY");
  lines.push(`Emails sent: ${fmt(report.yesterday.emailsSent)}`);
  lines.push(`Real replies: ${realRepliesLine(report)}`);
  lines.push(`Bounced: ${fmt(report.yesterday.bounced)}`);
  lines.push("");
  lines.push("LAST 7 DAYS");
  lines.push(`Emails sent: ${fmt(report.last7Days.emailsSent)}`);
  lines.push(`Real replies: ${fmt(report.last7Days.realReplies)}`);
  lines.push(`Bounce rate: ${fmtPct(report.last7Days.bounceRatePct)} (healthy is under 3%)`);
  lines.push("");
  lines.push("PIPELINE");
  lines.push(`People left to email: ${fmt(report.pipeline.queueDepth)}`);
  lines.push(`New contacts added this week: ${fmt(report.pipeline.newLeadsSourced7d)}`);

  if (report.status !== "GREEN" && report.issues.length) {
    lines.push("");
    lines.push("NEEDS ATTENTION");
    for (const issue of report.issues) lines.push(`- ${issue.message}`);
  }

  return lines.join("\n");
}

function statusColor(status: DailyReportData["status"]) {
  return status === "GREEN" ? "#0E7C5C" : status === "YELLOW" ? "#B8963E" : "#B94A48";
}
function statusBg(status: DailyReportData["status"]) {
  return status === "GREEN" ? "#E6F5EF" : status === "YELLOW" ? "#FAF1D5" : "#FBE7E6";
}

export function renderDailyReportHtml(report: DailyReportData): string {
  const color = statusColor(report.status);
  const bg = statusBg(report.status);

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:6px 0;font-size:14px;color:#404040;">${label}</td>
      <td align="right" style="padding:6px 0;font-size:15px;font-weight:bold;color:#1a1a1a;font-variant-numeric:tabular-nums;">${value}</td>
    </tr>`;

  const section = (title: string, rows: string) => `
    <tr><td style="padding:20px 28px 4px 28px;">
      <p style="margin:0 0 10px 0;font-size:12px;font-weight:900;letter-spacing:0.16em;text-transform:uppercase;color:#1a1a1a;">${title}</p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">${rows}</table>
    </td></tr>`;

  const needsAttention =
    report.status !== "GREEN" && report.issues.length
      ? `
      <tr><td style="padding:20px 28px 4px 28px;">
        <p style="margin:0 0 10px 0;font-size:12px;font-weight:900;letter-spacing:0.16em;text-transform:uppercase;color:#1a1a1a;">Needs Attention</p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${bg};border-left:4px solid ${color};border-radius:6px;">
          ${report.issues
            .map(
              (issue) => `
          <tr><td style="padding:10px 14px;font-size:13px;line-height:1.5;color:#1a1a1a;">${issue.message}</td></tr>`
            )
            .join("")}
        </table>
      </td></tr>`
      : "";

  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>econstruct Daily Report</title></head>
<body style="margin:0;padding:0;background:#F8F6F2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1a1a1a;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#F8F6F2;padding:24px 0;">
  <tr><td align="center">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="max-width:560px;background:#ffffff;border:1px solid #E8E4DC;border-radius:12px;overflow:hidden;">

      <tr>
        <td style="background:#1C1C1E;padding:22px 28px;">
          <p style="margin:0;font-size:11px;font-weight:bold;letter-spacing:0.22em;text-transform:uppercase;color:#D4B96A;">econstruct Daily Report</p>
          <h1 style="margin:6px 0 0 0;font-size:19px;font-weight:900;color:#FFF8E7;line-height:1.2;">${fmtDate(report.date)}</h1>
        </td>
      </tr>

      <tr><td style="padding:20px 28px 4px 28px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${bg};border-left:4px solid ${color};border-radius:6px;">
          <tr><td style="padding:14px 16px;">
            <p style="margin:0;font-size:11px;font-weight:900;letter-spacing:0.16em;text-transform:uppercase;color:${color};">STATUS: ${report.status}</p>
            <p style="margin:6px 0 0 0;font-size:15px;font-weight:bold;color:#1a1a1a;">${report.headline}</p>
          </td></tr>
        </table>
      </td></tr>

      ${section(
        "Yesterday",
        row("Emails sent", fmt(report.yesterday.emailsSent)) +
          row("Real replies", realRepliesLine(report)) +
          row("Bounced", fmt(report.yesterday.bounced))
      )}

      ${section(
        "Last 7 Days",
        row("Emails sent", fmt(report.last7Days.emailsSent)) +
          row("Real replies", fmt(report.last7Days.realReplies)) +
          row("Bounce rate", `${fmtPct(report.last7Days.bounceRatePct)} (healthy is under 3%)`)
      )}

      ${section(
        "Pipeline",
        row("People left to email", fmt(report.pipeline.queueDepth)) +
          row("New contacts added this week", fmt(report.pipeline.newLeadsSourced7d))
      )}

      ${needsAttention}

      <tr><td style="padding:22px 28px;background:#FAF9F6;border-top:1px solid #E8E4DC;">
        <p style="margin:0;font-size:11px;color:#7E7468;line-height:1.5;">
          Dashboard: <a href="https://econstructhomes.com/crm/dashboard" style="color:#B8963E;text-decoration:none;">econstructhomes.com/crm/dashboard</a>
          &nbsp;·&nbsp; Replies to this address are not monitored.
        </p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

export async function sendDailyReport(toRecipients: string[], ccRecipients: string[] = []) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY not set");
  if (!toRecipients.length) throw new Error("No TO recipients provided");

  const report = await buildDailyReport();
  const html = renderDailyReportHtml(report);
  const text = renderDailyReportText(report);
  const subjectDate = new Date(`${report.date}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const payload: Record<string, unknown> = {
    from: process.env.DAILY_REPORT_FROM || "econstruct Reports <reports@econstructhomes.com>",
    to: toRecipients,
    subject: `econstruct Daily Report — ${report.status} — ${subjectDate}`,
    html,
    text,
  };
  if (ccRecipients.length) payload.cc = ccRecipients;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const body = await res.json();
  if (!res.ok) {
    throw new Error(`Resend ${res.status}: ${JSON.stringify(body).slice(0, 200)}`);
  }
  return { report, response: body };
}
