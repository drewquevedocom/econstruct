import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const maxDuration = 60;

// This endpoint inserts leads that the outreach agents will cold-email, so it
// must never be callable anonymously. Two callers are legitimate: automation
// holding CRON_SECRET, and a logged-in CRM user whose crm_session cookie
// carries the same HMAC the middleware verifies for /crm pages.
async function verifyCrmCookie(req: NextRequest): Promise<boolean> {
  const value = req.cookies.get("crm_session")?.value;
  const secret = process.env.CRM_COOKIE_SECRET;
  if (!value || !secret) return false;
  try {
    const [payload, signature] = value.split(".");
    if (!payload || !signature) return false;
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const expected = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
    const expectedHex = Array.from(new Uint8Array(expected))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return expectedHex === signature;
  } catch {
    return false;
  }
}

async function isAuthorized(req: NextRequest): Promise<boolean> {
  const auth = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && auth === `Bearer ${cronSecret}`) return true;
  return verifyCrmCookie(req);
}

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

const ALLOWED_SOURCES = new Set([
  "AIA LA Event",
  "BNI / Networking",
  "Cold Outreach",
  "Referral from Frank",
  "Inbound / Found Us",
  "Other",
]);

// RFC-4180-ish CSV parser (handles quoted fields, escaped quotes, CRLF).
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
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

function pick(headers: string[], row: string[], ...names: string[]): string | null {
  for (const name of names) {
    const idx = headers.findIndex((h) => h.toLowerCase().trim() === name.toLowerCase());
    if (idx >= 0 && row[idx] != null && row[idx].trim() !== "") return row[idx].trim();
  }
  return null;
}

type PartnerInsert = {
  partner_name: string;
  company_firm: string | null;
  partner_type: string;
  specialization: string | null;
  source: string;
  contact_email: string;
  contact_phone: string | null;
  linkedin_url: string | null;
  referral_agreement_status: string;
  referral_fee: number | null;
  notes: string;
  assigned_to: string;
  status: string;
};

function mapRow(
  headers: string[],
  row: string[],
  partnerType: string,
  source: string
): PartnerInsert | null {
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

  const notesParts: string[] = [];
  if (title) notesParts.push(`Title: ${title}`);
  if (city || state) notesParts.push(`Location: ${[city, state].filter(Boolean).join(", ")}`);
  notesParts.push(`Imported via /crm/import on ${new Date().toISOString().slice(0, 10)}`);

  return {
    partner_name: partnerName,
    company_firm: company,
    partner_type: partnerType,
    specialization: title,
    source,
    contact_email: email.toLowerCase(),
    contact_phone: phone,
    linkedin_url: linkedin,
    referral_agreement_status: "Not Started",
    // No fee until a real agreement exists — see 20260805_referral_fee_compliance.sql.
    referral_fee: null,
    notes: notesParts.join(" | "),
    assigned_to: "Drew Quevedo",
    status: "New Lead",
  };
}

export async function POST(req: NextRequest) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { csv_text?: string; partner_type?: string; source?: string; dry_run?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const csvText = (body.csv_text || "").trim();
  const partnerType = body.partner_type || "";
  const source = body.source || "Cold Outreach";

  if (!csvText) return NextResponse.json({ error: "csv_text is required" }, { status: 400 });
  if (!KNOWN_PARTNER_TYPES.has(partnerType)) {
    return NextResponse.json(
      { error: `partner_type must be one of: ${[...KNOWN_PARTNER_TYPES].join(", ")}` },
      { status: 400 }
    );
  }
  if (!ALLOWED_SOURCES.has(source)) {
    return NextResponse.json(
      { error: `source must be one of: ${[...ALLOWED_SOURCES].join(", ")}` },
      { status: 400 }
    );
  }

  const rows = parseCsv(csvText);
  if (rows.length < 2) return NextResponse.json({ error: "CSV has no data rows" }, { status: 400 });

  const headers = rows[0].map((h) => h.trim());
  const candidates: PartnerInsert[] = [];
  let skippedNoEmail = 0;
  for (let i = 1; i < rows.length; i++) {
    const mapped = mapRow(headers, rows[i], partnerType, source);
    if (mapped) candidates.push(mapped);
    else skippedNoEmail++;
  }

  // Dedupe within the batch itself first.
  const seenBatch = new Set<string>();
  const uniqueInBatch: PartnerInsert[] = [];
  let dupesInBatch = 0;
  for (const c of candidates) {
    if (seenBatch.has(c.contact_email)) {
      dupesInBatch++;
      continue;
    }
    seenBatch.add(c.contact_email);
    uniqueInBatch.push(c);
  }

  // Dedupe against existing rows in partner_leads.
  const supabase = createServiceClient();
  const emails = uniqueInBatch.map((c) => c.contact_email);
  const existing = new Set<string>();
  const chunkSize = 200;
  for (let i = 0; i < emails.length; i += chunkSize) {
    const chunk = emails.slice(i, i + chunkSize);
    const { data, error } = await supabase
      .from("partner_leads")
      .select("contact_email")
      .in("contact_email", chunk);
    if (error) {
      return NextResponse.json({ error: `Dedup query failed: ${error.message}` }, { status: 500 });
    }
    for (const r of data ?? []) if (r.contact_email) existing.add(r.contact_email);
  }

  const toInsert = uniqueInBatch.filter((c) => !existing.has(c.contact_email));
  const dupesAgainstDb = uniqueInBatch.length - toInsert.length;

  if (body.dry_run) {
    return NextResponse.json({
      dry_run: true,
      csv_rows: rows.length - 1,
      with_email: candidates.length,
      skipped_no_email: skippedNoEmail,
      dupes_in_batch: dupesInBatch,
      dupes_against_db: dupesAgainstDb,
      to_insert: toInsert.length,
      sample: toInsert.slice(0, 3),
    });
  }

  if (toInsert.length === 0) {
    return NextResponse.json({
      inserted: 0,
      csv_rows: rows.length - 1,
      dupes_against_db: dupesAgainstDb,
      note: "No new partners to insert — all already in DB or no valid emails",
    });
  }

  let inserted = 0;
  for (let i = 0; i < toInsert.length; i += chunkSize) {
    const batch = toInsert.slice(i, i + chunkSize);
    const { error, count } = await supabase
      .from("partner_leads")
      .insert(batch, { count: "exact" });
    if (error) {
      return NextResponse.json(
        { error: error.message, inserted_so_far: inserted },
        { status: 500 }
      );
    }
    inserted += count ?? batch.length;
  }

  await supabase.from("agent_runs").insert({
    agent_name: "import-partners",
    run_type: "manual",
    status: "success",
    records_pulled: rows.length - 1,
    records_created: inserted,
    metadata: {
      partner_type: partnerType,
      source,
      skipped_no_email: skippedNoEmail,
      dupes_in_batch: dupesInBatch,
      dupes_against_db: dupesAgainstDb,
    },
    ended_at: new Date().toISOString(),
  });

  return NextResponse.json({
    inserted,
    csv_rows: rows.length - 1,
    with_email: candidates.length,
    skipped_no_email: skippedNoEmail,
    dupes_in_batch: dupesInBatch,
    dupes_against_db: dupesAgainstDb,
  });
}
