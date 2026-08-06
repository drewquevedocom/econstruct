"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  setInProgress,
  submitForReview,
  approveTicket,
  sendBack,
  markReadyToStart,
  archiveTicket,
  unarchiveTicket,
  reopenTicket,
  setTicketStatus,
  setTicketPriority,
  setTicketDueDate,
} from "@/app/crm/support/actions";

const STATUS_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "pending", label: "Pending" },
  { value: "new", label: "New" },
  { value: "in_progress", label: "In Progress" },
  { value: "review", label: "Awaiting Review" },
  { value: "verified_complete", label: "Verified Complete" },
  { value: "reopened", label: "Reopened" },
];

// Real enum values on the priority column (low/normal/high/urgent) — not
// Low/Medium/High/Urgent.
const PRIORITY_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "low", label: "Low" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

export default function TicketActions({
  ticketId,
  status,
  priority,
  dueDate,
  archivedAt,
}: {
  ticketId: string;
  status: string;
  priority: string;
  dueDate: string | null;
  archivedAt?: string | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showSendBack, setShowSendBack] = useState(false);
  const [sendBackNote, setSendBackNote] = useState("");
  const [showOverride, setShowOverride] = useState(false);
  const [overrideStatus, setOverrideStatus] = useState(status);
  const [showPriorityOverride, setShowPriorityOverride] = useState(false);
  const [overridePriority, setOverridePriority] = useState(priority);
  const [showDueDateOverride, setShowDueDateOverride] = useState(false);
  const [overrideDueDate, setOverrideDueDate] = useState(dueDate ?? "");

  function run(action: () => Promise<{ success?: boolean; error?: string }>) {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  let workflow: React.ReactNode = null;

  if (status === "pending") {
    workflow = (
      <button
        onClick={() => run(() => markReadyToStart(ticketId))}
        disabled={pending}
        className="rounded-lg bg-[#B8963E] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#1C1C1E] disabled:opacity-50"
      >
        {pending ? "Moving..." : "Ready to Start"}
      </button>
    );
  }

  if (status === "new" || status === "reopened") {
    workflow = (
      <button
        onClick={() => run(() => setInProgress(ticketId))}
        disabled={pending}
        className="rounded-lg bg-[#B8963E] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#1C1C1E] disabled:opacity-50"
      >
        {pending ? "Starting..." : "Start Work"}
      </button>
    );
  }

  if (status === "in_progress") {
    workflow = (
      <button
        onClick={() => run(() => submitForReview(ticketId))}
        disabled={pending}
        className="rounded-lg bg-[#B8963E] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#1C1C1E] disabled:opacity-50"
      >
        {pending ? "Submitting..." : "Mark Ready for Review"}
      </button>
    );
  }

  if (status === "review") {
    workflow = (
      <div className="space-y-3">
        <div className="flex gap-3">
          <button
            onClick={() => run(() => approveTicket(ticketId))}
            disabled={pending}
            className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {pending ? "Working..." : "Approve"}
          </button>
          <button
            onClick={() => setShowSendBack((v) => !v)}
            disabled={pending}
            className="rounded-lg border border-red-200 px-5 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            Send Back
          </button>
        </div>

        {showSendBack && (
          <div className="rounded-xl border border-[#E8E4DC] bg-[#FAF9F6] p-4">
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">
              What needs to change?
            </label>
            <textarea
              value={sendBackNote}
              onChange={(e) => setSendBackNote(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-[#E8E4DC] px-3 py-2 text-sm focus:border-[#B8963E] focus:outline-none"
              placeholder="Explain what to fix before this is approved..."
            />
            <button
              onClick={() =>
                run(async () => {
                  const result = await sendBack(ticketId, sendBackNote);
                  if (!result.error) {
                    setShowSendBack(false);
                    setSendBackNote("");
                  }
                  return result;
                })
              }
              disabled={pending || !sendBackNote.trim()}
              className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50"
            >
              {pending ? "Sending..." : "Send Back to Drew"}
            </button>
          </div>
        )}
      </div>
    );
  }

  if (status === "verified_complete") {
    workflow = archivedAt ? (
      <button
        onClick={() => run(() => unarchiveTicket(ticketId))}
        disabled={pending}
        className="rounded-lg border border-[#E8E4DC] px-5 py-2.5 text-sm font-bold text-[#1C1C1E] hover:bg-[#FAF9F6] disabled:opacity-50"
      >
        {pending ? "Restoring..." : "Unarchive"}
      </button>
    ) : (
      <div className="flex gap-3">
        <button
          onClick={() => run(() => reopenTicket(ticketId))}
          disabled={pending}
          className="rounded-lg bg-[#B8963E] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#1C1C1E] disabled:opacity-50"
        >
          {pending ? "Reopening..." : "Reopen (back to In Progress)"}
        </button>
        <button
          onClick={() => run(() => archiveTicket(ticketId))}
          disabled={pending}
          className="rounded-lg border border-[#E8E4DC] px-5 py-2.5 text-sm font-bold text-[#1C1C1E] hover:bg-[#FAF9F6] disabled:opacity-50"
        >
          {pending ? "Archiving..." : "Archive"}
        </button>
      </div>
    );
  }

  return (
    <div>
      {workflow}

      {/* Manual override for when a ticket is in the wrong state (e.g. an
          accidental approve). No notification emails — just sets the status. */}
      <div className={workflow ? "mt-4 border-t border-[#E8E4DC] pt-3" : ""}>
        <button
          onClick={() => setShowOverride((v) => !v)}
          className="text-xs font-bold uppercase tracking-wide text-gray-400 hover:text-[#B8963E]"
        >
          {showOverride ? "▾ Fix status manually" : "▸ Fix status manually"}
        </button>
        {showOverride && (
          <div className="mt-2 flex items-center gap-2">
            <select
              value={overrideStatus}
              onChange={(e) => setOverrideStatus(e.target.value)}
              className="rounded-lg border border-[#E8E4DC] px-3 py-2 text-sm focus:border-[#B8963E] focus:outline-none"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => run(() => setTicketStatus(ticketId, overrideStatus))}
              disabled={pending || overrideStatus === status}
              className="rounded-lg border border-[#E8E4DC] px-4 py-2 text-sm font-bold text-[#1C1C1E] hover:bg-[#FAF9F6] disabled:opacity-50"
            >
              {pending ? "Saving..." : "Set Status"}
            </button>
          </div>
        )}
      </div>

      {/* Manual priority override — same pattern as the status override:
          no workflow gating, works on closed tickets. */}
      <div>
        <button
          onClick={() => setShowPriorityOverride((v) => !v)}
          className="text-xs font-bold uppercase tracking-wide text-gray-400 hover:text-[#B8963E]"
        >
          {showPriorityOverride ? "▾ Fix priority manually" : "▸ Fix priority manually"}
        </button>
        {showPriorityOverride && (
          <div className="mt-2 flex items-center gap-2">
            <select
              value={overridePriority}
              onChange={(e) => setOverridePriority(e.target.value)}
              className="rounded-lg border border-[#E8E4DC] px-3 py-2 text-sm focus:border-[#B8963E] focus:outline-none"
            >
              {PRIORITY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => run(() => setTicketPriority(ticketId, overridePriority))}
              disabled={pending || overridePriority === priority}
              className="rounded-lg border border-[#E8E4DC] px-4 py-2 text-sm font-bold text-[#1C1C1E] hover:bg-[#FAF9F6] disabled:opacity-50"
            >
              {pending ? "Saving..." : "Set Priority"}
            </button>
          </div>
        )}
      </div>

      {/* Manual due-date override — supports clearing back to no date and
          accepts past dates on purpose (backdating a wrong deadline). */}
      <div>
        <button
          onClick={() => setShowDueDateOverride((v) => !v)}
          className="text-xs font-bold uppercase tracking-wide text-gray-400 hover:text-[#B8963E]"
        >
          {showDueDateOverride ? "▾ Fix due date manually" : "▸ Fix due date manually"}
        </button>
        {showDueDateOverride && (
          <div className="mt-2 flex items-center gap-2">
            <input
              type="date"
              value={overrideDueDate}
              onChange={(e) => setOverrideDueDate(e.target.value)}
              className="rounded-lg border border-[#E8E4DC] px-3 py-2 text-sm focus:border-[#B8963E] focus:outline-none"
            />
            <button
              onClick={() =>
                run(() => setTicketDueDate(ticketId, overrideDueDate || null))
              }
              disabled={pending || (overrideDueDate || null) === (dueDate ?? null)}
              className="rounded-lg border border-[#E8E4DC] px-4 py-2 text-sm font-bold text-[#1C1C1E] hover:bg-[#FAF9F6] disabled:opacity-50"
            >
              {pending ? "Saving..." : "Set Due Date"}
            </button>
            {overrideDueDate && (
              <button
                onClick={() => setOverrideDueDate("")}
                disabled={pending}
                className="text-xs font-bold text-gray-400 hover:text-red-600 disabled:opacity-50"
              >
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      {error && <p className="mt-2 text-sm font-semibold text-red-600">{error}</p>}
    </div>
  );
}
