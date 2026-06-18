"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";

export default function AgreeForm({ token, firstName }: { token: string; firstName: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signed, setSigned] = useState(false);

  async function handleAgree() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/partners/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setSigned(true);
      setTimeout(() => router.push("/partners/welcome"), 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setLoading(false);
    }
  }

  if (signed) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-800">
        <CheckCircle2 size={22} className="shrink-0" />
        <div>
          <p className="font-bold">You&apos;re in, {firstName}!</p>
          <p className="text-xs">Redirecting to your welcome page…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleAgree}
        disabled={loading}
        className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#B8963E] px-6 text-base font-black uppercase tracking-wider text-white shadow-lg transition hover:bg-[#9A7B2F] disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : null}
        I Agree — Count Me In
      </button>
      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
