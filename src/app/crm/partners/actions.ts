"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";

const PARTNER_TYPES = [
  "Architect",
  "Realtor / Real Estate Agent",
  "Insurance Agent / Adjuster",
  "Expediter / Permit Runner",
  "General Contractor (subcontract partner)",
  "HOA / Property Manager",
  "Other",
];

const SOURCES = [
  "AIA LA Event",
  "BNI / Networking",
  "Cold Outreach",
  "Referral from Frank",
  "Inbound / Found Us",
  "Other",
];

const STATUSES = ["New Lead", "Contacted", "Agreement Sent", "Active Partner", "Inactive"];
const AGREEMENT_STATUSES = ["Not Started", "Sent", "Signed", "Active"];

function addDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function addBusinessDays(days: number) {
  const date = new Date();
  let added = 0;
  while (added < days) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    if (day !== 0 && day !== 6) added++;
  }
  return date.toISOString().slice(0, 10);
}

function value(formData: FormData, key: string) {
  const raw = formData.get(key);
  return typeof raw === "string" && raw.trim() ? raw.trim() : null;
}

export async function createPartnerLead(_prevState: unknown, formData: FormData) {
  const partnerName = value(formData, "partner_name");
  const partnerType = value(formData, "partner_type") || "Other";
  const source = value(formData, "source") || "Other";

  if (!partnerName) return { error: "Partner Name is required." };
  if (!PARTNER_TYPES.includes(partnerType)) return { error: "Invalid Partner Type." };
  if (!SOURCES.includes(source)) return { error: "Invalid Source." };

  const supabase = createServiceClient();
  const nextFollowUp = addBusinessDays(2);

  const { data: lead, error } = await supabase
    .from("partner_leads")
    .insert({
      partner_name: partnerName,
      company_firm: value(formData, "company_firm"),
      partner_type: partnerType,
      specialization: value(formData, "specialization"),
      source,
      contact_email: value(formData, "contact_email"),
      contact_phone: value(formData, "contact_phone"),
      linkedin_url: value(formData, "linkedin_url"),
      how_we_met: value(formData, "how_we_met"),
      referral_agreement_status: value(formData, "referral_agreement_status") || "Not Started",
      referral_fee: Number(value(formData, "referral_fee") || 5000),
      notes: value(formData, "notes"),
      next_follow_up_date: nextFollowUp,
      assigned_to: value(formData, "assigned_to") || "Drew Quevedo",
      status: "New Lead",
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  await supabase.from("partner_tasks").insert({
    partner_lead_id: lead.id,
    title: "Send initial outreach email",
    due_date: nextFollowUp,
  });

  revalidatePath("/crm/partners");
  return { success: true };
}

export async function updatePartnerStatus(partnerLeadId: string, status: string) {
  if (!STATUSES.includes(status)) return { error: "Invalid status." };

  const supabase = createServiceClient();
  const updates: Record<string, string> = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (status === "Contacted") {
    updates.last_contact_date = new Date().toISOString().slice(0, 10);
    updates.next_follow_up_date = addDays(5);
  }

  const { error } = await supabase.from("partner_leads").update(updates).eq("id", partnerLeadId);
  if (error) return { error: error.message };

  if (status === "Contacted") {
    await supabase.from("partner_tasks").insert({
      partner_lead_id: partnerLeadId,
      title: "Check in - did they respond?",
      due_date: addDays(5),
    });
  }

  revalidatePath("/crm/partners");
  return { success: true };
}

export async function updateAgreementStatus(partnerLeadId: string, agreementStatus: string) {
  if (!AGREEMENT_STATUSES.includes(agreementStatus)) return { error: "Invalid agreement status." };

  const supabase = createServiceClient();
  const updates: Record<string, string | null> = {
    referral_agreement_status: agreementStatus,
    updated_at: new Date().toISOString(),
  };

  if (agreementStatus === "Sent") {
    updates.status = "Agreement Sent";
    updates.next_follow_up_date = addDays(7);
  }

  if (agreementStatus === "Signed" || agreementStatus === "Active") {
    updates.status = "Active Partner";
    updates.date_signed = new Date().toISOString().slice(0, 10);
    updates.next_follow_up_date = addDays(30);
  }

  const { data: lead, error } = await supabase
    .from("partner_leads")
    .update(updates)
    .eq("id", partnerLeadId)
    .select("partner_name")
    .single();

  if (error) return { error: error.message };

  if (agreementStatus === "Sent") {
    await supabase.from("partner_tasks").insert({
      partner_lead_id: partnerLeadId,
      title: "Follow up on unsigned agreement",
      due_date: addDays(7),
    });
  }

  if (agreementStatus === "Signed" || agreementStatus === "Active") {
    await supabase.from("partner_tasks").insert({
      partner_lead_id: partnerLeadId,
      title: `Check in with ${lead.partner_name} - any referrals this month?`,
      due_date: addDays(30),
      is_recurring: true,
      recurrence: "monthly",
    });
  }

  revalidatePath("/crm/partners");
  return { success: true };
}
