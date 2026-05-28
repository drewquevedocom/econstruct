import Link from "next/link";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Clock,
  Handshake,
  Mail,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";
import { createServiceClient } from "@/lib/supabase/server";
import StatCard from "@/components/crm/StatCard";
import LeadSourceChart from "@/components/crm/LeadSourceChart";

export const dynamic = "force-dynamic";

type AgentRun = {
  id: string;
  agent_name: string;
  status: string | null;
  started_at: string;
  duration_ms: number | null;
  records_pulled: number | null;
  records_created: number | null;
  records_updated: number | null;
};

type NewBuild = {
  id: string;
  address: string | null;
  owner_name: string | null;
  owner_mailing_address: string | null;
  owner_type: string | null;
  zip_code: string | null;
  property_value: number | null;
  subsource: string | null;
};

type PartnerRow = {
  id: string;
  partner_name: string;
  company_firm: string | null;
  partner_type: string;
  status: string;
  contact_email: string | null;
};

function formatWhen(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function statusPill(status: string | null) {
  if (status === "success") return "bg-green-50 text-green-700";
  if (status === "running") return "bg-amber-50 text-amber-700";
  if (status === "interrupted") return "bg-gray-100 text-gray-600";
  return "bg-red-50 text-red-600";
}

function sourceLabel(source: string | null) {
  return source?.replace(/_/g, " ") || "unknown";
}

function money(v: number | null | undefined) {
  if (!v) return "—";
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `$${Math.round(v / 1_000)}K`;
  return `$${v.toLocaleString()}`;
}

export default async function DashboardPage() {
  const supabase = createServiceClient();

  const [
    totalRes,
    newBuildsTotalRes,
    newBuildsEnrichedRes,
    newBuildsMailReadyRes,
    newBuildsIndividualRes,
    newBuildsTopRes,
    partnersTotalRes,
    partnersEmailReadyRes,
    partnersContactedRes,
    partnersTopRes,
    contactedRes,
    wonRes,
    activityRes,
    agentRes,
    sourcesRes,
  ] = await Promise.all([
    supabase.from("leads").select("id", { count: "exact", head: true }),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("source", "ladbs_permits"),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("source", "ladbs_permits")
      .not("owner_name", "is", null),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("source", "ladbs_permits")
      .eq("owner_type", "entity")
      .not("owner_mailing_address", "is", null),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("source", "ladbs_permits")
      .eq("owner_type", "individual"),
    supabase
      .from("leads")
      .select("id, address, owner_name, owner_mailing_address, owner_type, zip_code, property_value, subsource")
      .eq("source", "ladbs_permits")
      .not("owner_name", "is", null)
      .order("property_value", { ascending: false, nullsFirst: false })
      .limit(8),
    supabase.from("partner_leads").select("id", { count: "exact", head: true }),
    supabase
      .from("partner_leads")
      .select("id", { count: "exact", head: true })
      .not("contact_email", "is", null),
    supabase
      .from("partner_leads")
      .select("id", { count: "exact", head: true })
      .eq("status", "Contacted"),
    supabase
      .from("partner_leads")
      .select("id, partner_name, company_firm, partner_type, status, contact_email")
      .not("contact_email", "is", null)
      .order("updated_at", { ascending: false })
      .limit(6),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .in("lifecycle_stage", ["contacted", "replied", "meeting", "proposal"]),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("lifecycle_stage", "won"),
    supabase
      .from("lead_activities")
      .select("id, lead_id, type, channel, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("agent_runs")
      .select("id, agent_name, status, started_at, duration_ms, records_pulled, records_created, records_updated")
      .order("started_at", { ascending: false })
      .limit(5),
    supabase.from("leads").select("source").not("source", "is", null),
  ]);

  const totalLeads = totalRes.count ?? 0;
  const newBuildsTotal = newBuildsTotalRes.count ?? 0;
  const newBuildsEnriched = newBuildsEnrichedRes.count ?? 0;
  const newBuildsMailReady = newBuildsMailReadyRes.count ?? 0;
  const newBuildsIndividual = newBuildsIndividualRes.count ?? 0;
  const newBuildsTop = (newBuildsTopRes.data ?? []) as NewBuild[];
  const partnersTotal = partnersTotalRes.count ?? 0;
  const partnersEmailReady = partnersEmailReadyRes.count ?? 0;
  const partnersContacted = partnersContactedRes.count ?? 0;
  const partnersTop = (partnersTopRes.data ?? []) as PartnerRow[];
  const activePipeline = contactedRes.count ?? 0;
  const wonCount = wonRes.count ?? 0;
  const activities = activityRes.data ?? [];
  const agentRuns = (agentRes.data ?? []) as AgentRun[];
  const failedAgents = agentRuns.filter((run) => run.status === "failed").length;
  const runningAgents = agentRuns.filter((run) => run.status === "running").length;
  const sourceMap: Record<string, number> = {};
  for (const r of sourcesRes.data ?? []) {
    const key = sourceLabel(r.source);
    sourceMap[key] = (sourceMap[key] || 0) + 1;
  }

  return (
    <>
      {/* ── Hero strategy banner ────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-4">
        <div className="relative overflow-hidden rounded-2xl border border-[#E8E4DC] bg-[#1C1C1E] p-5 text-white">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#D4B96A]">
                CRM Command Center · Strategy v2
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-[#FFF8E7]">
                Partners + New-Build Direct Mail.
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#F2E8C9]">
                Pivoted off fire-victim direct email — the data layer doesn&apos;t support it at scale.
                Two live channels now: cold email to architects/realtors/adjusters/expediters, and printed mail to
                luxury new-construction permit owners enriched via ATTOM.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                href="/crm/new-builds"
                className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-[#B8963E] px-4 text-sm font-bold text-white hover:bg-[#9A7B2F]"
              >
                Open New-Builds Pipeline
              </Link>
              <Link
                href="/crm/partners"
                className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg border border-white/20 px-4 text-sm font-bold text-white hover:border-[#B8963E] hover:text-[#B8963E]"
              >
                Open Partner Network
              </Link>
            </div>
          </div>
        </div>

        {/* Channel mini-stats */}
        <div className="grid grid-cols-2 gap-3">
          <MiniAction label="New-Build Permits" value={newBuildsTotal} tone="blue" />
          <MiniAction label="Direct-Mail Ready" value={newBuildsMailReady} tone="amber" />
          <MiniAction label="Partners Loaded" value={partnersTotal} tone="green" />
          <MiniAction label="Partners w/ Email" value={partnersEmailReady} tone="green" />
        </div>
      </div>

      {/* ── New-build pipeline strip ────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <MiniAction label="LADBS permits in pipeline" value={newBuildsTotal} tone="blue" />
        <MiniAction label="Owner enriched (ATTOM)" value={newBuildsEnriched} tone="sky" />
        <MiniAction label="Direct-mail batch ready" value={newBuildsMailReady} tone="amber" />
        <MiniAction label="Individual owners (Apollo)" value={newBuildsIndividual} tone="green" />
        <MiniAction label="Partner replies" value={partnersContacted} tone="red" />
      </div>

      {/* ── Headline stats ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Leads" value={totalLeads} icon={Users} helper="All sources" />
        <StatCard label="New-Build Permits" value={newBuildsTotal} icon={Building2} tone="amber" helper="Tier-1 luxury zips" />
        <StatCard label="Partner Network" value={partnersTotal} icon={Handshake} tone="green" helper={`${partnersEmailReady} with email`} />
        <StatCard
          label="Won Deals"
          value={wonCount}
          icon={Trophy}
          tone="green"
          helper={`${activePipeline} active pipeline`}
        />
      </div>

      {/* ── Action boards: New-Build top + Partner top ──────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-[#E8E4DC] p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-[#1C1C1E]">Top New-Build Targets</h2>
              <p className="mt-0.5 text-xs text-gray-500">Highest-valuation enriched permits ready for direct mail.</p>
            </div>
            <Link href="/crm/new-builds" className="text-xs font-bold text-[#B8963E] hover:underline">
              View all
            </Link>
          </div>
          {newBuildsTop.length === 0 ? (
            <p className="text-sm text-gray-400">No enriched permits yet. Run <code className="rounded bg-gray-100 px-1.5 py-0.5">scripts/enrich-ladbs-owners.mjs</code>.</p>
          ) : (
            <div className="space-y-2">
              {newBuildsTop.map((p) => (
                <div key={p.id} className="rounded-xl border border-[#E8E4DC] bg-[#FAF9F6] p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[#1C1C1E]">{p.owner_name || "—"}</p>
                      <p className="mt-0.5 truncate text-xs text-gray-500">
                        {p.address} · {p.zip_code}
                      </p>
                    </div>
                    <span className="rounded-full bg-[#B8963E]/10 px-2 py-0.5 text-xs font-black text-[#B8963E] tabular-nums">
                      {money(p.property_value)}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    {p.owner_type === "entity" ? (
                      <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[11px] font-bold text-purple-700">
                        LLC/Trust → Direct Mail
                      </span>
                    ) : p.owner_type === "individual" ? (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                        Individual → Apollo
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-400">No owner type</span>
                    )}
                    <span className="text-[11px] text-gray-400 truncate max-w-[180px]">
                      {p.owner_mailing_address || "no mailing addr"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-[#E8E4DC] p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-[#1C1C1E]">Active Partner Network</h2>
              <p className="mt-0.5 text-xs text-gray-500">Email-ready partners feeding the Instantly campaign.</p>
            </div>
            <Link href="/crm/partners" className="text-xs font-bold text-[#B8963E] hover:underline">
              View all
            </Link>
          </div>
          {partnersTop.length === 0 ? (
            <p className="text-sm text-gray-400">No email-ready partners.</p>
          ) : (
            <div className="space-y-2">
              {partnersTop.map((p) => (
                <div key={p.id} className="rounded-xl border border-[#E8E4DC] bg-[#FAF9F6] p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[#1C1C1E]">
                        {p.company_firm || p.partner_name}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-gray-500">
                        {p.partner_type} · {p.contact_email}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        p.status === "Contacted"
                          ? "bg-sky-50 text-sky-700"
                          : p.status === "Active Partner"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Recommendations + Agent Health ──────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_0.75fr] gap-4">
        <div className="bg-white rounded-xl border border-[#E8E4DC] p-4">
          <h2 className="font-bold text-[#1C1C1E] mb-3">Strategy Recommendations</h2>
          <div className="space-y-2 text-sm">
            <Recommendation
              tone="green"
              title="Partner outreach is the primary channel"
              body={`${partnersTotal} partners loaded (${partnersEmailReady} with email). When Instantly partner campaign is set, partner-enroll agent auto-pushes approved leads.`}
            />
            <Recommendation
              tone="amber"
              title="Direct mail to LLC/Trust owners"
              body={`${newBuildsMailReady} luxury new-build permits ready with owner + mailing address. Print + send via Lob.com or local printer — ~$0.80/piece.`}
            />
            <Recommendation
              tone={newBuildsIndividual > 0 ? "green" : "amber"}
              title="Apollo lookup queue"
              body={`${newBuildsIndividual} permits owned by individuals (not LLCs). These are Apollo-search candidates — wealthy LA professionals often appear in B2B databases.`}
            />
            <Recommendation
              tone="red"
              title="Fire-victim direct email — retired"
              body="8 enrichment APIs failed to return owner emails for residential addresses. Pipeline closed. Fire-damage leads stay in DB for record/mail use but are not the primary target."
            />
            <Recommendation
              tone={failedAgents > 0 ? "red" : "green"}
              title="Agent health"
              body={
                failedAgents > 0
                  ? `${failedAgents} recent agent run(s) failed. Check logs.`
                  : `${runningAgents} running. Last ${agentRuns.length} agent runs have no failures.`
              }
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E8E4DC] p-4">
          <h2 className="font-bold text-[#1C1C1E] mb-3">Recent Agent Runs</h2>
          {agentRuns.length === 0 ? (
            <p className="text-sm text-gray-400">No agent runs yet</p>
          ) : (
            <div className="space-y-2">
              {agentRuns.map((run) => (
                <div
                  key={run.id}
                  className="flex items-center justify-between gap-3 border-b border-[#E8E4DC]/50 pb-1.5 text-xs last:border-0"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[#1C1C1E]">{run.agent_name}</p>
                    <p className="text-[11px] text-gray-400">
                      pulled {run.records_pulled ?? 0} / updated {run.records_updated ?? 0}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${statusPill(run.status)}`}>
                    {run.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Lead sources + Recent activity ──────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <CompactCard title="Lead Sources">
          {Object.keys(sourceMap).length > 0 ? (
            <div className="mx-auto max-w-[132px]">
              <LeadSourceChart data={sourceMap} />
            </div>
          ) : (
            <p className="text-sm text-gray-400">No lead data yet</p>
          )}
        </CompactCard>

        <CompactCard title="Recent Activity">
          {activities.length === 0 ? (
            <p className="text-sm text-gray-400">No activity yet</p>
          ) : (
            <div className="space-y-2">
              {activities.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between gap-3 border-b border-[#E8E4DC]/50 pb-1.5 text-xs last:border-0"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold capitalize text-[#1C1C1E]">
                      {a.type?.replace(/_/g, " ")}
                    </p>
                    {a.channel && <p className="text-[11px] text-gray-400">via {a.channel}</p>}
                  </div>
                  <time className="shrink-0 text-[11px] text-gray-400 tabular-nums">
                    {formatWhen(a.created_at)}
                  </time>
                </div>
              ))}
            </div>
          )}
        </CompactCard>

        <CompactCard title="Pipeline Snapshot">
          <div className="space-y-2 text-xs">
            <SnapshotRow label="LADBS permits" value={newBuildsTotal} icon={Building2} />
            <SnapshotRow label="Owner enriched" value={newBuildsEnriched} icon={Wallet} />
            <SnapshotRow label="Mail-ready" value={newBuildsMailReady} icon={Mail} />
            <SnapshotRow label="Partners w/ email" value={partnersEmailReady} icon={Handshake} />
            <SnapshotRow label="Active pipeline" value={activePipeline} icon={Clock} />
          </div>
        </CompactCard>
      </div>
    </>
  );
}

function MiniAction({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "red" | "blue" | "amber" | "green" | "sky";
}) {
  const classes =
    tone === "red"
      ? "bg-red-50 text-red-600 border-red-100"
      : tone === "blue"
        ? "bg-sky-50 text-sky-700 border-sky-100"
        : tone === "green"
          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
          : tone === "sky"
            ? "bg-sky-50 text-sky-700 border-sky-100"
            : "bg-amber-50 text-amber-700 border-amber-100";

  return (
    <div className={`rounded-2xl border p-4 ${classes}`}>
      <p className="text-2xl font-black tabular-nums">{value.toLocaleString()}</p>
      <p className="mt-1 text-[11px] font-bold uppercase tracking-wide opacity-80">{label}</p>
    </div>
  );
}

function CompactCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-[128px] rounded-xl border border-[#E8E4DC] bg-white p-3">
      <h2 className="mb-2 text-sm font-bold text-[#1C1C1E]">{title}</h2>
      {children}
    </div>
  );
}

function SnapshotRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Building2;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#E8E4DC]/50 pb-1.5 last:border-0">
      <div className="flex items-center gap-2 text-gray-600">
        <Icon size={13} />
        <span>{label}</span>
      </div>
      <span className="font-bold tabular-nums text-[#1C1C1E]">{value.toLocaleString()}</span>
    </div>
  );
}

function Recommendation({
  tone,
  title,
  body,
}: {
  tone: "red" | "amber" | "green";
  title: string;
  body: string;
}) {
  const color =
    tone === "red"
      ? "border-red-100 bg-red-50 text-red-700"
      : tone === "amber"
        ? "border-amber-100 bg-amber-50 text-amber-700"
        : "border-green-100 bg-green-50 text-green-700";
  const Icon = tone === "green" ? CheckCircle2 : AlertTriangle;

  return (
    <div className={`rounded-xl border p-3 ${color}`}>
      <div className="flex items-start gap-2">
        <Icon size={15} className="mt-0.5 shrink-0" />
        <div>
          <p className="text-xs font-bold">{title}</p>
          <p className="mt-1 text-[11px] leading-4 opacity-80">{body}</p>
        </div>
      </div>
    </div>
  );
}
