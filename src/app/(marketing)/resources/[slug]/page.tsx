import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { generatePageMetadata } from "@/lib/metadata";
import { generateArticleSchema, generateBreadcrumbSchema } from "@/lib/schema";
import { blogPosts } from "@/lib/data/blog-posts";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import ConsultationCTA from "@/components/ConsultationCTA";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return generatePageMetadata({
      title: "Article Not Found",
      description: "The requested article could not be found.",
      path: `/resources/${slug}`,
    });
  }

  return generatePageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/resources/${post.slug}`,
    image: post.image,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) notFound();

  const relatedPosts = blogPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const articleSchema = generateArticleSchema({
    title: post.title,
    description: post.excerpt,
    slug: post.slug,
    date: post.date,
    image: post.image,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://econstructinc.com" },
    { name: "Resources", url: "https://econstructinc.com/resources" },
    { name: post.title, url: `https://econstructinc.com/resources/${post.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Article Header */}
      <section className="relative pt-36 pb-16 md:pt-44 md:pb-24 bg-brand-dark overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/80 to-brand-dark" />
        <Container className="relative z-10">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-8">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/resources" className="hover:text-white transition-colors">
              Resources
            </Link>
            <span>/</span>
            <span className="text-white/90 line-clamp-1">{post.title}</span>
          </nav>

          <span className="inline-block bg-accent-gold/20 text-accent-gold text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-6">
            {post.category}
          </span>

          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight max-w-4xl leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-6 mt-8 text-white/70 text-sm font-medium">
            <span className="flex items-center gap-2">
              <Calendar size={16} />
              {formattedDate}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={16} />
              {post.readTime} read
            </span>
          </div>
        </Container>
      </section>

      {/* Hero Image */}
      <section className="relative -mt-2">
        <Container size="narrow">
          <AnimatedSection>
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl -mt-8">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* Article Body Placeholder */}
      <section className="py-24 md:py-32">
        <Container size="narrow">
          <AnimatedSection>
            <article className="prose prose-lg max-w-none">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 md:p-12 text-center">
                <div className="w-16 h-16 bg-accent-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock size={28} className="text-accent-gold" />
                </div>
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-brand-dark mb-4">
                  Content Coming Soon
                </h2>
                <p className="text-body-text text-lg leading-relaxed max-w-xl mx-auto mb-8">
                  We&apos;re putting the finishing touches on this article.
                  Check back soon for the full piece on{" "}
                  <span className="font-semibold text-brand-dark lowercase">
                    {post.title.toLowerCase()}
                  </span>
                  .
                </p>
                <Button href="/resources" variant="secondary">
                  <ArrowLeft size={16} />
                  Browse All Articles
                </Button>
              </div>
            </article>
          </AnimatedSection>
        </Container>
      </section>

      {/* Related Articles */}
      <section className="py-24 md:py-32 bg-gray-50">
        <Container>
          <AnimatedSection>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-brand-dark tracking-tight mb-4 text-center">
              Related Articles
            </h2>
            <p className="text-body-text text-lg text-center mb-16 max-w-2xl mx-auto">
              Continue exploring expert insights on luxury construction and fire
              rebuilds in Los Angeles.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((related, index) => (
              <AnimatedSection key={related.slug} delay={index * 0.1}>
                <Link
                  href={`/resources/${related.slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={related.image}
                      alt={related.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-brand-dark text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                      {related.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-body-text mb-3">
                      <span>{related.date}</span>
                      <span>{related.readTime}</span>
                    </div>
                    <h3 className="text-lg font-bold text-brand-dark group-hover:text-accent-gold transition-colors leading-snug mb-3">
                      {related.title}
                    </h3>
                    <p className="text-body-text text-sm line-clamp-2">
                      {related.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-1 text-accent-gold font-bold text-sm mt-4 group-hover:gap-2 transition-all">
                      Read Article <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      <ConsultationCTA />
    </>
  );
}
