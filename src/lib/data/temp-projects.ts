import type { PromptProjectPage } from "@/lib/data/prompt-projects";

function tempImage(slug: string, index: number) {
  return `/projects/temp/${slug}/${String(index).padStart(2, "0")}.jpeg`;
}

function tempGallery(
  slug: string,
  items: Array<{ alt: string; caption: string }>,
) {
  return items.map((item, index) => ({
    src: tempImage(slug, index + 1),
    alt: item.alt,
    caption: item.caption,
  }));
}

export const temporaryProjectPages: PromptProjectPage[] = [
  {
    slug: "altadena-craftsman-estate",
    shortTitle: "Altadena Craftsman Estate",
    title: "Altadena Craftsman Estate",
    description:
      "A warm, detail-rich Craftsman estate concept for Altadena, combining mountain views, stone detailing, a generous great room, a statement kitchen, and resort-caliber outdoor living.",
    image: tempImage("altadena-craftsman-estate", 1),
    gallery: tempGallery("altadena-craftsman-estate", [
      {
        alt: "Altadena Craftsman estate front exterior with layered rooflines and mountain backdrop",
        caption: "Front exterior view, showing the Craftsman massing, layered rooflines, and the mountain setting that gives the home its sense of place.",
      },
      {
        alt: "Altadena Craftsman estate backyard pool and terrace at dusk",
        caption: "Rear pool terrace, built around a calm evening atmosphere with soft lighting and a clear connection between the home and the outdoor lounge zones.",
      },
      {
        alt: "Altadena Craftsman outdoor living area with covered patio and kitchen",
        caption: "Outdoor living and kitchen zone, planned as a true extension of the interior entertaining spaces rather than a secondary patio.",
      },
      {
        alt: "Altadena Craftsman estate exterior with mountains and deep roof overhangs",
        caption: "Exterior angle highlighting the deep overhangs, stonework, and the way the home sits against the Altadena foothill landscape.",
      },
      {
        alt: "Altadena Craftsman house exterior at twilight with warm lighting",
        caption: "Twilight view, where the window glow and exterior lighting reinforce the home's warmth and residential character.",
      },
      {
        alt: "Altadena Craftsman kitchen with stone island and custom millwork",
        caption: "Kitchen perspective, centered on a substantial island and the kind of millwork detailing expected in a high-end Craftsman home.",
      },
      {
        alt: "Altadena Craftsman front entry with custom doors and stone pillars",
        caption: "Front entry sequence, using stone pillars and oversized doors to create a strong sense of arrival.",
      },
      {
        alt: "Altadena Craftsman great room with mountain views and exposed timber feel",
        caption: "Great room view, designed to hold large-scale family living while still feeling connected to the mountain outlook beyond.",
      },
      {
        alt: "Altadena Craftsman interior view across living spaces and finish palette",
        caption: "Interior composition showing how the shared living spaces carry a consistent material palette and visual weight.",
      },
      {
        alt: "Altadena Craftsman luxury bathroom with freestanding tub and natural light",
        caption: "Primary bath concept, balancing refined materials with the calm, natural-light quality that suits the foothill setting.",
      },
      {
        alt: "Altadena Craftsman primary bedroom suite with mountain-facing outlook",
        caption: "Primary suite view, emphasizing scale, warmth, and the home's relationship to the surrounding landscape.",
      },
    ]),
    serviceSlug: "custom-home-construction-los-angeles",
    location: "Altadena, CA",
    neighborhood: "Altadena",
    scope: "Ground-Up Custom Home",
    timeline: "15 months",
    squareFootage: "5,400 sq ft",
    completionDate: "2021",
    category: "Custom Home Build",
    highlights: [
      "Craftsman architecture adapted for a foothill estate setting",
      "Large-format kitchen, great room, and covered outdoor entertaining zones",
      "Stone entry sequence and warm material palette throughout",
      "Pool terrace integrated into the home's rear elevation",
      "Primary suite and bath oriented around privacy and views",
    ],
    heroTitle: "Altadena Craftsman Estate",
    heroSubtitle:
      "A classic Craftsman estate concept built around foothill views and a strong indoor-outdoor family layout.",
    challenge: [
      "The design had to capture traditional Craftsman warmth without feeling heavy or overly nostalgic. In Altadena, that balance matters because the foothill light and mountain backdrop reward homes that feel grounded but still open.",
      "The program also required a large family layout, generous entertaining spaces, and a pool-centered backyard, all while keeping the architecture coherent from curb to rear terrace.",
    ],
    approach: [
      "The concept leans into natural materials, layered rooflines, and a clear front-to-back sequence. Public rooms are scaled for entertaining, while private rooms remain quieter and more protected.",
      "Outdoor areas were treated as core living space from the beginning, which is why the rear elevation, pool terrace, and covered patio feel integrated rather than appended later.",
    ],
    build: [
      "The kitchen and great room sit at the center of the plan and anchor the house visually. Material decisions focus on stone, wood tone, and warm lighting rather than stark contrast.",
      "The rear yard is organized as a sequence of pool, lounge, and outdoor dining areas, with sightlines maintained from the main interior spaces for a stronger family-living pattern.",
    ],
    result: [
      "The finished concept reads as a substantial Altadena estate with clear architectural identity, strong outdoor usability, and a material palette that should age well over time.",
      "It broadens the visible range of styles on the econstruct residential side without drifting away from the premium Los Angeles market position.",
    ],
    takeaways: [
      "Traditional architecture lands better when the outdoor spaces are designed with the same discipline as the interior.",
      "Altadena properties benefit from plans that frame the landscape instead of merely facing it.",
      "A Craftsman home at this level succeeds through restraint, proportion, and material consistency.",
    ],
  },
  {
    slug: "hollywood-hills-midcentury-modern",
    shortTitle: "Hollywood Hills MCM",
    title: "Hollywood Hills Midcentury Modern",
    description:
      "A Hollywood Hills midcentury-modern residence shaped around city views, sculptural indoor-outdoor spaces, a dramatic pool terrace, and a polished material palette suited to hillside living.",
    image: tempImage("hollywood-hills-midcentury-modern", 1),
    gallery: tempGallery("hollywood-hills-midcentury-modern", [
      {
        alt: "Hollywood Hills midcentury modern exterior hero view at dusk",
        caption: "Primary exterior view, establishing the home's hillside presence and the clean geometry associated with a refined midcentury-modern interpretation.",
      },
      {
        alt: "Hollywood Hills backyard terrace at night with layered lighting",
        caption: "Night terrace scene, showing how the exterior lighting strategy extends the living experience after dark.",
      },
      {
        alt: "Hollywood Hills bedroom with city lights and glass exposure",
        caption: "Bedroom view, where the city lights become part of the architecture and the room reads as a private overlook.",
      },
      {
        alt: "Hollywood Hills kitchen with stone island and view orientation",
        caption: "Kitchen composition, organized around a statement island and sightlines that keep the room connected to the surrounding views.",
      },
      {
        alt: "Hollywood Hills drone shot of hillside estate and city beyond",
        caption: "Aerial perspective, useful for understanding how the house occupies the hillside and turns toward Los Angeles.",
      },
      {
        alt: "Hollywood Hills entry with stone walls and warm wood ceiling",
        caption: "Entry sequence, where stone, wood, and controlled lighting create a more tactile arrival experience.",
      },
      {
        alt: "Hollywood Hills great room with panoramic city views",
        caption: "Great room view, emphasizing openness, long sightlines, and the way the glass perimeter carries the skyline indoors.",
      },
      {
        alt: "Hollywood Hills exterior twilight view with strong illumination",
        caption: "Twilight exterior, showing how the house reads as a luminous object on the hillside once interior lighting comes alive.",
      },
      {
        alt: "Hollywood Hills infinity pool with city lights beyond",
        caption: "Pool-edge perspective, designed to make the skyline part of the outdoor living experience rather than a distant backdrop.",
      },
      {
        alt: "Hollywood Hills interior looking from circulation into great room",
        caption: "Interior transition showing how the circulation spaces stay visually tied to the primary entertaining rooms.",
      },
      {
        alt: "Hollywood Hills luxury bathroom with elevated city outlook",
        caption: "Bathroom view, where the luxury comes from restraint, view orientation, and a controlled material palette.",
      },
    ]),
    serviceSlug: "luxury-home-builder-los-angeles",
    location: "Hollywood Hills, Los Angeles, CA",
    neighborhood: "Hollywood Hills",
    scope: "Luxury Hillside Remodel",
    timeline: "12 months",
    squareFootage: "4,900 sq ft",
    completionDate: "2022",
    category: "Luxury Remodel",
    highlights: [
      "Midcentury-modern hillside expression with city-facing living spaces",
      "Pool terrace and nighttime exterior sequence designed as a true destination",
      "Large kitchen and great room organized around long sightlines",
      "Private rooms positioned for quieter view experiences",
      "Material palette built around stone, wood, glass, and warm lighting",
    ],
    heroTitle: "Hollywood Hills Midcentury Modern",
    heroSubtitle:
      "A view-driven hillside project focused on clean architectural geometry and a more sculptural take on the Hollywood Hills lifestyle.",
    challenge: [
      "The core challenge was giving the home a strong midcentury-modern identity without making it feel like a period exercise. In the Hollywood Hills, the architecture still has to work as a current luxury residence.",
      "The second challenge was sequencing the indoor and outdoor spaces around the skyline. If the circulation or room hierarchy is wrong, a view house can still feel flat.",
    ],
    approach: [
      "The design centers the great room, kitchen, pool edge, and night terrace as the major experiences. Secondary spaces support those moments instead of competing with them.",
      "Material selections stay disciplined so the views remain the hero. Stone and wood add weight, but the composition still stays open and calm.",
    ],
    build: [
      "The exterior is treated almost like a stage set for twilight living, with the lighting and glazing working together to emphasize the home's silhouette.",
      "Interiors focus on long, uninterrupted visual connections and a cleaner furniture-ready backdrop that suits both family use and entertaining.",
    ],
    result: [
      "The concept reads as a convincing Hollywood Hills showcase property and expands the portfolio's range in a direction that aligns well with the local market.",
      "It gives the portfolio a project with a clear nighttime identity, which helps the set feel less repetitive.",
    ],
    takeaways: [
      "A view house works best when circulation is choreographed as carefully as the main rooms.",
      "Midcentury cues are strongest when they support present-day livability instead of becoming decoration.",
      "Nighttime imagery matters on luxury hillside projects because the evening experience is part of the product.",
    ],
  },
  {
    slug: "manhattan-beach-contemporary-residence",
    shortTitle: "Manhattan Beach Contemporary",
    title: "Manhattan Beach Contemporary Residence",
    description:
      "A sleek contemporary residence in Manhattan Beach, balancing privacy, ocean-near indoor-outdoor living, crisp entry detailing, and a calm modern interior palette.",
    image: tempImage("manhattan-beach-contemporary-residence", 1),
    gallery: tempGallery("manhattan-beach-contemporary-residence", [
      {
        alt: "Manhattan Beach contemporary residence exterior hero view",
        caption: "Hero exterior, establishing the home's calm contemporary language and the disciplined simplicity of the massing.",
      },
      {
        alt: "Manhattan Beach aerial view of contemporary house and surrounding fabric",
        caption: "Aerial view, useful for reading the home's placement and the relationship between upper terraces and the broader beachside context.",
      },
      {
        alt: "Manhattan Beach backyard pool and terrace reflecting the home",
        caption: "Pool and terrace composition, where the water and paving are treated as clean extensions of the architecture.",
      },
      {
        alt: "Manhattan Beach entry door with dark wood and glass detailing",
        caption: "Entry detail showing how the threshold uses wood, glazing, and proportion to create a strong but understated arrival moment.",
      },
      {
        alt: "Manhattan Beach great room with expansive glazing and soft interior palette",
        caption: "Great room perspective, designed to stay bright, uncluttered, and open to the exterior without losing comfort.",
      },
      {
        alt: "Manhattan Beach exterior at twilight with glowing windows",
        caption: "Twilight exterior scene, where the house reads as a warmer and more intimate object after sunset.",
      },
      {
        alt: "Manhattan Beach luxury bathroom with freestanding tub and restrained finishes",
        caption: "Bathroom view, built around quiet materials and a simple composition rather than overworked detailing.",
      },
      {
        alt: "Manhattan Beach foyer looking toward the main living spaces",
        caption: "Foyer perspective, showing the controlled reveal into the more open social rooms beyond.",
      },
      {
        alt: "Manhattan Beach primary bedroom suite on upper floor with contemporary styling",
        caption: "Primary suite view, designed to feel private and light-filled while maintaining the home's overall minimal tone.",
      },
      {
        alt: "Manhattan Beach terrace with outdoor lounge furniture and coastal atmosphere",
        caption: "Upper terrace lounge, created as a quieter outdoor zone distinct from the more active rear entertaining areas.",
      },
      {
        alt: "Manhattan Beach chef kitchen with large island and ultra-modern detailing",
        caption: "Chef's kitchen view, where the island, cabinetry, and clear circulation make the space practical as well as visually clean.",
      },
    ]),
    serviceSlug: "custom-home-construction-los-angeles",
    location: "Manhattan Beach, CA",
    neighborhood: "Manhattan Beach",
    scope: "Ground-Up Contemporary Home",
    timeline: "14 months",
    squareFootage: "4,200 sq ft",
    completionDate: "2023",
    category: "Custom Home Build",
    highlights: [
      "Contemporary coastal architecture with controlled indoor-outdoor flow",
      "Strong front entry sequence and refined evening presence",
      "Modern great room and chef's kitchen planned around clarity and light",
      "Multiple outdoor zones, including pool terrace and upper lounge",
      "Minimal but warm finish language suited to Manhattan Beach living",
    ],
    heroTitle: "Manhattan Beach Contemporary Residence",
    heroSubtitle:
      "A project that leans into quiet luxury, strong proportions, and the kind of indoor-outdoor modern living that fits Manhattan Beach.",
    challenge: [
      "The design needed to feel contemporary and high-end without turning cold. In a coastal neighborhood, that balance between precision and comfort is easy to miss.",
      "The site also called for multiple distinct outdoor moments, including a stronger entertaining zone and a more private upper-level experience.",
    ],
    approach: [
      "The concept uses a restrained material palette and very clear room geometry so the home feels composed rather than overly expressive.",
      "Outdoor zones were separated by mood and function, giving the property more range than a single catch-all patio strategy.",
    ],
    build: [
      "The entry, kitchen, great room, and pool edge are the four anchor experiences, with the remaining rooms supporting that sequence and keeping the plan legible.",
      "The lighting strategy is understated but important, especially at dusk when the home shifts from a crisp daytime object to a softer residential setting.",
    ],
    result: [
      "The finished concept expands the visible portfolio into a cleaner contemporary coastal direction while staying consistent with econstruct's premium-home positioning.",
      "It adds geographic diversity to the portfolio while staying aligned with econstruct's premium-home positioning.",
    ],
    takeaways: [
      "Contemporary coastal homes need warmth in the material palette or they risk feeling generic.",
      "Distinct outdoor zones create a stronger luxury read than one oversized patio alone.",
      "The best Manhattan Beach work feels calm first, impressive second.",
    ],
  },
  {
    slug: "calabasas-mediterranean-estate-review",
    shortTitle: "Calabasas Mediterranean",
    title: "Calabasas Mediterranean Estate",
    description:
      "A sunlit Mediterranean estate in Calabasas with a strong arrival sequence, red-tile rooflines, generous entertaining rooms, and layered backyard living built around pool, terrace, and lounge spaces.",
    image: tempImage("calabasas-mediterranean-estate-review", 1),
    gallery: tempGallery("calabasas-mediterranean-estate-review", [
      {
        alt: "Calabasas Mediterranean estate exterior hero image with white stucco and red tile roof",
        caption: "Primary exterior image showing the white-stucco massing, rooflines, and the type of curb presence expected in an upper-tier Calabasas home.",
      },
      {
        alt: "Calabasas Mediterranean arched entrance and front arrival composition",
        caption: "Arched entry composition, where proportion and materiality do most of the work rather than excessive ornament.",
      },
      {
        alt: "Calabasas Mediterranean backyard pool reflecting the home at dusk",
        caption: "Pool reflection view, showing the house and water working together as a single backyard focal point.",
      },
      {
        alt: "Calabasas Mediterranean backyard terrace lounge with stone detailing",
        caption: "Stone terrace lounge designed for layered entertaining, with enough structure to feel intentional rather than leftover space.",
      },
      {
        alt: "Calabasas Mediterranean chef kitchen inside a grand estate home",
        caption: "Kitchen view, where the room feels substantial and family-scaled without losing visual clarity.",
      },
      {
        alt: "Calabasas Mediterranean great room flowing toward the exterior",
        caption: "Great room perspective, centered on openness and the connection between interior living and the rear terrace.",
      },
      {
        alt: "Calabasas Mediterranean grand foyer interior with layered sightlines",
        caption: "Foyer sequence showing how the house establishes scale immediately but still keeps the circulation readable.",
      },
      {
        alt: "Calabasas Mediterranean bathroom with freestanding tub and warm finishes",
        caption: "Primary bath concept, using quiet luxury rather than visual noise to create a more durable high-end feel.",
      },
      {
        alt: "Calabasas Mediterranean primary bedroom suite with estate-scale proportions",
        caption: "Primary suite view, emphasizing scale, light, and a more classic residential calm.",
      },
      {
        alt: "Calabasas Mediterranean white stucco estate at golden hour",
        caption: "Golden-hour exterior, where the Mediterranean palette and massing read especially well in warm light.",
      },
      {
        alt: "Calabasas Mediterranean white stucco mansion with red tile roof and strong front elevation",
        caption: "Front-elevation view highlighting the architecture's symmetry, roofline rhythm, and polished estate character.",
      },
    ]),
    serviceSlug: "custom-home-construction-los-angeles",
    location: "Calabasas, CA",
    neighborhood: "Calabasas",
    scope: "Ground-Up Estate Build",
    timeline: "16 months",
    squareFootage: "6,100 sq ft",
    completionDate: "2024",
    category: "Custom Home Build",
    highlights: [
      "Mediterranean estate architecture calibrated for the Calabasas luxury market",
      "Strong arrival sequence with arched entry and estate-scale front elevation",
      "Great room, kitchen, and outdoor spaces aligned for entertaining",
      "Pool, terrace, and lounge areas designed as a coherent backyard system",
      "Classic materials used with restraint to avoid visual excess",
    ],
    heroTitle: "Calabasas Mediterranean Estate",
    heroSubtitle:
      "A project shaped around a classic Southern California estate vocabulary and a clean, contemporary approach to luxury family living.",
    challenge: [
      "Mediterranean homes can become visually heavy very quickly, especially at this scale. The challenge was preserving the romance of the style while keeping the project sharp and current.",
      "The entertaining program also needed to read clearly, with a believable relationship between front arrival, central family spaces, and the backyard living sequence.",
    ],
    approach: [
      "The concept uses clean white stucco, disciplined roof geometry, and a restrained material story so the estate feels elevated instead of busy.",
      "The plan is organized around a few strong moments, including the front entry, the great room, and the rear pool terrace, to keep the experience legible for both residents and guests.",
    ],
    build: [
      "Shared living spaces are scaled generously but still broken down through openings, furniture logic, and sightlines so the home never feels oversized for its own sake.",
      "The exterior sequence is especially important, with terraces and pool areas designed to work as separate destinations that still read as one composition.",
    ],
    result: [
      "The finished concept gives the portfolio a classic estate project that complements the more contemporary and midcentury entries.",
      "It also pairs well with the existing Calabasas work already visible on the live site without duplicating it directly.",
    ],
    takeaways: [
      "Mediterranean luxury works best when the detailing is selective rather than constant.",
      "Estate-scale backyard design needs hierarchy or it quickly feels loose.",
      "Classic styles still benefit from a contemporary editing mindset.",
    ],
  },
  {
    slug: "bel-air-mediterranean-estate",
    shortTitle: "Bel Air Mediterranean",
    title: "Bel Air Mediterranean Estate",
    description:
      "A grand Bel Air Mediterranean estate concept with a formal arrival, strong stone detailing, a refined great room, a chef's kitchen, and a resort-caliber backyard designed for entertaining at scale.",
    image: tempImage("bel-air-mediterranean-estate", 1),
    gallery: tempGallery("bel-air-mediterranean-estate", [
      {
        alt: "Bel Air Mediterranean estate exterior hero image with formal massing and stone detailing",
        caption: "Primary exterior image, establishing the home's formal architecture and the level of material richness expected in Bel Air.",
      },
      {
        alt: "Bel Air chef kitchen with oversized stone island and premium detailing",
        caption: "Kitchen view, where the island and cabinetry create a sense of scale without losing functionality.",
      },
      {
        alt: "Bel Air great room with stone fireplace and large ceiling volume",
        caption: "Great room perspective built around volume, fireplace anchoring, and a more formal luxury character.",
      },
      {
        alt: "Bel Air grand foyer interior with estate-style entry sequence",
        caption: "Grand foyer view, designed to establish hierarchy immediately on arrival and set up the house's more ceremonial tone.",
      },
      {
        alt: "Bel Air luxury primary bathroom with marble and tailored lighting",
        caption: "Primary bath image showing how the project carries its luxury through finish discipline rather than visual clutter.",
      },
      {
        alt: "Bel Air Mediterranean mansion with tiled roof and cobblestone drive",
        caption: "Approach view where roof, paving, and facade work together to create the home's estate-level arrival sequence.",
      },
      {
        alt: "Bel Air primary bedroom suite with classic luxury styling",
        caption: "Primary suite scene focused on scale, symmetry, and a quieter expression of luxury.",
      },
      {
        alt: "Bel Air resort-style infinity pool beside stone estate",
        caption: "Pool image showing how the outdoor spaces support large-format entertaining while still feeling composed.",
      },
      {
        alt: "Bel Air stone estate backyard with gardens and layered terraces",
        caption: "Rear-yard perspective where landscape, pool, and built form are designed as one outdoor composition.",
      },
      {
        alt: "Bel Air stone mansion exterior at golden hour with warm lighting",
        caption: "Golden-hour exterior emphasizing the richness of the stonework and the house's evening presence.",
      },
      {
        alt: "Bel Air wrought-iron gate and fountain creating formal front entry",
        caption: "Gate and fountain moment, reinforcing the sense of privacy and ceremonial arrival that suits a Bel Air estate.",
      },
    ]),
    serviceSlug: "luxury-home-builder-los-angeles",
    location: "Bel Air, Los Angeles, CA",
    neighborhood: "Bel Air",
    scope: "Luxury Estate Construction",
    timeline: "18 months",
    squareFootage: "7,200 sq ft",
    completionDate: "2025",
    category: "Luxury New Build",
    highlights: [
      "Formal Mediterranean estate language tuned for Bel Air expectations",
      "Grand arrival sequence with gate, fountain, and stone-rich front elevation",
      "Large-format kitchen and great room for high-end entertaining",
      "Primary suite, bath, and backyard all designed at estate scale",
      "Resort-level pool and garden composition integrated with the home",
    ],
    heroTitle: "Bel Air Mediterranean Estate",
    heroSubtitle:
      "A project that pushes further into formal estate territory, with a stronger arrival sequence and a more ceremonial luxury tone than the rest of the set.",
    challenge: [
      "Bel Air demands a more elevated sense of arrival and privacy than a typical luxury project. The architecture has to feel substantial and controlled from the gate onward.",
      "At the same time, the home still needed to support everyday living, not just read as a statement piece in photographs.",
    ],
    approach: [
      "The concept uses the front gate, fountain, foyer, and great room as a deliberate sequence of increasing scale, giving the estate a strong narrative from first approach through primary gathering space.",
      "The material palette stays classic, but the composition is edited so the home feels intentional rather than overloaded.",
    ],
    build: [
      "Interior rooms are large and formal, but the planning still preserves clarity, with each public space having a legible purpose and a relationship to the outdoor entertaining program.",
      "The backyard strategy treats pool, terrace, and landscape as one luxury system that supports both quiet use and larger social events.",
    ],
    result: [
      "The concept rounds out the five-project set with the most formal estate expression of the group and gives the portfolio a distinct Bel Air presence.",
      "It also creates a strong approval-page anchor because the architecture reads immediately, even before a viewer gets into details.",
    ],
    takeaways: [
      "Formal luxury still needs a clear sequence or it can feel theatrical rather than expensive.",
      "Bel Air projects benefit from strong privacy cues at the entry, not just at the backyard.",
      "Large-scale entertaining works best when the outdoor program is structured, not simply expansive.",
    ],
  },
];

export const temporaryProjectSummaries = temporaryProjectPages.map((project) => ({
  slug: project.slug,
  shortTitle: project.shortTitle,
  title: project.title,
  description: project.description,
  image: project.image,
  location: project.location,
  neighborhood: project.neighborhood,
  scope: project.scope,
  completionDate: project.completionDate,
  category: project.category,
  highlights: project.highlights,
}));

export function getTemporaryProjectBySlug(slug: string) {
  return temporaryProjectPages.find((project) => project.slug === slug);
}
