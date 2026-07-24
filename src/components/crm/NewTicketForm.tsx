"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { createTicket } from "@/app/crm/support/actions";

export default function NewTicketForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("front_end");
  const [priority, setPriority] = useState("normal");
  const [dueDate, setDueDate] = useState("");

  function resetForm() {
    setTitle("");
    setDescription("");
    setCategory("front_end");
    setPriority("normal");
    setDueDate("");
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
        due_date: dueDate || undefined,
      });
      if (result.error) {
        setError(result.error);
        return;
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
