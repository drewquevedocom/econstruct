"use client";

import { useEffect, useState } from "react";
import { X, Mail, Phone, MapPin, Loader2, ExternalLink } from "lucide-react";
import { updateLeadStage } from "@/app/crm/leads/actions";
import ScoreBadge from "./ScoreBadge";

const STAGES = [
  "new",
  "enriched",
  "outreach",
  "contacted",
  "replied",
  "meeting",
  "proposal",
  "won",
  "lost",
];

const stageColors: Record<string, string> = {
  new: "border-blue-300 text-blue-700",
  enriched: "border-purple-300 text-purple-700",
  outreach: "border-amber-300 text-amber-700",
  contacted: "border-sky-300 text-sky-700",
  replied: "border-teal-300 text-teal-700",
  meeting: "border-indigo-300 text-indigo-700",
  proposal: "border-orange-300 text-orange-700",
  won: "border-green-300 text-green-700",
  lost: "border-red-300 text-red-600",
};

interface LeadDetail {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  zip_code: string | null;
  source: string | null;
  lifecycle_stage: string | null;
  lead_score: number | null;
  property_value: number | null;
  owner_name: string | null;
  owner_type: string | null;
  owner_mailing_address: string | null;
  enrichment_status: string | null;
  linkedin_url: string | null;
  apn: string | null;
  created_at: string;
  updated_at: string | null;
}

interface Activity {
  id: string;
  type: string;
  channel: string | null;
  created_at: string;
  metadata: Record<string, unknown> | null;
}

interface PanelProps {
  leadId: string;
  onClose: () => void;
}

export default function LeadPanel({ leadId, onClose }: PanelProps) {
  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/crm/lead/${leadId}`)
      .then((r) => r.json())
      .then((data) => {
        setLead(data.lead);
        setActivities(data.activities ?? []);
      })
      .finally(() => setLoading(false));
  }, [leadId]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-[200]"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[201] flex flex-col overflow-hidden animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E4DC] shrink-0">
          <h2 className="font-bold text-[#1C1C1E] text-lg">Lead Details</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="w-6 h-6 animate-spin text-[#B8963E]" />
            </div>
          ) : lead ? (
            <>
              {/* Contact Card */}
              <div>
                <h3 className="text-xl font-bold text-[#1C1C1E] mb-1">
                  {lead.name || "Unknown"}
                </h3>
                <div className="flex items-center gap-2 mb-4">
                  <select
                    value={lead.lifecycle_stage || "new"}
                    disabled={saving}
                    onChange={async (e) => {
                      const newStage = e.target.value;
                      setSaving(true);
                      const result = await updateLeadStage(lead.id, newStage);
                      if (!result.error) {
                        setLead({ ...lead, lifecycle_stage: newStage });
                      }
                      setSaving(false);
                    }}
                    className={`text-[11px] font-semibold capitalize px-2 py-0.5 rounded-full border cursor-pointer bg-white ${stageColors[lead.lifecycle_stage || "new"] || "border-gray-300 text-gray-600"} disabled:opacity-50`}
                  >
                    {STAGES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <ScoreBadge score={lead.lead_score} />
                </div>
                <div className="space-y-2 text-sm">
                  {lead.email && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail size={14} className="text-gray-400 shrink-0" />
                      <a href={`mailto:${lead.email}`} className="hover:text-[#B8963E]">
                        {lead.email}
                      </a>
                    </div>
                  )}
                  {lead.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone size={14} className="text-gray-400 shrink-0" />
                      <a href={`tel:${lead.phone}`} className="hover:text-[#B8963E]">
                        {lead.phone}
                      </a>
                    </div>
                  )}
                  {lead.address && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={14} className="text-gray-400 shrink-0" />
                      {lead.address}
                    </div>
                  )}
                  {lead.linkedin_url && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <ExternalLink size={14} className="text-gray-400 shrink-0" />
                      <a
                        href={lead.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#B8963E]"
                      >
                        LinkedIn
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Property Details */}
              <div className="bg-[#F8F6F2] rounded-xl p-4 space-y-2 text-sm">
                <h4 className="font-semibold text-[#1C1C1E] text-xs uppercase tracking-wide mb-2">
                  Property
                </h4>
                <Row label="Owner" value={lead.owner_name} />
                <Row label="Owner Type" value={lead.owner_type} />
                <Row label="APN" value={lead.apn} />
                <Row label="ZIP" value={lead.zip_code} />
                <Row
                  label="Value"
                  value={
                    lead.property_value
                      ? `$${lead.property_value.toLocaleString()}`
                      : null
                  }
                />
                <Row label="Mailing" value={lead.owner_mailing_address} />
                <Row label="Enrichment" value={lead.enrichment_status} />
                <Row label="Source" value={lead.source?.replace(/_/g, " ")} />
              </div>

              {/* Activity Timeline */}
              <div>
                <h4 className="font-semibold text-[#1C1C1E] text-xs uppercase tracking-wide mb-3">
                  Activity
                </h4>
                {activities.length === 0 ? (
                  <p className="text-sm text-gray-400">No activity recorded</p>
                ) : (
                  <div className="space-y-3">
                    {activities.map((a) => (
                      <div
                        key={a.id}
                        className="flex items-start gap-3 text-sm"
                      >
                        <div className="w-2 h-2 rounded-full bg-[#B8963E] mt-1.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[#1C1C1E] capitalize">
                            {a.type?.replace(/_/g, " ")}
                          </p>
                          <p className="text-xs text-gray-400 tabular-nums">
                            {new Date(a.created_at).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Timestamps */}
              <div className="text-xs text-gray-400 pt-4 border-t border-[#E8E4DC]/50 space-y-1">
                <p>
                  Created:{" "}
                  {new Date(lead.created_at).toLocaleString("en-US")}
                </p>
                {lead.updated_at && (
                  <p>
                    Updated:{" "}
                    {new Date(lead.updated_at).toLocaleString("en-US")}
                  </p>
                )}
              </div>
            </>
          ) : (
            <p className="text-gray-400 text-sm">Lead not found</p>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.25s ease-out;
        }
      `}</style>
    </>
  );
}

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="text-[#1C1C1E] font-medium capitalize text-right max-w-[60%] truncate">
        {value || "--"}
      </span>
    </div>
  );
}
