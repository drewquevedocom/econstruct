"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import Sidebar from "@/components/crm/Sidebar";
import Topbar from "@/components/crm/Topbar";

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Defaults to expanded/labeled so navigation is self-explanatory without
  // hovering or guessing — matters most for people new to the CRM. The grid
  // column tracks this so the sidebar never overlaps main content.
  const [pinned, setPinned] = useState(true);

  // Login + magic-link callback render full-screen without the shell —
  // the user isn't authenticated yet at either point.
  if (pathname === "/crm/login" || pathname.startsWith("/crm/auth/")) {
    return <>{children}</>;
  }

  return (
    <div
      className={`h-dvh w-screen grid grid-rows-[56px_1fr] bg-[#F8F6F2] overflow-hidden transition-[grid-template-columns] duration-300 ${
        pinned ? "grid-cols-[240px_1fr]" : "grid-cols-[64px_1fr]"
      }`}
    >
      <Sidebar pinned={pinned} onPinnedChange={setPinned} />
      <Topbar />
      <main className="col-start-2 row-start-2 overflow-y-auto p-6 flex flex-col gap-6 min-h-0">
        {children}
      </main>
    </div>
  );
}
