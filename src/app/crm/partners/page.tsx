import { createServiceClient } from "@/lib/supabase/server";
import PartnerNetworkView from "@/components/crm/PartnerNetworkView";

export const dynamic = "force-dynamic";

export default async function PartnersPage() {
  const supabase = createServiceClient();

  const [leadsRes, templatesRes, tasksRes] = await Promise.all([
    supabase
      .from("partner_leads")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("partner_email_templates")
      .select("id, template_key, name, subject, body, updated_at")
      .order("name", { ascending: true }),
    supabase
      .from("partner_tasks")
      .select("id, partner_lead_id, title, due_date, is_recurring, recurrence, completed_at")
      .is("completed_at", null)
      .order("due_date", { ascending: true }),
  ]);

  return (
    <PartnerNetworkView
      leads={leadsRes.data ?? []}
      templates={templatesRes.data ?? []}
      tasks={tasksRes.data ?? []}
      error={leadsRes.error?.message || templatesRes.error?.message || tasksRes.error?.message}
    />
  );
}
