export default function ScoreBadge({ score }: { score: number | null }) {
  if (score == null) return <span className="text-xs text-gray-400">--</span>;
  const hot = score >= 85;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold tabular-nums ${
        hot
          ? "bg-[#B8963E]/10 text-[#B8963E]"
          : "bg-gray-100 text-gray-500"
      }`}
    >
      {score}
    </span>
  );
}
