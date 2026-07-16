import type { Metadata } from "next";
import {
  Globe,
  Video,
  FileCheck,
  Clock,
  Users,
  CheckCircle,
  MapPin,
  Star,
  Phone,
  Briefcase,
  BarChart3,
} from "lucide-react";
import { generatePageMetadata } from "@/lib/metadata";
import {
  generateLocalBusinessSchema,
  generateWebPageSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from "@/lib/schema";
import { COMPANY, SITE_URL } from "@/lib/constants";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import AccordionItem from "@/components/ui/AccordionItem";
import ConsultationCTA from "@/components/ConsultationCTA";

export const metadata: Metadata = generatePageMetadata({
  title: "International Luxury Home Builder Los Angeles | econstruct",
  description:
    "International clients trust econstruct with their Los Angeles luxury estate projects — from $5M renovations to $50M+ ground-up builds. Dedicated coordinator, real-time reporting, and direct access to senior leadership — regardless of your time zone.",
  path: "/international-luxury-clients",
});

const capabilities = [
  {
    icon: Globe,
    title: "Coordinated Across Time Zones",
    description:
      "Your dedicated project coordinator is available across US and international business hours. Scheduled video calls, written reports, and milestone photo documentation mean you are never out of the loop — from permit submission to final walk-through.",
  },
  {
    icon: FileCheck,
    title: "Estate Construction at Any Scale",
    description:
      "From full-home renovations to ground-up custom estates in the $10M–$50M+ range, econstruct manages every stage under one contract. International wire-friendly agreements, transparent cost tracking, and written change order approval — nothing moves without your sign-off.",
  },
  {
    icon: MapPin,
    title: "Global Material Sourcing",
    description:
      "The finest materials are not always found locally. econstruct sources Italian and Turkish marble, European custom cabinetry, specialty stone, and custom metalwork from international suppliers — procuring whatever the design requires, wherever it exists in the world.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Progress Reporting",
    description:
      "Weekly photo and video updates sent directly to your inbox. Budget-vs-actual tracking with annotated line items. You see exactly what was built, when, and what it cost — without setting foot on the site.",
  },
  {
    icon: Briefcase,
    title: "The Finest Craftspeople in Los Angeles",
    description:
      "econstruct works exclusively with the most skilled tradespeople in Los Angeles — master stone setters, custom cabinet builders, specialty finish carpenters, and artisans whose work appears in the city's most distinguished homes. We select for craft, not convenience.",
  },
  {
    icon: Users,
    title: "Single Point of Contact",
    description:
      "One dedicated econstruct coordinator owns your entire relationship. No chasing multiple contractors, no translation overhead. One number. One email. Full accountability.",
  },
];

const processSteps = [
  {
    step: "01",
    icon: Video,
    title: "Confidential Consultation",
    description:
      "A private video call with our principal or a senior project lead to understand your property, goals, and timeline. We discuss scope, estimated investment range, and what full-service remote management looks like for your specific project.",
  },
  {
    step: "02",
    icon: FileCheck,
    title: "Proposal & Contract",
    description:
      "Detailed written proposal with scope, schedule, and transparent pricing. International wire instructions provided. Contracts are structured to protect you under California law. Nothing begins without your written authorization.",
  },
  {
    step: "03",
    icon: MapPin,
    title: "Permitting & Mobilization",
    description:
      "Your dedicated coordinator manages all permit submissions with LADBS, LA County, and any applicable fire authority. You receive copies of every submission and approval. Pre-construction site photos and condition documentation are provided.",
  },
  {
    step: "04",
    icon: BarChart3,
    title: "Construction with Weekly Reporting",
    description:
      "Construction proceeds under our principal's direct oversight. Weekly progress reports with photos, schedule updates, and budget tracking are sent each Friday. You approve any change orders before work proceeds — no exceptions.",
  },
  {
    step: "05",
    icon: CheckCircle,
    title: "Final Walk-Through & Delivery",
    description:
      "We conduct a comprehensive final inspection and punch list completion. Video walk-through of the completed project sent to you before any final payment. Full warranty documentation and as-built records provided for your records.",
  },
];

const useCases = [
  {
    title: "Primary Residence — Renovation or Ground-Up Estate Build",
    description:
      "Purchased a property in Beverly Hills, Bel Air, or Pacific Palisades — or building a ground-up estate from a vacant lot? econstruct manages the entire project while you remain abroad, delivering a turnkey home built to the standard you expect.",
  },
  {
    title: "Investment Property Build-Out",
    description:
      "Developing a luxury rental or investment property in Los Angeles? We handle design coordination, permitting, construction, and final staging coordination — delivering a market-ready property without requiring your presence.",
  },
  {
    title: "Fire Rebuild After Total Loss",
    description:
      "Many international clients own LA properties that were affected by recent wildfires. econstruct manages the entire insurance coordination, WUI-compliant rebuild, and delivery process for owners living overseas.",
  },
];

const faqs = [
  {
    question: "How do international clients typically communicate with the project team?",
    answer:
      "Your dedicated econstruct coordinator is your single point of contact. We schedule weekly video calls at times that work across your time zone, send written weekly progress reports with photos every Friday, and are available by email or WhatsApp for urgent questions. Our leadership team personally reviews all international client projects at key milestones.",
  },
  {
    question: "How are contracts and payments structured for international clients?",
    answer:
      "Contracts are written in English under California law and can be signed electronically. Payment schedules are structured around construction milestones rather than calendar dates, and we accommodate international wire transfers. We provide a detailed wire instruction document and reconcile each payment against the approved budget in writing.",
  },
  {
    question: "Do I need to visit Los Angeles during construction?",
    answer:
      "No. Many of our international clients never visit the site during active construction. We manage every stage on your behalf and provide a detailed video walk-through at completion before any final payment is released. If you wish to visit at any milestone, we welcome it — but it is never required.",
  },
  {
    question: "Which neighborhoods in Los Angeles does econstruct serve?",
    answer:
      "We work throughout the greater Los Angeles area with a focus on luxury residential markets: Beverly Hills, Bel Air, Pacific Palisades, Malibu, Westwood, Santa Monica, Brentwood, Benedict Canyon, Agoura Hills, Calabasas, Hidden Hills, Hollywood Hills, Holmby Hills, Encino, West Hollywood, and Studio City.",
  },
  {
    question: "What types of residential projects does econstruct handle for international clients?",
    answer:
      "Custom home construction from the ground up, full-home luxury renovations, fire rebuilds (including WUI compliance), home additions, ADU construction, and luxury modernization projects. We are a full-service general contractor with an in-house design coordination team.",
  },
  {
    question: "How do I get started?",
    answer:
      "Schedule a confidential consultation via the form below or call us directly at " + COMPANY.phone.display + ". We will confirm your consultation within one business day. Initial consultations are complimentary and can be conducted via video call at a time that works for your schedule.",
  },
];

export default function InternationalLuxuryClientsPage() {
  const localBusinessSchema = generateLocalBusinessSchema();
  const webPageSchema = generateWebPageSchema({
    name: "International Luxury Home Builder Los Angeles | econstruct",
    description:
      "International clients trust econstruct with their Los Angeles luxury estate projects — from $5M renovations to $50M+ ground-up builds. Dedicated coordinator, real-time reporting, and direct access to senior leadership.",
    path: "/international-luxury-clients",
  });
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "International Luxury Clients", url: `${SITE_URL}/international-luxury-clients` },
  ]);
  const faqSchema = generateFAQSchema(faqs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([localBusinessSchema, webPageSchema, breadcrumbSchema, faqSchema]),
        }}
      />

      {/* Hero */}
      <PageHero
        title="Your Los Angeles Project, Expertly Managed — From Anywhere in the World"
        subtitle="International clients trust econstruct with their most significant US real estate investments — from $5M renovations to $50M+ ground-up estates. White-glove coordination, real-time reporting, and direct access to senior leadership — regardless of your time zone."
        breadcrumbs={[{ label: "International Clients" }]}
      />

      {/* Trust Strip */}
      <section className="bg-brand-dark py-10 border-t border-white/10">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "25+", label: "Years in Los Angeles" },
              { value: "634", label: "Partner Projects" },
              { value: `Lic #${COMPANY.license.number}`, label: "CA Licensed & Insured" },
              { value: "100%", label: "Remote-Capable" },
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

      {/* Why International Clients Choose econstruct */}
      <section className="py-24 md:py-32">
        <Container>
          <SectionHeader
            badge={["REMOTE", "PROJECT", "MANAGEMENT"]}
            title="What Sets econstruct Apart"
            subtitle="Clients at this level aren't looking for a contractor who can manage a schedule — they need a builder with access to the world's finest materials, the most skilled craftspeople in Los Angeles, and the infrastructure to run every detail remotely."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {capabilities.map((item, i) => {
              const Icon = item.icon;
              return (
                <AnimatedSection key={item.title} delay={i * 0.08}>
                  <div className="bg-white rounded-2xl p-8 h-full border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col">
                    <div className="w-14 h-14 rounded-xl bg-accent-gold/10 flex items-center justify-center mb-6">
                      <Icon className="w-7 h-7 text-accent-gold" />
                    </div>
                    <h3 className="text-xl font-bold text-brand-dark mb-3">{item.title}</h3>
                    <p className="text-body-text leading-relaxed flex-1">{item.description}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </Container>
      </section>

      {/* How It Works — Process */}
      <section className="py-24 md:py-32 bg-secondary">
        <Container>
          <SectionHeader
            badge={["HOW", "IT", "WORKS"]}
            title="A Clear Process From First Call to Final Key"
            subtitle="Clarity and predictability are essential when managing a project from overseas. Every step is documented, communicated, and approved by you before it proceeds."
          />

          <div className="max-w-4xl mx-auto">
            {processSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <AnimatedSection key={step.step} delay={i * 0.08}>
                  <div className="flex gap-6 md:gap-8 mb-12 last:mb-0">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-14 h-14 rounded-full bg-accent-gold flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      {i < processSteps.length - 1 && (
                        <div className="w-px h-full bg-accent-gold/30 mt-4" />
                      )}
                    </div>
                    <div className="pb-12 last:pb-0">
                      <div className="text-sm font-bold text-accent-gold uppercase tracking-wider mb-1">
                        Step {step.step}
                      </div>
                      <h3 className="text-2xl font-bold text-brand-dark mb-3">{step.title}</h3>
                      <p className="text-body-text leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Common Scenarios */}
      <section className="py-24 md:py-32">
        <Container>
          <SectionHeader
            badge={["CLIENT", "SCENARIOS"]}
            title="International Clients We Serve"
            subtitle="Whether you are purchasing a property in Los Angeles, managing an existing estate, or rebuilding after a loss — econstruct has managed it before."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {useCases.map((uc, i) => (
              <AnimatedSection key={uc.title} delay={i * 0.1}>
                <div className="rounded-2xl bg-secondary border border-gray-100 p-8 h-full flex flex-col">
                  <div className="w-10 h-10 rounded-full bg-accent-gold flex items-center justify-center mb-5 text-white font-bold text-sm">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="text-xl font-bold text-brand-dark mb-3">{uc.title}</h3>
                  <p className="text-body-text leading-relaxed flex-1">{uc.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      {/* Leadership / Accountability Section */}
      <section className="py-24 md:py-32 bg-brand-dark">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <div>
                <div className="border border-white/20 uppercase tracking-widest text-[10px] font-bold px-4 py-1.5 rounded-full text-white w-fit mb-6 flex gap-2 items-center">
                  <span>LEADERSHIP</span>
                  <span className="text-accent-gold">&bull;</span>
                  <span>OVERSIGHT</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
                  Principal-Led Oversight on Every International Project
                </h2>
                <p className="text-lg text-white/80 mb-8 leading-relaxed">
                  For international clients, trust is the foundation — not a feature. econstruct's leadership reviews the scope, pricing, and progress of every project managed for clients living abroad. There are no layers between you and accountability.
                </p>
                <p className="text-lg text-white/80 mb-8 leading-relaxed">
                  You are not handed off to a junior coordinator. You have direct access to the principal of a licensed California contractor whose business is built entirely on referral trust and delivered results.
                </p>
                <div className="space-y-3">
                  {[
                    "Direct contact with our principal at key project milestones",
                    "Owner-signed contract and documentation",
                    "Weekly written summary from a senior project lead",
                    "Leadership available by video call for major decisions",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-accent-gold shrink-0 mt-0.5" />
                      <span className="text-white/80">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="space-y-6">
                {[
                  {
                    icon: Star,
                    stat: "25+",
                    label: "Years Experience",
                    description: "econstruct's leadership has been managing complex residential construction in Los Angeles since 2001 — before most luxury markets matured.",
                  },
                  {
                    icon: Phone,
                    stat: "1",
                    label: "Point of Contact",
                    description: "Your dedicated coordinator handles everything. One number. One email thread. Complete accountability from permit to punch list.",
                  },
                  {
                    icon: Clock,
                    stat: "Weekly",
                    label: "Reporting Cadence",
                    description: "Every Friday you receive a photo-documented progress report with budget tracking. No news is not good news — we tell you everything.",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                    >
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-lg bg-accent-gold/20 flex items-center justify-center shrink-0">
                          <Icon className="w-6 h-6 text-accent-gold" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-white">{item.stat}</div>
                          <div className="text-sm font-bold text-accent-gold uppercase tracking-wider mb-2">
                            {item.label}
                          </div>
                          <p className="text-white/70 leading-relaxed text-sm">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </AnimatedSection>
          </div>
        </Container>
      </section>

      {/* Areas We Serve */}
      <section className="py-24 md:py-32">
        <Container>
          <SectionHeader
            badge={["SERVICE", "AREAS"]}
            title="Los Angeles's Most Prestigious Residential Markets"
            subtitle="econstruct operates across the full luxury residential corridor of Los Angeles — from coastal Malibu to hillside Bel Air to the guard-gated communities of the West Valley."
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              "Beverly Hills",
              "Bel Air",
              "Pacific Palisades",
              "Malibu",
              "Westwood",
              "Santa Monica",
              "Brentwood",
              "Benedict Canyon",
              "Agoura Hills",
              "Calabasas",
              "Hidden Hills",
              "Hollywood Hills",
              "Holmby Hills",
              "Encino",
              "West Hollywood",
              "Studio City",
            ].map((area) => (
              <AnimatedSection key={area}>
                <div className="flex items-center gap-2 rounded-xl bg-secondary border border-gray-100 px-4 py-3">
                  <MapPin className="w-4 h-4 text-accent-gold shrink-0" />
                  <span className="text-sm font-semibold text-brand-dark">{area}</span>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      {/* Cross-links to service pages */}
      <section className="py-24 md:py-32 bg-secondary">
        <Container>
          <SectionHeader
            badge={["OUR", "SERVICES"]}
            title="What We Build"
            subtitle="econstruct is a full-service luxury residential general contractor. Every project type below is available to international clients with full remote management."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Custom Home Construction",
                description: "Ground-up luxury homes built to your exact specifications. From architect selection to final delivery.",
                href: "/services/custom-home-construction-los-angeles",
              },
              {
                title: "Luxury Home Building",
                description: "Premium new construction in Los Angeles's most sought-after neighborhoods.",
                href: "/services/luxury-home-builder-los-angeles",
              },
              {
                title: "Fire Rebuild",
                description: "WUI-compliant reconstruction for properties lost in Los Angeles wildfires. Insurance coordination included.",
                href: "/services/fire-rebuild-contractor-los-angeles",
              },
              {
                title: "Home Additions",
                description: "Expand your existing property with seamlessly designed additions that match original architecture.",
                href: "/services/home-additions-los-angeles",
              },
              {
                title: "Home Automation",
                description: "Smart home integration — lighting, security, climate, and entertainment — built in from the start.",
                href: "/services/home-automation-los-angeles",
              },
              {
                title: "Trusted Partner Program",
                description: "Business managers and estate managers — learn how we support your clients with the same white-glove service.",
                href: "/trusted-partner-program",
              },
            ].map((service, i) => (
              <AnimatedSection key={service.title} delay={i * 0.06}>
                <a
                  href={service.href}
                  className="group block rounded-2xl bg-white border border-gray-100 p-7 h-full hover:shadow-lg hover:border-accent-gold/30 transition-all duration-300"
                >
                  <h3 className="text-lg font-bold text-brand-dark mb-3 group-hover:text-accent-gold transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-body-text leading-relaxed text-sm">{service.description}</p>
                </a>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-24 md:py-32">
        <Container size="narrow">
          <SectionHeader
            badge={["INTERNATIONAL", "CLIENT", "FAQ"]}
            title="Frequently Asked Questions"
            subtitle="Answers to the most common questions from international clients managing Los Angeles projects remotely."
          />

          <div className="divide-y divide-gray-200 border-t border-gray-200">
            {faqs.map((faq, i) => (
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

      {/* CTA */}
      <section className="py-24 md:py-32 bg-brand-dark">
        <Container>
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto">
              <div className="border border-white/20 uppercase tracking-widest text-[10px] font-bold px-4 py-1.5 rounded-full text-white w-fit mx-auto mb-6 flex gap-2 items-center justify-center">
                <span>GET</span>
                <span className="text-accent-gold">&bull;</span>
                <span>STARTED</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
                Schedule a Confidential Consultation
              </h2>
              <p className="text-lg text-white/80 mb-10 leading-relaxed">
                Tell us about your property and goals. We will confirm a video call time within one business day and walk you through exactly how econstruct manages international client projects.
              </p>
              <div className="flex flex-col items-center gap-4">
                <Button href="/contact?source=international" variant="primary" size="lg">
                  Schedule a Consultation
                </Button>
                <Button
                  href={`tel:${COMPANY.phone.primary.replace(/-/g, "")}`}
                  variant="secondary"
                  size="lg"
                >
                  Call {COMPANY.phone.display}
                </Button>
              </div>
              <p className="mt-8 text-sm text-white/50">
                {COMPANY.email}
              </p>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      <ConsultationCTA />
    </>
  );
}
