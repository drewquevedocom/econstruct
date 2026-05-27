// Direct ATTOM owner enrichment for LADBS permit leads.
// Bypasses the broken enrichment_queue entirely — reads leads directly.
//
// Usage:
//   node scripts/enrich-ladbs-owners.mjs [--cap 100] [--type bldg-new|grading|all] [--dry-run]
//
// Target: leads where source='ladbs_permits' AND owner_name IS NULL.
// Ordered by property_value DESC so we enrich highest-value first.
// Each call ~$0.10 ATTOM. Default cap = 100.

import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, "..", ".env.local") });

const ATTOM_BASE = "https://api.gateway.attomdata.com/propertyapi/v1.0.0";
const LA_COUNTY_FIPS = "06037";

function parseArgs() {
  const args = { cap: 100, type: "bldg-new", dryRun: false };
  for (let i = 2; i < process.argv.length; i++) {
    const a = process.argv[i];
    if (a === "--cap") args.cap = Number(process.argv[++i]);
    else if (a === "--type") args.type = process.argv[++i];
    else if (a === "--dry-run") args.dryRun = true;
  }
  return args;
}

const SUBSOURCE_FILTERS = {
  "bldg-new": "%Bldg-New%",
  grading: "%Grading%",
  addition: "%Addition%",
  all: null,
};

function normalizeWhitespace(v) {
  return (v || "").replace(/\s+/g, " ").trim();
}

function splitAddress(address, zip) {
  if (!address) return null;
  const n = normalizeWhitespace(address);
  const m = n.match(/^(.+?)\s+([A-Z][A-Z\s]+?)\s+(CA)\s+(\d{5}(?:-\d{4})?)$/);
  if (m) return { address1: m[1], address2: `${m[2]}, ${m[3]} ${m[4]}` };
  if (zip) return { address1: n.replace(new RegExp(`\\s+${zip}$`), ""), address2: `CA ${zip}` };
  return null;
}

async function attomLookup(key, params) {
  const q = new URLSearchParams(params);
  const res = await fetch(`${ATTOM_BASE}/property/detailowner?${q}`, {
    headers: { accept: "application/json", apikey: key },
  });
  const body = await res.json();
  return { ok: res.ok, status: res.status, body };
}

function ownerNames(owner) {
  return [owner?.owner1?.fullname, owner?.owner2?.fullname, owner?.owner3?.fullname, owner?.owner4?.fullname]
    .map((n) => n?.trim())
    .filter(Boolean);
}

function inferOwnerType(owner) {
  if (!owner) return null;
  return owner.corporateindicator === "Y" ? "entity" : "individual";
}

async function main() {
  const args = parseArgs();
  const apiKey = process.env.ATTOM_API_KEY || process.env.ESTATED_API_TOKEN;
  if (!apiKey) throw new Error("ATTOM_API_KEY missing");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const filter = SUBSOURCE_FILTERS[args.type];
  let query = supabase
    .from("leads")
    .select("id, address, zip_code, apn, subsource, property_value")
    .eq("source", "ladbs_permits")
    .is("owner_name", null)
    .not("apn", "is", null)
    .order("property_value", { ascending: false, nullsFirst: false })
    .limit(args.cap);
  if (filter) query = query.ilike("subsource", filter);

  const { data: candidates, error } = await query;
  if (error) throw new Error(`Candidate fetch failed: ${error.message}`);

  console.log(`Loaded ${candidates.length} candidates (type=${args.type}, cap=${args.cap})`);
  console.log(`Estimated cost: $${(candidates.length * 0.1).toFixed(2)}`);
  if (args.dryRun) {
    console.log("DRY RUN — first 5:");
    for (const c of candidates.slice(0, 5)) console.log(`  $${c.property_value} ${c.zip_code} ${c.address}`);
    return;
  }

  let enriched = 0;
  let noMatch = 0;
  let failed = 0;
  let entities = 0;
  let individuals = 0;

  for (const lead of candidates) {
    try {
      let lookup = "apn";
      let resp = await attomLookup(apiKey, { fips: LA_COUNTY_FIPS, apn: lead.apn });
      if (!resp.ok || !resp.body?.property?.[0]) {
        const addr = splitAddress(lead.address, lead.zip_code);
        if (addr) {
          lookup = "address";
          resp = await attomLookup(apiKey, addr);
        }
      }
      const prop = resp.body?.property?.[0];
      if (!prop) {
        noMatch++;
        console.log(`  [no-match] ${lead.address}`);
        continue;
      }
      const names = ownerNames(prop.owner);
      if (!names.length) {
        noMatch++;
        console.log(`  [no-owner] ${lead.address}`);
        continue;
      }
      const ownerType = inferOwnerType(prop.owner);
      if (ownerType === "entity") entities++;
      else individuals++;

      const updates = {
        owner_name: names.join(" & "),
        owner_mailing_address: prop.owner?.mailingaddressoneline?.trim() || null,
        owner_type: ownerType,
        address: prop.address?.oneLine ?? lead.address,
        zip_code: prop.address?.postal1 ?? lead.zip_code,
        enrichment_status: "property_enriched",
        updated_at: new Date().toISOString(),
      };
      // Don't touch apn — it has a unique index and ATTOM may return a slightly different format.
      const { error: updErr } = await supabase.from("leads").update(updates).eq("id", lead.id);
      if (updErr) throw new Error(updErr.message);

      await supabase.from("lead_activities").insert({
        lead_id: lead.id,
        type: "property_enriched",
        channel: "attom",
        metadata: {
          source: "attom",
          lookup,
          owner_type: ownerType,
          attom_id: prop.identifier?.attomId ?? null,
          script: "enrich-ladbs-owners.mjs",
        },
      });

      enriched++;
      if (enriched % 10 === 0) console.log(`  [progress] enriched=${enriched} no_match=${noMatch} failed=${failed}`);
    } catch (err) {
      failed++;
      console.error(`  [error] lead ${lead.id}: ${err.message}`);
    }
  }

  await supabase.from("agent_runs").insert({
    agent_name: "ladbs-owner-enrich",
    run_type: "manual",
    status: failed === 0 ? "success" : enriched > 0 ? "partial" : "failed",
    records_pulled: candidates.length,
    records_updated: enriched,
    metadata: {
      no_match: noMatch,
      failed,
      entities,
      individuals,
      type_filter: args.type,
      estimated_cost: enriched * 0.1,
    },
    ended_at: new Date().toISOString(),
  });

  console.log("\n=== SUMMARY ===");
  console.log(`Enriched: ${enriched} (${entities} entities, ${individuals} individuals)`);
  console.log(`No match: ${noMatch}`);
  console.log(`Failed:   ${failed}`);
  console.log(`Spend:    ~$${(enriched * 0.1).toFixed(2)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
