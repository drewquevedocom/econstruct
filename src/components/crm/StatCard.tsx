import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: boolean;
}

export default function StatCard({ label, value, icon: Icon, accent }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-[#E8E4DC] p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${accent ? "bg-[#B8963E]/10" : "bg-[#1C1C1E]/5"}`}>
        <Icon size={20} className={accent ? "text-[#B8963E]" : "text-[#1C1C1E]"} />
      </div>
      <div>
        <p className="text-2xl font-bold text-[#1C1C1E] tabular-nums">{value}</p>
        <p className="text-xs text-[#6B6B6F] font-medium">{label}</p>
      </div>
    </div>
  );
}
