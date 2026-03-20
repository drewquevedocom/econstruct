import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { generateBreadcrumbSchema } from "@/lib/schema";
import { services } from "@/lib/data/services";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ConsultationCTA from "@/components/ConsultationCTA";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = generatePageMetadata({
  title: "Services",
  description:
    "Premium residential construction services in Los Angeles. Fire rebuilds, luxury modernization, ground-up custom homes, and ADU construction.",
  path: "/services",
});

export default function ServicesPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://econstructinc.com" },
    { name: "Services", url: "https://econstructinc.com/services" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <PageHero
        title="Our Services"
        subtitle="Premium residential construction tailored to your vision. From fire rebuilds to luxury custom homes."
        breadcrumbs={[{ label: "Services" }]}
      />

      {/* Services Grid */}
      <section className="py-24 md:py-32">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, i) => (
              <AnimatedSection key={service.slug} delay={i * 0.1}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group block"
                >
                  <div className="relative rounded-2xl overflow-hidden bg-secondary border border-gray-100 hover:shadow-xl transition-all duration-500">
                    <div className="aspect-[16/10] relative overflow-hidden">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6">
                        <h3 className="text-2xl font-bold text-white font-heading">
                          {service.title}
                        </h3>
                      </div>
                    </div>
                    <div className="p-8">
                      <p className="text-body-text mb-6">
                        {service.shortDescription}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {service.features.slice(0, 3).map((feature) => (
                          <span
                            key={feature}
                            className="text-xs font-semibold uppercase tracking-wider text-accent-gold bg-accent-gold/10 px-3 py-1 rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                      {service.priceRange && (
                        <p className="text-sm font-semibold text-brand-dark">
                          Starting from {service.priceRange}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      {/* Process Section */}
      <section className="py-24 md:py-32 bg-secondary">
        <Container>
          <AnimatedSection>
            <div className="text-center mb-16">
              <div className="border border-brand-dark/20 uppercase tracking-widest text-[10px] font-bold px-4 py-1.5 rounded-full text-brand-dark w-fit mx-auto mb-6 flex gap-2 items-center">
                <span>OUR</span>
                <span className="text-accent-gold">&bull;</span>
                <span>PROCESS</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-brand-dark tracking-tight">
                How We Work
              </h2>
              <p className="mt-6 text-lg text-gray-500 font-medium max-w-2xl mx-auto">
                From first consultation to final walkthrough — a proven process
                refined over 25 years and 340+ projects.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Consultation",
                desc: "Free assessment of your property, vision, and budget. We listen first.",
              },
              {
                step: "02",
                title: "Design & Planning",
                desc: "Detailed scope, architectural plans, and transparent line-item budgets.",
              },
              {
                step: "03",
                title: "Construction",
                desc: "Expert execution with weekly updates, dedicated PM, and Frank's oversight.",
              },
              {
                step: "04",
                title: "Delivery",
                desc: "Final walkthrough, punch list, and comprehensive warranty documentation.",
              },
            ].map((item, i) => (
              <AnimatedSection key={item.step} delay={i * 0.1}>
                <div className="text-center md:text-left">
                  <div className="text-5xl font-bold text-accent-gold/20 mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-brand-dark mb-3">
                    {item.title}
                  </h3>
                  <p className="text-body-text">{item.desc}</p>
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
