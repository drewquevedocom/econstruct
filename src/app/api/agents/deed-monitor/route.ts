import { runAgent, validateCronSecret } from "@/lib/agents/runner";

export const maxDuration = 60;

// Retired 2026-05-28: pivoted off fire-rebuild direct outreach.
// This agent pulled 10 zips × ~200 parcels each and did 3 sequential DB ops
// per row, overflowing the Cloudflare 30s Worker limit and producing zombie
// stale-running rows. Re-enabling means restoring the deed-monitor logic
// from commit history before this change.

export async function POST(req: Request) {
  if (!validateCronSecret(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const result = await runAgent("deed-monitor", async () => ({
    records_pulled: 0,
    records_created: 0,
    records_updated: 0,
    metadata: { skipped: true, reason: "agent retired (fire-rebuild pivot)" },
  }));

  return Response.json(result);
}
