/**
 * LADBS Permit Scraper — econstruct Lead Gen
 * Scrapes eplan.ladbs.org for new permits in Tier 1 zip codes.
 * Filters by type + valuation, deduplicates by APN, upserts to Supabase.
 *
 * Run: npx tsx scripts/ladbs-scrape.ts
 * Schedule: GitHub Actions daily 3am PT
 */

import { chromium } from "playwright";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const TIER1_ZIPS = [
  "90272", "90402",
  "91001", "91104",
  "90265",
  "90210", "90077",
  "90049",
  "91302", "91364",
];

const PERMIT_TYPES = ["new_construction", "demolition", "major_remodel", "fire_rebuild", "addition"];
const MIN_VALUATION = 500_000;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
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
  contractor?: string;
  architect?: string;
}

async function scrapeZip(
  page: any,
  zip: string
): Promise<PermitRecord[]> {
  const results: PermitRecord[] = [];

  try {
    await page.goto("https://eplan.ladbs.org/LADBSWeb/welcome.do", {
      waitUntil: "networkidle",
      timeout: 30_000,
    });

    // Navigate to permit search
    await page.click('[href*="permitSearch"], a:has-text("Permit Search")');
    await page.waitForLoadState("networkidle");

    // Fill zip code search
    await page.fill('[name="zipCode"], input[placeholder*="zip"]', zip);
    await page.selectOption('[name="permitType"], select[id*="type"]', { label: "All" });
    await page.click('button[type="submit"], input[type="submit"]');
    await page.waitForLoadState("networkidle");
    await sleep(2000); // Rate limit: 1 req / 2s

    // Extract permit rows
    const rows = await page.$$eval("table.results tr, .permit-row", (rows: any[]) =>
      rows.slice(1).map((row) => {
        const cells = [...row.querySelectorAll("td")].map((td: any) => td.innerText.trim());
        return {
          permit_number: cells[0] ?? "",
          address: cells[1] ?? "",
          permit_type: cells[2] ?? "",
          valuation_raw: cells[3] ?? "0",
          apn: cells[4] ?? "",
          contractor: cells[5] ?? "",
          architect: cells[6] ?? "",
        };
      })
    );

    for (const row of rows) {
      const valuation = parseFloat(row.valuation_raw.replace(/[$,]/g, "")) || 0;
      const permitTypeLower = row.permit_type.toLowerCase();

      if (valuation < MIN_VALUATION) continue;
      if (!PERMIT_TYPES.some((t) => permitTypeLower.includes(t.replace("_", " ")))) continue;

      results.push({
        apn: row.apn || undefined,
        address: row.address,
        zip_code: zip,
        permit_type: row.permit_type,
        valuation,
        permit_number: row.permit_number,
        contractor: row.contractor || undefined,
        architect: row.architect || undefined,
      });
    }
  } catch (err: any) {
    console.error(`Error scraping zip ${zip}:`, err.message);
  }

  return results;
}

async function upsertPermit(permit: PermitRecord): Promise<"created" | "updated" | "skipped"> {
  // Check for existing lead by APN (if available) or address
  let existing = null;

  if (permit.apn) {
    const { data } = await supabase
      .from("leads")
      .select("id")
      .eq("apn", permit.apn)
      .single();
    existing = data;
  }

  if (!existing) {
    const { data } = await supabase
      .from("leads")
      .select("id")
      .ilike("address", `%${permit.address.split(",")[0]}%`)
      .single();
    existing = data;
  }

  const leadData = {
    source: "ladbs_permits",
    sub_source: permit.permit_type,
    address: permit.address,
    zip_code: permit.zip_code,
    apn: permit.apn ?? null,
    property_value: permit.valuation,
    lifecycle_stage: "new",
    tags: ["ladbs_permit", permit.permit_type.toLowerCase().replace(/\s+/g, "_")],
    metadata: {
      permit_number: permit.permit_number,
      contractor: permit.contractor,
      architect: permit.architect,
    },
  };

  if (existing) {
    await supabase.from("leads").update(leadData).eq("id", existing.id);
    return "updated";
  } else {
    const { data: newLead } = await supabase
      .from("leads")
      .insert(leadData)
      .select("id")
      .single();

    if (newLead) {
      await supabase.from("enrichment_queue").insert({ lead_id: newLead.id });
    }
    return "created";
  }
}

async function main() {
  console.log("🏗️  econstruct LADBS Scraper starting...");

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const context = await browser.newContext({
    userAgent: "econstruct-leadbot/1.0 (+https://econstructinc.com/bot)",
  });
  const page = await context.newPage();

  let totalPulled = 0;
  let totalCreated = 0;
  let totalUpdated = 0;
  const errors: string[] = [];

  for (const zip of TIER1_ZIPS) {
    console.log(`Scraping zip ${zip}...`);
    try {
      const permits = await scrapeZip(page, zip);
      totalPulled += permits.length;
      console.log(`  Found ${permits.length} qualifying permits`);

      for (const permit of permits) {
        try {
          const outcome = await upsertPermit(permit);
          if (outcome === "created") totalCreated++;
          else if (outcome === "updated") totalUpdated++;
        } catch (err: any) {
          errors.push(`${permit.address}: ${err.message}`);
        }
      }
    } catch (err: any) {
      errors.push(`zip ${zip}: ${err.message}`);
    }

    await sleep(2000); // Rate limit between zips
  }

  await browser.close();

  const status = errors.length === 0 ? "success" : totalCreated + totalUpdated > 0 ? "partial" : "failed";
  await logAgentRun(status, totalPulled, totalCreated, totalUpdated, errors.slice(0, 50));
  console.log(`✅ Done: ${totalCreated} created, ${totalUpdated} updated, ${errors.length} errors`);
  process.exit(errors.length > 0 && status === "failed" ? 1 : 0);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
