import { runAgent, validateCronSecret } from "@/lib/agents/runner";
import { createServiceClient } from "@/lib/supabase/server";

export const maxDuration = 60;

const TIER1_ZIPS = [
  "90272", "90402", // Palisades
  "91001", "91104", // Altadena
  "90265",          // Malibu
  "90210", "90077", // Beverly Hills / Bel Air
  "90049",          // Brentwood
  "91302", "91364", // Calabasas / Hidden Hills
];

// LA County Assessor ArcGIS — 2025 Parcels with DINS fire damage data
const ARCGIS_SERVICE =
  "https://services.arcgis.com/RmCCgQtiZLDCtblq/arcgis/rest/services/2025_Parcels_with_DINS_data/FeatureServer/5/query";

async function fetchParcels(zipPattern: string, offset = 0) {
  const params = new URLSearchParams({
    where: `SitusZIP LIKE '${zipPattern}%'`,
    outFields:
      "APN_1,SitusFullAddress,SitusZIP,Fire_Name,DAMAGE_1,Roll_LandValue,Roll_ImpValue,LastSaleAmount,CENTER_LAT,CENTER_LON",
    f: "json",
    resultRecordCount: "200",
    resultOffset: String(offset),
    returnGeometry: "false",
  });
  const res = await fetch(`${ARCGIS_SERVICE}?${params}`);
  if (!res.ok) throw new Error(`ArcGIS error ${res.status}`);
  const data = await res.json();
  return data.features ?? [];
}

const VALID_DAMAGE = ["destroyed", "major", "minor", "affected"];

function parseDamage(raw: string | null): string | null {
  if (!raw) return null;
  const lower = raw.toLowerCase();
  return VALID_DAMAGE.find((v) => lower.includes(v)) ?? null;
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
        const features = await fetchParcels(zip);
        totalPulled += features.length;

        for (const f of features) {
          const a = f.attributes;
          const apn = a.APN_1;
          if (!apn) continue;

          const totalValue =
            (a.Roll_LandValue || 0) + (a.Roll_ImpValue || 0);
          const fire =
            (a.Fire_Name || "unknown").toLowerCase().replace(/ /g, "_");

          const leadData = {
            apn,
            source: "dins_calfire",
            address: a.SitusFullAddress || null,
            zip_code: (a.SitusZIP || "").split("-")[0],
            fire_damage_status: parseDamage(a.DAMAGE_1),
            property_value:
              totalValue > 0 ? totalValue : a.LastSaleAmount || null,
            latitude: a.CENTER_LAT || null,
            longitude: a.CENTER_LON || null,
            lifecycle_stage: "new",
            tags: [`${fire}_fire`, "fire_rebuild"],
            enrichment_status: "pending",
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
              await supabase
                .from("enrichment_queue")
                .insert({ lead_id: newLead.id });
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
