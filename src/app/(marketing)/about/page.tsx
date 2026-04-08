import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Shield,
  Award,
  Building2,
  Leaf,
  Clock,
  HardHat,
  TrendingUp,
  DollarSign,
  FileCheck,
  Users,
} from "lucide-react";
import { generatePageMetadata } from "@/lib/metadata";
import {
  generateLocalBusinessSchema,
  generateBreadcrumbSchema,
} from "@/lib/schema";
import { COMPANY } from "@/lib/constants";
import { team } from "@/lib/data/team";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ConsultationCTA from "@/components/ConsultationCTA";

export const metadata: Metadata = generatePageMetadata({
  title: "About econstruct — 25+ Years Building Los Angeles",
  description:
    "Meet the team behind econstruct Inc. Led by Frank Neimroozi with 25+ years of experience, we've completed 340+ projects across Los Angeles. CA Lic #964015.",
  path: "/about",
});

const milestones = [
  {
    year: "1999",
    title: "econstruct Founded",
    description:
      "Frank Neimroozi establishes econstruct Inc. in Los Angeles, focused on premium residential construction.",
  },
  {
    year: "2005",
    title: "100th Project Completed",
    description:
      "Milestone reached with the completion of a landmark Bel Air custom home, solidifying reputation for luxury builds.",
  },
  {
    year: "2012",
    title: "Expanded to Full-Service",
    description:
      "Added design-build capabilities, ADU construction, and luxury modernization to the service portfolio.",
  },
  {
    year: "2018",
    title: "Fire Rebuild Specialists",
    description:
      "Led the rebuild effort for Woolsey Fire-affected homes in Malibu, developing deep expertise in WUI-compliant construction.",
  },
  {
    year: "2024",
    title: "340+ Projects & Counting",
    description:
      "Completed over 340 projects across Los Angeles with a 100% permit success rate and 5-star client satisfaction.",
  },
];

const credentials = [
  {
    icon: Shield,
    title: "CA License #964015",
    description: "Licensed General Contractor — State of California",
    link: COMPANY.license.verificationUrl,
  },
  {
    icon: Award,
    title: "BBB Accredited",
    description: "A+ rating with the Better Business Bureau",
  },
  {
    icon: Building2,
    title: "NAHB Member",
    description: "National Association of Home Builders",
  },
  {
    icon: Leaf,
    title: "USGBC Member",
    description: "U.S. Green Building Council — sustainable building practices",
  },
];

const stats = [
  { value: "340+", label: "Projects Completed", icon: HardHat },
  { value: "25+", label: "Years Experience", icon: Clock },
  { value: "$450-$800", label: "Per Sq Ft", icon: DollarSign },
  { value: "3x", label: "Faster Permits", icon: FileCheck },
];

export default function AboutPage() {
  const localBusinessSchema = generateLocalBusinessSchema();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://econstructinc.com" },
    { name: "About", url: "https://econstructinc.com/about" },
  ]);

  const frank = team[0];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <PageHero
        title="About econstruct"
        subtitle="25+ years of premium residential construction across Los Angeles. From fire rebuilds to luxury custom homes, we build with uncompromising quality."
        breadcrumbs={[{ label: "About" }]}
      />

      {/* Frank's Bio Section */}
      <section className="py-24 md:py-32">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <AnimatedSection>
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5] bg-gray-100">
                <Image
                  src={frank.image || "/about-image.png"}
                  alt={frank.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-brand-dark/80 to-transparent p-8">
                  <p className="text-white font-bold text-xl">{frank.name}</p>
                  <p className="text-white/70 text-sm">{frank.title}</p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="flex flex-col gap-6">
                <SectionHeader
                  badge={["Leadership"]}
                  title="Built on Expertise, Driven by Craft"
                  centered={false}
                  className="mb-0"
                />
                <p className="text-gray-600 text-lg leading-relaxed">
                  {frank.bio}
                </p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Frank&apos;s hands-on approach means he&apos;s personally
                  involved in every project from pre-construction planning
                  through final walkthrough. His deep relationships with the
                  city&apos;s best subcontractors, architects, and inspectors
                  ensure every econstruct project runs on time, on budget, and
                  above expectations.
                </p>
                <div className="flex flex-wrap gap-4 mt-2">
                  <Link
                    href={COMPANY.license.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-gold/10 text-accent-gold font-bold text-sm rounded-full hover:bg-accent-gold/20 transition-colors"
                  >
                    <Shield size={16} />
                    {COMPANY.license.display}
                  </Link>
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-600 font-bold text-sm rounded-full">
                    <Clock size={16} />
                    25+ Years Experience
                  </span>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </Container>
      </section>

      {/* Team Grid */}
      <section className="py-24 md:py-32 bg-[#F8F6F2]">
        <Container>
          <SectionHeader
            badge={["Our Team"]}
            title="The People Behind the Projects"
            subtitle="A focused leadership team that treats every home as if it were our own."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <AnimatedSection key={member.name} delay={i * 0.1}>
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 h-full flex flex-col">
                  <div className="w-16 h-16 bg-accent-gold/10 rounded-2xl flex items-center justify-center mb-6">
                    <Users size={28} className="text-accent-gold" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-dark">
                    {member.name}
                  </h3>
                  <p className="text-accent-gold font-medium text-sm mt-1 mb-4">
                    {member.title}
                  </p>
                  <p className="text-gray-500 leading-relaxed flex-1">
                    {member.bio}
                  </p>
                  {member.email && (
                    <Link
                      href={`mailto:${member.email}`}
                      className="mt-6 text-sm font-bold text-brand-dark hover:text-accent-gold transition-colors"
                    >
                      {member.email}
                    </Link>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      {/* Company Timeline */}
      <section className="py-24 md:py-32">
        <Container size="narrow">
          <SectionHeader
            badge={["Our Journey"]}
            title="25+ Years of Building Excellence"
            subtitle="Key milestones that shaped econstruct into Los Angeles' premier residential contractor."
          />

          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gray-200 -translate-x-1/2" />

            <div className="flex flex-col gap-12">
              {milestones.map((milestone, i) => (
                <AnimatedSection key={milestone.year} delay={i * 0.1}>
                  <div
                    className={`relative flex flex-col md:flex-row items-start gap-6 md:gap-12 ${
                      i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Dot */}
                    <div className="absolute left-6 md:left-1/2 w-4 h-4 bg-accent-gold rounded-full -translate-x-1/2 mt-1 ring-4 ring-white z-10" />

                    {/* Content */}
                    <div
                      className={`ml-14 md:ml-0 md:w-[calc(50%-3rem)] ${
                        i % 2 === 0 ? "md:text-right" : "md:text-left"
                      }`}
                    >
                      <span className="text-accent-gold font-bold text-lg">
                        {milestone.year}
                      </span>
                      <h3 className="text-xl font-bold text-brand-dark mt-1">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-500 mt-2 leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>

                    {/* Spacer for alternating layout */}
                    <div className="hidden md:block md:w-[calc(50%-3rem)]" />
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Credentials & Awards */}
      <section className="py-24 md:py-32 bg-[#F8F6F2]">
        <Container>
          <SectionHeader
            badge={["Credentials"]}
            title="Licensed, Accredited, Trusted"
            subtitle="Our credentials reflect our commitment to the highest standards in the industry."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {credentials.map((cred, i) => {
              const Icon = cred.icon;
              const Wrapper = cred.link ? "a" : "div";
              const wrapperProps = cred.link
                ? {
                    href: cred.link,
                    target: "_blank" as const,
                    rel: "noopener noreferrer",
                  }
                : {};

              return (
                <AnimatedSection key={cred.title} delay={i * 0.1}>
                  <Wrapper
                    {...wrapperProps}
                    className={`bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm h-full flex flex-col items-center ${
                      cred.link ? "hover:shadow-md transition-shadow" : ""
                    }`}
                  >
                    <div className="w-16 h-16 bg-accent-gold/10 rounded-2xl flex items-center justify-center mb-5">
                      <Icon size={28} className="text-accent-gold" />
                    </div>
                    <h3 className="text-lg font-bold text-brand-dark mb-2">
                      {cred.title}
                    </h3>
                    <p className="text-sm text-gray-500">{cred.description}</p>
                  </Wrapper>
                </AnimatedSection>
              );
            })}
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

      <ConsultationCTA />
    </>
  );
}
