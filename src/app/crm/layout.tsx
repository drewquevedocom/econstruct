"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/crm/Sidebar";
import Topbar from "@/components/crm/Topbar";

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Login page renders full-screen without the shell
  if (pathname === "/crm/login") {
    return <>{children}</>;
  }

  return (
    <div className="h-dvh w-screen grid grid-cols-[64px_1fr] grid-rows-[56px_1fr] bg-[#F8F6F2] overflow-hidden">
      <Sidebar />
      <Topbar />
      <main className="col-start-2 row-start-2 overflow-y-auto p-6 flex flex-col gap-6 min-h-0">
        {children}
      </main>
    </div>
  );
}
