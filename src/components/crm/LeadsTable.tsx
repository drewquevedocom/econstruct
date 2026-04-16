"use client";

import { useState, useMemo } from "react";
import { Search, ChevronUp, ChevronDown } from "lucide-react";
import ScoreBadge from "./ScoreBadge";
import StageTag from "./StageTag";
import LeadPanel from "./LeadPanel";

interface Lead {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  zip_code: string | null;
  source: string | null;
  lifecycle_stage: string | null;
  lead_score: number | null;
  property_value: number | null;
  enrichment_status: string | null;
  address: string | null;
  owner_name: string | null;
  created_at: string;
}

type SortKey = "lead_score" | "created_at" | "name";

export default function LeadsTable({ leads }: { leads: Lead[] }) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortAsc, setSortAsc] = useState(false);
  const [stageFilter, setStageFilter] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = leads;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (l) =>
          l.name?.toLowerCase().includes(q) ||
          l.email?.toLowerCase().includes(q) ||
          l.address?.toLowerCase().includes(q) ||
          l.owner_name?.toLowerCase().includes(q)
      );
    }
    if (stageFilter) {
      list = list.filter((l) => l.lifecycle_stage === stageFilter);
    }
    list = [...list].sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      if (av < bv) return sortAsc ? -1 : 1;
      if (av > bv) return sortAsc ? 1 : -1;
      return 0;
    });
    return list;
  }, [leads, search, stageFilter, sortKey, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col ? (
      sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />
    ) : null;

  const stages = [...new Set(leads.map((l) => l.lifecycle_stage).filter(Boolean))] as string[];

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 border border-[#E8E4DC] rounded-lg bg-white text-sm focus:ring-2 focus:ring-[#B8963E] focus:border-transparent outline-none"
          />
        </div>
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="h-9 px-3 border border-[#E8E4DC] rounded-lg bg-white text-sm focus:ring-2 focus:ring-[#B8963E] outline-none"
        >
          <option value="">All stages</option>
          {stages.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <span className="text-xs text-gray-400 ml-auto">
          {filtered.length} lead{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E8E4DC] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-[#E8E4DC]">
              <th
                className="px-5 py-3 cursor-pointer select-none"
                onClick={() => toggleSort("name")}
              >
                <span className="inline-flex items-center gap-1">
                  Name <SortIcon col="name" />
                </span>
              </th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Stage</th>
              <th
                className="px-4 py-3 cursor-pointer select-none"
                onClick={() => toggleSort("lead_score")}
              >
                <span className="inline-flex items-center gap-1">
                  Score <SortIcon col="lead_score" />
                </span>
              </th>
              <th
                className="px-4 py-3 cursor-pointer select-none"
                onClick={() => toggleSort("created_at")}
              >
                <span className="inline-flex items-center gap-1">
                  Added <SortIcon col="created_at" />
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-400">
                  No leads found
                </td>
              </tr>
            ) : (
              filtered.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => setSelectedId(lead.id)}
                  className="border-b border-[#E8E4DC]/50 hover:bg-[#F8F6F2] cursor-pointer transition-colors"
                >
                  <td className="px-5 py-3 font-medium text-[#1C1C1E]">
                    {lead.name || "--"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {lead.email || "--"}
                  </td>
                  <td className="px-4 py-3 text-gray-500 capitalize">
                    {lead.source?.replace(/_/g, " ") || "--"}
                  </td>
                  <td className="px-4 py-3">
                    <StageTag stage={lead.lifecycle_stage} />
                  </td>
                  <td className="px-4 py-3">
                    <ScoreBadge score={lead.lead_score} />
                  </td>
                  <td className="px-4 py-3 text-gray-400 tabular-nums text-xs">
                    {new Date(lead.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Panel */}
      {selectedId && (
        <LeadPanel
          leadId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </>
  );
}
