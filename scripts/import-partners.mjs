// Bulk-import partner contacts from an Apollo (or similar) CSV into partner_leads.
//
// Usage:
//   node scripts/import-partners.mjs --file <path.csv> --type "Architect" [--source "Cold Outreach"] [--dry-run]
//
// CSV columns the script understands (case-insensitive, Apollo-style):
//   First Name, Last Name, Title, Company, Email, Person Linkedin Url, City, State
//
// Dedupes on contact_email (skips rows where the email already exists in partner_leads).
//
// Requires env vars:
//   NEXT_PUBLIC_SUPABASE_URL (or hardcoded fallback below)
//   SUPABASE_SERVICE_ROLE_KEY

import { readFileSync } from "node:fs";
import { argv, exit } from "node:process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, "..", ".env.local") });

const KNOWN_PARTNER_TYPES = new Set([
  "Architect",
  "Realtor / Real Estate Agent",
  "Insurance Agent / Adjuster",
  "Expediter / Permit Runner",
  "Interior Designer",
  "Real Estate Attorney",
  "CPA / Wealth Advisor",
  "Escrow Officer",
  "Structural / Geotech Engineer",
  "Fire / Water Restoration",
  "HOA / Property Manager",
  "Other",
]);

function parseArgs() {
  const args = { file: null, type: null, source: "Cold Outreach", dryRun: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--file") args.file = argv[++i];
    else if (a === "--type") args.type = argv[++i];
    else if (a === "--source") args.source = argv[++i];
    else if (a === "--dry-run") args.dryRun = true;
    else if (a === "--help" || a === "-h") {
      console.log(
        'Usage: node scripts/import-partners.mjs --file leads.csv --type "Architect" [--source "Cold Outreach"] [--dry-run]'
      );
      exit(0);
    }
  }
  if (!args.file) throw new Error("--file is required");
  if (!args.type) throw new Error("--type is required (e.g., 'Architect')");
  if (!KNOWN_PARTNER_TYPES.has(args.type)) {
    throw new Error(
      `--type must be one of: ${[...KNOWN_PARTNER_TYPES].map((t) => `"${t}"`).join(", ")}`
    );
  }
  return args;
}

// Minimal RFC-4180 CSV parser (handles quoted fields, escaped quotes, CRLF).
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === ",") {
        row.push(field);
        field = "";
      } else if (ch === "\n" || ch === "\r") {
        if (ch === "\r" && text[i + 1] === "\n") i++;
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else {
        field += ch;
      }
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.length > 1 || (r.length === 1 && r[0] !== ""));
}

function pick(headers, row, ...names) {
  for (const name of names) {
    const idx = headers.findIndex((h) => h.toLowerCase().trim() === name.toLowerCase());
    if (idx >= 0 && row[idx] != null && row[idx].trim() !== "") return row[idx].trim();
  }
  return null;
}

function mapRow(headers, row, args) {
  const email = pick(headers, row, "Email", "email", "Work Email", "Primary Email");
  if (!email || !email.includes("@")) return null;
  const first = pick(headers, row, "First Name", "first_name", "First");
  const last = pick(headers, row, "Last Name", "last_name", "Last");
  const company = pick(headers, row, "Company", "Company Name", "Organization", "company_firm");
  const title = pick(headers, row, "Title", "Job Title");
  const linkedin = pick(headers, row, "Person Linkedin Url", "LinkedIn Url", "linkedin_url");
  const phone = pick(headers, row, "Phone", "Direct Phone", "Mobile Phone", "Work Direct Phone");
  const city = pick(headers, row, "City");
  const state = pick(headers, row, "State");
  const partnerName = [first, last].filter(Boolean).join(" ") || email;

  const notesParts = [];
  if (title) notesParts.push(`Title: ${title}`);
  if (city || state) notesParts.push(`Location: ${[city, state].filter(Boolean).join(", ")}`);
  notesParts.push(`Imported from Apollo on ${new Date().toISOString().slice(0, 10)}`);

  return {
    partner_name: partnerName,
    company_firm: company,
    partner_type: args.type,
    specialization: title,
    source: args.source,
    contact_email: email.toLowerCase(),
    contact_phone: phone,
    linkedin_url: linkedin,
    referral_agreement_status: "Not Started",
    referral_fee: 5000,
    notes: notesParts.join(" | "),
    assigned_to: "Drew Quevedo",
    status: "New Lead",
  };
}

async function main() {
  const args = parseArgs();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dzudtdhmvnuipqyoogem.supabase.co";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY env var is required");
  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const csvText = readFileSync(args.file, "utf8");
  const rows = parseCsv(csvText);
  if (rows.length < 2) throw new Error("CSV is empty or has no data rows");
  const headers = rows[0].map((h) => h.trim());

  const candidates = [];
  let skippedNoEmail = 0;
  for (let i = 1; i < rows.length; i++) {
    const mapped = mapRow(headers, rows[i], args);
    if (mapped) candidates.push(mapped);
    else skippedNoEmail++;
  }

  console.log(`Parsed ${rows.length - 1} CSV rows → ${candidates.length} valid, ${skippedNoEmail} skipped (no email).`);

  const emails = candidates.map((c) => c.contact_email);
  const existing = new Set();
  const chunkSize = 200;
  for (let i = 0; i < emails.length; i += chunkSize) {
    const chunk = emails.slice(i, i + chunkSize);
    const { data, error } = await supabase
      .from("partner_leads")
      .select("contact_email")
      .in("contact_email", chunk);
    if (error) throw new Error(`Dedup query failed: ${error.message}`);
    for (const r of data ?? []) if (r.contact_email) existing.add(r.contact_email);
  }

  const toInsert = candidates.filter((c) => !existing.has(c.contact_email));
  const dupes = candidates.length - toInsert.length;
  console.log(`Dedupe: ${dupes} already in partner_leads, ${toInsert.length} new to insert.`);

  if (args.dryRun) {
    console.log("\n--dry-run: not inserting. Sample of first 3 rows that would be inserted:");
    console.log(JSON.stringify(toInsert.slice(0, 3), null, 2));
    return;
  }

  if (toInsert.length === 0) {
    console.log("Nothing to insert. Exiting.");
    return;
  }

  let inserted = 0;
  let failed = 0;
  for (let i = 0; i < toInsert.length; i += chunkSize) {
    const batch = toInsert.slice(i, i + chunkSize);
    const { error, count } = await supabase
      .from("partner_leads")
      .insert(batch, { count: "exact" });
    if (error) {
      failed += batch.length;
      console.error(`Batch ${i / chunkSize + 1} failed:`, error.message);
    } else {
      inserted += count ?? batch.length;
      console.log(`Batch ${i / chunkSize + 1}: +${count ?? batch.length}`);
    }
  }

  console.log(`\nDone. Inserted ${inserted}, failed ${failed}.`);
}

main().catch((err) => {
  console.error(err);
  exit(1);
});
