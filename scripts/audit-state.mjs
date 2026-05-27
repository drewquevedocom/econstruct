// One-off audit of production CRM state.
// Run: node scripts/audit-state.mjs

import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, "..", ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function count(table, filters = (q) => q) {
  const { count, error } = await filters(supabase.from(table).select("*", { count: "exact", head: true }));
  if (error) {
    console.log(`  ${table}: ERROR ${error.message}`);
    return null;
  }
  return count ?? 0;
}

async function main() {
  console.log("=== LEADS TABLE ===");
  console.log("Total leads:", await count("leads"));
  console.log("By source:");
  const { data: bySource } = await supabase.from("leads").select("source").limit(10000);
  const sourceCounts = {};
  for (const r of bySource ?? []) sourceCounts[r.source ?? "null"] = (sourceCounts[r.source ?? "null"] || 0) + 1;
  for (const [s, c] of Object.entries(sourceCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${s}: ${c}`);
  }

  console.log("\nLADBS-permits subset:");
  console.log("  Total ladbs_permits:", await count("leads", (q) => q.eq("source", "ladbs_permits")));
  console.log("  With owner_name:", await count("leads", (q) => q.eq("source", "ladbs_permits").not("owner_name", "is", null)));
  console.log("  With email:", await count("leads", (q) => q.eq("source", "ladbs_permits").not("email", "is", null)));
  console.log("  With owner_mailing_address:", await count("leads", (q) => q.eq("source", "ladbs_permits").not("owner_mailing_address", "is", null)));

  console.log("\nAll leads enrichment:");
  console.log("  With owner_name:", await count("leads", (q) => q.not("owner_name", "is", null)));
  console.log("  With email:", await count("leads", (q) => q.not("email", "is", null)));
  console.log("  Hot (score >= 70):", await count("leads", (q) => q.gte("lead_score", 70)));

  console.log("\n=== PARTNER LEADS ===");
  console.log("Total partner_leads:", await count("partner_leads"));
  console.log("With email:", await count("partner_leads", (q) => q.not("contact_email", "is", null)));
  const { data: byType } = await supabase.from("partner_leads").select("partner_type, status").limit(10000);
  const typeCounts = {};
  for (const r of byType ?? []) {
    const k = `${r.partner_type} / ${r.status}`;
    typeCounts[k] = (typeCounts[k] || 0) + 1;
  }
  for (const [k, c] of Object.entries(typeCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${k}: ${c}`);
  }

  console.log("\n=== AGENT RUNS (recent 10) ===");
  const { data: runs } = await supabase
    .from("agent_runs")
    .select("agent_name, status, started_at, records_pulled, records_created, records_updated, errors")
    .order("started_at", { ascending: false })
    .limit(10);
  for (const r of runs ?? []) {
    const errs = Array.isArray(r.errors) ? r.errors.length : 0;
    console.log(`  ${r.started_at?.slice(0, 19)} ${r.agent_name} [${r.status}] pulled=${r.records_pulled ?? 0} created=${r.records_created ?? 0} updated=${r.records_updated ?? 0} errors=${errs}`);
  }

  console.log("\n=== ENRICHMENT QUEUE ===");
  console.log("Total pending:", await count("enrichment_queue", (q) => q.eq("status", "pending")));
  console.log("Total failed:", await count("enrichment_queue", (q) => q.eq("status", "failed")));
  console.log("Total processed:", await count("enrichment_queue", (q) => q.not("processed_at", "is", null)));

  console.log("\n=== RECENT LEAD ACTIVITIES ===");
  const { data: acts } = await supabase
    .from("lead_activities")
    .select("type, channel, created_at")
    .order("created_at", { ascending: false })
    .limit(8);
  for (const a of acts ?? []) console.log(`  ${a.created_at?.slice(0, 19)} ${a.type} via ${a.channel}`);

  console.log("\n=== TIER 1 ZIP DISTRIBUTION (ladbs_permits only) ===");
  const TIER1 = ["90272", "90402", "91001", "91104", "90265", "90210", "90077", "90049", "91302", "91364", "90212", "90069"];
  for (const z of TIER1) {
    const c = await count("leads", (q) => q.eq("source", "ladbs_permits").eq("zip_code", z));
    const w = await count("leads", (q) => q.eq("source", "ladbs_permits").eq("zip_code", z).not("owner_name", "is", null));
    console.log(`  ${z}: ${c} permits, ${w} with owner`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
