"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";
import { getCurrentRole } from "@/lib/auth/getCurrentRole";
import {
  notifyDrewNewTicket,
  notifyFrankForReview,
  notifyDrewDecision,
  notifyNewComment,
  type TicketForEmail,
} from "@/lib/email/ticketEmails";

const ATTACHMENT_BUCKET = "ticket-attachments";
const DEV_EMAIL = "dq@drewquevedo.com";

const VALID_CATEGORIES = ["front_end", "back_end", "mobile_app", "other"];
const VALID_PRIORITIES = ["low", "normal", "high", "urgent"];

/** Real name of whoever is logged in. Falls back to a generic (honest, not
 * fabricated) label during the CRM_PASSWORD rollout fallback, where there's
 * no per-user session to attribute to. */
async function currentActorName(): Promise<string> {
  const { fullName } = await getCurrentRole();
  return fullName || "CRM User";
}

/** The developer tickets are assigned to. Looked up from profiles instead of
 * hardcoded so it reflects real seeded data — falls back to "Drew" only if
 * the profiles table hasn't been seeded yet. */
async function developerName(supabase: ReturnType<typeof createServiceClient>): Promise<string> {
  const { data } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("email", DEV_EMAIL)
    .maybeSingle();
  return data?.full_name || "Drew";
}

async function fetchTicketForEmail(
  supabase: ReturnType<typeof createServiceClient>,
  ticketId: string
): Promise<TicketForEmail | null> {
  const { data } = await supabase
    .from("support_tickets")
    .select("id, ref_number, title, description, category, priority, due_date, submitted_by, assigned_to")
    .eq("id", ticketId)
    .single();
  return data as TicketForEmail | null;
}

export async function createTicket(input: {
  title: string;
  description?: string;
  category: string;
  priority: string;
  due_date?: string;
}) {
  if (!input.title?.trim()) return { error: "Title is required" };
  if (!VALID_CATEGORIES.includes(input.category)) return { error: "Invalid category" };
  if (!VALID_PRIORITIES.includes(input.priority)) return { error: "Invalid priority" };

  const supabase = createServiceClient();
  const [submittedBy, assignedTo] = await Promise.all([
    currentActorName(),
    developerName(supabase),
  ]);

  const { data, error } = await supabase
    .from("support_tickets")
    .insert({
      title: input.title.trim(),
      description: input.description?.trim() || null,
      category: input.category,
      priority: input.priority,
      due_date: input.due_date || null,
      status: "new",
      submitted_by: submittedBy,
      assigned_to: assignedTo,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  const ticket = await fetchTicketForEmail(supabase, data.id);
  if (ticket) await notifyDrewNewTicket(ticket);

  revalidatePath("/crm/support");
  return { success: true, id: data.id };
}

export async function setInProgress(ticketId: string) {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("support_tickets")
    .update({ status: "in_progress" })
    .eq("id", ticketId);
  if (error) return { error: error.message };

  revalidatePath("/crm/support");
  revalidatePath(`/crm/support/${ticketId}`);
  return { success: true };
}

export async function submitForReview(ticketId: string) {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("support_tickets")
    .update({ status: "review" })
    .eq("id", ticketId);
  if (error) return { error: error.message };

  const ticket = await fetchTicketForEmail(supabase, ticketId);
  if (ticket) await notifyFrankForReview(ticket);

  revalidatePath("/crm/support");
  revalidatePath(`/crm/support/${ticketId}`);
  return { success: true };
}

export async function approveTicket(ticketId: string) {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("support_tickets")
    .update({ status: "verified_complete" })
    .eq("id", ticketId);
  if (error) return { error: error.message };

  const ticket = await fetchTicketForEmail(supabase, ticketId);
  if (ticket) await notifyDrewDecision(ticket, "Approved");

  revalidatePath("/crm/support");
  revalidatePath(`/crm/support/${ticketId}`);
  return { success: true };
}

export async function sendBack(ticketId: string, note: string) {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("support_tickets")
    .update({ status: "reopened" })
    .eq("id", ticketId);
  if (error) return { error: error.message };

  if (note?.trim()) {
    await supabase.from("ticket_activity").insert({
      ticket_id: ticketId,
      actor: await currentActorName(),
      action: "comment",
      note: note.trim(),
    });
  }

  const ticket = await fetchTicketForEmail(supabase, ticketId);
  if (ticket) await notifyDrewDecision(ticket, "Sent Back");

  revalidatePath("/crm/support");
  revalidatePath(`/crm/support/${ticketId}`);
  return { success: true };
}

export async function addTicketNote(ticketId: string, note: string, attachmentUrl?: string) {
  if (!note?.trim() && !attachmentUrl) return { error: "Note or attachment is required" };

  const actor = await currentActorName();
  const supabase = createServiceClient();
  const { error } = await supabase.from("ticket_activity").insert({
    ticket_id: ticketId,
    actor,
    action: "comment",
    note: note?.trim() || null,
    attachment_url: attachmentUrl || null,
  });
  if (error) return { error: error.message };

  const ticket = await fetchTicketForEmail(supabase, ticketId);
  if (ticket) await notifyNewComment(ticket, actor, note?.trim() || "(attachment)");

  revalidatePath(`/crm/support/${ticketId}`);
  return { success: true };
}

async function ensureAttachmentBucket(supabase: ReturnType<typeof createServiceClient>) {
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === ATTACHMENT_BUCKET);
  if (!exists) {
    await supabase.storage.createBucket(ATTACHMENT_BUCKET, { public: true });
  }
}

export async function uploadTicketAttachment(formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File)) return { error: "No file provided" };

  const supabase = createServiceClient();
  await ensureAttachmentBucket(supabase);

  const ext = file.name.split(".").pop() || "bin";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from(ATTACHMENT_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) return { error: error.message };

  const { data } = supabase.storage.from(ATTACHMENT_BUCKET).getPublicUrl(path);
  return { success: true, url: data.publicUrl };
}
