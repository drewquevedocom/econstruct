import Link from "next/link";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Flame,
  Trophy,
  Users,
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

type HotLead = {
  id: string;
  name: string | null;
  owner_name: string | null;
  email: string | null;
  address: string | null;
  owner_mailing_address: string | null;
  lead_score: number | null;
  created_at: string;
  source: string | null;
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
  return "bg-red-50 text-red-600";
}

function sourceLabel(source: string | null) {
  return source?.replace(/_/g, " ") || "unknown";
}

function leadAction(lead: HotLead) {
  if (lead.email) return { label: "Email ready", tone: "text-sky-700 bg-sky-50" };
  if (lead.owner_mailing_address) return { label: "Mail ready", tone: "text-amber-700 bg-amber-50" };
  if (lead.address) return { label: "Mail property", tone: "text-orange-700 bg-orange-50" };
  return { label: "Needs enrich", tone: "text-red-700 bg-red-50" };
}

export default async function DashboardPage() {
  const supabase = createServiceClient();

  const [
    totalRes,
    hotRes,
    warmRes,
    missingEmailRes,
    hotEmailRes,
    mailReadyRes,
    contactedRes,
    wonRes,
    activityRes,
    agentRes,
    sourcesRes,
    hotLeadRes,
  ] = await Promise.all([
    supabase.from("leads").select("id", { count: "exact", head: true }),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .gte("lead_score", 70)
      .or("dnc.is.null,dnc.eq.false"),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .gte("lead_score", 50)
      .lt("lead_score", 70)
      .or("dnc.is.null,dnc.eq.false"),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .gte("lead_score", 70)
      .is("email", null)
      .or("dnc.is.null,dnc.eq.false"),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .gte("lead_score", 70)
      .not("email", "is", null)
      .or("dnc.is.null,dnc.eq.false"),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .gte("lead_score", 70)
      .is("email", null)
      .not("owner_mailing_address", "is", null)
      .or("dnc.is.null,dnc.eq.false"),
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
      .limit(6),
    supabase.from("leads").select("source").not("source", "is", null),
    supabase
      .from("leads")
      .select("id, name, owner_name, email, address, owner_mailing_address, lead_score, created_at, source")
      .gte("lead_score", 70)
      .or("dnc.is.null,dnc.eq.false")
      .order("lead_score", { ascending: false })
      .order("created_at", { ascending: true })
      .limit(8),
  ]);

  const totalLeads = totalRes.count ?? 0;
  const hotLeads = hotRes.count ?? 0;
  const warmLeads = warmRes.count ?? 0;
  const missingHotEmails = missingEmailRes.count ?? 0;
  const hotWithEmail = hotEmailRes.count ?? 0;
  const mailReady = mailReadyRes.count ?? 0;
  const activePipeline = contactedRes.count ?? 0;
  const wonCount = wonRes.count ?? 0;
  const activities = activityRes.data ?? [];
  const agentRuns = (agentRes.data ?? []) as AgentRun[];
  const hotLeadRows = (hotLeadRes.data ?? []) as HotLead[];
  const failedAgents = agentRuns.filter((run) => run.status === "failed").length;
  const runningAgents = agentRuns.filter((run) => run.status === "running").length;
  const sourceMap: Record<string, number> = {};

  for (const r of sourcesRes.data ?? []) {
    const key = sourceLabel(r.source);
    sourceMap[key] = (sourceMap[key] || 0) + 1;
  }

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-4">
        <div className="relative overflow-hidden rounded-2xl border border-[#E8E4DC] bg-[#1C1C1E] p-5 text-white">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-red-500/20 blur-3xl" />
          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#D4B96A]">
                CRM Command Center
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight">
                {hotLeads} hot leads need motion.
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
                Prioritize contactability: find emails for hot leads, approve the few that are email-ready, and mail the rest before they go stale.
              </p>
            </div>
            <Link
              href="/crm/leads"
              className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-[#B8963E] px-4 text-sm font-bold text-white hover:bg-[#9A7B2F]"
            >
              Open Hot Leads
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <MiniAction label="Missing email" value={missingHotEmails} tone="red" />
          <MiniAction label="Email ready" value={hotWithEmail} tone="blue" />
          <MiniAction label="Mail ready" value={mailReady} tone="amber" />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Leads" value={totalLeads} icon={Users} helper="All sources" />
        <StatCard label="Hot Leads" value={hotLeads} icon={Flame} tone="red" helper="Score 70+" />
        <StatCard label="Warm Leads" value={warmLeads} icon={Clock} tone="amber" helper="Score 50-69" />
        <StatCard
          label="Won Deals"
          value={wonCount}
          icon={Trophy}
          tone="green"
          helper={`${activePipeline} active pipeline`}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_0.75fr] gap-4">
        <div className="bg-white rounded-xl border border-[#E8E4DC] p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-[#1C1C1E]">Hot Lead Action Board</h2>
              <p className="mt-0.5 text-xs text-gray-500">Top score leads, with the next realistic contact move.</p>
            </div>
            <Link href="/crm/leads" className="text-xs font-bold text-[#B8963E] hover:underline">
              View all
            </Link>
          </div>
          {hotLeadRows.length === 0 ? (
            <p className="text-sm text-gray-400">No hot leads found. If this looks wrong, rerun scoring.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {hotLeadRows.map((lead) => {
                const action = leadAction(lead);
                return (
                  <div key={lead.id} className="rounded-xl border border-[#E8E4DC] bg-[#FAF9F6] p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[#1C1C1E]">
                          {lead.name || lead.owner_name || "Unknown owner"}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-gray-500">
                          {lead.address || lead.owner_mailing_address || sourceLabel(lead.source)}
                        </p>
                      </div>
                      <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-black text-red-600">
                        {lead.lead_score ?? "--"}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${action.tone}`}>
                        {action.label}
                      </span>
                      <span className="text-[11px] text-gray-400">{sourceLabel(lead.source)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-[#E8E4DC] p-4">
          <h2 className="font-bold text-[#1C1C1E] mb-3">Recommendations</h2>
          <div className="space-y-2 text-sm">
            <Recommendation
              tone="red"
              title="Attack hot missing emails"
              body={`${missingHotEmails} hot leads still need email enrichment. Do not spend credits below 70 until this is cleared.`}
            />
            <Recommendation
              tone="amber"
              title="Mail the no-email winners"
              body={`${mailReady} hot leads have mailing addresses. Export a flyer list weekly while email append runs.`}
            />
            <Recommendation
              tone={failedAgents > 0 ? "red" : "green"}
              title="Agent health"
              body={
                failedAgents > 0
                  ? `${failedAgents} recent agent run(s) failed. Check logs before trusting automation.`
                  : `${runningAgents} running now. Recent agent sample has no failures.`
              }
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <CompactCard title="Lead Sources">
          {Object.keys(sourceMap).length > 0 ? (
            <div className="mx-auto max-w-[200px]">
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
                <div key={a.id} className="flex items-center justify-between gap-3 border-b border-[#E8E4DC]/50 pb-1.5 text-xs last:border-0">
                  <div className="min-w-0">
                    <p className="truncate font-semibold capitalize text-[#1C1C1E]">{a.type?.replace(/_/g, " ")}</p>
                    {a.channel && <p className="text-[11px] text-gray-400">via {a.channel}</p>}
                  </div>
                  <time className="shrink-0 text-[11px] text-gray-400 tabular-nums">{formatWhen(a.created_at)}</time>
                </div>
              ))}
            </div>
          )}
        </CompactCard>

        <CompactCard title="Recent Agent Runs">
          {agentRuns.length === 0 ? (
            <p className="text-sm text-gray-400">No agent runs yet</p>
          ) : (
            <div className="space-y-2">
              {agentRuns.map((run) => (
                <div key={run.id} className="flex items-center justify-between gap-3 border-b border-[#E8E4DC]/50 pb-1.5 text-xs last:border-0">
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
  tone: "red" | "blue" | "amber";
}) {
  const classes =
    tone === "red"
      ? "bg-red-50 text-red-600 border-red-100"
      : tone === "blue"
        ? "bg-sky-50 text-sky-700 border-sky-100"
        : "bg-amber-50 text-amber-700 border-amber-100";

  return (
    <div className={`rounded-2xl border p-4 ${classes}`}>
      <p className="text-2xl font-black tabular-nums">{value}</p>
      <p className="mt-1 text-[11px] font-bold uppercase tracking-wide opacity-80">{label}</p>
    </div>
  );
}

function CompactCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-[230px] rounded-xl border border-[#E8E4DC] bg-white p-4">
      <h2 className="mb-3 text-sm font-bold text-[#1C1C1E]">{title}</h2>
      {children}
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
