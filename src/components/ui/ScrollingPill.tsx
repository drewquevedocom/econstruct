"use client";

interface ScrollingPillProps {
  label: string;
  className?: string;
}

/**
 * A pill badge whose text scrolls continuously left — like a ticker.
 * Duplicate the content twice so the loop is seamless.
 */
export default function ScrollingPill({ label, className = "" }: ScrollingPillProps) {
  // Add a separator so the loop reads naturally
  const chunk = `${label}   ·   `;

  return (
    <div
      className={`relative w-[170px] overflow-hidden rounded-full border py-1.5 text-[10px] font-bold uppercase tracking-widest ${className}`}
    >
      {/* Two identical copies side-by-side; animation shifts by -50% = one copy */}
      <div
        className="flex shrink-0 whitespace-nowrap"
        style={{ animation: "pill-marquee 7s linear infinite" }}
      >
        <span className="pl-4 pr-1">{chunk}</span>
        <span className="pl-0 pr-1" aria-hidden>{chunk}</span>
      </div>
    </div>
  );
}
