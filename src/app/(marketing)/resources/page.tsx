import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { generateBreadcrumbSchema } from "@/lib/schema";
import { blogPosts } from "@/lib/data/blog-posts";
import PageHero from "@/components/ui/PageHero";
import SectionHeader from "@/components/ui/SectionHeader";
import Container from "@/components/ui/Container";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Calculator,
  Clock,
  ArrowRight,
  Tag,
  Calendar,
  MessageCircle,
} from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "Resources & Insights | Construction Guides & Tools",
  description:
    "Expert construction resources for Los Angeles homeowners. Fire rebuild guides, cost calculators, ADU regulations, and luxury remodel insights from eConstruct's 25+ years of experience.",
  path: "/resources",
  image: "/fire_rebuild_service.png",
});

const featuredPost = blogPosts.find((p) => p.featured);
const latestPosts = blogPosts.filter((p) => !p.featured);

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ResourcesPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://econstructinc.com" },
    { name: "Resources", url: "https://econstructinc.com/resources" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      {/* Hero */}
      <PageHero
        title="Resources & Insights"
        subtitle="Expert guides, tools, and articles to help you make informed decisions about your construction project."
        breadcrumbs={[{ label: "Resources" }]}
      />

      {/* Featured Resource */}
      {featuredPost && (
        <section className="py-24 md:py-32">
          <Container>
            <SectionHeader
              badge={["FEATURED", "GUIDE"]}
              title="Essential Reading"
              subtitle="Our most comprehensive resource for LA homeowners navigating construction projects."
            />

            <AnimatedSection>
              <Link
                href={`/resources/${featuredPost.slug}`}
                className="group block"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-secondary rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="relative aspect-[16/10] lg:aspect-auto">
                    <Image
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-accent-gold/10 text-accent-gold text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                        {featuredPost.category}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm text-body-text/60">
                        <Clock className="w-3.5 h-3.5" />
                        {featuredPost.readTime} read
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-brand-dark mb-4 tracking-tight group-hover:text-accent-gold transition-colors">
                      {featuredPost.title}
                    </h3>
                    <p className="text-body-text leading-relaxed mb-8">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-accent-gold font-bold">
                      <BookOpen className="w-5 h-5" />
                      Read the Guide
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          </Container>
        </section>
      )}

      {/* Tools Section */}
      <section className="py-24 md:py-32 bg-secondary">
        <Container>
          <SectionHeader
            badge={["INTERACTIVE", "TOOLS"]}
            title="Project Planning Tools"
            subtitle="Use our interactive tools to estimate costs and plan your construction project."
          />

          <AnimatedSection>
            <Link href="/resources/cost-calculator" className="group block">
              <div className="bg-white rounded-2xl p-8 md:p-12 border border-gray-100 hover:shadow-xl transition-shadow duration-300 max-w-3xl mx-auto">
                <div className="flex flex-col md:flex-row items-start gap-8">
                  <div className="w-20 h-20 rounded-2xl bg-accent-gold/10 flex items-center justify-center shrink-0">
                    <Calculator className="w-10 h-10 text-accent-gold" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold text-brand-dark mb-3 tracking-tight group-hover:text-accent-gold transition-colors">
                      Cost Calculator
                    </h3>
                    <p className="text-body-text leading-relaxed mb-6">
                      Get a preliminary cost estimate for your construction
                      project. Select your project type, square footage, and
                      finish level to see projected costs based on current Los
                      Angeles market rates.
                    </p>
                    <div className="flex items-center gap-2 text-accent-gold font-bold">
                      Calculate Your Estimate
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </AnimatedSection>
        </Container>
      </section>

      {/* Latest Articles */}
      <section className="py-24 md:py-32">
        <Container>
          <SectionHeader
            badge={["LATEST", "ARTICLES"]}
            title="Insights & Guides"
            subtitle="Expert knowledge from 25+ years of high-end residential construction in Los Angeles."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {latestPosts.map((post, i) => (
              <AnimatedSection key={post.slug} delay={i * 0.08}>
                <Link
                  href={`/resources/${post.slug}`}
                  className="group block h-full"
                >
                  <article className="bg-secondary rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                    <div className="relative aspect-[16/10]">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/90 backdrop-blur-sm text-brand-dark text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1.5">
                          <Tag className="w-3 h-3" />
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 md:p-8 flex flex-col flex-1">
                      <div className="flex items-center gap-4 text-sm text-body-text/60 mb-4">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(post.date)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {post.readTime}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-brand-dark mb-3 tracking-tight group-hover:text-accent-gold transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-body-text leading-relaxed mb-6 flex-1">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-2 text-accent-gold font-bold text-sm">
                        Read Article
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </article>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Strip */}
      <section className="py-24 md:py-32 bg-brand-dark">
        <Container>
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-accent-gold/20 flex items-center justify-center mx-auto mb-8">
                <MessageCircle className="w-8 h-8 text-accent-gold" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
                Have a Question?
              </h2>
              <p className="text-lg text-white/70 mb-8 leading-relaxed">
                Our team is here to help you navigate every aspect of your
                construction project. Reach out for expert guidance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="/contact" variant="primary" size="lg">
                  Contact Us
                </Button>
                <Button href="/services" variant="ghost" size="lg">
                  Explore Services
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </section>
    </>
  );
}
