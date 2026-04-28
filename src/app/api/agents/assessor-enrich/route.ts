import { runAgent, validateCronSecret } from "@/lib/agents/runner";
import { createServiceClient } from "@/lib/supabase/server";
import { withRetry } from "@/lib/utils/retry";

export const maxDuration = 60;

const ATTOM_API_KEY = process.env.ATTOM_API_KEY ?? process.env.ESTATED_API_TOKEN;
const ATTOM_BASE = "https://api.gateway.attomdata.com/propertyapi/v1.0.0";
const LA_COUNTY_FIPS = "06037";
const MAX_BATCH_SIZE = 20;

type CandidateLead = {
  id: string;
  address: string | null;
  zip_code: string | null;
  apn: string | null;
  owner_name: string | null;
};

type EnrichmentQueueItem = {
  id: string;
  lead_id: string;
  status: string;
  attempts: number;
  last_error: string | null;
  leads: CandidateLead | CandidateLead[] | null;
};

type AttomOwner = {
  corporateindicator?: string;
  owner1?: { fullname?: string; firstnameandmi?: string; lastname?: string };
  owner2?: { fullname?: string; firstnameandmi?: string; lastname?: string };
  owner3?: { fullname?: string };
  owner4?: { fullname?: string };
  absenteeownerstatus?: string;
  mailingaddressoneline?: string;
};

type AttomProperty = {
  identifier?: {
    apn?: string;
    attomId?: number;
    fips?: string;
  };
  address?: {
    oneLine?: string;
    line1?: string;
    line2?: string;
    postal1?: string;
  };
  owner?: AttomOwner;
};

type AttomResponse = {
  status?: {
    code?: number;
    msg?: string;
    total?: number;
    transactionID?: string;
  };
  property?: AttomProperty[];
};

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function splitAddress(address: string | null, zipCode: string | null) {
  if (!address) return null;

  const normalized = normalizeWhitespace(address);
  const match = normalized.match(
    /^(.+?)\s+([A-Z][A-Z\s]+?)\s+(CA)\s+(\d{5}(?:-\d{4})?)$/
  );

  if (match) {
    return {
      address1: match[1],
      address2: `${match[2]}, ${match[3]} ${match[4]}`,
    };
  }

  if (zipCode) {
    return {
      address1: normalized.replace(new RegExp(`\\s+${zipCode}$`), ""),
      address2: `CA ${zipCode}`,
    };
  }

  return null;
}

function ownerNames(owner: AttomOwner | undefined) {
  return [
    owner?.owner1?.fullname,
    owner?.owner2?.fullname,
    owner?.owner3?.fullname,
    owner?.owner4?.fullname,
  ]
    .map((name) => name?.trim())
    .filter(Boolean) as string[];
}

function inferOwnerType(owner: AttomOwner | undefined) {
  if (!owner) return null;
  return owner.corporateindicator === "Y" ? "entity" : "individual";
}

function isRetryableQueueItem(item: EnrichmentQueueItem) {
  if (item.status === "pending") return true;
  if (item.status !== "failed") return false;

  return item.last_error?.startsWith("Estated:") ?? false;
}

async function fetchAttomDetailOwner(params: Record<string, string>) {
  if (!ATTOM_API_KEY) {
    throw new Error("ATTOM_API_KEY not set");
  }

  return withRetry(async () => {
    const query = new URLSearchParams(params);
    const res = await fetch(`${ATTOM_BASE}/property/detailowner?${query.toString()}`, {
      headers: {
        accept: "application/json",
        apikey: ATTOM_API_KEY,
      },
    });
    const data = (await res.json()) as AttomResponse;

    if (!res.ok) {
      const err = new Error(
        `ATTOM ${res.status}: ${data.status?.msg ?? "request failed"}`
      ) as Error & { status?: number };
      err.status = res.status;
      throw err;
    }

    return data;
  });
}

async function fetchBestAttomProperty(lead: CandidateLead) {
  if (lead.apn) {
    const apnResult = await fetchAttomDetailOwner({
      fips: LA_COUNTY_FIPS,
      apn: lead.apn,
    });

    if (apnResult.property?.[0]) {
      return { property: apnResult.property[0], lookup: "apn", response: apnResult };
    }
  }

  const addressParts = splitAddress(lead.address, lead.zip_code);
  if (!addressParts) {
    return { property: null, lookup: "none", response: null };
  }

  const addressResult = await fetchAttomDetailOwner(addressParts);
  return {
    property: addressResult.property?.[0] ?? null,
    lookup: "address",
    response: addressResult,
  };
}

export async function POST(req: Request) {
  if (!validateCronSecret(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const result = await runAgent("assessor-enrich", async () => {
    if (!ATTOM_API_KEY) {
      return {
        records_pulled: 0,
        records_updated: 0,
        metadata: { skipped: true, reason: "ATTOM_API_KEY not set" },
      };
    }

    const supabase = createServiceClient();

    const { data: queue, error } = await supabase
      .from("enrichment_queue")
      .select(`
        id,
        lead_id,
        status,
        attempts,
        last_error,
        leads!inner (
          id,
          address,
          zip_code,
          apn,
          owner_name
        )
      `)
      .in("status", ["pending", "failed"])
      .is("processed_at", null)
      .not("leads.address", "is", null)
      .is("leads.owner_name", null)
      .order("created_at", { ascending: true })
      .limit(100);

    if (error) {
      throw new Error(`Queue fetch failed: ${error.message}`);
    }

    const candidates =
      (queue as EnrichmentQueueItem[] | null)
        ?.filter(isRetryableQueueItem)
        .slice(0, MAX_BATCH_SIZE) ?? [];

    if (!candidates.length) {
      return { records_pulled: 0, records_updated: 0 };
    }

    let updated = 0;
    const errors: string[] = [];

    for (const item of candidates) {
      const lead = Array.isArray(item.leads) ? item.leads[0] : item.leads;
      if (!lead?.id) continue;

      try {
        const attom = await fetchBestAttomProperty(lead);
        if (!attom.property) {
          await supabase
            .from("enrichment_queue")
            .update({
              status: "failed",
              last_error: `ATTOM: ${attom.response?.status?.msg ?? "No property found"}`,
            })
            .eq("id", item.id);
          continue;
        }

        const ownerName = ownerNames(attom.property.owner).join(" & ") || null;
        if (!ownerName) {
          await supabase
            .from("enrichment_queue")
            .update({ status: "failed", last_error: "ATTOM: owner name missing" })
            .eq("id", item.id);
          continue;
        }

        const updates: Record<string, string | null> = {
          owner_name: ownerName,
          owner_mailing_address:
            attom.property.owner?.mailingaddressoneline?.trim() || null,
          owner_type: inferOwnerType(attom.property.owner),
          apn: attom.property.identifier?.apn ?? lead.apn,
          address: attom.property.address?.oneLine ?? lead.address,
          zip_code: attom.property.address?.postal1 ?? lead.zip_code,
          enrichment_status: "property_enriched",
          updated_at: new Date().toISOString(),
        };

        await supabase.from("leads").update(updates).eq("id", lead.id);

        await supabase
          .from("enrichment_queue")
          .update({
            status: "pending",
            attempts: 0,
            last_error: null,
          })
          .eq("id", item.id);

        await supabase.from("lead_activities").insert({
          lead_id: lead.id,
          type: "property_enriched",
          channel: "attom",
          metadata: {
            source: "attom",
            lookup: attom.lookup,
            attom_id: attom.property.identifier?.attomId ?? null,
            absentee_owner_status:
              attom.property.owner?.absenteeownerstatus ?? null,
            fields_added: Object.keys(updates).filter((key) => updates[key] !== null),
          },
        });

        updated++;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        errors.push(`lead ${lead.id}: ${message}`);
        await supabase
          .from("enrichment_queue")
          .update({
            status: "failed",
            attempts: item.attempts + 1,
            last_error: message,
          })
          .eq("id", item.id);
      }
    }

    return {
      records_pulled: candidates.length,
      records_updated: updated,
      errors,
    };
  });

  return Response.json(result);
}
