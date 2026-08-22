"use client";

import { useMemo, useRef, useState } from "react";
import {
  buildSignatureHtml,
  PREVIEW_ASSET_BASE,
  SIGNATURE_DEFAULTS,
  type SignatureInput,
} from "@/lib/signature/buildSignatureHtml";

type CopyState = "idle" | "copied" | "error";

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  type?: string;
  uppercase?: boolean;
}

function Field({ label, value, onChange, placeholder, hint, type = "text", uppercase }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold tracking-wider text-brand-dark uppercase">
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(uppercase ? e.target.value.toUpperCase() : e.target.value)}
        className="w-full rounded-md border border-black/15 bg-white px-3 py-2.5 text-sm text-brand-dark outline-none transition focus:border-accent-gold focus:ring-2 focus:ring-accent-gold/25"
      />
      {hint ? <span className="mt-1 block text-xs text-body-text">{hint}</span> : null}
    </label>
  );
}

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  rows?: number;
}

function TextAreaField({ label, value, onChange, hint, rows = 3 }: TextAreaFieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold tracking-wider text-brand-dark uppercase">
        {label}
      </span>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-none rounded-md border border-black/15 bg-white px-3 py-2.5 text-sm leading-relaxed text-brand-dark outline-none transition focus:border-accent-gold focus:ring-2 focus:ring-accent-gold/25"
      />
      {hint ? <span className="mt-1 block text-xs text-body-text">{hint}</span> : null}
    </label>
  );
}

/**
 * Copies the signature as rich HTML so that pasting into Gmail's signature box
 * yields a rendered signature rather than visible markup. Falls back to a DOM
 * selection + execCommand for browsers without async ClipboardItem support.
 */
async function copyRichHtml(html: string, previewNode: HTMLElement | null): Promise<boolean> {
  if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([html], { type: "text/plain" }),
        }),
      ]);
      return true;
    } catch {
      // fall through to the selection-based path
    }
  }

  if (!previewNode) return false;
  const selection = window.getSelection();
  if (!selection) return false;
  const range = document.createRange();
  range.selectNodeContents(previewNode);
  selection.removeAllRanges();
  selection.addRange(range);
  const ok = document.execCommand("copy");
  selection.removeAllRanges();
  return ok;
}

export default function SignatureGenerator() {
  const [input, setInput] = useState<SignatureInput>(SIGNATURE_DEFAULTS);
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const [sourceCopied, setSourceCopied] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof SignatureInput>(key: K, value: SignatureInput[K]) => {
    setInput((prev) => ({ ...prev, [key]: value }));
    setCopyState("idle");
    setSourceCopied(false);
  };

  // Preview uses relative asset paths so it renders in local dev; the copied
  // markup uses absolute URLs, which is the only thing Gmail will load.
  const previewHtml = useMemo(
    () => buildSignatureHtml(input, { assetBase: PREVIEW_ASSET_BASE }),
    [input]
  );
  const exportHtml = useMemo(() => buildSignatureHtml(input), [input]);

  const handleCopy = async () => {
    const ok = await copyRichHtml(exportHtml, previewRef.current);
    setCopyState(ok ? "copied" : "error");
    if (ok) window.setTimeout(() => setCopyState("idle"), 2600);
  };

  const handleCopySource = async () => {
    try {
      await navigator.clipboard.writeText(exportHtml);
      setSourceCopied(true);
      window.setTimeout(() => setSourceCopied(false), 2600);
    } catch {
      setSourceCopied(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-14">
      <header className="mb-9 border-b border-black/10 pb-7">
        <span className="mb-3 inline-block rounded-full bg-brand-dark px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] text-white uppercase">
          Internal tool
        </span>
        <h1 className="font-heading text-3xl leading-tight text-brand-dark sm:text-4xl">
          Email Signature Generator
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-body-text">
          Fill in your details, then copy your signature straight into Gmail. Takes about a minute.
        </p>
      </header>

      {/* Preview column is the wider of the two — the signature is a fixed
          640px and should not have to scroll at desktop widths. */}
      <div className="grid gap-10 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:gap-12">
        {/* ---------------- form ---------------- */}
        <section className="space-y-5">
          <Field
            label="Full name"
            value={input.fullName}
            onChange={(v) => set("fullName", v)}
            placeholder="Jane Alvarez"
          />
          <Field
            label="Department"
            value={input.department}
            onChange={(v) => set("department", v)}
            placeholder="MARKETING"
            hint="Shown in red above your name. Automatically uppercased."
            uppercase
          />
          <Field
            label="Job title"
            value={input.jobTitle}
            onChange={(v) => set("jobTitle", v)}
            placeholder="Digital Marketing Manager"
          />
          <Field
            label="Email address"
            type="email"
            value={input.email}
            onChange={(v) => set("email", v)}
            placeholder="jane@econstructinc.com"
          />
          <Field
            label="Phone number"
            type="tel"
            value={input.phone}
            onChange={(v) => set("phone", v)}
            hint="Replace with your direct line if you have one."
          />
          <TextAreaField
            label="Address"
            value={input.address}
            onChange={(v) => set("address", v)}
            hint="One line each: street, suite, city/state/zip."
          />

          <label className="flex cursor-pointer items-start gap-3 rounded-md border border-black/10 bg-secondary px-4 py-3.5">
            <input
              type="checkbox"
              checked={input.includeConfidentiality}
              onChange={(e) => set("includeConfidentiality", e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-accent-gold"
            />
            <span>
              <span className="block text-sm font-bold text-brand-dark">
                Include confidentiality notice
              </span>
              <span className="mt-0.5 block text-xs leading-relaxed text-body-text">
                Adds the standard disclaimer and CA license number below the signature.
              </span>
            </span>
          </label>
        </section>

        {/* ---------------- preview + copy ---------------- */}
        <section>
          <div className="mb-2.5 flex items-baseline justify-between">
            <h2 className="text-xs font-bold tracking-wider text-brand-dark uppercase">
              Live preview
            </h2>
            <span className="text-xs text-body-text">Updates as you type</span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-black/10 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)] sm:p-5">
            <div ref={previewRef} dangerouslySetInnerHTML={{ __html: previewHtml }} />
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={handleCopy}
              className="w-full rounded-md bg-brand-dark px-5 py-3.5 text-sm font-bold tracking-wide text-white transition hover:bg-black focus:ring-2 focus:ring-accent-gold focus:ring-offset-2 focus:outline-none"
            >
              {copyState === "copied"
                ? "Copied — now paste it into Gmail"
                : copyState === "error"
                  ? "Copy failed — use Copy HTML source below"
                  : "Copy signature"}
            </button>

            <ol className="mt-5 space-y-2.5 text-sm leading-relaxed text-body-text">
              {[
                "Click Copy signature.",
                "In Gmail, go to Settings → See all settings → General → Signature.",
                "Paste into the signature box and click Save Changes at the bottom.",
              ].map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-gold text-[11px] font-bold text-white">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>

            <button
              type="button"
              onClick={handleCopySource}
              className="mt-5 text-xs font-semibold text-body-text underline decoration-accent-gold/60 underline-offset-4 transition hover:text-brand-dark"
            >
              {sourceCopied ? "HTML source copied" : "Copy HTML source instead"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
