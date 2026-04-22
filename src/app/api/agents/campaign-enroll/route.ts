import { runAgent, validateCronSecret } from "@/lib/agents/runner";
import { createServiceClient } from "@/lib/supabase/server";

export const maxDuration = 60;

const INSTANTLY_API = "https://api.instantly.ai/api/v2";

async function enrollInInstantly(params: {
  email: string;
  firstName: string;
  lastName: string;
  campaignId: string;
  customVariables: Record<string, string | number | null>;
}) {
  const apiKey = process.env.INSTANTLY_API_KEY;
  if (!apiKey) throw new Error("INSTANTLY_API_KEY not set");

  const res = await fetch(`${INSTANTLY_API}/leads`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      first_name: params.firstName,
      last_name: params.lastName,
      campaign: params.campaignId,
      skip_if_in_campaign: true,
      custom_variables: params.customVariables,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Instantly ${res.status}: ${JSON.stringify(data).slice(0, 300)}`);
  return data;
}

function splitName(full: string | null | undefined): [string, string] {
  if (!full) return ["", ""];
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return [parts[0], ""];
  return [parts[0], parts.slice(1).join(" ")];
}

export async function POST(req: Request) {
  if (!validateCronSecret(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const result = await runAgent("campaign-enroll", async () => {
    const campaignId = process.env.INSTANTLY_CAMPAIGN_ID;
    if (!campaignId) {
      return {
        records_pulled: 0,
        records_updated: 0,
        metadata: { skipped: true, reason: "INSTANTLY_CAMPAIGN_ID not set" },
      };
    }

    const supabase = createServiceClient();

    const { data: leads, error } = await supabase
      .from("leads")
      .select(
        "id, name, first_name, last_name, owner_name, email, phone, address, zip_code, property_value, fire_damage_status, lead_score"
      )
      .gte("lead_score", 85)
      .eq("lifecycle_stage", "new")
      .not("email", "is", null)
      .is("campaign_enrolled_at", null)
      .limit(50);

    if (error) throw new Error(`Fetch failed: ${error.message}`);
    if (!leads?.length) return { records_pulled: 0, records_updated: 0 };

    let enrolled = 0;
    const errors: string[] = [];

    for (const lead of leads) {
      try {
        const [firstFromOwner, lastFromOwner] = splitName(lead.owner_name);
        const firstName = lead.first_name || firstFromOwner;
        const lastName = lead.last_name || lastFromOwner;

        await enrollInInstantly({
          email: lead.email!,
          firstName,
          lastName,
          campaignId,
          customVariables: {
            address: lead.address || "",
            zip: lead.zip_code || "",
            phone: lead.phone || "",
            property_value: lead.property_value || "",
            fire_status: lead.fire_damage_status || "",
            score: lead.lead_score || 0,
          },
        });

        await supabase
          .from("leads")
          .update({
            lifecycle_stage: "contacted",
            campaign_enrolled_at: new Date().toISOString(),
            instantly_campaign_id: campaignId,
            updated_at: new Date().toISOString(),
          })
          .eq("id", lead.id);

        await supabase.from("lead_activities").insert({
          lead_id: lead.id,
          type: "campaign_enrolled",
          channel: "instantly",
          metadata: { campaign_id: campaignId, score: lead.lead_score },
        });

        enrolled++;
      } catch (err: any) {
        errors.push(`lead ${lead.id}: ${err.message}`);
      }
    }

    return {
      records_pulled: leads.length,
      records_updated: enrolled,
      errors,
    };
  });

  return Response.json(result);
}
