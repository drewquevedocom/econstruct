import { runAgent, validateCronSecret } from "@/lib/agents/runner";
import { createServiceClient } from "@/lib/supabase/server";
import { withRetry } from "@/lib/utils/retry";

export const maxDuration = 60;

const APOLLO_API_KEY = process.env.APOLLO_API_KEY;
const APOLLO_BASE = "https://api.apollo.io/v1";

async function apolloSearch(ownerName: string, state = "California") {
  if (!APOLLO_API_KEY) throw new Error("APOLLO_API_KEY not set");
  return withRetry(async () => {
    const res = await fetch(`${APOLLO_BASE}/people/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": APOLLO_API_KEY,
      },
      body: JSON.stringify({
        q_person_name: ownerName,
        person_locations: [state],
        page: 1,
        per_page: 1,
      }),
    });
    if (!res.ok) {
      const err: any = new Error(`Apollo error ${res.status}`);
      err.status = res.status;
      throw err;
    }
    return res.json();
  });
}

export async function POST(req: Request) {
  if (!validateCronSecret(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const result = await runAgent("apollo-enrich", async () => {
    const supabase = createServiceClient();

    // Pull up to 20 pending items from enrichment queue
    const { data: queue, error } = await supabase
      .from("enrichment_queue")
      .select("id, lead_id, attempts")
      .eq("status", "pending")
      .lt("attempts", 3)
      .order("created_at")
      .limit(20);

    if (error) throw new Error(`Queue fetch failed: ${error.message}`);
    if (!queue?.length) return { records_pulled: 0 };

    let enriched = 0;
    const errors: string[] = [];

    for (const item of queue) {
      try {
        // Mark as processing
        await supabase
          .from("enrichment_queue")
          .update({ status: "processing", attempts: item.attempts + 1 })
          .eq("id", item.id);

        // Get lead data
        const { data: lead } = await supabase
          .from("leads")
          .select("owner_name, name, email, phone")
          .eq("id", item.lead_id)
          .single();

        const searchName = lead?.owner_name ?? lead?.name;
        if (!searchName) {
          await supabase
            .from("enrichment_queue")
            .update({ status: "failed", last_error: "No name to search" })
            .eq("id", item.id);
          continue;
        }

        const apolloResult = await apolloSearch(searchName);
        const person = apolloResult?.people?.[0];

        if (!person) {
          await supabase
            .from("enrichment_queue")
            .update({ status: "failed", last_error: "No Apollo match" })
            .eq("id", item.id);
          continue;
        }

        // Update lead with enriched data
        const updates: Record<string, any> = {
          enrichment_status: "done",
        };
        if (person.email) updates.email = person.email;
        if (person.phone_numbers?.[0]?.sanitized_number) {
          updates.phone = person.phone_numbers[0].sanitized_number;
        }
        if (person.linkedin_url) updates.linkedin_url = person.linkedin_url;

        await supabase.from("leads").update(updates).eq("id", item.lead_id);
        await supabase
          .from("enrichment_queue")
          .update({ status: "done", processed_at: new Date().toISOString() })
          .eq("id", item.id);
        await supabase.from("lead_activities").insert({
          lead_id: item.lead_id,
          type: "enrichment",
          channel: "system",
          metadata: { source: "apollo", fields_added: Object.keys(updates) },
        });

        enriched++;
      } catch (err: any) {
        errors.push(`lead ${item.lead_id}: ${err.message}`);
        const isMaxAttempts = item.attempts + 1 >= 3;
        await supabase
          .from("enrichment_queue")
          .update({
            status: isMaxAttempts ? "failed" : "pending",
            last_error: err.message,
          })
          .eq("id", item.id);
      }
    }

    return {
      records_pulled: queue.length,
      records_updated: enriched,
      errors,
    };
  });

  return Response.json(result);
}
