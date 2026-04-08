import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { generateBreadcrumbSchema } from "@/lib/schema";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import AnimatedSection from "@/components/ui/AnimatedSection";
import CostCalculator from "@/components/calculator/CostCalculator";
import ConsultationCTA from "@/components/ConsultationCTA";

export const metadata: Metadata = generatePageMetadata({
  title: "Construction Cost Calculator | Estimate Your LA Home Build",
  description:
    "Get a free preliminary cost estimate for your Los Angeles luxury home build, fire rebuild, modernization, or ADU. Interactive calculator with real market pricing from econstruct Inc.",
  path: "/resources/cost-calculator",
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://econstructinc.com" },
  { name: "Resources", url: "https://econstructinc.com/resources" },
  { name: "Cost Calculator", url: "https://econstructinc.com/resources/cost-calculator" },
]);

export default function CostCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <PageHero
        title="Construction Cost Calculator"
        subtitle="Get an instant preliminary estimate for your Los Angeles luxury home project. Answer four quick questions and see your estimated investment range."
        breadcrumbs={[
          { label: "Resources", href: "/resources" },
          { label: "Cost Calculator" },
        ]}
      />

      <section className="py-20 md:py-28 bg-[#FAFAF8]">
        <Container>
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <CostCalculator />
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2} className="mt-16 max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6">
                <div className="text-3xl font-bold text-brand-dark mb-1">340+</div>
                <p className="text-gray-500 text-sm font-medium">Projects Completed</p>
              </div>
              <div className="text-center p-6">
                <div className="text-3xl font-bold text-brand-dark mb-1">25+</div>
                <p className="text-gray-500 text-sm font-medium">Years Experience</p>
              </div>
              <div className="text-center p-6">
                <div className="text-3xl font-bold text-brand-dark mb-1">3x</div>
                <p className="text-gray-500 text-sm font-medium">Faster Permitting</p>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.3} className="mt-12 max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-brand-dark mb-4">Why Estimates Vary</h2>
            <p className="text-gray-600 leading-relaxed">
              Construction costs in Los Angeles depend on many variables: lot conditions, slope and
              accessibility, soil quality, design complexity, material selections, WUI zone requirements,
              and current labor market rates. Our calculator provides a starting range based on
              hundreds of completed projects. For a precise, line-item proposal tailored to your specific
              property, schedule a free consultation with our team.
            </p>
          </AnimatedSection>
        </Container>
      </section>

      <ConsultationCTA />
    </>
  );
}
