import { runAgent, validateCronSecret } from "@/lib/agents/runner";
import { createServiceClient } from "@/lib/supabase/server";

export const maxDuration = 60;

const INSTANTLY_API = "https://api.instantly.ai/api/v2";

// Map our partner_type → which Instantly campaign template variant should be used.
// Instantly's per-lead campaign assignment supports custom variables — the campaign
// itself uses A/B variants based on the partner_type sent through.
const TEMPLATE_KEY_BY_TYPE: Record<string, string> = {
  Architect: "architect_cold_intro",
  "Realtor / Real Estate Agent": "realtor_cold_intro",
  "Insurance Agent / Adjuster": "adjuster_fire_rebuild",
  "Expediter / Permit Runner": "expediter_permit_partner",
};

async function enrollPartner(params: {
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
  if (!res.ok) {
    throw new Error(`Instantly ${res.status}: ${JSON.stringify(data).slice(0, 300)}`);
  }
  return data;
}

function firstWord(value: string | null | undefined) {
  return (value || "").trim().split(/\s+/)[0] ?? "";
}

function restWords(value: string | null | undefined) {
  const parts = (value || "").trim().split(/\s+/);
  return parts.length > 1 ? parts.slice(1).join(" ") : "";
}

export async function POST(req: Request) {
  if (!validateCronSecret(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const result = await runAgent("partner-enroll", async () => {
    const campaignId = process.env.INSTANTLY_PARTNER_CAMPAIGN_ID;
    if (!campaignId) {
      return {
        records_pulled: 0,
        records_updated: 0,
        metadata: { skipped: true, reason: "INSTANTLY_PARTNER_CAMPAIGN_ID not set" },
      };
    }

    const supabase = createServiceClient();

    // Pull "New Lead" partners with a contact email — these haven't been sent to yet.
    // Status flips to "Contacted" after enroll, so they won't be picked up again.
    const { data: partners, error } = await supabase
      .from("partner_leads")
      .select(
        "id, partner_id, partner_name, company_firm, partner_type, contact_email, contact_phone, source, status"
      )
      .eq("status", "New Lead")
      .not("contact_email", "is", null)
      .limit(40);

    if (error) throw new Error(`Partner fetch failed: ${error.message}`);
    if (!partners?.length) {
      return { records_pulled: 0, records_updated: 0 };
    }

    let enrolled = 0;
    const errors: string[] = [];
    const today = new Date().toISOString().slice(0, 10);
    const nowIso = new Date().toISOString();

    for (const p of partners) {
      try {
        if (!p.contact_email) continue;

        const firstName = firstWord(p.partner_name);
        const lastName = restWords(p.partner_name);
        const templateKey = TEMPLATE_KEY_BY_TYPE[p.partner_type] || "architect_cold_intro";

        await enrollPartner({
          email: p.contact_email,
          firstName,
          lastName,
          campaignId,
          customVariables: {
            crm_partner_id: p.id,
            partner_type: p.partner_type,
            company: p.company_firm || "",
            phone: p.contact_phone || "",
            source: p.source || "",
            template_key: templateKey,
          },
        });

        await supabase
          .from("partner_leads")
          .update({
            status: "Contacted",
            last_contact_date: today,
            next_follow_up_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
              .toISOString()
              .slice(0, 10),
            updated_at: nowIso,
          })
          .eq("id", p.id);

        await supabase.from("partner_tasks").insert({
          partner_lead_id: p.id,
          title: `Follow up with ${p.partner_name} if no reply by +5d`,
          due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        });

        enrolled++;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        errors.push(`partner ${p.id}: ${message}`);
      }
    }

    return {
      records_pulled: partners.length,
      records_updated: enrolled,
      errors,
      metadata: { campaign_id: campaignId },
    };
  });

  return Response.json(result);
}
