export interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    title: "The Complete Guide to LA Fire Rebuilds in 2026",
    slug: "fire-rebuild-guide-2026",
    excerpt: "Everything you need to know about rebuilding after the Palisades and Altadena fires — from insurance claims to WUI compliance.",
    category: "Fire Rebuilds",
    date: "2026-03-01",
    readTime: "12 min",
    image: "/fire_rebuild_hero.png",
    featured: true,
  },
  {
    title: "WUI Zone Construction: What Every LA Homeowner Should Know",
    slug: "wui-zone-construction-guide",
    excerpt: "Understanding Wildland-Urban Interface requirements and how they affect your rebuild or new construction project.",
    category: "Building Codes",
    date: "2026-02-15",
    readTime: "8 min",
    image: "/fire_rebuild_hero.png",
  },
  {
    title: "Luxury Home Modernization: ROI-Driven Renovations",
    slug: "luxury-modernization-roi",
    excerpt: "How strategic modernization can increase your home's value by 30-50% while preserving neighborhood character.",
    category: "Luxury Living",
    date: "2026-02-01",
    readTime: "6 min",
    image: "/luxury_mod_service.png",
  },
  {
    title: "ADU Construction in California: 2026 Regulations",
    slug: "adu-california-2026",
    excerpt: "California's evolving ADU laws make it easier than ever to add value to your property. Here's what's changed.",
    category: "ADU",
    date: "2026-01-20",
    readTime: "7 min",
    image: "/custom_home_service.png",
  },
  {
    title: "Choosing the Right Contractor for Your High-End Project",
    slug: "choosing-right-contractor",
    excerpt: "Five critical questions to ask before hiring a luxury residential contractor in Los Angeles.",
    category: "Expert Advice",
    date: "2026-01-10",
    readTime: "5 min",
    image: "/about-image.png",
  },
];
