import { createServiceClient } from "@/lib/supabase/server";
import OutreachQueue from "@/components/crm/OutreachQueue";

export const dynamic = "force-dynamic";

export default async function OutreachPage() {
  const supabase = createServiceClient();
  const attemptsSince = new Date();
  attemptsSince.setHours(attemptsSince.getHours() - 24);

  const [
    leadsRes,
    hotMissingEmailRes,
    mailReadyRes,
    approvedRes,
    exportedRes,
    attemptsRes,
  ] = await Promise.all([
    supabase
      .from("leads")
      .select(
        "id, name, owner_name, email, phone, address, owner_mailing_address, zip_code, source, lifecycle_stage, lead_score, property_value, fire_damage_status, dnc, outreach_status, outreach_notes, outreach_approved_at, outreach_exported_at, created_at, updated_at, email_enrichment_attempts, last_email_enrichment_at"
      )
      .gte("lead_score", 70)
      .or("dnc.is.null,dnc.eq.false")
      .order("lead_score", { ascending: false })
      .order("created_at", { ascending: true })
      .limit(500),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .gte("lead_score", 70)
      .is("email", null)
      .or("dnc.is.null,dnc.eq.false"),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("outreach_status", "ready_for_mail_review")
      .gte("lead_score", 70),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("outreach_status", "approved")
      .gte("lead_score", 70),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .not("outreach_exported_at", "is", null)
      .gte("lead_score", 70),
    supabase
      .from("email_enrichment_attempts")
      .select("provider, status, cost_estimate, created_at")
      .gte("created_at", attemptsSince.toISOString()),
  ]);

  const attempts = attemptsRes.data ?? [];
  const attemptsByProvider: Record<string, { attempts: number; success: number; cost: number }> = {};
  for (const attempt of attempts) {
    const provider = attempt.provider || "unknown";
    if (!attemptsByProvider[provider]) {
      attemptsByProvider[provider] = { attempts: 0, success: 0, cost: 0 };
    }
    attemptsByProvider[provider].attempts++;
    if (attempt.status === "success") attemptsByProvider[provider].success++;
    attemptsByProvider[provider].cost += Number(attempt.cost_estimate ?? 0);
  }

  return (
    <OutreachQueue
      leads={leadsRes.data ?? []}
      metrics={{
        hotMissingEmail: hotMissingEmailRes.count ?? 0,
        mailReady: mailReadyRes.count ?? 0,
        approved: approvedRes.count ?? 0,
        exported: exportedRes.count ?? 0,
        providerStats: attemptsByProvider,
      }}
    />
  );
}
