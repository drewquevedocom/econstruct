import { temporaryProjectSummaries } from "@/lib/data/temp-projects";

export interface PromptProjectSummary {
  slug: string;
  shortTitle: string;
  title: string;
  description: string;
  image: string;
  location: string;
  neighborhood: string;
  scope: string;
  completionDate: string;
  category: string;
  highlights: string[];
}

const basePromptProjectSummaries: PromptProjectSummary[] = [
  {
    slug: "pacific-palisades-fire-rebuild",
    shortTitle: "Pacific Palisades Rebuild",
    title: "Pacific Palisades Fire Rebuild — WUI-Compliant Contemporary Home by econstruct",
    description:
      "A full ground-up fire rebuild in Pacific Palisades following the January 2025 Palisades Fire. econstruct delivered a Chapter 7A WUI-compliant contemporary home with non-combustible stucco and natural stone cladding, Class A standing seam metal roof, large-format fire-rated aluminum windows, defensible space landscaping, and unobstructed Pacific Ocean views from both levels.",
    image: "/projects/Palisades_-_Hero_Shot_202607071557.jpeg",
    location: "Pacific Palisades, Los Angeles, CA",
    neighborhood: "Pacific Palisades",
    scope: "Fire Rebuild — WUI-Compliant New Construction",
    completionDate: "2026",
    category: "Fire Rebuild",
    highlights: [
      "Chapter 7A WUI-compliant construction — fully permitted and inspected",
      "Non-combustible exterior: stucco, natural stone, Class A metal roof",
      "Fire-rated large-format aluminum window and door systems",
      "Defensible space landscaping — drought-tolerant and ember-resistant",
      "Unobstructed Pacific Ocean views from both levels",
      "Full design-build delivery — one contractor from permit to handoff",
    ],
  },
  {
    slug: "calabasas-mediterranean-new-home-build",
    shortTitle: "Calabasas Mediterranean Estate",
    title: "Calabasas Mediterranean Estate - New Custom Home Build",
    description:
      "A ground-up California Mediterranean custom home in Calabasas, delivering a 6,500 sq ft estate with stucco facade, clay tile roof, courtyard entry, chef's kitchen, indoor-outdoor great room, and resort-style backyard. Built by econstruct, one of Calabasas' most trusted luxury home builders.",
    image: "/projects/calabas_1.jpeg",
    location: "Calabasas, CA",
    neighborhood: "Calabasas",
    scope: "Ground-Up New Construction",
    completionDate: "2024",
    category: "Custom Home Build",
    highlights: [
      "6,500 sq ft custom California Mediterranean estate",
      "5 bedrooms, 6 bathrooms with primary suite retreat",
      "Chef's kitchen with butler's pantry and oversized island",
      "Indoor-outdoor great room with disappearing glass walls",
      "Resort-style backyard with pool, spa, and outdoor kitchen",
    ],
  },
  {
    slug: "san-vincente-adu",
    shortTitle: "San Vincente ADU",
    title: "San Vincente ADU - Completed Residential ADU Project",
    description:
      "A newly completed San Vincente ADU project showcasing clean lines, premium finishes, and a polished indoor-outdoor feel. Built to deliver comfort, style, and long-term value.",
    image: "/projects/05_web.jpg",
    location: "Santa Monica, CA",
    neighborhood: "San Vincente",
    scope: "Detached ADU Construction",
    completionDate: "2026",
    category: "Home Remodel",
    highlights: [
      "Newly completed ADU with premium fit and finish",
      "Clean architectural lines and modern detailing",
      "High-quality interior execution throughout",
      "Beautiful final presentation across all spaces",
      "Designed for long-term usability and value",
    ],
  },
  {
    slug: "newcomb-road-full-home-transformation",
    shortTitle: "Newcomb Road",
    title: "Newcomb Road - Complete Home Transformation",
    description:
      "A full interior and exterior overhaul that turned an outdated residence into a contemporary family home - new kitchen, master bath, hardwood floors, opened floor plan, repainted facade, and custom concrete patio.",
    image: "/projects/newcomb-road-hero.jpg",
    location: "Los Angeles, CA",
    neighborhood: "Los Angeles",
    scope: "Full Interior & Exterior Remodel",
    completionDate: "2023",
    category: "Home Remodel",
    highlights: [
      "Kitchen with marble countertops & large island",
      "Master bath with freestanding tub & frameless glass shower",
      "Hardwood floors throughout",
      "Custom built-ins & opened floor plan",
      "New concrete patio & custom wood fence",
    ],
  },
  {
    slug: "saddlebow-50-bell-canyon-hillside-lift",
    shortTitle: "50 Saddlebow - Hillside Lift",
    title: "50 Saddlebow Rd - Custom Hillside Lift System, Bell Canyon",
    description:
      "A one-of-a-kind engineering solution for a Bell Canyon hillside estate: a custom lift system engineered to connect the main residence to a lower canyon terrace, unlocking potential for an ADU, pool, or tennis court.",
    image: "/projects/saddlebow-50-hero.jpg",
    location: "Bell Canyon, CA",
    neighborhood: "Bell Canyon",
    scope: "Custom Engineered Hillside Lift System",
    completionDate: "2023",
    category: "Custom Engineering",
    highlights: [
      "950 lb capacity lift - engineered for daily residential use",
      "Reinforced concrete landing poured at canyon base",
      "Lift cab finished to match home's modern exterior",
      "County-code redundant fail-safe systems",
      "Unlocks site potential: ADU, pool, tennis court",
    ],
  },
  {
    slug: "marine-avenue-condo-lawndale-coastal-remodel",
    shortTitle: "Marine Ave Condo",
    title: "Marine Avenue Condo - Coastal California Living, Lawndale",
    description:
      "A 3-bed, 3-bath Lawndale condo blocks from the beach - fully reconfigured floor plan, expanded kitchen with peninsula, spa-inspired bathrooms, and a private balcony rebuilt with firepit and new railings.",
    image: "/projects/20220123_121812-29.webp",
    location: "Lawndale, CA",
    neighborhood: "Lawndale / South Bay",
    scope: "Full Interior & Exterior Condo Remodel",
    completionDate: "2011",
    category: "Condo Remodel",
    highlights: [
      "Full floor plan reconfiguration - walls removed, doorways enlarged",
      "Kitchen with peninsula, bar-height seating & pocket doors",
      "Porcelain plank tile & quartz countertops throughout",
      "Spa-inspired bathrooms with frosted glass doors",
      "Private balcony rebuilt with firepit & new railings",
    ],
  },
  {
    slug: "devista-hollywood-hills-luxury-remodel",
    shortTitle: "Devista - Hollywood Hills",
    title: "Devista - Hollywood Hills Luxury Remodel & Expansion",
    description:
      "A 1980s Hollywood Hills residence fully reimagined for modern family living - chef's kitchen, sliding glass walls opening to a new pool patio, freestanding spa, built-in BBQ, and integrated smart home technology.",
    image: "/projects/devista-hero.jpg",
    location: "Hollywood Hills, Los Angeles, CA",
    neighborhood: "Hollywood Hills",
    scope: "Full Interior & Exterior Luxury Remodel",
    completionDate: "2017",
    category: "Luxury Remodel",
    highlights: [
      "Galley kitchen transformed into open chef's kitchen with quartz island",
      "New sliding glass walls opening to outdoor patio & pool",
      "Pool resurfaced + freestanding spa added",
      "Built-in outdoor BBQ kitchen",
      "Integrated smart home technology throughout",
    ],
  },
  {
    slug: "saddlebow-54-bell-canyon-luxury-remodel",
    shortTitle: "54 Saddlebow - Bell Canyon",
    title: "54 Saddlebow Rd - Luxury Open-Concept Remodel, Bell Canyon",
    description:
      "A late-1970s Bell Canyon estate rebuilt for contemporary living - walls removed, chef's kitchen with smart home integration, outdoor fireplace lounge, drought-tolerant landscaping, and premium finishes throughout.",
    image: "/projects/saddlebow-54-hero.jpg",
    location: "Bell Canyon, CA",
    neighborhood: "Bell Canyon",
    scope: "Full Interior & Exterior Luxury Remodel",
    completionDate: "2014",
    category: "Luxury Remodel",
    highlights: [
      "Full open-concept floor plan - walls removed throughout",
      "Chef's kitchen with large island & touchpad cabinetry",
      "Integrated smart home tech & AV system",
      "Outdoor fireplace lounge",
      "Drought-tolerant landscaping",
    ],
  },
];

const byDateDesc = (a: PromptProjectSummary, b: PromptProjectSummary) =>
  Number.parseInt(b.completionDate, 10) - Number.parseInt(a.completionDate, 10);

// Slugs from the base array that belong in the high-end section (not completed)
const HIGH_END_BASE_SLUGS = new Set(["calabasas-mediterranean-new-home-build"]);

// Featured hero project
export const featuredProjectSummary = basePromptProjectSummaries[0];

// High-end showcase projects — temp projects + promoted base projects, sorted by date
export const highEndProjectSummaries = [
  ...temporaryProjectSummaries,
  ...basePromptProjectSummaries.slice(1).filter((p) => HIGH_END_BASE_SLUGS.has(p.slug)),
].sort(byDateDesc);

// econstruct completed projects — base projects (minus featured and high-end), sorted by date
export const completedProjectSummaries = basePromptProjectSummaries
  .slice(1)
  .filter((p) => !HIGH_END_BASE_SLUGS.has(p.slug))
  .sort(byDateDesc);

// Combined for schema and any other consumers
export const promptProjectSummaries: PromptProjectSummary[] = [
  featuredProjectSummary,
  ...highEndProjectSummaries,
  ...completedProjectSummaries,
];
