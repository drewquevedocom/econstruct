import { createServiceClient } from "@/lib/supabase/server";

export interface AgentResult {
  records_pulled?: number;
  records_created?: number;
  records_updated?: number;
  errors?: string[];
  metadata?: Record<string, unknown>;
}

export interface AgentContext {
  runId: string;
  agentName: string;
}

async function createAgentRun(agentName: string): Promise<string> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("agent_runs")
    .insert({ agent_name: agentName, status: "running" })
    .select("id")
    .single();
  if (error) throw new Error(`Failed to create agent run: ${error.message}`);
  return data.id;
}

async function completeAgentRun(
  runId: string,
  result: { status: string; duration_ms: number } & AgentResult
) {
  const supabase = createServiceClient();
  await supabase
    .from("agent_runs")
    .update({
      status: result.status,
      ended_at: new Date().toISOString(),
      duration_ms: result.duration_ms,
      records_pulled: result.records_pulled ?? 0,
      records_created: result.records_created ?? 0,
      records_updated: result.records_updated ?? 0,
      errors: result.errors ?? [],
    })
    .eq("id", runId);
}

async function notifyAgentFailure(agentName: string, message: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "econstruct Alerts <no-reply@econstructinc.com>",
        // DEV MODE — swap to frank@econstructinc.com when going live
        to: "marketing@econstructinc.com",
        subject: `⚠️ Agent Failed: ${agentName}`,
        html: `<p style="font-family:sans-serif;"><b>${agentName}</b> agent encountered an error:<br><br><code>${message}</code></p>`,
      }),
    });
  } catch {
    // Failure notifications are best-effort — never crash the agent
  }
}

export async function runAgent<T extends AgentResult>(
  agentName: string,
  work: (ctx: AgentContext) => Promise<T>
): Promise<T> {
  const runId = await createAgentRun(agentName);
  const started = Date.now();

  try {
    const result = await work({ runId, agentName });
    await completeAgentRun(runId, {
      status: "success",
      duration_ms: Date.now() - started,
      ...result,
    });
    return result;
  } catch (err: any) {
    const duration_ms = Date.now() - started;
    await completeAgentRun(runId, {
      status: "failed",
      duration_ms,
      errors: [err?.message ?? String(err)],
    });
    await notifyAgentFailure(agentName, `FAILED after ${duration_ms}ms: ${err?.message}`);

    // Sentry capture (if SDK present — optional dependency)
    try {
      const Sentry = await import("@sentry/nextjs").catch(() => null);
      if (Sentry) {
        Sentry.withScope((scope: any) => {
          scope.setTag("agentName", agentName);
          scope.setTag("runId", runId);
          Sentry.captureException(err);
        });
      }
    } catch {
      // Sentry is optional
    }

    throw err;
  }
}

/** Validates the CRON_SECRET header on Vercel Cron requests */
export function validateCronSecret(req: Request): boolean {
  const auth = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return auth === `Bearer ${secret}`;
}
