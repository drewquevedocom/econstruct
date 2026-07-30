"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Mail, Loader2, AlertCircle } from "lucide-react";
import Logo from "@/components/Logo";
import { completeSignIn } from "./actions";

export default function CompleteSignIn({
  code,
  initialError,
}: {
  code?: string;
  initialError?: string;
}) {
  const [error, setError] = useState<string | null>(
    initialError ? "Link expired or already used — request a new one." : null
  );
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!code) return;
    setError(null);
    startTransition(async () => {
      // completeSignIn redirects on success (throws NEXT_REDIRECT, handled
      // by Next.js). A returned value here means it did NOT redirect, i.e.
      // it failed.
      const result = await completeSignIn(code);
      if (result?.error === "not_invited") {
        // The link itself worked — the account has no active CRM profile.
        // Showing "link expired" here sends people in circles requesting
        // new links that will all fail the same way.
        setError("Your account isn't set up for CRM access — contact Drew to get added.");
      } else if (result?.error) {
        setError("Link expired or already used — request a new one.");
      }
    });
  }

  return (
    <div className="min-h-screen bg-[#1C1C1E] flex items-center justify-center p-6">
      <div className="w-full max-w-sm text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Logo height={30} tone="light" />
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#B8963E]/10">
            <Mail className="w-6 h-6 text-[#B8963E]" />
          </div>
        </div>

        {!code ? (
          <>
            <h1 className="text-2xl font-bold text-white mb-2">Missing sign-in link</h1>
            <p className="text-sm text-gray-500 mb-6">This link is incomplete or malformed.</p>
            <Link
              href="/crm/login"
              className="inline-block w-full bg-[#B8963E] hover:bg-[#9A7B2F] text-white rounded-xl py-3.5 font-semibold transition-colors"
            >
              Back to login
            </Link>
          </>
        ) : error ? (
          <>
            <h1 className="text-2xl font-bold text-white mb-2">Sign-in failed</h1>
            <p className="text-red-400 text-sm mb-6 flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </p>
            <Link
              href="/crm/login"
              className="inline-block w-full bg-[#B8963E] hover:bg-[#9A7B2F] text-white rounded-xl py-3.5 font-semibold transition-colors"
            >
              Request a new link
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-white mb-2">Finish signing in</h1>
            <p className="text-sm text-gray-500 mb-6">
              Click below to complete your login. This extra step keeps corporate email security
              scanners from using up your one-time link before you do.
            </p>
            <button
              onClick={handleClick}
              disabled={pending}
              className="w-full bg-[#B8963E] hover:bg-[#9A7B2F] text-white rounded-xl py-3.5 font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {pending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Signing in...
                </>
              ) : (
                "Click to finish signing in"
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
