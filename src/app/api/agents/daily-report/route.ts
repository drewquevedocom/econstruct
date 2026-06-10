import { runAgent, validateCronSecret } from "@/lib/agents/runner";
import { sendDailyReport } from "@/lib/reports/daily-report";

export const maxDuration = 60;

// Hard defaults — used if env vars are unset. Keeps Frank + Drew on TO no matter what.
const DEFAULT_TO = ["frank@econstructinc.com", "drewquevedo@gmail.com"];
const DEFAULT_CC = ["katie@econstructinc.com", "marketing@econstructinc.com"];

function parseList(raw: string | undefined, fallback: string[]): string[] {
  if (!raw) return fallback;
  const list = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return list.length ? list : fallback;
}

export async function POST(req: Request) {
  if (!validateCronSecret(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "short",
  }).format(new Date());
  if (weekday === "Sat" || weekday === "Sun") {
    return Response.json({
      skipped: true,
      reason: "Weekend guard active — Frank's CRM update runs Mon-Fri only.",
    });
  }

  const result = await runAgent("daily-report", async () => {
    const to = parseList(process.env.DAILY_REPORT_TO, DEFAULT_TO);
    const cc = parseList(process.env.DAILY_REPORT_CC, DEFAULT_CC);
    const { report, response } = await sendDailyReport(to, cc);
    return {
      records_pulled: report.snapshot.totalLeads,
      records_updated: 1,
      metadata: {
        to,
        cc,
        resend_id: response?.id ?? null,
        date: report.date,
        yesterday: report.yesterday,
        snapshot: report.snapshot,
      },
    };
  });

  return Response.json(result);
}
