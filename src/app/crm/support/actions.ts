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
const VALID_STATUSES = ["pending", "new", "in_progress", "review", "verified_complete", "reopened"];

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
  pending?: boolean;
}) {
  if (!input.title?.trim()) return { error: "Title is required" };
  if (!VALID_CATEGORIES.includes(input.category)) return { error: "Invalid category" };
  if (!VALID_PRIORITIES.includes(input.priority)) return { error: "Invalid priority" };

  const supabase = createServiceClient();
  const [submittedBy, assignedTo] = await Promise.all([
    currentActorName(),
    developerName(supabase),
  ]);

  // Pending tickets are logged but not yet ready to start — no due date
  // needed, and Drew isn't notified until it's moved to New.
  const status = input.pending ? "pending" : "new";

  const { data, error } = await supabase
    .from("support_tickets")
    .insert({
      title: input.title.trim(),
      description: input.description?.trim() || null,
      category: input.category,
      priority: input.priority,
      due_date: input.due_date || null,
      status,
      submitted_by: submittedBy,
      assigned_to: assignedTo,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  if (status === "new") {
    const ticket = await fetchTicketForEmail(supabase, data.id);
    if (ticket) await notifyDrewNewTicket(ticket);
  }

  revalidatePath("/crm/support");
  return { success: true, id: data.id };
}

/** Moves a pending ticket to New — notifies Drew, same as a fresh ticket
 * would have if it hadn't been created as pending. */
export async function markReadyToStart(ticketId: string) {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("support_tickets")
    .update({ status: "new" })
    .eq("id", ticketId);
  if (error) return { error: error.message };

  const ticket = await fetchTicketForEmail(supabase, ticketId);
  if (ticket) await notifyDrewNewTicket(ticket);

  revalidatePath("/crm/support");
  revalidatePath(`/crm/support/${ticketId}`);
  return { success: true };
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

/** Manual status override — the corrective tool for tickets stuck in the
 * wrong state (e.g. accidentally approved). Sends no notification emails,
 * unlike the workflow actions; the DB trigger still logs the status_change
 * to the activity feed. Clears archived_at when leaving verified_complete
 * so the "only Verified Complete tickets are archived" invariant holds. */
export async function setTicketStatus(ticketId: string, status: string) {
  if (!VALID_STATUSES.includes(status)) return { error: "Invalid status" };

  const supabase = createServiceClient();
  const { data: current, error: fetchError } = await supabase
    .from("support_tickets")
    .select("status, archived_at")
    .eq("id", ticketId)
    .single();
  if (fetchError) return { error: fetchError.message };
  if (current.status === status) return { success: true };

  const update: Record<string, unknown> = { status };
  if (current.archived_at && status !== "verified_complete") {
    update.archived_at = null;
  }

  const { error } = await supabase
    .from("support_tickets")
    .update(update)
    .eq("id", ticketId);
  if (error) return { error: error.message };

  revalidatePath("/crm/support");
  revalidatePath(`/crm/support/${ticketId}`);
  return { success: true };
}

/** Undo an accidental completion: Verified Complete → In Progress. Guarded
 * server-side like archiveTicket. Archived tickets must be unarchived first
 * so a reopened ticket is never invisible in the default list. The DB
 * trigger logs the status_change activity row. */
export async function reopenTicket(ticketId: string) {
  const supabase = createServiceClient();
  const { data: current, error: fetchError } = await supabase
    .from("support_tickets")
    .select("status, archived_at")
    .eq("id", ticketId)
    .single();
  if (fetchError) return { error: fetchError.message };
  if (current.status !== "verified_complete") {
    return { error: "Only Verified Complete tickets can be reopened." };
  }
  if (current.archived_at) {
    return { error: "Unarchive this ticket first, then reopen it." };
  }

  const { error } = await supabase
    .from("support_tickets")
    .update({ status: "in_progress" })
    .eq("id", ticketId);
  if (error) return { error: error.message };

  revalidatePath("/crm/support");
  revalidatePath(`/crm/support/${ticketId}`);
  return { success: true };
}

/** Only Verified Complete tickets can be archived -- enforced here, not
 * just in the UI, since this is a real invariant, not a suggestion. */
export async function archiveTicket(ticketId: string) {
  const supabase = createServiceClient();
  const { data: current, error: fetchError } = await supabase
    .from("support_tickets")
    .select("status")
    .eq("id", ticketId)
    .single();
  if (fetchError) return { error: fetchError.message };
  if (current.status !== "verified_complete") {
    return { error: "Only Verified Complete tickets can be archived." };
  }

  const { error } = await supabase
    .from("support_tickets")
    .update({ archived_at: new Date().toISOString() })
    .eq("id", ticketId);
  if (error) return { error: error.message };

  await supabase.from("ticket_activity").insert({
    ticket_id: ticketId,
    actor: await currentActorName(),
    action: "archived",
  });

  revalidatePath("/crm/support");
  revalidatePath(`/crm/support/${ticketId}`);
  return { success: true };
}

export async function unarchiveTicket(ticketId: string) {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("support_tickets")
    .update({ archived_at: null })
    .eq("id", ticketId);
  if (error) return { error: error.message };

  await supabase.from("ticket_activity").insert({
    ticket_id: ticketId,
    actor: await currentActorName(),
    action: "unarchived",
  });

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
