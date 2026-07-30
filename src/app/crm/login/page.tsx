"use client";

import { useState, useTransition } from "react";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import Logo from "@/components/Logo";
import { createBrowserClient } from "@/lib/supabase/browserClient";

export default function CRMLoginPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const supabase = createBrowserClient();
      // shouldCreateUser: false — this is an invite-only internal tool.
      // Without it, any email typed here silently auto-creates a fresh
      // auth user with no profiles row, which then fails the profile
      // check at sign-in with a misleading "link expired" error (this is
      // exactly how Katie's account got orphaned).
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: "https://econstructhomes.com/crm/auth/callback",
          shouldCreateUser: false,
        },
      });
      if (otpError) {
        setError(otpError.message);
        return;
      }
      setSent(true);
    });
  }

  return (
    <div className="min-h-screen bg-[#1C1C1E] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Logo height={30} tone="light" />
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#B8963E]/10">
              <Mail className="w-6 h-6 text-[#B8963E]" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">econstruct CRM</h1>
          <p className="text-sm text-gray-500">Sign in with your email to continue</p>
        </div>

        {sent ? (
          <div className="rounded-xl border border-[#B8963E]/20 bg-[#B8963E]/5 p-6 text-center">
            <CheckCircle2 className="w-8 h-8 text-[#B8963E] mx-auto mb-3" />
            <p className="text-white font-semibold mb-1">Check your email for a login link</p>
            <p className="text-sm text-gray-400">
              We sent a magic link to <span className="text-white">{email}</span>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@econstructinc.com"
              autoFocus
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#B8963E] focus:border-transparent outline-none transition-all"
            />

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#B8963E] hover:bg-[#9A7B2F] text-white rounded-xl py-3.5 font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Sending link...
                </>
              ) : (
                "Send Login Link"
              )}
            </button>
          </form>
        )}

        <p className="text-center text-[11px] text-gray-600 mt-8">
          econstruct Inc. &middot; Internal Use Only
        </p>
      </div>
    </div>
  );
}
