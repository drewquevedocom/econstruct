import type { Metadata } from "next";
import {
  Users,
  Shield,
  Star,
  CheckCircle,
  ArrowRight,
  Briefcase,
  Building2,
  Phone,
  FileCheck,
  Award,
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
  title: "Trusted Partner Program — Refer With Confidence | econstruct",
  description:
    "Business managers, estate managers, family offices, and entertainment attorneys partner with econstruct to provide their high-net-worth clients with the highest level of residential construction in Los Angeles.",
  path: "/trusted-partner-program",
});

const partnerTypes = [
  {
    icon: Briefcase,
    title: "Business Managers",
    description:
      "Your clients trust you with their financial lives. When construction decisions come up — renovation, rebuild, expansion — they need a contractor who reflects the standard you hold yourself to. econstruct is that contractor.",
  },
  {
    icon: Building2,
    title: "Estate Managers",
    description:
      "You manage the household. We manage the build. econstruct works alongside estate managers as a seamlessly integrated extension of your team — keeping the property running, the schedule on track, and the principal informed without burdening you.",
  },
  {
    icon: Users,
    title: "Family Offices",
    description:
      "Multi-property portfolios, complex ownership structures, and high expectations. econstruct has the documentation, reporting, and coordination infrastructure to operate inside a family office workflow — budgets reconciled against actuals, decisions in writing, no surprises.",
  },
  {
    icon: FileCheck,
    title: "Entertainment Attorneys",
    description:
      "Your clients are high-profile. A problematic construction experience reflects on you. econstruct brings the discretion, accountability, and communication that high-profile clients require — and the craftsmanship their properties deserve.",
  },
];

const pillars = [
  {
    icon: Shield,
    title: "We Never Miss a Deadline Without Warning You First",
    description:
      "When schedule risks emerge, we communicate them immediately — in writing, with a revised timeline and a mitigation plan. You are never blindsided. Your clients are never surprised.",
  },
  {
    icon: FileCheck,
    title: "Every Decision is Documented",
    description:
      "Change orders, budget variances, subcontractor selection, schedule adjustments — all in writing, all approved before proceeding. You have a complete paper trail that protects both you and your client.",
  },
  {
    icon: Award,
    title: "The Work Speaks for Itself",
    description:
      "25+ years in Los Angeles. 634 partner projects. A track record built entirely on referral trust. We have built our reputation on delivering exactly what we promise — and that reputation is what you are lending to your client when you refer us.",
  },
];

const deliverables = [
  "Extensive experience navigating Southern California permitting and agency approvals, including LADBS, Planning, Public Works, LADWP, and utility coordination.",
  "Commercial project management discipline applied to luxury residential construction, bringing structured scheduling, cost control, and consultant coordination.",
  "Strong emphasis on communication, executive reporting, and transparency.",
  "Ability to manage the entire project lifecycle, from feasibility and permitting through construction and final closeout.",
  "Weekly written progress reports with photo documentation",
  "Direct access to senior leadership at key decision points",
  "Full permit documentation and as-built records at completion",
  "Comprehensive walk-through at project completion",
  "Post-completion warranty documentation and contact",
];

const howItWorks = [
  {
    step: "01",
    icon: Phone,
    title: "Initial Partner Conversation",
    description:
      "We have a brief call to understand your practice, your clients' typical project types, and how you prefer to coordinate referrals. No obligation, no pitch. We want to understand how we can best support your workflow.",
  },
  {
    step: "02",
    icon: Users,
    title: "Client Introduction",
    description:
      "When a client need arises, you introduce them to econstruct — by phone, email, or in person. We treat the introduction with full discretion and acknowledge you as the referring professional throughout our engagement.",
  },
  {
    step: "03",
    icon: FileCheck,
    title: "White-Glove Intake",
    description:
      "We conduct a private consultation with your client. Scope, goals, timeline, and budget are discussed confidentially. You receive a summary of the consultation so you are fully informed — but never burdened with construction details.",
  },
  {
    step: "04",
    icon: Star,
    title: "Delivery That Reflects Well on You",
    description:
      "Your client receives the same quality, communication, and craftsmanship that has defined econstruct for 25+ years in Los Angeles. When the project closes, they thank you for the introduction.",
  },
];

const faqs = [
  {
    question: "Does econstruct provide updates to the referring partner throughout the project?",
    answer:
      "Yes. We provide brief summary updates to referring professionals at key milestones — project start, permit approval, construction midpoint, and completion. The level of involvement is entirely up to you; some partners want a light touch, others want full visibility. We adapt to your preference.",
  },
  {
    question: "What types of residential projects does econstruct specialize in?",
    answer:
      "Custom home construction from the ground up, full-home luxury renovations, fire rebuilds with WUI compliance, home additions, and home automation integration. We work on projects starting at $1M, ranging up to $20M+ custom builds throughout the greater Los Angeles area.",
  },
  {
    question: "How does econstruct handle high-profile or privacy-sensitive clients?",
    answer:
      "Discretion is standard, not optional. We do not discuss client identities, project addresses, or project details with anyone outside the direct project team. NDAs are available upon request. Our field staff are screened and briefed on confidentiality expectations for all projects.",
  },
  {
    question: "What neighborhoods does econstruct serve?",
    answer:
      "We operate throughout greater Los Angeles including Beverly Hills, Bel Air, Pacific Palisades, Malibu, Westwood, Santa Monica, Brentwood, Benedict Canyon, Agoura Hills, Calabasas, Hidden Hills, Hollywood Hills, Holmby Hills, Encino, West Hollywood, and Studio City.",
  },
  {
    question: "Is there a formal agreement for the partner program?",
    answer:
      "No formal agreement is required to refer a client to econstruct. The program is built on mutual trust and shared values — not legal frameworks. If you prefer a written referral arrangement, we are happy to discuss it. The conversation always starts with a simple phone call.",
  },
];

export default function TrustedPartnerProgramPage() {
  const localBusinessSchema = generateLocalBusinessSchema();
  const webPageSchema = generateWebPageSchema({
    name: "Trusted Partner Program — Refer With Confidence | econstruct",
    description:
      "Business managers, estate managers, family offices, and entertainment attorneys partner with econstruct to provide their high-net-worth clients with the highest level of residential construction in Los Angeles.",
    path: "/trusted-partner-program",
  });
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Trusted Partner Program", url: `${SITE_URL}/trusted-partner-program` },
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
        title="The Contractor Your Clients & Employer Will Thank You For"
        subtitle="Business managers, estate managers, family offices, and entertainment attorneys partner with econstruct to provide their clients with the highest standard of residential construction in Los Angeles."
        breadcrumbs={[{ label: "Trusted Partner Program" }]}
      />

      {/* Trust Strip */}
      <section className="bg-brand-dark py-10 border-t border-white/10">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "25+", label: "Years in Los Angeles" },
              { value: "634", label: "Partner Projects" },
              { value: `Lic #${COMPANY.license.number}`, label: "CA Licensed & Insured" },
              { value: "100%", label: "Referral-Based Growth" },
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

      {/* Who This Is For */}
      <section className="py-24 md:py-32">
        <Container>
          <SectionHeader
            badge={["WHO", "THIS", "IS FOR"]}
            title="Professionals Who Refer With Confidence"
            subtitle="The econstruct partner program is designed for trusted advisors whose professional reputation depends on every vendor they introduce to a client."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {partnerTypes.map((type, i) => {
              const Icon = type.icon;
              return (
                <AnimatedSection key={type.title} delay={i * 0.08}>
                  <div className="bg-white rounded-2xl p-8 h-full border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex gap-6">
                    <div className="w-14 h-14 rounded-xl bg-accent-gold/10 flex items-center justify-center shrink-0">
                      <Icon className="w-7 h-7 text-accent-gold" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-brand-dark mb-3">{type.title}</h3>
                      <p className="text-body-text leading-relaxed">{type.description}</p>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Why Referrals to econstruct Protect Your Reputation */}
      <section className="py-24 md:py-32 bg-brand-dark">
        <Container>
          <SectionHeader
            badge={["YOUR", "REPUTATION"]}
            title="Why Referring econstruct Protects Your Credibility"
            subtitle="A contractor who underdelivers is a contractor who makes you look bad. econstruct's 25-year track record in Los Angeles is built entirely on referral trust."
            light
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <AnimatedSection key={pillar.title} delay={i * 0.1}>
                  <div className="bg-white/5 rounded-2xl p-8 border border-white/10 h-full flex flex-col">
                    <div className="w-14 h-14 rounded-xl bg-accent-gold/20 flex items-center justify-center mb-6">
                      <Icon className="w-7 h-7 text-accent-gold" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{pillar.title}</h3>
                    <p className="text-white/70 leading-relaxed flex-1">{pillar.description}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </Container>
      </section>

      {/* How the Partnership Works */}
      <section className="py-24 md:py-32 bg-secondary">
        <Container>
          <SectionHeader
            badge={["HOW", "IT", "WORKS"]}
            title="Simple to Start. Seamless to Manage."
            subtitle="The program works around your schedule and your process — not the other way around."
          />

          <div className="max-w-4xl mx-auto">
            {howItWorks.map((step, i) => {
              const Icon = step.icon;
              return (
                <AnimatedSection key={step.step} delay={i * 0.08}>
                  <div className="flex gap-6 md:gap-8 mb-12 last:mb-0">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-14 h-14 rounded-full bg-accent-gold flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      {i < howItWorks.length - 1 && (
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

      {/* What Your Clients Get */}
      <section className="py-24 md:py-32">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <div>
                <div className="border border-brand-dark/20 uppercase tracking-widest text-[10px] font-bold px-4 py-1.5 rounded-full text-brand-dark w-fit mb-6 flex gap-2 items-center">
                  <span>CLIENT</span>
                  <span className="text-accent-gold">&bull;</span>
                  <span>DELIVERABLES</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-brand-dark tracking-tight mb-6">
                  What Your Client Receives From Day One
                </h2>
                <p className="text-lg text-body-text mb-8 leading-relaxed">
                  Every econstruct client — referred or direct — receives the same white-glove service standard. The difference when you refer is that we treat your introduction as the beginning of a long-term professional relationship, not a one-time transaction.
                </p>
                <div className="space-y-3">
                  {deliverables.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-accent-gold shrink-0 mt-0.5" />
                      <span className="text-body-text">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="space-y-5">
                <div className="rounded-2xl bg-secondary border border-gray-100 p-8">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="w-5 h-5 fill-accent-gold text-accent-gold" />
                    ))}
                  </div>
                  <blockquote className="text-body-text leading-relaxed italic mb-5">
                    &ldquo;Frank and the econstruct team managed our renovation with a level of professionalism I have rarely seen. As someone who manages a high-profile family&rsquo;s assets, I needed a contractor who understood discretion, documentation, and accountability. econstruct delivered on all three.&rdquo;
                  </blockquote>
                  <div>
                    <div className="font-bold text-brand-dark">Estate Manager, Beverly Hills</div>
                    <div className="text-sm text-body-text">Referred by a wealth management firm</div>
                  </div>
                </div>

                <div className="rounded-2xl bg-brand-dark p-8">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="w-5 h-5 fill-accent-gold text-accent-gold" />
                    ))}
                  </div>
                  <blockquote className="text-white/80 leading-relaxed italic mb-5">
                    &ldquo;I have referred three clients to econstruct over the past four years. Not one has come back with a complaint — and two have referred additional friends. That is the only metric that matters to me.&rdquo;
                  </blockquote>
                  <div>
                    <div className="font-bold text-white">Business Manager, Century City</div>
                    <div className="text-sm text-white/60">Entertainment industry practice</div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </Container>
      </section>

      {/* Cross-link to International Clients */}
      <section className="py-16 bg-secondary">
        <Container>
          <AnimatedSection>
            <div className="rounded-2xl bg-white border border-gray-100 p-8 md:p-10 flex flex-col md:flex-row items-center gap-6 justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-gold mb-2">
                  International Clients
                </p>
                <h3 className="text-2xl font-bold text-brand-dark mb-2">
                  Managing a Project for a Client Based Overseas?
                </h3>
                <p className="text-body-text">
                  econstruct&apos;s full remote management program handles all communication, reporting, and coordination for clients living abroad. Learn how it works.
                </p>
              </div>
              <a
                href="/international-luxury-clients"
                className="group inline-flex items-center gap-2 rounded-full bg-accent-gold px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-dark whitespace-nowrap shrink-0"
              >
                Learn More
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-24 md:py-32">
        <Container size="narrow">
          <SectionHeader
            badge={["PARTNER", "FAQ"]}
            title="Frequently Asked Questions"
            subtitle="Answers to the most common questions from professionals considering partnering with econstruct."
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
              <p className="text-body-text mb-6">Have a question not covered here?</p>
              <Button href="/contact" variant="secondary">
                Reach Out Directly
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
                Start a Conversation
              </h2>
              <p className="text-lg text-white/80 mb-10 leading-relaxed">
                A brief introductory call is all it takes. Tell us about your practice and your clients. We will show you how econstruct operates and why professionals trust us with their most important referrals.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button href="/contact?source=partner" variant="primary" size="lg">
                  Request a Partner Meeting
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
                {COMPANY.license.display} · Frank Neimroozi, Owner & President
              </p>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      <ConsultationCTA />
    </>
  );
}
