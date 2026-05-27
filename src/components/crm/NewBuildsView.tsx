"use client";

import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Download,
  Mail,
  MapPin,
  Search,
  Sparkles,
  Users as UsersIcon,
  Wallet,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

type Permit = {
  id: string;
  address: string | null;
  zip_code: string | null;
  apn: string | null;
  subsource: string | null;
  property_value: number | null;
  owner_name: string | null;
  owner_mailing_address: string | null;
  owner_type: string | null;
  enrichment_status: string | null;
  created_at: string;
  updated_at: string | null;
  tags: string[] | null;
};

type AgentRun = {
  agent_name: string;
  status: string | null;
  started_at: string;
  records_pulled: number | null;
  records_updated: number | null;
  metadata: Record<string, unknown> | null;
};

type Tab = "mail" | "individual" | "all" | "unenriched";

const PERMIT_TYPE_LABELS: Record<string, string> = {
  "Bldg-New": "New Construction",
  Grading: "Grading (pre-build)",
  "Bldg-Addition": "Major Addition",
  "Bldg-Alter/Repair": "Alter/Repair",
  "Bldg-Demolition": "Demolition (pre-build)",
  "Swimming-Pool/Spa": "Pool/Spa",
  "Nonbldg-New": "Non-building New",
};

function permitLabel(subsource: string | null) {
  if (!subsource) return "Unknown";
  const head = subsource.split(" - ")[0];
  return PERMIT_TYPE_LABELS[head] || head;
}

function money(v: number | null | undefined) {
  if (!v) return "—";
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `$${Math.round(v / 1_000)}K`;
  return `$${v.toLocaleString()}`;
}

function csvEscape(value: unknown) {
  const text = value == null ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function downloadCsv(filename: string, rows: Permit[], mode: "mail" | "individual") {
  const headers =
    mode === "mail"
      ? ["owner_name", "owner_mailing_address", "property_address", "zip", "permit_type", "valuation", "apn"]
      : ["owner_name", "owner_type", "property_address", "zip", "permit_type", "valuation", "owner_mailing_address", "apn"];
  const csvRows = rows.map((p) => {
    if (mode === "mail") {
      return [
        p.owner_name,
        p.owner_mailing_address,
        p.address,
        p.zip_code,
        permitLabel(p.subsource),
        p.property_value,
        p.apn,
      ]
        .map(csvEscape)
        .join(",");
    }
    return [
      p.owner_name,
      p.owner_type,
      p.address,
      p.zip_code,
      permitLabel(p.subsource),
      p.property_value,
      p.owner_mailing_address,
      p.apn,
    ]
      .map(csvEscape)
      .join(",");
  });
  const blob = new Blob([[headers.join(","), ...csvRows].join("\n")], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function NewBuildsView({
  permits,
  recentRuns,
  tier1Zips,
  error,
}: {
  permits: Permit[];
  recentRuns: AgentRun[];
  tier1Zips: string[];
  error?: string | null;
}) {
  const [tab, setTab] = useState<Tab>("mail");
  const [zipFilter, setZipFilter] = useState("");
  const [permitFilter, setPermitFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [minValuation, setMinValuation] = useState(0);

  const stats = useMemo(() => {
    const enriched = permits.filter((p) => p.owner_name);
    const entities = enriched.filter((p) => p.owner_type === "entity");
    const individuals = enriched.filter((p) => p.owner_type === "individual");
    const mailReady = enriched.filter((p) => p.owner_mailing_address);
    const luxValue = permits.filter((p) => (p.property_value ?? 0) >= 1_000_000);
    return {
      total: permits.length,
      enriched: enriched.length,
      entities: entities.length,
      individuals: individuals.length,
      mailReady: mailReady.length,
      luxury: luxValue.length,
    };
  }, [permits]);

  const filtered = useMemo(() => {
    let rows = permits;
    if (tab === "mail") rows = rows.filter((p) => p.owner_name && p.owner_mailing_address);
    else if (tab === "individual") rows = rows.filter((p) => p.owner_type === "individual");
    else if (tab === "unenriched") rows = rows.filter((p) => !p.owner_name);
    if (zipFilter) rows = rows.filter((p) => p.zip_code === zipFilter);
    if (permitFilter) rows = rows.filter((p) => p.subsource?.startsWith(permitFilter));
    if (minValuation > 0) rows = rows.filter((p) => (p.property_value ?? 0) >= minValuation);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      rows = rows.filter(
        (p) =>
          p.address?.toLowerCase().includes(q) ||
          p.owner_name?.toLowerCase().includes(q) ||
          p.owner_mailing_address?.toLowerCase().includes(q)
      );
    }
    return rows;
  }, [permits, tab, zipFilter, permitFilter, minValuation, searchQuery]);

  const zipCounts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const p of permits) if (p.zip_code) m[p.zip_code] = (m[p.zip_code] ?? 0) + 1;
    return m;
  }, [permits]);

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
        Failed to load new-build permits: {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Hero strategy banner */}
      <div className="relative overflow-hidden rounded-2xl border border-[#E8E4DC] bg-[#1C1C1E] p-5 text-white">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#D4B96A]">
              New Construction Pipeline
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-[#FFF8E7]">
              {stats.mailReady} luxury new-builds ready for direct mail.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#F2E8C9]">
              LADBS permits in Tier-1 LA zips, enriched with owner names + mailing addresses via ATTOM.
              Most owners are LLCs and family trusts — direct mail is the channel. Individual owners get a separate Apollo lookup batch.
            </p>
          </div>
          <Sparkles size={32} className="hidden text-[#D4B96A] md:block" />
        </div>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        <Metric icon={Building2} label="Total Permits" value={stats.total} />
        <Metric icon={Wallet} label="$1M+ Valuation" value={stats.luxury} tone="gold" />
        <Metric icon={UsersIcon} label="Owner Enriched" value={stats.enriched} tone="sky" />
        <Metric icon={Mail} label="Direct-Mail Ready" value={stats.mailReady} tone="amber" />
        <Metric icon={Building2} label="Entity Owners" value={stats.entities} tone="default" />
        <Metric icon={UsersIcon} label="Individual Owners" value={stats.individuals} tone="green" />
      </div>

      {/* Agent run health */}
      <div className="rounded-xl border border-[#E8E4DC] bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-bold text-[#1C1C1E]">Pipeline Health</h2>
          <span className="text-xs text-gray-500">Recent runs of ingest + enrichment agents</span>
        </div>
        {recentRuns.length === 0 ? (
          <p className="text-sm text-gray-400">No recent agent runs.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {recentRuns.map((r, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-[#E8E4DC] bg-[#FAF9F6] p-3">
                {r.status === "success" ? (
                  <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
                ) : (
                  <AlertTriangle size={18} className="shrink-0 text-amber-600" />
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#1C1C1E]">{r.agent_name}</p>
                  <p className="text-[11px] text-gray-500">
                    {r.started_at?.slice(0, 16).replace("T", " ")} · pulled {r.records_pulled ?? 0} · updated{" "}
                    {r.records_updated ?? 0}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ZIP overview */}
      <div className="rounded-xl border border-[#E8E4DC] bg-white p-4">
        <h2 className="mb-3 font-bold text-[#1C1C1E]">Tier-1 ZIP Pipeline</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-2">
          {tier1Zips.map((z) => (
            <button
              key={z}
              onClick={() => setZipFilter(zipFilter === z ? "" : z)}
              className={`rounded-lg border px-3 py-2 text-left transition-colors ${
                zipFilter === z ? "border-[#B8963E] bg-[#B8963E]/10" : "border-[#E8E4DC] bg-[#FAF9F6] hover:border-[#B8963E]/50"
              }`}
            >
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">{z}</p>
              <p className="mt-0.5 text-lg font-bold tabular-nums text-[#1C1C1E]">{zipCounts[z] ?? 0}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Tabs + Actions */}
      <div className="rounded-xl border border-[#E8E4DC] bg-white p-4">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <TabButton active={tab === "mail"} onClick={() => setTab("mail")}>
            Direct-Mail Ready ({stats.mailReady})
          </TabButton>
          <TabButton active={tab === "individual"} onClick={() => setTab("individual")}>
            Individual Owners ({stats.individuals})
          </TabButton>
          <TabButton active={tab === "all"} onClick={() => setTab("all")}>
            All ({stats.total})
          </TabButton>
          <TabButton active={tab === "unenriched"} onClick={() => setTab("unenriched")}>
            Unenriched ({stats.total - stats.enriched})
          </TabButton>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search address or owner"
                className="h-9 w-64 rounded-lg border border-[#E8E4DC] bg-white pl-8 pr-3 text-sm outline-none focus:border-[#B8963E]"
              />
            </div>
            <select
              value={permitFilter}
              onChange={(e) => setPermitFilter(e.target.value)}
              className="h-9 rounded-lg border border-[#E8E4DC] bg-white px-3 text-sm"
            >
              <option value="">All permit types</option>
              <option value="Bldg-New">New Construction</option>
              <option value="Grading">Grading</option>
              <option value="Bldg-Addition">Addition</option>
              <option value="Bldg-Alter/Repair">Alter/Repair</option>
              <option value="Bldg-Demolition">Demolition</option>
            </select>
            <select
              value={minValuation}
              onChange={(e) => setMinValuation(Number(e.target.value))}
              className="h-9 rounded-lg border border-[#E8E4DC] bg-white px-3 text-sm"
            >
              <option value={0}>Any valuation</option>
              <option value={500_000}>$500K+</option>
              <option value={1_000_000}>$1M+</option>
              <option value={2_000_000}>$2M+</option>
              <option value={5_000_000}>$5M+</option>
            </select>
            <button
              type="button"
              disabled={tab !== "mail" && tab !== "individual"}
              onClick={() => {
                const filename = `econstruct-${tab === "mail" ? "direct-mail" : "apollo-lookup"}-${new Date().toISOString().slice(0, 10)}.csv`;
                downloadCsv(filename, filtered, tab === "mail" ? "mail" : "individual");
              }}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#B8963E] px-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Download size={14} /> Export {tab === "mail" ? "Mail Batch" : "Apollo List"}
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-gray-400">No permits match these filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E8E4DC] text-left text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  <th className="px-3 py-2">Property</th>
                  <th className="px-3 py-2">Zip</th>
                  <th className="px-3 py-2">Permit</th>
                  <th className="px-3 py-2 text-right">Valuation</th>
                  <th className="px-3 py-2">Owner</th>
                  <th className="px-3 py-2">Owner Type</th>
                  <th className="px-3 py-2">Mailing Address</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 200).map((p) => (
                  <tr key={p.id} className="border-b border-[#E8E4DC]/40 hover:bg-[#FAF9F6]">
                    <td className="px-3 py-2 font-semibold text-[#1C1C1E]">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={12} className="shrink-0 text-gray-400" />
                        {p.address || "—"}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-gray-600 tabular-nums">{p.zip_code || "—"}</td>
                    <td className="px-3 py-2 text-gray-600">{permitLabel(p.subsource)}</td>
                    <td className="px-3 py-2 text-right font-semibold text-[#B8963E] tabular-nums">
                      {money(p.property_value)}
                    </td>
                    <td className="px-3 py-2 text-gray-700">{p.owner_name || <span className="text-gray-300">Not enriched</span>}</td>
                    <td className="px-3 py-2">
                      {p.owner_type === "entity" ? (
                        <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[11px] font-bold text-purple-700">LLC/Trust</span>
                      ) : p.owner_type === "individual" ? (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">Individual</span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2 max-w-[260px] truncate text-xs text-gray-500">
                      {p.owner_mailing_address || <span className="text-gray-300">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length > 200 && (
              <p className="mt-3 text-center text-xs text-gray-400">
                Showing first 200 of {filtered.length}. Refine filters to narrow further.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-sm font-bold transition-colors ${
        active ? "bg-[#1C1C1E] text-white" : "bg-[#FAF9F6] text-gray-600 hover:bg-[#E8E4DC]"
      }`}
    >
      {children}
    </button>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  tone = "default",
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  tone?: "default" | "amber" | "green" | "gold" | "sky";
}) {
  const colors =
    tone === "amber"
      ? "text-amber-700 bg-amber-50"
      : tone === "green"
        ? "text-emerald-700 bg-emerald-50"
        : tone === "gold"
          ? "text-[#B8963E] bg-[#B8963E]/10"
          : tone === "sky"
            ? "text-sky-700 bg-sky-50"
            : "text-[#1C1C1E] bg-white";
  return (
    <div className="rounded-xl border border-[#E8E4DC] bg-white p-4">
      <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-lg ${colors}`}>
        <Icon size={18} />
      </div>
      <p className="text-2xl font-black tabular-nums text-[#1C1C1E]">{value.toLocaleString()}</p>
      <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-gray-500">{label}</p>
    </div>
  );
}
