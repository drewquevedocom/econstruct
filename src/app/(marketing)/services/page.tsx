import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { generatePageMetadata } from "@/lib/metadata";
import { generateBreadcrumbSchema } from "@/lib/schema";
import { promptServices } from "@/lib/data/prompt-services";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ConsultationCTA from "@/components/ConsultationCTA";

export const metadata: Metadata = generatePageMetadata({
  title: "Los Angeles Construction Services - From Luxury Homes to Fire Rebuilds",
  description:
    "Los Angeles construction services from luxury home building to fire rebuilds, additions, kitchen and bathroom remodeling, and commercial tenant improvements.",
  path: "/services",
});

export default function ServicesPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://econstructinc.com" },
    { name: "Services", url: "https://econstructinc.com/services" },
  ]);
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: promptServices.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: service.title,
      url: `https://econstructinc.com/services/${service.slug}`,
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
        title="Los Angeles Construction Services - From Luxury Homes to Fire Rebuilds"
        subtitle="Full-service general contractor for Los Angeles' most demanding projects."
        breadcrumbs={[{ label: "Services" }]}
      />

      <section className="py-24 md:py-32">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-lg leading-relaxed text-body-text">
              econstruct operates across the full lifecycle of premium Los
              Angeles construction, from luxury home building and fire rebuilds
              to additions, kitchen and bathroom remodeling, and
              schedule-sensitive commercial tenant improvements. Each service is
              managed with the same priorities: clear leadership, disciplined
              preconstruction, strong field execution, and direct communication.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {promptServices.map((service, index) => (
              <AnimatedSection key={service.slug} delay={index * 0.06}>
                <Link href={`/services/${service.slug}`} className="group block">
                  <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
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
                          {service.navLabel}
                        </p>
                        <h3 className="mt-3 text-2xl font-bold text-white">
                          {service.title}
                        </h3>
                      </div>
                    </div>
                    <div className="p-8">
                      <p className="leading-relaxed text-body-text">
                        {service.intro[0]}
                      </p>
                      <p className="mt-6 text-sm font-bold text-brand-dark transition-colors group-hover:text-accent-gold">
                        Learn More
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
              {
                value: "634",
                label: "Projects Completed Successfully",
              },
              {
                value: "51 Years",
                label: "Collective Experience Between Partners",
              },
              {
                value: "25+",
                label: "Years of Frank's experience in LA",
              },
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
