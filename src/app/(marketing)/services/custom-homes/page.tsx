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
  Home,
  MapPin,
  Users,
  FileCheck,
  Shield,
  Gem,
  TreePine,
  Clock,
  Ruler,
  HardHat,
  Key,
  CheckCircle,
  Star,
} from "lucide-react";

const service = services.find((s) => s.slug === "custom-homes")!;
const customHomeFaqs = faqs.filter(
  (f) => f.category === "general" || f.category === "process"
);
const customTestimonials = testimonials.filter(
  (t) => t.projectType === "custom"
);

export const metadata: Metadata = generatePageMetadata({
  title: "Custom Home Builder Los Angeles | Ground-Up Luxury Construction",
  description:
    "Premier custom home builder in Los Angeles. Ground-up luxury construction from lot evaluation to move-in. Architect partnerships, WUI-ready builds. $500-$1,000+/sq ft.",
  path: "/services/custom-homes",
  image: "/custom_home_service.png",
});

const features = [
  {
    icon: MapPin,
    title: "Lot Evaluation & Feasibility",
    description:
      "Before you commit to a lot, we assess buildability — soil conditions, zoning, setbacks, slope stability, utility access, and WUI zone status. No surprises after purchase.",
  },
  {
    icon: Users,
    title: "Architect Partnership Coordination",
    description:
      "We partner with LA's top residential architects and manage the design-build relationship so your vision translates perfectly from renderings to reality.",
  },
  {
    icon: Shield,
    title: "WUI-Ready Construction",
    description:
      "Building in fire-prone hillside areas? Every custom home we build meets or exceeds Chapter 7A fire codes with ember-resistant assemblies and defensible space design.",
  },
  {
    icon: FileCheck,
    title: "Full Permit Management",
    description:
      "From initial plan check through final sign-off, we manage every permit, inspection, and approval. Our city relationships accelerate timelines significantly.",
  },
  {
    icon: Gem,
    title: "Premium Finish Packages",
    description:
      "Curated material selections from European stone to custom millwork. Access to exclusive suppliers and artisan craftspeople not available to most builders.",
  },
  {
    icon: TreePine,
    title: "Landscape Architecture",
    description:
      "Integrated landscape design from day one — infinity pools, outdoor kitchens, native plantings, and hardscaping that complement your home's architecture.",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Lot & Feasibility Analysis",
    description:
      "We evaluate your lot (or help you find one) for buildability, zoning, geological conditions, and total project viability. You'll know exact constraints before design begins.",
    icon: MapPin,
  },
  {
    step: "02",
    title: "Architect Selection & Design",
    description:
      "We match you with the ideal architect for your style, then manage the design process to ensure buildability and budget alignment throughout.",
    icon: Ruler,
  },
  {
    step: "03",
    title: "Engineering & Permitting",
    description:
      "Structural, mechanical, and civil engineering coordinated in parallel. We submit permits early and leverage relationships to minimize approval timelines.",
    icon: FileCheck,
  },
  {
    step: "04",
    title: "Site Preparation",
    description:
      "Grading, foundation, and underground utilities. For hillside lots, this includes retaining walls, caissons, and drainage systems engineered for LA geology.",
    icon: HardHat,
  },
  {
    step: "05",
    title: "Construction & Finishes",
    description:
      "Framing through final finishes with weekly progress reports, dedicated PM, and Frank's personal site visits. Material selections are confirmed well ahead of installation.",
    icon: Home,
  },
  {
    step: "06",
    title: "Move-In & Warranty",
    description:
      "Comprehensive walkthrough, system tutorials, landscape completion, and full warranty package. We're here for you long after the keys are in your hand.",
    icon: Key,
  },
];

export default function CustomHomesPage() {
  const serviceSchema = generateServiceSchema(service);
  const faqSchema = generateFAQSchema(customHomeFaqs);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://econstructhomes.com" },
    { name: "Services", url: "https://econstructhomes.com/services" },
    {
      name: "Custom Homes",
      url: "https://econstructhomes.com/services/custom-homes",
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
        title="Your Lot. Your Vision. Our 25 Years."
        subtitle="Ground-up luxury custom homes in Los Angeles. From lot evaluation to move-in, we deliver homes that exceed expectations in quality, timeline, and value."
        breadcrumbs={[
          { label: "Services", href: "/services" },
          { label: "Custom Homes" },
        ]}
        backgroundImage="/custom_home_service.png"
      />

      {/* Trust Signals Strip */}
      <section className="bg-brand-dark py-8 border-t border-white/10">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "$500-$1K+", label: "Per Sq Ft" },
              { value: "14-24 Mo", label: "Typical Timeline" },
              { value: "25+", label: "Years Experience" },
              { value: "639+", label: "Projects Completed" },
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

      {/* Features Grid */}
      <section className="py-24 md:py-32">
        <Container>
          <SectionHeader
            badge={["CUSTOM", "HOME", "BUILDING"]}
            title="End-to-End Custom Home Expertise"
            subtitle="Building a custom home is the most complex residential construction project there is. Our 25 years of experience means fewer surprises, tighter timelines, and a better result."
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

      {/* Why Build Custom */}
      <section className="py-24 md:py-32 bg-secondary">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <div>
                <div className="border border-brand-dark/20 uppercase tracking-widest text-[10px] font-bold px-4 py-1.5 rounded-full text-brand-dark w-fit mb-6 flex gap-2 items-center">
                  <span>WHY</span>
                  <span className="text-accent-gold">&bull;</span>
                  <span>BUILD CUSTOM</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-brand-dark tracking-tight mb-6">
                  No Compromises. No Limitations.
                </h2>
                <p className="text-lg text-body-text mb-8 leading-relaxed">
                  When you build ground-up, every detail is intentional. The
                  ceiling heights, the sightlines, the way light enters each
                  room at different times of day — everything is designed around
                  how you actually live.
                </p>
                <div className="space-y-4">
                  {[
                    "Every room designed for your lifestyle",
                    "Optimal orientation for views, light, and privacy",
                    "Modern systems from the ground up — no retrofitting",
                    "WUI-compliant construction built in, not bolted on",
                    "Future-proofed with EV charging, solar-ready, smart infrastructure",
                    "Your architect's vision executed with precision",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-accent-gold shrink-0 mt-0.5" />
                      <span className="text-body-text">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <Button href="/contact" variant="primary" size="lg">
                    Discuss Your Custom Home
                  </Button>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                <Image
                  src="/custom_home_service.png"
                  alt="Custom luxury home construction in Los Angeles"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/30 to-transparent" />
              </div>
            </AnimatedSection>
          </div>
        </Container>
      </section>

      {/* Process Timeline */}
      <section className="py-24 md:py-32">
        <Container>
          <SectionHeader
            badge={["BUILD", "PROCESS"]}
            title="From Dirt to Dream Home"
            subtitle="A comprehensive 6-phase process designed for ground-up construction. Transparent timelines, clear milestones, and no surprises."
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
                      Phase {step.step}
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

      {/* What to Expect - Cost & Timeline */}
      <section className="py-24 md:py-32 bg-brand-dark">
        <Container>
          <SectionHeader
            badge={["INVESTMENT", "OVERVIEW"]}
            title="What to Expect"
            subtitle="Transparency on cost and timeline for custom home construction in Los Angeles."
            light
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Gem,
                title: "Investment Range",
                value: "$500 - $1,000+/sq ft",
                description:
                  "Varies by lot complexity, architectural design, finish level, and WUI requirements. We provide detailed budgets before construction begins.",
              },
              {
                icon: Clock,
                title: "Build Timeline",
                value: "14-24 Months",
                description:
                  "From permit approval to completion. Add 3-6 months for design and permitting. Our expedited process saves significant time on approvals.",
              },
              {
                icon: Users,
                title: "Your Team",
                value: "Dedicated PM + Frank",
                description:
                  "Every project gets a dedicated project manager. Frank Neimroozi personally oversees all builds with regular site visits and direct client access.",
              },
            ].map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 0.1}>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center h-full">
                  <div className="w-16 h-16 rounded-full bg-accent-gold/20 flex items-center justify-center mx-auto mb-6">
                    <item.icon className="w-8 h-8 text-accent-gold" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <div className="text-2xl md:text-3xl font-bold text-accent-gold mb-4">
                    {item.value}
                  </div>
                  <p className="text-white/70 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      {customTestimonials.length > 0 && (
        <section className="py-24 md:py-32 bg-secondary">
          <Container>
            <SectionHeader
              badge={["CLIENT", "STORIES"]}
              title="Built for Our Clients"
              subtitle="Hear from homeowners who trusted econstruct with their ground-up custom home."
            />

            <div className="max-w-2xl mx-auto">
              {customTestimonials.map((testimonial, i) => (
                <AnimatedSection key={testimonial.name} delay={i * 0.1}>
                  <div className="bg-white rounded-2xl p-8 border border-gray-100">
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
                    <blockquote className="text-body-text leading-relaxed mb-6 italic text-lg">
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
            badge={["CUSTOM", "HOME", "FAQ"]}
            title="Frequently Asked Questions"
            subtitle="Common questions about building a custom home in Los Angeles."
          />

          <div className="divide-y divide-gray-200 border-t border-gray-200">
            {customHomeFaqs.map((faq, i) => (
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
                Have specific questions about your lot or project?
              </p>
              <Button href="/contact" variant="secondary">
                Talk to Our Team
              </Button>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      <ConsultationCTA />
    </>
  );
}

