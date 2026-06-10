import { runAgent, validateCronSecret } from "@/lib/agents/runner";
import { createServiceClient } from "@/lib/supabase/server";

export const maxDuration = 60;

const APOLLO_API_BASE = "https://api.apollo.io/api/v1";
const APOLLO_API_KEY = process.env.APOLLO_API_KEY;

const PARTNER_REFRESH_CONFIGS = [
  {
    partnerType: "Realtor / Real Estate Agent",
    weeklyTarget: 60,
    personTitles: ["realtor", "broker", "real estate agent", "listing agent"],
    personSeniorities: ["owner", "founder", "partner", "vp", "director", "manager"],
    qKeywords: "real estate",
    organizationLocations: ["Los Angeles County", "Los Angeles"],
  },
  {
    partnerType: "Real Estate Attorney",
    weeklyTarget: 30,
    personTitles: ["real estate attorney", "property litigation attorney", "attorney"],
    personSeniorities: ["owner", "founder", "partner", "vp", "director"],
    qKeywords: "real estate property litigation",
    organizationLocations: ["Los Angeles"],
  },
  {
    partnerType: "Architect",
    weeklyTarget: 40,
    personTitles: ["principal", "founder", "architect"],
    personSeniorities: ["owner", "founder", "partner", "vp", "director"],
    qKeywords: "architecture design",
    organizationLocations: ["Los Angeles County"],
  },
  {
    partnerType: "Interior Designer",
    weeklyTarget: 25,
    personTitles: ["principal designer", "founder", "interior designer"],
    personSeniorities: ["owner", "founder", "partner", "vp", "director"],
    qKeywords: "design interior",
    organizationLocations: ["Los Angeles County"],
  },
  {
    partnerType: "Insurance Agent / Adjuster",
    weeklyTarget: 25,
    personTitles: ["adjuster", "claims", "insurance agent"],
    personSeniorities: ["owner", "founder", "partner", "vp", "director", "manager"],
    qKeywords: "insurance claims",
    organizationLocations: ["Los Angeles"],
  },
  {
    partnerType: "Expediter / Permit Runner",
    weeklyTarget: 15,
    personTitles: ["expediter", "permit runner", "permit expeditor"],
    personSeniorities: ["owner", "founder", "partner", "vp", "director", "manager"],
    qKeywords: "LADBS permit",
    organizationLocations: ["Los Angeles"],
  },
  {
    partnerType: "CPA / Wealth Advisor",
    weeklyTarget: 25,
    personTitles: ["cpa", "wealth advisor", "financial advisor"],
    personSeniorities: ["owner", "founder", "partner", "vp", "director"],
    qKeywords: "real estate",
    organizationLocations: ["Los Angeles"],
  },
  {
    partnerType: "Escrow Officer",
    weeklyTarget: 20,
    personTitles: ["escrow officer"],
    personSeniorities: ["owner", "founder", "partner", "vp", "director", "manager"],
    qKeywords: "real estate",
    organizationLocations: ["Los Angeles County"],
  },
  {
    partnerType: "Structural / Geotech Engineer",
    weeklyTarget: 20,
    personTitles: ["principal", "structural engineer", "geotechnical engineer", "geotech engineer"],
    personSeniorities: ["owner", "founder", "partner", "vp", "director"],
    qKeywords: "structural",
    organizationLocations: ["Los Angeles"],
  },
  {
    partnerType: "Fire / Water Restoration",
    weeklyTarget: 15,
    personTitles: ["restoration", "fire damage", "water damage"],
    personSeniorities: ["owner", "founder", "partner", "vp", "director", "manager"],
    qKeywords: "restoration fire damage water damage",
    organizationLocations: ["Los Angeles"],
  },
] as const;

type ApolloSearchPerson = {
  id?: string;
  person_id?: string;
  first_name?: string | null;
  last_name?: string | null;
  name?: string | null;
  title?: string | null;
  linkedin_url?: string | null;
  email?: string | null;
  has_email?: boolean;
  organization?: {
    name?: string | null;
    primary_domain?: string | null;
    industry?: string | null;
  } | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
};

type ApolloBulkPerson = {
  id?: string;
  person_id?: string;
  first_name?: string | null;
  last_name?: string | null;
  name?: string | null;
  title?: string | null;
  linkedin_url?: string | null;
  email?: string | null;
  personal_emails?: string[] | null;
  phone_numbers?: Array<{ sanitized_number?: string | null }> | null;
  organization?: {
    name?: string | null;
    primary_domain?: string | null;
    industry?: string | null;
  } | null;
  state?: string | null;
  city?: string | null;
  country?: string | null;
};

function normalizeEmail(email: string | null | undefined) {
  return email ? email.trim().toLowerCase() : null;
}

function displayName(person: ApolloBulkPerson | ApolloSearchPerson, email: string) {
  const combined = `${person.first_name ?? ""} ${person.last_name ?? ""}`.trim();
  if (combined) return combined;
  if (person.name?.trim()) return person.name.trim();
  const localPart = email.split("@")[0] || email;
  return localPart.replace(/[._-]+/g, " ").trim() || email;
}

function addBusinessDays(days: number) {
  const date = new Date();
  let added = 0;
  while (added < days) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    if (day !== 0 && day !== 6) added++;
  }
  return date.toISOString().slice(0, 10);
}

async function apolloSearchPeople(config: (typeof PARTNER_REFRESH_CONFIGS)[number], page: number) {
  if (!APOLLO_API_KEY) throw new Error("APOLLO_API_KEY not set");

  const params = new URLSearchParams();
  for (const title of config.personTitles) params.append("person_titles[]", title);
  for (const seniority of config.personSeniorities) params.append("person_seniorities[]", seniority);
  for (const location of config.organizationLocations) params.append("organization_locations[]", location);
  params.append("contact_email_status[]", "verified");
  params.set("q_keywords", config.qKeywords);
  params.set("include_similar_titles", "false");
  params.set("per_page", "100");
  params.set("page", String(page));

  const res = await fetch(`${APOLLO_API_BASE}/mixed_people/api_search?${params.toString()}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Cache-Control": "no-cache",
      "Content-Type": "application/json",
      "x-api-key": APOLLO_API_KEY,
    },
    body: "{}",
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Apollo search ${res.status}: ${JSON.stringify(data).slice(0, 300)}`);
  }

  return data as { total_entries?: number; people?: ApolloSearchPerson[] };
}

async function apolloBulkEnrich(ids: string[]) {
  if (!APOLLO_API_KEY) throw new Error("APOLLO_API_KEY not set");

  const res = await fetch(`${APOLLO_API_BASE}/people/bulk_match?reveal_personal_emails=true`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Cache-Control": "no-cache",
      "Content-Type": "application/json",
      "x-api-key": APOLLO_API_KEY,
    },
    body: JSON.stringify({
      details: ids.map((id) => ({ id })),
      reveal_personal_emails: true,
      run_waterfall_email: false,
      run_waterfall_phone: false,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Apollo bulk_match ${res.status}: ${JSON.stringify(data).slice(0, 300)}`);
  }

  const matches = (data.matches ?? data.people ?? []) as ApolloBulkPerson[];
  return matches;
}

async function insertPartnerLeads(params: {
  supabase: ReturnType<typeof createServiceClient>;
  partnerType: string;
  people: ApolloBulkPerson[];
  searchLabel: string;
}) {
  const emails = params.people
    .map((person) => normalizeEmail(person.email ?? person.personal_emails?.[0]))
    .filter((email): email is string => Boolean(email));

  if (!emails.length) {
    return { inserted: 0, duplicates: 0, skippedMissingEmail: params.people.length };
  }

  const existing = new Set<string>();
  for (let i = 0; i < emails.length; i += 200) {
    const chunk = emails.slice(i, i + 200);
    const { data, error } = await params.supabase
      .from("partner_leads")
      .select("contact_email")
      .in("contact_email", chunk);
    if (error) throw new Error(`Dedup query failed: ${error.message}`);
    for (const row of data ?? []) {
      if (row.contact_email) existing.add(String(row.contact_email).toLowerCase());
    }
  }

  const today = new Date().toISOString().slice(0, 10);
  const nextFollowUp = addBusinessDays(2);
  const rows: Array<Record<string, string | number | null>> = [];
  let duplicates = 0;
  let skippedMissingEmail = 0;
  const seen = new Set<string>();

  for (const person of params.people) {
    const email = normalizeEmail(person.email ?? person.personal_emails?.[0]);
    if (!email) {
      skippedMissingEmail++;
      continue;
    }
    if (seen.has(email) || existing.has(email)) {
      duplicates++;
      continue;
    }
    seen.add(email);

    const partnerName = displayName(person, email);
    const notes = [
      `Apollo refresh ${today}`,
      `Search label: ${params.searchLabel}`,
      person.title ? `Title: ${person.title}` : null,
      person.organization?.name ? `Company: ${person.organization.name}` : null,
      [person.city, person.state, person.country].filter(Boolean).length
        ? `Location: ${[person.city, person.state, person.country].filter(Boolean).join(", ")}`
        : null,
    ]
      .filter(Boolean)
      .join(" | ");

    rows.push({
      partner_name: partnerName,
      company_firm: person.organization?.name ?? null,
      partner_type: params.partnerType,
      specialization: person.title ?? null,
      source: "Cold Outreach",
      contact_email: email,
      contact_phone: person.phone_numbers?.[0]?.sanitized_number ?? null,
      linkedin_url: person.linkedin_url ?? null,
      how_we_met: "Apollo refresh",
      referral_agreement_status: "Not Started",
      referral_fee: 5000,
      notes,
      next_follow_up_date: nextFollowUp,
      assigned_to: "Drew Quevedo",
      status: "New Lead",
    });
  }

  if (!rows.length) {
    return { inserted: 0, duplicates, skippedMissingEmail };
  }

  let inserted = 0;
  for (let i = 0; i < rows.length; i += 200) {
    const batch = rows.slice(i, i + 200);
    const { error, count } = await params.supabase
      .from("partner_leads")
      .insert(batch, { count: "exact" });
    if (error) throw new Error(`Partner insert failed: ${error.message}`);
    inserted += count ?? batch.length;
  }

  return { inserted, duplicates, skippedMissingEmail };
}

export async function POST(req: Request) {
  if (!validateCronSecret(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const result = await runAgent("partner-refresh", async () => {
    const supabase = createServiceClient();
    const byType: Array<Record<string, unknown>> = [];
    let recordsPulled = 0;
    let recordsInserted = 0;
    const errors: string[] = [];

    for (const config of PARTNER_REFRESH_CONFIGS) {
      try {
        const collected: ApolloSearchPerson[] = [];
        const maxPages = 3;
        for (let page = 1; page <= maxPages; page++) {
            const search = await apolloSearchPeople(config, page);
          const people = search.people ?? [];
          collected.push(...people);
          if (people.length < 100) break;
          if (collected.length >= config.weeklyTarget * 3) break;
        }

        recordsPulled += collected.length;

        const ids = collected
          .map((person) => person.id ?? person.person_id)
          .filter((id): id is string => Boolean(id));

        if (!ids.length) {
          byType.push({
            partnerType: config.partnerType,
            weeklyTarget: config.weeklyTarget,
            searchHits: collected.length,
            enriched: 0,
            inserted: 0,
            duplicates: 0,
            skippedMissingEmail: collected.length,
          });
          continue;
        }

        const searchLabel = `${config.qKeywords} · ${config.organizationLocations.join(" / ")}`;
        let enrichedCount = 0;
        let insertedCount = 0;
        let duplicatesCount = 0;
        let skippedMissingEmailCount = 0;
        let cursor = 0;

        while (cursor < ids.length && insertedCount < config.weeklyTarget) {
          const batchIds = ids.slice(cursor, cursor + 10);
          cursor += 10;
          const enriched = await apolloBulkEnrich(batchIds);
          enrichedCount += enriched.length;
          const outcome = await insertPartnerLeads({
            supabase,
            partnerType: config.partnerType,
            people: enriched,
            searchLabel,
          });
          insertedCount += outcome.inserted;
          duplicatesCount += outcome.duplicates;
          skippedMissingEmailCount += outcome.skippedMissingEmail;
        }

        recordsInserted += insertedCount;
        byType.push({
          partnerType: config.partnerType,
          weeklyTarget: config.weeklyTarget,
          searchHits: collected.length,
          enriched: enrichedCount,
          inserted: insertedCount,
          duplicates: duplicatesCount,
          skippedMissingEmail: skippedMissingEmailCount,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        errors.push(`${config.partnerType}: ${message}`);
        byType.push({
          partnerType: config.partnerType,
          weeklyTarget: config.weeklyTarget,
          error: message,
        });
      }
    }

    return {
      records_pulled: recordsPulled,
      records_updated: recordsInserted,
      errors,
      metadata: {
        source: "Apollo mixed_people/api_search + people/bulk_match",
        byType,
      },
    };
  });

  return Response.json(result);
}
