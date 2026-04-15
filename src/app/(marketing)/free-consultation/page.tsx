import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { generateBreadcrumbSchema } from "@/lib/schema";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ConsultationCTA from "@/components/ConsultationCTA";

export const metadata: Metadata = generatePageMetadata({
  title: "Free Consultation",
  description:
    "Request a free consultation with econstruct for fire rebuilds, luxury homes, additions, and other high-end residential projects.",
  path: "/free-consultation",
});

export default function FreeConsultationPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://econstructhomes.com" },
    { name: "Free Consultation", url: "https://econstructhomes.com/free-consultation" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <PageHero
        title="Free Consultation"
        subtitle="Tell us what you are planning and we will help you define the smartest next step."
        breadcrumbs={[{ label: "Free Consultation" }]}
      />

      <section className="py-20 md:py-28">
        <Container>
          <AnimatedSection>
            <ConsultationCTA leadSource="consultation_page" />
          </AnimatedSection>
        </Container>
      </section>
    </>
  );
}

