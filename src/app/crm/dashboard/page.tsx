import Link from "next/link";
import { Calendar, Handshake, Inbox, Send } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const PT_TZ_OFFSET_HOURS = 7;

function ymdInPT(date: Date) {
  const adjusted = new Date(date.getTime() - PT_TZ_OFFSET_HOURS * 3600 * 1000);
  return adjusted.toISOString().slice(0, 10);
}

const PARTNER_TYPE_ORDER = [
  "Architect",
  "Realtor / Real Estate Agent",
  "Insurance Agent / Adjuster",
  "Expediter / Permit Runner",
  "General Contractor (subcontract partner)",
  "HOA / Property Manager",
  "Other",
];

const AUDIENCE_LABEL: Record<string, { text: string; tone: string }> = {
  "fire-victims": { text: "Fire victims", tone: "bg-rose-50 text-rose-700" },
  architects: { text: "Architects", tone: "bg-violet-50 text-violet-700" },
  realtors: { text: "Realtors", tone: "bg-emerald-50 text-emerald-700" },
  "permit-runners": { text: "Permit runners", tone: "bg-amber-50 text-amber-700" },
  insurance: { text: "Insurance", tone: "bg-sky-50 text-sky-700" },
  "mixed-industry": { text: "Industry mix", tone: "bg-gray-100 text-gray-700" },
};

type PartnerRow = {
  id: string;
  partner_name: string;
  company_firm: string | null;
  partner_type: string;
  status: string;
  contact_email: string | null;
  last_contact_date: string | null;
  updated_at: string;
};

type EventRow = {
  id: string;
  title: string;
  event_date: string | null;
  location: string | null;
  host_org: string | null;
  event_url: string | null;
  audience: string;
  notes: string | null;
};

export default async function DashboardPage() {
  const supabase = createServiceClient();
  const now = new Date();
  const todayPT = ymdInPT(now);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 3600 * 1000).toISOString();

  const [
    sentTodayRes,
    repliesWeekRes,
    partnersRes,
    eventsRes,
    newBuildsTotalRes,
    newBuildsMailReadyRes,
  ] = await Promise.all([
    supabase
      .from("partner_leads")
      .select("id", { count: "exact", head: true })
      .eq("last_contact_date", todayPT),
    supabase
      .from("partner_tasks")
      .select("id", { count: "exact", head: true })
      .like("title", "Review Instantly reply%")
      .gte("created_at", sevenDaysAgo),
    supabase
      .from("partner_leads")
      .select("id, partner_name, company_firm, partner_type, status, contact_email, last_contact_date, updated_at")
      .order("updated_at", { ascending: false }),
    supabase
      .from("crm_events")
      .select("id, title, event_date, location, host_org, event_url, audience, notes")
      .eq("is_archived", false)
      .order("event_date", { ascending: true, nullsFirst: false })
      .limit(6),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("source", "ladbs_permits"),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("source", "ladbs_permits")
      .eq("owner_type", "entity")
      .not("owner_mailing_address", "is", null),
  ]);

  const sentToday = sentTodayRes.count ?? 0;
  const repliesWeek = repliesWeekRes.count ?? 0;
  const partners = (partnersRes.data ?? []) as PartnerRow[];
  const events = (eventsRes.data ?? []) as EventRow[];
  const newBuildsTotal = newBuildsTotalRes.count ?? 0;
  const newBuildsMailReady = newBuildsMailReadyRes.count ?? 0;

  const ACTIVE_STATUSES = new Set(["Contacted", "Agreement Sent", "Active Partner"]);
  const activePartners = partners.filter((p) => ACTIVE_STATUSES.has(p.status)).length;

  const byType = new Map<string, { total: number; contacted: number }>();
  for (const p of partners) {
    const entry = byType.get(p.partner_type) ?? { total: 0, contacted: 0 };
    entry.total += 1;
    if (ACTIVE_STATUSES.has(p.status)) entry.contacted += 1;
    byType.set(p.partner_type, entry);
  }
  const typeRows = PARTNER_TYPE_ORDER.map((t) => ({
    type: t,
    total: byType.get(t)?.total ?? 0,
    contacted: byType.get(t)?.contacted ?? 0,
  })).filter((r) => r.total > 0);

  const recentPartners = partners.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* ── Hero — Today's Pulse ────────────────────────────────────── */}
      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h1 className="text-sm font-bold uppercase tracking-[0.18em] text-[#1C1C1E]/60">
            Today&apos;s Pulse
          </h1>
          <span className="text-xs text-gray-400 tabular-nums">{todayPT}</span>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <HeroMetric
            value={sentToday}
            label="Cold Emails Sent Today"
            sublabel="To architects, realtors, adjusters & expediters"
            icon={Send}
            accent="gold"
          />
          <HeroMetric
            value={repliesWeek}
            label="Replies This Week"
            sublabel="Partner responses routed into CRM"
            icon={Inbox}
            accent="emerald"
          />
          <HeroMetric
            value={activePartners}
            label="Active Partners"
            sublabel="Contacted, in-agreement or signed"
            icon={Handshake}
            accent="sky"
          />
        </div>
      </section>

      {/* ── Partner Network + Events ────────────────────────────────── */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-[#E8E4DC] bg-white p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-[#1C1C1E]">Partner Network</h2>
              <p className="mt-0.5 text-xs text-gray-500">
                Primary channel · {partners.length} loaded · {activePartners} engaged
              </p>
            </div>
            <Link
              href="/crm/partners"
              className="rounded-lg bg-[#1C1C1E] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#B8963E]"
            >
              Open
            </Link>
          </div>

          {/* Per-type breakdown */}
          <div className="space-y-1.5">
            {typeRows.length === 0 ? (
              <p className="text-sm text-gray-400">No partners loaded yet.</p>
            ) : (
              typeRows.map((r) => (
                <div
                  key={r.type}
                  className="flex items-center justify-between gap-3 rounded-lg bg-[#FAF9F6] px-3 py-2"
                >
                  <span className="text-sm font-semibold text-[#1C1C1E]">{r.type}</span>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-gray-500 tabular-nums">{r.total} loaded</span>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700 tabular-nums">
                      {r.contacted} engaged
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Recent partner activity */}
          {recentPartners.length > 0 && (
            <>
              <h3 className="mt-5 mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">
                Recent Activity
              </h3>
              <div className="space-y-1">
                {recentPartners.map((p) => (
                  <Link
                    key={p.id}
                    href={`/crm/partners`}
                    className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-xs hover:bg-[#FAF9F6]"
                  >
                    <div className="min-w-0">
                      <span className="font-semibold text-[#1C1C1E]">{p.partner_name}</span>
                      {p.company_firm && (
                        <span className="ml-1.5 text-gray-400">· {p.company_firm}</span>
                      )}
                    </div>
                    <span className="shrink-0 text-[11px] text-gray-400">{formatRelative(p.updated_at)}</span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="rounded-2xl border border-[#E8E4DC] bg-white p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-[#1C1C1E]">Upcoming Events</h2>
              <p className="mt-0.5 text-xs text-gray-500">
                Show up · hand out cards · meet rebuilders
              </p>
            </div>
            <Calendar size={18} className="text-[#B8963E]" />
          </div>

          {events.length === 0 ? (
            <p className="text-sm text-gray-400">
              No events yet. Add them to <code className="rounded bg-gray-100 px-1.5 py-0.5">crm_events</code>.
            </p>
          ) : (
            <div className="space-y-3">
              {events.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Compact footer: secondary channels + quick links ────────── */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-[#E8E4DC] bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#1C1C1E]">New-Build Direct Mail</h3>
            <Link href="/crm/new-builds" className="text-xs font-bold text-[#B8963E] hover:underline">
              View
            </Link>
          </div>
          <p className="text-xs text-gray-500">
            Secondary channel · luxury LADBS permits enriched via ATTOM, mailed via Lob.
          </p>
          <div className="mt-3 flex items-center gap-4 text-xs">
            <span className="tabular-nums">
              <span className="font-black text-[#1C1C1E]">{newBuildsTotal}</span>{" "}
              <span className="text-gray-500">permits</span>
            </span>
            <span className="tabular-nums">
              <span className="font-black text-[#1C1C1E]">{newBuildsMailReady}</span>{" "}
              <span className="text-gray-500">mail-ready</span>
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-[#E8E4DC] bg-white p-4">
          <h3 className="mb-2 text-sm font-bold text-[#1C1C1E]">Jump To</h3>
          <div className="flex flex-wrap gap-2">
            <QuickLink href="/crm/partners" label="Partners" />
            <QuickLink href="/crm/leads" label="All Leads" />
            <QuickLink href="/crm/new-builds" label="New Builds" />
            <QuickLink href="/crm/outreach" label="Outreach" />
            <QuickLink href="/crm/sequences" label="Sequences" />
            <QuickLink href="/crm/agents" label="Agents" />
          </div>
        </div>
      </section>
    </div>
  );
}

function HeroMetric({
  value,
  label,
  sublabel,
  icon: Icon,
  accent,
}: {
  value: number;
  label: string;
  sublabel: string;
  icon: typeof Send;
  accent: "gold" | "emerald" | "sky";
}) {
  const accentBar =
    accent === "gold" ? "bg-[#B8963E]" : accent === "emerald" ? "bg-emerald-500" : "bg-sky-500";
  const accentText =
    accent === "gold" ? "text-[#B8963E]" : accent === "emerald" ? "text-emerald-600" : "text-sky-600";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#E8E4DC] bg-white p-6">
      <div className={`absolute left-0 top-0 h-full w-1.5 ${accentBar}`} />
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</p>
        <Icon size={16} className={accentText} />
      </div>
      <p className="mt-2 text-5xl font-black tabular-nums text-[#1C1C1E]">
        {value.toLocaleString()}
      </p>
      <p className="mt-2 text-xs text-gray-500">{sublabel}</p>
    </div>
  );
}

function EventCard({ event }: { event: EventRow }) {
  const audience = AUDIENCE_LABEL[event.audience] ?? AUDIENCE_LABEL["mixed-industry"];
  const dateLabel = event.event_date
    ? new Date(event.event_date + "T12:00:00").toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "TBD";

  const inner = (
    <div className="rounded-xl border border-[#E8E4DC] bg-[#FAF9F6] p-3 transition hover:border-[#B8963E]/40 hover:bg-white">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-[#1C1C1E]">{event.title}</p>
          <p className="mt-0.5 truncate text-[11px] text-gray-500">
            {[event.host_org, event.location].filter(Boolean).join(" · ") || "Location TBD"}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xs font-black tabular-nums text-[#B8963E]">{dateLabel}</p>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${audience.tone}`}>
          {audience.text}
        </span>
        {event.notes && (
          <p className="truncate text-[10px] italic text-gray-400">{event.notes}</p>
        )}
      </div>
    </div>
  );

  if (event.event_url) {
    return (
      <a href={event.event_url} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return inner;
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-lg border border-[#E8E4DC] bg-[#FAF9F6] px-3 py-1.5 text-xs font-bold text-[#1C1C1E] hover:border-[#B8963E] hover:text-[#B8963E]"
    >
      {label}
    </Link>
  );
}

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
