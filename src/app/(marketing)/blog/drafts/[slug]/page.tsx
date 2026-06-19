import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock3, FileText } from "lucide-react";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import {
  getDraftBlogPostBySlug,
  getDraftBlogPosts,
} from "@/lib/blog";

export function generateStaticParams() {
  return getDraftBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getDraftBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Draft Not Found",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${post.title} | Draft Review`,
    description: post.description,
    robots: { index: false, follow: false },
    openGraph: {
      title: `${post.title} | Draft Review`,
      description: post.description,
      images: [{ url: post.ogImage, width: 1200, height: 630 }],
    },
  };
}

export default async function DraftBlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getDraftBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <PageHero
        title={post.title}
        subtitle={post.description}
        breadcrumbs={[
          { label: "Blog", href: "/blog" },
          { label: "Draft Review", href: "/blog/drafts" },
          { label: post.title },
        ]}
        backgroundImage={post.heroImage}
        compact
      />

      <section className="bg-secondary pb-10">
        <Container>
          <div className="-mt-10 rounded-[2rem] border border-black/8 bg-white p-6 shadow-[0_28px_80px_rgba(0,0,0,0.08)] md:p-8">
            <div className="rounded-[1.5rem] border border-accent-gold/20 bg-accent-gold/8 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-gold">
                Draft Approval
              </p>
              <p className="mt-3 text-base leading-relaxed text-body-text">
                {post.approvalStatus ?? "Pending internal approval"}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-5 text-sm font-medium text-body-text">
              <span className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-accent-gold" />
                Published {post.formattedDate}
              </span>
              <span className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-accent-gold" />
                {post.readTime}
              </span>
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-accent-gold" />
                Keyword: {post.targetKeyword}
              </span>
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
                    priority
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
                    priority
                  />
                </div>
                <p className="mt-3 break-all text-sm text-body-text/70">{post.ogImage}</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="pb-20 md:pb-24">
        <Container>
          <div className="rounded-[2rem] border border-black/8 bg-white p-7 shadow-sm md:p-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-gold">
                  Draft Content Preview
                </p>
                <p className="mt-3 max-w-3xl text-base leading-relaxed text-body-text">
                  This is the full draft article with its current image pair so it can be reviewed
                  in context before publication.
                </p>
              </div>
              <Link
                href="/blog/drafts"
                className="rounded-full border border-brand-dark/12 px-5 py-3 text-sm font-bold text-brand-dark transition-colors hover:border-accent-gold hover:text-accent-gold"
              >
                Back To Draft Review
              </Link>
            </div>

            <article
              className="blog-prose mt-8 min-w-0"
              dangerouslySetInnerHTML={{ __html: post.html }}
            />
          </div>
        </Container>
      </section>
    </>
  );
}
