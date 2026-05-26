// One-off: apply 20260518_partner_cold_email_templates.sql to prod Supabase
// via the JS client (service role). Idempotent — safe to re-run.
//
// Run with: node scripts/apply-partner-templates.mjs

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, "..", ".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dzudtdhmvnuipqyoogem.supabase.co";
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!key) {
  console.error("SUPABASE_SERVICE_ROLE_KEY missing from .env.local");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const OLD_KEYS = [
  "first_outreach",
  "agreement_follow_up",
  "monthly_check_in",
  "adjuster_update",
  "bump_follow_up",
  "monthly_partner_update",
];

const TEMPLATES = [
  {
    template_key: "architect_cold_intro",
    name: "Architects: ADU + Fire Rebuild",
    subject: "GC Partnership - Fire Rebuild + ADU Pipeline in LA",
    body: `Hi [First Name],

My name is Frank Neimroozi - I'm the owner of econstruct, a general contracting firm based in Los Angeles. We specialize in commercial tenant improvements, ADU construction, and fire rebuilds across LA County.

With the Palisades and Eaton rebuild volume ramping up this year, I'm building a small network of trusted architects and design firms we can refer clients to - and vice versa.

The idea is simple: when you have a client who needs a reliable GC, we'd love to be your first call. When we have a client who needs design work, we send them your way. We also have a formal referral program - $5,000 for every signed GC contract that comes through a partner referral.

Would you be open to a quick 15-minute call this week to see if there's a fit?

Frank Neimroozi
Owner, econstruct
frank@econstructinc.com
econstructinc.com`,
  },
  {
    template_key: "adjuster_fire_rebuild",
    name: "Insurance Adjusters: Fire Claim to Rebuild",
    subject: "GC Referral Partnership - Palisades + Eaton Fire Rebuild",
    body: `Hi [First Name],

I'm Frank Neimroozi, owner of econstruct - a licensed general contracting firm in Los Angeles. We've been doing a lot of work in the fire rebuild space this year and I wanted to connect with adjusters who are actively working claims in the Palisades and Eaton areas.

Here's what I've noticed: once a homeowner gets their settlement, the #1 question is "who do I trust to rebuild?" That gap is where we can help each other.

We're offering a $5,000 referral fee for every signed rebuild contract that comes from an adjuster partner. No strings - just a simple agreement and a wire when the contract is signed.

We're fully licensed, insured, and have handled everything from full teardowns to structural repairs, ground ups and ADU additions. Happy to send our credentials if that's helpful.

Any interest in a quick call this week?

Frank Neimroozi
Owner, econstruct
frank@econstructinc.com
econstructinc.com`,
  },
  {
    template_key: "expediter_permit_partner",
    name: "Expediters / Permit Runners",
    subject: "Ongoing Permit Work + Referral Partnership - econstruct",
    body: `Hi [First Name],

My name is Frank Neimroozi - I run econstruct, a general contracting firm in Los Angeles. We pull 15 to 20 permits per year across commercial TI, ADU, and residential rebuild projects, and I'm looking to build a long-term relationship with a reliable permit expediting partner.

Beyond our own volume, we also work with clients who need expediting support independently of us - and I'd rather refer them to a trusted partner than have them go searching on their own.

We have a mutual referral program in place: $5,000 for any GC contract that comes our way through your network, and I'll make sure you're our first call for every permit we pull.

Would love to connect briefly - even a 10-minute call to see if there's a fit. Are you available this week?

Frank Neimroozi
Owner, econstruct
frank@econstructinc.com
econstructinc.com`,
  },
  {
    template_key: "realtor_cold_intro",
    name: "Realtors: Pre-Sale Reno + Buyer Referrals",
    subject: "GC Partnership for Your Clients - Pre-Sale Renovations + New Builds",
    body: `Hi [First Name],

I'm Frank Neimroozi, owner of econstruct - a full-service general contracting firm in Los Angeles. I specialize in commercial TI, ADU construction, and residential renovation and rebuild projects.

We work with a lot of clients who come to me right after buying - they need renovations done fast before move-in, or they're looking to add an ADU to increase property value. I'd love to have a realtor partner I can refer them to when they're ready to sell or buy next.

On the flip side: if you have buyers or sellers who need construction work - pre-sale renovations, fire rebuild, ADU additions - we offer a $5,000 referral fee per signed contract.

We're fast, licensed, and effective - I know that matters when your client's listing timeline is on the line.

Would you be open to a quick intro call this week?

Frank Neimroozi
Owner, econstruct
frank@econstructinc.com
econstructinc.com`,
  },
];

async function main() {
  console.log("Checking current partner_email_templates state...");
  const { data: before, error: readErr } = await supabase
    .from("partner_email_templates")
    .select("template_key, name");
  if (readErr) throw new Error(`Read failed: ${readErr.message}`);
  console.log(`Found ${before?.length ?? 0} existing templates:`, (before ?? []).map((r) => r.template_key));

  console.log(`\nDeleting old generic templates: ${OLD_KEYS.join(", ")}`);
  const { error: delErr, count: delCount } = await supabase
    .from("partner_email_templates")
    .delete({ count: "exact" })
    .in("template_key", OLD_KEYS);
  if (delErr) throw new Error(`Delete failed: ${delErr.message}`);
  console.log(`Deleted ${delCount ?? 0} rows.`);

  console.log("\nUpserting 4 partner-type templates...");
  const { data: upserted, error: upErr } = await supabase
    .from("partner_email_templates")
    .upsert(TEMPLATES, { onConflict: "template_key" })
    .select("template_key, name");
  if (upErr) throw new Error(`Upsert failed: ${upErr.message}`);
  console.log(`Upserted ${upserted?.length ?? 0} rows:`, (upserted ?? []).map((r) => r.template_key));

  const { data: after } = await supabase
    .from("partner_email_templates")
    .select("template_key, name, subject")
    .order("template_key");
  console.log("\nFinal state:");
  for (const row of after ?? []) console.log(`  - ${row.template_key} :: ${row.name}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
