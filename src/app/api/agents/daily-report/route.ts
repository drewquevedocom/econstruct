import { runAgent, validateCronSecret } from "@/lib/agents/runner";
import { sendDailyReport } from "@/lib/reports/daily-report";
import { createServiceClient } from "@/lib/supabase/server";

export const maxDuration = 60;

// Hard defaults — used if env vars are unset. Keeps Frank + Drew on TO no matter what.
const DEFAULT_TO = ["frank@econstructinc.com", "drewquevedo@gmail.com"];
const DEFAULT_CC = ["katie@econstructinc.com", "marketing@econstructinc.com"];

const PT_TZ_OFFSET_HOURS = 7;

function parseList(raw: string | undefined, fallback: string[]): string[] {
  if (!raw) return fallback;
  const list = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return list.length ? list : fallback;
}

function ymdInPT(date: Date) {
  const adjusted = new Date(date.getTime() - PT_TZ_OFFSET_HOURS * 3600 * 1000);
  return adjusted.toISOString().slice(0, 10);
}

// Idempotency guard: prevents duplicate Frank/Drew emails when the workflow gets
// triggered more than once in a day (manual "Run workflow" clicks, retries, etc.)
async function findTodaysSuccessfulRun(): Promise<{ id: string; started_at: string } | null> {
  const supabase = createServiceClient();
  const todayPT = ymdInPT(new Date());
  const startOfTodayPT = `${todayPT}T07:00:00.000Z`; // PT midnight ≈ 07:00 UTC (PDT)
  const { data } = await supabase
    .from("agent_runs")
    .select("id, started_at")
    .eq("agent_name", "daily-report")
    .eq("status", "success")
    .gte("started_at", startOfTodayPT)
    .order("started_at", { ascending: false })
    .limit(1);
  return (data?.[0] as { id: string; started_at: string } | undefined) ?? null;
}

export async function POST(req: Request) {
  if (!validateCronSecret(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(req.url);
  const force = url.searchParams.get("force") === "true";

  // Weekend guard: Frank's CRM update runs Mon-Fri PT only.
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "short",
  }).format(new Date());
  if (!force && (weekday === "Sat" || weekday === "Sun")) {
    return Response.json({
      skipped: true,
      reason: "Weekend guard active — Frank's CRM update runs Mon-Fri only.",
    });
  }

  // Idempotency guard: never send a second daily-report on the same PT day.
  // Without this, every manual workflow re-run or retry emails Frank again.
  if (!force) {
    const alreadySent = await findTodaysSuccessfulRun();
    if (alreadySent) {
      return Response.json({
        skipped: true,
        reason: "daily-report already sent successfully today",
        existing_run_id: alreadySent.id,
        existing_started_at: alreadySent.started_at,
        hint: "pass ?force=true to override and resend",
      });
    }
  }

  const result = await runAgent("daily-report", async () => {
    const to = parseList(process.env.DAILY_REPORT_TO, DEFAULT_TO);
    const cc = parseList(process.env.DAILY_REPORT_CC, DEFAULT_CC);
    const { report, response } = await sendDailyReport(to, cc);
    return {
      records_pulled: report.pipeline.queueDepth ?? 0,
      records_updated: 1,
      metadata: {
        to,
        cc,
        resend_id: response?.id ?? null,
        date: report.date,
        status: report.status,
        headline: report.headline,
        issues: report.issues,
        yesterday: report.yesterday,
        last7Days: report.last7Days,
        pipeline: report.pipeline,
        sendingAutoPaused: report.sendingAutoPaused,
        pausedCampaigns: report.pausedCampaigns,
        forced: force,
      },
    };
  });

  return Response.json(result);
}
