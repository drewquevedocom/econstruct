"use client";

import { useState, useRef } from "react";
import { Upload, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const PARTNER_TYPES = [
  "Realtor / Real Estate Agent",
  "Real Estate Attorney",
  "Architect",
  "Interior Designer",
  "Insurance Agent / Adjuster",
  "Expediter / Permit Runner",
  "CPA / Wealth Advisor",
  "Escrow Officer",
  "Structural / Geotech Engineer",
  "Fire / Water Restoration",
  "HOA / Property Manager",
  "Other",
];

const SOURCES = [
  "Cold Outreach",
  "AIA LA Event",
  "BNI / Networking",
  "Referral from Frank",
  "Inbound / Found Us",
  "Other",
];

type PreviewResult = {
  csv_rows: number;
  with_email: number;
  skipped_no_email: number;
  dupes_in_batch: number;
  dupes_against_db: number;
  to_insert: number;
  sample: Array<{ partner_name: string; contact_email: string; company_firm: string | null }>;
};

type ImportResult = {
  inserted: number;
  csv_rows: number;
  dupes_against_db: number;
  skipped_no_email?: number;
  note?: string;
};

export default function ImportPage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [csvText, setCsvText] = useState<string>("");
  const [partnerType, setPartnerType] = useState<string>(PARTNER_TYPES[0]);
  const [source, setSource] = useState<string>(SOURCES[0]);
  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [loading, setLoading] = useState<"preview" | "import" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    if (!f.name.toLowerCase().endsWith(".csv")) {
      setError("File must be a .csv");
      return;
    }
    setError(null);
    setFileName(f.name);
    setPreview(null);
    setResult(null);

    const detectedType = PARTNER_TYPES.find((t) =>
      f.name.toLowerCase().includes(t.split(" ")[0].toLowerCase())
    );
    if (detectedType) setPartnerType(detectedType);

    const reader = new FileReader();
    reader.onload = (e) => setCsvText(String(e.target?.result ?? ""));
    reader.readAsText(f);
  }

  async function doPreview() {
    if (!csvText) return setError("Drop a CSV first");
    setLoading("preview");
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/agents/import-partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          csv_text: csvText,
          partner_type: partnerType,
          source,
          dry_run: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setPreview(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(null);
    }
  }

  async function doImport() {
    if (!csvText) return setError("Drop a CSV first");
    if (!confirm(`Insert ${preview?.to_insert ?? "?"} new partners as ${partnerType}?`)) return;
    setLoading("import");
    setError(null);
    try {
      const res = await fetch("/api/agents/import-partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          csv_text: csvText,
          partner_type: partnerType,
          source,
          dry_run: false,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setResult(data);
      setPreview(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(null);
    }
  }

  function reset() {
    setFileName(null);
    setCsvText("");
    setPreview(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8963E]">CRM</p>
        <h1 className="mt-1 text-2xl font-black text-[#1C1C1E]">Import Partners from CSV</h1>
        <p className="mt-1 text-sm text-gray-500">
          Drag an Apollo (or any properly-headed) CSV. Pick the partner type. Preview, then import. Dedupes
          against existing rows automatically.
        </p>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const f = e.dataTransfer.files?.[0];
          if (f) handleFile(f);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-12 transition ${
          dragOver
            ? "border-[#B8963E] bg-[#FAF9F6]"
            : fileName
              ? "border-emerald-300 bg-emerald-50"
              : "border-[#E8E4DC] bg-white hover:border-[#B8963E]"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
        <Upload size={32} className={fileName ? "text-emerald-600" : "text-gray-400"} />
        {fileName ? (
          <>
            <p className="text-sm font-bold text-[#1C1C1E]">{fileName}</p>
            <p className="text-xs text-gray-500">
              {(csvText.length / 1024).toFixed(1)} KB loaded · click to replace
            </p>
          </>
        ) : (
          <>
            <p className="text-sm font-bold text-[#1C1C1E]">Drop CSV here or click to browse</p>
            <p className="text-xs text-gray-500">
              Apollo CSVs work out of the box — needs Email + Name columns at minimum
            </p>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-gray-600">Partner Type</label>
          <select
            value={partnerType}
            onChange={(e) => setPartnerType(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-[#E8E4DC] bg-white px-3 py-2 text-sm focus:border-[#B8963E] focus:outline-none"
          >
            {PARTNER_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-gray-600">Source</label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-[#E8E4DC] bg-white px-3 py-2 text-sm focus:border-[#B8963E] focus:outline-none"
          >
            {SOURCES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={doPreview}
          disabled={!csvText || loading !== null}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#1C1C1E] bg-white px-4 text-sm font-bold text-[#1C1C1E] hover:bg-[#FAF9F6] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading === "preview" ? <Loader2 size={14} className="animate-spin" /> : null}
          Preview
        </button>
        <button
          type="button"
          onClick={doImport}
          disabled={!csvText || !preview || loading !== null || preview.to_insert === 0}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#B8963E] px-4 text-sm font-bold text-white hover:bg-[#9A7B2F] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading === "import" ? <Loader2 size={14} className="animate-spin" /> : null}
          Import {preview ? `${preview.to_insert} partners` : ""}
        </button>
        {(fileName || result) && (
          <button
            type="button"
            onClick={reset}
            className="ml-auto inline-flex h-10 items-center gap-2 rounded-lg px-3 text-xs font-bold text-gray-500 hover:text-[#1C1C1E]"
          >
            Reset
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {preview && !result && (
        <div className="rounded-2xl border border-[#E8E4DC] bg-white p-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-600">Preview</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat label="CSV rows" value={preview.csv_rows} />
            <Stat label="Skipped (no email)" value={preview.skipped_no_email} />
            <Stat label="Dupes in DB" value={preview.dupes_against_db} tone="amber" />
            <Stat label="Will insert" value={preview.to_insert} tone="green" />
          </div>
          {preview.sample.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Sample (first 3)</p>
              <ul className="mt-2 space-y-1 text-sm">
                {preview.sample.map((s, i) => (
                  <li key={i} className="flex items-center gap-2 rounded-lg bg-[#FAF9F6] px-3 py-1.5">
                    <span className="font-bold text-[#1C1C1E]">{s.partner_name}</span>
                    <span className="text-gray-500">·</span>
                    <span className="text-xs text-gray-600">{s.contact_email}</span>
                    {s.company_firm && (
                      <>
                        <span className="text-gray-500">·</span>
                        <span className="text-xs text-gray-500">{s.company_firm}</span>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {result && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-emerald-600" />
          <div className="text-sm text-emerald-800">
            <p className="font-bold">
              Imported {result.inserted} {partnerType.toLowerCase()} {result.inserted === 1 ? "partner" : "partners"}.
            </p>
            <p className="mt-1 text-xs">
              {result.csv_rows} CSV rows · {result.dupes_against_db} already in DB ·{" "}
              {result.skipped_no_email ?? 0} skipped (no email)
            </p>
            {result.note && <p className="mt-1 text-xs italic">{result.note}</p>}
            <p className="mt-2 text-xs">
              Cron will enroll them into Instantly within the next 6 hours, or trigger a manual run at{" "}
              <code className="rounded bg-emerald-100 px-1.5">/crm/agents</code>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: "green" | "amber" }) {
  const color = tone === "green" ? "text-emerald-700" : tone === "amber" ? "text-amber-700" : "text-[#1C1C1E]";
  return (
    <div className="rounded-lg bg-[#FAF9F6] p-3 text-center">
      <p className={`text-2xl font-black tabular-nums ${color}`}>{value.toLocaleString()}</p>
      <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-500">{label}</p>
    </div>
  );
}
