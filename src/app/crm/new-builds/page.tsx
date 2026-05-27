import { createServiceClient } from "@/lib/supabase/server";
import NewBuildsView from "@/components/crm/NewBuildsView";

export const dynamic = "force-dynamic";

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
  "90212",
  "90069",
];

export default async function NewBuildsPage() {
  const supabase = createServiceClient();

  const [permitsRes, recentRunRes] = await Promise.all([
    supabase
      .from("leads")
      .select(
        "id, address, zip_code, apn, subsource, property_value, owner_name, owner_mailing_address, owner_type, enrichment_status, created_at, updated_at, tags"
      )
      .eq("source", "ladbs_permits")
      .order("property_value", { ascending: false, nullsFirst: false })
      .order("updated_at", { ascending: false })
      .limit(500),
    supabase
      .from("agent_runs")
      .select("agent_name, status, started_at, records_pulled, records_updated, metadata")
      .in("agent_name", ["ladbs-scrape", "ladbs-owner-enrich", "assessor-enrich"])
      .order("started_at", { ascending: false })
      .limit(5),
  ]);

  return (
    <NewBuildsView
      permits={permitsRes.data ?? []}
      recentRuns={recentRunRes.data ?? []}
      tier1Zips={TIER1_ZIPS}
      error={permitsRes.error?.message || null}
    />
  );
}
