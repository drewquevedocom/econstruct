"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Bot, Mail, PanelLeftClose, PanelLeft, Send, Handshake, Building2, LifeBuoy } from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentRole } from "@/lib/auth/getCurrentRole";

const navItems = [
  { href: "/crm/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/crm/support", label: "Support", icon: LifeBuoy },
  { href: "/crm/leads", label: "Leads", icon: Users },
  { href: "/crm/new-builds", label: "New Builds", icon: Building2 },
  { href: "/crm/outreach", label: "Outreach", icon: Send },
  { href: "/crm/partners", label: "Partners", icon: Handshake },
  { href: "/crm/sequences", label: "Sequences", icon: Mail },
  { href: "/crm/agents", label: "Agents", icon: Bot },
];

// Mirrors the middleware's STAFF_ALLOWED_PREFIXES — this only controls what's
// shown, not what's reachable (that's enforced server-side in middleware).
const STAFF_VISIBLE_HREFS = new Set(["/crm/support", "/crm/leads", "/crm/new-builds"]);

interface SidebarProps {
  pinned: boolean;
  onPinnedChange: (pinned: boolean) => void;
}

export default function Sidebar({ pinned, onPinnedChange }: SidebarProps) {
  const pathname = usePathname();
  const [role, setRole] = useState<"owner" | "staff">("owner");

  useEffect(() => {
    getCurrentRole().then((user) => setRole(user.role));
  }, []);

  const visibleNavItems =
    role === "staff" ? navItems.filter((item) => STAFF_VISIBLE_HREFS.has(item.href)) : navItems;

  return (
    <aside
      className={`row-span-full col-start-1 bg-[#1C1C1E] flex flex-col overflow-hidden z-50 transition-all duration-300 ${
        pinned ? "w-60" : "w-16"
      }`}
    >
      {/* Logo row */}
      <div className="h-14 flex items-center px-3 border-b border-white/5 shrink-0 gap-2.5">
        <button
          onClick={() => onPinnedChange(!pinned)}
          title={pinned ? "Collapse sidebar" : "Expand sidebar"}
          className="w-7 h-7 rounded-md border border-white/20 text-white/50 flex items-center justify-center hover:text-[#B8963E] hover:border-[#B8963E] transition-colors shrink-0"
        >
          {pinned ? <PanelLeftClose size={16} /> : <PanelLeft size={16} />}
        </button>
        {pinned && (
          <span className="text-white font-bold text-sm whitespace-nowrap">
            econstruct CRM
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 flex flex-col gap-0.5">
        {visibleNavItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={`flex items-center gap-3.5 px-5 py-2.5 text-[13px] whitespace-nowrap transition-all border-l-[3px] ${
                active
                  ? "font-bold text-white border-l-[#B8963E] bg-[#B8963E]/20 shadow-[inset_0_0_0_1px_rgba(184,150,62,0.25)]"
                  : "font-medium text-white/50 border-l-transparent hover:text-white/85 hover:bg-white/4"
              }`}
            >
              <Icon size={20} className={`shrink-0 ${active ? "text-[#D4B96A] opacity-100" : "opacity-70"}`} />
              {pinned && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/5 shrink-0">
        {pinned && (
          <span className="text-[10px] text-white/30 whitespace-nowrap">
            v1.0 &middot; 7-Agent Swarm
          </span>
        )}
      </div>
    </aside>
  );
}
