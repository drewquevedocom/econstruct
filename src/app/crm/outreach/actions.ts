"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";
import { enrichLeadEmails } from "@/lib/lead-enrichment/email";

const VALID_OUTREACH_STATUSES = [
  "needs_email",
  "email_found",
  "ready_for_email_review",
  "ready_for_mail_review",
  "approved",
  "sent",
  "skipped",
  "do_not_contact",
];

export async function updateOutreachStatus(leadIds: string[], status: string, notes?: string) {
  if (!leadIds.length) return { error: "No leads selected" };
  if (!VALID_OUTREACH_STATUSES.includes(status)) return { error: "Invalid outreach status" };

  const supabase = createServiceClient();
  const now = new Date().toISOString();
  const updates: Record<string, string | boolean | null> = {
    outreach_status: status,
    outreach_status_updated_at: now,
    updated_at: now,
  };

  if (notes !== undefined) updates.outreach_notes = notes || null;
  if (status === "approved") updates.outreach_approved_at = now;
  if (status === "do_not_contact") updates.dnc = true;

  const { error } = await supabase.from("leads").update(updates).in("id", leadIds);
  if (error) return { error: error.message };

  await supabase.from("lead_activities").insert(
    leadIds.map((leadId) => ({
      lead_id: leadId,
      type: "outreach_status_updated",
      channel: "crm",
      metadata: { status, notes: notes || null },
    }))
  );

  revalidatePath("/crm/outreach");
  revalidatePath("/crm/leads");
  return { success: true, updated: leadIds.length };
}

export async function runEmailEnrichmentForSelected(leadIds: string[]) {
  if (!leadIds.length) return { error: "No leads selected" };
  const result = await enrichLeadEmails(leadIds);
  revalidatePath("/crm/outreach");
  revalidatePath("/crm/leads");
  return { success: true, result };
}

export async function markOutreachExported(leadIds: string[]) {
  if (!leadIds.length) return { error: "No leads selected" };
  const supabase = createServiceClient();
  const now = new Date().toISOString();

  const { error } = await supabase
    .from("leads")
    .update({ outreach_exported_at: now, updated_at: now })
    .in("id", leadIds);
  if (error) return { error: error.message };

  await supabase.from("lead_activities").insert(
    leadIds.map((leadId) => ({
      lead_id: leadId,
      type: "outreach_exported",
      channel: "crm",
      metadata: { exported_at: now },
    }))
  );

  revalidatePath("/crm/outreach");
  return { success: true, updated: leadIds.length };
}
