import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import {
  generateServiceSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
} from "@/lib/schema";
import { services } from "@/lib/data/services";
import { faqs } from "@/lib/data/faq";
import { testimonials } from "@/lib/data/testimonials";
import PageHero from "@/components/ui/PageHero";
import SectionHeader from "@/components/ui/SectionHeader";
import Container from "@/components/ui/Container";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import AccordionItem from "@/components/ui/AccordionItem";
import ConsultationCTA from "@/components/ConsultationCTA";
import Image from "next/image";
import {
  Sparkles,
  Palette,
  BrickWall,
  Cpu,
  Leaf,
  Maximize,
  DollarSign,
  Ruler,
  PaintBucket,
  Wrench,
  Eye,
  CheckCircle,
  Star,
} from "lucide-react";

const service = services.find((s) => s.slug === "luxury-modernization")!;
const luxuryFaqs = faqs.filter(
  (f) => f.category === "general" || f.category === "pricing"
);
const luxuryTestimonials = testimonials.filter(
  (t) => t.projectType === "luxury"
);

export const metadata: Metadata = generatePageMetadata({
  title:
    "Luxury Home Modernization Los Angeles | High-End Renovation Contractor",
  description:
    "Transform your existing home with premium materials and modern design. Luxury modernization for Brentwood, Santa Monica, and Bel Air. Design-preserve pricing. 25+ years.",
  path: "/services/luxury-modernization",
  image: "/luxury_mod_service.png",
});

const features = [
  {
    icon: Palette,
    title: "Design-Preserve Pricing",
    description:
      "Our methodology protects the elements that give your home character while modernizing everything else. You set priorities — we price accordingly.",
  },
  {
    icon: BrickWall,
    title: "Premium Material Sourcing",
    description:
      "Access to exclusive European stone, custom millwork, artisan tile, and designer fixtures that aren't available through standard channels.",
  },
  {
    icon: Wrench,
    title: "Structural Engineering",
    description:
      "Open floor plans, expanded views, and dramatic spaces often require structural modifications. Our engineering partners make the impossible possible.",
  },
  {
    icon: Cpu,
    title: "Smart Home Automation",
    description:
      "Lutron, Savant, Control4, Sonos — fully integrated lighting, climate, audio, security, and shade systems tailored to how you actually live.",
  },
  {
    icon: Leaf,
    title: "Energy Efficiency Upgrades",
    description:
      "High-performance windows, spray-foam insulation, heat-pump HVAC, solar integration, and EV-ready garages. Modern comfort with lower bills.",
  },
  {
    icon: Maximize,
    title: "Indoor-Outdoor Living",
    description:
      "Disappearing glass walls, outdoor kitchens, infinity-edge pools, and landscape architecture that blur the line between inside and out.",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Design Discovery",
    description:
      "We tour your home, discuss your lifestyle and aesthetic preferences, and identify opportunities. What stays, what goes, what transforms.",
    icon: Eye,
  },
  {
    step: "02",
    title: "Concept & Budget",
    description:
      "Architectural concepts, material boards, and a transparent line-item budget. Design-preserve pricing ensures no surprises.",
    icon: DollarSign,
  },
  {
    step: "03",
    title: "Material Selection",
    description:
      "Guided showroom visits, custom material sourcing, and fixture selections. We curate options that match your vision and budget.",
    icon: PaintBucket,
  },
  {
    step: "04",
    title: "Precision Construction",
    description:
      "Phased construction minimizes disruption. Weekly updates, dedicated PM, and Frank's personal oversight throughout.",
    icon: Ruler,
  },
  {
    step: "05",
    title: "Styling & Delivery",
    description:
      "Final detailing, comprehensive walkthrough, smart system programming, and warranty documentation. Your transformed home, delivered.",
    icon: Sparkles,
  },
];

export default function LuxuryModernizationPage() {
  const serviceSchema = generateServiceSchema(service);
  const faqSchema = generateFAQSchema(luxuryFaqs);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://econstructinc.com" },
    { name: "Services", url: "https://econstructinc.com/services" },
    {
      name: "Luxury Modernization",
      url: "https://econstructinc.com/services/luxury-modernization",
    },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([serviceSchema, faqSchema, breadcrumbSchema]),
        }}
      />

      {/* Hero */}
      <PageHero
        title="Transform Your Home. Keep Your Neighborhood."
        subtitle="High-end home modernization for Brentwood, Santa Monica, and Bel Air. Premium materials, smart technology, and craftsmanship that honors your home's character."
        breadcrumbs={[
          { label: "Services", href: "/services" },
          { label: "Luxury Modernization" },
        ]}
        backgroundImage="/luxury_mod_service.png"
      />

      {/* Trust Signals Strip */}
      <section className="bg-brand-dark py-8 border-t border-white/10">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "$450-$800+", label: "Per Sq Ft" },
              { value: "6-12 Mo", label: "Typical Timeline" },
              { value: "25+", label: "Years Experience" },
              { value: "345+", label: "Projects Completed" },
            ].map((stat) => (
              <AnimatedSection key={stat.label}>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-accent-gold mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/70 font-medium uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      {/* Why Choose econstruct */}
      <section className="py-24 md:py-32">
        <Container>
          <SectionHeader
            badge={["LUXURY", "MODERNIZATION"]}
            title="Elevated Living, Expert Execution"
            subtitle="We don't just renovate — we transform. Every detail is considered, every material curated, every finish executed to the highest standard."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <AnimatedSection key={feature.title} delay={i * 0.08}>
                <div className="bg-secondary rounded-2xl p-8 h-full border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                  <div className="w-14 h-14 rounded-xl bg-accent-gold/10 flex items-center justify-center mb-6">
                    <feature.icon className="w-7 h-7 text-accent-gold" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-dark mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-body-text leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      {/* Before/After Concept */}
      <section className="py-24 md:py-32 bg-secondary">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                <Image
                  src="/luxury_mod_service.png"
                  alt="Luxury home modernization in Los Angeles"
                  fill
                  className="object-cover"
                />
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <div>
                <div className="border border-brand-dark/20 uppercase tracking-widest text-[10px] font-bold px-4 py-1.5 rounded-full text-brand-dark w-fit mb-6 flex gap-2 items-center">
                  <span>THE</span>
                  <span className="text-accent-gold">&bull;</span>
                  <span>DIFFERENCE</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-brand-dark tracking-tight mb-6">
                  More Than a Remodel
                </h2>
                <p className="text-lg text-body-text mb-8 leading-relaxed">
                  A luxury modernization isn&apos;t about knocking down walls and
                  picking new tile. It&apos;s about understanding how you live,
                  what your home means to you, and elevating every element to
                  match.
                </p>
                <div className="space-y-4">
                  {[
                    "Architectural character preserved and enhanced",
                    "Premium European materials and custom millwork",
                    "Fully integrated smart home systems",
                    "Energy-efficient upgrades that pay for themselves",
                    "Seamless indoor-outdoor transitions",
                    "Dedicated project manager + Frank's oversight",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-accent-gold shrink-0 mt-0.5" />
                      <span className="text-body-text">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <Button href="/contact" variant="primary" size="lg">
                    Schedule a Design Discovery
                  </Button>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </Container>
      </section>

      {/* Process */}
      <section className="py-24 md:py-32">
        <Container>
          <SectionHeader
            badge={["OUR", "PROCESS"]}
            title="From Vision to Reality"
            subtitle="A refined process that respects your time, your home, and your investment."
          />

          <div className="max-w-4xl mx-auto">
            {processSteps.map((step, i) => (
              <AnimatedSection key={step.step} delay={i * 0.08}>
                <div className="flex gap-6 md:gap-8 mb-12 last:mb-0">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-14 h-14 rounded-full bg-accent-gold flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                    {i < processSteps.length - 1 && (
                      <div className="w-px h-full bg-accent-gold/30 mt-4" />
                    )}
                  </div>
                  <div className="pb-12 last:pb-0">
                    <div className="text-sm font-bold text-accent-gold uppercase tracking-wider mb-1">
                      Step {step.step}
                    </div>
                    <h3 className="text-2xl font-bold text-brand-dark mb-3">
                      {step.title}
                    </h3>
                    <p className="text-body-text leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      {luxuryTestimonials.length > 0 && (
        <section className="py-24 md:py-32 bg-secondary">
          <Container>
            <SectionHeader
              badge={["CLIENT", "EXPERIENCES"]}
              title="What Our Clients Say"
              subtitle="Hear from homeowners who trusted econstruct to transform their residences."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {luxuryTestimonials.map((testimonial, i) => (
                <AnimatedSection key={testimonial.name} delay={i * 0.1}>
                  <div className="bg-white rounded-2xl p-8 border border-gray-100 h-full">
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map(
                        (_, j) => (
                          <Star
                            key={j}
                            className="w-5 h-5 fill-accent-gold text-accent-gold"
                          />
                        )
                      )}
                    </div>
                    <blockquote className="text-body-text leading-relaxed mb-6 italic">
                      &ldquo;{testimonial.quote}&rdquo;
                    </blockquote>
                    <div>
                      <div className="font-bold text-brand-dark">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-body-text">
                        {testimonial.neighborhood}
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* FAQ Section */}
      <section className="py-24 md:py-32">
        <Container size="narrow">
          <SectionHeader
            badge={["MODERNIZATION", "FAQ"]}
            title="Frequently Asked Questions"
            subtitle="Common questions about luxury home modernization in Los Angeles."
          />

          <div className="divide-y divide-gray-200 border-t border-gray-200">
            {luxuryFaqs.map((faq, i) => (
              <AccordionItem
                key={i}
                question={faq.question}
                answer={faq.answer}
                defaultOpen={i === 0}
              />
            ))}
          </div>

          <AnimatedSection>
            <div className="mt-12 text-center">
              <p className="text-body-text mb-6">
                Ready to transform your home?
              </p>
              <Button href="/contact" variant="secondary">
                Start Your Modernization
              </Button>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      <ConsultationCTA />
    </>
  );
}
