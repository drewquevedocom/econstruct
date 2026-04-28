import { createServiceClient } from "@/lib/supabase/server";
import LeadsTable from "@/components/crm/LeadsTable";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const supabase = createServiceClient();

  const { data: leads } = await supabase
    .from("leads")
    .select(
      "id, name, email, phone, zip_code, source, lifecycle_stage, lead_score, property_value, enrichment_status, address, owner_name, created_at, updated_at, score_calculated_at"
    )
    .order("lead_score", { ascending: false })
    .order("updated_at", { ascending: false })
    .limit(500);

  return <LeadsTable leads={leads ?? []} />;
}
