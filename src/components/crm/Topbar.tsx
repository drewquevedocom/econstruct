"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const titles: Record<string, string> = {
  "/crm/dashboard": "Dashboard",
  "/crm/leads": "Leads",
  "/crm/agents": "Agents",
};

export default function Topbar() {
  const pathname = usePathname();
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })
      );
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  const title = titles[pathname] || "CRM";

  return (
    <header className="col-start-2 row-start-1 bg-white border-b border-[#E8E4DC] flex items-center px-6 gap-4 z-40">
      <h1 className="font-bold text-lg text-[#1C1C1E] shrink-0">{title}</h1>
      <div className="flex-1" />
      <span className="text-xs text-[#6B6B6F] font-medium tabular-nums">{time}</span>
      <div className="w-8 h-8 rounded-full bg-[#B8963E] text-white flex items-center justify-center text-xs font-bold">
        EC
      </div>
    </header>
  );
}
