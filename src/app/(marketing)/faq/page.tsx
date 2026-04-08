import type { Metadata } from "next";
import { MessageCircleQuestion } from "lucide-react";
import { generatePageMetadata } from "@/lib/metadata";
import { generateFAQSchema, generateBreadcrumbSchema } from "@/lib/schema";
import { faqs } from "@/lib/data/faq";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import FAQSection from "@/components/faq/FAQSection";
import ConsultationCTA from "@/components/ConsultationCTA";

export const metadata: Metadata = generatePageMetadata({
  title: "FAQ — Frequently Asked Questions About econstruct",
  description:
    "Get answers to common questions about econstruct's fire rebuild, luxury modernization, and custom home services in Los Angeles. Pricing, timelines, process, and more.",
  path: "/faq",
});

export default function FAQPage() {
  const faqSchema = generateFAQSchema(
    faqs.map((faq) => ({ question: faq.question, answer: faq.answer }))
  );

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://econstructinc.com" },
    { name: "FAQ", url: "https://econstructinc.com/faq" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <PageHero
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about working with econstruct. Can't find your answer? Contact us directly."
        breadcrumbs={[{ label: "FAQ" }]}
      />

      <FAQSection />

      {/* Still Have Questions CTA */}
      <section className="py-24 md:py-32 bg-gray-50">
        <Container>
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-accent-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircleQuestion size={28} className="text-accent-gold" />
              </div>
              <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-brand-dark tracking-tight mb-6">
                Still Have Questions?
              </h2>
              <p className="text-body-text text-lg mb-10 leading-relaxed">
                Our team is here to help. Reach out for a free consultation and
                we&apos;ll answer any questions about your specific project.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button href="/contact" variant="primary" size="lg">
                  Contact Us
                </Button>
                <Button href="tel:8889900303" variant="secondary" size="lg">
                  Call (888) 990-0303
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
