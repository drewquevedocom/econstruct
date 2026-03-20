import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { generateBreadcrumbSchema } from "@/lib/schema";
import PageHero from "@/components/ui/PageHero";
import PortfolioGrid from "@/components/portfolio/PortfolioGrid";
import ConsultationCTA from "@/components/ConsultationCTA";

export const metadata: Metadata = generatePageMetadata({
  title: "Our Work — Portfolio of Luxury Homes & Fire Rebuilds",
  description:
    "Explore eConstruct's portfolio of 340+ completed projects across Los Angeles including fire rebuilds, luxury modernizations, custom homes, and ADU construction.",
  path: "/our-work",
});

export default function PortfolioPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://econstructinc.com" },
    { name: "Our Work", url: "https://econstructinc.com/our-work" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PageHero
        title="Our Work"
        subtitle="Over 340 projects completed across Los Angeles — from fire rebuilds to luxury custom homes. Every project reflects our commitment to exceptional craftsmanship."
        breadcrumbs={[{ label: "Our Work" }]}
      />
      <PortfolioGrid />
      <ConsultationCTA />
    </>
  );
}
