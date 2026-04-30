"use client";

import { useMemo, useState, useTransition } from "react";
import { Download, MailSearch, CheckCircle2, Ban, SkipForward, Send, Search } from "lucide-react";
import {
  markOutreachExported,
  runEmailEnrichmentForSelected,
  updateOutreachStatus,
} from "@/app/crm/outreach/actions";
import ScoreBadge from "./ScoreBadge";

type OutreachStatus =
  | "needs_email"
  | "email_found"
  | "ready_for_email_review"
  | "ready_for_mail_review"
  | "approved"
  | "sent"
  | "skipped"
  | "do_not_contact";

type OutreachLead = {
  id: string;
  name: string | null;
  owner_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  owner_mailing_address: string | null;
  zip_code: string | null;
  source: string | null;
  lifecycle_stage: string | null;
  lead_score: number | null;
  property_value: number | null;
  fire_damage_status: string | null;
  dnc: boolean | null;
  outreach_status: OutreachStatus | null;
  outreach_notes: string | null;
  outreach_approved_at: string | null;
  outreach_exported_at: string | null;
  created_at: string;
  updated_at: string | null;
  email_enrichment_attempts: number | null;
  last_email_enrichment_at: string | null;
};

type Metrics = {
  hotMissingEmail: number;
  mailReady: number;
  approved: number;
  exported: number;
  providerStats: Record<string, { attempts: number; success: number; cost: number }>;
};

const STATUS_LABELS: Record<OutreachStatus, string> = {
  needs_email: "Needs email",
  email_found: "Email found",
  ready_for_email_review: "Review email",
  ready_for_mail_review: "Review mail",
  approved: "Approved",
  sent: "Sent",
  skipped: "Skipped",
  do_not_contact: "DNC",
};

function ageInDays(date: string) {
  return Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / (24 * 60 * 60 * 1000)));
}

function recommendedAction(lead: OutreachLead) {
  if (lead.dnc || lead.outreach_status === "do_not_contact") return "Do not contact";
  if (lead.outreach_status === "approved") return lead.email ? "Export/enroll email" : "Export direct mail";
  if (lead.email) return "Review cold email";
  if ((lead.email_enrichment_attempts ?? 0) >= 2 && (lead.owner_mailing_address || lead.address)) {
    return "Review direct mail";
  }
  if (ageInDays(lead.created_at) >= 7 && (lead.owner_mailing_address || lead.address)) {
    return "Review direct mail";
  }
  return "Find email";
}

function statusClass(status: OutreachStatus | null) {
  switch (status) {
    case "approved":
      return "bg-green-50 text-green-700";
    case "ready_for_email_review":
    case "email_found":
      return "bg-sky-50 text-sky-700";
    case "ready_for_mail_review":
      return "bg-amber-50 text-amber-700";
    case "skipped":
      return "bg-gray-100 text-gray-600";
    case "do_not_contact":
      return "bg-red-50 text-red-600";
    case "sent":
      return "bg-indigo-50 text-indigo-700";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function csvEscape(value: unknown) {
  const text = value == null ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function downloadCsv(filename: string, leads: OutreachLead[]) {
  const headers = [
    "name",
    "owner_name",
    "email",
    "phone",
    "property_address",
    "mailing_address",
    "zip",
    "score",
    "source",
    "fire_status",
    "recommended_action",
    "outreach_status",
    "notes",
  ];
  const rows = leads.map((lead) =>
    [
      lead.name || lead.owner_name,
      lead.owner_name,
      lead.email,
      lead.phone,
      lead.address,
      lead.owner_mailing_address,
      lead.zip_code,
      lead.lead_score,
      lead.source,
      lead.fire_damage_status,
      recommendedAction(lead),
      lead.outreach_status,
      lead.outreach_notes,
    ]
      .map(csvEscape)
      .join(",")
  );
  const blob = new Blob([[headers.join(","), ...rows].join("\n")], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function OutreachQueue({ leads, metrics }: { leads: OutreachLead[]; metrics: Metrics }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return leads.filter((lead) => {
      if (statusFilter && lead.outreach_status !== statusFilter) return false;
      if (!q) return true;
      return [lead.name, lead.owner_name, lead.email, lead.address, lead.owner_mailing_address, lead.source]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(q));
    });
  }, [leads, search, statusFilter]);

  const selectedLeads = useMemo(
    () => leads.filter((lead) => selected.has(lead.id)),
    [leads, selected]
  );

  const selectedIds = Array.from(selected);
  const providerSummary = Object.entries(metrics.providerStats)
    .map(([provider, stat]) => {
      const rate = stat.attempts ? Math.round((stat.success / stat.attempts) * 100) : 0;
      return `${provider}: ${stat.success}/${stat.attempts} (${rate}%)`;
    })
    .join(" | ");

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function runAction(action: () => Promise<{ error?: string; success?: boolean; result?: unknown }>, success: string) {
    startTransition(async () => {
      const res = await action();
      if (res.error) setMessage(res.error);
      else {
        setMessage(success);
        setSelected(new Set());
      }
    });
  }

  const approvedSelected = selectedLeads.filter((lead) => lead.outreach_status === "approved");
  const emailExport = approvedSelected.filter((lead) => lead.email);
  const mailExport = approvedSelected.filter((lead) => !lead.email && (lead.owner_mailing_address || lead.address));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#1C1C1E]">Outreach Queue</h1>
          <p className="mt-1 text-sm text-gray-500">
            Human review for 70+ score leads. Email-first, direct mail fallback.
          </p>
        </div>
        <div className="text-xs text-gray-400">
          {providerSummary || "No provider attempts in last 24h"}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Metric label="Hot missing email" value={metrics.hotMissingEmail} tone="text-red-600" />
        <Metric label="Mail ready" value={metrics.mailReady} tone="text-amber-600" />
        <Metric label="Approved" value={metrics.approved} tone="text-green-700" />
        <Metric label="Exported" value={metrics.exported} tone="text-indigo-700" />
      </div>

      <div className="bg-white rounded-xl border border-[#E8E4DC] p-3 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search queue..."
            className="h-9 w-full rounded-lg border border-[#E8E4DC] pl-9 pr-3 text-sm outline-none focus:border-[#B8963E] focus:ring-2 focus:ring-[#B8963E]/20"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 rounded-lg border border-[#E8E4DC] bg-white px-3 text-sm outline-none focus:border-[#B8963E]"
        >
          <option value="">All statuses</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <span className="ml-auto text-xs text-gray-400">
          {selected.size} selected / {filtered.length} shown
        </span>
      </div>

      <div className="bg-white rounded-xl border border-[#E8E4DC] p-3 flex flex-wrap gap-2">
        <button
          disabled={!selected.size || isPending}
          onClick={() =>
            runAction(
              () => runEmailEnrichmentForSelected(selectedIds),
              "Email enrichment queued for selected hot leads."
            )
          }
          className="btn-outreach"
        >
          <MailSearch size={14} /> Run email enrichment
        </button>
        <button
          disabled={!selected.size || isPending}
          onClick={() =>
            runAction(
              () => updateOutreachStatus(selectedIds, "approved"),
              "Selected leads approved for export/enrollment."
            )
          }
          className="btn-outreach"
        >
          <CheckCircle2 size={14} /> Approve
        </button>
        <button
          disabled={!selected.size || isPending}
          onClick={() =>
            runAction(() => updateOutreachStatus(selectedIds, "skipped"), "Selected leads skipped.")
          }
          className="btn-outreach"
        >
          <SkipForward size={14} /> Skip
        </button>
        <button
          disabled={!selected.size || isPending}
          onClick={() =>
            runAction(
              () => updateOutreachStatus(selectedIds, "do_not_contact"),
              "Selected leads marked do not contact."
            )
          }
          className="btn-outreach-danger"
        >
          <Ban size={14} /> DNC
        </button>
        <button
          disabled={!emailExport.length || isPending}
          onClick={() => {
            downloadCsv(`econstruct-email-outreach-${new Date().toISOString().slice(0, 10)}.csv`, emailExport);
            runAction(() => markOutreachExported(emailExport.map((lead) => lead.id)), "Email CSV exported.");
          }}
          className="btn-outreach"
        >
          <Download size={14} /> Export approved email ({emailExport.length})
        </button>
        <button
          disabled={!mailExport.length || isPending}
          onClick={() => {
            downloadCsv(`econstruct-direct-mail-${new Date().toISOString().slice(0, 10)}.csv`, mailExport);
            runAction(() => markOutreachExported(mailExport.map((lead) => lead.id)), "Direct mail CSV exported.");
          }}
          className="btn-outreach"
        >
          <Send size={14} /> Export approved mail ({mailExport.length})
        </button>
      </div>

      {message && (
        <div className="rounded-lg border border-[#E8E4DC] bg-[#F8F6F2] px-4 py-2 text-sm text-[#1C1C1E]">
          {message}
        </div>
      )}

      <div className="bg-white rounded-xl border border-[#E8E4DC] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-[#E8E4DC]">
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={filtered.length > 0 && filtered.every((lead) => selected.has(lead.id))}
                  onChange={(e) =>
                    setSelected(
                      e.target.checked ? new Set(filtered.map((lead) => lead.id)) : new Set()
                    )
                  }
                />
              </th>
              <th className="px-4 py-3">Lead</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Property</th>
              <th className="px-4 py-3">Mailing</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Age</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead) => (
              <tr key={lead.id} className="border-b border-[#E8E4DC]/50 hover:bg-[#F8F6F2]">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(lead.id)}
                    onChange={() => toggle(lead.id)}
                  />
                </td>
                <td className="px-4 py-3 min-w-[180px]">
                  <p className="font-semibold text-[#1C1C1E]">{lead.name || lead.owner_name || "--"}</p>
                  <p className="text-xs text-gray-400">{lead.source?.replace(/_/g, " ") || "--"}</p>
                </td>
                <td className="px-4 py-3 text-gray-600 min-w-[180px]">{lead.email || "--"}</td>
                <td className="px-4 py-3 text-gray-600 min-w-[220px]">{lead.address || "--"}</td>
                <td className="px-4 py-3 text-gray-600 min-w-[220px]">
                  {lead.owner_mailing_address || "--"}
                </td>
                <td className="px-4 py-3">
                  <ScoreBadge score={lead.lead_score} />
                </td>
                <td className="px-4 py-3 text-gray-500 tabular-nums">{ageInDays(lead.created_at)}d</td>
                <td className="px-4 py-3 text-gray-700 font-medium min-w-[150px]">
                  {recommendedAction(lead)}
                  <p className="text-[11px] text-gray-400 font-normal">
                    {lead.email_enrichment_attempts ?? 0} email attempt
                    {(lead.email_enrichment_attempts ?? 0) === 1 ? "" : "s"}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-bold ${statusClass(
                      lead.outreach_status
                    )}`}
                  >
                    {STATUS_LABELS[lead.outreach_status || "needs_email"]}
                  </span>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr>
                <td colSpan={9} className="py-12 text-center text-gray-400">
                  No outreach leads found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .btn-outreach,
        .btn-outreach-danger {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          border-radius: 0.55rem;
          border: 1px solid #e8e4dc;
          padding: 0.5rem 0.75rem;
          font-size: 0.75rem;
          font-weight: 700;
          transition: all 150ms ease;
        }
        .btn-outreach {
          color: #1c1c1e;
          background: #fff;
        }
        .btn-outreach:hover:not(:disabled) {
          border-color: #b8963e;
          color: #9a7b2f;
        }
        .btn-outreach-danger {
          color: #b91c1c;
          background: #fff;
        }
        .btn-outreach-danger:hover:not(:disabled) {
          border-color: #ef4444;
          background: #fef2f2;
        }
        button:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="rounded-xl border border-[#E8E4DC] bg-white px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
      <p className={`text-2xl font-bold ${tone}`}>{value}</p>
    </div>
  );
}
