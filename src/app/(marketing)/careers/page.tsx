import type { Metadata } from "next";
import {
  Hammer,
  TrendingUp,
  Users,
  Banknote,
  MapPin,
  Clock,
  Mail,
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
  title: "Careers at eConstruct — Join Our Team",
  description:
    "Build your career with eConstruct Inc. We're hiring project managers, carpenters, estimators, and construction professionals across Los Angeles.",
  path: "/careers",
});

const cultureValues = [
  {
    icon: Hammer,
    title: "Craftsmanship Culture",
    description:
      "We take pride in every detail. If you care about doing things right — not just fast — you'll fit right in. Our work speaks for itself.",
  },
  {
    icon: TrendingUp,
    title: "Growth Opportunities",
    description:
      "With a $526M pipeline and growing, there's room to advance. We invest in our people with training, mentorship, and clear paths for career development.",
  },
  {
    icon: Users,
    title: "Team-First Environment",
    description:
      "Small team, big impact. Everyone knows each other by name. We collaborate, we communicate, and we have each other's backs on every project.",
  },
  {
    icon: Banknote,
    title: "Competitive Compensation",
    description:
      "Top-tier pay, health benefits, and performance bonuses. We pay for quality because we hire for quality.",
  },
];

const positions = [
  {
    title: "Project Manager",
    type: "Full-time",
    location: "Los Angeles, CA",
    description:
      "Oversee luxury residential projects from pre-construction through completion. Manage budgets, schedules, subcontractors, and client communication.",
  },
  {
    title: "Lead Carpenter",
    type: "Full-time",
    location: "Los Angeles, CA",
    description:
      "Lead framing, finish carpentry, and custom millwork on high-end residential builds. Must have experience with complex architectural details.",
  },
  {
    title: "Estimator",
    type: "Full-time",
    location: "Los Angeles, CA",
    description:
      "Prepare detailed cost estimates for custom homes, fire rebuilds, and modernization projects. Proficiency in plan reading and construction takeoffs required.",
  },
  {
    title: "Site Superintendent",
    type: "Full-time",
    location: "Los Angeles, CA",
    description:
      "Manage daily field operations, coordinate subcontractor scheduling, enforce safety standards, and ensure construction quality meets eConstruct standards.",
  },
];

export default function CareersPage() {
  return (
    <>
      <PageHero
        title="Build Your Career with eConstruct"
        subtitle="Join a team that builds Los Angeles' finest homes. We're looking for people who take pride in their craft."
        breadcrumbs={[{ label: "Careers" }]}
      />

      {/* Why Work With Us */}
      <section className="py-24 md:py-32">
        <Container>
          <SectionHeader
            badge={["Culture"]}
            title="Why Work With Us"
            subtitle="We build premium homes — and premium careers. Here's what sets eConstruct apart as an employer."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {cultureValues.map((value, i) => {
              const Icon = value.icon;
              return (
                <AnimatedSection key={value.title} delay={i * 0.1}>
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 h-full flex flex-col">
                    <div className="w-14 h-14 bg-accent-gold/10 rounded-2xl flex items-center justify-center mb-6">
                      <Icon size={28} className="text-accent-gold" />
                    </div>
                    <h3 className="text-xl font-bold text-brand-dark mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-500 leading-relaxed flex-1">
                      {value.description}
                    </p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Open Positions */}
      <section className="py-24 md:py-32 bg-[#F8F6F2]">
        <Container>
          <SectionHeader
            badge={["Open Positions"]}
            title="Join the Team"
            subtitle="We're always looking for talented craftsmen, project managers, and construction professionals."
          />

          <div className="flex flex-col gap-6">
            {positions.map((position, i) => (
              <AnimatedSection key={position.title} delay={i * 0.1}>
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-brand-dark mb-2">
                      {position.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock size={14} className="text-accent-gold" />
                        {position.type}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={14} className="text-accent-gold" />
                        {position.location}
                      </span>
                    </div>
                    <p className="text-gray-500 leading-relaxed">
                      {position.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Button
                      href={`mailto:careers@econstructinc.com?subject=Application: ${position.title}`}
                      variant="secondary"
                    >
                      Apply Now
                    </Button>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      {/* Application CTA */}
      <section className="py-24 md:py-32">
        <Container>
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-accent-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail size={28} className="text-accent-gold" />
              </div>
              <SectionHeader
                title="Interested in Joining eConstruct?"
                subtitle="Don't see your role listed? We're always open to hearing from talented construction professionals. Send your resume and tell us about yourself."
                className="mb-8"
              />
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  href="mailto:careers@econstructinc.com"
                  variant="primary"
                  size="lg"
                >
                  Send Your Resume
                </Button>
                <Button href="/contact" variant="secondary" size="lg">
                  Contact Us
                </Button>
              </div>
              <p className="text-gray-400 text-sm mt-6">
                careers@econstructinc.com
              </p>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      <ConsultationCTA />
    </>
  );
}
