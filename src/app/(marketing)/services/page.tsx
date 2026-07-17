import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { generatePageMetadata } from "@/lib/metadata";
import { generateBreadcrumbSchema } from "@/lib/schema";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ConsultationCTA from "@/components/ConsultationCTA";

export const metadata: Metadata = generatePageMetadata({
  title: "Los Angeles Construction Services | econstruct",
  description:
    "Commercial and residential construction services across Los Angeles — restaurants, retail, office TI, food distribution, custom homes, ADUs, and fire rebuilds. CA Lic #964015.",
  path: "/services",
});

const services = [
  {
    label: "Commercial",
    title: "Restaurant & Bar Construction",
    href: "/services/restaurant-bar-construction",
    image: "https://i1.wp.com/econstructinc.com/wp-content/uploads/2023/09/hutchinson11.jpg",
    description:
      "Full-service restaurant and bar build-outs across Los Angeles — from commercial kitchen construction and health department permitting to opening-day delivery.",
  },
  {
    label: "Commercial",
    title: "Retail Tenant Improvement",
    href: "/services/retail-tenant-improvement",
    image: "https://i1.wp.com/econstructinc.com/wp-content/uploads/2023/10/Untitled-design-87.png",
    description:
      "Retail fit-outs for national brands and local operators. Custom millwork, brand-spec finishes, and turnkey delivery on schedule.",
  },
  {
    label: "Commercial",
    title: "Office & Tenant Improvement",
    href: "/services/office-tenant-improvement",
    image: "/projects/01_Starbucks.jpg",
    description:
      "Office and commercial TI projects managed from preconstruction through close-out — MEP coordination, permit management, and one point of contact.",
  },
  {
    label: "Food & Industrial",
    title: "Food Distribution & Cold Storage",
    href: "/food-distribution-construction",
    image: "/projects/Cold & Dry Storage WarehouseCold_storage_warehouse_exterior_…_202607071651.jpeg",
    description:
      "Construction and TI for food distribution centers, cold storage facilities, ghost kitchens, and commissary operations across Southern California.",
  },
  {
    label: "Residential",
    title: "Custom Homes & ADUs",
    href: "/services/custom-homes",
    image: "/custom_home_service.png",
    description:
      "Ground-up custom home construction and ADU builds — lot evaluation, architect coordination, full permit management, and premium field execution.",
  },
  {
    label: "Residential",
    title: "Luxury Modernization",
    href: "/services/luxury-modernization",
    image: "/luxury_mod_service.png",
    description:
      "High-end home modernization for Brentwood, Santa Monica, and Bel Air residences — premium materials, smart home integration, and indoor-outdoor design.",
  },
  {
    label: "Residential",
    title: "Fire Rebuild & Restoration",
    href: "/services/fire-rebuild",
    image: "/fire_rebuild_hero.png",
    description:
      "Comprehensive fire rebuild services for Palisades, Altadena, and Malibu homeowners — insurance coordination, WUI-compliant construction, expedited permitting.",
  },
];

export default function ServicesPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://econstructinc.com" },
    { name: "Services", url: "https://econstructinc.com/services" },
  ]);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: service.title,
      url: `https://econstructinc.com${service.href}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbSchema, itemListSchema]),
        }}
      />

      <PageHero
        title="Los Angeles Construction Services"
        subtitle="Commercial and residential construction across Los Angeles — restaurants, retail, office TI, custom homes, ADUs, and fire rebuilds. One team, one standard."
        breadcrumbs={[{ label: "Services" }]}
      />

      <section className="py-24 md:py-32">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-lg leading-relaxed text-body-text">
              econstruct operates across the full lifecycle of commercial and residential
              construction in Los Angeles — restaurants, retail, office tenant improvements,
              food facilities, custom homes, ADUs, and fire rebuilds. Every project is managed
              with the same priorities: clear leadership, disciplined preconstruction, strong
              field execution, and direct communication.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service, index) => (
              <AnimatedSection key={service.href} delay={index * 0.06}>
                <Link href={service.href} className="group block h-full">
                  <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-brand-dark/10 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6">
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-gold/90">
                          {service.label}
                        </p>
                        <h3 className="mt-2 text-2xl font-bold text-white">
                          {service.title}
                        </h3>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-8">
                      <p className="flex-1 leading-relaxed text-body-text">
                        {service.description}
                      </p>
                      <p className="mt-6 text-sm font-bold text-brand-dark transition-colors group-hover:text-accent-gold">
                        Learn More →
                      </p>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-secondary py-24 md:py-32">
        <Container>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { value: "634+", label: "Combined Partner Projects" },
              { value: "51 Years", label: "Collective Experience Between Partners" },
              { value: "Since 2001", label: "Building in Los Angeles" },
            ].map((item, index) => (
              <AnimatedSection key={item.label} delay={index * 0.08}>
                <div className="rounded-3xl border border-gray-100 bg-white p-10 text-center shadow-sm">
                  <p className="text-5xl font-bold tracking-tight text-brand-dark">
                    {item.value}
                  </p>
                  <p className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-accent-gold">
                    {item.label}
                  </p>
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
