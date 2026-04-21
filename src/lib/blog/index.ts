import { cache } from "react";
import matter from "gray-matter";
import { marked, Renderer } from "marked";
import { blogAuthors, getBlogAuthorBySlug, type BlogAuthor } from "@/lib/blog/authors";
import { rawBlogPosts } from "@/lib/blog/content-manifest";

const POSTS_PER_PAGE = 9;

export interface BlogSource { title: string; url: string; publisher?: string; }
export interface BlogFaqItem { question: string; answer: string; }
export interface BlogTocItem { id: string; title: string; level: 2 | 3; }

interface RawBlogPostFrontmatter {
  title: string; slug: string; description: string; category: string; tags?: string[];
  publishedAt: string; updatedAt: string; authorSlug: string; reviewedBy?: string;
  factCheckedBy?: string; heroImage: string; heroImageWebp?: string; heroImageAlt: string;
  ogImage: string; excerpt: string; targetKeyword: string; takeaways?: string[];
  sources?: BlogSource[]; faq?: BlogFaqItem[]; relatedSlugs?: string[]; localAreas?: string[];
}

export interface BlogPostSummary {
  title: string; slug: string; description: string; excerpt: string; category: string;
  categorySlug: string; tags: string[]; tagSlugs: { name: string; slug: string }[];
  publishedAt: string; updatedAt: string; formattedDate: string; formattedUpdatedDate: string;
  readTime: string; wordCount: number; heroImage: string; heroImageWebp?: string;
  heroImageAlt: string; ogImage: string; author: BlogAuthor; reviewedBy: string;
  factCheckedBy: string; takeaways: string[]; targetKeyword: string; localAreas: string[];
}

export interface BlogPost extends BlogPostSummary { html: string; toc: BlogTocItem[]; sources: BlogSource[]; faq: BlogFaqItem[]; relatedSlugs: string[]; }

function slugify(value: string): string {
  return value.toLowerCase().trim().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/^---[\s\S]*?---/, "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/^> \s?/gm, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~>#-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getWordCount(markdown: string): number {
  return stripMarkdown(markdown).split(/\s+/).filter(Boolean).length;
}

function getReadTime(wordCount: number): string {
  return `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
}

function renderMarkdown(markdown: string) {
  const toc: BlogTocItem[] = [];
  const renderer = new Renderer();
  renderer.heading = function({ tokens, depth }) {
    const text = tokens.map(t => ('text' in t ? t.text : '')).join('');
    const id = slugify(text);
    if (depth === 2 || depth === 3) toc.push({ id, title: text, level: depth });
    return `<h${depth} id="${id}">${this.parser.parseInline(tokens)}</h${depth}>`;
  };
  marked.setOptions({ gfm: true, breaks: false });
  const html = marked.parse(markdown, { renderer }) as string;
  return { html, toc };
}

function parseBlogPost(fileContents: string): BlogPost {
  const { data, content } = matter(fileContents);
  const frontmatter = data as RawBlogPostFrontmatter;
  const author = getBlogAuthorBySlug(frontmatter.authorSlug);
  if (!author) throw new Error(`Unknown blog author: ${frontmatter.authorSlug}`);
  const wordCount = getWordCount(content);
  const { html, toc } = renderMarkdown(content);
  const categorySlug = slugify(frontmatter.category);
  const tags = frontmatter.tags ?? [];
  return {
    title: frontmatter.title, slug: frontmatter.slug, description: frontmatter.description,
    excerpt: frontmatter.excerpt, category: frontmatter.category, categorySlug,
    tags, tagSlugs: tags.map(tag => ({ name: tag, slug: slugify(tag) })),
    publishedAt: frontmatter.publishedAt, updatedAt: frontmatter.updatedAt,
    formattedDate: formatDate(frontmatter.publishedAt), formattedUpdatedDate: formatDate(frontmatter.updatedAt),
    readTime: getReadTime(wordCount), wordCount, heroImage: frontmatter.heroImage,
    heroImageWebp: frontmatter.heroImageWebp || frontmatter.heroImage, heroImageAlt: frontmatter.heroImageAlt,
    ogImage: frontmatter.ogImage, author, reviewedBy: frontmatter.reviewedBy || "Reviewed by econstruct editorial team",
    factCheckedBy: frontmatter.factCheckedBy || "Fact-checked by econstruct project development team",
    takeaways: frontmatter.takeaways ?? [], targetKeyword: frontmatter.targetKeyword,
    localAreas: frontmatter.localAreas ?? [], html, toc, sources: frontmatter.sources ?? [],
    faq: frontmatter.faq ?? [], relatedSlugs: frontmatter.relatedSlugs ?? []
  };
}

const loadBlogPosts = cache((): BlogPost[] => {
  return rawBlogPosts
    .map(parseBlogPost)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
});

export function getAllBlogPosts() { return loadBlogPosts(); }
export function getBlogPostBySlug(slug: string): BlogPost | undefined { return loadBlogPosts().find(p => p.slug === slug); }
export function getRelatedPosts(slug: string, categorySlug: string, tags: string[]) {
  const posts = loadBlogPosts().filter(p => p.slug !== slug);
  const sameCategory = posts.filter(p => p.categorySlug === categorySlug);
  if (sameCategory.length >= 3) return sameCategory.slice(0, 3);
  const tagSet = new Set(tags);
  const related = posts.filter(p => p.tags.some(t => tagSet.has(t)));
  return [...sameCategory, ...related].filter((p, i, self) => self.findIndex(c => c.slug === p.slug) === i).slice(0, 3);
}
export function getBlogCategories() {
  const uniqueCategories = new Map<string, { name: string; slug: string; count: number }>();
  for (const post of loadBlogPosts()) {
    const existing = uniqueCategories.get(post.categorySlug);
    uniqueCategories.set(post.categorySlug, { name: post.category, slug: post.categorySlug, count: (existing?.count ?? 0) + 1 });
  }
  return Array.from(uniqueCategories.values());
}
export function getBlogTags() {
  const uniqueTags = new Map();
  for (const post of loadBlogPosts()) {
    for (const tag of post.tags) {
      const slug = slugify(tag);
      const existing = uniqueTags.get(slug);
      uniqueTags.set(slug, { name: tag, slug, count: (existing?.count ?? 0) + 1 });
    }
  }
  return Array.from(uniqueTags.values());
}
export function getPostsByCategorySlug(slug: string) { return loadBlogPosts().filter(p => p.categorySlug === slug); }
export function getPostsByTagSlug(slug: string) { return loadBlogPosts().filter(p => p.tagSlugs.some(t => t.slug === slug)); }
export function getPostsByAuthorSlug(slug: string) { return loadBlogPosts().filter(p => p.author.slug === slug); }
export function getCategoryLabel(slug: string) { return getBlogCategories().find(c => c.slug === slug)?.name; }
export function getTagLabel(slug: string) { return getBlogTags().find(t => t.slug === slug)?.name; }
export function getBlogIndexPages(count: number) { return Math.max(1, Math.ceil(count / POSTS_PER_PAGE)); }
export function paginatePosts<T>(posts: T[], page: number) { return posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE); }
export function getBlogArchiveSummary(slug?: string) {
  const summaries: Record<string, string> = {
    "fire-rebuilds": "Field-tested guidance for homeowners rebuilding after wildfire loss across Los Angeles County.",
    "luxury-modernization": "Budget, scope, and systems insight for premium renovations in LA's most demanding neighborhoods.",
    "custom-homes": "Practical guidance for ground-up custom homes, hillside construction, and design-build coordination.",
    "industry-insights": "Code, permitting, and market intelligence for owners making high-stakes construction decisions.",
    "local-guides": "Neighborhood-specific planning guidance for Pacific Palisades, Brentwood, Santa Monica, Altadena, and beyond."
  };
  return slug ? (summaries[slug] || "Expert construction insight for Los Angeles homeowners, rebuild clients, and investors.") : "Practical rebuild, modernization, and custom home insight from active Los Angeles construction work.";
}
export function getAllBlogAuthors() { return blogAuthors; }
