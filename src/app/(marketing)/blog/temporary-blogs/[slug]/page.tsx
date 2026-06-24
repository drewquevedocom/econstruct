import { notFound, redirect } from "next/navigation";
import { getBlogPostBySlug } from "@/lib/blog";

export function generateStaticParams() {
  return [];
}

export default async function TemporaryBlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  redirect(`/blog/${slug}`);
}
