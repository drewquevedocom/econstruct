export interface Project {
  title: string;
  slug: string;
  category: "fire-rebuild" | "luxury" | "custom" | "adu";
  neighborhood: string;
  description: string;
  heroImage: string;
  images: string[];
  specs: {
    sqft?: string;
    timeline?: string;
    value?: string;
    scope?: string;
  };
  testimonial?: {
    quote: string;
    name: string;
  };
  featured?: boolean;
}

export const projects: Project[] = [
  {
    title: "Palisades Beach Modern",
    slug: "palisades-beach-modern",
    category: "fire-rebuild",
    neighborhood: "Pacific Palisades",
    description: "Complete fire rebuild of a 4,200 sq ft oceanview residence. WUI-compliant construction with modern architectural design, defensible landscaping, and smart home integration throughout.",
    heroImage: "/fire_rebuild_service.png",
    images: ["/fire_rebuild_service.png"],
    specs: { sqft: "4,200", timeline: "14 months", value: "$4.2M", scope: "Full Rebuild" },
    testimonial: {
      quote: "eConstruct stepped in after the devastating fire and completely handled our complex hillside rebuild. Our new home is an absolute masterpiece.",
      name: "Sarah C.",
    },
    featured: true,
  },
  {
    title: "Brentwood Estate Modernization",
    slug: "brentwood-estate-modernization",
    category: "luxury",
    neighborhood: "Brentwood",
    description: "Major luxury modernization of a 1960s estate. Complete kitchen and living redesign, master suite expansion, smart home automation, and indoor-outdoor integration.",
    heroImage: "/luxury_mod_service.png",
    images: ["/luxury_mod_service.png"],
    specs: { sqft: "5,800", timeline: "10 months", value: "$3.8M", scope: "Major Remodel" },
    testimonial: {
      quote: "The craftsmanship is flawless, the communication was stellar, and they kept an incredibly tight schedule.",
      name: "James M.",
    },
    featured: true,
  },
  {
    title: "Santa Monica Contemporary",
    slug: "santa-monica-contemporary",
    category: "custom",
    neighborhood: "Santa Monica",
    description: "Ground-up custom build on a hillside lot. Modern contemporary design with floor-to-ceiling glass, infinity pool, and panoramic ocean views.",
    heroImage: "/custom_home_service.png",
    images: ["/custom_home_service.png"],
    specs: { sqft: "6,100", timeline: "18 months", value: "$5.5M", scope: "New Construction" },
    testimonial: {
      quote: "Building a ground-up custom luxury home is terrifying, but eConstruct made it an incredible experience.",
      name: "Elena R.",
    },
    featured: true,
  },
  {
    title: "Malibu Fire Restoration",
    slug: "malibu-fire-restoration",
    category: "fire-rebuild",
    neighborhood: "Malibu",
    description: "Comprehensive fire restoration of a coastal Malibu property. Rebuilt with enhanced fire-resistant materials and WUI-compliant design.",
    heroImage: "/fire_rebuild_service.png",
    images: ["/fire_rebuild_service.png"],
    specs: { sqft: "3,600", timeline: "12 months", value: "$3.2M", scope: "Full Rebuild" },
    featured: false,
  },
  {
    title: "Bel Air Hillside Custom",
    slug: "bel-air-hillside-custom",
    category: "custom",
    neighborhood: "Bel Air",
    description: "Luxury custom home built into a challenging hillside lot with engineered foundations, cantilevered design, and panoramic city views.",
    heroImage: "/custom_home_service.png",
    images: ["/custom_home_service.png"],
    specs: { sqft: "7,200", timeline: "22 months", value: "$8.1M", scope: "New Construction" },
    featured: false,
  },
  {
    title: "Venice ADU Suite",
    slug: "venice-adu-suite",
    category: "adu",
    neighborhood: "Venice",
    description: "Detached ADU with full kitchen, bathroom, and private entrance. Designed as a rental unit with premium finishes.",
    heroImage: "/custom_home_service.png",
    images: ["/custom_home_service.png"],
    specs: { sqft: "750", timeline: "5 months", value: "$380K", scope: "ADU Construction" },
    featured: false,
  },
];

export const projectCategories = [
  { label: "All", value: "all" },
  { label: "Fire Rebuilds", value: "fire-rebuild" },
  { label: "Luxury Modernization", value: "luxury" },
  { label: "Custom Homes", value: "custom" },
  { label: "ADU & Additions", value: "adu" },
] as const;
