interface SectionBadgeProps {
  items: string[];
  className?: string;
  centered?: boolean;
}

export default function SectionBadge({ items, className = "", centered = false }: SectionBadgeProps) {
  return (
    <div className={`border border-brand-dark/20 uppercase tracking-widest text-[10px] font-bold px-4 py-1.5 rounded-full text-brand-dark w-fit flex gap-2 items-center ${centered ? "mx-auto" : ""} ${className}`}>
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 && <span className="text-accent-gold mr-2">•</span>}
          {item}
        </span>
      ))}
    </div>
  );
}
