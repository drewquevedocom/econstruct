import Link from "next/link";
import { LifeBuoy, Clock3, AlertTriangle, CheckCircle2 } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/server";
import StatCard from "@/components/crm/StatCard";
import NewTicketForm from "@/components/crm/NewTicketForm";

export const dynamic = "force-dynamic";

type TicketRow = {
  id: string;
  ref_number: number;
  title: string;
  category: string;
  priority: string;
  status: string;
  due_date: string | null;
  created_at: string;
};

const CATEGORY_LABEL: Record<string, string> = {
  front_end: "Front End",
  back_end: "Back End",
  mobile_app: "Mobile App",
  other: "Other",
};

const CATEGORY_TONE: Record<string, string> = {
  front_end: "bg-sky-50 text-sky-700",
  back_end: "bg-violet-50 text-violet-700",
  mobile_app: "bg-emerald-50 text-emerald-700",
  other: "bg-gray-100 text-gray-600",
};

const PRIORITY_TONE: Record<string, string> = {
  low: "bg-gray-100 text-gray-600",
  normal: "bg-sky-50 text-sky-700",
  high: "bg-amber-50 text-amber-700",
  urgent: "bg-red-50 text-red-600",
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

function Badge({ text, tone }: { text: string; tone: string }) {
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${tone}`}>
      {text}
    </span>
  );
}

const CATEGORY_FILTERS = [
  { value: "all", label: "All" },
  { value: "front_end", label: "Front End" },
  { value: "back_end", label: "Back End" },
  { value: "mobile_app", label: "Mobile App" },
  { value: "other", label: "Other" },
];

export default async function SupportPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activeCategory =
    category && CATEGORY_FILTERS.some((f) => f.value === category) ? category : "all";

  const supabase = createServiceClient();

  // Not a reassigned `let query` — that pattern hits a "Type instantiation
  // is excessively deep" TS error on the current @supabase/supabase-js
  // (see export-new-builds/route.ts). Each branch builds its own query.
  const baseQuery = () =>
    supabase
      .from("support_tickets")
      .select("id, ref_number, title, category, priority, status, due_date, created_at")
      .order("created_at", { ascending: false });

  const { data, error } =
    activeCategory === "all"
      ? await baseQuery()
      : await baseQuery().eq("category", activeCategory);

  if (error) {
    return (
      <div className="max-w-lg rounded-2xl border border-[#E8E4DC] bg-white p-8">
        <p className="text-xs font-bold uppercase tracking-widest text-[#B8963E] mb-2">
          Support Tickets
        </p>
        <h1 className="text-xl font-bold text-[#1C1C1E] mb-3">Table not found yet</h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          The <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">support_tickets</code>{" "}
          table doesn&apos;t exist yet. Run{" "}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">
            supabase/migrations/20260723_support_tickets.sql
          </code>{" "}
          in the Supabase SQL Editor, then refresh this page.
        </p>
      </div>
    );
  }

  const tickets = (data ?? []) as TicketRow[];
  const todayISO = new Date().toISOString().slice(0, 10);
  const weekAgoISO = new Date(Date.now() - 7 * 864e5).toISOString();

  const open = tickets.filter((t) => t.status !== "verified_complete").length;
  const awaitingReview = tickets.filter((t) => t.status === "review").length;
  const overdue = tickets.filter(
    (t) => t.due_date && t.due_date < todayISO && t.status !== "verified_complete"
  ).length;
  const completedThisWeek = tickets.filter(
    (t) => t.status === "verified_complete" && t.created_at >= weekAgoISO
  ).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#1C1C1E]/40">
            CRM &middot; Internal Only
          </p>
          <h1 className="mt-1 text-xl font-black text-[#1C1C1E]">Support Tickets</h1>
        </div>
        <NewTicketForm />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Open" value={open} icon={LifeBuoy} tone="blue" />
        <StatCard label="Awaiting Frank's Review" value={awaitingReview} icon={Clock3} tone="amber" />
        <StatCard label="Overdue" value={overdue} icon={AlertTriangle} tone="red" />
        <StatCard label="Completed This Week" value={completedThisWeek} icon={CheckCircle2} tone="green" />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {CATEGORY_FILTERS.map((f) => {
          const active = f.value === activeCategory;
          const href = f.value === "all" ? "/crm/support" : `/crm/support?category=${f.value}`;
          return (
            <Link
              key={f.value}
              href={href}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                active
                  ? "bg-[#B8963E] text-white"
                  : "bg-white text-[#1C1C1E] border border-[#E8E4DC] hover:border-[#B8963E]"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E8E4DC] bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E8E4DC] bg-[#FAF9F6] text-left text-[11px] font-black uppercase tracking-wide text-gray-400">
              <th className="px-5 py-3">Ref</th>
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Priority</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-400">
                  {activeCategory === "all"
                    ? "No tickets yet — create the first one above."
                    : `No ${CATEGORY_LABEL[activeCategory] ?? activeCategory} tickets.`}
                </td>
              </tr>
            ) : (
              tickets.map((t) => {
                const isOverdue =
                  t.due_date && t.due_date < todayISO && t.status !== "verified_complete";
                return (
                  <tr key={t.id} className="border-b border-[#F0EDE6] last:border-0 hover:bg-[#FAF9F6]">
                    <td className="px-5 py-3">
                      <Link
                        href={`/crm/support/${t.id}`}
                        className="font-bold text-[#1C1C1E] hover:text-[#B8963E]"
                      >
                        #REQ-{t.ref_number}
                      </Link>
                    </td>
                    <td className="px-5 py-3">
                      <Link href={`/crm/support/${t.id}`} className="text-[#1C1C1E] hover:text-[#B8963E]">
                        {t.title}
                      </Link>
                    </td>
                    <td className="px-5 py-3">
                      <Badge
                        text={CATEGORY_LABEL[t.category] ?? t.category}
                        tone={CATEGORY_TONE[t.category] ?? "bg-gray-100 text-gray-600"}
                      />
                    </td>
                    <td className="px-5 py-3">
                      <Badge
                        text={t.priority}
                        tone={PRIORITY_TONE[t.priority] ?? "bg-gray-100 text-gray-600"}
                      />
                    </td>
                    <td className="px-5 py-3">
                      <Badge
                        text={STATUS_LABEL[t.status] ?? t.status}
                        tone={STATUS_TONE[t.status] ?? "bg-gray-100 text-gray-600"}
                      />
                    </td>
                    <td className={`px-5 py-3 text-xs font-semibold ${isOverdue ? "text-red-600" : "text-gray-500"}`}>
                      {t.due_date ?? "—"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
