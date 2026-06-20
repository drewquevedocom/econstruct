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

const STATUSES = ["New Lead", "Contacted", "Replied", "Agreement Sent", "Active Partner", "Inactive"];
const AGREEMENT_STATUSES = ["Not Started", "Sent", "Signed", "Active"];

function addDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

// Fires when a partner is promoted to Active Partner — celebrates the win
// to Drew + Frank inboxes via the Instantly /emails/test path.
async function notifyPartnerPromotion(params: {
  partnerName: string;
  partnerType: string | null;
  contactEmail: string | null;
  company: string | null;
}) {
  const notifyList = (process.env.HOT_LEAD_NOTIFY_EMAILS || process.env.FRANK_EMAIL || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (notifyList.length === 0) return;
  const apiKey = process.env.INSTANTLY_API_KEY;
  if (!apiKey) return;
  try {
    await fetch("https://api.instantly.ai/api/v2/emails/test", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        eaccount: "info@econstructllc.com",
        to_address_email_list: notifyList.join(","),
        subject: `🎉 NEW PARTNER SIGNED: ${params.partnerName} (${params.partnerType || "Partner"})`,
        body: {
          html: `<div style="font-family:Arial,sans-serif;max-width:600px;color:#222;">
            <h2 style="color:#0E7C5C;margin-top:0;">🎉 New Active Partner</h2>
            <p><strong>${params.partnerName}</strong>${params.company ? ` from <strong>${params.company}</strong>` : ""} just moved to <strong>Active Partner</strong> status. Welcome them and lock in the relationship.</p>
            <table style="width:100%;border-collapse:collapse;margin:16px 0;background:#FAF9F6;border-radius:8px;">
              ${params.partnerType ? `<tr><td style="padding:8px 12px;font-weight:bold;color:#666;">Type</td><td style="padding:8px 12px;">${params.partnerType}</td></tr>` : ""}
              ${params.contactEmail ? `<tr><td style="padding:8px 12px;font-weight:bold;color:#666;">Email</td><td style="padding:8px 12px;"><a href="mailto:${params.contactEmail}" style="color:#B8963E;">${params.contactEmail}</a></td></tr>` : ""}
              <tr><td style="padding:8px 12px;font-weight:bold;color:#666;">CRM Action</td><td style="padding:8px 12px;color:#0E7C5C;">✓ Status → Active Partner · 30-day check-in task auto-created · Promoted to Active Partners panel</td></tr>
            </table>
            <p style="color:#666;font-size:13px;">Pull them up in the dedicated Active Partners panel at <a href="https://econstructhomes.com/crm/partners" style="color:#B8963E;">/crm/partners</a>.</p>
          </div>`,
        },
      }),
    });
  } catch (err) {
    console.error("Failed to notify partner promotion:", err);
  }
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

  // Detect promotion to Active Partner so we can fire the celebration notify.
  const { data: priorRow } = await supabase
    .from("partner_leads")
    .select("status, partner_name, partner_type, contact_email, company_firm")
    .eq("id", partnerLeadId)
    .maybeSingle();
  const wasPromoted = priorRow?.status !== "Active Partner" && status === "Active Partner";

  const updates: Record<string, string> = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (status === "Contacted") {
    updates.last_contact_date = new Date().toISOString().slice(0, 10);
    updates.next_follow_up_date = addDays(5);
  }
  if (status === "Replied") {
    updates.next_follow_up_date = addDays(1); // Frank should act on a reply same/next day
  }
  if (status === "Agreement Sent") {
    updates.next_follow_up_date = addDays(7);
  }
  if (status === "Active Partner") {
    updates.date_signed = new Date().toISOString().slice(0, 10);
    updates.next_follow_up_date = addDays(30);
  }
  if (status === "Inactive") {
    updates.next_follow_up_date = addDays(90); // re-check in 90d in case they change their mind
  }

  const { error } = await supabase.from("partner_leads").update(updates).eq("id", partnerLeadId);
  if (error) return { error: error.message };

  if (status === "Contacted") {
    await supabase.from("partner_tasks").insert({
      partner_lead_id: partnerLeadId,
      title: "Check in — did they respond to the cold email?",
      due_date: addDays(5),
    });
  }

  if (status === "Replied") {
    await supabase.from("partner_tasks").insert({
      partner_lead_id: partnerLeadId,
      title: `Review reply from ${priorRow?.partner_name || "partner"} and send agreement if interested`,
      due_date: addDays(1),
    });
  }

  if (status === "Agreement Sent") {
    await supabase.from("partner_tasks").insert({
      partner_lead_id: partnerLeadId,
      title: `Follow up — ${priorRow?.partner_name || "partner"} hasn't signed yet`,
      due_date: addDays(7),
    });
  }

  if (status === "Active Partner") {
    await supabase.from("partner_tasks").insert({
      partner_lead_id: partnerLeadId,
      title: `Welcome ${priorRow?.partner_name || "new partner"} — send referral playbook + save number`,
      due_date: addDays(2),
    });
    await supabase.from("partner_tasks").insert({
      partner_lead_id: partnerLeadId,
      title: `Monthly check-in with ${priorRow?.partner_name || "partner"} — any referrals this month?`,
      due_date: addDays(30),
      is_recurring: true,
      recurrence: "monthly",
    });
  }

  if (status === "Inactive") {
    await supabase.from("partner_tasks").insert({
      partner_lead_id: partnerLeadId,
      title: `${priorRow?.partner_name || "Partner"} marked Inactive — re-engage in 90 days?`,
      due_date: addDays(90),
    });
  }

  if (wasPromoted && priorRow) {
    await notifyPartnerPromotion({
      partnerName: priorRow.partner_name,
      partnerType: priorRow.partner_type,
      contactEmail: priorRow.contact_email,
      company: priorRow.company_firm,
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

  // Capture prior state so we can detect the Active Partner promotion below.
  const { data: priorRow } = await supabase
    .from("partner_leads")
    .select("status, partner_name, partner_type, contact_email, company_firm")
    .eq("id", partnerLeadId)
    .maybeSingle();
  const wasPromoted =
    priorRow?.status !== "Active Partner" &&
    (agreementStatus === "Signed" || agreementStatus === "Active");

  const { data: lead, error } = await supabase
    .from("partner_leads")
    .update(updates)
    .eq("id", partnerLeadId)
    .select("partner_name, partner_type, contact_email, company_firm")
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
      title: `Welcome ${lead.partner_name} — send referral playbook + monthly check-in`,
      due_date: addDays(2),
    });
    await supabase.from("partner_tasks").insert({
      partner_lead_id: partnerLeadId,
      title: `Monthly check-in with ${lead.partner_name} — any referrals this month?`,
      due_date: addDays(30),
      is_recurring: true,
      recurrence: "monthly",
    });
  }

  if (wasPromoted) {
    await notifyPartnerPromotion({
      partnerName: lead.partner_name,
      partnerType: lead.partner_type,
      contactEmail: lead.contact_email,
      company: lead.company_firm,
    });
  }

  revalidatePath("/crm/partners");
  return { success: true };
}
