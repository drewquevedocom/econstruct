import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/server";
import { getCurrentRole } from "@/lib/auth/getCurrentRole";
import { canEditTicketNote } from "@/lib/tickets/noteOwnership";
import TicketActions from "@/components/crm/TicketActions";
import TicketNoteForm from "@/components/crm/TicketNoteForm";
import EditableTicketNote from "@/components/crm/EditableTicketNote";
import TicketWebsiteSelect from "@/components/crm/TicketWebsiteSelect";

export const dynamic = "force-dynamic";

type Ticket = {
  id: string;
  ref_number: number;
  title: string;
  description: string | null;
  category: string;
  priority: string;
  status: string;
  website: string | null;
  submitted_by: string;
  assigned_to: string;
  due_date: string | null;
  completed_at: string | null;
  verified_at: string | null;
  archived_at: string | null;
  created_at: string;
};

type Activity = {
  id: string;
  actor: string;
  action: string;
  old_value: string | null;
  new_value: string | null;
  note: string | null;
  attachment_url: string | null;
  created_at: string;
  edited_at?: string | null;
};

const CATEGORY_LABEL: Record<string, string> = {
  front_end: "Front End",
  back_end: "Back End",
  mobile_app: "Mobile App",
  other: "Other",
};

const WEBSITE_LABEL: Record<string, string> = {
  inc: "INC",
  homes: "HOMES",
  crm: "CRM",
};

const WEBSITE_TONE: Record<string, string> = {
  inc: "bg-indigo-600 text-white",
  homes: "bg-[#B8963E] text-white",
  crm: "bg-gray-600 text-white",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  new: "New",
  in_progress: "In Progress",
  review: "Awaiting Review",
  verified_complete: "Verified Complete",
  reopened: "Reopened",
};

const STATUS_TONE: Record<string, string> = {
  pending: "bg-gray-100 text-gray-600",
  new: "bg-blue-50 text-blue-700",
  in_progress: "bg-amber-50 text-amber-700",
  review: "bg-violet-50 text-violet-700",
  verified_complete: "bg-emerald-50 text-emerald-700",
  reopened: "bg-red-50 text-red-600",
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function activityLabel(a: Activity) {
  if (a.action === "created") return `${a.actor} created this ticket`;
  if (a.action === "status_change") {
    return `${a.actor} changed status: ${STATUS_LABEL[a.old_value ?? ""] ?? a.old_value} → ${
      STATUS_LABEL[a.new_value ?? ""] ?? a.new_value
    }`;
  }
  if (a.action === "website_change") {
    const from = a.old_value ? WEBSITE_LABEL[a.old_value] ?? a.old_value : "not set";
    const to = WEBSITE_LABEL[a.new_value ?? ""] ?? a.new_value;
    return `${a.actor} set website: ${from} → ${to}`;
  }
  if (a.action === "priority_change") {
    return `${a.actor} changed priority: ${a.old_value ?? "—"} → ${a.new_value ?? "—"}`;
  }
  if (a.action === "due_date_change") {
    return `${a.actor} changed due date: ${a.old_value ?? "none"} → ${a.new_value ?? "none"}`;
  }
  return `${a.actor} left a note`;
}

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createServiceClient();

  const [{ data: ticket, error: ticketError }, { data: activityRows }, { fullName: viewerName }] = await Promise.all([
    supabase.from("support_tickets").select("*").eq("id", id).single(),
    supabase
      .from("ticket_activity")
      .select("*")
      .eq("ticket_id", id)
      .order("created_at", { ascending: false }),
    getCurrentRole(),
  ]);

  if (ticketError || !ticket) notFound();

  const t = ticket as Ticket;
  const activity = (activityRows ?? []) as Activity[];

  return (
    <div className="space-y-5">
      <Link
        href="/crm/support"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#1C1C1E]"
      >
        <ArrowLeft size={14} />
        Back to Support
      </Link>

      <div className="rounded-2xl border border-[#E8E4DC] bg-white p-6">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold uppercase tracking-widest text-[#B8963E]">
                #REQ-{t.ref_number}
              </p>
              {t.website && (
                <span
                  className={`rounded-md px-2.5 py-0.5 text-[11px] font-black tracking-wider ${
                    WEBSITE_TONE[t.website] ?? "bg-gray-600 text-white"
                  }`}
                >
                  {WEBSITE_LABEL[t.website] ?? t.website}
                </span>
              )}
            </div>
            <h1 className="mt-1 text-2xl font-black text-[#1C1C1E]">{t.title}</h1>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              STATUS_TONE[t.status] ?? "bg-gray-100 text-gray-600"
            }`}
          >
            {STATUS_LABEL[t.status] ?? t.status}
          </span>
        </div>

        {t.description && (
          <p className="mb-5 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
            {t.description}
          </p>
        )}

        <div className="mb-5 grid grid-cols-2 gap-4 rounded-xl bg-[#FAF9F6] p-4 text-sm sm:grid-cols-4">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-gray-400">
              Website
            </p>
            <TicketWebsiteSelect ticketId={t.id} website={t.website} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Category</p>
            <p className="mt-0.5 font-semibold text-[#1C1C1E]">
              {CATEGORY_LABEL[t.category] ?? t.category}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Priority</p>
            <p className="mt-0.5 font-semibold capitalize text-[#1C1C1E]">{t.priority}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
              Submitted By
            </p>
            <p className="mt-0.5 font-semibold text-[#1C1C1E]">{t.submitted_by}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Assigned To</p>
            <p className="mt-0.5 font-semibold text-[#1C1C1E]">{t.assigned_to}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Due Date</p>
            <p className="mt-0.5 font-semibold text-[#1C1C1E]">{t.due_date ?? "—"}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Created</p>
            <p className="mt-0.5 font-semibold text-[#1C1C1E]">{formatDateTime(t.created_at)}</p>
          </div>
          {t.verified_at && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Verified</p>
              <p className="mt-0.5 font-semibold text-[#1C1C1E]">{formatDateTime(t.verified_at)}</p>
            </div>
          )}
        </div>

        <TicketActions
          ticketId={t.id}
          status={t.status}
          priority={t.priority}
          dueDate={t.due_date}
          archivedAt={t.archived_at}
        />
      </div>

      <div className="rounded-2xl border border-[#E8E4DC] bg-white p-6">
        <h2 className="mb-4 text-sm font-black uppercase tracking-wide text-[#1C1C1E]">
          Activity
        </h2>

        <TicketNoteForm ticketId={t.id} />

        <div className="mt-5 space-y-4">
          {activity.length === 0 ? (
            <p className="text-sm text-gray-400">No activity yet.</p>
          ) : (
            activity.map((a) => (
              <div key={a.id} className="flex gap-3 border-b border-[#F0EDE6] pb-4 last:border-0">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-bold text-[#1C1C1E]">{activityLabel(a)}</p>
                    <p className="shrink-0 text-[11px] text-gray-400">
                      {formatDateTime(a.created_at)}
                    </p>
                  </div>
                  <EditableTicketNote
                    activityId={a.id}
                    note={a.note}
                    editedAt={a.edited_at ?? null}
                    canEdit={a.action === "comment" && canEditTicketNote(a.actor, viewerName)}
                  />
                  {a.attachment_url && (
                    <a
                      href={a.attachment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={a.attachment_url}
                        alt="Attachment"
                        className="h-24 w-24 rounded-lg border border-[#E8E4DC] object-cover hover:opacity-90"
                      />
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
