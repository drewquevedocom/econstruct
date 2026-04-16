import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { generateBreadcrumbSchema } from "@/lib/schema";
import { SITE_URL } from "@/lib/constants";
import PageHero from "@/components/ui/PageHero";
import PortfolioGrid from "@/components/portfolio/PortfolioGrid";
import ConsultationCTA from "@/components/ConsultationCTA";

export const metadata: Metadata = generatePageMetadata({
  title: "Our Work | Luxury Residential Projects in Los Angeles",
  description:
    "Explore completed luxury residential projects across Los Angeles, including custom homes, fire rebuilds, and high-end remodels.",
  path: "/our-work",
});

export default function PortfolioPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Our Work", url: `${SITE_URL}/our-work` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PageHero
        title="Our Work"
        subtitle="Luxury residential work across Los Angeles. Every project is built for long-term quality, design integrity, and construction precision."
        breadcrumbs={[{ label: "Our Work" }]}
      />
      <PortfolioGrid />
      <ConsultationCTA />
    </>
  );
}
