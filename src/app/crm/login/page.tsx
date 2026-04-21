"use client";

import { useState, useTransition } from "react";
import { loginAction } from "./actions";
import { Lock, Loader2 } from "lucide-react";
import Logo from "@/components/Logo";

export default function CRMLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await loginAction(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="min-h-screen bg-[#1C1C1E] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Logo height={30} tone="light" />
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#B8963E]/10">
              <Lock className="w-6 h-6 text-[#B8963E]" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">econstruct CRM</h1>
          <p className="text-sm text-gray-500">Enter your access code to continue</p>
        </div>

        <form action={handleSubmit} className="space-y-4">
          <input
            name="password"
            type="password"
            placeholder="Access code"
            autoFocus
            required
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#B8963E] focus:border-transparent outline-none transition-all"
          />

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#B8963E] hover:bg-[#9A7B2F] text-white rounded-xl py-3.5 font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="text-center text-[11px] text-gray-600 mt-8">
          econstruct Inc. &middot; Internal Use Only
        </p>
      </div>
    </div>
  );
}
