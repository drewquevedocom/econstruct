import { runAgent, validateCronSecret } from "@/lib/agents/runner";
import { createServiceClient } from "@/lib/supabase/server";

export const maxDuration = 60;

const INSTANTLY_API = "https://api.instantly.ai/api/v2";

// Each partner_type routes to its own segmented Instantly campaign so the
// architect sequence goes to architects, adjuster sequence to adjusters, etc.
// Cloudflare secrets hold the campaign UUIDs. INSTANTLY_PARTNER_CAMPAIGN_ID
// is kept as a fallback for any partner_type that doesn't have a dedicated
// secret set yet.
function campaignForType(type: string): string | undefined {
  const map: Record<string, string | undefined> = {
    Architect: process.env.INSTANTLY_PARTNER_CAMPAIGN_ARCHITECT || "97f518ff-27a1-475e-a9a1-7ae74d2e6df3",
    "Realtor / Real Estate Agent": process.env.INSTANTLY_PARTNER_CAMPAIGN_REALTOR || "ca4fbf88-6cb1-4eee-9aea-362b43465e76",
    "Insurance Agent / Adjuster": process.env.INSTANTLY_PARTNER_CAMPAIGN_ADJUSTER || "be462f28-7c1c-441f-b31c-2c6bccb30899",
    "Expediter / Permit Runner": process.env.INSTANTLY_PARTNER_CAMPAIGN_EXPEDITER || "f413efe9-7a93-43ff-8286-e78bdff63d18",
    "Interior Designer": process.env.INSTANTLY_PARTNER_CAMPAIGN_DESIGNER,
    "Real Estate Attorney": process.env.INSTANTLY_PARTNER_CAMPAIGN_ATTORNEY,
    "CPA / Wealth Advisor": process.env.INSTANTLY_PARTNER_CAMPAIGN_CPA,
    "Escrow Officer": process.env.INSTANTLY_PARTNER_CAMPAIGN_ESCROW,
    "Structural / Geotech Engineer": process.env.INSTANTLY_PARTNER_CAMPAIGN_ENGINEER,
    "Fire / Water Restoration": process.env.INSTANTLY_PARTNER_CAMPAIGN_RESTORATION,
  };
  // No global fallback — undefined return skips the partner cleanly.
  // Falling through to INSTANTLY_PARTNER_CAMPAIGN_ID was hitting a
  // workspace-mismatch 403 and freezing the queue.
  return map[type];
}

const TEMPLATE_KEY_BY_TYPE: Record<string, string> = {
  Architect: "architect_cold_intro",
  "Realtor / Real Estate Agent": "realtor_cold_intro",
  "Insurance Agent / Adjuster": "adjuster_fire_rebuild",
  "Expediter / Permit Runner": "expediter_permit_partner",
  "Interior Designer": "interior_designer_cold",
  "Real Estate Attorney": "real_estate_attorney_cold",
  "CPA / Wealth Advisor": "cpa_wealth_cold",
  "Escrow Officer": "escrow_officer_cold",
  "Structural / Geotech Engineer": "structural_engineer_cold",
  "Fire / Water Restoration": "restoration_cold",
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
    // We allow per-type campaigns; require at least one to be configured.
    const anyCampaignConfigured = Boolean(
      campaignForType("Architect") ||
        campaignForType("Realtor / Real Estate Agent") ||
        campaignForType("Insurance Agent / Adjuster") ||
        campaignForType("Expediter / Permit Runner") ||
        campaignForType("Interior Designer") ||
        campaignForType("Real Estate Attorney") ||
        campaignForType("CPA / Wealth Advisor") ||
        campaignForType("Escrow Officer") ||
        campaignForType("Structural / Geotech Engineer") ||
        campaignForType("Fire / Water Restoration")
    );
    if (!anyCampaignConfigured) {
      return {
        records_pulled: 0,
        records_updated: 0,
        metadata: {
          skipped: true,
          reason: "No Instantly campaigns configured",
        },
      };
    }

    const supabase = createServiceClient();

    // Only pull partner_types with a configured Instantly campaign.
    // Otherwise queue stalls on the same failing partners every run.
    const enabledTypes = [
      "Architect",
      "Realtor / Real Estate Agent",
      "Insurance Agent / Adjuster",
      "Expediter / Permit Runner",
    ];
    for (const t of [
      "Interior Designer",
      "Real Estate Attorney",
      "CPA / Wealth Advisor",
      "Escrow Officer",
      "Structural / Geotech Engineer",
      "Fire / Water Restoration",
    ]) {
      if (campaignForType(t)) enabledTypes.push(t);
    }

    const { data: partners, error } = await supabase
      .from("partner_leads")
      .select(
        "id, partner_id, partner_name, company_firm, partner_type, contact_email, contact_phone, source, status"
      )
      .eq("status", "New Lead")
      .not("contact_email", "is", null)
      .in("partner_type", enabledTypes)
      .order("created_at", { ascending: true })
      .limit(25);

    if (error) throw new Error(`Partner fetch failed: ${error.message}`);
    if (!partners?.length) {
      return { records_pulled: 0, records_updated: 0 };
    }

    let enrolled = 0;
    const skippedNoCampaign: string[] = [];
    const enrolledByCampaign: Record<string, number> = {};
    const errors: string[] = [];
    const today = new Date().toISOString().slice(0, 10);
    const nowIso = new Date().toISOString();

    for (const p of partners) {
      try {
        if (!p.contact_email) continue;

        const campaignId = campaignForType(p.partner_type);
        if (!campaignId) {
          skippedNoCampaign.push(`${p.id} (type=${p.partner_type})`);
          continue;
        }

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
        enrolledByCampaign[campaignId] = (enrolledByCampaign[campaignId] || 0) + 1;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        errors.push(`partner ${p.id}: ${message}`);
      }
    }

    return {
      records_pulled: partners.length,
      records_updated: enrolled,
      errors,
      metadata: {
        enrolledByCampaign,
        skippedNoCampaign,
      },
    };
  });

  return Response.json(result);
}
