import { runAgent, validateCronSecret } from "@/lib/agents/runner";
import { createServiceClient } from "@/lib/supabase/server";
import { withRetry } from "@/lib/utils/retry";

export const maxDuration = 60;

const TIER1_ZIPS = [
  "90272", "90402", // Palisades
  "91001", "91104", // Altadena
  "90265",          // Malibu
  "90210", "90077", // Beverly Hills / Bel Air
  "90049",          // Brentwood
  "91302", "91364", // Calabasas / Hidden Hills
];

// LA County Recorder API â€” pull recent deed transfers
async function fetchDeedTransfers(zipCode: string, daysBack = 90) {
  return withRetry(async () => {
    const since = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
    const res = await fetch(
      `https://assessor.lacounty.gov/api/transfers?zip=${zipCode}&since=${since}&type=grant_deed,quitclaim,trust_deed`,
      {
        headers: {
          "User-Agent": "econstruct-leadbot/1.0 (+https://econstructhomes.com/bot)",
        },
      }
    );
    if (!res.ok) {
      const err: any = new Error(`Recorder error ${res.status}`);
      err.status = res.status;
      throw err;
    }
    return res.json();
  });
}

export async function POST(req: Request) {
  if (!validateCronSecret(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const result = await runAgent("deed-monitor", async () => {
    const supabase = createServiceClient();
    let totalPulled = 0;
    let totalCreated = 0;
    let totalUpdated = 0;
    const errors: string[] = [];

    for (const zip of TIER1_ZIPS) {
      try {
        await new Promise((r) => setTimeout(r, 1000)); // rate limit

        const transfers = await fetchDeedTransfers(zip);
        const records = transfers?.transfers ?? transfers ?? [];

        totalPulled += records.length;

        for (const record of records) {
          const apn = record.apn ?? record.ain;
          if (!apn) continue;

          const leadData = {
            apn,
            source: "la_recorder",
            sub_source: record.transfer_type ?? "deed_transfer",
            address: record.property_address ?? record.address,
            zip_code: zip,
            owner_name: record.grantee_name ?? record.new_owner,
            owner_mailing_address: record.grantee_mailing_address,
            lifecycle_stage: "new",
            tags: ["deed_transfer"],
          };

          const { data: existing } = await supabase
            .from("leads")
            .select("id")
            .eq("apn", apn)
            .single();

          if (existing) {
            await supabase
              .from("leads")
              .update({ ...leadData, updated_at: new Date().toISOString() })
              .eq("id", existing.id);
            totalUpdated++;
          } else {
            const { data: newLead } = await supabase
              .from("leads")
              .insert(leadData)
              .select("id")
              .single();

            if (newLead) {
              // Queue for Apollo enrichment
              await supabase.from("enrichment_queue").insert({ lead_id: newLead.id });
              totalCreated++;
            }
          }
        }
      } catch (err: any) {
        errors.push(`zip ${zip}: ${err.message}`);
      }
    }

    return {
      records_pulled: totalPulled,
      records_created: totalCreated,
      records_updated: totalUpdated,
      errors,
    };
  });

  return Response.json(result);
}

