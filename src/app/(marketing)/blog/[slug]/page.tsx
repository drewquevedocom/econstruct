import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { CalendarDays, Clock3, FileText, CheckCircle2 } from "lucide-react";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import TableOfContents from "@/components/resources/TableOfContents";
import ShareButtons from "@/components/blog/ShareButtons";
import PostCard from "@/components/blog/PostCard";
import { COMPANY } from "@/lib/constants";
import {
  getAllBlogPosts,
  getBlogPostBySlug,
  getRelatedPosts,
} from "@/lib/blog";
import {
  generateAuthorPersonSchema,
  generateBlogArticleSchema,
  generateBlogBreadcrumbSchema,
  generateBlogFaqSchema,
} from "@/lib/blog/schema";

export function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found",
      robots: { index: false, follow: false },
    };
  }

  const url = `https://econstructhomes.com/blog/${post.slug}`;

  return {
    title: `${post.title} | econstruct`,
    description: post.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${post.title} | econstruct`,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      section: post.category,
      tags: post.tags,
      authors: [post.author.name],
      images: [{ url: post.ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | econstruct`,
      description: post.description,
      images: [post.ogImage],
    },
    other: {
      "article:published_time": post.publishedAt,
      "article:modified_time": post.updatedAt,
      "article:author": post.author.name,
      "article:section": post.category,
      "article:tag": post.tags.join(", "),
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post.slug, post.categorySlug, post.tags);
  const canonicalUrl = `https://econstructhomes.com/blog/${post.slug}`;

  const breadcrumbSchema = generateBlogBreadcrumbSchema([
    { name: "Home", url: "https://econstructhomes.com" },
    { name: "Blog", url: "https://econstructhomes.com/blog" },
    {
      name: post.category,
      url: `https://econstructhomes.com/blog/category/${post.categorySlug}`,
    },
    { name: post.title, url: canonicalUrl },
  ]);

  const articleSchema = generateBlogArticleSchema(post);
  const authorSchema = generateAuthorPersonSchema(post.author);
  const faqSchema = generateBlogFaqSchema(post.faq);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(authorSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <PageHero
        title={post.title}
        subtitle={post.description}
        breadcrumbs={[
          { label: "Blog", href: "/blog" },
          { label: post.category, href: `/blog/category/${post.categorySlug}` },
          { label: post.title },
        ]}
        backgroundImage={post.heroImage}
        compact
      />

      <section className="bg-secondary pb-10">
        <Container>
          <div className="-mt-10 rounded-[2rem] border border-black/8 bg-white p-6 shadow-[0_28px_80px_rgba(0,0,0,0.08)] md:p-8">
            <div className="mb-8 flex flex-wrap items-center gap-3">
              <Link
                href={`/blog/category/${post.categorySlug}`}
                className="rounded-full bg-accent-gold/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-accent-gold"
              >
                {post.category}
              </Link>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-body-text/75">
                {post.readTime}
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-body-text/75">
                {post.wordCount.toLocaleString()} words
              </span>
            </div>

            <div className="mb-8 flex flex-wrap items-center gap-5 text-sm font-medium text-body-text">
              <span className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-accent-gold" />
                Published {post.formattedDate}
              </span>
              <span className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-accent-gold" />
                Updated {post.formattedUpdatedDate}
              </span>
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-accent-gold" />
                Keyword: {post.targetKeyword}
              </span>
            </div>

            <div className="mb-8 rounded-[1.75rem] border border-black/8 bg-secondary p-5 md:p-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-center">
                <Image
                  src={post.author.image}
                  alt={post.author.name}
                  width={96}
                  height={96}
                  className="h-20 w-20 rounded-full border border-black/8 object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent-gold">
                    Author
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <Link
                      href={`/blog/author/${post.author.slug}`}
                      className="text-xl font-bold text-brand-dark transition-colors hover:text-accent-gold"
                    >
                      {post.author.name}
                    </Link>
                    <span className="text-sm text-body-text">{post.author.title}</span>
                  </div>
                  <p className="mt-3 max-w-3xl text-sm leading-relaxed text-body-text">
                    {post.author.shortBio}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-[0.16em] text-body-text/75">
                    <span>{post.reviewedBy}</span>
                    <span>{post.factCheckedBy}</span>
                    {post.author.linkedin ? (
                      <a
                        href={post.author.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent-gold transition-colors hover:text-brand-dark"
                      >
                        LinkedIn
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-black/8 bg-white">
            <link rel="preload" as="image" href={post.heroImage} />
            <picture>
              {post.heroImageWebp?.endsWith(".webp") ? (
                <source srcSet={post.heroImageWebp} type="image/webp" />
              ) : null}
              <img
                src={post.heroImage}
                alt={post.heroImageAlt}
                width="1600"
                height="900"
                loading="eager"
                className="aspect-[16/9] w-full object-cover"
              />
            </picture>
            </div>
          </div>
        </Container>
      </section>

      <section className="pb-20 md:pb-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_310px]">
            <div className="min-w-0 space-y-10">
              <div className="rounded-[1.75rem] border border-black/8 bg-white p-7 shadow-sm md:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-gold">
                  Key Takeaways
                </p>
                <ul className="mt-5 space-y-4">
                  {post.takeaways.map((takeaway) => (
                    <li key={takeaway} className="flex gap-3 text-base leading-relaxed text-body-text">
                      <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-accent-gold" />
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:hidden">
                <TableOfContents sections={post.toc} />
              </div>

              <div className="rounded-[2rem] border border-black/8 bg-white p-7 shadow-sm md:p-10">
                <article
                  className="blog-prose min-w-0"
                  dangerouslySetInnerHTML={{ __html: post.html }}
                />
              </div>

              <section className="rounded-[1.75rem] border border-black/8 bg-white p-7 shadow-sm md:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-gold">
                  Sources & Citations
                </p>
                <ol className="mt-5 space-y-4 pl-5">
                  {post.sources.map((source) => (
                    <li key={source.url} className="text-sm leading-7 text-body-text">
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-brand-dark underline decoration-accent-gold/45 underline-offset-4 transition-colors hover:text-accent-gold"
                      >
                        {source.title}
                      </a>
                      {source.publisher && <> &mdash; {source.publisher}</>}
                    </li>
                  ))}
                </ol>
              </section>

              <section className="rounded-[1.75rem] border border-black/8 bg-white p-7 shadow-sm md:p-8">
                <div className="flex flex-col gap-5 md:flex-row md:items-start">
                  <Image
                    src={post.author.image}
                    alt={post.author.name}
                    width={128}
                    height={128}
                    className="h-24 w-24 rounded-full border border-black/8 object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-gold">
                      About The Author
                    </p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-dark">
                      {post.author.name}
                    </h2>
                    <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-body-text/70">
                      {post.author.title}
                    </p>
                    <div className="mt-5 space-y-4">
                      {post.author.bio.map((paragraph) => (
                        <p key={paragraph} className="text-base leading-relaxed text-body-text">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                    <ul className="mt-5 flex flex-wrap gap-3">
                      {post.author.credentials.map((credential) => (
                        <li
                          key={credential}
                          className="rounded-full bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-brand-dark"
                        >
                          {credential}
                        </li>
                      ))}
                    </ul>
                    {post.author.linkedin ? (
                      <a
                        href={post.author.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex rounded-full border border-brand-dark/12 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-dark transition-colors hover:border-accent-gold hover:text-accent-gold"
                      >
                        Connect on LinkedIn
                      </a>
                    ) : null}
                  </div>
                </div>
                <div className="mt-6 border-t border-black/8 pt-5 text-sm text-body-text">
                  Last updated {post.formattedUpdatedDate}. {post.factCheckedBy}. {COMPANY.license.display}.
                </div>
              </section>

              <section className="rounded-[1.75rem] border border-black/8 bg-white p-7 shadow-sm md:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-gold">
                  FAQ
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-dark">
                  Common Questions
                </h2>
                <div className="mt-6 space-y-5">
                  {post.faq.map((item) => (
                    <div key={item.question} className="rounded-[1.25rem] bg-secondary p-5">
                      <h3 className="text-xl font-bold text-brand-dark">{item.question}</h3>
                      <p className="mt-3 text-base leading-relaxed text-body-text">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[2rem] bg-brand-dark px-8 py-10 text-white shadow-[0_24px_70px_rgba(0,0,0,0.14)] md:px-10">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-gold">
                  Consultation CTA
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight">
                  Get a Free Rebuild Consultation
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/72">
                  If you are weighing permit risk, insurance gaps, or scope decisions, bring the
                  real address and the real constraints. We will help you map the next move clearly.
                </p>
                <div className="mt-6 flex flex-wrap gap-4">
                  <Link
                    href="/contact"
                    className="rounded-full bg-accent-gold px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white hover:text-brand-dark"
                  >
                    Start the Conversation
                  </Link>
                  <Link
                    href="/services/fire-rebuild-contractor-los-angeles"
                    className="rounded-full border border-white/14 px-6 py-3 text-sm font-bold text-white transition-colors hover:border-accent-gold hover:text-accent-gold"
                  >
                    Explore Fire Rebuild Services
                  </Link>
                </div>
              </section>

              <div className="rounded-[1.75rem] border border-black/8 bg-white p-7 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-gold">
                  Have Questions?
                </p>
                <p className="mt-4 text-base leading-relaxed text-body-text">
                  Every rebuild has a different pressure point. If you want help translating this article
                  into a site-specific decision, contact our team and we will point you to the right next step.
                </p>
                <Link
                  href="/contact"
                  className="mt-5 inline-flex rounded-full border border-brand-dark/12 px-5 py-3 text-sm font-bold text-brand-dark transition-colors hover:border-accent-gold hover:text-accent-gold"
                >
                  Contact econstruct
                </Link>
              </div>
            </div>

            <aside className="space-y-8">
              <TableOfContents sections={post.toc} />
              <ShareButtons title={post.title} url={canonicalUrl} />
            </aside>
          </div>
        </Container>
      </section>

      <section className="bg-secondary py-20 md:py-24">
        <Container>
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-gold">
              Related Posts
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-dark md:text-4xl">
              More In {post.category}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <PostCard key={relatedPost.slug} post={relatedPost} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

