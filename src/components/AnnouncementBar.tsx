"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Flame } from "lucide-react";

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-[#8B1A1A] via-[#A52222] to-[#8B1A1A] text-white">
      <div className="mx-auto max-w-[1920px] flex items-center justify-center gap-3 px-4 py-2 text-center relative">
        <Flame size={14} className="text-orange-300 shrink-0" />
        <p className="text-[12px] sm:text-[13px] font-medium tracking-wide">
          <span className="hidden sm:inline">Affected by the LA fires? </span>
          <span className="sm:hidden">LA fire victim? </span>
          <Link
            href="/free-consultation"
            className="underline underline-offset-2 font-bold hover:text-orange-200 transition-colors"
          >
            Free fire rebuild consultation
          </Link>
          <span className="hidden sm:inline">
            {" "}&mdash; we handle permits, insurance claims & construction
          </span>
        </p>
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 transition-colors text-white/60 hover:text-white"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
