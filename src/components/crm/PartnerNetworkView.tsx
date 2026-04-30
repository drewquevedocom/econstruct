"use client";

import { useMemo, useState, useActionState } from "react";
import type { LucideIcon } from "lucide-react";
import { Building2, CalendarClock, DollarSign, Handshake, Plus } from "lucide-react";
import {
  createPartnerLead,
  updateAgreementStatus,
  updatePartnerStatus,
} from "@/app/crm/partners/actions";

type PartnerLead = {
  id: string;
  partner_id: string;
  partner_name: string;
  company_firm: string | null;
  partner_type: string;
  specialization: string | null;
  source: string;
  contact_email: string | null;
  contact_phone: string | null;
  linkedin_url: string | null;
  how_we_met: string | null;
  referral_agreement_status: string;
  referral_fee: number | string;
  notes: string | null;
  date_added: string;
  last_contact_date: string | null;
  next_follow_up_date: string | null;
  assigned_to: string;
  status: string;
  date_signed: string | null;
};

type PartnerTemplate = {
  id: string;
  template_key: string;
  name: string;
  subject: string;
  body: string;
  updated_at: string;
};

type PartnerTask = {
  id: string;
  partner_lead_id: string;
  title: string;
  due_date: string;
  is_recurring: boolean;
  recurrence: string | null;
  completed_at: string | null;
};

type PartnerFormState = { error?: string; success?: boolean };

const PARTNER_TYPES = [
  "Architect",
  "Realtor / Real Estate Agent",
  "Insurance Agent / Adjuster",
  "Expediter / Permit Runner",
  "General Contractor (subcontract partner)",
  "HOA / Property Manager",
  "Other",
];

const SOURCES = [
  "AIA LA Event",
  "BNI / Networking",
  "Cold Outreach",
  "Referral from Frank",
  "Inbound / Found Us",
  "Other",
];

const STATUSES = ["New Lead", "Contacted", "Agreement Sent", "Active Partner", "Inactive"];
const AGREEMENTS = ["Not Started", "Sent", "Signed", "Active"];

const TYPE_COLORS: Record<string, string> = {
  Architect: "bg-blue-50 text-blue-700",
  "Realtor / Real Estate Agent": "bg-green-50 text-green-700",
  "Insurance Agent / Adjuster": "bg-orange-50 text-orange-700",
  "Expediter / Permit Runner": "bg-purple-50 text-purple-700",
  "General Contractor (subcontract partner)": "bg-slate-100 text-slate-700",
  "HOA / Property Manager": "bg-teal-50 text-teal-700",
  Other: "bg-gray-100 text-gray-700",
};

function money(value: number | string) {
  return Number(value || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function dateLabel(value: string | null) {
  if (!value) return "--";
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function isDue(value: string | null) {
  if (!value) return false;
  return value <= new Date().toISOString().slice(0, 10);
}

export default function PartnerNetworkView({
  leads,
  templates,
  tasks,
  error,
}: {
  leads: PartnerLead[];
  templates: PartnerTemplate[];
  tasks: PartnerTask[];
  error?: string | null;
}) {
  const [view, setView] = useState<"kanban" | "followup" | "active">("kanban");
  const [typeFilter, setTypeFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formState, formAction, formPending] = useActionState<PartnerFormState, FormData>(
    createPartnerLead,
    {}
  );

  const filtered = useMemo(
    () =>
      leads.filter(
        (lead) =>
          (!typeFilter || lead.partner_type === typeFilter) &&
          (!sourceFilter || lead.source === sourceFilter)
      ),
    [leads, sourceFilter, typeFilter]
  );

  const followUps = filtered
    .filter((lead) => lead.status !== "Inactive" && isDue(lead.next_follow_up_date))
    .sort((a, b) => (a.next_follow_up_date || "9999").localeCompare(b.next_follow_up_date || "9999"));

  const activePartners = filtered.filter(
    (lead) =>
      lead.status === "Active Partner" &&
      (lead.referral_agreement_status === "Active" || lead.referral_agreement_status === "Signed")
  );
  const totalReferralValue = activePartners.reduce(
    (sum, lead) => sum + Number(lead.referral_fee || 0),
    0
  );

  if (error) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-amber-800">
        <h1 className="text-lg font-bold">Partner Network needs its database migration</h1>
        <p className="mt-2 text-sm">
          Run <code>supabase/migrations/20260430_partner_network.sql</code> in Supabase SQL Editor.
        </p>
        <p className="mt-2 text-xs opacity-80">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8963E]">Partner Network</p>
          <h1 className="text-2xl font-black text-[#1C1C1E]">Architects, realtors, adjusters, expediters.</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track referral partners from first outreach to signed active agreement.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((value) => !value)}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1C1C1E] px-4 text-sm font-bold text-white hover:bg-black"
        >
          <Plus size={16} /> Add Partner Lead
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Metric icon={Handshake} label="Total Partners" value={leads.length} />
        <Metric icon={CalendarClock} label="Due Follow-Ups" value={followUps.length} tone="amber" />
        <Metric icon={Building2} label="Active Partners" value={activePartners.length} tone="green" />
        <Metric icon={DollarSign} label="Referral Value" value={money(totalReferralValue)} tone="gold" />
      </div>

      {showForm && (
        <form action={formAction} className="rounded-xl border border-[#E8E4DC] bg-white p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Field name="partner_name" label="Partner Name *" required />
            <Field name="company_firm" label="Company / Firm" />
            <Select name="partner_type" label="Partner Type" options={PARTNER_TYPES} />
            <Field name="specialization" label="Specialization" />
            <Select name="source" label="Source" options={SOURCES} />
            <Field name="contact_email" label="Contact Email" type="email" />
            <Field name="contact_phone" label="Contact Phone" />
            <Field name="linkedin_url" label="LinkedIn URL" type="url" />
            <Field name="how_we_met" label="How We Met" />
            <Select name="referral_agreement_status" label="Referral Agreement" options={AGREEMENTS} />
            <Field name="referral_fee" label="Referral Fee" type="number" defaultValue="5000" />
            <Field name="assigned_to" label="Assigned To" defaultValue="Drew Quevedo" />
            <label className="md:col-span-3 text-xs font-bold text-gray-500">
              Notes
              <textarea
                name="notes"
                rows={3}
                className="mt-1 w-full rounded-lg border border-[#E8E4DC] px-3 py-2 text-sm outline-none focus:border-[#B8963E]"
              />
            </label>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <button
              disabled={formPending}
              className="rounded-lg bg-[#B8963E] px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
            >
              {formPending ? "Saving..." : "Create Partner Lead"}
            </button>
            {"error" in formState && formState.error && (
              <span className="text-sm text-red-600">{formState.error}</span>
            )}
            {"success" in formState && formState.success && (
              <span className="text-sm text-green-700">Partner lead created.</span>
            )}
          </div>
        </form>
      )}

      <div className="flex flex-wrap gap-2 rounded-xl border border-[#E8E4DC] bg-white p-3">
        <ViewButton active={view === "kanban"} onClick={() => setView("kanban")}>Kanban Pipeline</ViewButton>
        <ViewButton active={view === "followup"} onClick={() => setView("followup")}>Follow-Up Queue</ViewButton>
        <ViewButton active={view === "active"} onClick={() => setView("active")}>Active Partners</ViewButton>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="ml-auto h-9 rounded-lg border border-[#E8E4DC] bg-white px-3 text-sm">
          <option value="">All partner types</option>
          {PARTNER_TYPES.map((type) => <option key={type}>{type}</option>)}
        </select>
        <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} className="h-9 rounded-lg border border-[#E8E4DC] bg-white px-3 text-sm">
          <option value="">All sources</option>
          {SOURCES.map((source) => <option key={source}>{source}</option>)}
        </select>
      </div>

      {view === "kanban" && <Kanban leads={filtered} />}
      {view === "followup" && <FollowUpTable leads={followUps} />}
      {view === "active" && (
        <ActiveTable leads={activePartners} totalReferralValue={totalReferralValue} />
      )}

      <div className="rounded-xl border border-[#E8E4DC] bg-white p-4">
        <h2 className="font-bold text-[#1C1C1E]">Email Templates</h2>
        <div className="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-3">
          {templates.map((template) => (
            <div key={template.id} className="rounded-xl border border-[#E8E4DC] bg-[#FAF9F6] p-3">
              <p className="text-sm font-bold text-[#1C1C1E]">{template.name}</p>
              <p className="mt-1 text-xs font-semibold text-gray-500">{template.subject}</p>
              <p className="mt-2 line-clamp-5 whitespace-pre-line text-xs leading-5 text-gray-600">
                {template.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden">{tasks.length}</div>
    </div>
  );
}

function Kanban({ leads }: { leads: PartnerLead[] }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-3">
      {STATUSES.map((status) => (
        <div key={status} className="min-h-[260px] rounded-xl border border-[#E8E4DC] bg-white p-3">
          <p className="mb-3 text-xs font-black uppercase tracking-wide text-gray-400">{status}</p>
          <div className="space-y-2">
            {leads.filter((lead) => lead.status === status).map((lead) => (
              <PartnerCard key={lead.id} lead={lead} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function PartnerCard({ lead }: { lead: PartnerLead }) {
  return (
    <div className="rounded-xl border border-[#E8E4DC] bg-[#FAF9F6] p-3">
      <p className="text-sm font-bold text-[#1C1C1E]">{lead.partner_name}</p>
      <p className="mt-0.5 text-xs text-gray-500">{lead.company_firm || "--"}</p>
      <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[11px] font-bold ${TYPE_COLORS[lead.partner_type] || TYPE_COLORS.Other}`}>
        {lead.partner_type}
      </span>
      <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-gray-500">
        <span>Last: {dateLabel(lead.last_contact_date)}</span>
        <span>Next: {dateLabel(lead.next_follow_up_date)}</span>
      </div>
      <div className="mt-2 flex gap-1">
        {lead.status !== "Contacted" && (
          <button onClick={() => updatePartnerStatus(lead.id, "Contacted")} className="rounded bg-white px-2 py-1 text-[11px] font-bold text-sky-700">
            Contacted
          </button>
        )}
        {lead.referral_agreement_status !== "Sent" && lead.status !== "Active Partner" && (
          <button onClick={() => updateAgreementStatus(lead.id, "Sent")} className="rounded bg-white px-2 py-1 text-[11px] font-bold text-amber-700">
            Agreement Sent
          </button>
        )}
        {lead.status !== "Active Partner" && (
          <button onClick={() => updateAgreementStatus(lead.id, "Signed")} className="rounded bg-white px-2 py-1 text-[11px] font-bold text-green-700">
            Signed
          </button>
        )}
      </div>
    </div>
  );
}

function FollowUpTable({ leads }: { leads: PartnerLead[] }) {
  return (
    <TableShell empty="No follow-ups due.">
      {leads.map((lead) => (
        <tr key={lead.id} className="border-t border-[#E8E4DC]/60">
          <Td strong>{lead.partner_name}</Td>
          <Td>{lead.company_firm || "--"}</Td>
          <Td><Badge type={lead.partner_type} /></Td>
          <Td>{dateLabel(lead.last_contact_date)}</Td>
          <Td>{dateLabel(lead.next_follow_up_date)}</Td>
          <Td>{lead.status}</Td>
          <Td>{lead.notes?.slice(0, 80) || "--"}</Td>
        </tr>
      ))}
    </TableShell>
  );
}

function ActiveTable({ leads, totalReferralValue }: { leads: PartnerLead[]; totalReferralValue: number }) {
  return (
    <div className="rounded-xl border border-[#E8E4DC] bg-white overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-left text-xs uppercase tracking-wide text-gray-400">
          <tr>
            {["Partner", "Type", "Company", "Email", "Phone", "Agreement", "Referral Fee", "Date Signed"].map((h) => (
              <th key={h} className="px-4 py-3">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-t border-[#E8E4DC]/60">
              <Td strong>{lead.partner_name}</Td>
              <Td><Badge type={lead.partner_type} /></Td>
              <Td>{lead.company_firm || "--"}</Td>
              <Td>{lead.contact_email || "--"}</Td>
              <Td>{lead.contact_phone || "--"}</Td>
              <Td>{lead.referral_agreement_status}</Td>
              <Td>{money(lead.referral_fee)}</Td>
              <Td>{dateLabel(lead.date_signed)}</Td>
            </tr>
          ))}
          <tr className="border-t border-[#E8E4DC] bg-[#FAF9F6] font-bold">
            <td className="px-4 py-3" colSpan={6}>Total active partners: {leads.length}</td>
            <td className="px-4 py-3" colSpan={2}>Potential value: {money(totalReferralValue)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function TableShell({ children, empty }: { children: React.ReactNode; empty: string }) {
  const hasChildren = Array.isArray(children) ? children.length > 0 : Boolean(children);
  return (
    <div className="rounded-xl border border-[#E8E4DC] bg-white overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-left text-xs uppercase tracking-wide text-gray-400">
          <tr>
            {["Partner", "Company", "Type", "Last Contact", "Next Follow-Up", "Status", "Notes"].map((h) => (
              <th key={h} className="px-4 py-3">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{hasChildren ? children : <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400">{empty}</td></tr>}</tbody>
      </table>
    </div>
  );
}

function Badge({ type }: { type: string }) {
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${TYPE_COLORS[type] || TYPE_COLORS.Other}`}>{type}</span>;
}

function Td({ children, strong }: { children: React.ReactNode; strong?: boolean }) {
  return <td className={`px-4 py-3 ${strong ? "font-semibold text-[#1C1C1E]" : "text-gray-600"}`}>{children}</td>;
}

function Field({ label, name, type = "text", required, defaultValue }: { label: string; name: string; type?: string; required?: boolean; defaultValue?: string }) {
  return (
    <label className="text-xs font-bold text-gray-500">
      {label}
      <input name={name} type={type} required={required} defaultValue={defaultValue} className="mt-1 h-9 w-full rounded-lg border border-[#E8E4DC] px-3 text-sm outline-none focus:border-[#B8963E]" />
    </label>
  );
}

function Select({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <label className="text-xs font-bold text-gray-500">
      {label}
      <select name={name} className="mt-1 h-9 w-full rounded-lg border border-[#E8E4DC] bg-white px-3 text-sm outline-none focus:border-[#B8963E]">
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function ViewButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={`h-9 rounded-lg px-3 text-sm font-bold ${active ? "bg-[#B8963E] text-white" : "bg-[#F8F6F2] text-[#1C1C1E]"}`}>
      {children}
    </button>
  );
}

function Metric({ icon: Icon, label, value, tone = "default" }: { icon: LucideIcon; label: string; value: string | number; tone?: "default" | "amber" | "green" | "gold" }) {
  const colors = tone === "amber" ? "text-amber-700 bg-amber-50" : tone === "green" ? "text-green-700 bg-green-50" : tone === "gold" ? "text-[#B8963E] bg-[#B8963E]/10" : "text-[#1C1C1E] bg-white";
  return (
    <div className="rounded-xl border border-[#E8E4DC] bg-white p-4">
      <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-lg ${colors}`}>
        <Icon size={17} />
      </div>
      <p className="text-xl font-black text-[#1C1C1E]">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}
