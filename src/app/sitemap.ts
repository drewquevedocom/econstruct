import type { MetadataRoute } from "next";
import { promptServices } from "@/lib/data/prompt-services";
import { promptProjects } from "@/lib/data/prompt-projects";
import { SITE_URL } from "@/lib/constants";
import { getAllBlogPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;
  const now = new Date();

  const staticPages = [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${baseUrl}/projects`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/resources`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${baseUrl}/resources/fire-rebuild-guide`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/resources/cost-calculator`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/free-consultation`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${baseUrl}/reviews`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/faq`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/service-areas`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/for-architects`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/for-insurance-adjusters`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/for-investors`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/international-luxury-clients`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/trusted-partner-program`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 },
  ];

  const promptServicePages = promptServices.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const promptProjectPages = promptProjects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const blogIndexPage = {
    url: `${baseUrl}/blog`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  };

  const blogPages = getAllBlogPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...promptServicePages,
    ...promptProjectPages,
    blogIndexPage,
    ...blogPages,
  ];
}

