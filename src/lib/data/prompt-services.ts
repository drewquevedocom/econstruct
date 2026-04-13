export interface PromptServicePage {
  slug: string;
  navLabel: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  image: string;
  intro: string[];
  processTitle: string;
  processSteps: {
    label: string;
    title: string;
    description: string;
  }[];
  differentiatorsTitle: string;
  differentiators: {
    title: string;
    description: string;
  }[];
  serviceAreas: {
    area: string;
    note: string;
  }[];
  galleryProjectSlugs: string[];
  faqs: {
    question: string;
    answer: string;
  }[];
  relatedLinks: {
    label: string;
    href: string;
  }[];
}

export const promptServices: PromptServicePage[] = [
  {
    slug: "luxury-home-builder-los-angeles",
    navLabel: "Luxury Home Building",
    title: "Luxury Home Builder in Los Angeles",
    metaTitle: "Luxury Home Builder in Los Angeles",
    metaDescription:
      "Luxury home builder in Los Angeles for Beverly Hills, Bel Air, Malibu, and Pacific Palisades. Design-build leadership, premium execution, and clear project control.",
    heroTitle: "Luxury Home Builder in Los Angeles",
    heroSubtitle:
      "Custom-built luxury homes designed for the way you live, managed with the rigor high-end projects demand.",
    image: "/Modern_Home copy.png",
    intro: [
      "econstruct builds luxury homes for clients who expect design integrity, proactive project management, and premium execution from preconstruction through final turnover.",
      "Luxury construction in Los Angeles is about permits, architecture, procurement, hillside and coastal constraints, and field execution that protects the design intent.",
      "Frank Neimroozi stays close to the work because high-end clients need leadership, not distance.",
    ],
    processTitle: "How We Build Your Dream Home",
    processSteps: [
      { label: "01", title: "Design Consultation", description: "We define project goals, design priorities, site conditions, and budget expectations before design gets ahead of build reality." },
      { label: "02", title: "Architecture & Engineering", description: "We coordinate with your architect or trusted partners to keep the design ambitious, buildable, and aligned with procurement and schedule." },
      { label: "03", title: "Permitting", description: "We organize the permit path early so city review, consultant responses, and revisions do not become uncontrolled delay." },
      { label: "04", title: "Construction", description: "The build is managed through active supervision, trade coordination, and client communication that stays ahead of field issues." },
      { label: "05", title: "Final Walkthrough", description: "We finish with punch, systems review, and turnover documentation that reflects the level of home we were hired to deliver." },
    ],
    differentiatorsTitle: "Why LA's Most Discerning Homeowners Choose econstruct",
    differentiators: [
      { title: "Hands-on project leadership", description: "Frank remains directly involved in the major decisions that shape budget, sequencing, and build quality." },
      { title: "Transparent pricing discipline", description: "We approach cost planning with real-world procurement and construction logic, not optimistic placeholders." },
      { title: "Premium trade and material coordination", description: "High-end results depend on trade alignment, detailing, and finish sequencing. We manage those connections tightly." },
      { title: "Licensed, bonded, and insured", description: "Clients get a California-licensed contractor with the operational structure required for premium residential work." },
    ],
    serviceAreas: [
      { area: "Beverly Hills", note: "Large estates, privacy demands, and highly finished custom work." },
      { area: "Bel Air", note: "Hillside logistics, engineered foundations, and complex access planning." },
      { area: "Pacific Palisades", note: "Rebuild pressure, fire-zone requirements, and premium coastal expectations." },
      { area: "Malibu", note: "Coastal review constraints, exposure conditions, and material durability." },
    ],
    galleryProjectSlugs: ["luxury-custom-home-santa-monica", "palisades-fire-rebuild"],
    faqs: [
      { question: "How much does it cost to build a luxury home in Los Angeles?", answer: "Luxury home construction often starts around $500 per square foot and can move well past $1,500 per square foot depending on site, structure, and finishes." },
      { question: "How long does it take to build a custom luxury home in LA?", answer: "Most luxury custom homes take 12 to 24 months for construction after design and permitting are substantially complete." },
      { question: "Do you handle architecture and design, or do I need my own architect?", answer: "Either approach works. We can coordinate with your current architect or help assemble the right team." },
      { question: "What Los Angeles neighborhoods do you serve for luxury home construction?", answer: "We work across Los Angeles, including Beverly Hills, Bel Air, Pacific Palisades, Malibu, Santa Monica, Brentwood, Encino, Calabasas, and Hidden Hills." },
      { question: "Are you licensed and insured for luxury construction in California?", answer: "Yes. econstruct Inc. is a fully licensed California general contractor, bonded, and insured for premium residential work." },
    ],
    relatedLinks: [
      { label: "See our project portfolio", href: "/projects" },
      { label: "Meet Frank and the team", href: "/about" },
      { label: "Schedule a consultation", href: "/contact" },
    ],
  },
  {
    slug: "fire-rebuild-contractor-los-angeles",
    navLabel: "Fire Rebuild",
    title: "Fire Rebuild Contractor in Los Angeles",
    metaTitle: "Fire Rebuild Contractor in Los Angeles",
    metaDescription:
      "Fire rebuild contractor in Los Angeles for Palisades, Malibu, and surrounding areas. Insurance coordination, permitting support, and code-ready reconstruction.",
    heroTitle: "Fire Rebuild Contractor in Los Angeles",
    heroSubtitle: "Rebuilding Los Angeles homes with care, precision, and urgency after wildfire loss.",
    image: "/Fire Damage Rebuilds 2.png",
    intro: [
      "The construction problem is only one part of a fire loss. The real challenge is coordinating insurance, design, permits, demolition, code upgrades, and the emotional weight of starting over.",
      "Our fire rebuild work in Los Angeles is shaped by what homeowners in Pacific Palisades, Malibu, and other fire-affected areas actually need: a contractor who can move quickly and work clearly.",
      "Frank Neimroozi stays close to these projects because post-fire rebuilds require judgment, not a generic insurance-repair workflow.",
    ],
    processTitle: "From Insurance Claim to Move-In: How econstruct Rebuilds",
    processSteps: [
      { label: "01", title: "Damage Assessment", description: "We review the site, document the scope, and determine what the rebuild actually requires under current conditions and code." },
      { label: "02", title: "Insurance Coordination", description: "Our team helps translate the rebuild scope into a format adjusters and consultants can work with more effectively." },
      { label: "03", title: "Design & Permitting", description: "We coordinate plans and city review with a focus on moving the project into permit as cleanly and quickly as possible." },
      { label: "04", title: "Demolition & Site Prep", description: "Site cleanup, preparation, and logistics are organized to avoid preventable delays before reconstruction starts." },
      { label: "05", title: "Reconstruction", description: "The rebuild is managed as a full project, with schedule control, quality oversight, and current fire-zone requirements built into the work." },
      { label: "06", title: "Final Inspection", description: "We close the project through inspection, punch, and turnover so the move-back experience is not left hanging." },
    ],
    differentiatorsTitle: "Why Homeowners Choose econstruct for Fire Rebuilds",
    differentiators: [
      { title: "Insurance-aware construction planning", description: "We understand the gap between claim paperwork and what it actually takes to rebuild in Los Angeles today." },
      { title: "Post-disaster permit discipline", description: "Permit strategy matters more after a fire because time pressure and code updates are both working against the owner." },
      { title: "Upgrade pathways during rebuild", description: "We help clients decide what to restore, what to improve, and how to phase those decisions intelligently." },
      { title: "Hands-on leadership", description: "Frank stays involved so the homeowner is not pushed into a generic insurance-repair workflow." },
    ],
    serviceAreas: [
      { area: "Pacific Palisades", note: "High urgency, premium rebuild expectations, and fire-zone detailing." },
      { area: "Malibu", note: "Coastal exposure, access constraints, and resilience-focused assemblies." },
      { area: "Altadena", note: "Neighborhood-specific rebuild conditions and insurance coordination needs." },
      { area: "Brentwood", note: "Complex client expectations when fire damage affects high-value homes." },
    ],
    galleryProjectSlugs: ["palisades-fire-rebuild"],
    faqs: [
      { question: "How long does a fire rebuild take in Los Angeles?", answer: "A full fire rebuild can easily span 12 to 24 months once design, permitting, demolition, and construction are all included." },
      { question: "Does econstruct work with my insurance company?", answer: "Yes. We regularly help clients organize scope, pricing logic, and rebuild documentation so the insurance side and construction side are not working against each other." },
      { question: "Can I upgrade my home during the rebuild?", answer: "Often yes. Many homeowners use the rebuild as a chance to improve layout, systems, finishes, or resilience features." },
      { question: "What areas of Los Angeles do you serve for fire rebuilds?", answer: "We serve Los Angeles and surrounding high-need rebuild markets including Pacific Palisades, Malibu, Brentwood, and other neighborhoods where fire recovery and premium construction intersect." },
      { question: "How much does it cost to rebuild after a fire?", answer: "Los Angeles fire rebuild costs vary widely, but many projects land in the $450 to $800 plus per square foot range, with premium homes often exceeding that." },
    ],
    relatedLinks: [
      { label: "Read the Palisades fire rebuild case study", href: "/projects/palisades-fire-rebuild" },
      { label: "Explore all projects", href: "/projects" },
      { label: "Talk to our team", href: "/contact" },
    ],
  },
  {
    slug: "custom-home-construction-los-angeles",
    navLabel: "Custom Home Construction",
    title: "Custom Home Construction in Los Angeles",
    metaTitle: "Custom Home Construction in Los Angeles",
    metaDescription:
      "Custom home construction in Los Angeles with design-build coordination, permit strategy, hillside expertise, and premium execution from concept to keys.",
    heroTitle: "Custom Home Construction in Los Angeles",
    heroSubtitle: "One team from concept to keys for clients who want a controlled, design-aware custom build process.",
    image: "/service_03_custom_home.png",
    intro: [
      "Custom home construction only works well when design, entitlement, procurement, and field execution stay connected.",
      "econstruct approaches custom home construction as a design-build leadership problem, coordinating architecture, engineering, permitting, and site execution.",
      "That matters even more on hillside lots, view properties, and constrained urban sites where small changes ripple into structural, permitting, and cost problems quickly.",
    ],
    processTitle: "Design-Build: One Team From Concept to Keys",
    processSteps: [
      { label: "01", title: "Concept Alignment", description: "We define the site, program, and budget logic before the project becomes overdesigned or underplanned." },
      { label: "02", title: "Design Development", description: "Architecture, structural thinking, and construction realities are coordinated together instead of in isolation." },
      { label: "03", title: "Permit Strategy", description: "We build the approval path into the project schedule early, especially for hillside or technically sensitive properties." },
      { label: "04", title: "Construction Execution", description: "The field team drives the work with schedule discipline, quality control, and active issue resolution." },
      { label: "05", title: "Turnover", description: "We close the project with punch, documentation, and a final product that reflects the design intent all the way through." },
    ],
    differentiatorsTitle: "What Makes econstruct Different on Custom Homes",
    differentiators: [
      { title: "Design-build mindset", description: "We manage the project as one process instead of separate consultant silos." },
      { title: "Material and finish guidance", description: "Clients get practical help choosing premium and ultra-premium options that align with scope and schedule." },
      { title: "Hillside and zoning fluency", description: "Los Angeles sites come with real constraints. We plan around them early." },
      { title: "Direct accountability", description: "You know who is leading the project and where decisions are being made." },
    ],
    serviceAreas: [
      { area: "Bel Air", note: "Large custom residences with engineering and access complexity." },
      { area: "Santa Monica", note: "Premium modern homes with high expectations on finishes and livability." },
      { area: "Calabasas", note: "Estate-style custom construction and gated-community coordination." },
      { area: "Hidden Hills", note: "Controlled neighborhoods where schedule, quality, and communication all matter." },
    ],
    galleryProjectSlugs: ["luxury-custom-home-santa-monica"],
    faqs: [
      { question: "What does custom home construction cost in Los Angeles?", answer: "Serious custom construction in Los Angeles usually begins at premium-level pricing and climbs quickly on hillside or architecturally ambitious homes." },
      { question: "How long does a custom home project take?", answer: "Most projects require several months of design and permitting before construction begins, then roughly 12 to 24 months for the build depending on complexity." },
      { question: "Can you include an ADU or guest house in the same project?", answer: "Yes. Many custom home projects include guest accommodations, ADUs, wellness spaces, or detached structures, but it is better to plan them from the beginning." },
      { question: "Do you work on green building options?", answer: "Yes. We can integrate solar readiness, efficient systems, better envelope performance, EV charging, and other sustainability goals into the planning process." },
      { question: "Do you handle the permit process?", answer: "Yes. Permit coordination is a core part of how we manage custom home projects in Los Angeles." },
    ],
    relatedLinks: [
      { label: "Also exploring luxury home building?", href: "/services/luxury-home-builder-los-angeles" },
      { label: "View featured custom projects", href: "/projects" },
      { label: "Start your consultation", href: "/contact" },
    ],
  },
  {
    slug: "home-additions-los-angeles",
    navLabel: "Home Additions",
    title: "Home Addition Contractor in Los Angeles",
    metaTitle: "Home Addition Contractor in Los Angeles",
    metaDescription:
      "Home addition contractor in Los Angeles for second stories, ADUs, guest houses, and major room additions. Permit guidance and premium execution.",
    heroTitle: "Home Addition Contractor in Los Angeles",
    heroSubtitle: "Room additions, second stories, ADUs, and garage conversions designed to add usable space without compromising the home.",
    image: "/service_04_home_additions.png.png",
    intro: [
      "Home additions succeed when the new square footage feels intentional instead of patched on.",
      "econstruct handles additions ranging from ADUs and guest houses to second-story expansions and larger home reconfigurations.",
      "In Los Angeles, addition projects also live or die on permit strategy, especially for ADUs and structurally meaningful expansions.",
    ],
    processTitle: "How We Deliver Well-Planned Additions",
    processSteps: [
      { label: "01", title: "Feasibility Review", description: "We evaluate the lot, zoning, existing structure, and the most practical path to adding space." },
      { label: "02", title: "Design & Scope", description: "Plans are developed around both function and how the new work ties into the existing house." },
      { label: "03", title: "Permitting", description: "We navigate city review and ADU-specific requirements before the build begins." },
      { label: "04", title: "Construction", description: "Structural work, tie-ins, and finish integration are managed so the addition feels coherent." },
      { label: "05", title: "Turnover", description: "The project closes with punch, system review, and a finished space ready for use or occupancy." },
    ],
    differentiatorsTitle: "Why Owners Hire econstruct for Additions",
    differentiators: [
      { title: "ADU regulation fluency", description: "We understand where California ADU rules create opportunity and where local realities still matter." },
      { title: "Structural coordination", description: "Second stories and major additions require thoughtful sequencing, not just labor." },
      { title: "Design continuity", description: "The new space is planned to belong to the house, not fight with it." },
      { title: "Value-minded execution", description: "We help owners understand where to invest for usability, resale, and clean permit outcomes." },
    ],
    serviceAreas: [
      { area: "Studio City", note: "Family-driven room additions and second-story projects." },
      { area: "Sherman Oaks", note: "ADU demand, garage conversions, and value-focused expansions." },
      { area: "Pasadena", note: "Architectural sensitivity and clean integration with existing homes." },
      { area: "Woodland Hills", note: "Detached units, guest houses, and flexible multigenerational layouts." },
    ],
    galleryProjectSlugs: ["luxury-custom-home-santa-monica"],
    faqs: [
      { question: "What types of additions do you build?", answer: "We handle room additions, second-story additions, ADUs, guest houses, and garage conversions depending on the property and the owner's goals." },
      { question: "How long does a home addition take in Los Angeles?", answer: "Smaller ADUs can move faster than large structural additions, but most projects still depend heavily on design and permit timing before field work starts." },
      { question: "Do I need an architect for an addition?", answer: "Most meaningful additions benefit from architectural and engineering input. We can work with your team or help coordinate the right design partners." },
      { question: "Will an addition increase my home value?", answer: "Usually yes when the layout, design integration, and finish level make sense for the neighborhood." },
      { question: "How difficult is the permit process for ADUs?", answer: "ADUs are more accessible than they used to be, but every lot still has real design, utility, and review considerations that need to be handled correctly." },
    ],
    relatedLinks: [
      { label: "Need a custom home instead?", href: "/services/custom-home-construction-los-angeles" },
      { label: "View completed work", href: "/projects" },
      { label: "Request a consultation", href: "/contact" },
    ],
  },
  {
    slug: "home-automation-los-angeles",
    navLabel: "Home Automation",
    title: "Home Automation & Smart Home Integration in Los Angeles",
    metaTitle: "Luxury Home Automation in Los Angeles",
    metaDescription:
      "Luxury home automation and smart home integration in Los Angeles. Lighting, shades, audio-video, climate, security, and whole-home control built into every econstruct project.",
    heroTitle: "Home Automation & Smart Home Integration in Los Angeles",
    heroSubtitle:
      "Invisible technology for high-end homes. Integrated lighting, shades, climate, audio-video, and security controlled from one refined interface.",
    image: "/service_05_home_automation.png.png",
    intro: [
      "Home automation in a luxury residence is not about gadgets. It is about making a sophisticated home feel effortless - lighting that responds to the time of day, shades that know the season, audio and video that follow you from room to room, and security that runs quietly in the background.",
      "econstruct builds home automation into new construction and modernization projects so wiring, power, networking, and device placement are planned from day one instead of bolted on later.",
      "The result is a home that looks clean, performs reliably, and grows with the owner's needs over time.",
    ],
    processTitle: "How We Design & Install Home Automation",
    processSteps: [
      { label: "01", title: "Lifestyle Discovery", description: "We start with how you actually live in the home - routines, entertainment habits, privacy needs, and which rooms matter most." },
      { label: "02", title: "System Design", description: "We coordinate with low-voltage integrators to design lighting, shading, audio-video, climate, and security as one connected system." },
      { label: "03", title: "Infrastructure Rough-In", description: "Wiring, conduit, networking, and power are installed during framing so every device has a clean home and the walls stay uncluttered." },
      { label: "04", title: "Device Integration", description: "Keypads, touchscreens, speakers, cameras, thermostats, and shading are installed, tuned, and tied into a single control platform." },
      { label: "05", title: "Calibration & Handoff", description: "We program scenes, test every subsystem, and walk you through daily use before turning the home over." },
    ],
    differentiatorsTitle: "Why Homeowners Choose econstruct for Home Automation",
    differentiators: [
      { title: "Integrated from day one", description: "Automation is planned alongside framing, electrical, and finishes - not retrofitted after drywall." },
      { title: "Brand-agnostic design", description: "We work with Control4, Savant, Crestron, Lutron, and Josh.ai so the system fits the home, not the other way around." },
      { title: "Clean, minimal interfaces", description: "Fewer switches, hidden speakers, discreet keypads, and interfaces that match the home's finish level." },
      { title: "Long-term supportability", description: "We document the system, label the rack, and hand off clear documentation so service is never guesswork." },
    ],
    serviceAreas: [
      { area: "Beverly Hills", note: "Whole-home control, theater rooms, and high-end audio-video integration." },
      { area: "Bel Air", note: "Estate-scale automation, outdoor systems, and security integration." },
      { area: "Pacific Palisades", note: "New construction and rebuild projects with automation planned from the ground up." },
      { area: "Malibu", note: "Indoor-outdoor audio, shading, and climate control for coastal homes." },
    ],
    galleryProjectSlugs: ["luxury-custom-home-santa-monica"],
    faqs: [
      { question: "What home automation systems do you work with?", answer: "We partner with integrators who install Control4, Savant, Crestron, Lutron, and Josh.ai, along with premium audio, video, and security brands. We select the system that best fits the home and how the owner wants to live in it." },
      { question: "Can you add home automation to an existing house?", answer: "Yes, especially during a luxury modernization or major remodel when walls are open. Retrofits are also possible, but the cleanest integrations happen when automation is planned into the construction sequence." },
      { question: "How much does home automation cost?", answer: "Automation packages in luxury homes typically run from roughly $40K for focused lighting and audio work up to $250K+ for fully integrated estates. We help clients match scope to budget and lifestyle priorities." },
      { question: "Do you handle the wiring and infrastructure?", answer: "Yes. Low-voltage wiring, networking, conduit paths, and equipment rack locations are coordinated as part of the construction scope so the home is ready for every device at turnover." },
      { question: "Will the system still work years from now?", answer: "That is a design decision from the start. We use professional-grade platforms, document the install, and favor systems with strong long-term support so the home ages gracefully with the technology inside it." },
    ],
    relatedLinks: [
      { label: "Pair automation with a luxury build", href: "/services/luxury-home-builder-los-angeles" },
      { label: "Browse our project work", href: "/projects" },
      { label: "Start a consultation", href: "/contact" },
    ],
  },
];

export function getPromptServiceBySlug(slug: string) {
  return promptServices.find((service) => service.slug === slug);
}
