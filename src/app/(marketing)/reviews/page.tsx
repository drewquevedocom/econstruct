import type { Metadata } from "next";
import { Star } from "lucide-react";
import { generatePageMetadata } from "@/lib/metadata";
import { generateLocalBusinessSchema, generateBreadcrumbSchema } from "@/lib/schema";
import { COMPANY } from "@/lib/constants";
import { testimonials } from "@/lib/data/testimonials";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import ConsultationCTA from "@/components/ConsultationCTA";

export const metadata: Metadata = generatePageMetadata({
  title: "Client Reviews Ã¢â‚¬â€ What Our Clients Say About econstruct",
  description:
    "Read verified reviews from econstruct clients across Los Angeles. 5.0-star rating based on 47 reviews for fire rebuilds, luxury modernization, and custom homes.",
  path: "/reviews",
});

const projectTypeLabels: Record<string, string> = {
  "fire-rebuild": "Fire Rebuild",
  luxury: "Luxury Modernization",
  custom: "Custom Home",
  adu: "ADU & Addition",
};

export default function ReviewsPage() {
  const localBusinessSchema = generateLocalBusinessSchema();

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://econstructhomes.com" },
    { name: "Reviews", url: "https://econstructhomes.com/reviews" },
  ]);

  const averageRating =
    testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <PageHero
        title="What Our Clients Say"
        subtitle="Real stories from homeowners across Los Angeles who trusted econstruct with their most important investment."
        breadcrumbs={[{ label: "Reviews" }]}
      />

      {/* Aggregate Rating */}
      <section className="py-24 md:py-32">
        <Container>
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-20">
              <div className="flex items-center justify-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={36}
                    className="text-accent-gold fill-accent-gold"
                  />
                ))}
              </div>
              <p className="text-5xl md:text-6xl font-bold text-brand-dark tracking-tight mb-2">
                5.0
              </p>
              <p className="text-body-text text-lg font-medium">
                out of 5 based on{" "}
                <span className="text-brand-dark font-bold">47 reviews</span>
              </p>
            </div>
          </AnimatedSection>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <AnimatedSection key={index} delay={index * 0.08}>
                <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                  {/* Stars */}
                  <div className="flex items-center gap-0.5 mb-6">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className="text-accent-gold fill-accent-gold"
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="font-playfair text-lg md:text-xl italic text-brand-dark leading-relaxed mb-8 flex-1">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>

                  {/* Attribution */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <div>
                      <p className="font-bold text-brand-dark">
                        {testimonial.name}
                      </p>
                      <p className="text-body-text text-sm">
                        {testimonial.neighborhood}
                      </p>
                    </div>
                    {testimonial.projectType && (
                      <span className="bg-gray-100 text-brand-dark text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                        {projectTypeLabels[testimonial.projectType] ||
                          testimonial.projectType}
                      </span>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-gray-50">
        <Container>
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-brand-dark tracking-tight mb-6">
                Ready to Join Our Happy Clients?
              </h2>
              <p className="text-body-text text-lg mb-10 leading-relaxed">
                Experience the same exceptional craftsmanship and personalized
                attention that has earned us a perfect 5-star rating across Los
                Angeles.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button href="/contact" variant="primary" size="lg">
                  Schedule Free Consultation
                </Button>
                <Button href="/our-work" variant="secondary" size="lg">
                  View Our Portfolio
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

