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

export const promptProjectSummaries: PromptProjectSummary[] = [
  {
    slug: "san-vincente-adu",
    shortTitle: "San Vincente ADU",
    title: "San Vincente ADU - Completed Residential ADU Project",
    description:
      "A newly completed San Vincente ADU project showcasing clean lines, premium finishes, and a polished indoor-outdoor feel. Built to deliver comfort, style, and long-term value.",
    image: "/projects/05_web.jpg",
    location: "Los Angeles, CA",
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
    completionDate: "2023",
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
    completionDate: "2022",
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
    completionDate: "2021",
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
