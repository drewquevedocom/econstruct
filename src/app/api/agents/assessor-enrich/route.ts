import { runAgent, validateCronSecret } from "@/lib/agents/runner";
import { createServiceClient } from "@/lib/supabase/server";
import { withRetry } from "@/lib/utils/retry";

export const maxDuration = 60;

// LA County Assessor public property search
async function queryAssessor(apn: string) {
  return withRetry(async () => {
    // LA County Assessor API â€” APN lookup
    const cleanApn = apn.replace(/\D/g, ""); // strip non-digits
    const res = await fetch(
      `https://assessor.lacounty.gov/api/properties?ain=${cleanApn}`,
      {
        headers: {
          "User-Agent": "econstruct-leadbot/1.0 (+https://econstructhomes.com/bot)",
        },
      }
    );
    if (!res.ok) {
      const err: any = new Error(`Assessor error ${res.status}`);
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

  const result = await runAgent("assessor-enrich", async () => {
    const supabase = createServiceClient();

    // Leads with APN but missing owner_name or property_value
    const { data: leads, error } = await supabase
      .from("leads")
      .select("id, apn")
      .not("apn", "is", null)
      .or("owner_name.is.null,property_value.is.null")
      .limit(50);

    if (error) throw new Error(`Fetch failed: ${error.message}`);
    if (!leads?.length) return { records_pulled: 0, records_updated: 0 };

    let updated = 0;
    const errors: string[] = [];

    for (const lead of leads) {
      try {
        await new Promise((r) => setTimeout(r, 1000)); // 1 req/sec rate limit

        const data = await queryAssessor(lead.apn!);
        const property = data?.properties?.[0] ?? data;

        if (!property) continue;

        const ownerName = property.owner_name ?? property.ownerName ?? null;
        const propertyValue =
          property.assessed_value ?? property.assessedValue ?? null;
        const mailingAddress =
          property.mailing_address ?? property.mailingAddress ?? null;

        // Classify owner type
        let ownerType = "individual";
        if (ownerName) {
          const upper = ownerName.toUpperCase();
          if (/\bLL\.?C\.?\b/.test(upper) || upper.includes("LIMITED LIABILITY")) ownerType = "llc";
          else if (/\bTRUST\b|\bTR\b|\bTRSTEE?\b/.test(upper)) ownerType = "trust";
          else if (/\bCORP\b|\bINC\b|\bCO\b/.test(upper)) ownerType = "corporation";
        }

        await supabase
          .from("leads")
          .update({
            owner_name: ownerName,
            property_value: propertyValue,
            owner_mailing_address: mailingAddress,
            owner_type: ownerType,
          })
          .eq("id", lead.id);

        await supabase.from("lead_activities").insert({
          lead_id: lead.id,
          type: "enrichment",
          channel: "system",
          metadata: { source: "la_assessor", owner_name: ownerName, property_value: propertyValue },
        });

        updated++;
      } catch (err: any) {
        errors.push(`lead ${lead.id}: ${err.message}`);
      }
    }

    return { records_pulled: leads.length, records_updated: updated, errors };
  });

  return Response.json(result);
}

