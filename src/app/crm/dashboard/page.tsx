import { createServiceClient } from "@/lib/supabase/server";
import { Users, Flame, Trophy, Bot } from "lucide-react";
import StatCard from "@/components/crm/StatCard";
import LeadSourceChart from "@/components/crm/LeadSourceChart";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createServiceClient();

  // Parallel queries
  const [totalRes, hotRes, stagesRes, activityRes, agentRes, sourcesRes] =
    await Promise.all([
      supabase.from("leads").select("id", { count: "exact", head: true }),
      supabase
        .from("leads")
        .select("id", { count: "exact", head: true })
        .gte("lead_score", 85),
      supabase
        .from("leads")
        .select("lifecycle_stage")
        .not("lifecycle_stage", "is", null),
      supabase
        .from("lead_activities")
        .select("id, lead_id, type, channel, created_at")
        .order("created_at", { ascending: false })
        .limit(10),
      supabase
        .from("agent_runs")
        .select("id, agent_name, status, started_at, duration_ms")
        .order("started_at", { ascending: false })
        .limit(10),
      supabase.from("leads").select("source").not("source", "is", null),
    ]);

  const totalLeads = totalRes.count ?? 0;
  const hotLeads = hotRes.count ?? 0;

  const stages = (stagesRes.data ?? []).map((r) => r.lifecycle_stage);
  const wonCount = stages.filter((s) => s === "won").length;

  const activities = activityRes.data ?? [];
  const agentRuns = agentRes.data ?? [];

  // Source distribution
  const sourceMap: Record<string, number> = {};
  for (const r of sourcesRes.data ?? []) {
    sourceMap[r.source] = (sourceMap[r.source] || 0) + 1;
  }

  return (
    <>
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Leads" value={totalLeads} icon={Users} />
        <StatCard
          label="Hot Leads"
          value={hotLeads}
          icon={Flame}
          accent
        />
        <StatCard label="Won Deals" value={wonCount} icon={Trophy} />
        <StatCard
          label="Agent Runs (recent)"
          value={agentRuns.length}
          icon={Bot}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Source Chart */}
        <div className="bg-white rounded-xl border border-[#E8E4DC] p-6">
          <h2 className="font-bold text-[#1C1C1E] mb-4">Lead Sources</h2>
          {Object.keys(sourceMap).length > 0 ? (
            <LeadSourceChart data={sourceMap} />
          ) : (
            <p className="text-sm text-gray-400">No lead data yet</p>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-[#E8E4DC] p-6">
          <h2 className="font-bold text-[#1C1C1E] mb-4">Recent Activity</h2>
          {activities.length === 0 ? (
            <p className="text-sm text-gray-400">No activity yet</p>
          ) : (
            <div className="space-y-3">
              {activities.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between text-sm border-b border-[#E8E4DC]/50 pb-2 last:border-0"
                >
                  <div>
                    <span className="font-medium text-[#1C1C1E] capitalize">
                      {a.type?.replace(/_/g, " ")}
                    </span>
                    {a.channel && (
                      <span className="text-gray-400 ml-2 text-xs">
                        via {a.channel}
                      </span>
                    )}
                  </div>
                  <time className="text-xs text-gray-400 tabular-nums shrink-0">
                    {new Date(a.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </time>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Agent Runs */}
      <div className="bg-white rounded-xl border border-[#E8E4DC] p-6">
        <h2 className="font-bold text-[#1C1C1E] mb-4">Recent Agent Runs</h2>
        {agentRuns.length === 0 ? (
          <p className="text-sm text-gray-400">No agent runs yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase tracking-wide">
                  <th className="pb-3 pr-4">Agent</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Duration</th>
                  <th className="pb-3">When</th>
                </tr>
              </thead>
              <tbody>
                {agentRuns.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t border-[#E8E4DC]/50"
                  >
                    <td className="py-2.5 pr-4 font-medium text-[#1C1C1E]">
                      {r.agent_name}
                    </td>
                    <td className="py-2.5 pr-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          r.status === "success"
                            ? "bg-green-50 text-green-700"
                            : r.status === "running"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 text-gray-500 tabular-nums">
                      {r.duration_ms != null
                        ? `${(r.duration_ms / 1000).toFixed(1)}s`
                        : "--"}
                    </td>
                    <td className="py-2.5 text-gray-400 tabular-nums">
                      {new Date(r.started_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
