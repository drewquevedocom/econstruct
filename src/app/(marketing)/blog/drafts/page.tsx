import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import { getDraftBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Draft Blog Image Review | econstruct",
  description: "Internal draft blog review page for hero and OG image approval.",
  robots: { index: false, follow: false },
};

export default function DraftBlogReviewPage() {
  const draftPosts = getDraftBlogPosts();

  return (
    <>
      <PageHero
        title="Draft Blog Image Review"
        subtitle="Share this page internally to review each draft article with its current hero and social image pair before publishing."
        breadcrumbs={[{ label: "Blog", href: "/blog" }, { label: "Draft Review" }]}
        backgroundImage="/blog/blog_03_brentwood_luxury.png"
        compact
      />

      <section className="bg-secondary py-16 md:py-20">
        <Container>
          <div className="grid gap-8">
            {draftPosts.map((post) => (
              <article
                key={post.slug}
                className="rounded-[2rem] border border-black/8 bg-white p-6 shadow-[0_18px_44px_rgba(0,0,0,0.05)] md:p-8"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="max-w-3xl">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-gold">
                      {post.category}
                    </p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-dark">
                      {post.title}
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-body-text">{post.excerpt}</p>
                    <p className="mt-4 text-sm font-medium text-body-text/70">
                      Status: {post.approvalStatus ?? "Draft"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/blog/drafts/${post.slug}`}
                      className="rounded-full bg-brand-dark px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-accent-gold"
                    >
                      Open Draft Preview
                    </Link>
                  </div>
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-2">
                  <div>
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-body-text/70">
                      Hero Image
                    </p>
                    <div className="overflow-hidden rounded-[1.5rem] border border-black/8 bg-secondary">
                      <Image
                        src={post.heroImage}
                        alt={post.heroImageAlt}
                        width={1600}
                        height={900}
                        className="aspect-[16/9] w-full object-cover"
                      />
                    </div>
                    <p className="mt-3 break-all text-sm text-body-text/70">{post.heroImage}</p>
                  </div>

                  <div>
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-body-text/70">
                      Open Graph Image
                    </p>
                    <div className="overflow-hidden rounded-[1.5rem] border border-black/8 bg-secondary">
                      <Image
                        src={post.ogImage}
                        alt={`${post.title} social preview image`}
                        width={1200}
                        height={630}
                        className="aspect-[1200/630] w-full object-cover"
                      />
                    </div>
                    <p className="mt-3 break-all text-sm text-body-text/70">{post.ogImage}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
