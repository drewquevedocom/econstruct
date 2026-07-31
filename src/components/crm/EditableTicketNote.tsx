"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateTicketNote } from "@/app/crm/support/actions";

/** Renders a comment's note text; when the viewer authored it, adds an
 * inline Edit → textarea → Save/Cancel flow. Server action re-checks
 * authorship, so this gate is convenience, not security. */
export default function EditableTicketNote({
  activityId,
  note,
  editedAt,
  canEdit,
}: {
  activityId: string;
  note: string | null;
  editedAt: string | null;
  canEdit: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(note ?? "");
  const [error, setError] = useState<string | null>(null);

  if (!note && !canEdit) return null;

  if (!editing) {
    return (
      <div>
        {note && (
          <p className="mt-1.5 whitespace-pre-wrap text-sm text-gray-700">
            {note}
            {editedAt && (
              <span className="ml-1.5 text-[10px] italic text-gray-400">(edited)</span>
            )}
          </p>
        )}
        {canEdit && (
          <button
            onClick={() => {
              setDraft(note ?? "");
              setError(null);
              setEditing(true);
            }}
            className="mt-1 text-[11px] font-bold text-gray-400 hover:text-[#B8963E]"
          >
            Edit note
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="mt-1.5">
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={3}
        className="w-full rounded-lg border border-[#E8E4DC] px-3 py-2 text-sm focus:border-[#B8963E] focus:outline-none"
      />
      <div className="mt-2 flex items-center gap-2">
        <button
          onClick={() => {
            setError(null);
            startTransition(async () => {
              const result = await updateTicketNote(activityId, draft);
              if (result.error) {
                setError(result.error);
                return;
              }
              setEditing(false);
              router.refresh();
            });
          }}
          disabled={pending || !draft.trim() || draft.trim() === (note ?? "").trim()}
          className="rounded-lg bg-[#B8963E] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#1C1C1E] disabled:opacity-50"
        >
          {pending ? "Saving..." : "Save"}
        </button>
        <button
          onClick={() => setEditing(false)}
          disabled={pending}
          className="rounded-lg border border-[#E8E4DC] px-4 py-1.5 text-xs font-bold text-[#1C1C1E] hover:bg-[#FAF9F6] disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs font-semibold text-red-600">{error}</p>}
    </div>
  );
}
