import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PostCard from "@/components/blog/PostCard";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import {
  getBlogArchiveSummary,
  getBlogIndexPages,
  getDraftBlogPosts,
  paginatePosts,
} from "@/lib/blog";

export const metadata: Metadata = {
  title: "Temporary Blogs | econstruct",
  description: "Temporary draft blog index for image approval before publication.",
  robots: { index: false, follow: false },
};

export default function DraftBlogReviewPage() {
  const draftPosts = getDraftBlogPosts();
  const featuredPost = draftPosts[0];
  const remainingPosts = draftPosts.slice(1);
  const pagedPosts = paginatePosts(remainingPosts, 1);
  const totalPages = getBlogIndexPages(draftPosts.length);

  return (
    <>
      <PageHero
        title="Temporary Blogs"
        subtitle="Draft blog previews in the same teaser layout as the live blog, kept separate until images are approved."
        breadcrumbs={[{ label: "Blog", href: "/blog" }, { label: "Temporary Blogs" }]}
        backgroundImage="/blog/draft-platinum-triangle-hero.jpeg"
      />

      {featuredPost ? (
        <section className="py-16 md:py-20">
          <Container>
            <div className="mb-8 flex items-center justify-between gap-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-gold">
                  Temporary Review
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-dark md:text-4xl">
                  Featured Draft
                </h2>
              </div>
              <Link
                href="/blog"
                className="hidden rounded-full border border-brand-dark/12 px-5 py-3 text-sm font-bold text-brand-dark transition-colors hover:border-accent-gold hover:text-accent-gold md:inline-flex"
              >
                Back To Live Blog
              </Link>
            </div>
            <PostCard post={featuredPost} featured hrefBase="/blog/drafts" />
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
              <PostCard key={post.slug} post={post} hrefBase="/blog/drafts" />
            ))}
          </div>

          <div className="mt-14 rounded-[2rem] bg-brand-dark px-8 py-10 text-white md:px-10">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-gold">
                  Temporary Review
                </p>
                <h3 className="mt-3 text-3xl font-bold tracking-tight text-white">
                  Draft Blogs Awaiting Image Approval
                </h3>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/72">
                  These article teasers are intentionally separated from the live blog until the
                  final image direction is approved.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-6">
                <p className="text-sm leading-relaxed text-white/72">
                  Review the teaser image, headline, and excerpt treatment here first. Open any
                  draft card to inspect the full article preview if needed.
                </p>
                <Link
                  href="/blog"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent-gold px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white hover:text-brand-dark"
                >
                  View Live Blog
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {totalPages > 1 ? (
            <nav className="mt-12 flex items-center justify-between">
              <Link rel="prev" href="/blog/temporary-blogs" className="text-sm font-bold text-body-text">
                Previous
              </Link>
              <Link rel="next" href="/blog/temporary-blogs?page=2" className="text-sm font-bold text-brand-dark">
                Next
              </Link>
            </nav>
          ) : null}
        </Container>
      </section>
    </>
  );
}
