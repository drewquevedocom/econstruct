import { createAnonClient } from "@/lib/supabase/server";
import LeadsTable from "@/components/crm/LeadsTable";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const supabase = createAnonClient();

  const { data: leads } = await supabase
    .from("leads")
    .select(
      "id, name, email, phone, zip_code, source, lifecycle_stage, lead_score, property_value, enrichment_status, address, owner_name, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(200);

  return <LeadsTable leads={leads ?? []} />;
}
