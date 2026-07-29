"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  setInProgress,
  submitForReview,
  approveTicket,
  sendBack,
  markReadyToStart,
} from "@/app/crm/support/actions";

export default function TicketActions({
  ticketId,
  status,
}: {
  ticketId: string;
  status: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showSendBack, setShowSendBack] = useState(false);
  const [sendBackNote, setSendBackNote] = useState("");

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

  if (status === "pending") {
    return (
      <div>
        <button
          onClick={() => run(() => markReadyToStart(ticketId))}
          disabled={pending}
          className="rounded-lg bg-[#B8963E] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#1C1C1E] disabled:opacity-50"
        >
          {pending ? "Moving..." : "Ready to Start"}
        </button>
        {error && <p className="mt-2 text-sm font-semibold text-red-600">{error}</p>}
      </div>
    );
  }

  if (status === "new" || status === "reopened") {
    return (
      <div>
        <button
          onClick={() => run(() => setInProgress(ticketId))}
          disabled={pending}
          className="rounded-lg bg-[#B8963E] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#1C1C1E] disabled:opacity-50"
        >
          {pending ? "Starting..." : "Start Work"}
        </button>
        {error && <p className="mt-2 text-sm font-semibold text-red-600">{error}</p>}
      </div>
    );
  }

  if (status === "in_progress") {
    return (
      <div>
        <button
          onClick={() => run(() => submitForReview(ticketId))}
          disabled={pending}
          className="rounded-lg bg-[#B8963E] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#1C1C1E] disabled:opacity-50"
        >
          {pending ? "Submitting..." : "Mark Ready for Review"}
        </button>
        {error && <p className="mt-2 text-sm font-semibold text-red-600">{error}</p>}
      </div>
    );
  }

  if (status === "review") {
    return (
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

        {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
      </div>
    );
  }

  return null;
}
