import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import PostCard from "@/components/blog/PostCard";
import { getAllBlogAuthors, getPostsByAuthorSlug } from "@/lib/blog";
import { getBlogAuthorBySlug } from "@/lib/blog/authors";
import {
  generateAuthorPersonSchema,
  generateBlogBreadcrumbSchema,
} from "@/lib/blog/schema";
import PageHero from "@/components/ui/PageHero";

export function generateStaticParams() {
  return getAllBlogAuthors().map((author) => ({ "author-slug": author.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ "author-slug": string }>;
}): Promise<Metadata> {
  const { "author-slug": authorSlug } = await params;
  const author = getBlogAuthorBySlug(authorSlug);

  if (!author) {
    return {
      title: "Author Not Found",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${author.name} | econstruct Blog`,
    description: author.shortBio,
    alternates: {
      canonical: `https://econstructhomes.com/blog/author/${author.slug}`,
    },
  };
}

export default async function BlogAuthorPage({
  params,
}: {
  params: Promise<{ "author-slug": string }>;
}) {
  const { "author-slug": authorSlug } = await params;
  const author = getBlogAuthorBySlug(authorSlug);

  if (!author) {
    notFound();
  }

  const posts = getPostsByAuthorSlug(authorSlug);
  const breadcrumbSchema = generateBlogBreadcrumbSchema([
    { name: "Home", url: "https://econstructhomes.com" },
    { name: "Blog", url: "https://econstructhomes.com/blog" },
    { name: author.name, url: `https://econstructhomes.com/blog/author/${author.slug}` },
  ]);
  const personSchema = generateAuthorPersonSchema(author);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <PageHero
        title={author.name}
        subtitle={author.title}
        breadcrumbs={[{ label: "Blog", href: "/blog" }, { label: author.name }]}
        backgroundImage="/hollywood_hills.png"
        compact
      />

      <section className="bg-secondary pb-10">
        <Container>
          <div className="-mt-10 rounded-[2rem] border border-black/8 bg-white p-8 shadow-[0_28px_80px_rgba(0,0,0,0.08)] md:p-10">
            <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-center">
              <Image
                src={author.image}
                alt={author.name}
                width={220}
                height={220}
                className="h-44 w-44 rounded-full border border-black/8 object-cover"
              />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-gold">
                  Author Profile
                </p>
                <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-body-text/80">
                  {author.title}
                </p>
                <div className="mt-6 max-w-4xl space-y-4 text-base leading-relaxed text-body-text">
                  {author.bio.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                <ul className="mt-6 flex flex-wrap gap-3">
                  {author.credentials.map((credential) => (
                    <li
                      key={credential}
                      className="rounded-full bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-brand-dark"
                    >
                      {credential}
                    </li>
                  ))}
                </ul>
                {author.linkedin ? (
                  <Link
                    href={author.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex rounded-full border border-brand-dark/12 px-5 py-3 text-sm font-bold text-brand-dark transition-colors hover:border-accent-gold hover:text-accent-gold"
                  >
                    LinkedIn
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 md:py-24">
        <Container>
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-gold">
              Articles
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-dark md:text-4xl">
              All Posts by {author.name}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

