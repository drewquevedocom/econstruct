import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PostCard from "@/components/blog/PostCard";
import BlogFilters from "@/components/blog/BlogFilters";
import {
  getAllBlogPosts,
  getBlogArchiveSummary,
  getBlogIndexPages,
  paginatePosts,
} from "@/lib/blog";
import { generateBlogBreadcrumbSchema } from "@/lib/blog/schema";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Blog | Insights from the LA Rebuild Frontline",
  description:
    "Field-tested insight on fire rebuilds, luxury modernization, and custom home construction across Pacific Palisades, Brentwood, Santa Monica, Altadena, and greater Los Angeles.",
  alternates: {
    canonical: "https://econstructhomes.com/blog",
  },
  openGraph: {
    title: "Insights from the LA Rebuild Frontline | econstruct",
    description:
      "Expert rebuild, modernization, and custom home guidance from active Los Angeles job sites.",
    url: "https://econstructhomes.com/blog",
    images: [{ url: "/blog/blog_08_vet_contractor_og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Insights from the LA Rebuild Frontline | econstruct",
    description:
      "Expert rebuild, modernization, and custom home guidance from active Los Angeles job sites.",
    images: ["/blog/blog_08_vet_contractor_og.png"],
  },
};

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();
  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);
  const pagedPosts = paginatePosts(remainingPosts, 1);
  const totalPages = getBlogIndexPages(posts.length);

  const breadcrumbSchema = generateBlogBreadcrumbSchema([
    { name: "Home", url: "https://econstructhomes.com" },
    { name: "Blog", url: "https://econstructhomes.com/blog" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <PageHero
        title="Insights from the LA Rebuild Frontline"
        subtitle="Guidance for fire survivors, high-net-worth homeowners, and investors navigating permitting, budgeting, WUI compliance, and premium construction in Los Angeles."
        breadcrumbs={[{ label: "Blog" }]}
        backgroundImage="/hollywood_hills.png"
      />

      <section className="bg-secondary py-16 md:py-20">
        <Container>
          <BlogFilters />
        </Container>
      </section>

      {featuredPost ? (
        <section className="py-16 md:py-20">
          <Container>
            <div className="mb-8 flex items-center justify-between gap-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-gold">
                  Latest From The Field
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-dark md:text-4xl">
                  Featured Analysis
                </h2>
              </div>
              <Link
                href="/contact"
                className="hidden rounded-full border border-brand-dark/12 px-5 py-3 text-sm font-bold text-brand-dark transition-colors hover:border-accent-gold hover:text-accent-gold md:inline-flex"
              >
                Ask About Your Project
              </Link>
            </div>
            <PostCard post={featuredPost} featured />
          </Container>
        </section>
      ) : null}

      <section className="pb-20 md:pb-24">
        <Container>
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-gold">
              Archive
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-dark md:text-4xl">
              Tactical Articles for Owners and Advisors
            </h2>
            <p className="mt-4 text-base leading-relaxed text-body-text">
              {getBlogArchiveSummary()}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {pagedPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>

          <div className="mt-14 rounded-[2rem] bg-brand-dark px-8 py-10 text-white md:px-10">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-gold">
                  Newsletter
                </p>
                <h3 className="mt-3 text-3xl font-bold tracking-tight">
                  Get the LA Rebuild Newsletter
                </h3>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/72">
                  Monthly insight from active job sites, permit counters, and reconstruction budgets.
                  For now, use our contact page and we will add you manually.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-6">
                <p className="text-sm leading-relaxed text-white/72">
                  Tell us your neighborhood, project type, and timeline. We will route you to the
                  right rebuild or modernization contact.
                </p>
                <Link
                  href="/contact"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent-gold px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white hover:text-brand-dark"
                >
                  Join via Contact
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {totalPages > 1 ? (
            <nav className="mt-12 flex items-center justify-between">
              <Link rel="prev" href="/blog" className="text-sm font-bold text-body-text">
                Previous
              </Link>
              <Link rel="next" href="/blog?page=2" className="text-sm font-bold text-brand-dark">
                Next
              </Link>
            </nav>
          ) : null}
        </Container>
      </section>
    </>
  );
}

