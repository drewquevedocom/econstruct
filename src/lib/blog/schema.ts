import type { BlogAuthor } from "@/lib/blog/authors";
import type { BlogFaqItem, BlogPost } from "@/lib/blog";
import { COMPANY, SITE_URL } from "@/lib/constants";

const baseUrl = SITE_URL;

export function generateBlogArticleSchema(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: [`${baseUrl}${post.ogImage}`],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: `${baseUrl}/blog/${post.slug}`,
    articleSection: post.category,
    keywords: post.tags.join(", "),
    wordCount: post.wordCount,
    author: {
      "@type": "Person",
      name: post.author.name,
      url: `${baseUrl}/blog/author/${post.author.slug}`,
      image: `${baseUrl}${post.author.image}`,
      jobTitle: post.author.title,
    },
    publisher: {
      "@type": "Organization",
      name: COMPANY.name,
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/econstruct_logo.png`,
      },
    },
  };
}

export function generateBlogBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateBlogFaqSchema(faqItems: BlogFaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function generateAuthorPersonSchema(author: BlogAuthor) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    jobTitle: author.title,
    image: `${baseUrl}${author.image}`,
    url: `${baseUrl}/blog/author/${author.slug}`,
    sameAs: author.linkedin ? [author.linkedin] : [],
    worksFor: {
      "@type": "Organization",
      name: COMPANY.name,
      url: baseUrl,
    },
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY.name,
    url: baseUrl,
    logo: `${baseUrl}/econstruct_logo.png`,
    sameAs: Object.values(COMPANY.social),
  };
}

