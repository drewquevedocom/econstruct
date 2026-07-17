import type { Metadata } from "next";
import Link from "next/link";
import { generatePageMetadata } from "@/lib/metadata";
import { generateBreadcrumbSchema } from "@/lib/schema";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ConsultationCTA from "@/components/ConsultationCTA";

const serviceAreas = [
  {
    area: "West Hollywood & La Cienega",
    note: "Restaurant and bar build-outs, retail fit-outs, and hospitality construction along one of LA's most active commercial corridors.",
  },
  {
    area: "Santa Monica",
    note: "Restaurant TI, retail fit-outs, office tenant improvements, and ADU construction across one of the Westside's most permit-active markets.",
  },
  {
    area: "Culver City",
    note: "Commercial TI and office build-outs serving the tech and entertainment corridor — fast permitting, MEP coordination, and turnkey delivery.",
  },
  {
    area: "Hollywood & Mid-City",
    note: "Restaurant, bar, and retail construction across Hollywood and Mid-City's high-traffic commercial districts.",
  },
  {
    area: "Downtown Los Angeles",
    note: "Office TI, restaurant build-outs, and commercial construction in DTLA — coordinated delivery in high-density, active-building environments.",
  },
  {
    area: "Pasadena & San Gabriel Valley",
    note: "Multi-location restaurant builds, retail fit-outs, and commercial TI across Pasadena and the broader San Gabriel Valley.",
  },
  {
    area: "Burbank & Glendale",
    note: "Commercial and retail construction for entertainment-industry tenants and multi-location operators in the north LA market.",
  },
  {
    area: "El Segundo & Manhattan Beach",
    note: "Retail and commercial TI for South Bay operators — quick-service restaurants, fitness concepts, and office renovations.",
  },
  {
    area: "Valencia & Santa Clarita",
    note: "Commercial construction serving the Santa Clarita Valley — our home base, with deep local permitting relationships and fast turnaround.",
  },
  {
    area: "Inland Empire",
    note: "Multi-location build-outs and food distribution facility construction across Riverside, San Bernardino, and the surrounding logistics corridor.",
  },
  {
    area: "Malibu & Pacific Palisades",
    note: "Luxury home construction, fire rebuilds, and WUI-compliant restoration along the coastal corridor — insurance coordination included.",
  },
  {
    area: "Brentwood & Bel Air",
    note: "High-end residential remodels, custom homes, and luxury modernization where design integrity and scheduling discipline are non-negotiable.",
  },
  {
    area: "Beverly Hills",
    note: "Premium residential and commercial construction in one of LA's most scrutinized permitting jurisdictions — handled with precision.",
  },
  {
    area: "Studio City & Sherman Oaks",
    note: "Restaurant build-outs, retail TI, ADUs, and home additions serving the active commercial and residential market in the San Fernando Valley.",
  },
  {
    area: "Encino & Calabasas",
    note: "Estate remodels, custom homes, and luxury modernization across the west Valley — gated-community coordination included.",
  },
  {
    area: "Long Beach & South LA",
    note: "Commercial and food facility construction in the South LA corridor — industrial TI, restaurant build-outs, and warehouse improvements.",
  },
  {
    area: "Orange County",
    note: "Multi-location restaurant and retail build-outs across Orange County — Buena Park, Irvine, Anaheim, and surrounding markets.",
  },
  {
    area: "Riverside & Moreno Valley",
    note: "Fast-casual and multi-location restaurant construction, food distribution TI, and commercial build-outs throughout the Inland Empire.",
  },
];

export const metadata: Metadata = generatePageMetadata({
  title: "Los Angeles Construction Service Areas | econstruct",
  description:
    "econstruct serves Los Angeles and Southern California for commercial construction, restaurant build-outs, retail TI, office improvements, food facilities, custom homes, and fire rebuilds. CA Lic #964015.",
  path: "/service-areas",
});

export default function ServiceAreasPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://econstructinc.com" },
    { name: "Service Areas", url: "https://econstructinc.com/service-areas" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <PageHero
        title="Los Angeles Construction Service Areas"
        subtitle="Commercial and residential construction across Los Angeles and Southern California — restaurants, retail, office TI, food facilities, custom homes, and fire rebuilds."
        breadcrumbs={[{ label: "Service Areas" }]}
      />

      <section className="py-24 md:py-32">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {serviceAreas.map(({ area, note }, index) => (
              <AnimatedSection key={area} delay={index * 0.04}>
                <div className="h-full rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-brand-dark">{area}</h2>
                  <p className="mt-4 leading-relaxed text-body-text">{note}</p>
                  <div className="mt-6 flex flex-wrap gap-4">
                    <Link
                      href="/services/restaurant-bar-construction"
                      className="text-sm font-bold text-accent-gold transition-colors hover:text-brand-dark"
                    >
                      Restaurant & Bar
                    </Link>
                    <Link
                      href="/services/retail-tenant-improvement"
                      className="text-sm font-bold text-accent-gold transition-colors hover:text-brand-dark"
                    >
                      Retail TI
                    </Link>
                    <Link
                      href="/services/fire-rebuild"
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
