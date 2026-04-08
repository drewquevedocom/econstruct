import type { Metadata } from "next";
import {
  FileCheck,
  CalendarClock,
  Phone,
  ArrowRight,
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
  title: "For Public Adjusters — Partner with econstruct",
  description:
    "Partner with LA's fastest fire rebuild team. Your clients get priority scheduling, free scope validation reports, and a builder who makes your work look brilliant.",
  path: "/for-public-adjusters",
  noIndex: true,
});

const valueProps = [
  {
    icon: FileCheck,
    title: "Free Scope Validation Reports",
    description:
      "We review your client's claim and provide detailed construction scope reports at no cost. Accurate scopes mean faster settlements and happier clients.",
  },
  {
    icon: CalendarClock,
    title: "Priority Scheduling",
    description:
      "PA referrals jump to the front of our queue. Your clients break ground faster, which means faster claim resolution and stronger relationships.",
  },
  {
    icon: Phone,
    title: "Direct Communication",
    description:
      `${COMPANY.team.owner.name} works directly with you. No runaround, no junior PMs. One point of contact from scope review through certificate of occupancy.`,
  },
];

const steps = [
  {
    number: "01",
    title: "You Refer a Client",
    description:
      "Send us your client's information and claim details. We'll take it from there.",
  },
  {
    number: "02",
    title: "We Provide a Free Scope Validation",
    description:
      "Our team reviews the claim, walks the property, and delivers a detailed construction scope report.",
  },
  {
    number: "03",
    title: "We Build, You Look Great",
    description:
      "We handle construction with premium quality and clear communication. Your client is thrilled. You're the hero.",
  },
];

const stats = [
  { value: "3×", label: "Faster Permits", icon: Zap },
  { value: "$526M", label: "Pipeline Value", icon: DollarSign },
  { value: "25+", label: "Years Experience", icon: Clock },
  { value: "WUI", label: "Certified", icon: ShieldCheck },
];

export default function ForPublicAdjustersPage() {
  return (
    <>
      <PageHero
        title="We Make You Look Like a Hero"
        subtitle="Partner with LA's fastest fire rebuild team. Your clients get priority scheduling, and you get a builder who makes your scope validation look brilliant."
      />

      {/* Value Props */}
      <section className="py-24 md:py-32">
        <Container>
          <SectionHeader
            badge={["PA Partnership"]}
            title="Why Public Adjusters Choose econstruct"
            subtitle="We make your job easier and your clients happier. Here's how."
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

      {/* How It Works */}
      <section className="py-24 md:py-32 bg-[#F8F6F2]">
        <Container>
          <SectionHeader
            badge={["Process"]}
            title="How It Works"
            subtitle="Three simple steps from referral to completed rebuild."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <AnimatedSection key={step.number} delay={i * 0.1}>
                <div className="relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 h-full">
                  <span className="text-6xl font-bold text-accent-gold/15 absolute top-4 right-6">
                    {step.number}
                  </span>
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-brand-dark mb-3 mt-8">
                      {step.title}
                    </h3>
                    <p className="text-gray-500 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20">
                      <ArrowRight size={20} className="text-accent-gold" />
                    </div>
                  )}
                </div>
              </AnimatedSection>
            ))}
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

      {/* CTA: Become a Partner */}
      <section className="py-24 md:py-32">
        <Container>
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto">
              <SectionHeader
                badge={["Get Started"]}
                title="Become a Partner"
                subtitle="Join the growing network of public adjusters who trust econstruct to deliver for their clients. No contracts, no obligations — just results."
              />
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button href="/contact?source=public-adjuster" variant="primary" size="lg">
                  Partner With Us
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
