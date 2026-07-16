import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Thermometer,
  Utensils,
  Truck,
  Factory,
  Building2,
  Package,
  CheckCircle,
  Phone,
} from "lucide-react";
import { generatePageMetadata } from "@/lib/metadata";
import { COMPANY } from "@/lib/constants";
import Container from "@/components/ui/Container";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";

export const metadata: Metadata = generatePageMetadata({
  title: "Food Distribution & Commercial Kitchen Contractor | Los Angeles | econstruct",
  description:
    "econstruct builds, renovates, and upgrades food distribution centers, cold storage warehouses, ghost kitchens, and commissary facilities throughout Southern California.",
  path: "/food-distribution-construction",
});

const specializations = [
  {
    icon: Building2,
    title: "Food Distribution Centers",
    body: "Dock improvements, office TI, fire suppression, MEP upgrades — built to keep your operation moving.",
    href: "/food-distribution-construction/distribution-centers",
  },
  {
    icon: Thermometer,
    title: "Cold Storage & Refrigerated Warehouses",
    body: "Code-compliant cold chain facilities — built fast, built right, built to stay at temperature.",
    href: "/food-distribution-construction/cold-storage",
  },
  {
    icon: Utensils,
    title: "Commissary Kitchens",
    body: "Ground-up builds to occupied renovations — health department ready from day one.",
    href: "/food-distribution-construction/commissary-kitchens",
  },
  {
    icon: Factory,
    title: "Ghost Kitchens",
    body: "Multi-tenant kitchen build-outs — fast-track delivery, high-volume MEP, operational from opening day.",
    href: "/food-distribution-construction/ghost-kitchens",
  },
  {
    icon: Package,
    title: "Food Manufacturing & Processing",
    body: "Production line TI to full-facility builds — food-grade, code-compliant, operational on schedule.",
    href: "/food-distribution-construction/food-manufacturing",
  },
  {
    icon: Truck,
    title: "Last-Mile Logistics & Fulfillment",
    body: "Dock configuration, office TI, electrical upgrades — built around your operational flow.",
    href: "/food-distribution-construction/logistics-fulfillment",
  },
];

const whyPoints = [
  {
    title: "Health Department Permitting",
    body: "LA County Department of Public Health requirements are built into the construction schedule from day one — not filed after the build and hoped for. We coordinate pre-opening inspections, plan check submissions, and correction responses as part of the critical path.",
  },
  {
    title: "Operational Continuity Planning",
    body: "We phase construction around your production schedule. Utility shutdowns are sequenced with minimum operational impact, temporary service paths are planned in advance, and equipment disconnects are coordinated with your facilities team — not improvised in the field.",
  },
  {
    title: "Cold Chain Integrity",
    body: "Refrigeration system upgrades in active cold storage facilities require precise sequencing so product never leaves its required temperature range. We've done it. We know what a misstep costs an operation.",
  },
  {
    title: "Food-Grade Compliance From Day One",
    body: "HACCP-compliant finishes, NSF/ANSI surfaces, and food-safe drainage systems are specified in the scope documents — not added as corrections after the health inspector walks the space.",
  },
];

const capabilities = [
  "Tenant Improvements",
  "Design-Build",
  "Fast-Track Construction",
  "MEP Infrastructure Upgrades",
  "Refrigeration & Cold Chain Support",
  "Commercial Kitchen Construction",
  "Health Dept. & Code Compliance",
  "ADA Upgrades",
  "Permit Expediting",
];

const personas = [
  "Directors of Real Estate",
  "Facilities Managers",
  "Construction Managers",
  "Development Managers",
  "Operations Executives",
];

const galleryImages = [
  {
    src: "/projects/Tan_mansion_with_glowing_lights_202606192224.jpeg",
    alt: "Mulholland Dr — twilight estate exterior",
  },
  {
    src: "/projects/Backyard_infinity_pool_reflecting_202606192224.jpeg",
    alt: "Mulholland Dr — infinity pool at dusk",
  },
  {
    src: "/projects/Primary_bedroom_suite_mansion_with_202606192224.jpeg",
    alt: "Mulholland Dr — master suite",
  },
  {
    src: "/projects/Chefs_kitchen_Mediterranean_style_202606192224.jpeg",
    alt: "Mulholland Dr — Mediterranean chef's kitchen",
  },
  {
    src: "/projects/hutchinson11.jpg",
    alt: "Hutchinson Cocktails & Grill — La Cienega, Los Angeles",
  },
  {
    src: "/projects/Tan_estate_with_tiled_roof_202606192224.jpeg",
    alt: "Mulholland Dr — aerial estate view",
  },
  {
    src: "/projects/01_Starbucks.jpg",
    alt: "SBUX Lancaster — ground-up construction",
  },
];

export default function FoodDistributionPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-[#07090c] py-20 md:py-32">
        <Container>
          <p className="text-xs font-bold text-accent-gold uppercase tracking-[0.22em] mb-4">
            Food &amp; Distribution Construction
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight mb-6 max-w-3xl">
            Built for Food. Built to Code. Built Fast.
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
            econstruct delivers construction, tenant improvements, and facility upgrades for food
            distribution, cold storage, commissary, and ghost kitchen operations across Southern
            California.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button href="/contact" variant="primary" size="lg">
              Request a Site Walk
            </Button>
            <a
              href={`tel:${COMPANY.phone.primary}`}
              className="inline-flex items-center gap-2 text-white font-semibold text-base border border-white/30 rounded-lg px-6 py-3 hover:border-white/60 transition-colors"
            >
              <Phone size={18} />
              {COMPANY.phone.display}
            </a>
          </div>
        </Container>
      </section>

      {/* Specializations */}
      <section className="py-24 md:py-32 bg-[#F8F6F2]">
        <Container>
          <AnimatedSection>
            <p className="text-xs font-bold text-accent-gold uppercase tracking-[0.22em] mb-3">
              Our Specializations
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark tracking-tight mb-14">
              Six disciplines. One accountable team.
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specializations.map((spec, i) => {
              const Icon = spec.icon;
              return (
                <AnimatedSection key={spec.title} delay={i * 0.05}>
                  <Link
                    href={spec.href}
                    className="group block bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md hover:border-accent-gold/30 transition-all h-full"
                  >
                    <div className="w-12 h-12 bg-accent-gold/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-accent-gold/20 transition-colors">
                      <Icon size={22} className="text-accent-gold" />
                    </div>
                    <h3 className="text-lg font-bold text-brand-dark mb-2 group-hover:text-accent-gold transition-colors">
                      {spec.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">{spec.body}</p>
                    <span className="text-xs font-bold text-accent-gold uppercase tracking-wider">
                      Learn More →
                    </span>
                  </Link>
                </AnimatedSection>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Why This Work Is Different */}
      <section className="py-24 md:py-32">
        <Container size="narrow">
          <AnimatedSection>
            <p className="text-xs font-bold text-accent-gold uppercase tracking-[0.22em] mb-3">
              Why This Work Is Different
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark tracking-tight mb-8">
              We Don&apos;t Just Build Food Facilities.&nbsp; We Understand How They Run.
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Food facility construction is not the same as standard commercial TI. Every element of
              the construction schedule — phasing, utility shutdowns, equipment disconnects, temporary
              service paths — has to be designed around the client&apos;s operational calendar, not
              just the build sequence.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              LA County Health Department inspections don&apos;t pause for construction. Cold chain
              integrity has to be maintained even when refrigeration systems are being upgraded. When
              a commissary supplies 40 restaurant locations, there is no acceptable downtime window —
              which means the GC has to phase work at a level of precision that most contractors
              simply aren&apos;t built for.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-14">
              econstruct coordinates health department permitting, fire suppression compliance, utility
              shutdown sequences, and phased construction schedules as one integrated program — so the
              facility keeps running while we build around it. That capability is what separates a
              food facility specialist from a general contractor who has done a few kitchen jobs.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {whyPoints.map((point, i) => (
              <AnimatedSection key={point.title} delay={i * 0.08}>
                <div className="bg-[#F8F6F2] rounded-2xl p-8 h-full">
                  <h3 className="text-lg font-bold text-brand-dark mb-3">{point.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{point.body}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      {/* Key Capabilities */}
      <section className="py-24 md:py-32 bg-brand-dark">
        <Container>
          <AnimatedSection>
            <p className="text-xs font-bold text-accent-gold uppercase tracking-[0.22em] mb-3">
              Key Capabilities
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-10">
              Everything a food facility project requires. In-house.
            </h2>
            <div className="flex flex-wrap gap-3">
              {capabilities.map((cap) => (
                <span
                  key={cap}
                  className="bg-white/10 text-white text-sm font-medium px-4 py-2 rounded-full border border-white/20"
                >
                  {cap}
                </span>
              ))}
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* Who We Work With */}
      <section className="py-24 md:py-32">
        <Container size="narrow">
          <AnimatedSection>
            <p className="text-xs font-bold text-accent-gold uppercase tracking-[0.22em] mb-3">
              Who We Work With
            </p>
            <h3 className="text-2xl font-bold text-brand-dark mb-8">
              Decision makers we speak directly to
            </h3>
            <ul className="flex flex-col gap-3">
              {personas.map((p) => (
                <li key={p} className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-accent-gold shrink-0" />
                  <span className="text-gray-700 font-medium">{p}</span>
                </li>
              ))}
            </ul>
          </AnimatedSection>
        </Container>
      </section>

      {/* Get Started CTA Grid */}
      <section className="py-24 md:py-32 bg-[#F8F6F2]">
        <Container size="narrow">
          <AnimatedSection>
            <p className="text-xs font-bold text-accent-gold uppercase tracking-[0.22em] mb-3">
              Get Started
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark tracking-tight mb-10">
              Ready to talk about your facility?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button href="/free-consultation" variant="primary" size="lg">
                Schedule a Consultation
              </Button>
              <Button href="/contact" variant="secondary" size="lg">
                Request Budget Pricing
              </Button>
              <Button href="/contact" variant="primary" size="lg">
                Request a Site Walk
              </Button>
              <Button href="/contact" variant="secondary" size="lg">
                Emergency Facility Improvements
              </Button>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* Gallery */}
      <section className="py-24 md:py-32 overflow-hidden">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.slice(0, 4).map((img) => (
              <div key={img.src} className="relative aspect-square rounded-2xl overflow-hidden">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {galleryImages.slice(4).map((img) => (
              <div key={img.src} className="relative aspect-video rounded-2xl overflow-hidden">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 md:py-32 bg-brand-dark">
        <Container size="narrow">
          <AnimatedSection>
            <div className="text-center">
              <p className="text-xs font-bold text-accent-gold uppercase tracking-[0.22em] mb-4">
                Food Facility Construction
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
                Ready to Talk
                <br />
                About Your Facility?
              </h2>
              <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
                Tell us the scope, the timeline,