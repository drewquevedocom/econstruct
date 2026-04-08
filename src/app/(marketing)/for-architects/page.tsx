import type { Metadata } from "next";
import Image from "next/image";
import {
  Palette,
  SearchCheck,
  Flame,
  Zap,
  DollarSign,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { generatePageMetadata } from "@/lib/metadata";
import { COMPANY } from "@/lib/constants";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import ConsultationCTA from "@/components/ConsultationCTA";

export const metadata: Metadata = generatePageMetadata({
  title: "For Architects — Partner with econstruct",
  description:
    "We don't cut corners on your plans. econstruct delivers architectural intent with premium craftsmanship and WUI compliance across Los Angeles.",
  path: "/for-architects",
  noIndex: true,
});

const valueProps = [
  {
    icon: Palette,
    title: "Design-Preserve Pricing",
    description:
      "Your design stays intact. We price around your vision, not the other way around. No value-engineering that strips your project of its character.",
  },
  {
    icon: SearchCheck,
    title: "Constructability Reviews",
    description:
      "Free pre-construction review catches issues before they become change orders. We flag potential conflicts early so your design stays on track and on budget.",
  },
  {
    icon: Flame,
    title: "WUI Consultation",
    description:
      "Our WUI expertise ensures your hillside and fire zone designs meet code from day one. We know the materials, assemblies, and detailing that pass inspection.",
  },
];

const stats = [
  { value: "3×", label: "Faster Permits", icon: Zap },
  { value: "$526M", label: "Pipeline Value", icon: DollarSign },
  { value: "25+", label: "Years Experience", icon: Clock },
  { value: "WUI", label: "Certified", icon: ShieldCheck },
];

export default function ForArchitectsPage() {
  return (
    <>
      <PageHero
        title="Your Design Vision. Fully Realized."
        subtitle="We don't cut corners on your plans. econstruct delivers architectural intent with premium craftsmanship and WUI compliance."
      />

      {/* Value Props */}
      <section className="py-24 md:py-32">
        <Container>
          <SectionHeader
            badge={["Architect Partnership"]}
            title="Why Architects Choose econstruct"
            subtitle="We build what you design — faithfully, precisely, and to the highest standard."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {valueProps.map((prop, i) => {
              const Icon = prop.icon;
              return (
                <AnimatedSection key={prop.title} delay={i * 0.1}>
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 h-full flex flex-col">
                    <div className="w-14 h-14 bg-accent-gold/10 rounded-2xl flex items-center justify-center mb-6">
                      <Icon size={28} className="text-accent-gold" />
                    </div>
                    <h3 className="text-xl font-bold text-brand-dark mb-3">
                      {prop.title}
                    </h3>
                    <p className="text-gray-500 leading-relaxed flex-1">
                      {prop.description}
                    </p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Portfolio Highlight */}
      <section className="py-24 md:py-32 bg-[#F8F6F2]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <AnimatedSection>
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-gray-200">
                <Image
                  src="/projects/architectural-fidelity.jpg"
                  alt="econstruct architectural fidelity — design intent preserved in construction"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="flex flex-col gap-6">
                <SectionHeader
                  badge={["Architectural Fidelity"]}
                  title="Your Plans, Built Exactly"
                  centered={false}
                  className="mb-0"
                />
                <p className="text-gray-600 text-lg leading-relaxed">
                  Too many builders treat architectural drawings as suggestions.
                  We treat them as instructions. Every detail in your plans —
                  from custom reveals to material transitions — is executed with
                  precision craftsmanship.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Our field supervisors read plans the way you intend them to be
                  read. When questions arise, we call you before we improvise.
                  The result: buildings that look and feel exactly like you
                  designed them.
                </p>
                <div className="flex flex-wrap gap-3 mt-2">
                  {["Custom Millwork", "Specialty Finishes", "WUI Assemblies", "Complex Geometries"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-4 py-2 bg-accent-gold/10 text-accent-gold font-bold text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </Container>
      </section>

      {/* Stats Strip */}
      <section className="py-24 md:py-32 bg-brand-dark">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <AnimatedSection key={stat.label} delay={i * 0.1}>
                  <div className="text-center">
                    <div className="w-14 h-14 bg-accent-gold/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon size={24} className="text-accent-gold" />
                    </div>
                    <p className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                      {stat.value}
                    </p>
                    <p className="text-white/60 font-medium mt-2 text-sm uppercase tracking-wide">
                      {stat.label}
                    </p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </Container>
      </section>

      {/* CTA: Partner with econstruct */}
      <section className="py-24 md:py-32">
        <Container>
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto">
              <SectionHeader
                badge={["Get Started"]}
                title="Partner with econstruct"
                subtitle="We're always looking to collaborate with architects who share our commitment to quality. Let's build something remarkable together."
              />
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button href="/contact?source=architect" variant="primary" size="lg">
                  Start a Conversation
                </Button>
                <Button href={`tel:${COMPANY.phone.primary.replace(/-/g, "")}`} variant="secondary" size="lg">
                  Call {COMPANY.phone.display}
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      <ConsultationCTA />
    </>
  );
}
