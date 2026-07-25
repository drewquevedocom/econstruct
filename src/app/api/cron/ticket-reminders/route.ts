import { validateCronSecret } from "@/lib/agents/runner";
import { createServiceClient } from "@/lib/supabase/server";
import { notifyOverdueTicket, type TicketForEmail } from "@/lib/email/ticketEmails";

export const maxDuration = 30;

// Vercel Cron (vercel.json) triggers via GET with Authorization: Bearer
// $CRON_SECRET — same convention validateCronSecret already checks. POST is
// also exported so this can be triggered manually the same way as the other
// agent routes in this codebase.
export async function GET(req: Request) {
  return handleReminderRun(req);
}

export async function POST(req: Request) {
  return handleReminderRun(req);
}

async function handleReminderRun(req: Request) {
  if (!validateCronSecret(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = createServiceClient();
  const todayIso = new Date().toISOString().slice(0, 10);

  const { data: overdue, error } = await supabase
    .from("support_tickets")
    .select(
      "id, ref_number, title, description, category, priority, due_date, submitted_by, assigned_to, last_reminder_sent_at"
    )
    .lt("due_date", todayIso)
    .neq("status", "verified_complete")
    .order("due_date", { ascending: true });

  if (error) {
    return Response.json({ ok: false, error: error.message }, { status: 500 });
  }

  const eligible = (overdue ?? []).filter((t) => {
    if (!t.last_reminder_sent_at) return true;
    return t.last_reminder_sent_at.slice(0, 10) < todayIso;
  });

  if (!eligible.length) {
    return Response.json({ ok: true, sent: 0, message: "No overdue tickets due for a reminder." });
  }

  const ticketsForEmail: TicketForEmail[] = eligible.map((t) => ({
    id: t.id,
    ref_number: t.ref_number,
    title: t.title,
    description: t.description,
    category: t.category,
    priority: t.priority,
    due_date: t.due_date,
    submitted_by: t.submitted_by,
    assigned_to: t.assigned_to,
  }));

  await notifyOverdueTicket(ticketsForEmail);

  const nowIso = new Date().toISOString();
  const { error: updateError } = await supabase
    .from("support_tickets")
    .update({ last_reminder_sent_at: nowIso })
    .in(
      "id",
      eligible.map((t) => t.id)
    );

  if (updateError) {
    return Response.json(
      { ok: false, sent: eligible.length, error: `Email sent but failed to update last_reminder_sent_at: ${updateError.message}` },
      { status: 500 }
    );
  }

  return Response.json({
    ok: true,
    sent: eligible.length,
    tickets: eligible.map((t) => `#REQ-${t.ref_number}: ${t.title}`),
  });
}
