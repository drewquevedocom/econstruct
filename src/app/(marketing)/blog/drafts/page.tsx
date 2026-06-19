import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, CheckCircle2, Clock3, FileText } from "lucide-react";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import { COMPANY } from "@/lib/constants";
import { getDraftBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Draft Blog Image Review | econstruct",
  description: "Internal draft blog review page for full article and image approval.",
  robots: { index: false, follow: false },
};

export default function DraftBlogReviewPage() {
  const draftPosts = getDraftBlogPosts();

  return (
    <>
      <PageHero
        title="Temporary Blog Review"
        subtitle="Full draft blog previews for image approval, layout review, and geo-targeted SEO review before publication."
        breadcrumbs={[{ label: "Blog", href: "/blog" }, { label: "Temporary Blogs" }]}
        backgroundImage="/blog/draft-platinum-triangle-hero.jpeg"
        compact
      />

      <section className="bg-secondary py-16 md:py-20">
        <Container>
          <div className="max-w-4xl rounded-[2rem] border border-black/8 bg-white p-7 shadow-sm md:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-gold">
              Review Scope
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-dark md:text-4xl">
              Unapproved Drafts Kept Separate From The Live Blog
            </h2>
            <p className="mt-4 text-base leading-relaxed text-body-text">
              This page shows each temporary article in full, using the same overall article
              structure as the published blog so image choices, geo-SEO targeting, keyword
              placement, and article formatting can be reviewed in context.
            </p>
          </div>
        </Container>
      </section>

      <section className="pb-20 md:pb-24">
        <Container>
          <div className="space-y-16">
            {draftPosts.map((post) => (
              <article
                key={post.slug}
                id={post.slug}
                className="rounded-[2rem] border border-black/8 bg-white p-7 shadow-[0_24px_70px_rgba(0,0,0,0.08)] md:p-10"
              >
                <div className="mb-8 flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-accent-gold/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-accent-gold">
                    {post.category}
                  </span>
                  <span className="rounded-full bg-brand-dark px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white">
                    Temporary Draft
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-body-text/75">
                    {post.readTime}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-body-text/75">
                    {post.wordCount.toLocaleString()} words
                  </span>
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="max-w-4xl">
                    <h2 className="text-4xl font-bold tracking-tight text-brand-dark md:text-5xl">
                      {post.title}
                    </h2>
                    <p className="mt-5 text-lg leading-relaxed text-body-text">
                      {post.description}
                    </p>
                    <p className="mt-5 text-sm font-medium text-body-text/75">
                      Status: {post.approvalStatus ?? "Draft"}
                    </p>
                  </div>
                  <Link
                    href={`/blog/drafts/${post.slug}`}
                    className="rounded-full border border-brand-dark/12 px-5 py-3 text-sm font-bold text-brand-dark transition-colors hover:border-accent-gold hover:text-accent-gold"
                  >
                    Standalone Preview
                  </Link>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-5 text-sm font-medium text-body-text">
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

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-black/8 bg-secondary p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-gold">
                      Primary Geo Areas
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {post.localAreas.map((area) => (
                        <span
                          key={area}
                          className="rounded-full bg-white px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-brand-dark"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-black/8 bg-secondary p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-gold">
                      SEO Tags
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-white px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-brand-dark"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 rounded-[1.75rem] border border-black/8 bg-secondary p-5 md:p-6">
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
                        <span className="text-xl font-bold text-brand-dark">{post.author.name}</span>
                        <span className="text-sm text-body-text">{post.author.title}</span>
                      </div>
                      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-body-text">
                        {post.author.shortBio}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-[0.16em] text-body-text/75">
                        <span>{post.reviewedBy}</span>
                        <span>{post.factCheckedBy}</span>
                      </div>
                    </div>
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
                  </div>

                  <div>
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-body-text/70">
                      Secondary Image
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
                  </div>
                </div>

                <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
                  <div className="min-w-0 space-y-10">
                    <section className="rounded-[1.75rem] border border-black/8 bg-white p-7 shadow-sm md:p-8">
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
                    </section>

                    <section className="rounded-[2rem] border border-black/8 bg-white p-7 shadow-sm md:p-10">
                      <article
                        className="blog-prose min-w-0"
                        dangerouslySetInnerHTML={{ __html: post.html }}
                      />
                    </section>

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
                            {source.publisher && <> - {source.publisher}</>}
                          </li>
                        ))}
                      </ol>
                    </section>

                    <section className="rounded-[1.75rem] border border-black/8 bg-white p-7 shadow-sm md:p-8">
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-gold">
                        FAQ
                      </p>
                      <h3 className="mt-3 text-3xl font-bold tracking-tight text-brand-dark">
                        Common Questions
                      </h3>
                      <div className="mt-6 space-y-5">
                        {post.faq.map((item) => (
                          <div key={item.question} className="rounded-[1.25rem] bg-secondary p-5">
                            <h4 className="text-xl font-bold text-brand-dark">{item.question}</h4>
                            <p className="mt-3 text-base leading-relaxed text-body-text">{item.answer}</p>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section className="rounded-[1.75rem] border border-black/8 bg-white p-7 shadow-sm md:p-8">
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-gold">
                        Editorial Review
                      </p>
                      <div className="mt-4 space-y-4 text-base leading-relaxed text-body-text">
                        <p>Last updated {post.formattedUpdatedDate}.</p>
                        <p>{post.factCheckedBy}.</p>
                        <p>{COMPANY.license.display}.</p>
                      </div>
                    </section>
                  </div>

                  <aside className="space-y-8">
                    <div className="rounded-[1.75rem] border border-black/8 bg-secondary p-6">
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-gold">
                        Slug
                      </p>
                      <p className="mt-3 break-all text-sm leading-relaxed text-body-text">
                        /blog/{post.slug}
                      </p>
                    </div>

                    <div className="rounded-[1.75rem] border border-black/8 bg-secondary p-6">
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-gold">
                        Image Paths
                      </p>
                      <div className="mt-4 space-y-3 text-sm leading-relaxed text-body-text">
                        <p className="break-all">{post.heroImage}</p>
                        <p className="break-all">{post.ogImage}</p>
                      </div>
                    </div>
                  </aside>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
