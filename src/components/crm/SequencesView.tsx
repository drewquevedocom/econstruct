"use client";

import { useState } from "react";
import { Mail, Pencil, Check, X, Save, Loader2 } from "lucide-react";

type Step = {
  id: string;
  sequence_id: string;
  step_number: number;
  delay_days: number;
  subject: string;
  body: string;
  updated_at: string;
};

type Sequence = {
  id: string;
  name: string;
  description: string | null;
  campaign_id: string | null;
  is_active: boolean;
  steps: Step[];
};

const VARIABLES = [
  "{{first_name}}",
  "{{last_name}}",
  "{{address}}",
  "{{zip}}",
  "{{phone}}",
  "{{property_value}}",
  "{{fire_status}}",
];

export default function SequencesView({ sequences }: { sequences: Sequence[] }) {
  const [openSeq, setOpenSeq] = useState<string | null>(sequences[0]?.id ?? null);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<{ subject: string; body: string; delay_days: number } | null>(
    null
  );
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState<string | null>(null);
  const [stepsState, setStepsState] = useState<Sequence[]>(sequences);

  function startEdit(step: Step) {
    setEditing(step.id);
    setDraft({ subject: step.subject, body: step.body, delay_days: step.delay_days });
  }

  function cancelEdit() {
    setEditing(null);
    setDraft(null);
  }

  async function saveEdit(stepId: string) {
    if (!draft) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/crm/sequences/steps/${stepId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(`Save failed: ${err.error || res.statusText}`);
        return;
      }
      const { step } = await res.json();
      setStepsState((prev) =>
        prev.map((seq) => ({
          ...seq,
          steps: seq.steps.map((s) => (s.id === stepId ? { ...s, ...step } : s)),
        }))
      );
      setEditing(null);
      setDraft(null);
      setSavedFlash(stepId);
      setTimeout(() => setSavedFlash(null), 1800);
    } finally {
      setSaving(false);
    }
  }

  if (!sequences.length) {
    return (
      <div className="bg-white rounded-xl border border-[#E8E4DC] p-10 text-center">
        <Mail className="mx-auto mb-3 text-gray-300" size={36} />
        <h2 className="text-lg font-bold text-[#1C1C1E]">No sequences yet</h2>
        <p className="text-sm text-gray-500 mt-2">
          Run the seed migration in Supabase to load the campaign templates.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#1C1C1E]">Email Sequences</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Edit subject lines, body copy, and delays. Changes save instantly.
          </p>
        </div>
        <div className="text-xs text-gray-400 font-mono">
          {sequences.length} sequence{sequences.length === 1 ? "" : "s"}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E8E4DC] p-3">
        <div className="flex flex-wrap gap-2">
          {stepsState.map((seq) => (
            <button
              key={seq.id}
              onClick={() => setOpenSeq(seq.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                openSeq === seq.id
                  ? "bg-[#B8963E] text-white"
                  : "bg-gray-100 text-[#1C1C1E] hover:bg-gray-200"
              }`}
            >
              {seq.name}
              <span className="ml-2 opacity-60 font-normal">{seq.steps.length}</span>
            </button>
          ))}
        </div>
      </div>

      {stepsState
        .filter((s) => s.id === openSeq)
        .map((seq) => (
          <div key={seq.id} className="flex flex-col gap-4">
            <div className="bg-white rounded-xl border border-[#E8E4DC] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-[#1C1C1E]">{seq.name}</h2>
                  {seq.description && (
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">{seq.description}</p>
                  )}
                </div>
                <span
                  className={`shrink-0 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    seq.is_active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {seq.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              {seq.campaign_id && (
                <div className="mt-3 text-[11px] text-gray-400 font-mono">
                  Instantly campaign: {seq.campaign_id}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-[#E8E4DC] p-4">
              <p className="text-[11px] uppercase font-bold tracking-wider text-gray-400 mb-2">
                Available variables
              </p>
              <div className="flex flex-wrap gap-1.5">
                {VARIABLES.map((v) => (
                  <code
                    key={v}
                    className="text-[11px] bg-[#F8F6F2] text-[#1C1C1E] px-2 py-0.5 rounded font-mono"
                  >
                    {v}
                  </code>
                ))}
              </div>
            </div>

            {seq.steps.map((step) => {
              const isEditing = editing === step.id;
              const justSaved = savedFlash === step.id;
              return (
                <div
                  key={step.id}
                  className={`bg-white rounded-xl border transition-colors ${
                    justSaved
                      ? "border-green-300"
                      : isEditing
                      ? "border-[#B8963E]"
                      : "border-[#E8E4DC]"
                  }`}
                >
                  <div className="flex items-center justify-between p-4 border-b border-[#E8E4DC]/60">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-[#B8963E]/10 text-[#B8963E] font-bold text-sm flex items-center justify-center shrink-0">
                        {step.step_number}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-[#1C1C1E]">Step {step.step_number}</p>
                        <p className="text-[11px] text-gray-500">
                          Sends {step.delay_days === 0 ? "immediately" : `Day ${step.delay_days}`}
                        </p>
                      </div>
                    </div>
                    {isEditing ? (
                      <div className="flex gap-2">
                        <button
                          onClick={cancelEdit}
                          disabled={saving}
                          className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                        >
                          <X size={13} /> Cancel
                        </button>
                        <button
                          onClick={() => saveEdit(step.id)}
                          disabled={saving}
                          className="px-3 py-1.5 rounded-lg bg-[#B8963E] text-white text-xs font-bold hover:bg-[#9A7B2F] disabled:opacity-50 transition-colors flex items-center gap-1.5"
                        >
                          {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                          Save
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(step)}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-[#1C1C1E] hover:border-[#B8963E] hover:text-[#B8963E] transition-colors flex items-center gap-1.5"
                      >
                        {justSaved ? <Check size={13} /> : <Pencil size={13} />}
                        {justSaved ? "Saved" : "Edit"}
                      </button>
                    )}
                  </div>

                  <div className="p-4 flex flex-col gap-3">
                    {isEditing && draft ? (
                      <>
                        <div>
                          <label className="text-[11px] uppercase font-bold tracking-wider text-gray-500">
                            Delay (days)
                          </label>
                          <input
                            type="number"
                            min={0}
                            value={draft.delay_days}
                            onChange={(e) =>
                              setDraft({ ...draft, delay_days: parseInt(e.target.value) || 0 })
                            }
                            className="mt-1 w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:border-[#B8963E] focus:ring-2 focus:ring-[#B8963E]/20 outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] uppercase font-bold tracking-wider text-gray-500">
                            Subject
                          </label>
                          <input
                            type="text"
                            value={draft.subject}
                            onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
                            className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-[#B8963E] focus:ring-2 focus:ring-[#B8963E]/20 outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] uppercase font-bold tracking-wider text-gray-500">
                            Body
                          </label>
                          <textarea
                            value={draft.body}
                            onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                            rows={14}
                            className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono leading-6 focus:border-[#B8963E] focus:ring-2 focus:ring-[#B8963E]/20 outline-none"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <p className="text-[11px] uppercase font-bold tracking-wider text-gray-400 mb-1">
                            Subject
                          </p>
                          <p className="text-sm font-bold text-[#1C1C1E]">{step.subject}</p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase font-bold tracking-wider text-gray-400 mb-1">
                            Body
                          </p>
                          <pre className="text-sm text-[#1C1C1E] whitespace-pre-wrap font-sans leading-6">
                            {step.body}
                          </pre>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
    </div>
  );
}
