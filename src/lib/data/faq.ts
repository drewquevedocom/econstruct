export interface FAQ {
  question: string;
  answer: string;
  category: "general" | "fire-rebuild" | "pricing" | "process";
}

export const faqs: FAQ[] = [
  // General
  { category: "general", question: "What areas does econstruct serve?", answer: "We serve all of Los Angeles County with a focus on Pacific Palisades, Brentwood, Santa Monica, Bel Air, Malibu, Altadena, and surrounding premium neighborhoods. Our office is in Valencia, with project teams deployed throughout LA." },
  { category: "general", question: "Is econstruct properly licensed and insured?", answer: "Yes. econstruct holds California Contractor License #964015. We carry comprehensive general liability insurance, workers' compensation, and are bonded. You can verify our license on the CSLB website." },
  { category: "general", question: "How long has econstruct been in business?", answer: "econstruct Inc. was founded in 2011 and has been building in Los Angeles for over 15 years. Our leadership team has been active in Southern California construction since 2001 - more than 25 years of combined, hands-on residential experience - and has delivered 345+ projects across the region." },
  { category: "general", question: "Do you work with architects?", answer: "Absolutely. We partner with top architectural firms across LA and can also recommend architects based on your project style and scope. We offer architect partnerships with design-preserve pricing." },
  { category: "general", question: "What makes econstruct different from other contractors?", answer: "Three things: 25+ years of specialized construction experience, the ability to expedite permits 3× faster than industry average, and direct owner-level involvement on every project. We're not a volume builder - we're craftsmen who happen to build at scale." },

  // Fire Rebuild
  { category: "fire-rebuild", question: "Can you help with insurance claims for fire rebuilds?", answer: "We provide comprehensive insurance coordination including gap analysis, scope validation reports, and direct coordination with your adjuster. We've found that most fire settlements have significant gaps — our team helps identify and address them before construction begins." },
  { category: "fire-rebuild", question: "What is WUI-compliant construction?", answer: "WUI (Wildland-Urban Interface) zones require specific fire-resistant building materials and construction methods. This includes ember-resistant vents, non-combustible roofing, tempered glass, and defensible space landscaping. econstruct specializes in WUI zone construction." },
  { category: "fire-rebuild", question: "How long does a fire rebuild take?", answer: "Typical fire rebuilds take 12-18 months from permitting to completion. econstruct's expedited permitting process can reduce that by 3-4 months compared to industry average. Timeline depends on project complexity and city approval processes." },
  { category: "fire-rebuild", question: "Can I build a larger home than what was destroyed?", answer: "In most cases, yes. Many municipalities allow rebuilding to current zoning allowances, which may permit a larger footprint than the original structure. We help navigate the specific regulations for your lot and zone." },
  { category: "fire-rebuild", question: "What if my insurance settlement isn't enough to cover the rebuild?", answer: "This is extremely common. Construction costs have increased significantly, and most policies don't cover current WUI compliance requirements. We provide detailed cost breakdowns upfront so you can pursue additional coverage or plan accordingly." },
  { category: "fire-rebuild", question: "Do you handle the demolition and site clearing?", answer: "Yes. We manage the entire process from debris removal and site assessment through final landscaping. This includes environmental testing, foundation evaluation, and all necessary permits for demolition." },

  // Pricing
  { category: "pricing", question: "How much does a luxury home build or remodel cost?", answer: "Our projects typically range from $450 to $800+ per square foot depending on scope, finishes, and complexity. Fire rebuilds start around $450/sq ft, luxury modernizations at $500/sq ft, and ground-up custom homes at $500-$1,000+/sq ft." },
  { category: "pricing", question: "Do you offer financing?", answer: "While we don't offer direct financing, we work with several preferred lenders who specialize in construction loans for high-end residential projects. We can provide introductions and help coordinate draw schedules." },
  { category: "pricing", question: "What's included in your pricing?", answer: "Our pricing includes all labor, materials, permits, project management, and warranty. Design and architectural services are quoted separately. We provide detailed line-item budgets so you know exactly where every dollar goes." },
  { category: "pricing", question: "How does the consultation process work?", answer: "Your initial consultation is completely free. We assess your property, discuss your vision and budget, and provide a preliminary project scope. From there, we develop a detailed proposal within 5-7 business days." },

  // Process
  { category: "process", question: "What is your typical project timeline?", answer: "ADU/additions: 4-8 months. Luxury modernizations: 6-12 months. Fire rebuilds: 12-18 months. Ground-up custom homes: 14-24 months. These are from permit approval to completion — we expedite the permitting phase significantly." },
  { category: "process", question: "Who will manage my project day-to-day?", answer: "Every project has a dedicated project manager, with our ownership team personally overseeing all work and conducting regular site visits. You'll have direct communication with your PM and executive leadership throughout the build." },
  { category: "process", question: "How do you handle change orders?", answer: "Changes are documented, priced, and approved in writing before any work begins. We provide transparent cost breakdowns for all changes. Our detailed planning process minimizes unexpected changes." },
  { category: "process", question: "Do you provide a warranty?", answer: "Yes. We provide a comprehensive warranty covering structural elements for 10 years, systems (plumbing, electrical, HVAC) for 2 years, and finishes for 1 year. Manufacturer warranties on materials and appliances are passed through to you." },
  { category: "process", question: "Can I visit the job site during construction?", answer: "Absolutely. We encourage client involvement and schedule regular walkthroughs. You'll also receive weekly progress reports with photos and updates via our project management platform." },
];

export const faqCategories = [
  { label: "All", value: "all" },
  { label: "General", value: "general" },
  { label: "Fire Rebuilds", value: "fire-rebuild" },
  { label: "Pricing", value: "pricing" },
  { label: "Process", value: "process" },
] as const;
