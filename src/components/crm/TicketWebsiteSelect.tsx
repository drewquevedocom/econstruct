"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setTicketWebsite } from "@/app/crm/support/actions";

const SITES = [
  { value: "inc", label: "INC", active: "bg-indigo-600 text-white" },
  { value: "homes", label: "HOMES", active: "bg-[#B8963E] text-white" },
  { value: "crm", label: "CRM", active: "bg-gray-600 text-white" },
];

/** Displays and sets which website a ticket is for. Doubles as the backfill
 * tool for tickets created before the website column existed. */
export default function TicketWebsiteSelect({
  ticketId,
  website,
}: {
  ticketId: string;
  website: string | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function select(value: string) {
    if (pending || value === website) return;
    setError(null);
    startTransition(async () => {
      const result = await setTicketWebsite(ticketId, value);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div>
      <div className="flex gap-1">
        {SITES.map((s) => (
          <button
            key={s.value}
            type="button"
            disabled={pending}
            onClick={() => select(s.value)}
            className={`rounded-md px-2 py-1 text-[11px] font-black tracking-wide transition-colors disabled:opacity-50 ${
              website === s.value
                ? s.active
                : "border border-[#E8E4DC] bg-white text-gray-400 hover:border-[#B8963E] hover:text-[#1C1C1E]"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      {!website && (
        <p className="mt-1 text-[10px] text-gray-400">Not set — pick one</p>
      )}
      {error && <p className="mt-1 text-[10px] font-semibold text-red-600">{error}</p>}
    </div>
  );
}
