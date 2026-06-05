// Enroll New-Lead partners with email directly into their type-specific Instantly campaign,
// using the LOCAL INSTANTLY_API_KEY. Bypasses the Cloudflare partner-enroll agent so we can
// keep emails flowing while the prod API key gets fixed.
//
// Run: node scripts/enroll-partners-local.mjs [--dry-run] [--limit 40]

import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, "..", ".env.local") });

const DRY_RUN = process.argv.includes("--dry-run");
const LIMIT = (() => {
  const i = process.argv.indexOf("--limit");
  return i >= 0 ? Number(process.argv[i + 1]) : 40;
})();

// Dedicated Instantly campaigns per partner_type. New types (Interior Designer,
// Real Estate Attorney, CPA, Escrow, Structural Eng, Restoration) fall back to
// INSTANTLY_PARTNER_CAMPAIGN_ID env var until Drew creates dedicated campaigns.
const CAMPAIGN_BY_TYPE = {
  Architect: "97f518ff-27a1-475e-a9a1-7ae74d2e6df3",
  "Realtor / Real Estate Agent": "ca4fbf88-6cb1-4eee-9aea-362b43465e76",
  "Insurance Agent / Adjuster": "be462f28-7c1c-441f-b31c-2c6bccb30899",
  "Expediter / Permit Runner": "f413efe9-7a93-43ff-8286-e78bdff63d18",
  "Interior Designer": process.env.INSTANTLY_PARTNER_CAMPAIGN_DESIGNER,
  "Real Estate Attorney": process.env.INSTANTLY_PARTNER_CAMPAIGN_ATTORNEY,
  "CPA / Wealth Advisor": process.env.INSTANTLY_PARTNER_CAMPAIGN_CPA,
  "Escrow Officer": process.env.INSTANTLY_PARTNER_CAMPAIGN_ESCROW,
  "Structural / Geotech Engineer": process.env.INSTANTLY_PARTNER_CAMPAIGN_ENGINEER,
  "Fire / Water Restoration": process.env.INSTANTLY_PARTNER_CAMPAIGN_RESTORATION,
};

const TEMPLATE_KEY_BY_TYPE = {
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

const apiKey = process.env.INSTANTLY_API_KEY;
if (!apiKey) throw new Error("INSTANTLY_API_KEY missing");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

function firstWord(v) {
  return (v || "").trim().split(/\s+/)[0] ?? "";
}
function restWords(v) {
  const parts = (v || "").trim().split(/\s+/);
  return parts.length > 1 ? parts.slice(1).join(" ") : "";
}

async function enroll(p, campaignId) {
  const res = await fetch("https://api.instantly.ai/api/v2/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      email: p.contact_email,
      first_name: firstWord(p.partner_name),
      last_name: restWords(p.partner_name),
      campaign: campaignId,
      skip_if_in_campaign: true,
      custom_variables: {
        crm_partner_id: p.id,
        partner_type: p.partner_type,
        company: p.company_firm || "",
        phone: p.contact_phone || "",
        source: p.source || "",
        template_key: TEMPLATE_KEY_BY_TYPE[p.partner_type] || "architect_cold_intro",
      },
    }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`Instantly ${res.status}: ${JSON.stringify(body).slice(0, 200)}`);
  return body;
}

async function main() {
  const { data: partners, error } = await supabase
    .from("partner_leads")
    .select("id, partner_name, company_firm, partner_type, contact_email, contact_phone, source, status")
    .eq("status", "New Lead")
    .not("contact_email", "is", null)
    .limit(LIMIT);
  if (error) throw new Error(`Fetch: ${error.message}`);
  console.log(`Found ${partners.length} New-Lead partners with email`);

  let enrolled = 0;
  let failed = 0;
  const today = new Date().toISOString().slice(0, 10);
  const followUp = new Date(Date.now() + 5 * 86400_000).toISOString().slice(0, 10);
  const enrolledByType = {};

  for (const p of partners) {
    const campaignId =
      CAMPAIGN_BY_TYPE[p.partner_type] || process.env.INSTANTLY_PARTNER_CAMPAIGN_ID;
    if (!campaignId) {
      console.log(`  [no-campaign] ${p.partner_name} (${p.partner_type})`);
      continue;
    }
    console.log(`  [enroll] ${p.partner_name} → ${p.partner_type} (${p.contact_email})`);
    if (DRY_RUN) continue;

    try {
      await enroll(p, campaignId);
      await supabase
        .from("partner_leads")
        .update({
          status: "Contacted",
          last_contact_date: today,
          next_follow_up_date: followUp,
          updated_at: new Date().toISOString(),
        })
        .eq("id", p.id);
      await supabase.from("partner_tasks").insert({
        partner_lead_id: p.id,
        title: `Follow up with ${p.partner_name} if no reply by +5d`,
        due_date: followUp,
      });
      enrolled++;
      enrolledByType[p.partner_type] = (enrolledByType[p.partner_type] || 0) + 1;
    } catch (err) {
      console.log(`    ERR: ${err.message}`);
      failed++;
    }
  }

  if (!DRY_RUN && enrolled > 0) {
    await supabase.from("agent_runs").insert({
      agent_name: "local-partner-enroll",
      run_type: "manual",
      status: failed === 0 ? "success" : enrolled > 0 ? "partial" : "failed",
      records_pulled: partners.length,
      records_updated: enrolled,
      metadata: { enrolledByType, failed },
      ended_at: new Date().toISOString(),
    });
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`Enrolled:  ${enrolled}`);
  console.log(`Failed:    ${failed}`);
  console.log(`By type:`, enrolledByType);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
