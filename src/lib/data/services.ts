export interface Service {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  image: string;
  icon: string;
  features: string[];
  priceRange?: string;
  keywords: string[];
}

export const services: Service[] = [
  {
    title: "Fire Rebuild",
    slug: "fire-rebuild",
    shortDescription: "Expert fire damage reconstruction with WUI compliance and insurance coordination.",
    description: "Comprehensive fire rebuild services for Palisades, Altadena, and Malibu homeowners. We handle insurance coordination, WUI-compliant construction, and expedited permitting to get you home faster.",
    image: "/fire_rebuild_hero.png",
    icon: "Flame",
    features: [
      "Insurance gap analysis & coordination",
      "WUI zone compliant construction",
      "Expedited permitting (3× faster)",
      "Full architectural design services",
      "Defensible space landscaping",
      "Smart home integration",
    ],
    priceRange: "$450 - $800+/sq ft",
    keywords: ["palisades fire rebuild contractor", "fire damage home reconstruction los angeles", "WUI zone construction specialist", "la fire rebuild", "wildfire home rebuild"],
  },
  {
    title: "Luxury Modernization",
    slug: "luxury-modernization",
    shortDescription: "Transform your existing home with premium materials and modern design.",
    description: "High-end home modernization for Brentwood, Santa Monica, and Bel Air residences. We preserve the character of your neighborhood while bringing your home into the future with premium finishes and smart technology.",
    image: "/luxury_mod_service.png",
    icon: "Sparkles",
    features: [
      "Design-preserve pricing methodology",
      "Premium material sourcing",
      "Structural engineering",
      "Smart home automation",
      "Energy efficiency upgrades",
      "Indoor-outdoor living design",
    ],
    priceRange: "$450 - $800+/sq ft",
    keywords: ["luxury home remodel los angeles", "high-end renovation contractor LA", "brentwood home modernization", "santa monica luxury remodel"],
  },
  {
    title: "Ground-Up Custom Homes",
    slug: "custom-homes",
    shortDescription: "Your lot, your vision — expertly crafted from foundation to finish.",
    description: "Full-service custom home construction from lot evaluation to move-in. We partner with top architects and deliver homes that exceed expectations in quality, timeline, and value.",
    image: "/custom_home_service.png",
    icon: "Home",
    features: [
      "Lot evaluation & feasibility",
      "Architect partnership coordination",
      "Full permit management",
      "WUI-ready construction",
      "Premium finish packages",
      "Landscape architecture",
    ],
    priceRange: "$500 - $1,000+/sq ft",
    keywords: ["custom home builder los angeles", "ground-up construction LA", "luxury new construction los angeles"],
  },
  {
    title: "ADU & Additions",
    slug: "adu-construction",
    shortDescription: "Maximize your property value with expertly built ADUs and home additions.",
    description: "Take advantage of California's ADU-friendly regulations to add living space, rental income, or multigenerational housing to your property. From garage conversions to detached units.",
    image: "/custom_home_service.png",
    icon: "Building2",
    features: [
      "California ADU regulation expertise",
      "Garage conversions",
      "Detached ADU construction",
      "Home additions & extensions",
      "Permit navigation",
      "Rental-ready finishing",
    ],
    priceRange: "$350 - $600+/sq ft",
    keywords: ["adu builder los angeles", "adu construction LA", "garage conversion contractor", "home addition los angeles"],
  },
];
