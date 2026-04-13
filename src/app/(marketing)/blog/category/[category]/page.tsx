import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import BlogFilters from "@/components/blog/BlogFilters";
import PostCard from "@/components/blog/PostCard";
import PageHero from "@/components/ui/PageHero";
import {
  getBlogArchiveSummary,
  getBlogCategories,
  getCategoryLabel,
  getPostsByCategorySlug,
} from "@/lib/blog";
import { generateBlogBreadcrumbSchema } from "@/lib/blog/schema";

export function generateStaticParams() {
  return getBlogCategories().map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const categoryLabel = getCategoryLabel(category);

  if (!categoryLabel) {
    return {
      title: "Category Not Found",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${categoryLabel} Articles | econstruct Blog`,
    description: getBlogArchiveSummary(category),
    alternates: {
      canonical: `https://econstructinc.com/blog/category/${category}`,
    },
  };
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const categoryLabel = getCategoryLabel(category);
  const posts = getPostsByCategorySlug(category);

  if (!categoryLabel) {
    notFound();
  }

  const breadcrumbSchema = generateBlogBreadcrumbSchema([
    { name: "Home", url: "https://econstructinc.com" },
    { name: "Blog", url: "https://econstructinc.com/blog" },
    {
      name: categoryLabel,
      url: `https://econstructinc.com/blog/category/${category}`,
    },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PageHero
        title={categoryLabel}
        subtitle={getBlogArchiveSummary(category)}
        breadcrumbs={[{ label: "Blog", href: "/blog" }, { label: categoryLabel }]}
        backgroundImage="/hollywood_hills.png"
        compact
      />

      <section className="bg-secondary py-16 md:py-20">
        <Container>
          <BlogFilters active={category} />
        </Container>
      </section>

      <section className="pb-20 md:pb-24">
        <Container>
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="rounded-[1.75rem] border border-black/8 bg-white p-8 text-body-text shadow-sm">
              Posts in this archive are coming next. For now, use the main blog index to browse all rebuild and modernization articles.
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
