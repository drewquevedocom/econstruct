export interface PromptProjectPage {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  image: string;
  gallery: { src: string; alt: string; caption: string }[];
  serviceSlug: string;
  location: string;
  neighborhood: string;
  scope: string;
  timeline: string;
  squareFootage: string;
  completionDate: string;
  category: string;
  highlights: string[];
  heroTitle: string;
  heroSubtitle: string;
  challenge: string[];
  approach: string[];
  build: string[];
  result: string[];
  takeaways: string[];
  testimonial?: { quote: string; name: string };
  youtubeUrl?: string;
}

export const promptProjects: PromptProjectPage[] = [
  {
    slug: "san-vincente-adu",
    shortTitle: "San Vincente ADU",
    title: "San Vincente ADU - Completed Residential ADU Project",
    description:
      "A newly completed San Vincente ADU project showcasing clean lines, premium finishes, and a polished indoor-outdoor feel. Built to deliver comfort, style, and long-term value.",
    image: "/projects/05_web.jpg",
    gallery: [
      { src: "/projects/05_web.jpg", alt: "San Vincente ADU completed project photo 05", caption: "San Vincente ADU - completed view 05" },
      { src: "/projects/01_web.jpg", alt: "San Vincente ADU completed project photo 01", caption: "San Vincente ADU - completed view 01" },
      { src: "/projects/03_web.jpg", alt: "San Vincente ADU completed project photo 03", caption: "San Vincente ADU - completed view 03" },
      { src: "/projects/04_web.jpg", alt: "San Vincente ADU completed project photo 04", caption: "San Vincente ADU - completed view 04" },
      { src: "/projects/06_web.jpg", alt: "San Vincente ADU completed project photo 06", caption: "San Vincente ADU - completed view 06" },
      { src: "/projects/07_web.jpg", alt: "San Vincente ADU completed project photo 07", caption: "San Vincente ADU - completed view 07" },
      { src: "/projects/13_web.jpg", alt: "San Vincente ADU completed project photo 13", caption: "San Vincente ADU - completed view 13" },
      { src: "/projects/14_web.jpg", alt: "San Vincente ADU completed project photo 14", caption: "San Vincente ADU - completed view 14" },
      { src: "/projects/17_web.jpg", alt: "San Vincente ADU completed project photo 17", caption: "San Vincente ADU - completed view 17" },
      { src: "/projects/19_web.jpg", alt: "San Vincente ADU completed project photo 19", caption: "San Vincente ADU - completed view 19" },
      { src: "/projects/21_web.jpg", alt: "San Vincente ADU completed project photo 21", caption: "San Vincente ADU - completed view 21" },
      { src: "/projects/22_web.jpg", alt: "San Vincente ADU completed project photo 22", caption: "San Vincente ADU - completed view 22" },
      { src: "/projects/25_web.jpg", alt: "San Vincente ADU completed project photo 25", caption: "San Vincente ADU - completed view 25" },
      { src: "/projects/26_web.jpg", alt: "San Vincente ADU completed project photo 26", caption: "San Vincente ADU - completed view 26" },
      { src: "/projects/27_web.jpg", alt: "San Vincente ADU completed project photo 27", caption: "San Vincente ADU - completed view 27" },
      { src: "/projects/30_web.jpg", alt: "San Vincente ADU completed project photo 30", caption: "San Vincente ADU - completed view 30" },
      { src: "/projects/31_web.jpg", alt: "San Vincente ADU completed project photo 31", caption: "San Vincente ADU - completed view 31" },
      { src: "/projects/34_web.jpg", alt: "San Vincente ADU completed project photo 34", caption: "San Vincente ADU - completed view 34" },
      { src: "/projects/37_web.jpg", alt: "San Vincente ADU completed project photo 37", caption: "San Vincente ADU - completed view 37" },
      { src: "/projects/38_web.jpg", alt: "San Vincente ADU completed project photo 38", caption: "San Vincente ADU - completed view 38" },
      { src: "/projects/39_web.jpg", alt: "San Vincente ADU completed project photo 39", caption: "San Vincente ADU - completed view 39" },
    ],
    serviceSlug: "home-additions-los-angeles",
    location: "Los Angeles, CA",
    neighborhood: "San Vincente",
    scope: "Detached ADU Construction",
    timeline: "Completed",
    squareFootage: "Custom ADU",
    completionDate: "2026",
    category: "Home Remodel",
    highlights: [
      "Newly completed ADU with premium fit and finish",
      "Clean architectural lines and modern detailing",
      "High-quality interior execution throughout",
      "Beautiful final presentation across all spaces",
      "Designed for long-term usability and value",
    ],
    heroTitle: "San Vincente ADU - Newly Completed Project",
    heroSubtitle: "A beautiful newly completed ADU project in Los Angeles, delivered with clean execution and premium finishes.",
    challenge: [
      "The goal was to deliver a highly polished ADU with a strong visual identity and practical day-to-day livability.",
      "With limited public project details, the team prioritized craftsmanship quality, consistency, and a complete final presentation.",
    ],
    approach: [
      "eConstruct managed the project with a detail-first build approach, aligning materials, finishes, and layout decisions to maintain a cohesive result.",
      "Execution focused on clean lines, durable selections, and smooth transitions between interior zones.",
    ],
    build: [
      "Construction moved from structure through finishes with strict quality control at each stage to maintain premium standards.",
      "The completed project reflects careful coordination across all trades and a final level of polish throughout the home.",
    ],
    result: [
      "San Vincente ADU is now complete and stands as a beautiful showcase project on the eConstruct portfolio.",
      "The finished build presents as both visually elevated and highly functional for residential use.",
    ],
    takeaways: [
      "A detail-driven build process is what creates a premium ADU outcome.",
      "Consistent material and finish decisions keep the final result cohesive.",
      "High-quality execution at every stage improves long-term value and performance.",
    ],
  },
  {
    slug: "newcomb-road-full-home-transformation",
    shortTitle: "Newcomb Road",
    title: "Newcomb Road — Complete Home Transformation",
    description:
      "A full interior and exterior overhaul that turned an outdated residence into a contemporary family home — new kitchen, master bath, hardwood floors, opened floor plan, repainted façade, and custom concrete patio.",
    image: "/projects/newcomb-road-hero.jpg",
    gallery: [
      { src: "/projects/newcomb-road-hero.jpg", alt: "Newcomb Road exterior after remodel — white stucco home surrounded by mature trees with new staircase", caption: "Exterior — fresh white stucco façade, new exterior staircase, wooded setting" },
      { src: "/projects/Untitled-design-2023-10-19T154306.166.webp", alt: "Newcomb Road exterior deck with wood railings and mature trees", caption: "Rear deck — custom wood railings and landscaped surroundings" },
      { src: "/projects/Untitled-design-2023-10-19T154528.592.webp", alt: "Newcomb Road hillside exterior view with natural landscaping", caption: "Exterior hillside view — refreshed façade and natural setting" },
      { src: "/projects/Untitled-design-2023-10-19T154958.982.webp", alt: "Newcomb Road kitchen with large island and pendant lighting", caption: "Kitchen island — pendant lighting, seating, and premium finishes" },
      { src: "/projects/Untitled-design-2023-10-19T155017.194.webp", alt: "Newcomb Road kitchen appliances and cabinetry detail", caption: "Kitchen appliances — high-end integrated appliances and white cabinetry" },
      { src: "/projects/Untitled-design-2023-10-19T155044.095.webp", alt: "Newcomb Road kitchen under-cabinet lighting and countertop detail", caption: "Kitchen detail — under-cabinet lighting and marble countertops" },
      { src: "/projects/Untitled-design-2023-10-19T155100.028.webp", alt: "Newcomb Road living room with vaulted ceilings and hardwood floors", caption: "Living room — vaulted ceilings, hardwood floors, open floor plan" },
      { src: "/projects/Untitled-design-2023-10-19T155139.368.webp", alt: "Newcomb Road living room fireplace and contemporary interior", caption: "Living room fireplace — contemporary surround and recessed lighting" },
      { src: "/projects/Untitled-design-2023-10-23T105802.767.webp", alt: "Newcomb Road garage and exterior front view", caption: "Exterior — painted façade and concrete driveway" },
      { src: "/projects/Untitled-design-2023-10-23T105827.240.webp", alt: "Newcomb Road exterior staircase and landscaping", caption: "Exterior staircase — custom concrete steps and landscaped entry" },
    ],
    serviceSlug: "luxury-home-builder-los-angeles",
    location: "Los Angeles, CA",
    neighborhood: "Los Angeles",
    scope: "Full Interior & Exterior Remodel",
    timeline: "8 months",
    squareFootage: "2,400 sq ft",
    completionDate: "2023",
    category: "Home Remodel",
    highlights: [
      "Kitchen with marble countertops & large island",
      "Master bath with freestanding tub & frameless glass shower",
      "Hardwood floors throughout",
      "Custom built-ins & opened floor plan",
      "New concrete patio & custom wood fence",
    ],
    heroTitle: "Newcomb Road — Complete Inside and Out Home Transformation",
    heroSubtitle: "A full-scope Los Angeles home remodel delivering contemporary design inside and out.",
    challenge: [
      "The home had an outdated layout that felt disconnected room to room, a cramped kitchen that limited functionality, and an exterior that no longer reflected the owners' vision.",
      "The scope required full interior demolition and reconstruction alongside exterior improvements — all while keeping the project on schedule and within budget.",
    ],
    approach: [
      "econstruct approached the project as a full design-build engagement — opening the floor plan first, then rebuilding each space around the improved flow.",
      "Material selections were made early so lead times didn't affect schedule. Frank's team coordinated trades to overlap efficiently and avoid the typical finish-phase slowdowns.",
    ],
    build: [
      "The kitchen was rebuilt with white contemporary cabinetry, marble countertops, high-end appliances, and a large island that anchors the now-open living area.",
      "The master bath received a freestanding soaking tub, frameless glass shower, and a double vanity. Hardwood floors were installed throughout and all rooms were repainted.",
      "Exterior work included a modern gray repaint, new poured concrete patio, and a custom wood privacy fence.",
    ],
    result: [
      "The completed project delivered a home that looks and performs like a new build — premium finishes, a logical open floor plan, and a refreshed exterior that stands out on the street.",
      "The owners reported the project came in on schedule and that the communication throughout made the experience stress-free.",
    ],
    takeaways: [
      "Coordinating interior and exterior scopes under one contractor eliminates scheduling conflicts.",
      "Opening the floor plan before selecting finishes ensures the design works spatially first.",
      "Premium material selections elevate a remodel to near-custom-home quality.",
    ],
  },
  {
    slug: "saddlebow-50-bell-canyon-hillside-lift",
    shortTitle: "50 Saddlebow — Hillside Lift",
    title: "50 Saddlebow Rd — Custom Hillside Lift System, Bell Canyon",
    description:
      "A one-of-a-kind engineering solution for a Bell Canyon hillside estate: a custom lift system engineered to connect the main residence to a lower canyon terrace, unlocking potential for an ADU, pool, or tennis court.",
    image: "/projects/saddlebow-50-hero.jpg",
    gallery: [
      { src: "/projects/saddlebow-50-hero.jpg", alt: "50 Saddlebow Bell Canyon completed hillside lift system aerial view", caption: "Completed system — lift cab and landing platform connecting the main residence to the lower canyon terrace" },
      { src: "/projects/Saddlebow2.webp", alt: "econstruct crew forming and pouring reinforced concrete base for the hillside lift at 50 Saddlebow Bell Canyon", caption: "Concrete base construction — forming the reinforced landing pad at the hillside base" },
      { src: "/projects/Saddlebow3.webp", alt: "econstruct worker overseeing concrete pour into hillside forms at Bell Canyon", caption: "Concrete pour — econstruct crew placing the canyon-base landing foundation" },
      { src: "/projects/Saddlebow4.webp", alt: "Two workers installing the lift drive mechanism and motor assembly at 50 Saddlebow", caption: "Lift mechanism installation — precision fit of the drive system and motor assembly" },
      { src: "/projects/Saddlebow6.webp", alt: "Aerial view of completed hillside lift system with white railings and concrete platform at 50 Saddlebow Bell Canyon", caption: "Aerial view — completed lift with white safety railings and concrete landing integrated into the hillside" },
      { src: "/projects/Saddlebow9.webp", alt: "Aerial overhead view of lift cab and intermediate landing platform at 50 Saddlebow Bell Canyon", caption: "Overhead view — lift cab and intermediate landing connecting canyon terrace to the main residence" },
    ],
    youtubeUrl: "https://www.youtube.com/watch?v=mzZI4WeI2pA",
    serviceSlug: "home-additions-los-angeles",
    location: "Bell Canyon, CA",
    neighborhood: "Bell Canyon",
    scope: "Custom Engineered Hillside Lift System",
    timeline: "6 months",
    squareFootage: "Site infrastructure project",
    completionDate: "2023",
    category: "Custom Engineering",
    highlights: [
      "950 lb capacity lift — engineered for daily residential use",
      "Reinforced concrete landing poured at canyon base",
      "Lift cab finished to match home's modern exterior",
      "County-code redundant fail-safe systems",
      "Unlocks site potential: ADU, pool, tennis court",
    ],
    heroTitle: "50 Saddlebow Rd — The Residential Lift Project: Modern Accessibility",
    heroSubtitle: "A bespoke engineering solution connecting a Bell Canyon estate to its untapped lower terrain.",
    challenge: [
      "The property had a significant grade change from the main residence down to a flat canyon terrace — a beautiful and buildable area that was effectively inaccessible on foot.",
      "The homeowners wanted a solution that was safe, code-compliant, visually integrated with the architecture, and practical enough for daily use.",
    ],
    approach: [
      "econstruct engineered a custom hillside lift delivery system — excavating and forming a reinforced concrete landing at the base, then designing a compact lift cab with doors and finishes matched to the home's existing exterior palette.",
      "The upper landing was set flush with the home's exterior floor level for seamless access. Multiple redundant fail-safe systems were designed and installed per Los Angeles County codes.",
    ],
    build: [
      "The system features a 950 lb maximum capacity, making it practical for furniture, landscaping materials, and daily use. The cab was custom-fabricated with matching materials.",
      "The concrete landing at the base was engineered for the load and the hillside soil conditions specific to the Bell Canyon site.",
    ],
    result: [
      "The lower terrace is now fully accessible and development-ready — sized to accommodate an ADU, swimming pool with pool house, or tennis court.",
      "The lift became a unique feature of the property that significantly increased its functional square footage and long-term value.",
    ],
    takeaways: [
      "Hillside properties often have untapped buildable area that custom engineering can unlock.",
      "A properly designed lift system integrates architecturally and adds lasting property value.",
      "Early county code consultation eliminates redesign risk on complex site work.",
    ],
  },
  {
    slug: "marine-avenue-condo-lawndale-coastal-remodel",
    shortTitle: "Marine Ave Condo",
    title: "Marine Avenue Condo — Coastal California Living, Lawndale",
    description:
      "A 3-bed, 3-bath Lawndale condo blocks from the beach — fully reconfigured floor plan, expanded kitchen with peninsula, spa-inspired bathrooms, and a private balcony rebuilt with firepit and new railings.",
    image: "/projects/marine-ave-hero.jpg",
    gallery: [
      { src: "/projects/marine-ave-hero.jpg", alt: "Marine Avenue condo Lawndale completed interior remodel kitchen and living area", caption: "Reconfigured open-plan interior — porcelain plank tile, quartz countertops, contemporary fixtures" },
      { src: "/projects/20220123_121812-29.webp", alt: "Marine Avenue condo interior detail showing the renovated kitchen and adjacent living space", caption: "Kitchen and living area — updated finishes and a brighter open layout" },
      { src: "/projects/20220123_121937-29.webp", alt: "Marine Avenue condo renovated interior with modern coastal finishes", caption: "Interior finish detail — coastal palette and clean contemporary surfaces" },
      { src: "/projects/20220123_121946-29.webp", alt: "Marine Avenue condo interior showing cabinetry and countertop details", caption: "Cabinetry detail — streamlined storage and durable countertop finishes" },
      { src: "/projects/20220123_121954-29.webp", alt: "Marine Avenue condo living area with updated flooring and lighting", caption: "Living space — updated flooring and refined lighting throughout" },
      { src: "/projects/20220123_122005-29.webp", alt: "Marine Avenue condo kitchen and transition space after remodel", caption: "Kitchen transition — improved flow between cooking and living zones" },
      { src: "/projects/20220123_122041-29.webp", alt: "Marine Avenue condo bathroom or interior finish showing spa-inspired materials", caption: "Bathroom or detail finish — materials selected for a calm, spa-like feel" },
      { src: "/projects/20220123_122345-29.webp", alt: "Marine Avenue condo balcony or outdoor living area with updated railing and seating", caption: "Outdoor living — private balcony refreshed for coastal use" },
      { src: "/projects/20220123_122417-29.webp", alt: "Marine Avenue condo balcony detail with railings and exterior lighting", caption: "Balcony detail — new railings and exterior lighting" },
      { src: "/projects/20220123_122438-29.webp", alt: "Marine Avenue condo remodeled interior with open sightlines", caption: "Open sightlines — the remodeled plan reads larger and more connected" },
      { src: "/projects/20220123_122634-29.webp", alt: "Marine Avenue condo finished interior showing modern coastal remodel details", caption: "Finished interior — modern coastal styling with a clean, bright feel" },
      { src: "/projects/20220123_122645-29.webp", alt: "Marine Avenue condo renovated space with contemporary finishes and lighting", caption: "Contemporary finishes — consistent materials across the unit" },
      { src: "/projects/20220123_122731-29-1.webp", alt: "Marine Avenue condo final project photo showing the completed remodel", caption: "Final reveal — the completed remodel and its polished coastal character" },
    ],
    serviceSlug: "luxury-home-builder-los-angeles",
    location: "Lawndale, CA",
    neighborhood: "Lawndale / South Bay",
    scope: "Full Interior & Exterior Condo Remodel",
    timeline: "5 months",
    squareFootage: "1,800 sq ft",
    completionDate: "2023",
    category: "Condo Remodel",
    highlights: [
      "Full floor plan reconfiguration — walls removed, doorways enlarged",
      "Kitchen with peninsula, bar-height seating & pocket doors",
      "Porcelain plank tile & quartz countertops throughout",
      "Spa-inspired bathrooms with frosted glass doors",
      "Private balcony rebuilt with firepit & new railings",
    ],
    heroTitle: "Marine Avenue Condo — Reimagining a Lawndale Condo for California Coastal Living",
    heroSubtitle: "A complete condo transformation steps from the beach — delivered on schedule and on budget.",
    challenge: [
      "The condo had a segmented, outdated layout that disconnected the kitchen from the living areas and failed to take advantage of its proximity to the beach.",
      "The owners wanted a dramatic transformation on a firm budget and timeline — requiring tight trade sequencing and early procurement.",
    ],
    approach: [
      "econstruct restructured the floor plan first — removing walls, enlarging doorways, and creating a new kitchen-to-dining connection with pocket doors that open the space fully.",
      "A bonus room was added and the balcony was treated as a full outdoor living extension rather than an afterthought.",
    ],
    build: [
      "The kitchen was expanded with a peninsula and bar-height seating. Porcelain plank tile and quartz countertops were used throughout. Frosted glass doors and spa-inspired finishes completed the bathrooms.",
      "The private balcony was rebuilt from the deck up — new flooring, custom railings, updated lighting, and a firepit sectional seating area that extends the livable square footage outdoors.",
    ],
    result: [
      "The finished condo feels significantly larger than its square footage — a result of intelligent space planning, light finishes, and the indoor-outdoor connection the balcony now provides.",
      "Delivered on schedule and within the agreed budget.",
    ],
    takeaways: [
      "Floor plan reconfiguration delivers more value per dollar than finish upgrades alone.",
      "Treating an outdoor balcony as livable space multiplies the feel of the home.",
      "Pocket doors are a high-impact, low-footprint way to connect spaces without permanent openings.",
    ],
  },
  {
    slug: "devista-hollywood-hills-luxury-remodel",
    shortTitle: "Devista — Hollywood Hills",
    title: "Devista — Hollywood Hills Luxury Remodel & Expansion",
    description:
      "A 1980s Hollywood Hills residence fully reimagined for modern family living — chef's kitchen, sliding glass walls opening to a new pool patio, freestanding spa, built-in BBQ, and integrated smart home technology.",
    image: "/projects/devista-hero.jpg",
    gallery: [
      { src: "/projects/devista-hero.jpg", alt: "Devista Hollywood Hills luxury home remodel exterior with pool and modern additions", caption: "Completed exterior — sliding glass walls, pool, freestanding spa, and built-in BBQ kitchen" },
    ],
    serviceSlug: "luxury-home-builder-los-angeles",
    location: "Hollywood Hills, Los Angeles, CA",
    neighborhood: "Hollywood Hills",
    scope: "Full Interior & Exterior Luxury Remodel",
    timeline: "11 months",
    squareFootage: "3,800 sq ft",
    completionDate: "2022",
    category: "Luxury Remodel",
    highlights: [
      "Galley kitchen transformed into open chef's kitchen with quartz island",
      "New sliding glass walls opening to outdoor patio & pool",
      "Pool resurfaced + freestanding spa added",
      "Built-in outdoor BBQ kitchen",
      "Integrated smart home technology throughout",
    ],
    heroTitle: "Devista Project — Revitalizing a Hollywood Hills Home for Modern Family Living",
    heroSubtitle: "A comprehensive Hollywood Hills luxury remodel that transformed a 1980s residence into a contemporary entertainer's estate.",
    challenge: [
      "The 1980s residence had a dated galley kitchen, a backyard with an aging pool and no outdoor living infrastructure, and an interior that felt disconnected from the California outdoor lifestyle.",
      "The owners wanted a modern family home that could also serve as an entertainment venue — requiring both interior and exterior transformation at the highest finish level.",
    ],
    approach: [
      "econstruct's in-house design team worked directly with the owners to define the indoor-outdoor living vision before any demolition began. The kitchen and backyard were planned as one connected space.",
      "Smart home technology was planned from the start rather than retrofitted — integrated throughout the home's lighting, climate, security, and AV systems.",
    ],
    build: [
      "The galley kitchen was fully demolished and rebuilt as a spacious chef's kitchen with a large quartz island, high-end appliances, and a visual connection to the family room.",
      "New sliding glass walls were installed to dissolve the interior-exterior boundary. The pool was resurfaced and a freestanding spa was added alongside a built-in BBQ kitchen and patio.",
      "Custom built-ins, designer paint, and statement fixtures were selected by the econstruct design team to complete the interior.",
    ],
    result: [
      "The Hollywood Hills estate now functions as a seamless indoor-outdoor luxury home — a transformation that significantly elevated the property's market value and livability.",
      "The project has since become one of econstruct's reference case studies for full-scope Hollywood Hills luxury remodels.",
    ],
    takeaways: [
      "Planning kitchen and outdoor living as one project delivers a cohesive result that piecemeal additions cannot.",
      "Smart home integration planned from day one costs less and performs better than retrofit systems.",
      "A resurfaced pool and added spa deliver outsized ROI in the Hollywood Hills market.",
    ],
    testimonial: {
      quote: "Frank's team took our 1980s house and turned it into the home we always envisioned. The process was smooth, the quality is extraordinary, and the outdoor space is now the heart of the home.",
      name: "Hollywood Hills homeowner",
    },
  },
  {
    slug: "saddlebow-54-bell-canyon-luxury-remodel",
    shortTitle: "54 Saddlebow — Bell Canyon",
    title: "54 Saddlebow Rd — Luxury Open-Concept Remodel, Bell Canyon",
    description:
      "A late-1970s Bell Canyon estate rebuilt for contemporary living — walls removed, chef's kitchen with smart home integration, outdoor fireplace lounge, drought-tolerant landscaping, and premium finishes throughout.",
    image: "/projects/saddlebow-54-hero.jpg",
    gallery: [
      { src: "/projects/saddlebow-54-hero.jpg", alt: "54 Saddlebow Bell Canyon luxury remodel exterior hillside estate", caption: "Completed exterior — hillside luxury estate with contemporary landscaping" },
      { src: "/projects/saddlebow-54-2.jpg", alt: "54 Saddlebow Bell Canyon interior living area remodel", caption: "Open-concept living — reconfigured floor plan with premium finishes" },
      { src: "/projects/saddlebow-54-3.jpg", alt: "54 Saddlebow Bell Canyon kitchen remodel with island", caption: "Chef's kitchen — large island, premium appliances, touchpad cabinetry" },
      { src: "/projects/saddlebow-54-5.jpg", alt: "54 Saddlebow Bell Canyon bathroom remodel", caption: "Luxury bathroom — spa-level finishes" },
      { src: "/projects/saddlebow-54-8.jpg", alt: "54 Saddlebow Bell Canyon outdoor fireplace lounge", caption: "Outdoor fireplace lounge — designed for California hillside living" },
    ],
    serviceSlug: "luxury-home-builder-los-angeles",
    location: "Bell Canyon, CA",
    neighborhood: "Bell Canyon",
    scope: "Full Interior & Exterior Luxury Remodel",
    timeline: "10 months",
    squareFootage: "3,200 sq ft",
    completionDate: "2021",
    category: "Luxury Remodel",
    highlights: [
      "Full open-concept floor plan — walls removed throughout",
      "Chef's kitchen with large island & touchpad cabinetry",
      "Integrated smart home tech & AV system",
      "Outdoor fireplace lounge",
      "Drought-tolerant landscaping",
    ],
    heroTitle: "54 Saddlebow Rd — Luxury Home Remodeling, Bell Canyon",
    heroSubtitle: "A full-scope Bell Canyon luxury remodel delivering open-concept modern living with smart home integration.",
    challenge: [
      "The late-1970s home had a compartmentalized layout, a cramped kitchen, dated finishes, and an outdoor space that wasn't taking advantage of the hillside setting.",
      "Bell Canyon's gated community location required careful coordination with HOA, county, and local permit requirements.",
    ],
    approach: [
      "econstruct planned the full demolition and reconstruction sequence before breaking ground — removing walls in the right order to protect the structural envelope while opening the floor plan as dramatically as the owners wanted.",
      "Smart home technology and integrated AV were specified at the design phase so all rough-in work could be completed during framing.",
    ],
    build: [
      "The kitchen was expanded into a sleek chef's space with a large island, premium appliances, touchpad cabinetry, and smart home integration. The open floor plan connects kitchen, dining, and living seamlessly.",
      "An outdoor fireplace lounge was constructed to create a true indoor-outdoor living environment. Drought-tolerant landscaping was installed throughout the hillside yard.",
    ],
    result: [
      "The completed project delivered one of Bell Canyon's standout luxury residences — a home that performs as well as it looks, with smart systems, premium materials, and a floor plan built for how the family actually lives.",
      "Delivered on time despite the full scope of work, a result of econstruct's meticulous project management.",
    ],
    takeaways: [
      "Gated community remodels require permit and HOA coordination experience — this is a core econstruct competency.",
      "Specifying smart home systems at the design phase eliminates costly retrofit work later.",
      "Outdoor fireplace lounges deliver year-round ROI in the Southern California climate.",
    ],
    testimonial: {
      quote: "econstruct managed every detail with precision. The result is a home that looks brand new and feels like it was designed specifically for our family. We couldn't be happier.",
      name: "Bell Canyon homeowner",
    },
  },
];

export function getPromptProjectBySlug(slug: string): PromptProjectPage | undefined {
  return promptProjects.find((p) => p.slug === slug);
}
