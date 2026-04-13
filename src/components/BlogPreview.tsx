import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllBlogPosts } from "@/lib/blog";

export default function BlogPreview() {
  const posts = getAllBlogPosts().slice(0, 3);

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-6 flex w-fit items-center gap-2 rounded-full border border-brand-dark/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-brand-dark">
              <span>INSIGHTS</span>
              <span className="text-accent-gold">&bull;</span>
              <span>LATEST NEWS</span>
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-brand-dark md:text-5xl lg:text-5xl">
              Blog
            </h2>
          </div>

          <div>
            <Link
              href="/blog"
              className="group flex items-center gap-3 border-b-2 border-brand-dark/20 pb-1 font-bold text-brand-dark transition-colors hover:border-accent-gold hover:text-accent-gold"
            >
              View All Articles
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {posts.map((post) => (
            <div key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:shadow-xl"
              >
                <div className="relative h-60 w-full overflow-hidden">
                  <Image
                    src={post.heroImage}
                    alt={post.heroImageAlt}
                    width={1600}
                    height={900}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute left-4 top-4 rounded-full bg-white/90 px-4 py-1.5 text-xs font-bold text-brand-dark shadow-sm backdrop-blur-sm">
                    {post.formattedDate}
                  </div>
                </div>
                <div className="flex flex-grow flex-col p-8">
                  <h3 className="mb-4 text-xl font-bold leading-snug text-brand-dark transition-colors group-hover:text-accent-gold">
                    {post.title}
                  </h3>
                  <p className="mb-8 flex-grow text-sm font-medium leading-relaxed text-gray-500">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto flex items-center gap-2 text-sm font-bold tracking-wide text-brand-dark transition-colors group-hover:text-accent-gold">
                    Read More
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-2" />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
