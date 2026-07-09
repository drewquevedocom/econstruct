import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Explicit allow groups help override Cloudflare-managed AI crawler blocks
      // when the edge prepends its own robots content.
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Applebot", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Bingbot", allow: "/" },
      {
        userAgent: [
          "Googlebot",
          "Bingbot",
          "GPTBot",
          "ChatGPT-User",
          "OAI-SearchBot",
          "ClaudeBot",
          "PerplexityBot",
          "Applebot",
        ],
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/crm/", "/partners/"],
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/crm/", "/partners/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

