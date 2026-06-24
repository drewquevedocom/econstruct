import { redirect } from "next/navigation";

export async function generateStaticParams() {
  return [];
}

export default async function TemporaryProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/projects/${slug}`);
}
