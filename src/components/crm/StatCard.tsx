import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: boolean;
  helper?: string;
  tone?: "default" | "gold" | "red" | "amber" | "green" | "blue";
}

const toneClasses = {
  default: {
    iconWrap: "bg-[#1C1C1E]/5",
    icon: "text-[#1C1C1E]",
    value: "text-[#1C1C1E]",
  },
  gold: {
    iconWrap: "bg-[#B8963E]/10",
    icon: "text-[#B8963E]",
    value: "text-[#1C1C1E]",
  },
  red: {
    iconWrap: "bg-red-50",
    icon: "text-red-600",
    value: "text-red-600",
  },
  amber: {
    iconWrap: "bg-amber-50",
    icon: "text-amber-600",
    value: "text-amber-600",
  },
  green: {
    iconWrap: "bg-green-50",
    icon: "text-green-700",
    value: "text-green-700",
  },
  blue: {
    iconWrap: "bg-sky-50",
    icon: "text-sky-700",
    value: "text-sky-700",
  },
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  helper,
  tone = "default",
}: StatCardProps) {
  const classes = toneClasses[accent ? "gold" : tone];

  return (
    <div className="bg-white rounded-xl border border-[#E8E4DC] p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${classes.iconWrap}`}>
        <Icon size={20} className={classes.icon} />
      </div>
      <div>
        <p className={`text-2xl font-bold tabular-nums ${classes.value}`}>{value}</p>
        <p className="text-xs text-[#6B6B6F] font-medium">{label}</p>
        {helper && <p className="mt-1 text-[11px] text-gray-400">{helper}</p>}
      </div>
    </div>
  );
}
