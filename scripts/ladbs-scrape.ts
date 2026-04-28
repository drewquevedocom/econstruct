/**
 * LADBS Permit Ingest - econstruct Lead Gen
 *
 * Pulls official City of LA Open Data building permit records for Tier 1 ZIP
 * codes, filters for residential construction signals, and upserts leads into
 * Supabase. This avoids brittle browser scraping of the LADBS portal.
 *
 * Run: npx tsx scripts/ladbs-scrape.ts
 * Schedule: GitHub Actions daily 3am PT
 */

import { createClient } from "@supabase/supabase-js";
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const LACITY_DATA_API = "https://data.lacity.org/resource";
const SUBMITTED_PERMITS_DATASET = "gwh9-jnip"; // Submitted from 2020 to present
const ISSUED_PERMITS_DATASET = "pi9x-tg5x"; // Issued from 2020 to present

const TIER1_ZIPS = [
  "90272",
  "90402",
  "91001",
  "91104",
  "90265",
  "90210",
  "90077",
  "90049",
  "91302",
  "91364",
];

const MIN_VALUATION = Number(process.env.LADBS_MIN_VALUATION ?? 75_000);
const LOOKBACK_DAYS = Number(process.env.LADBS_LOOKBACK_DAYS ?? 180);
const QUALIFYING_TERMS = [
  "accessory dwelling",
  "addition",
  "adu",
  "demo",
  "demolition",
  "fire",
  "grading",
  "new",
  "rebuild",
  "remodel",
];

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function logAgentRun(
  status: string,
  pulled: number,
  created: number,
  updated: number,
  errors: string[]
) {
  await supabase.from("agent_runs").insert({
    agent_name: "ladbs-scrape",
    run_type: "scheduled",
    status,
    records_pulled: pulled,
    records_created: created,
    records_updated: updated,
    errors,
    ended_at: new Date().toISOString(),
  });
}

interface PermitRecord {
  apn?: string;
  address: string;
  zip_code: string;
  permit_type: string;
  valuation: number;
  permit_number: string;
  submitted_date?: string;
  issue_date?: string;
  status_desc?: string;
  latitude?: number;
  longitude?: number;
}

type SocrataPermit = {
  permit_nbr?: string;
  primary_address?: string;
  zip_code?: string;
  apn?: string;
  permit_type?: string;
  permit_sub_type?: string;
  submitted_date?: string;
  issue_date?: string;
  status_desc?: string;
  valuation?: string;
  work_desc?: string;
  lat?: string;
  lon?: string;
};

function cutoffIso() {
  const date = new Date();
  date.setDate(date.getDate() - LOOKBACK_DAYS);
  return `${date.toISOString().slice(0, 10)}T00:00:00`;
}

function qualifies(row: SocrataPermit) {
  const valuation = Number(row.valuation ?? 0) || 0;
  const text = [row.permit_type, row.permit_sub_type, row.work_desc, row.status_desc]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (valuation >= MIN_VALUATION) return true;

  const permitType = (row.permit_type ?? "").toLowerCase();
  if (permitType.includes("alter/repair")) return false;

  return QUALIFYING_TERMS.some((term) => text.includes(term));
}

async function fetchPermitRows(
  dataset: string,
  zip: string,
  dateField: "submitted_date" | "issue_date"
) {
  const where = [
    `zip_code='${zip}'`,
    "permit_group='Building'",
    "(permit_sub_type='1 or 2 Family Dwelling' OR permit_sub_type like '%Dwelling%')",
    `${dateField} >= '${cutoffIso()}'`,
  ].join(" AND ");

  const params = new URLSearchParams({
    "$limit": "500",
    "$select":
      "permit_nbr,primary_address,zip_code,apn,permit_type,permit_sub_type,submitted_date,issue_date,status_desc,valuation,work_desc,lat,lon",
    "$where": where,
    "$order": `${dateField} DESC`,
  });

  const res = await fetch(`${LACITY_DATA_API}/${dataset}.json?${params}`, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`LA City Open Data ${dataset} ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }

  return (await res.json()) as SocrataPermit[];
}

async function scrapeZip(zip: string): Promise<PermitRecord[]> {
  const seen = new Set<string>();
  const rows = [
    ...(await fetchPermitRows(SUBMITTED_PERMITS_DATASET, zip, "submitted_date")),
    ...(await fetchPermitRows(ISSUED_PERMITS_DATASET, zip, "issue_date")),
  ];

  return rows.filter(qualifies).flatMap((row) => {
    if (!row.permit_nbr || !row.primary_address || !row.zip_code) return [];
    if (seen.has(row.permit_nbr)) return [];
    seen.add(row.permit_nbr);

    return {
      apn: row.apn || undefined,
      address: row.primary_address,
      zip_code: row.zip_code,
      permit_type: [row.permit_type, row.permit_sub_type].filter(Boolean).join(" - "),
      valuation: Number(row.valuation ?? 0) || 0,
      permit_number: row.permit_nbr,
      submitted_date: row.submitted_date,
      issue_date: row.issue_date,
      status_desc: row.status_desc,
      latitude: row.lat ? Number(row.lat) : undefined,
      longitude: row.lon ? Number(row.lon) : undefined,
    };
  });
}

async function upsertPermit(permit: PermitRecord): Promise<"created" | "updated" | "skipped"> {
  let existing = null;

  if (permit.apn) {
    const { data } = await supabase.from("leads").select("id").eq("apn", permit.apn).maybeSingle();
    existing = data;
  }

  if (!existing) {
    const { data } = await supabase
      .from("leads")
      .select("id")
      .ilike("address", `%${permit.address.split(",")[0]}%`)
      .maybeSingle();
    existing = data;
  }

  const leadData = {
    source: "ladbs_permits",
    subsource: permit.permit_type,
    address: permit.address,
    zip_code: permit.zip_code,
    apn: permit.apn ?? null,
    property_value: permit.valuation || null,
    latitude: permit.latitude ?? null,
    longitude: permit.longitude ?? null,
    lifecycle_stage: "new",
    tags: [
      "ladbs_permit",
      permit.permit_number,
      permit.permit_type.toLowerCase().replace(/[^a-z0-9]+/g, "_"),
    ],
    enrichment_status: "pending",
  };

  if (existing) {
    await supabase.from("leads").update({ ...leadData, updated_at: new Date().toISOString() }).eq("id", existing.id);
    return "updated";
  }

  const { data: newLead } = await supabase.from("leads").insert(leadData).select("id").single();

  if (newLead) {
    await supabase.from("enrichment_queue").insert({ lead_id: newLead.id });
  }

  return "created";
}

async function main() {
  console.log("econstruct LADBS Open Data ingest starting...");

  let totalPulled = 0;
  let totalCreated = 0;
  let totalUpdated = 0;
  const errors: string[] = [];

  for (const zip of TIER1_ZIPS) {
    console.log(`Pulling zip ${zip}...`);
    try {
      const permits = await scrapeZip(zip);
      totalPulled += permits.length;
      console.log(`  Found ${permits.length} qualifying permits`);

      for (const permit of permits) {
        try {
          const outcome = await upsertPermit(permit);
          if (outcome === "created") totalCreated++;
          else if (outcome === "updated") totalUpdated++;
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err);
          errors.push(`${permit.address}: ${message}`);
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      errors.push(`zip ${zip}: ${message}`);
    }

    await sleep(300);
  }

  const status = errors.length === 0 ? "success" : totalCreated + totalUpdated > 0 ? "partial" : "failed";
  await logAgentRun(status, totalPulled, totalCreated, totalUpdated, errors.slice(0, 50));
  console.log(`Done: ${totalCreated} created, ${totalUpdated} updated, ${errors.length} errors`);
  process.exit(errors.length > 0 && status === "failed" ? 1 : 0);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
