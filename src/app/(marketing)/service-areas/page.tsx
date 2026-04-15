import type { Metadata } from "next";
import Link from "next/link";
import { generatePageMetadata } from "@/lib/metadata";
import { generateBreadcrumbSchema } from "@/lib/schema";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ConsultationCTA from "@/components/ConsultationCTA";

const serviceAreas = [
  ["Beverly Hills", "Large estates, privacy concerns, and extremely high expectations on detailing and schedule control."],
  ["Bel Air", "Hillside access, structural demands, and premium custom home coordination."],
  ["Pacific Palisades", "Fire rebuild urgency, coastal-adjacent conditions, and high-value residential construction."],
  ["Malibu", "Coastal permitting pressure, exposure conditions, and resilient material strategy."],
  ["Santa Monica", "Design-sensitive premium remodels and custom homes with strong lifestyle focus."],
  ["Brentwood", "Luxury renovation and rebuild work where communication and finish quality matter."],
  ["Encino", "High-end additions, remodels, and custom home activity across established neighborhoods."],
  ["Sherman Oaks", "ADUs, additions, and premium residential upgrades with value in mind."],
  ["Calabasas", "Estate properties, gated-community coordination, and design-build discipline."],
  ["Hidden Hills", "Controlled environments where preconstruction clarity and scheduling are critical."],
  ["Westlake Village", "Large-lot custom and modernization projects with premium finish expectations."],
  ["Tarzana", "Family-driven additions and custom residential improvements."],
  ["Woodland Hills", "Guest houses, ADUs, and larger-scale home transformations."],
  ["Studio City", "Additions and remodels where design continuity with the existing home matters."],
  ["Hancock Park", "Architecturally sensitive renovations and elevated interiors."],
  ["Los Feliz", "Character-rich homes requiring thoughtful modernization rather than generic remodeling."],
  ["Silver Lake", "Modern additions and renovations on tighter urban sites."],
  ["Pasadena", "Custom and addition work where permitting and architectural context both matter."],
];

export const metadata: Metadata = generatePageMetadata({
  title: "Los Angeles Construction Service Areas",
  description:
    "Explore the Los Angeles neighborhoods and surrounding communities served by econstruct for luxury homes, fire rebuilds, additions, remodels, and tenant improvements.",
  path: "/service-areas",
});

export default function ServiceAreasPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://econstructhomes.com" },
    { name: "Service Areas", url: "https://econstructhomes.com/service-areas" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <PageHero
        title="Los Angeles Construction Service Areas"
        subtitle="Neighborhood-specific experience for luxury homes, fire rebuilds, additions, remodels, and tenant improvements."
        breadcrumbs={[{ label: "Service Areas" }]}
      />

      <section className="py-24 md:py-32">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {serviceAreas.map(([area, note], index) => (
              <AnimatedSection key={area} delay={index * 0.04}>
                <div className="h-full rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-brand-dark">{area}</h2>
                  <p className="mt-4 leading-relaxed text-body-text">{note}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href="/services/luxury-home-builder-los-angeles"
                      className="text-sm font-bold text-accent-gold transition-colors hover:text-brand-dark"
                    >
                      Luxury Homes
                    </Link>
                    <Link
                      href="/services/fire-rebuild-contractor-los-angeles"
                      className="text-sm font-bold text-accent-gold transition-colors hover:text-brand-dark"
                    >
                      Fire Rebuild
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      <ConsultationCTA />
    </>
  );
}

