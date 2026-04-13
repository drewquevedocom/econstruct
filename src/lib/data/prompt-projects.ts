export interface PromptProjectPage {
  slug: string;
  title: string;
  description: string;
  image: string;
  serviceSlug: string;
  location: string;
  scope: string;
  timeline: string;
  squareFootage: string;
  completionDate: string;
  heroTitle: string;
  heroSubtitle: string;
  challenge: string[];
  approach: string[];
  build: string[];
  result: string[];
  takeaways: string[];
  testimonial?: {
    quote: string;
    name: string;
  };
  gallery: {
    src: string;
    alt: string;
    caption: string;
  }[];
}

export const promptProjects: PromptProjectPage[] = [
  {
    slug: "palisades-fire-rebuild",
    title: "Palisades Fire Rebuild",
    description:
      "A Pacific Palisades rebuild managed from insurance coordination through final turnover, with WUI-compliant detailing and a faster permitting strategy.",
    image: "/after.png",
    serviceSlug: "fire-rebuild-contractor-los-angeles",
    location: "Pacific Palisades, Los Angeles",
    scope: "Insurance-supported full home rebuild",
    timeline: "14 months construction, 4 months entitlement and permit coordination",
    squareFootage: "4,200 sq ft",
    completionDate: "2026",
    heroTitle: "Palisades Fire Rebuild - Pacific Palisades",
    heroSubtitle:
      "A full-service rebuild delivered with insurance coordination, WUI-ready detailing, and a clear path from loss to move-in.",
    challenge: [
      "The homeowners were dealing with the aftermath of a total-loss fire, conflicting insurance guidance, and the reality of updated fire-zone code requirements.",
      "The lot also required careful coordination around hillside access, debris removal, and sequencing the design package quickly enough to protect schedule and budget.",
    ],
    approach: [
      "econstruct stepped in early to align the owner, design consultants, and insurance stakeholders around one scope of work instead of disconnected estimates.",
      "We structured the project around a rebuild-ready permit set, documented code upgrades clearly, and kept Frank involved in the major budget and schedule decisions.",
    ],
    build: [
      "The reconstruction used fire-conscious assemblies, tempered glazing, hardened exterior details, and site planning intended to support defensible space strategy.",
      "Interior planning also improved livability instead of simply replicating the old plan, giving the homeowners a more efficient layout and upgraded systems package.",
    ],
    result: [
      "The finished home restored the property with a cleaner modern expression, stronger fire resilience, and a construction process the owners could actually follow.",
      "The project now serves as a reference for how econstruct handles insurance-driven rebuilds without losing control of design quality.",
    ],
    takeaways: [
      "Early scope alignment reduces insurance friction later in the project.",
      "Post-fire permitting moves faster when the design package is organized around current code from day one.",
      "A rebuild can restore value and still upgrade how the home performs.",
    ],
    testimonial: {
      quote:
        "They did not treat this like a standard construction job. They led the process, coordinated the insurance side, and rebuilt our home with real care.",
      name: "Pacific Palisades homeowner",
    },
    gallery: [
      {
        src: "/b4.png",
        alt: "Pacific Palisades property after the fire before reconstruction",
        caption: "The site condition before reconstruction began.",
      },
      {
        src: "/after.png",
        alt: "Completed Palisades fire rebuild residence overlooking the coast",
        caption: "The completed rebuild with updated architecture and hardened details.",
      },
      {
        src: "/fire_rebuild_hero.png",
        alt: "Construction team reviewing rebuild plans on site",
        caption: "Field coordination, permitting, and reconstruction planning.",
      },
    ],
  },
  {
    slug: "luxury-custom-home-santa-monica",
    title: "Luxury Custom Home - Santa Monica",
    description:
      "A ground-up luxury residence delivered through a tightly managed design-build process with premium materials and strong architect-contractor coordination.",
    image: "/custom_home_service.png",
    serviceSlug: "luxury-home-builder-los-angeles",
    location: "Santa Monica, Los Angeles",
    scope: "Ground-up luxury custom home",
    timeline: "18 months construction after design and permit approvals",
    squareFootage: "6,100 sq ft",
    completionDate: "2025",
    heroTitle: "Luxury Custom Home - Santa Monica",
    heroSubtitle:
      "A design-driven custom build shaped around views, indoor-outdoor living, and premium execution from foundation to finishes.",
    challenge: [
      "The homeowners wanted a refined modern house that felt warm instead of overly minimal, while still performing at the level expected in a luxury coastal market.",
      "That required tight coordination across architecture, detailing, procurement, and sequencing so the final product stayed coherent from shell to interiors.",
    ],
    approach: [
      "econstruct managed the build as an integrated process, aligning consultants early and stress-testing material choices against schedule, budget, and field realities.",
      "We also maintained close oversight of specialty trades and finish packages so the quality bar stayed consistent across every room and exterior elevation.",
    ],
    build: [
      "Construction combined structural precision with premium finish execution, including large-format glazing, architectural concrete, custom millwork, and tailored lighting details.",
      "The site plan prioritized privacy, natural light, and fluid connections to outdoor living spaces rather than treating landscape as an afterthought.",
    ],
    result: [
      "The home delivered the clean contemporary profile the client wanted without sacrificing warmth, durability, or day-to-day livability.",
      "It now stands as a model for how econstruct approaches high-end custom homes in demanding Los Angeles neighborhoods.",
    ],
    takeaways: [
      "Luxury construction works best when architecture, procurement, and build sequencing are managed as one system.",
      "Material decisions made early protect both design quality and schedule.",
      "Premium homes need contractor leadership, not just contractor labor.",
    ],
    testimonial: {
      quote:
        "The project felt controlled from the beginning. The build quality is exceptional and the process was far more transparent than what we expected.",
      name: "Santa Monica client",
    },
    gallery: [
      {
        src: "/custom_home_service.png",
        alt: "Luxury custom home construction overlooking the Los Angeles coast",
        caption: "A ground-up luxury home built around views and modern detailing.",
      },
      {
        src: "/make_wider_2K_202604072157.png",
        alt: "Completed luxury residence at sunset above the coastline",
        caption: "The completed home framed within its coastal context.",
      },
      {
        src: "/luxury_mod_service.png",
        alt: "High-end interior cabinetry and finish installation",
        caption: "Interior craftsmanship and finish coordination.",
      },
    ],
  },
];

export function getPromptProjectBySlug(slug: string) {
  return promptProjects.find((project) => project.slug === slug);
}
