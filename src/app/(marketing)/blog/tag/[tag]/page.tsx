import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import PostCard from "@/components/blog/PostCard";
import { getBlogTags, getPostsByTagSlug, getTagLabel } from "@/lib/blog";
import { generateBlogBreadcrumbSchema } from "@/lib/blog/schema";
import PageHero from "@/components/ui/PageHero";

export function generateStaticParams() {
  return getBlogTags().map((tag) => ({ tag: tag.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const label = getTagLabel(tag);

  if (!label) {
    return {
      title: "Tag Not Found",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${label} Articles | econstruct Blog`,
    description: `Tagged content related to ${label} on the econstruct blog.`,
    alternates: {
      canonical: `https://econstructinc.com/blog/tag/${tag}`,
    },
  };
}

export default async function BlogTagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const label = getTagLabel(tag);
  const posts = getPostsByTagSlug(tag);

  if (!label) {
    notFound();
  }

  const breadcrumbSchema = generateBlogBreadcrumbSchema([
    { name: "Home", url: "https://econstructinc.com" },
    { name: "Blog", url: "https://econstructinc.com/blog" },
    { name: label, url: `https://econstructinc.com/blog/tag/${tag}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PageHero
        title={label}
        subtitle={`Articles connected to ${label}, curated for homeowners, architects, adjusters, and investors evaluating complex Los Angeles construction decisions.`}
        breadcrumbs={[{ label: "Blog", href: "/blog" }, { label: label }]}
        backgroundImage="/hollywood_hills.png"
        compact
      />

      <section className="py-20 md:py-24">
        <Container>
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
