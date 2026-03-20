import type { Metadata } from "next";
import {
  TrendingUp,
  Home,
  MapPin,
  FileText,
  CheckCircle2,
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
  title: "For Investors — Turnkey Fire Rebuild Packages | eConstruct",
  description:
    "From permits to keys. Turnkey fire rebuild packages designed for investor ROI. Essential, Premium, and Luxury Spec builds from $450-$1000+/sq ft.",
  path: "/for-investors",
  noIndex: true,
});

const keyStats = [
  { value: "40%", label: "of Palisades lots sold to investors", icon: TrendingUp },
  { value: "$1.6M", label: "Median lot price", icon: DollarSign },
  { value: "3,106+", label: "Permits pending", icon: FileText },
  { value: "12-18", label: "Month build timeline", icon: Clock },
];

const packages = [
  {
    tier: "Essential Build",
    price: "$450-550/sq ft",
    description: "Clean modern design, rental-ready finishes, and efficient layouts optimized for rental yield or quick resale.",
    features: [
      "Modern open floor plans",
      "Quality standard finishes",
      "Energy-efficient systems",
      "Rental-ready landscaping",
      "WUI-compliant construction",
    ],
    highlighted: false,
  },
  {
    tier: "Premium Build",
    price: "$550-700/sq ft",
    description: "Upgraded finishes, smart home integration, and designer touches that command top-of-market rents and buyer interest.",
    features: [
      "Designer-selected finishes",
      "Smart home integration",
      "Premium appliance package",
      "Hardscape & landscape design",
      "ADU-ready infrastructure",
    ],
    highlighted: true,
  },
  {
    tier: "Luxury Spec",
    price: "$700-1000+/sq ft",
    description: "Architect-designed, top-of-market positioning. Built to compete with the best homes in the Palisades and Malibu.",
    features: [
      "Architect-designed plans",
      "Premium imported materials",
      "Full smart home automation",
      "Pool & outdoor living",
      "Top-of-market positioning",
    ],
    highlighted: false,
  },
];

const includedItems = [
  "Full permit management & expediting",
  "Architectural plans & engineering",
  "Complete construction management",
  "WUI-compliant materials & assembly",
  "Utility reconnection & coordination",
  "Landscaping & hardscape",
  "Final inspections & certificate of occupancy",
  "Post-construction warranty",
];

export default function ForInvestorsPage() {
  return (
    <>
      <PageHero
        title="You Bought the Lot. We'll Handle Everything Else."
        subtitle="From permits to keys. Turnkey fire rebuild packages designed for investor ROI."
      />

      {/* Key Stats Band */}
      <section className="py-24 md:py-32 bg-brand-dark">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {keyStats.map((stat, i) => {
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

      {/* ROI Packages */}
      <section className="py-24 md:py-32">
        <Container>
          <SectionHeader
            badge={["Investment Packages"]}
            title="Turnkey Build Packages"
            subtitle="Three tiers designed for different investment strategies. All include full permit management and construction."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, i) => (
              <AnimatedSection key={pkg.tier} delay={i * 0.1}>
                <div
                  className={`rounded-2xl p-8 h-full flex flex-col border ${
                    pkg.highlighted
                      ? "bg-brand-dark text-white border-brand-dark shadow-xl relative"
                      : "bg-white border-gray-100 shadow-sm"
                  }`}
                >
                  {pkg.highlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-gold text-white text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  )}
                  <h3
                    className={`text-xl font-bold mb-2 ${
                      pkg.highlighted ? "text-white" : "text-brand-dark"
                    }`}
                  >
                    {pkg.tier}
                  </h3>
                  <p className="text-accent-gold font-bold text-2xl mb-4">
                    {pkg.price}
                  </p>
                  <p
                    className={`leading-relaxed mb-6 flex-1 ${
                      pkg.highlighted ? "text-white/80" : "text-gray-500"
                    }`}
                  >
                    {pkg.description}
                  </p>
                  <ul className="space-y-3">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <CheckCircle2
                          size={18}
                          className={`mt-0.5 flex-shrink-0 ${
                            pkg.highlighted ? "text-accent-gold" : "text-accent-gold"
                          }`}
                        />
                        <span
                          className={`text-sm font-medium ${
                            pkg.highlighted ? "text-white/90" : "text-gray-600"
                          }`}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      {/* What's Included */}
      <section className="py-24 md:py-32 bg-[#F8F6F2]">
        <Container size="narrow">
          <SectionHeader
            badge={["Turnkey Service"]}
            title="What's Included in Every Package"
            subtitle="Every build tier includes comprehensive project management from start to finish."
          />

          <AnimatedSection>
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {includedItems.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2
                      size={20}
                      className="text-accent-gold mt-0.5 flex-shrink-0"
                    />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* CTA: Get an Investor Feasibility Package */}
      <section className="py-24 md:py-32">
        <Container>
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto">
              <SectionHeader
                badge={["Next Step"]}
                title="Get an Investor Feasibility Package"
                subtitle="We'll analyze your lot, estimate build costs, and project ROI. Free for qualified investors with a property under contract or recently purchased."
              />
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button href="/contact?source=investor" variant="primary" size="lg">
                  Request Feasibility Package
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
