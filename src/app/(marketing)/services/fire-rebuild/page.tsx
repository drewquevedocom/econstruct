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
import { COMPANY } from "@/lib/constants";
import PageHero from "@/components/ui/PageHero";
import SectionHeader from "@/components/ui/SectionHeader";
import Container from "@/components/ui/Container";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import AccordionItem from "@/components/ui/AccordionItem";
import ConsultationCTA from "@/components/ConsultationCTA";
import Image from "next/image";
import {
  Flame,
  Shield,
  Clock,
  FileCheck,
  Banknote,
  TreePine,
  Zap,
  Home,
  Users,
  CheckCircle,
  Phone,
  Star,
  AlertTriangle,
  TrendingUp,
  HardHat,
  ClipboardCheck,
} from "lucide-react";

const service = services.find((s) => s.slug === "fire-rebuild")!;
const fireRebuildFaqs = faqs.filter(
  (f) => f.category === "fire-rebuild" || f.category === "general"
);
const fireTestimonials = testimonials.filter(
  (t) => t.projectType === "fire-rebuild"
);

export const metadata: Metadata = generatePageMetadata({
  title: "Fire Rebuild Contractor Los Angeles | WUI-Compliant Construction",
  description:
    "Expert fire rebuild contractor in Los Angeles. WUI-compliant construction, insurance coordination, expedited permitting. Serving Palisades, Altadena & Malibu. 25+ years experience.",
  path: "/services/fire-rebuild",
  image: "/fire_rebuild_service.png",
});

const features = [
  {
    icon: Shield,
    title: "WUI-Compliant Construction",
    description:
      "Every rebuild meets or exceeds Wildland-Urban Interface fire safety codes — ember-resistant vents, non-combustible roofing, tempered glass, and fire-rated assemblies.",
  },
  {
    icon: Banknote,
    title: "Insurance Gap Analysis",
    description:
      "Most settlements fall short of actual rebuild costs. We identify gaps before construction begins and provide documentation to support supplemental claims.",
  },
  {
    icon: Clock,
    title: "Expedited Permitting (3x Faster)",
    description:
      "Our established relationships with LA County and city planning departments allow us to navigate permitting 3 times faster than industry average.",
  },
  {
    icon: FileCheck,
    title: "Full Architectural Design",
    description:
      "In-house design coordination with top LA architects. Rebuild to your original footprint or take the opportunity to reimagine your home entirely.",
  },
  {
    icon: TreePine,
    title: "Defensible Space Landscaping",
    description:
      "Zone-compliant landscaping designed to protect your home while maintaining beauty — fire-resistant native plants, hardscaping, and proper vegetation management.",
  },
  {
    icon: Zap,
    title: "Smart Home Integration",
    description:
      "Rebuild smarter with integrated home automation — automated fire detection, smart irrigation for defensible space, whole-home generators, and EV-ready garages.",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Emergency Assessment",
    description:
      "Within 48 hours of your call, we assess the site, evaluate foundation integrity, and document existing conditions for insurance purposes.",
    icon: Phone,
  },
  {
    step: "02",
    title: "Insurance Coordination",
    description:
      "We conduct a full gap analysis of your settlement, prepare scope validation reports, and coordinate directly with your adjuster to maximize coverage.",
    icon: FileCheck,
  },
  {
    step: "03",
    title: "Design & Engineering",
    description:
      "Architectural plans, structural engineering, and WUI compliance documentation. Rebuild as-was or redesign — your choice, our expertise.",
    icon: ClipboardCheck,
  },
  {
    step: "04",
    title: "Expedited Permitting",
    description:
      "Leveraging our city relationships and fire rebuild priority programs to secure permits 3x faster than standard timelines.",
    icon: Zap,
  },
  {
    step: "05",
    title: "Construction",
    description:
      "Expert construction with weekly progress reports, dedicated project manager, and Frank Neimroozi's personal oversight on every project.",
    icon: HardHat,
  },
  {
    step: "06",
    title: "Final Walkthrough & Warranty",
    description:
      "Comprehensive walkthrough, punch list completion, and full warranty documentation. We don't consider it done until you're home.",
    icon: Home,
  },
];

export default function FireRebuildPage() {
  const serviceSchema = generateServiceSchema(service);
  const faqSchema = generateFAQSchema(fireRebuildFaqs);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://econstructinc.com" },
    { name: "Services", url: "https://econstructinc.com/services" },
    {
      name: "Fire Rebuild",
      url: "https://econstructinc.com/services/fire-rebuild",
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
        title="Los Angeles Fire Rebuild Experts"
        subtitle="WUI-compliant reconstruction for Palisades, Altadena, and Malibu homeowners. Insurance coordination, expedited permits, and expert craftsmanship — we bring you home."
        breadcrumbs={[
          { label: "Services", href: "/services" },
          { label: "Fire Rebuild" },
        ]}
        backgroundImage="/fire_rebuild_service.png"
      />

      {/* Trust Signals Strip */}
      <section className="bg-brand-dark py-8 border-t border-white/10">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "25+", label: "Years Experience" },
              { value: "340+", label: "Projects Completed" },
              { value: "3x", label: "Faster Permitting" },
              { value: `Lic #${COMPANY.license.number}`, label: "CA Licensed & Insured" },
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

      {/* Why Choose eConstruct */}
      <section className="py-24 md:py-32">
        <Container>
          <SectionHeader
            badge={["WHY", "ECONSTRUCT"]}
            title="Built to Rebuild"
            subtitle="When fire takes your home, you need a contractor who understands the unique challenges of fire reconstruction — from WUI codes to insurance gaps."
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

      {/* Process Timeline */}
      <section className="py-24 md:py-32 bg-secondary">
        <Container>
          <SectionHeader
            badge={["FIRE", "REBUILD", "PROCESS"]}
            title="From Ashes to Home"
            subtitle="A proven 6-step process specifically designed for fire rebuild projects. Transparent, efficient, and compassionate."
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

      {/* WUI Compliance Section */}
      <section className="py-24 md:py-32">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <div>
                <div className="border border-brand-dark/20 uppercase tracking-widest text-[10px] font-bold px-4 py-1.5 rounded-full text-brand-dark w-fit mb-6 flex gap-2 items-center">
                  <span>WUI</span>
                  <span className="text-accent-gold">&bull;</span>
                  <span>COMPLIANCE</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-brand-dark tracking-tight mb-6">
                  WUI Zone Construction Specialists
                </h2>
                <p className="text-lg text-body-text mb-8 leading-relaxed">
                  Rebuilding in a Wildland-Urban Interface zone requires
                  specialized knowledge. California&apos;s Chapter 7A building
                  codes mandate fire-resistant construction methods that most
                  general contractors aren&apos;t equipped to handle.
                </p>
                <div className="space-y-4">
                  {[
                    "Class A fire-rated roofing assemblies",
                    "Ember-resistant eave & soffit vents (meets ASTM E2886)",
                    "Tempered or multi-pane glazing on all exterior windows",
                    "Non-combustible exterior wall assemblies",
                    "Fire-rated decking and fencing within 5 feet of structure",
                    "Defensible space zones (0-5ft, 5-30ft, 30-100ft)",
                    "Underground utility connections where required",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-accent-gold shrink-0 mt-0.5" />
                      <span className="text-body-text">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                <Image
                  src="/fire_rebuild_service.png"
                  alt="WUI-compliant fire rebuild construction in Los Angeles"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 to-transparent" />
              </div>
            </AnimatedSection>
          </div>
        </Container>
      </section>

      {/* Insurance Gap Section */}
      <section className="py-24 md:py-32 bg-brand-dark">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <div>
                <div className="border border-white/20 uppercase tracking-widest text-[10px] font-bold px-4 py-1.5 rounded-full text-white w-fit mb-6 flex gap-2 items-center">
                  <span>INSURANCE</span>
                  <span className="text-accent-gold">&bull;</span>
                  <span>REALITY</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
                  Your Insurance Settlement Probably Isn&apos;t Enough
                </h2>
                <p className="text-lg text-white/80 mb-8 leading-relaxed">
                  This is the hard truth most fire rebuild homeowners face.
                  Construction costs have surged, and new WUI compliance
                  requirements add significant expense that most policies
                  don&apos;t cover. We help you understand the real numbers
                  before you sign a contract.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <div className="space-y-6">
                {[
                  {
                    icon: AlertTriangle,
                    title: "The Coverage Gap",
                    description:
                      "Most fire insurance policies were written before current WUI codes. The gap between your settlement and actual rebuild cost can be $200K-$500K+.",
                  },
                  {
                    icon: FileCheck,
                    title: "Our Gap Analysis",
                    description:
                      "We provide a detailed, line-item cost breakdown comparing your settlement to actual construction costs — before you commit to a builder.",
                  },
                  {
                    icon: Banknote,
                    title: "Supplemental Claims Support",
                    description:
                      "Our scope validation reports have helped homeowners recover additional funds from insurers. We document everything to support your claim.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                  >
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-lg bg-accent-gold/20 flex items-center justify-center shrink-0">
                        <item.icon className="w-6 h-6 text-accent-gold" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-2">
                          {item.title}
                        </h3>
                        <p className="text-white/70 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection delay={0.3}>
            <div className="mt-16 text-center">
              <Button href="/contact" variant="primary" size="lg">
                Get a Free Insurance Gap Analysis
              </Button>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* Market Context / Stats */}
      <section className="py-24 md:py-32">
        <Container>
          <SectionHeader
            badge={["LA", "FIRE", "REBUILD", "LANDSCAPE"]}
            title="The Reality of Rebuilding in LA"
            subtitle="Understanding the market context helps you make informed decisions about your fire rebuild."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                stat: "$450-$800+",
                label: "Per Sq Ft",
                description:
                  "Current fire rebuild costs in LA County, depending on scope, finishes, and WUI requirements.",
              },
              {
                icon: Clock,
                stat: "12-18 Months",
                label: "Typical Timeline",
                description:
                  "From permitting to completion. eConstruct's expedited process can save 3-4 months vs. industry average.",
              },
              {
                icon: Users,
                stat: "340+",
                label: "Projects Delivered",
                description:
                  "Across all project types in Los Angeles. Our fire rebuild experience is second to none.",
              },
            ].map((item, i) => (
              <AnimatedSection key={item.label} delay={i * 0.1}>
                <div className="text-center p-8 rounded-2xl bg-secondary border border-gray-100">
                  <div className="w-16 h-16 rounded-full bg-accent-gold/10 flex items-center justify-center mx-auto mb-6">
                    <item.icon className="w-8 h-8 text-accent-gold" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-brand-dark mb-1">
                    {item.stat}
                  </div>
                  <div className="text-sm font-bold text-accent-gold uppercase tracking-wider mb-4">
                    {item.label}
                  </div>
                  <p className="text-body-text">{item.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      {fireTestimonials.length > 0 && (
        <section className="py-24 md:py-32 bg-secondary">
          <Container>
            <SectionHeader
              badge={["CLIENT", "STORIES"]}
              title="Homeowners We've Helped Rebuild"
              subtitle="Real stories from families who trusted eConstruct to bring them home after devastating fires."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {fireTestimonials.map((testimonial, i) => (
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
            badge={["FIRE", "REBUILD", "FAQ"]}
            title="Frequently Asked Questions"
            subtitle="Answers to the most common questions about fire rebuilds in Los Angeles."
          />

          <div className="divide-y divide-gray-200 border-t border-gray-200">
            {fireRebuildFaqs.map((faq, i) => (
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
                Have a question not answered here?
              </p>
              <Button href="/contact" variant="secondary">
                Contact Our Team
              </Button>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      <ConsultationCTA />
    </>
  );
}
