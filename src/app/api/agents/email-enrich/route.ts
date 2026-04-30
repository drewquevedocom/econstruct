import { runAgent, validateCronSecret } from "@/lib/agents/runner";
import { enrichLeadEmails } from "@/lib/lead-enrichment/email";

export const maxDuration = 60;

export async function POST(req: Request) {
  if (!validateCronSecret(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const leadIds = Array.isArray(body.leadIds)
    ? body.leadIds.filter((id: unknown): id is string => typeof id === "string")
    : undefined;

  const result = await runAgent("email-enrich", async () => enrichLeadEmails(leadIds));

  return Response.json(result);
}
