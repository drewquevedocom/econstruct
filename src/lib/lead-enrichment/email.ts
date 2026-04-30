import { createServiceClient } from "@/lib/supabase/server";
import { withRetry } from "@/lib/utils/retry";

const MELISSA_ENDPOINT =
  "https://personator.melissadata.net/v3/WEB/ContactVerify/doContactVerify";
const PDL_ENDPOINT = "https://api.peopledatalabs.com/v5/person/enrich";

const HOT_SCORE_MIN = Number(process.env.EMAIL_ENRICH_MIN_SCORE ?? 70);
const MAX_EMAIL_ATTEMPTS = Number(process.env.EMAIL_ENRICH_MAX_ATTEMPTS ?? 2);

type CandidateLead = {
  id: string;
  name: string | null;
  owner_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  owner_mailing_address: string | null;
  zip_code: string | null;
  lead_score: number | null;
  dnc: boolean | null;
  email_enrichment_attempts: number | null;
};

type ProviderResult = {
  status: "success" | "no_match" | "failed" | "skipped";
  email?: string | null;
  phone?: string | null;
  error?: string | null;
  metadata?: Record<string, unknown>;
};

export type EmailEnrichmentResult = {
  records_pulled: number;
  records_updated: number;
  errors: string[];
  metadata: {
    skipped: number;
    providers: Record<string, { success: number; no_match: number; failed: number; skipped: number }>;
  };
};

function firstOwnerName(lead: CandidateLead) {
  return (lead.owner_name || lead.name || "")
    .split("&")[0]
    .replace(/,TR\b/i, "")
    .replace(/\bTRUST\b/i, "")
    .trim();
}

function splitAddress(value: string | null) {
  if (!value) return { addressLine1: "", city: "", state: "CA", postalCode: "" };
  const normalized = value.replace(/\s+/g, " ").trim();
  const match = normalized.match(/^(.+?)\s+([A-Z][A-Z\s]+?)\s+(CA)\s+(\d{5}(?:-\d{4})?)$/);
  if (!match) return { addressLine1: normalized, city: "", state: "CA", postalCode: "" };
  return {
    addressLine1: match[1],
    city: match[2].trim(),
    state: match[3],
    postalCode: match[4],
  };
}

function providerCounts() {
  return { success: 0, no_match: 0, failed: 0, skipped: 0 };
}

async function runMelissa(lead: CandidateLead): Promise<ProviderResult> {
  const key = process.env.MELISSA_LICENSE_KEY || process.env.MELISSA_API_KEY;
  if (!key) return { status: "skipped", error: "MELISSA_LICENSE_KEY not set" };

  const mailing = splitAddress(lead.owner_mailing_address || lead.address);
  if (!mailing.addressLine1) return { status: "skipped", error: "No address for Melissa append" };

  const params = new URLSearchParams({
    id: key,
    act: "Check,Append",
    cols: "GrpName,GrpPhone,GrpEmail",
    a1: mailing.addressLine1,
    city: mailing.city,
    state: mailing.state,
    postal: mailing.postalCode || lead.zip_code || "",
    format: "json",
  });

  const data = await withRetry(async () => {
    const res = await fetch(`${MELISSA_ENDPOINT}?${params.toString()}`, {
      headers: { Accept: "application/json" },
    });
    const body = await res.json();
    if (!res.ok) throw new Error(`Melissa ${res.status}: ${JSON.stringify(body).slice(0, 300)}`);
    return body;
  });

  const record = data?.Records?.[0] ?? data?.records?.[0] ?? {};
  const email =
    record.EmailAddress ||
    record.Email ||
    record.email ||
    record.email_address ||
    null;
  const phone = record.PhoneNumber || record.Phone || record.phone || null;

  if (!email && !phone) {
    return { status: "no_match", metadata: { result_codes: record.Results ?? null } };
  }

  return {
    status: email ? "success" : "no_match",
    email,
    phone,
    metadata: { result_codes: record.Results ?? null, source: "melissa" },
  };
}

async function runPdl(lead: CandidateLead): Promise<ProviderResult> {
  const key = process.env.PEOPLE_DATA_LABS_API_KEY || process.env.PDL_API_KEY;
  if (!key) return { status: "skipped", error: "PEOPLE_DATA_LABS_API_KEY not set" };

  const name = firstOwnerName(lead);
  if (!name) return { status: "skipped", error: "No owner name for PDL append" };

  const params = new URLSearchParams({
    name,
    location: lead.owner_mailing_address || lead.address || lead.zip_code || "Los Angeles, CA",
    pretty: "false",
  });

  const data = await withRetry(async () => {
    const res = await fetch(`${PDL_ENDPOINT}?${params.toString()}`, {
      headers: {
        Accept: "application/json",
        "X-Api-Key": key,
      },
    });
    const body = await res.json();
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`PDL ${res.status}: ${JSON.stringify(body).slice(0, 300)}`);
    return body;
  });

  const email =
    data?.data?.emails?.find((item: { address?: string }) => item.address)?.address ??
    data?.data?.work_email ??
    data?.data?.personal_emails?.[0] ??
    null;

  if (!email) return { status: "no_match", metadata: { likelihood: data?.likelihood ?? null } };
  return { status: "success", email, metadata: { likelihood: data?.likelihood ?? null, source: "pdl" } };
}

async function hasRecentProviderAttempt(leadId: string, provider: string) {
  const supabase = createServiceClient();
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { data } = await supabase
    .from("email_enrichment_attempts")
    .select("id")
    .eq("lead_id", leadId)
    .eq("provider", provider)
    .gte("created_at", since)
    .limit(1)
    .maybeSingle();
  return Boolean(data);
}

async function recordAttempt(
  leadId: string,
  provider: string,
  result: ProviderResult,
  costEstimate: number | null
) {
  const supabase = createServiceClient();
  await supabase.from("email_enrichment_attempts").insert({
    lead_id: leadId,
    provider,
    status: result.status,
    email: result.email ?? null,
    phone: result.phone ?? null,
    cost_estimate: costEstimate,
    error: result.error ?? null,
    metadata: result.metadata ?? {},
  });
}

async function applyResult(lead: CandidateLead, result: ProviderResult) {
  const supabase = createServiceClient();
  const nextAttempts = (lead.email_enrichment_attempts ?? 0) + 1;
  const updates: Record<string, string | number | boolean | null> = {
    email_enrichment_attempts: nextAttempts,
    last_email_enrichment_at: new Date().toISOString(),
    outreach_status_updated_at: new Date().toISOString(),
  };

  if (result.email) {
    updates.email = result.email;
    updates.email_valid = true;
    updates.outreach_status = "ready_for_email_review";
  } else if (nextAttempts >= MAX_EMAIL_ATTEMPTS && (lead.owner_mailing_address || lead.address)) {
    updates.outreach_status = "ready_for_mail_review";
  } else {
    updates.outreach_status = "needs_email";
  }

  if (result.phone && !lead.phone) updates.phone = result.phone;

  await supabase.from("leads").update(updates).eq("id", lead.id);
  await supabase.from("lead_activities").insert({
    lead_id: lead.id,
    type: result.email ? "email_enriched" : "email_enrichment_attempted",
    channel: "system",
    metadata: {
      email_found: Boolean(result.email),
      attempts: nextAttempts,
      next_status: updates.outreach_status,
    },
  });
}

async function fetchCandidates(leadIds?: string[]) {
  const supabase = createServiceClient();
  let query = supabase
    .from("leads")
    .select(
      "id, name, owner_name, email, phone, address, owner_mailing_address, zip_code, lead_score, dnc, email_enrichment_attempts"
    )
    .gte("lead_score", HOT_SCORE_MIN)
    .is("email", null)
    .or("dnc.is.null,dnc.eq.false")
    .lt("email_enrichment_attempts", MAX_EMAIL_ATTEMPTS)
    .order("lead_score", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(25);

  if (leadIds?.length) query = query.in("id", leadIds);

  const { data, error } = await query;
  if (error) throw new Error(`Email enrichment candidate fetch failed: ${error.message}`);
  return (data ?? []) as CandidateLead[];
}

export async function enrichLeadEmails(leadIds?: string[]): Promise<EmailEnrichmentResult> {
  const candidates = await fetchCandidates(leadIds);
  const errors: string[] = [];
  const providers: EmailEnrichmentResult["metadata"]["providers"] = {
    melissa: providerCounts(),
    pdl: providerCounts(),
  };
  let updated = 0;
  let skipped = 0;

  for (const lead of candidates) {
    if ((lead.lead_score ?? 0) < HOT_SCORE_MIN || lead.email || lead.dnc) {
      skipped++;
      continue;
    }

    let finalResult: ProviderResult | null = null;
    for (const provider of ["melissa", "pdl"] as const) {
      if (await hasRecentProviderAttempt(lead.id, provider)) {
        providers[provider].skipped++;
        continue;
      }

      try {
        const result = provider === "melissa" ? await runMelissa(lead) : await runPdl(lead);
        providers[provider][result.status]++;
        await recordAttempt(lead.id, provider, result, provider === "melissa" ? 0.15 : 0.15);
        finalResult = result;
        if (result.email) break;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        errors.push(`lead ${lead.id} ${provider}: ${message}`);
        const failed: ProviderResult = { status: "failed", error: message };
        providers[provider].failed++;
        await recordAttempt(lead.id, provider, failed, provider === "melissa" ? 0.15 : 0.15);
        finalResult = failed;
      }
    }

    if (finalResult) {
      await applyResult(lead, finalResult);
      updated++;
    } else {
      skipped++;
    }
  }

  return {
    records_pulled: candidates.length,
    records_updated: updated,
    errors,
    metadata: { skipped, providers },
  };
}
