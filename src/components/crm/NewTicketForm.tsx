"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Camera } from "lucide-react";
import { createTicket, addTicketNote, uploadTicketAttachment } from "@/app/crm/support/actions";
import { compressImage } from "@/lib/image/compressImage";

export default function NewTicketForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("front_end");
  const [priority, setPriority] = useState("normal");
  const [dueDate, setDueDate] = useState("");
  const [notReadyYet, setNotReadyYet] = useState(false);
  const [screenshot, setScreenshot] = useState<File | null>(null);

  function resetForm() {
    setTitle("");
    setDescription("");
    setCategory("front_end");
    setPriority("normal");
    setDueDate("");
    setNotReadyYet(false);
    setScreenshot(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await createTicket({
        title,
        description,
        category,
        priority,
        due_date: notReadyYet ? undefined : dueDate || undefined,
        pending: notReadyYet,
      });
      if (result.error) {
        setError(result.error);
        return;
      }

      if (screenshot && result.id) {
        const compressed = await compressImage(screenshot);
        const formData = new FormData();
        formData.set("file", compressed);
        const uploadResult = await uploadTicketAttachment(formData);
        if (uploadResult.error) {
          // Ticket was already created successfully — refresh so it shows up,
          // but keep the modal open so the attachment failure is visible
          // rather than flashing and disappearing.
          setError(`Ticket created, but the screenshot failed to attach: ${uploadResult.error}`);
          router.refresh();
          return;
        }
        if (uploadResult.url) {
          await addTicketNote(result.id, "", uploadResult.url);
        }
      }

      resetForm();
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-[#B8963E] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#1C1C1E] transition-colors"
      >
        <Plus size={16} />
        New Ticket
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-black text-[#1C1C1E]">New Support Ticket</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-[#1C1C1E]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-[#E8E4DC] px-3 py-2 text-sm focus:border-[#B8963E] focus:outline-none"
                  placeholder="e.g. Fix broken contact form on mobile"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-[#E8E4DC] px-3 py-2 text-sm focus:border-[#B8963E] focus:outline-none"
                  placeholder="Details, steps to reproduce, links, etc."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-lg border border-[#E8E4DC] px-3 py-2 text-sm focus:border-[#B8963E] focus:outline-none"
                  >
                    <option value="front_end">Front End</option>
                    <option value="back_end">Back End</option>
                    <option value="mobile_app">Mobile App</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full rounded-lg border border-[#E8E4DC] px-3 py-2 text-sm focus:border-[#B8963E] focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              {category === "mobile_app" && (
                <div className="rounded-lg border border-[#B8963E]/30 bg-[#B8963E]/5 p-3">
                  <label className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#B8963E]">
                    <Camera size={14} />
                    Attach a screenshot (recommended for mobile issues)
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => setScreenshot(e.target.files?.[0] ?? null)}
                    className="block w-full text-sm text-[#1C1C1E] file:mr-3 file:rounded-lg file:border-0 file:bg-[#1C1C1E] file:px-3 file:py-2 file:text-xs file:font-bold file:text-white hover:file:bg-[#B8963E]"
                  />
                  {screenshot && (
                    <p className="mt-2 text-xs text-gray-500">Selected: {screenshot.name}</p>
                  )}
                </div>
              )}

              <div className="rounded-lg border border-[#E8E4DC] bg-[#FAF9F6] p-3">
                <label className="flex items-start gap-2 text-sm font-semibold text-[#1C1C1E]">
                  <input
                    type="checkbox"
                    checked={notReadyYet}
                    onChange={(e) => setNotReadyYet(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-[#E8E4DC] text-[#B8963E] focus:ring-[#B8963E]"
                  />
                  Not ready to move forward yet — mark as Pending
                </label>
                <p className="mt-1 pl-6 text-xs text-gray-500">
                  Logs the ticket without notifying Drew or requiring a due date. Flip it to
                  &quot;New&quot; from the ticket page whenever it&apos;s ready to start.
                </p>
              </div>

              {!notReadyYet && (
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-lg border border-[#E8E4DC] px-3 py-2 text-sm focus:border-[#B8963E] focus:outline-none"
                  />
                </div>
              )}

              {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-[#E8E4DC] px-4 py-2 text-sm font-bold text-[#1C1C1E] hover:bg-[#FAF9F6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="rounded-lg bg-[#B8963E] px-4 py-2 text-sm font-bold text-white hover:bg-[#1C1C1E] disabled:opacity-50"
                >
                  {pending ? "Creating..." : "Create Ticket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
