import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, CheckCircle2, Clock3, FileText } from "lucide-react";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import { COMPANY } from "@/lib/constants";
import { getDraftBlogPosts } from "@/lib/blog";
import ShareButtons from "@/components/blog/ShareButtons";
import TableOfContents from "@/components/resources/TableOfContents";

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
                className="space-y-0"
              >
                <section className="bg-secondary pb-10">
                  <div className="rounded-[2rem] border border-black/8 bg-white p-6 shadow-[0_28px_80px_rgba(0,0,0,0.08)] md:p-8">
                    <div className="mb-8 flex flex-wrap items-center gap-3">
                      <Link
                        href={`/blog/category/${post.categorySlug}`}
                        className="rounded-full bg-accent-gold/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-accent-gold"
                      >
                        {post.category}
                      </Link>
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

                    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
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
                </section>

                <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_310px]">
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
                          <h3 className="mt-3 text-3xl font-bold tracking-tight text-brand-dark">
                            {post.author.name}
                          </h3>
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

                    <section className="rounded-[2rem] bg-brand-dark px-8 py-10 text-white shadow-[0_24px_70px_rgba(0,0,0,0.14)] md:px-10">
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-gold">
                        Consultation CTA
                      </p>
                      <h3 className="mt-3 text-3xl font-bold tracking-tight text-white">
                        Get a Free Rebuild Consultation
                      </h3>
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
                    <ShareButtons
                      title={post.title}
                      url={`https://econstructhomes.com/blog/drafts/${post.slug}`}
                    />
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
