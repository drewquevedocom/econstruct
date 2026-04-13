import Link from "next/link";
import { getBlogArchiveSummary } from "@/lib/blog";

interface BlogFiltersProps {
  active?: string;
}

const filters = [
  { label: "All", href: "/blog", slug: "all" },
  {
    label: "Fire Rebuilds",
    href: "/blog/category/fire-rebuilds",
    slug: "fire-rebuilds",
  },
  {
    label: "Luxury Modernization",
    href: "/blog/category/luxury-modernization",
    slug: "luxury-modernization",
  },
  {
    label: "Custom Homes",
    href: "/blog/category/custom-homes",
    slug: "custom-homes",
  },
  {
    label: "Industry Insights",
    href: "/blog/category/industry-insights",
    slug: "industry-insights",
  },
  {
    label: "Local Guides",
    href: "/blog/category/local-guides",
    slug: "local-guides",
  },
];

export default function BlogFilters({ active = "all" }: BlogFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => {
          const isActive = filter.slug === active;
          return (
            <Link
              key={filter.slug}
              href={filter.href}
              className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] transition-colors ${
                isActive
                  ? "bg-brand-dark text-white"
                  : "border border-brand-dark/12 bg-white text-brand-dark hover:border-accent-gold hover:text-accent-gold"
              }`}
            >
              {filter.label}
            </Link>
          );
        })}
      </div>
      <p className="max-w-3xl text-base leading-relaxed text-body-text">
        {getBlogArchiveSummary(active === "all" ? undefined : active)}
      </p>
    </div>
  );
}
