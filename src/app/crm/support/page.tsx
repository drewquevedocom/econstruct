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
  website: string | null;
  due_date: string | null;
  created_at: string;
  verified_at: string | null;
  archived_at: string | null;
};

const WEBSITE_LABEL: Record<string, string> = {
  inc: "INC",
  homes: "HOMES",
  crm: "CRM",
};

// Solid chips on purpose — every other badge on this table is pastel, so the
// site label reads first, as requested.
const WEBSITE_TONE: Record<string, string> = {
  inc: "bg-indigo-600 text-white",
  homes: "bg-[#B8963E] text-white",
  crm: "bg-gray-600 text-white",
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

const SITE_FILTERS = [
  { value: "all", label: "All Sites" },
  { value: "inc", label: "INC" },
  { value: "homes", label: "HOMES" },
  { value: "crm", label: "CRM" },
];

const SORT_OPTIONS = [
  { value: "smart", label: "Default" },
  { value: "priority", label: "Priority" },
  { value: "due_date", label: "Due Date" },
];

const PRIORITY_RANK: Record<string, number> = { urgent: 0, high: 1, normal: 2, low: 3 };

function sortTickets(tickets: TicketRow[], sort: string, todayISO: string): TicketRow[] {
  const byCreatedDesc = (a: TicketRow, b: TicketRow) => (a.created_at < b.created_at ? 1 : -1);

  if (sort === "priority") {
    return [...tickets].sort((a, b) => {
      const rankDiff = (PRIORITY_RANK[a.priority] ?? 9) - (PRIORITY_RANK[b.priority] ?? 9);
      return rankDiff !== 0 ? rankDiff : byCreatedDesc(a, b);
    });
  }

  if (sort === "due_date") {
    return [...tickets].sort((a, b) => {
      if (!a.due_date && !b.due_date) return byCreatedDesc(a, b);
      if (!a.due_date) return 1; // no due date sorts last
      if (!b.due_date) return -1;
      return a.due_date < b.due_date ? -1 : a.due_date > b.due_date ? 1 : byCreatedDesc(a, b);
    });
  }

  // Default "smart" sort: open tickets before closed, overdue first within
  // open, otherwise most recent first. Answers "what's on fire" on load
  // instead of requiring a manual sort every time.
  return [...tickets].sort((a, b) => {
    const aOpen = a.status !== "verified_complete";
    const bOpen = b.status !== "verified_complete";
    if (aOpen !== bOpen) return aOpen ? -1 : 1;

    const aOverdue = Boolean(a.due_date && a.due_date < todayISO && aOpen);
    const bOverdue = Boolean(b.due_date && b.due_date < todayISO && bOpen);
    if (aOverdue !== bOverdue) return aOverdue ? -1 : 1;

    return byCreatedDesc(a, b);
  });
}

export default async function SupportPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; view?: string; sort?: string; site?: string }>;
}) {
  const { category, view, sort, site } = await searchParams;
  const activeCategory =
    category && CATEGORY_FILTERS.some((f) => f.value === category) ? category : "all";
  const showArchived = view === "archived";
  const activeSort = SORT_OPTIONS.some((s) => s.value === sort) ? (sort as string) : "smart";
  const activeSite = site && SITE_FILTERS.some((f) => f.value === site) ? site : "all";

  const supabase = createServiceClient();

  // Not a reassigned `let query` — that pattern hits a "Type instantiation
  // is excessively deep" TS error on the current @supabase/supabase-js
  // (see export-new-builds/route.ts). Each branch builds its own query.
  const baseQuery = () =>
    supabase
      .from("support_tickets")
      .select("id, ref_number, title, category, priority, status, website, due_date, created_at, verified_at, archived_at")
      .order("created_at", { ascending: false });

  // Archived is its own view, not combinable with category filtering —
  // it's a small, deliberately-curated list, not something you browse by
  // category.
  const { data, error } = showArchived
    ? await baseQuery().not("archived_at", "is", null)
    : activeCategory === "all"
      ? await baseQuery().is("archived_at", null)
      : await baseQuery().is("archived_at", null).eq("category", activeCategory);

  if (error) {
    // Show the real database error instead of assuming the table itself is
    // missing -- a missing column from a not-yet-run later migration (or
    // any other query error) hits this same path, and guessing the wrong
    // cause wastes time.
    const missingColumn = /column .* does not exist/i.test(error.message);
    return (
      <div className="max-w-lg rounded-2xl border border-[#E8E4DC] bg-white p-8">
        <p className="text-xs font-bold uppercase tracking-widest text-[#B8963E] mb-2">
          Support Tickets
        </p>
        <h1 className="text-xl font-bold text-[#1C1C1E] mb-3">Couldn&apos;t load tickets</h1>
        <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 font-mono text-xs text-red-700">
          {error.message}
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">
          {missingColumn
            ? "This usually means a migration adding a column hasn't been run yet — check supabase/migrations/ for the most recent .sql file and run it in the Supabase SQL Editor."
            : error.code === "42P01"
              ? <>
                  The <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">support_tickets</code>{" "}
                  table doesn&apos;t exist yet. Run{" "}
                  <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">
                    supabase/migrations/20260723_support_tickets.sql
                  </code>{" "}
                  in the Supabase SQL Editor.
                </>
              : "Check the Supabase SQL Editor for pending migrations in supabase/migrations/."}
          {" "}Then refresh this page.
        </p>
      </div>
    );
  }

  // "Today" in LA time, not UTC — otherwise tickets due today start showing
  // as overdue at 5pm PT when the UTC date rolls over. en-CA = YYYY-MM-DD.
  const todayISO = new Date().toLocaleDateString("en-CA", { timeZone: "America/Los_Angeles" });
  const weekAgoISO = new Date(Date.now() - 7 * 864e5).toISOString();
  // Site filter applied in JS, not the query builder — adding another .eq()
  // branch to the ternary chain above re-triggers the deep-instantiation TS
  // error, and the ticket list is small enough that this costs nothing.
  const allRows = (data ?? []) as TicketRow[];
  const filteredRows =
    activeSite === "all" ? allRows : allRows.filter((t) => t.website === activeSite);
  const tickets = sortTickets(filteredRows, activeSort, todayISO);

  const open = tickets.filter((t) => t.status !== "verified_complete").length;
  const awaitingReview = tickets.filter((t) => t.status === "review").length;
  const overdue = tickets.filter(
    (t) => t.due_date && t.due_date < todayISO && t.status !== "verified_complete"
  ).length;
  // Was comparing created_at (when the ticket was FILED) to "one week ago" —
  // so a ticket filed a month ago and just now completed never counted,
  // which is exactly what was reported. verified_at is stamped by the DB
  // trigger the moment a ticket enters verified_complete, so it reflects
  // when the work actually finished.
  const completedThisWeek = tickets.filter(
    (t) => t.status === "verified_complete" && t.verified_at && t.verified_at >= weekAgoISO
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
        {SITE_FILTERS.map((f) => {
          const active = f.value === activeSite;
          const params = new URLSearchParams();
          if (showArchived) params.set("view", "archived");
          if (!showArchived && activeCategory !== "all") params.set("category", activeCategory);
          if (activeSort !== "smart") params.set("sort", activeSort);
          if (f.value !== "all") params.set("site", f.value);
          const qs = params.toString();
          const href = qs ? `/crm/support?${qs}` : "/crm/support";
          const activeTone =
            f.value === "all"
              ? "bg-[#1C1C1E] text-white"
              : `${WEBSITE_TONE[f.value]} shadow-sm`;
          return (
            <Link
              key={f.value}
              href={href}
              className={`rounded-full px-4 py-2 text-xs font-black tracking-wide transition-colors ${
                active
                  ? activeTone
                  : "bg-white text-[#1C1C1E] border border-[#E8E4DC] hover:border-[#B8963E]"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {CATEGORY_FILTERS.map((f) => {
            const active = !showArchived && f.value === activeCategory;
            const params = new URLSearchParams();
            if (f.value !== "all") params.set("category", f.value);
            if (activeSort !== "smart") params.set("sort", activeSort);
            if (activeSite !== "all") params.set("site", activeSite);
            const qs = params.toString();
            const href = qs ? `/crm/support?${qs}` : "/crm/support";
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
          <Link
            href={`/crm/support?view=archived${activeSort !== "smart" ? `&sort=${activeSort}` : ""}${activeSite !== "all" ? `&site=${activeSite}` : ""}`}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-colors ${
              showArchived
                ? "bg-[#1C1C1E] text-white"
                : "bg-white text-gray-500 border border-[#E8E4DC] hover:border-[#1C1C1E]"
            }`}
          >
            Archived
          </Link>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wide text-gray-400">Sort</span>
          {SORT_OPTIONS.map((s) => {
            const active = s.value === activeSort;
            const params = new URLSearchParams();
            if (showArchived) params.set("view", "archived");
            if (!showArchived && activeCategory !== "all") params.set("category", activeCategory);
            if (s.value !== "smart") params.set("sort", s.value);
            if (activeSite !== "all") params.set("site", activeSite);
            const qs = params.toString();
            const href = qs ? `/crm/support?${qs}` : "/crm/support";
            return (
              <Link
                key={s.value}
                href={href}
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                  active
                    ? "bg-[#1C1C1E] text-white"
                    : "bg-white text-[#1C1C1E] border border-[#E8E4DC] hover:border-[#B8963E]"
                }`}
              >
                {s.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E8E4DC] bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E8E4DC] bg-[#FAF9F6] text-left text-[11px] font-black uppercase tracking-wide text-gray-400">
              <th className="px-5 py-3">Ref</th>
              <th className="px-5 py-3">Site</th>
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
                <td colSpan={7} className="px-5 py-10 text-center text-sm text-gray-400">
                  {showArchived
                    ? "No archived tickets yet."
                    : activeCategory === "all"
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
                      {t.website ? (
                        <span
                          className={`inline-block rounded-md px-2.5 py-1 text-[11px] font-black tracking-wider ${
                            WEBSITE_TONE[t.website] ?? "bg-gray-600 text-white"
                          }`}
                        >
                          {WEBSITE_LABEL[t.website] ?? t.website}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
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
