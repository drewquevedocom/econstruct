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

/** Throw this to stop an agent run before it takes any action, while still
 * recording *why* on the failed run — e.g. "verification was unavailable for
 * the whole batch, refused to enroll unverified." A plain Error would still
 * mark the run failed and alert, but its context would be lost; this carries
 * structured metadata through to agent_runs so other agents (like the daily
 * report) can read the reason, not just "something failed." */
export class AgentHaltError extends Error {
  metadata?: Record<string, unknown>;
  constructor(message: string, metadata?: Record<string, unknown>) {
    super(message);
    this.name = "AgentHaltError";
    this.metadata = metadata;
  }
}

async function createAgentRun(agentName: string): Promise<string> {
  const supabase = createServiceClient();
  const staleBefore = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  // Stale 'running' rows are agents whose Cloudflare Worker was killed at the 30s
  // wall-clock limit before they could mark themselves complete. The work likely
  // partially succeeded; the bookkeeping just got truncated. We mark them 'failed'
  // (the only DB-allowed terminal state besides 'success'/'partial') with a
  // distinct STALE_TIMEOUT prefix so the daily report and dashboards can filter
  // these operational-noise rows out from real data errors.
  await supabase
    .from("agent_runs")
    .update({
      status: "failed",
      ended_at: new Date().toISOString(),
      errors: ["STALE_TIMEOUT: Worker wall-clock exceeded before agent finished bookkeeping"],
    })
    .eq("status", "running")
    .lt("started_at", staleBefore);

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
  // metadata was previously accepted on AgentResult but never written here —
  // every run's metadata (verification credit balance, halt reasons, per-type
  // breakdowns, etc.) was silently discarded. Anything reading it back later
  // (daily-report.ts) was always getting null.
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
      metadata: result.metadata ?? null,
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
        to: process.env.FRANK_EMAIL || "frank@econstructinc.com",
        cc: ["marketing@econstructinc.com"],
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
  } catch (err: unknown) {
    const duration_ms = Date.now() - started;
    const message = err instanceof Error ? err.message : String(err);
    await completeAgentRun(runId, {
      status: "failed",
      duration_ms,
      errors: [message],
      metadata: err instanceof AgentHaltError ? err.metadata : undefined,
    });
    await notifyAgentFailure(agentName, `FAILED after ${duration_ms}ms: ${message}`);

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
