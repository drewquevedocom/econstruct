import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3 } from "lucide-react";
import type { BlogPostSummary } from "@/lib/blog";

interface PostCardProps {
  post: BlogPostSummary;
  featured?: boolean;
}

export default function PostCard({ post, featured = false }: PostCardProps) {
  if (featured) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group grid overflow-hidden rounded-[2rem] border border-black/8 bg-white shadow-[0_24px_60px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(0,0,0,0.1)] lg:grid-cols-[1.2fr_0.95fr]"
      >
        <div className="relative h-full min-h-[320px] overflow-hidden">
          <Image
            src={post.heroImage}
            alt={post.heroImageAlt}
            width={1600}
            height={900}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
        </div>
        <div className="flex flex-col justify-center p-8 md:p-10">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-accent-gold/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-accent-gold">
              {post.category}
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-body-text/70">
              Featured
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-brand-dark transition-colors group-hover:text-accent-gold md:text-4xl">
            {post.title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-body-text md:text-lg">
            {post.excerpt}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-5 text-sm font-medium text-body-text/80">
            <span className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-accent-gold" />
              {post.formattedDate}
            </span>
            <span className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-accent-gold" />
              {post.readTime}
            </span>
          </div>
          <div className="mt-8 inline-flex items-center gap-2 font-bold text-brand-dark transition-colors group-hover:text-accent-gold">
            Read the full article
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-black/8 bg-white shadow-[0_18px_44px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.09)]"
    >
      <div className="relative">
        <Image
          src={post.heroImage}
          alt={post.heroImageAlt}
          width={1600}
          height={900}
          className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute left-4 top-4">
          <span className="rounded-full bg-white/92 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-dark shadow-sm">
            {post.category}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-body-text/75">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-accent-gold" />
            {post.formattedDate}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5 text-accent-gold" />
            {post.readTime}
          </span>
        </div>
        <h3 className="text-2xl font-bold leading-tight text-brand-dark transition-colors group-hover:text-accent-gold">
          {post.title}
        </h3>
        <p className="mt-4 flex-1 text-sm leading-7 text-body-text">
          {post.excerpt}
        </p>
        <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-dark transition-colors group-hover:text-accent-gold">
          Read article
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
