"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Bot, PanelLeftClose, PanelLeft } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/crm/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/crm/leads", label: "Leads", icon: Users },
  { href: "/crm/agents", label: "Agents", icon: Bot },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [pinned, setPinned] = useState(false);

  return (
    <aside
      className={`row-span-full col-start-1 bg-[#1C1C1E] flex flex-col overflow-hidden z-50 transition-all duration-300 group ${
        pinned ? "w-60" : "w-16 hover:w-60"
      }`}
    >
      {/* Logo row */}
      <div className="h-14 flex items-center px-3 border-b border-white/5 shrink-0 gap-2.5">
        <button
          onClick={() => setPinned(!pinned)}
          className="w-7 h-7 rounded-md border border-white/20 text-white/50 flex items-center justify-center hover:text-[#B8963E] hover:border-[#B8963E] transition-colors shrink-0"
        >
          {pinned ? <PanelLeftClose size={16} /> : <PanelLeft size={16} />}
        </button>
        <span className={`text-white font-bold text-sm whitespace-nowrap transition-opacity duration-300 ${pinned ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
          econstruct CRM
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 flex flex-col gap-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3.5 px-5 py-2.5 text-[13px] font-medium whitespace-nowrap transition-all border-l-[3px] min-w-60 ${
                active
                  ? "text-[#B8963E] border-l-[#B8963E] bg-[#B8963E]/8"
                  : "text-white/50 border-l-transparent hover:text-white/85 hover:bg-white/4"
              }`}
            >
              <Icon size={20} className={`shrink-0 ${active ? "opacity-100" : "opacity-70"}`} />
              <span className={`transition-opacity duration-300 ${pinned ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/5 shrink-0 min-w-60">
        <span className={`text-[10px] text-white/30 whitespace-nowrap transition-opacity duration-300 ${pinned ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
          v1.0 &middot; 7-Agent Swarm
        </span>
      </div>
    </aside>
  );
}
