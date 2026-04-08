import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { generateBreadcrumbSchema } from "@/lib/schema";
import PageHero from "@/components/ui/PageHero";
import PortfolioGrid from "@/components/portfolio/PortfolioGrid";
import ConsultationCTA from "@/components/ConsultationCTA";

export const metadata: Metadata = generatePageMetadata({
  title: "Our Work — Portfolio of Residential, Restaurant & Retail Projects",
  description:
    "Explore econstruct's portfolio of 340+ completed projects across Los Angeles including residential remodels, restaurant build-outs, retail spaces, and multi-location commercial rollouts.",
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
        subtitle="Over 340 projects completed across Los Angeles — from residential remodels and restaurants to retail spaces and multi-location rollouts. Every project reflects our commitment to exceptional craftsmanship."
        breadcrumbs={[{ label: "Our Work" }]}
      />
      <PortfolioGrid />
      <ConsultationCTA />
    </>
  );
}
