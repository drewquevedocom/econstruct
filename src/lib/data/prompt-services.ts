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
    image: "/custom_home_service.png",
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
    image: "/fire_rebuild_service.png",
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
    image: "/custom_home_service.png",
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
    image: "/custom_home_service.png",
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
    slug: "kitchen-remodel-los-angeles",
    navLabel: "Kitchen Remodel",
    title: "Luxury Kitchen Remodel in Los Angeles",
    metaTitle: "Luxury Kitchen Remodel in Los Angeles",
    metaDescription:
      "Luxury kitchen remodel contractor in Los Angeles for premium cabinetry, appliances, stone, lighting, and high-end renovation execution.",
    heroTitle: "Luxury Kitchen Remodel in Los Angeles",
    heroSubtitle: "High-end kitchen renovation built around better flow, premium materials, and polished field execution.",
    image: "/luxury_mod_service.png",
    intro: [
      "A luxury kitchen remodel is not just a cabinet package. It is a coordination-heavy renovation that touches layout, appliances, ventilation, power, plumbing, lighting, and finishes.",
      "econstruct approaches kitchens with the same rigor we bring to larger residential work.",
      "The goal is not simply a pretty kitchen. The goal is a room that works, performs, and feels resolved at the level expected in a premium home.",
    ],
    processTitle: "How We Approach Kitchen Renovations",
    processSteps: [
      { label: "01", title: "Design Planning", description: "We align layout, appliance strategy, storage goals, and finish direction before pricing is finalized." },
      { label: "02", title: "Demolition", description: "Selective demolition is organized to protect the surrounding home and set up clean installation." },
      { label: "03", title: "MEP Coordination", description: "Plumbing, electrical, lighting, and ventilation are coordinated around the final kitchen plan." },
      { label: "04", title: "Installation", description: "Cabinetry, stone, fixtures, and specialty components are installed in the right sequence." },
      { label: "05", title: "Finishing", description: "Final adjustments, hardware, paint touchups, and punch close the remodel correctly." },
    ],
    differentiatorsTitle: "What Sets Our Kitchen Remodels Apart",
    differentiators: [
      { title: "Layout-first thinking", description: "We push the room to work better before spending on surface-level upgrades." },
      { title: "Premium material coordination", description: "Stone, millwork, fixtures, and appliances are treated as an integrated package." },
      { title: "High-end installation standards", description: "Luxury kitchens fail when tolerances slip. We keep the field execution tight." },
      { title: "Clear cost conversations", description: "Clients get practical guidance on where luxury spend matters most." },
    ],
    serviceAreas: [
      { area: "Brentwood", note: "Large family kitchens and refined finish expectations." },
      { area: "Santa Monica", note: "Modern kitchens with strong indoor-outdoor relationships." },
      { area: "Beverly Hills", note: "Custom cabinetry, appliance suites, and high-detail finishes." },
      { area: "Los Feliz", note: "Remodels that balance character with modern performance." },
    ],
    galleryProjectSlugs: ["luxury-custom-home-santa-monica"],
    faqs: [
      { question: "How much does a luxury kitchen remodel cost in Los Angeles?", answer: "The range is wide because appliance packages, cabinetry type, structural changes, and finish quality all move the budget." },
      { question: "How long does a kitchen remodel take?", answer: "Premium kitchens often take longer than owners expect because cabinetry, stone, and specialty equipment all have sequencing implications." },
      { question: "Can I stay in my home during the remodel?", answer: "Often yes, but it depends on how much of the surrounding area is affected and how disruptive the utility work will be." },
      { question: "Do you handle plumbing and electrical work?", answer: "Yes. Kitchen remodels are coordinated across plumbing, electrical, lighting, and ventilation as part of the full project scope." },
      { question: "Can you help with material selection?", answer: "Yes. We help clients compare premium and ultra-premium options so the final design feels intentional." },
    ],
    relatedLinks: [
      { label: "Considering a full custom home project?", href: "/services/custom-home-construction-los-angeles" },
      { label: "See project examples", href: "/projects" },
      { label: "Book a consultation", href: "/contact" },
    ],
  },
  {
    slug: "bathroom-remodel-los-angeles",
    navLabel: "Bathroom Remodel",
    title: "Luxury Bathroom Remodel in Los Angeles",
    metaTitle: "Luxury Bathroom Remodel in Los Angeles",
    metaDescription:
      "Luxury bathroom remodel contractor in Los Angeles for spa-style baths, wet rooms, stone finishes, and premium renovation planning.",
    heroTitle: "Luxury Bathroom Remodel in Los Angeles",
    heroSubtitle: "Spa-style bathroom renovation with smart planning, refined finishes, and reliable construction execution.",
    image: "/luxury_mod_service.png",
    intro: [
      "Bathroom remodels are compact but technically demanding. Waterproofing, ventilation, lighting, slab and tile detailing, fixture layout, and accessibility decisions all matter.",
      "econstruct delivers premium bathroom renovations for clients who want the room to feel elevated and perform well over time.",
      "Whether the goal is a primary suite retreat or a sharper guest bath, we build the project with the same discipline as larger residential work.",
    ],
    processTitle: "How We Build Better Bathrooms",
    processSteps: [
      { label: "01", title: "Planning & Layout", description: "We review how the bathroom is used, what should change, and what level of reconfiguration makes sense." },
      { label: "02", title: "Material Selection", description: "Tile, stone, plumbing fixtures, lighting, glass, and cabinetry are selected as one package." },
      { label: "03", title: "Demolition & Prep", description: "Demo and substrate prep are completed carefully to set up waterproofing and installation correctly." },
      { label: "04", title: "Systems & Finishes", description: "Plumbing, electrical, waterproofing, tile, stone, and finish carpentry are executed in sequence." },
      { label: "05", title: "Final Detailing", description: "Glass, hardware, punch, and final calibration close out the remodel at a premium standard." },
    ],
    differentiatorsTitle: "Why Clients Choose econstruct for Bathroom Renovations",
    differentiators: [
      { title: "Spa-style design sensibility", description: "We help shape bathrooms that feel calm, intentional, and materially refined." },
      { title: "Technical execution", description: "Waterproofing and installation quality are treated as core work, not invisible work." },
      { title: "Accessibility options", description: "We can incorporate aging-in-place and mobility-driven upgrades without making the room feel clinical." },
      { title: "Premium finish control", description: "Stone, tile, fixtures, and lighting are coordinated so the final room feels resolved." },
    ],
    serviceAreas: [
      { area: "Hancock Park", note: "Primary suite upgrades in architecturally significant homes." },
      { area: "Encino", note: "High-comfort remodels with strong resale and livability value." },
      { area: "Beverly Hills", note: "Luxury bath packages with premium stone and fixture selections." },
      { area: "Silver Lake", note: "Modernized layouts and better functionality in tighter footprints." },
    ],
    galleryProjectSlugs: ["luxury-custom-home-santa-monica"],
    faqs: [
      { question: "How much does a luxury bathroom remodel cost?", answer: "The cost depends on layout changes, finish level, tile and slab decisions, waterproofing scope, and fixture package." },
      { question: "How long does a bathroom remodel take?", answer: "Bathroom remodel timelines vary by scope and material lead times, but quality execution requires disciplined sequencing." },
      { question: "Can you add a bathroom where there is not one now?", answer: "In many cases yes, but it depends on plumbing paths, structure, venting, and code considerations in the existing home." },
      { question: "Can you make the bathroom more water-efficient?", answer: "Yes. Efficient fixtures, better lighting strategy, and upgraded systems can all be integrated without compromising the look and feel of the room." },
      { question: "Do bathroom remodels need permits?", answer: "Some do and some do not, depending on the extent of structural, plumbing, electrical, and layout changes." },
    ],
    relatedLinks: [
      { label: "Thinking about a kitchen too?", href: "/services/kitchen-remodel-los-angeles" },
      { label: "Browse our project work", href: "/projects" },
      { label: "Talk to our team", href: "/contact" },
    ],
  },
  {
    slug: "commercial-tenant-improvement-los-angeles",
    navLabel: "Commercial Tenant Improvement",
    title: "Commercial Tenant Improvement Contractor in Los Angeles",
    metaTitle: "Commercial Tenant Improvement Contractor in Los Angeles",
    metaDescription:
      "Commercial tenant improvement contractor in Los Angeles for office buildouts, retail spaces, restaurant upgrades, and schedule-driven interior construction.",
    heroTitle: "Commercial Tenant Improvement Contractor in Los Angeles",
    heroSubtitle: "Office, retail, and commercial buildouts managed around schedule pressure, tenant needs, and dependable execution.",
    image: "/luxury_mod_service.png",
    intro: [
      "Commercial tenant improvement work moves under a different kind of pressure than residential construction.",
      "econstruct approaches TI work with active preconstruction, strong coordination, clear schedule control, and field execution that respects the cost of delay.",
      "Whether the project is a creative office, retail environment, or another client-facing interior, we keep the process organized so the tenant is not forced to manage the contractor.",
    ],
    processTitle: "How We Deliver Tenant Improvements",
    processSteps: [
      { label: "01", title: "Scope Alignment", description: "We define the business need, lease constraints, and construction scope before pricing or scheduling drifts." },
      { label: "02", title: "Landlord & Consultant Coordination", description: "Approvals, design teams, and building requirements are brought into one active workflow." },
      { label: "03", title: "Permitting", description: "We move the permit package with a focus on keeping occupancy goals realistic." },
      { label: "04", title: "Buildout", description: "The construction phase is run with schedule discipline, trade coordination, and punch control." },
      { label: "05", title: "Turnover", description: "Final inspections and turnover are handled cleanly so the business can move in with confidence." },
    ],
    differentiatorsTitle: "Why Businesses Choose econstruct for TI Projects",
    differentiators: [
      { title: "Time-sensitive execution", description: "We understand that every week of delay can have real business cost." },
      { title: "ADA and compliance awareness", description: "Commercial interiors need to work legally as well as visually." },
      { title: "TI allowance fluency", description: "We help owners and tenants think clearly about scope relative to lease economics." },
      { title: "Professional client communication", description: "Commercial clients need predictable reporting and decisive coordination." },
    ],
    serviceAreas: [
      { area: "West Los Angeles", note: "Creative office and professional service buildouts." },
      { area: "Santa Monica", note: "Design-sensitive commercial interiors with strong finish expectations." },
      { area: "Beverly Hills", note: "Client-facing spaces where image and execution quality both matter." },
      { area: "Culver City", note: "Fast-moving work environments where schedule discipline is critical." },
    ],
    galleryProjectSlugs: ["commercial-tenant-improvement-creative-office"],
    faqs: [
      { question: "What is a tenant improvement project?", answer: "A tenant improvement is the interior construction required to make a leased commercial space functional for a specific business or tenant." },
      { question: "Who usually pays for tenant improvements?", answer: "It depends on the lease structure. Sometimes the landlord contributes through a TI allowance, and sometimes the tenant funds part or all of the additional scope." },
      { question: "How long does a commercial buildout take?", answer: "The answer depends on permitting, landlord review, long-lead materials, and project complexity, but schedule pressure is always a major part of TI planning." },
      { question: "Are permits required for tenant improvements?", answer: "Very often yes, especially when the work affects walls, mechanical systems, electrical, accessibility, life safety, or occupancy-related conditions." },
      { question: "Can construction happen while the business is operating?", answer: "Sometimes, but it depends on the type of space, the scope of work, and the phasing strategy." },
    ],
    relatedLinks: [
      { label: "See the commercial case study", href: "/projects/commercial-tenant-improvement-creative-office" },
      { label: "View our projects hub", href: "/projects" },
      { label: "Contact econstruct", href: "/contact" },
    ],
  },
];

export function getPromptServiceBySlug(slug: string) {
  return promptServices.find((service) => service.slug === slug);
}
