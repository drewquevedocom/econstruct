"use client";

import { useMemo, useState, useActionState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Building2,
  CalendarClock,
  Copy,
  DollarSign,
  Download,
  Handshake,
  Mail,
  Plus,
  Rocket,
} from "lucide-react";
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

const ASAP_EMAILS = [
  {
    template_key: "architect_cold_intro",
    name: "Architects: ADU + Fire Rebuild",
    subject: "GC Partnership - Fire Rebuild + ADU Pipeline in LA",
    body: `Hi [First Name],

My name is Frank Neimroozi - I'm the owner of econstruct, a general contracting firm based in Los Angeles. We specialize in commercial tenant improvements, ADU construction, and fire rebuilds across LA County.

With the Palisades and Eaton rebuild volume ramping up this year, I'm building a small network of trusted architects and design firms we can refer clients to - and vice versa.

The idea is simple: when you have a client who needs a reliable GC, we'd love to be your first call. When we have a client who needs design work, we send them your way. We also have a formal referral program - $5,000 for every signed GC contract that comes through a partner referral.

Would you be open to a quick 15-minute call this week to see if there's a fit?

Frank Neimroozi
Owner, econstruct
frank@econstructinc.com
econstructinc.com`,
  },
  {
    template_key: "adjuster_fire_rebuild",
    name: "Insurance Adjusters: Fire Claim to Rebuild",
    subject: "GC Referral Partnership - Palisades + Eaton Fire Rebuild",
    body: `Hi [First Name],

I'm Frank Neimroozi, owner of econstruct - a licensed general contracting firm in Los Angeles. We've been doing a lot of work in the fire rebuild space this year and I wanted to connect with adjusters who are actively working claims in the Palisades and Eaton areas.

Here's what I've noticed: once a homeowner gets their settlement, the #1 question is "who do I trust to rebuild?" That gap is where we can help each other.

We're offering a $5,000 referral fee for every signed rebuild contract that comes from an adjuster partner. No strings - just a simple agreement and a wire when the contract is signed.

We're fully licensed, insured, and have handled everything from full teardowns to structural repairs, ground ups and ADU additions. Happy to send our credentials if that's helpful.

Any interest in a quick call this week?

Frank Neimroozi
Owner, econstruct
frank@econstructinc.com
econstructinc.com`,
  },
  {
    template_key: "expediter_permit_partner",
    name: "Expediters / Permit Runners",
    subject: "Ongoing Permit Work + Referral Partnership - econstruct",
    body: `Hi [First Name],

My name is Frank Neimroozi - I run econstruct, a general contracting firm in Los Angeles. We pull 15 to 20 permits per year across commercial TI, ADU, and residential rebuild projects, and I'm looking to build a long-term relationship with a reliable permit expediting partner.

Beyond our own volume, we also work with clients who need expediting support independently of us - and I'd rather refer them to a trusted partner than have them go searching on their own.

We have a mutual referral program in place: $5,000 for any GC contract that comes our way through your network, and I'll make sure you're our first call for every permit we pull.

Would love to connect briefly - even a 10-minute call to see if there's a fit. Are you available this week?

Frank Neimroozi
Owner, econstruct
frank@econstructinc.com
econstructinc.com`,
  },
  {
    template_key: "realtor_cold_intro",
    name: "Realtors: Pre-Sale Reno + Buyer Referrals",
    subject: "GC Partnership for Your Clients - Pre-Sale Renovations + New Builds",
    body: `Hi [First Name],

I'm Frank Neimroozi, owner of econstruct - a full-service general contracting firm in Los Angeles. I specialize in commercial TI, ADU construction, and residential renovation and rebuild projects.

We work with a lot of clients who come to me right after buying - they need renovations done fast before move-in, or they're looking to add an ADU to increase property value. I'd love to have a realtor partner I can refer them to when they're ready to sell or buy next.

On the flip side: if you have buyers or sellers who need construction work - pre-sale renovations, fire rebuild, ADU additions - we offer a $5,000 referral fee per signed contract.

We're fast, licensed, and effective - I know that matters when your client's listing timeline is on the line.

Would you be open to a quick intro call this week?

Frank Neimroozi
Owner, econstruct
frank@econstructinc.com
econstructinc.com`,
  },
];

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

function csvEscape(value: unknown) {
  const text = value == null ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function downloadPartnersCsv(filename: string, leads: PartnerLead[]) {
  const headers = [
    "crm_partner_id",
    "email",
    "first_name",
    "partner_name",
    "company_firm",
    "partner_type",
    "phone",
    "linkedin_url",
    "source",
    "status",
    "last_contact_date",
    "next_follow_up_date",
    "notes",
  ];
  const rows = leads.map((lead) => {
    const firstName = (lead.partner_name || "").trim().split(/\s+/)[0] ?? "";
    return [
      lead.id,
      lead.contact_email,
      firstName,
      lead.partner_name,
      lead.company_firm,
      lead.partner_type,
      lead.contact_phone,
      lead.linkedin_url,
      lead.source,
      lead.status,
      lead.last_contact_date,
      lead.next_follow_up_date,
      lead.notes,
    ]
      .map(csvEscape)
      .join(",");
  });
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
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
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
  const coldEmailReady = filtered.filter(
    (lead) =>
      lead.contact_email &&
      lead.status !== "Inactive" &&
      lead.status !== "Active Partner" &&
      lead.referral_agreement_status !== "Signed" &&
      lead.referral_agreement_status !== "Active"
  );
  const emailsToShow = templates.length ? templates : ASAP_EMAILS;

  async function copyTemplate(template: { template_key: string; subject: string; body: string }) {
    await navigator.clipboard.writeText(`Subject: ${template.subject}\n\n${template.body}`);
    setCopiedKey(template.template_key);
    window.setTimeout(() => setCopiedKey(null), 1500);
  }

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

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Metric icon={Handshake} label="Total Partners" value={leads.length} />
        <Metric icon={CalendarClock} label="Due Follow-Ups" value={followUps.length} tone="amber" />
        <Metric icon={Building2} label="Active Partners" value={activePartners.length} tone="green" />
        <Metric icon={Mail} label="Cold Email Ready" value={coldEmailReady.length} tone="sky" />
        <Metric icon={DollarSign} label="Referral Value" value={money(totalReferralValue)} tone="gold" />
      </div>

      <div className="rounded-xl border border-[#E8E4DC] bg-[#1C1C1E] p-4 text-white">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#B8963E]">
              <Rocket size={14} /> Cold Email ASAP
            </p>
            <h2 className="mt-1 text-lg font-black">Launch from the partner list today.</h2>
            <p className="mt-1 max-w-2xl text-sm text-white/65">
              Export partners with email addresses, start with 20 to 50 contacts, and mark replies as Contacted so follow-ups land back in this dashboard.
            </p>
          </div>
          <button
            type="button"
            disabled={!coldEmailReady.length}
            onClick={() =>
              downloadPartnersCsv(
                `econstruct-partner-cold-email-${new Date().toISOString().slice(0, 10)}.csv`,
                coldEmailReady
              )
            }
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#B8963E] px-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Download size={16} /> Export CSV ({coldEmailReady.length})
          </button>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <LaunchStep n="01" title="Pick one segment" body="Start with architects, adjusters, or realtors. Keep the first send focused." />
          <LaunchStep n="02" title="Send 20 to 50" body="Use one template, personalize the first line, then send from your approved email tool." />
          <LaunchStep n="03" title="Work the replies" body="Move anyone who responds to Contacted and follow up again in five days." />
        </div>
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
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-bold text-[#1C1C1E]">Email Templates</h2>
            <p className="mt-1 text-xs text-gray-500">
              Copy one, personalize the first line, then send through the email tool you already use.
            </p>
          </div>
          {!templates.length && (
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
              Using local starter templates
            </span>
          )}
        </div>
        <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-3">
          {emailsToShow.map((template) => (
            <div key={template.template_key} className="rounded-xl border border-[#E8E4DC] bg-[#FAF9F6] p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-bold text-[#1C1C1E]">{template.name}</p>
                  <p className="mt-1 text-xs font-semibold text-gray-500">{template.subject}</p>
                </div>
                <button
                  type="button"
                  onClick={() => copyTemplate(template)}
                  className="inline-flex h-8 shrink-0 items-center gap-1 rounded-lg border border-[#E8E4DC] bg-white px-2 text-xs font-bold text-[#1C1C1E] hover:border-[#B8963E] hover:text-[#B8963E]"
                >
                  <Copy size={13} /> {copiedKey === template.template_key ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="mt-3 line-clamp-6 whitespace-pre-line text-xs leading-5 text-gray-600">
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

function LaunchStep({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.06] p-3">
      <p className="text-xs font-black text-[#B8963E]">{n}</p>
      <p className="mt-1 text-sm font-bold text-white">{title}</p>
      <p className="mt-1 text-xs leading-5 text-white/60">{body}</p>
    </div>
  );
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

function Metric({ icon: Icon, label, value, tone = "default" }: { icon: LucideIcon; label: string; value: string | number; tone?: "default" | "amber" | "green" | "gold" | "sky" }) {
  const colors = tone === "amber" ? "text-amber-700 bg-amber-50" : tone === "green" ? "text-green-700 bg-green-50" : tone === "gold" ? "text-[#B8963E] bg-[#B8963E]/10" : tone === "sky" ? "text-sky-700 bg-sky-50" : "text-[#1C1C1E] bg-white";
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
