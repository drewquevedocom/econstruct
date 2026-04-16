const stageColors: Record<string, string> = {
  new: "bg-blue-50 text-blue-700",
  enriched: "bg-purple-50 text-purple-700",
  outreach: "bg-amber-50 text-amber-700",
  contacted: "bg-sky-50 text-sky-700",
  replied: "bg-teal-50 text-teal-700",
  meeting: "bg-indigo-50 text-indigo-700",
  proposal: "bg-orange-50 text-orange-700",
  won: "bg-green-50 text-green-700",
  lost: "bg-red-50 text-red-600",
};

export default function StageTag({ stage }: { stage: string | null }) {
  if (!stage) return <span className="text-xs text-gray-400">--</span>;
  const colors = stageColors[stage] || "bg-gray-100 text-gray-600";
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${colors}`}>
      {stage}
    </span>
  );
}
