import Link from "next/link";
import { Calendar, Eye, Home, Inbox, Mail, MapPin, Send, Users } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const PT_TZ_OFFSET_HOURS = 7;
function ymdInPT(date: Date) {
  const adjusted = new Date(date.getTime() - PT_TZ_OFFSET_HOURS * 3600 * 1000);
  return adjusted.toISOString().slice(0, 10);
}

const PARTNER_TYPE_ORDER = [
  "Realtor / Real Estate Agent",
  "Real Estate Attorney",
  "Architect",
  "Insurance Agent / Adjuster",
  "Interior Designer",
  "Expediter / Permit Runner",
  "CPA / Wealth Advisor",
  "Escrow Officer",
  "Structural / Geotech Engineer",
  "Fire / Water Restoration",
  "HOA / Property Manager",
  "Other",
];

const AUDIENCE_LABEL: Record<string, { text: string; tone: string }> = {
  "fire-victims":   { text: "Fire victims",   tone: "bg-rose-50 text-rose-700" },
  architects:       { text: "Architects",     tone: "bg-violet-50 text-violet-700" },
  realtors:         { text: "Realtors",       tone: "bg-emerald-50 text-emerald-700" },
  "permit-runners": { text: "Permit runners", tone: "bg-amber-50 text-amber-700" },
  insurance:        { text: "Insurance",      tone: "bg-sky-50 text-sky-700" },
  "mixed-industry": { text: "Industry mix",   tone: "bg-gray-100 text-gray-700" },
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

type NewBuildRow = {
  id: string;
  address: string | null;
  zip_code: string | null;
  owner_name: string | null;
  owner_mailing_address: string | null;
  owner_type: string | null;
  property_value: number | null;
  subsource: string | null;
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

async function fetchInstantlyStats(): Promise<{
  opens: number; sent: number; replies: number; activeCampaigns: number;
}> {
  const apiKey = process.env.INSTANTLY_API_KEY;
  if (!apiKey) return { opens: 0, sent: 0, replies: 0, activeCampaigns: 0 };
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 4000);
  try {
    const res = await fetch("https://api.instantly.ai/api/v2/campaigns/analytics", {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: "no-store",
      signal: ctrl.signal,
    });
    clearTimeout(t);
    if (!res.ok) return { opens: 0, sent: 0, replies: 0, activeCampaigns: 0 };
    const data = await res.json();
    if (!Array.isArray(data)) return { opens: 0, sent: 0, replies: 0, activeCampaigns: 0 };
    let opens = 0, sent = 0, replies = 0, activeCampaigns = 0;
    for (const c of data) {
      opens  += c.open_count_unique || c.open_count || 0;
      sent   += c.emails_sent_count || 0;
      replies += c.reply_count_unique || c.reply_count || 0;
      if (c.campaign_status === 1) activeCampaigns++;
    }
    return { opens, sent, replies, activeCampaigns };
  } catch {
    clearTimeout(t);
    return { opens: 0, sent: 0, replies: 0, activeCampaigns: 0 };
  }
}

function money(v: number | null | undefined) {
  if (!v) return "—";
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${Math.round(v / 1_000)}K`;
  return `$${v}`;
}

export default async function DashboardPage() {
  const supabase = createServiceClient();
  const now = new Date();
  const todayPT = ymdInPT(now);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 3600 * 1000).toISOString();

  const [
    sentTodayRes,
    repliesWeekRes,
    partnersRes,
    repliedPartnerIdsRes,
    eventsRes,
    newBuildsTotalRes,
    newBuildsMailReadyRes,
    newBuildsEnrichedRes,
    newBuildsTopRes,
    instantly,
  ] = await Promise.all([
    supabase.from("partner_leads").select("id", { count: "exact", head: true }).eq("last_contact_date", todayPT),
    supabase.from("partner_tasks").select("id", { count: "exact", head: true }).like("title", "Review%reply%").gte("created_at", sevenDaysAgo),
    supabase.from("partner_leads").select("id, partner_name, company_firm, partner_type, status, contact_email, last_contact_date, updated_at").order("updated_at", { ascending: false }),
    supabase.from("partner_tasks").select("partner_lead_id").like("title", "Review%reply%"),
    supabase.from("crm_events").select("id, title, event_date, location, host_org, event_url, audience, notes").eq("is_archived", false).or(`event_date.gte.${todayPT},event_date.is.null`).order("event_date", { ascending: true, nullsFirst: false }).limit(6),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("source", "ladbs_permits"),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("source", "ladbs_permits").eq("owner_type", "entity").not("owner_mailing_address", "is", null),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("source", "ladbs_permits").not("owner_name", "is", null),
    supabase.from("leads").select("id, address, zip_code, owner_name, owner_mailing_address, owner_type, property_value, subsource").eq("source", "ladbs_permits").not("owner_name", "is", null).order("property_value", { ascending: false, nullsFirst: false }).limit(8),
    fetchInstantlyStats(),
  ]);

  const sentToday        = sentTodayRes.count ?? 0;
  const repliesWeek      = repliesWeekRes.count ?? 0;
  const partners         = (partnersRes.data ?? []) as PartnerRow[];
  const events           = (eventsRes.data ?? []) as EventRow[];
  const newBuildsTop     = (newBuildsTopRes.data ?? []) as NewBuildRow[];
  const newBuildsTotal   = newBuildsTotalRes.count ?? 0;
  const newBuildsMailReady = newBuildsMailReadyRes.count ?? 0;
  const newBuildsEnriched  = newBuildsEnrichedRes.count ?? 0;

  const repliedIds   = new Set((repliedPartnerIdsRes.data ?? []).map((r) => r.partner_lead_id as string));
  const totalPartners = partners.length;
  const coldEmailed  = partners.filter((p) => ["Contacted","Replied","Agreement Sent","Active Partner"].includes(p.status)).length;
  const repliedCount = partners.filter((p) => p.status === "Replied").length;
  const signedPartners = partners.filter((p) => p.status === "Active Partner").length;
  const partnerRepliesWeek = repliesWeek;

  const byType = new Map<string, number>();
  for (const p of partners) byType.set(p.partner_type, (byType.get(p.partner_type) ?? 0) + 1);
  const typeRows = PARTNER_TYPE_ORDER.map((t) => ({ type: t, total: byType.get(t) ?? 0 })).filter((r) => r.total > 0);

  const openRate = instantly.sent > 0 ? Math.round((instantly.opens / instantly.sent) * 1000) / 10 : 0;
  const replyRate = instantly.sent > 0 ? Math.round((instantly.replies / instantly.sent) * 1000) / 10 : 0;

  return (
    <div className="space-y-5">
      <div className="flex items-baseline justify-between">
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#1C1C1E]/40">CRM Command Center</p>
        <span className="text-xs text-gray-400 tabular-nums">{todayPT}</span>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          ROW 1 — Partner Pipeline (compact) | Engagement Signal
      ══════════════════════════════════════════════════════════════ */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1fr]">
        {/* Partner Pipeline */}
        <div className="rounded-2xl border border-[#E8E4DC] bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={15} className="text-[#B8963E]" />
              <h2 className="text-sm font-black uppercase tracking-wide text-[#1C1C1E]">Partner Pipeline</h2>
            </div>
            <Link href="/crm/partners" className="rounded-lg bg-[#1C1C1E] px-3 py-1 text-[11px] font-bold text-white hover:bg-[#B8963E]">Open</Link>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <MiniStat value={sentToday} label="Sent Today" accent="gold" />
            <MiniStat value={partnerRepliesWeek} label="Replies 7d" accent="emerald" />
            <MiniStat value={repliedCount} label="Need Action" accent="amber" />
            <MiniStat value={signedPartners} label="Signed" accent="green" />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-1 rounded-lg bg-[#FAF9F6] px-3 py-2 text-center text-[10px]">
            <span className="font-black text-[#1C1C1E]">{totalPartners}<br/><span className="font-bold text-gray-400">Loaded</span></span>
            <span className="font-black text-amber-700">{coldEmailed}<br/><span className="font-bold text-gray-400">Emailed</span></span>
            <span className="font-black text-emerald-700">{repliedIds.size}<br/><span className="font-bold text-gray-400">Replied</span></span>
            <span className="font-black text-[#B8963E]">{signedPartners}<br/><span className="font-bold text-gray-400">Signed</span></span>
          </div>
        </div>

        {/* Engagement Signal — Partner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1C1C1E] via-[#252527] to-[#1C1C1E] p-4 text-white">
          <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-[#B8963E]/30 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Eye size={13} className="text-[#D4B96A]" />
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#D4B96A]">Partner Engagement Signal</p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-3xl font-black tabular-nums text-[#FFF8E7]">{instantly.opens.toLocaleString()}</p>
                <p className="mt-1 text-[10px] font-black uppercase tracking-wide text-[#D4B96A]">Opens</p>
              </div>
              <div className="border-x border-white/10">
                <p className="text-3xl font-black tabular-nums text-[#FFF8E7]">{openRate}%</p>
                <p className="mt-1 text-[10px] font-black uppercase tracking-wide text-[#D4B96A]">Open Rate</p>
              </div>
              <div>
                <p className="text-3xl font-black tabular-nums text-[#FFF8E7]">{replyRate}%</p>
                <p className="mt-1 text-[10px] font-black uppercase tracking-wide text-[#D4B96A]">Reply Rate</p>
              </div>
            </div>
            <p className="mt-3 text-[10px] text-[#F2E8C9]/60 tabular-nums text-center">{instantly.activeCampaigns} active campaigns · {instantly.sent.toLocaleString()} total sent</p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          ROW 2 — Homeowner Pipeline | Direct Mail Pipeline
      ══════════════════════════════════════════════════════════════ */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Homeowner Pipeline */}
        <div className="rounded-2xl border border-[#E8E4DC] bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Home size={15} className="text-[#B8963E]" />
              <h2 className="text-sm font-black uppercase tracking-wide text-[#1C1C1E]">Homeowner Pipeline</h2>
            </div>
            <Link href="/crm/new-builds" className="rounded-lg bg-[#1C1C1E] px-3 py-1 text-[11px] font-bold text-white hover:bg-[#B8963E]">Open</Link>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <MiniStat value={newBuildsTotal} label="Permits" accent="blue" />
            <MiniStat value={newBuildsEnriched} label="Enriched" accent="emerald" />
            <MiniStat value={newBuildsMailReady} label="Mail-Ready" accent="gold" />
          </div>
          {/* Homeowner engagement */}
          <div className="mt-3 rounded-lg bg-[#FAF9F6] p-2.5 text-center">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide font-bold">Engagement Signal</p>
            <div className="mt-1.5 flex justify-around">
              <div className="text-center"><p className="text-lg font-black text-[#1C1C1E]">—</p><p className="text-[9px] text-gray-400 uppercase">Delivered</p></div>
              <div className="text-center"><p className="text-lg font-black text-emerald-700">—</p><p className="text-[9px] text-gray-400 uppercase">Responses</p></div>
              <div className="text-center"><p className="text-lg font-black text-[#B8963E]">—</p><p className="text-[9px] text-gray-400 uppercase">Meetings</p></div>
            </div>
            <p className="mt-1.5 text-[9px] italic text-gray-300">Lob.com integration pending — will populate on first batch send</p>
          </div>
        </div>

        {/* Direct Mail Pipeline */}
        <div className="rounded-2xl border border-[#E8E4DC] bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail size={15} className="text-[#B8963E]" />
              <h2 className="text-sm font-black uppercase tracking-wide text-[#1C1C1E]">Direct Mail Pipeline</h2>
            </div>
            <Link href="/crm/new-builds" className="rounded-lg bg-[#1C1C1E] px-3 py-1 text-[11px] font-bold text-white hover:bg-[#B8963E]">Open</Link>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <MiniStat value={newBuildsMailReady} label="In Queue" accent="gold" />
            <MiniStat value={0} label="This Week" accent="blue" />
            <MiniStat value={0} label="Mailed Total" accent="emerald" />
          </div>
          {/* Direct mail engagement */}
          <div className="mt-3 rounded-lg bg-[#FAF9F6] p-2.5 text-center">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide font-bold">Engagement Signal</p>
            <div className="mt-1.5 flex justify-around">
              <div className="text-center"><p className="text-lg font-black text-[#1C1C1E]">—</p><p className="text-[9px] text-gray-400 uppercase">Pieces Sent</p></div>
              <div className="text-center"><p className="text-lg font-black text-emerald-700">—</p><p className="text-[9px] text-gray-400 uppercase">Call-Ins</p></div>
              <div className="text-center"><p className="text-lg font-black text-[#B8963E]">—</p><p className="text-[9px] text-gray-400 uppercase">Est. Rate</p></div>
            </div>
            <p className="mt-1.5 text-[9px] italic text-gray-300">Lob.com integration pending — {newBuildsMailReady} pieces queued and ready to ship</p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          ROW 3 — Partner Network (full detail) | Homeowner Network (full detail)
      ══════════════════════════════════════════════════════════════ */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* Partner Network */}
        <div className="rounded-2xl border border-[#E8E4DC] bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-[#1C1C1E]">Partner Network</h2>
              <p className="text-[11px] text-gray-500">{totalPartners} loaded · {coldEmailed} cold-emailed · {repliedCount} replied · {signedPartners} signed</p>
            </div>
            <Link href="/crm/partners" className="rounded-lg bg-[#1C1C1E] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#B8963E]">Open</Link>
          </div>
          {/* Per-type breakdown */}
          <div className="space-y-1">
            {typeRows.map((r) => (
              <div key={r.type} className="flex items-center justify-between gap-3 rounded-lg bg-[#FAF9F6] px-3 py-2">
                <span className="text-xs font-semibold text-[#1C1C1E]">{r.type}</span>
                <span className="text-xs font-black tabular-nums text-[#1C1C1E]">{r.total}</span>
              </div>
            ))}
          </div>
          {/* Recent activity */}
          <h3 className="mt-4 mb-1.5 text-[10px] font-black uppercase tracking-wide text-gray-400">Recent Activity</h3>
          <div className="space-y-0.5">
            {partners.slice(0, 6).map((p) => (
              <Link key={p.id} href="/crm/partners" className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 hover:bg-[#FAF9F6]">
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-[#1C1C1E]">{p.partner_name}</span>
                  {p.company_firm && <span className="ml-1.5 text-[11px] text-gray-400">· {p.company_firm}</span>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                    p.status === "Active Partner" ? "bg-emerald-50 text-emerald-700" :
                    p.status === "Replied" ? "bg-amber-50 text-amber-700" :
                    p.status === "Agreement Sent" ? "bg-violet-50 text-violet-700" :
                    "bg-gray-100 text-gray-500"
                  }`}>{p.status}</span>
                  <span className="text-[10px] text-gray-400">{formatRelative(p.updated_at)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Homeowner Network */}
        <div className="rounded-2xl border border-[#E8E4DC] bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-[#1C1C1E]">Homeowner Network</h2>
              <p className="text-[11px] text-gray-500">{newBuildsTotal} luxury LA permits · {newBuildsEnriched} owner-enriched · {newBuildsMailReady} mail-ready</p>
            </div>
            <Link href="/crm/new-builds" className="rounded-lg bg-[#1C1C1E] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#B8963E]">Open</Link>
          </div>
          {/* Top properties by value */}
          <div className="space-y-1">
            {newBuildsTop.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">No enriched permits yet. Run the LADBS scraper.</p>
            ) : (
              newBuildsTop.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3 rounded-lg bg-[#FAF9F6] px-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-[#1C1C1E]">{p.owner_name || "—"}</p>
                    <p className="truncate text-[10px] text-gray-500">{p.address}{p.zip_code ? ` · ${p.zip_code}` : ""}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs font-black text-[#B8963E]">{money(p.property_value)}</p>
                    <span className={`text-[9px] font-bold ${p.owner_type === "entity" ? "text-purple-600" : "text-emerald-600"}`}>
                      {p.owner_type === "entity" ? "LLC/Trust" : "Individual"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Mailing address preview */}
          {newBuildsTop.filter(p => p.owner_mailing_address).length > 0 && (
            <>
              <h3 className="mt-4 mb-1.5 text-[10px] font-black uppercase tracking-wide text-gray-400">Top Mail-Ready Addresses</h3>
              <div className="space-y-0.5">
                {newBuildsTop.filter(p => p.owner_mailing_address).slice(0, 4).map((p) => (
                  <div key={p.id + "-mail"} className="flex items-start gap-2 rounded-lg px-2 py-1.5 hover:bg-[#FAF9F6]">
                    <MapPin size={11} className="mt-0.5 shrink-0 text-[#B8963E]" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-[#1C1C1E]">{p.owner_name}</p>
                      <p className="truncate text-[10px] text-gray-500">{p.owner_mailing_address}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          ROW 4 — Upcoming Events | Jump To
      ══════════════════════════════════════════════════════════════ */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.6fr_1fr]">
        {/* Events */}
        <div className="rounded-2xl border border-[#E8E4DC] bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar size={15} className="text-[#B8963E]" />
              <h2 className="text-base font-black text-[#1C1C1E]">Upcoming Events</h2>
            </div>
            <p className="text-[10px] text-gray-400">Show up · hand out cards · meet rebuilders</p>
          </div>
          {events.length === 0 ? (
            <p className="text-xs text-gray-400">No upcoming events — forward any AIA/PPCC/Altadena newsletters to extract new ones automatically.</p>
          ) : (
            <div className="space-y-2">
              {events.map((e) => <EventCard key={e.id} event={e} />)}
            </div>
          )}
        </div>

        {/* Jump To */}
        <div className="rounded-2xl border border-[#E8E4DC] bg-white p-5">
          <h3 className="mb-3 text-sm font-black text-[#1C1C1E]">Jump To</h3>
          <div className="flex flex-col gap-2">
            <QuickLink href="/crm/partners" label="Partners" sub="Kanban · follow-ups · active" />
            <QuickLink href="/crm/new-builds" label="New Builds" sub="LADBS permits · mail list" />
            <QuickLink href="/crm/import" label="Import CSV" sub="Drag-drop Apollo export" />
            <QuickLink href="/crm/leads" label="All Leads" sub="Full lead database" />
            <QuickLink href="/crm/outreach" label="Outreach" sub="Sequences · templates" />
            <QuickLink href="/crm/agents" label="Agents" sub="Cron health · recent runs" />
          </div>
        </div>
      </section>
    </div>
  );
}

function MiniStat({ value, label, accent }: { value: number; label: string; accent: "gold" | "emerald" | "sky" | "amber" | "blue" | "green" }) {
  const color = accent === "gold" ? "text-[#B8963E]" : accent === "emerald" ? "text-emerald-700" : accent === "amber" ? "text-amber-700" : accent === "blue" ? "text-sky-700" : accent === "green" ? "text-emerald-600" : "text-sky-700";
  const bg    = accent === "gold" ? "bg-amber-50" : accent === "emerald" ? "bg-emerald-50" : accent === "amber" ? "bg-amber-50" : accent === "blue" ? "bg-sky-50" : accent === "green" ? "bg-emerald-50" : "bg-sky-50";
  return (
    <div className={`rounded-lg ${bg} p-2.5 text-center`}>
      <p className={`text-2xl font-black tabular-nums ${color}`}>{value.toLocaleString()}</p>
      <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wide text-gray-500">{label}</p>
    </div>
  );
}

function EventCard({ event }: { event: EventRow }) {
  const audience = AUDIENCE_LABEL[event.audience] ?? AUDIENCE_LABEL["mixed-industry"];
  const dateLabel = event.event_date
    ? new Date(event.event_date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "TBD";
  const inner = (
    <div className="flex items-start justify-between gap-3 rounded-xl border border-[#E8E4DC] bg-[#FAF9F6] p-3 hover:border-[#B8963E]/40 hover:bg-white transition">
      <div className="min-w-0">
        <p className="truncate text-xs font-bold text-[#1C1C1E]">{event.title}</p>
        <p className="mt-0.5 truncate text-[10px] text-gray-500">{[event.host_org, event.location].filter(Boolean).join(" · ") || "TBD"}</p>
        <span className={`mt-1.5 inline-block rounded-full px-1.5 py-0.5 text-[9px] font-bold ${audience.tone}`}>{audience.text}</span>
      </div>
      <p className="shrink-0 text-xs font-black text-[#B8963E]">{dateLabel}</p>
    </div>
  );
  return event.event_url ? <a href={event.event_url} target="_blank" rel="noopener noreferrer">{inner}</a> : inner;
}

function QuickLink({ href, label, sub }: { href: string; label: string; sub: string }) {
  return (
    <Link href={href} className="flex items-center justify-between rounded-lg border border-[#E8E4DC] bg-[#FAF9F6] px-3 py-2 hover:border-[#B8963E] hover:bg-white transition">
      <span className="text-xs font-bold text-[#1C1C1E]">{label}</span>
      <span className="text-[10px] text-gray-400">{sub}</span>
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
