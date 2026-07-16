export interface Project {
  title: string;
  slug: string;
  category: "residential" | "restaurant" | "retail" | "commercial";
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
  // ── Residential ──────────────────────────────────────────────
  {
    title: "50 Saddlebow Rd",
    slug: "50-saddlebow-rd",
    category: "residential",
    neighborhood: "Bell Canyon",
    description:
      "A luxury modern hillside home required innovative access solutions to an unusable lower property area. The team engineered and installed a compact hillside lift system with a 950-pound capacity, featuring custom doors and cab matching the home's modern materials, reinforced concrete landing, and multiple redundant fail-safe systems.",
    heroImage: "/projects/saddlebow-50-hero.jpg",
    images: [
      "/projects/saddlebow-50-hero.jpg",
      "/projects/saddlebow-50-2.webp",
    ],
    specs: { scope: "Hillside Lift Installation" },
  },
  {
    title: "54 Saddlebow Rd",
    slug: "54-saddlebow-rd",
    category: "residential",
    neighborhood: "Bell Canyon",
    description:
      "Comprehensive transformation of a late 1970s residence into a modern open-concept home. The project involved removing walls for improved natural light flow, a redesigned chef's kitchen with large island and premium appliances, smart home technology integration, and drought-resistant hillside landscaping.",
    heroImage: "/projects/saddlebow-54-hero.jpg",
    images: [
      "/projects/saddlebow-54-hero.jpg",
      "/projects/saddlebow-54-2.jpg",
      "/projects/saddlebow-54-3.jpg",
      "/projects/saddlebow-54-5.jpg",
      "/projects/saddlebow-54-8.jpg",
    ],
    specs: { scope: "Full Remodel" },
  },
  {
    title: "Marine Avenue Condo",
    slug: "marine-avenue-condo",
    category: "residential",
    neighborhood: "Lawndale",
    description:
      "A comprehensive transformation of a 3-bedroom, 3-bathroom coastal condo. Reconfigured the floorplan with an open, airy layout for beachside living, including kitchen expansion, spa-inspired bathroom renovation, and a redesigned private balcony with firepit seating area.",
    heroImage: "/projects/marine-ave-hero.jpg",
    images: [
      "/projects/marine-ave-hero.jpg",
    ],
    specs: { scope: "Condo Remodel" },
  },
  {
    title: "Mulholland Drive Residence",
    slug: "mulholland-drive-residence",
    category: "residential",
    neighborhood: "Hollywood Hills",
    description:
      "A comprehensive remodel of a 1970s hillside home that modernized the floorplan and enhanced indoor-outdoor California living. Work included an open-concept kitchen with quartz island, master suite renovation, pool resurfacing, covered patio addition, and extensive glass wall replacements for panoramic views.",
    heroImage: "/projects/mulholland-hero.jpg",
    images: [
      "/projects/mulholland-hero.jpg",
    ],
    specs: { scope: "Full Remodel" },
    featured: true,
  },
  {
    title: "Newcomb Road Residence",
    slug: "newcomb-road-residence",
    category: "residential",
    neighborhood: "Los Angeles",
    description:
      "A comprehensive interior and exterior home transformation creating a contemporary living space. Exterior updates with modern paint and custom wood fencing, complete kitchen renovation with marble counters and island, master bathroom remodel, and hardwood flooring throughout.",
    heroImage: "/projects/newcomb-road-hero.jpg",
    images: [
      "/projects/newcomb-road-hero.jpg",
    ],
    specs: { scope: "Full Remodel" },
  },
  {
    title: "Santa Monica ADU",
    slug: "santa-monica-adu",
    category: "residential",
    neighborhood: "Santa Monica",
    description:
      "Detached accessory dwelling unit construction on San Vicente Boulevard in Santa Monica. Full scope from design coordination and LADBS permitting through construction and final inspection — delivering a code-compliant, high-finish secondary unit that maximizes the property's value.",
    heroImage: "/projects/05_web.jpg",
    images: [
      "/projects/05_web.jpg",
      "/projects/01_web.jpg",
      "/projects/06_web.jpg",
    ],
    specs: { scope: "ADU Construction" },
  },
  {
    title: "Devista Project",
    slug: "devista-project",
    category: "residential",
    neighborhood: "Hollywood Hills",
    description:
      "Comprehensive renovation of a 1980s Hollywood Hills residence designed for contemporary family living. The project included expanding the layout, integrating smart home technology, a new chef's kitchen with quartz island, sliding glass wall installations, pool resurfacing, and a built-in barbecue kitchen.",
    heroImage: "/projects/devista-hero.jpg",
    images: [
      "/projects/devista-hero.jpg",
    ],
    specs: { scope: "Full Remodel" },
  },

  // ── Restaurant ───────────────────────────────────────────────
  {
    title: "Hal's Bar and Grill",
    slug: "hals-bar-and-grill",
    category: "restaurant",
    neighborhood: "Playa Vista",
    description:
      "Complete interior and exterior remodel of a beloved Venice-area restaurant established in 1987. The renovation transformed the space into a contemporary destination while preserving its welcoming character, including stripping the interior to studs, upgrading all systems, custom live-edge wood millwork, and a redesigned kitchen with state-of-the-art equipment.",
    heroImage:
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2017/03/Hals_pv_12-scaled.jpg",
    images: [
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2017/03/Hals_pv_12-scaled.jpg",
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2017/03/DSC02984-scaled.jpg",
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2017/03/DSC02973-scaled.jpg",
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2017/03/DSC02969-scaled.jpg",
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2017/03/Hals_pv_9-scaled.jpg",
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2017/03/Hals_pv_7-scaled.jpg",
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2017/03/Hals_pv_6-scaled.jpg",
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2017/03/Hals_pv_5-scaled.jpg",
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2017/03/Hals_pv_4-scaled.jpg",
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2017/03/Hals_pv_2-scaled.jpg",
    ],
    specs: { scope: "Full Remodel" },
    featured: true,
  },
  {
    title: "800 Degrees Woodfired Kitchen",
    slug: "800-degrees-woodfired-kitchen",
    category: "restaurant",
    neighborhood: "Hollywood",
    description:
      "Collaboration with acclaimed chef Anthony Carron to construct an innovative woodfired restaurant featuring dual wood-burning ovens, charcoal grill, and rotisserie. Custom Douglas fir wood accents, reclaimed whiskey barrel oak counters and bar tops, and a state-of-the-art ventilation hood system throughout.",
    heroImage:
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2017/03/Hals_pv_12-scaled.jpg",
    images: [
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2017/03/Hals_pv_12-scaled.jpg",
    ],
    specs: { scope: "New Build-Out" },
  },
  {
    title: "El Pollo Loco",
    slug: "el-pollo-loco",
    category: "restaurant",
    neighborhood: "Delano, CA",
    description:
      "Ground-up construction of a standalone El Pollo Loco restaurant. Full build-out from foundation through opening day, featuring an open kitchen with vertical spits, plancha grill station, branded patio with fire fixtures, and interior finishes optimized for fast-casual service.",
    heroImage:
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2023/09/El_pollo_loco_3.jpg",
    images: [
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2023/09/El_pollo_loco_3.jpg",
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2023/09/El_pollo_loco_4.jpg",
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2023/09/El_pollo_loco_5.jpg",
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2023/09/El_pollo_loco_7.jpg",
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2023/09/El_pollo_loco_8.jpg",
    ],
    specs: { sqft: "2,500", scope: "Ground-Up Construction" },
  },
  {
    title: "Hutchinson Cocktails & Grill",
    slug: "hutchinson-cocktails-and-grill",
    category: "restaurant",
    neighborhood: "La Cienega, Los Angeles",
    description:
      "An upscale cocktail lounge blending modern elegance with old Hollywood glamour. Features an expansive blue onyx bar as centerpiece, custom leather and velvet booth seating, live-edge wood tables fabricated by econstruct artisans, and an open-concept kitchen with a state-of-the-art bar program.",
    heroImage:
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2023/09/hutchinson11.jpg",
    images: [
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2023/09/hutchinson11.jpg",
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2023/09/hutchinson9.jpg",
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2023/09/hutchinson8.jpg",
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2023/09/hutchinson7.jpg",
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2023/09/hutchinson6.jpg",
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2023/09/hutchinson5.jpg",
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2023/09/hutchinson4.jpg",
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2023/09/hutchinson3.jpg",
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2023/09/hutchinson_1.jpg",
    ],
    specs: { scope: "Interior Remodel" },
  },
  {
    title: "Koala T Cafe",
    slug: "koala-t-cafe",
    category: "restaurant",
    neighborhood: "Westwood Village",
    description:
      "First brick-and-mortar location for Koala T Cafe, designed to feel like an extension of your living room. Features cozy seating with antique mirrors and armchairs, an expansive marble counter, La Marzocco espresso machines, and custom wood shelving for merchandise and baked goods.",
    heroImage:
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2023/09/2017-09-02.jpg",
    images: [
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2023/09/2017-09-02.jpg",
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2023/09/Koala_Tea_6.jpg",
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2023/09/Koala_Tea_5.jpg",
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2023/09/Koala_Tea_4.jpg",
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2023/09/Koala_Tea_3.jpg",
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2023/09/Koala_Tea_2.jpg",
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2023/09/Koala_Tea_1.jpg",
    ],
    specs: { scope: "New Build-Out" },
  },
  {
    title: "Tea Pot Cafe",
    slug: "tea-pot-cafe",
    category: "restaurant",
    neighborhood: "Santa Clarita",
    description:
      "A family-friendly eatery emphasizing nourishing, creative comfort food. Features an open, welcoming interior with separated kids' and adults' zones, custom reclaimed wood booth seating, a supervised indoor playground, professional kitchen with stainless stations, and an outdoor patio.",
    heroImage:
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2023/09/2017-09-02.jpg",
    images: [
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2023/09/2017-09-02.jpg",
    ],
    specs: { scope: "New Build-Out" },
  },
  {
    title: "Odd One Out",
    slug: "odd-one-out",
    category: "restaurant",
    neighborhood: "Santa Monica",
    description:
      "A boba tea shop on the iconic 3rd Street Promenade combining traditional and innovative elements. The project involved transforming a prime retail space while navigating complex construction challenges, extended plan check delays, and an accelerated timeline requiring extended work hours and increased manpower.",
    heroImage:
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2024/08/DSC00788-1-scaled.jpg",
    images: [
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2024/08/DSC00788-1-scaled.jpg",
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2024/08/o1o_b4_after.png",
    ],
    specs: { scope: "Interior Remodel" },
  },

  // ── Retail ───────────────────────────────────────────────────
  {
    title: "Malin+Goetz",
    slug: "malin-goetz",
    category: "retail",
    neighborhood: "Venice & Silverlake",
    description:
      "Two distinctive retail locations for premium skincare brand Malin+Goetz, designed to reflect the brand's philosophy of uncomplicated skincare and sustainable living. Features recycled and eco-friendly construction materials, minimalist aesthetic with clean lines and neutral palette, and energy-efficient lighting.",
    heroImage:
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2023/10/Untitled-design-87.png",
    images: [
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2023/10/Untitled-design-87.png",
    ],
    specs: { scope: "Retail Build-Out" },
  },
  {
    title: "Rothy's",
    slug: "rothys",
    category: "retail",
    neighborhood: "Melrose & Pasadena",
    description:
      "Three retail locations for eco-conscious footwear brand Rothy's across Los Angeles and Pasadena. Each build-out integrates locally-sourced reclaimed woods, accent tile, and sustainable finishes aligned with the brand's mission, along with custom millwork displays for their knit shoes and bags.",
    heroImage:
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2023/10/Untitled-design-87.png",
    images: [
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2023/10/Untitled-design-87.png",
    ],
    specs: { scope: "Retail Build-Out" },
    featured: true,
  },
  {
    title: "Thom Sweeney",
    slug: "thom-sweeney",
    category: "retail",
    neighborhood: "Melrose Place",
    description:
      "Flagship Westcoast retail store for renowned British bespoke menswear brand Thom Sweeney, completed in a record-breaking four weeks. The finished space features clean lines, natural materials, and carefully considered lighting creating a gallery-like atmosphere on Melrose Place.",
    heroImage:
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2023/10/Untitled-design-87.png",
    images: [
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2023/10/Untitled-design-87.png",
    ],
    specs: { timeline: "4 weeks", scope: "Retail Build-Out" },
  },

  // ── Commercial (Multi-Location) ─────────────────────────────
  {
    title: "Joe & The Juice",
    slug: "joe-and-the-juice",
    category: "commercial",
    neighborhood: "Multiple LA Locations",
    description:
      "Five successful locations across Southern California for the Scandinavian juice and coffee brand. Each build-out features a signature aesthetic including moss walls, brick backsplashes, sleek counters, and durable high-traffic finishes with custom juice stations and coffee bar installations.",
    heroImage:
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2023/09/2017-09-02.jpg",
    images: [
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2023/09/2017-09-02.jpg",
    ],
    specs: { scope: "Multi-Location Build-Out" },
  },
  {
    title: "85°C Bakery Cafe & Warehouse",
    slug: "85c-bakery-cafe",
    category: "commercial",
    neighborhood: "Buena Park & Multiple Los Angeles Locations",
    description:
      "econstruct delivered nine distinct builds for 85°C as one program: eight individual bakery cafe locations across the Los Angeles area, each with an in-house bakery producing fresh items hourly, dark wood displays, and commercial baking equipment — and a dedicated commercial distribution center and corporate office in Buena Park engineered to supply and support every one of those locations.",
    heroImage:
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2023/09/2017-09-02.jpg",
    images: [
      "https://i1.wp.com/econstructinc.com/wp-content/uploads/2023/09/2017-09-02.jpg",
    ],
    specs: { scope: "9 Builds: 8 Bakery Locations + 1 Distribution Center" },
    featured: true,
  },
  {
    title: "SBUX – Lancaster",
    slug: "sbux-lancaster",
    category: "commercial",
    neighborhood: "Lancaster, CA",
    description:
      "Ground-up Starbucks restaurant construction in Lancaster, CA. Full-service build from permitting and site preparation through brand-spec interior finishes, drive-through configuration, and opening-day delivery.",
    heroImage: "/projects/01_Starbucks.jpg",
    images: [
      "/projects/01_Starbucks.jpg",
    ],
    specs: { scope: "Ground-Up Construction" },
  },
  {
    title: "8th Symphony",
    slug: "8th-symphony",
    category: "commercial",
    neighborhood: "Los Angeles",
    description:
      "Full commercial tenant improvement build-out in Los Angeles. Complete interior renovation covering structural modifications, MEP coordination, premium finish installation, and certificate of occupancy delivery on schedule.",
    heroImage: "/projects/01_web.jpg",
    images: [
      "/projects/01_web.jpg",
      "/projects/02_web.jpg",
    ],
    specs: { scope: "Tenant Improvement" },
  },
];

export const residentialProjects: Project[] = projects.filter(
  (p) => p.category === "residential"
);

export const residentialProjectCategories: { value: string; label: string }[] = [
  { value: "all", label: "All Projects" },
  { value: "residential", label: "Residential" },
];
