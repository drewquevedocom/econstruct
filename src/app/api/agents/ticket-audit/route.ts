import { validateCronSecret } from "@/lib/agents/runner";
import { createServiceClient } from "@/lib/supabase/server";
import { canEditTicketNote } from "@/lib/tickets/noteOwnership";

export const maxDuration = 30;

// Read-only debug snapshot for a single ticket's activity feed — actor
// strings and whether canEditTicketNote would currently allow a given
// viewer to edit each comment. Makes no writes. ?id=<uuid>&viewer=<name>
export async function POST(req: Request) {
  if (!validateCronSecret(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const viewer = url.searchParams.get("viewer");
  if (!id) return Response.json({ error: "id required" }, { status: 400 });

  const supabase = createServiceClient();

  const { data: ticket, error: ticketError } = await supabase
    .from("support_tickets")
    .select("id, ref_number, title, status, archived_at")
    .eq("id", id)
    .maybeSingle();
  if (ticketError) return Response.json({ error: ticketError.message }, { status: 500 });
  if (!ticket) return Response.json({ ok: true, ticketFound: false });

  // edited_at (20260731_ticket_note_edits.sql) may not be applied yet in
  // every environment — fall back to the pre-migration column set rather
  // than failing the whole diagnostic on it, same defensive pattern as
  // updateTicketNote().
  let { data: activity, error: activityError } = await supabase
    .from("ticket_activity")
    .select("id, actor, action, note, edited_at, created_at")
    .eq("ticket_id", id)
    .order("created_at", { ascending: false });
  const edited_atMissing =
    activityError && /column .*\bedited_at\b.* does not exist/i.test(activityError.message);
  if (edited_atMissing) {
    const fallback = await supabase
      .from("ticket_activity")
      .select("id, actor, action, note, created_at")
      .eq("ticket_id", id)
      .order("created_at", { ascending: false });
    activity = fallback.data?.map((r) => ({ ...r, edited_at: null })) ?? null;
    activityError = fallback.error;
  }
  if (activityError) return Response.json({ error: activityError.message }, { status: 500 });

  const rows = activity ?? [];
  const comments = rows.filter((r) => r.action === "comment");

  return Response.json({
    ok: true,
    ticketFound: true,
    editedAtColumnMissing: Boolean(edited_atMissing),
    ticket,
    activityRowCount: rows.length,
    commentCount: comments.length,
    comments: comments.map((c) => ({
      id: c.id,
      actor: c.actor,
      hasNote: Boolean(c.note),
      edited: Boolean(c.edited_at),
      created_at: c.created_at,
      editableByViewer: viewer ? canEditTicketNote(c.actor, viewer) : null,
    })),
    otherActivity: rows
      .filter((r) => r.action !== "comment")
      .map((r) => ({ action: r.action, actor: r.actor, created_at: r.created_at })),
  });
}
