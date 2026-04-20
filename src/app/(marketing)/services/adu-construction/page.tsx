import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import {
  generateServiceSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
} from "@/lib/schema";
import { services } from "@/lib/data/services";
import { faqs } from "@/lib/data/faq";
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
  Building2,
  Home,
  PlusCircle,
  FileCheck,
  Paintbrush,
  Scale,
  DollarSign,
  TrendingUp,
  Users,
  Briefcase,
  ClipboardList,
  Ruler,
  HardHat,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const service = services.find((s) => s.slug === "adu-construction")!;
const aduFaqs = faqs.filter(
  (f) => f.category === "general" || f.category === "pricing"
);

export const metadata: Metadata = generatePageMetadata({
  title: "ADU & Home Addition Contractor Los Angeles | econstruct",
  description:
    "Expert ADU builder in Los Angeles. Garage conversions, detached ADUs, home additions. California ADU regulation experts. Permits navigated 3x faster. $350-$600+/sq ft.",
  path: "/services/adu-construction",
  image: "/custom_home_service.png",
});

const features = [
  {
    icon: Building2,
    title: "Garage Conversions",
    description:
      "Transform your existing garage into a fully permitted, livable ADU. We handle structural upgrades, insulation, plumbing, and premium finishes to maximize your investment.",
  },
  {
    icon: Home,
    title: "Detached ADU Construction",
    description:
      "Ground-up detached ADU builds designed to complement your primary residence. Custom designs from studio to two-bedroom units, built to the highest standards.",
  },
  {
    icon: PlusCircle,
    title: "Home Additions & Extensions",
    description:
      "Expand your living space with seamless additions that match your home's architecture. Master suites, family rooms, second stories — engineered and permitted correctly.",
  },
  {
    icon: FileCheck,
    title: "Permit Navigation",
    description:
      "California's ADU regulations change frequently. Our permitting team stays current on every local ordinance and expedites approvals 3x faster than industry average.",
  },
  {
    icon: Paintbrush,
    title: "Rental-Ready Finishing",
    description:
      "Premium finishes designed for durability and tenant appeal. Full kitchens, modern bathrooms, in-unit laundry, and private entrances that command top market rents.",
  },
  {
    icon: Scale,
    title: "California Regulation Expertise",
    description:
      "From SB 9 lot splits to AB 2221 updates, we know California's evolving ADU laws inside and out. Setback requirements, height limits, parking exemptions — we handle it all.",
  },
];

const benefits = [
  {
    icon: DollarSign,
    title: "Rental Income",
    description:
      "A well-built ADU in Los Angeles can generate $2,000-$4,500+ per month in rental income, often covering your mortgage payment and then some.",
  },
  {
    icon: TrendingUp,
    title: "Property Value Increase",
    description:
      "ADUs typically add 20-30% to your property's value. In LA's market, that translates to $200K-$500K+ in equity from a single addition.",
  },
  {
    icon: Users,
    title: "Multigenerational Living",
    description:
      "Give aging parents or adult children independent living space on your property. Private entrance, full kitchen, and their own address — with family next door.",
  },
  {
    icon: Briefcase,
    title: "Home Office / Studio",
    description:
      "The ultimate work-from-home upgrade. A dedicated, code-compliant structure with its own utilities, climate control, and complete separation from your living space.",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Feasibility & Site Evaluation",
    description:
      "We assess your property's zoning, setbacks, utility connections, and lot coverage to determine the optimal ADU type and placement for your specific situation.",
    icon: ClipboardList,
  },
  {
    step: "02",
    title: "Design & Planning",
    description:
      "Custom architectural design that maximizes your allowable square footage while complementing your property. Floor plans, elevations, and material selections tailored to your goals.",
    icon: Ruler,
  },
  {
    step: "03",
    title: "Permitting & Approvals",
    description:
      "Our team prepares and submits all permit documents, coordinates with plan check, and manages the approval process. We leverage California's streamlined ADU permitting timelines.",
    icon: FileCheck,
  },
  {
    step: "04",
    title: "Construction",
    description:
      "Expert construction with minimal disruption to your daily life. Dedicated project manager, weekly updates, and Frank Neimroozi's direct oversight on every project.",
    icon: HardHat,
  },
  {
    step: "05",
    title: "Final Inspection & Move-In",
    description:
      "We coordinate all final inspections, obtain your certificate of occupancy, and deliver a turnkey unit ready for occupancy or rental — complete with full warranty.",
    icon: Home,
  },
];

export default function ADUConstructionPage() {
  const serviceSchema = generateServiceSchema(service);
  const faqSchema = generateFAQSchema(aduFaqs);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://econstructhomes.com" },
    { name: "Services", url: "https://econstructhomes.com/services" },
    {
      name: "ADU & Additions",
      url: "https://econstructhomes.com/services/adu-construction",
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
        title="ADU & Home Additions"
        subtitle="Take advantage of California's ADU-friendly laws to add living space, rental income, or multigenerational housing to your Los Angeles property."
        breadcrumbs={[
          { label: "Services", href: "/services" },
          { label: "ADU & Additions" },
        ]}
        backgroundImage="/custom_home_service.png"
      />

      {/* Features Grid */}
      <section className="py-24 md:py-32">
        <Container>
          <SectionHeader
            badge={["ADU", "SERVICES"]}
            title="Everything You Need to Build"
            subtitle="From garage conversions to ground-up detached units, we deliver turnkey ADUs and additions built to the highest standards."
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

      {/* Why Build an ADU */}
      <section className="py-24 md:py-32 bg-secondary">
        <Container>
          <SectionHeader
            badge={["WHY", "BUILD"]}
            title="Why Build an ADU?"
            subtitle="An ADU is one of the smartest investments a Los Angeles homeowner can make. Here's why."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {benefits.map((benefit, i) => (
              <AnimatedSection key={benefit.title} delay={i * 0.1}>
                <div className="bg-white rounded-2xl p-8 h-full border border-gray-100">
                  <div className="flex gap-5">
                    <div className="w-14 h-14 rounded-xl bg-accent-gold/10 flex items-center justify-center shrink-0">
                      <benefit.icon className="w-7 h-7 text-accent-gold" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-brand-dark mb-3">
                        {benefit.title}
                      </h3>
                      <p className="text-body-text leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      {/* Process Timeline */}
      <section className="py-24 md:py-32">
        <Container>
          <SectionHeader
            badge={["ADU", "PROCESS"]}
            title="From Concept to Keys"
            subtitle="A streamlined 5-step process designed to get your ADU permitted and built as efficiently as possible."
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

      {/* Investment Section */}
      <section className="py-24 md:py-32 bg-brand-dark">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <div>
                <div className="border border-white/20 uppercase tracking-widest text-[10px] font-bold px-4 py-1.5 rounded-full text-white w-fit mb-6 flex gap-2 items-center">
                  <span>ADU</span>
                  <span className="text-accent-gold">&bull;</span>
                  <span>INVESTMENT</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
                  Your ADU Investment
                </h2>
                <p className="text-lg text-white/80 mb-8 leading-relaxed">
                  ADU construction in Los Angeles typically ranges from{" "}
                  <span className="text-accent-gold font-bold">
                    $350 to $600+ per square foot
                  </span>
                  , depending on the type of unit, site conditions, and finish
                  level. The investment pays for itself through rental income and
                  increased property value.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <div className="space-y-6">
                {[
                  {
                    label: "Garage Conversion",
                    range: "$150K - $280K",
                    detail: "400-600 sq ft typical",
                  },
                  {
                    label: "Detached ADU",
                    range: "$250K - $500K+",
                    detail: "600-1,200 sq ft typical",
                  },
                  {
                    label: "Home Addition",
                    range: "$200K - $600K+",
                    detail: "Varies by scope",
                  },
                  {
                    label: "Junior ADU (JADU)",
                    range: "$80K - $150K",
                    detail: "Up to 500 sq ft",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-white">
                        {item.label}
                      </h3>
                      <span className="text-accent-gold font-bold text-lg">
                        {item.range}
                      </span>
                    </div>
                    <p className="text-white/60 text-sm">{item.detail}</p>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection delay={0.3}>
            <div className="mt-16 text-center">
              <p className="text-white/60 text-sm mb-6">
                Pricing varies by site conditions, design complexity, and finish
                level. Get a personalized estimate.
              </p>
              <Button href="/contact" variant="primary" size="lg">
                Get a Free ADU Estimate
              </Button>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* California ADU Laws */}
      <section className="py-24 md:py-32">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <div>
                <div className="border border-brand-dark/20 uppercase tracking-widest text-[10px] font-bold px-4 py-1.5 rounded-full text-brand-dark w-fit mb-6 flex gap-2 items-center">
                  <span>CALIFORNIA</span>
                  <span className="text-accent-gold">&bull;</span>
                  <span>ADU LAWS</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-brand-dark tracking-tight mb-6">
                  California Makes It Easier Than Ever
                </h2>
                <p className="text-lg text-body-text mb-8 leading-relaxed">
                  Recent California legislation has dramatically simplified ADU
                  construction. Understanding these changes can save you time,
                  money, and headaches. econstruct stays at the forefront of
                  every regulatory update.
                </p>
                <div className="space-y-4">
                  {[
                    "No owner-occupancy requirement for most ADUs",
                    "Reduced setback requirements (4 ft rear and side)",
                    "Parking exemptions near transit or in historic districts",
                    "Streamlined 60-day permit approval timelines",
                    "No impact fees for ADUs under 750 sq ft",
                    "Allowance for both ADU and JADU on a single lot",
                    "SB 9 lot split compatibility for additional density",
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
                  src="/custom_home_service.png"
                  alt="ADU construction project in Los Angeles"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 to-transparent" />
              </div>
            </AnimatedSection>
          </div>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="py-24 md:py-32 bg-secondary">
        <Container size="narrow">
          <SectionHeader
            badge={["ADU", "FAQ"]}
            title="Frequently Asked Questions"
            subtitle="Answers to common questions about ADU construction and home additions in Los Angeles."
          />

          <div className="divide-y divide-gray-200 border-t border-gray-200">
            {aduFaqs.map((faq, i) => (
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

