import { runAgent, validateCronSecret } from "@/lib/agents/runner";
import { createServiceClient } from "@/lib/supabase/server";
import { withRetry } from "@/lib/utils/retry";

export const maxDuration = 60;

const APOLLO_API_KEY = process.env.APOLLO_API_KEY;
const APOLLO_BASE = "https://api.apollo.io/api/v1";

type ApolloPerson = {
  email?: string | null;
  personal_emails?: string[] | null;
  phone_numbers?: Array<{ sanitized_number?: string | null }> | null;
  linkedin_url?: string | null;
};

function getPrimaryOwnerName(name: string) {
  return name
    .split("&")[0]
    .replace(/,TR\b/i, "")
    .replace(/\bTRUST\b/i, "")
    .trim();
}

async function apolloMatch(ownerName: string) {
  if (!APOLLO_API_KEY) throw new Error("APOLLO_API_KEY not set");
  return withRetry(async () => {
    const params = new URLSearchParams({
      name: ownerName,
      reveal_personal_emails: "true",
    });

    const res = await fetch(`${APOLLO_BASE}/people/match?${params.toString()}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-api-key": APOLLO_API_KEY,
      },
    });
    if (!res.ok) {
      const body = await res.text();
      const err = new Error(
        `Apollo ${res.status}: ${body.slice(0, 300)}`
      ) as Error & { status?: number };
      err.status = res.status;
      throw err;
    }
    return (await res.json()) as { person?: ApolloPerson | null };
  });
}

export async function POST(req: Request) {
  if (!validateCronSecret(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const result = await runAgent("apollo-enrich", async () => {
    const supabase = createServiceClient();

    // Apollo is a paid B2B fallback. Only spend it on hot, email-missing leads.
    const { data: queue, error } = await supabase
      .from("enrichment_queue")
      .select(
        `
        id,
        lead_id,
        attempts,
        leads!inner (
          owner_name,
          name,
          email,
          phone,
          lead_score,
          dnc,
          fire_damage_status
        )
      `
      )
      .eq("status", "pending")
      .lt("attempts", 3)
      // 70 was calibrated for fire-rebuild leads (large near-certain jobs);
      // routine LADBS new-construction permits score much lower on the same
      // scale, so a fire-scaled floor left 100% of the non-fire pool
      // unreachable. 40 keeps this to the better half of that pool.
      .gte("leads.lead_score", 40)
      .is("leads.email", null)
      .is("leads.fire_damage_status", null)
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

        const lead = Array.isArray(item.leads) ? item.leads[0] : item.leads;
        if (lead?.dnc) {
          await supabase
            .from("enrichment_queue")
            .update({ status: "failed", last_error: "Lead is marked do not contact" })
            .eq("id", item.id);
          continue;
        }

        const searchName = lead?.owner_name ?? lead?.name;
        if (!searchName) {
          await supabase
            .from("enrichment_queue")
            .update({ status: "failed", last_error: "No name to search" })
            .eq("id", item.id);
          continue;
        }

        const apolloResult = await apolloMatch(getPrimaryOwnerName(searchName));
        const person = apolloResult.person;

        if (!person) {
          await supabase
            .from("enrichment_queue")
            .update({ status: "failed", last_error: "No Apollo match" })
            .eq("id", item.id);
          continue;
        }

        // Update lead with enriched data
        const updates: Record<string, string | null> = {
          enrichment_status: "done",
        };
        const email = person.email ?? person.personal_emails?.[0] ?? null;
        if (email) {
          updates.email = email;
          updates.outreach_status = "ready_for_email_review";
          updates.outreach_status_updated_at = new Date().toISOString();
        }
        if (person.phone_numbers?.[0]?.sanitized_number) {
          updates.phone = person.phone_numbers[0].sanitized_number;
        }
        if (person.linkedin_url) updates.linkedin_url = person.linkedin_url;

        await supabase.from("leads").update(updates).eq("id", item.lead_id);
        await supabase.from("email_enrichment_attempts").insert({
          lead_id: item.lead_id,
          provider: "apollo",
          status: email ? "success" : "no_match",
          email,
          phone: person.phone_numbers?.[0]?.sanitized_number ?? null,
          cost_estimate: 0.1,
          metadata: { source: "apollo" },
        });
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
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        errors.push(`lead ${item.lead_id}: ${message}`);
        const isMaxAttempts = item.attempts + 1 >= 3;
        await supabase
          .from("enrichment_queue")
          .update({
            status: isMaxAttempts ? "failed" : "pending",
            last_error: message,
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
