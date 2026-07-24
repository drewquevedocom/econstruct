"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Paperclip } from "lucide-react";
import { addTicketNote, uploadTicketAttachment } from "@/app/crm/support/actions";
import { compressImage } from "@/lib/image/compressImage";

export default function TicketNoteForm({ ticketId }: { ticketId: string }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!note.trim() && !file) return;
    setError(null);

    startTransition(async () => {
      let attachmentUrl: string | undefined;

      if (file) {
        const compressed = await compressImage(file);
        const formData = new FormData();
        formData.set("file", compressed);
        const uploadResult = await uploadTicketAttachment(formData);
        if (uploadResult.error) {
          setError(uploadResult.error);
          return;
        }
        attachmentUrl = uploadResult.url;
      }

      const result = await addTicketNote(ticketId, note, attachmentUrl);
      if (result.error) {
        setError(result.error);
        return;
      }

      setNote("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-[#E8E4DC] bg-[#FAF9F6] p-4">
      <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500">
        Add a note
      </label>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
        className="w-full rounded-lg border border-[#E8E4DC] bg-white px-3 py-2 text-sm focus:border-[#B8963E] focus:outline-none"
        placeholder="Leave a comment..."
      />
      <div className="mt-3 flex items-center justify-between gap-3">
        <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-gray-500 hover:text-[#1C1C1E]">
          <Paperclip size={14} />
          {file ? file.name : "Attach photo/screenshot"}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>
        <button
          type="submit"
          disabled={pending || (!note.trim() && !file)}
          className="rounded-lg bg-[#1C1C1E] px-4 py-2 text-sm font-bold text-white hover:bg-[#B8963E] disabled:opacity-50"
        >
          {pending ? "Posting..." : "Post Note"}
        </button>
      </div>
      {error && <p className="mt-2 text-sm font-semibold text-red-600">{error}</p>}
    </form>
  );
}
