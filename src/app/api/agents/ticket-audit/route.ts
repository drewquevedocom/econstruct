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
  const viewerEmail = url.searchParams.get("viewer_email");
  if (!id) return Response.json({ error: "id required" }, { status: 400 });

  const supabase = createServiceClient();

  // Resolve the viewer's real profile name rather than trust a passed-in
  // guess — canEditTicketNote matches on exactly what getCurrentRole()
  // returns for the signed-in session, and that may not match what it looks
  // like on paper (nickname, missing seed row, shared-password fallback).
  let viewer: string | null = null;
  let viewerProfile: { full_name: string; active: boolean; role: string } | null = null;
  if (viewerEmail) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, active, role")
      .eq("email", viewerEmail)
      .maybeSingle();
    viewerProfile = profile ?? null;
    // getCurrentRole() only returns a name for an active profile; inactive
    // or missing rows fall back to the shared-password path (fullName: null).
    viewer = profile?.active ? profile.full_name : null;
  }

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
    viewerEmail,
    viewerProfile,
    resolvedViewerName: viewer,
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
