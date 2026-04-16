import { createAnonClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AgentsPage() {
  const supabase = createAnonClient();

  const { data: runs } = await supabase
    .from("agent_runs")
    .select("*")
    .order("started_at", { ascending: false })
    .limit(100);

  const agentRuns = runs ?? [];

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {agentRuns.length} recent run{agentRuns.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="bg-white rounded-xl border border-[#E8E4DC] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-[#E8E4DC]">
              <th className="px-5 py-3">Agent</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Pulled</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3">Errors</th>
              <th className="px-4 py-3">When</th>
            </tr>
          </thead>
          <tbody>
            {agentRuns.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-gray-400">
                  No agent runs yet
                </td>
              </tr>
            ) : (
              agentRuns.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-[#E8E4DC]/50 hover:bg-[#F8F6F2] transition-colors"
                >
                  <td className="px-5 py-3 font-medium text-[#1C1C1E]">
                    {r.agent_name}
                  </td>
                  <td className="px-4 py-3">
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
                  <td className="px-4 py-3 text-gray-500 tabular-nums">
                    {r.duration_ms != null
                      ? `${(r.duration_ms / 1000).toFixed(1)}s`
                      : "--"}
                  </td>
                  <td className="px-4 py-3 text-gray-500 tabular-nums">
                    {r.records_pulled ?? 0}
                  </td>
                  <td className="px-4 py-3 text-gray-500 tabular-nums">
                    {r.records_created ?? 0}
                  </td>
                  <td className="px-4 py-3 text-gray-500 tabular-nums">
                    {r.records_updated ?? 0}
                  </td>
                  <td className="px-4 py-3">
                    {r.errors?.length > 0 ? (
                      <span className="text-red-600 text-xs max-w-[200px] truncate block">
                        {r.errors[0]}
                      </span>
                    ) : (
                      <span className="text-gray-300">--</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-400 tabular-nums text-xs whitespace-nowrap">
                    {new Date(r.started_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
