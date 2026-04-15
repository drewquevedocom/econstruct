import { runAgent, validateCronSecret } from "@/lib/agents/runner";
import { createServiceClient } from "@/lib/supabase/server";

export const maxDuration = 60;

export async function POST(req: Request) {
  if (!validateCronSecret(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const result = await runAgent("score-leads", async () => {
    const supabase = createServiceClient();

    // Find leads updated in the last 30 min that haven't been scored yet
    const { data: leads, error } = await supabase
      .from("leads")
      .select("id")
      .or("score_calculated_at.is.null,score_calculated_at.lt." + new Date(Date.now() - 30 * 60 * 1000).toISOString())
      .eq("enrichment_status", "done")
      .limit(100);

    if (error) throw new Error(`Failed to fetch leads: ${error.message}`);
    if (!leads?.length) return { records_pulled: 0, records_updated: 0 };

    let updated = 0;
    for (const lead of leads) {
      try {
        const { error: scoreError } = await supabase.rpc("calculate_lead_score", {
          p_lead_id: lead.id,
        });
        if (!scoreError) updated++;
      } catch {
        // Log and continue — never crash on a single lead
      }
    }

    return { records_pulled: leads.length, records_updated: updated };
  });

  return Response.json(result);
}
