import { runAgent, validateCronSecret } from "@/lib/agents/runner";
import { sendDailyReport } from "@/lib/reports/daily-report";

export const maxDuration = 60;

const DEFAULT_RECIPIENTS = ["frank@econstructinc.com", "marketing@econstructinc.com"];

function recipientsFromEnv(): string[] {
  const raw =
    process.env.DAILY_REPORT_RECIPIENTS ||
    process.env.HOT_LEAD_NOTIFY_EMAILS ||
    DEFAULT_RECIPIENTS.join(",");
  const list = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return list.length ? list : DEFAULT_RECIPIENTS;
}

export async function POST(req: Request) {
  if (!validateCronSecret(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const result = await runAgent("daily-report", async () => {
    const recipients = recipientsFromEnv();
    const { report, response } = await sendDailyReport(recipients);
    return {
      records_pulled: report.snapshot.totalLeads,
      records_updated: 1,
      metadata: {
        recipients,
        resend_id: response?.id ?? null,
        date: report.date,
        yesterday: report.yesterday,
        snapshot: report.snapshot,
      },
    };
  });

  return Response.json(result);
}
