import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import {
  generateArticleSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
} from "@/lib/schema";
import { faqs } from "@/lib/data/faq";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import AnimatedSection from "@/components/ui/AnimatedSection";
import AccordionItem from "@/components/ui/AccordionItem";
import Button from "@/components/ui/Button";
import TableOfContents from "@/components/resources/TableOfContents";
import ConsultationCTA from "@/components/ConsultationCTA";

export const metadata: Metadata = generatePageMetadata({
  title: "The Complete Guide to Fire Rebuilds in Los Angeles | econstruct",
  description:
    "Everything you need to know about rebuilding after a wildfire in Los Angeles — insurance settlements, WUI zone requirements, permits, timelines, costs, and choosing the right contractor.",
  path: "/resources/fire-rebuild-guide",
});

const fireRebuildFaqs = faqs.filter((faq) => faq.category === "fire-rebuild");

const articleSchema = generateArticleSchema({
  title: "The Complete Guide to Fire Rebuilds in Los Angeles",
  description:
    "A comprehensive guide covering insurance, WUI compliance, permitting, contractor selection, timelines, and costs for rebuilding after a wildfire in Los Angeles.",
  slug: "fire-rebuild-guide",
  date: "2025-02-15",
  image: "/econstruct_logo.png",
});

const faqSchema = generateFAQSchema(fireRebuildFaqs);

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://econstructhomes.com" },
  { name: "Resources", url: "https://econstructhomes.com/resources" },
  {
    name: "Fire Rebuild Guide",
    url: "https://econstructhomes.com/resources/fire-rebuild-guide",
  },
]);

const sections = [
  { id: "insurance-settlement", title: "Understanding Your Insurance Settlement" },
  { id: "wui-zone-requirements", title: "WUI Zone Requirements" },
  { id: "permit-process", title: "The Permit Process" },
  { id: "choosing-contractor", title: "Choosing a Contractor" },
  { id: "timeline", title: "Timeline & What to Expect" },
  { id: "cost-breakdown", title: "Cost Breakdown" },
  { id: "faq", title: "Frequently Asked Questions" },
];

export default function FireRebuildGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([articleSchema, faqSchema, breadcrumbSchema]),
        }}
      />

      <PageHero
        title="The Complete Guide to Fire Rebuilds in Los Angeles"
        subtitle="Everything homeowners need to know about rebuilding after a wildfire — from insurance and permits to timelines and costs. Written by a team with 25+ years of LA construction experience."
        breadcrumbs={[
          { label: "Resources", href: "/resources" },
          { label: "Fire Rebuild Guide" },
        ]}
      />

      <section className="py-16 md:py-24 bg-white">
        <Container>
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Sidebar ToC */}
            <div className="lg:w-64 shrink-0">
              <TableOfContents sections={sections} />
            </div>

            {/* Main content */}
            <div className="flex-1 max-w-3xl">
              {/* Intro */}
              <AnimatedSection>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Losing your home to wildfire is devastating. The path forward — navigating insurance, understanding new building codes, pulling permits, and actually rebuilding — can feel overwhelming. This guide is designed to give you a clear, honest roadmap based on our experience rebuilding dozens of homes across the Pacific Palisades, Malibu, Altadena, and throughout Los Angeles County.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-12">
                  Whether your home was lost in the Palisades Fire, the Eaton Fire, or a previous event, the fundamentals of the rebuild process are the same. We wrote this guide to help you make informed decisions, avoid common pitfalls, and ultimately build a home that is safer, more beautiful, and more resilient than the one you lost.
                </p>
              </AnimatedSection>

              {/* Section 1: Insurance */}
              <AnimatedSection>
                <section id="insurance-settlement" className="mb-16 scroll-mt-32">
                  <h2 className="text-3xl font-bold text-brand-dark mb-6">
                    Understanding Your Insurance Settlement
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Your insurance settlement is the financial foundation of your rebuild — and for most homeowners, it is also the source of the greatest frustration. The harsh reality is that the majority of fire insurance settlements in Los Angeles fall short of what it actually costs to rebuild, especially when modern code requirements are factored in.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    A typical homeowner&apos;s policy includes dwelling coverage (the cost to rebuild your structure), additional living expenses (ALE) while you are displaced, and personal property coverage. The problem lies in dwelling coverage. Most policies base their limits on replacement cost estimates that were calculated when you purchased or last renewed your policy — often years ago. Construction costs in Los Angeles have risen dramatically, and WUI-zone compliance requirements (which we cover in the next section) add significant cost that many policies do not account for.
                  </p>
                  <h3 className="text-xl font-bold text-brand-dark mt-8 mb-4">
                    Common Gaps in Fire Insurance Settlements
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                    <li><strong>Undervaluation of dwelling coverage.</strong> Policies often use cost-per-square-foot estimates of $200-$350 per square foot. Actual rebuild costs in premium LA neighborhoods range from $450 to $800+ per square foot.</li>
                    <li><strong>WUI compliance not included.</strong> Fire-hardened construction materials, ember-resistant vents, tempered glass, non-combustible roofing, and defensible space landscaping add 10-20% to the total build cost. Most policies do not include a line item for code upgrade coverage.</li>
                    <li><strong>Extended overhead and profit.</strong> Adjusters often remove or reduce overhead and profit margins from their estimates, which every licensed contractor requires to operate.</li>
                    <li><strong>Site conditions.</strong> Debris removal, soil testing, foundation assessment, and environmental remediation after a fire are expensive. Insurance may cap these costs well below actual market rates.</li>
                  </ul>
                  <h3 className="text-xl font-bold text-brand-dark mt-8 mb-4">
                    How to Maximize Your Settlement
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    First, do not accept the initial offer. The first number from your insurance company is almost always negotiable. Hire a licensed public adjuster or engage an attorney who specializes in fire insurance claims. Their fee (typically 5-10% of the additional recovery) is almost always worth it.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Second, get a detailed scope of work from a qualified contractor before negotiating with your adjuster. At econstruct, we provide complimentary scope validation reports that document every line item required to rebuild your home to current code — including WUI compliance, ADA requirements, Title 24 energy compliance, and current material costs. This document becomes your most powerful negotiating tool.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Third, understand the difference between Actual Cash Value (ACV) and Replacement Cost Value (RCV). You will typically receive ACV upfront (depreciated value) and the recoverable depreciation later, upon proof of completed repairs. Budget accordingly — the full RCV amount may not arrive until construction is well underway.
                  </p>
                </section>
              </AnimatedSection>

              {/* CTA Banner 1 */}
              <AnimatedSection className="mb-16">
                <div className="bg-gradient-to-r from-brand-dark to-black rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Need help with your insurance claim?
                    </h3>
                    <p className="text-white/70 text-sm">
                      We provide free scope validation reports to help you negotiate a fair settlement.
                    </p>
                  </div>
                  <Button href="/contact" variant="primary" size="lg">
                    Schedule a Free Consultation
                  </Button>
                </div>
              </AnimatedSection>

              {/* Section 2: WUI Zone */}
              <AnimatedSection>
                <section id="wui-zone-requirements" className="mb-16 scroll-mt-32">
                  <h2 className="text-3xl font-bold text-brand-dark mb-6">
                    WUI Zone Requirements
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    WUI stands for Wildland-Urban Interface — the zone where developed neighborhoods meet undeveloped wildland vegetation. Most of the areas devastated by recent Los Angeles wildfires fall within designated WUI zones, including Pacific Palisades, Malibu, portions of Brentwood, Altadena, and hillside communities throughout the county.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    When you rebuild in a WUI zone, your new home must comply with Chapter 7A of the California Building Code, which mandates fire-resistant construction methods and materials throughout the entire structure. This is not optional — it is a code requirement enforced through the permitting and inspection process.
                  </p>
                  <h3 className="text-xl font-bold text-brand-dark mt-8 mb-4">
                    Key WUI Material Requirements
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                    <li><strong>Roofing:</strong> Class A fire-rated roofing materials only. This includes concrete or clay tile, metal roofing, and certain composite materials. Wood shake roofs are prohibited.</li>
                    <li><strong>Exterior walls:</strong> Non-combustible or ignition-resistant materials such as stucco, fiber cement siding, stone, or brick. The assembly must resist flame and ember exposure for a minimum duration.</li>
                    <li><strong>Windows and glazing:</strong> Tempered glass is required in all exterior openings. Dual-pane with one tempered lite is the minimum standard. Multi-pane windows must use tempered glass on the exterior lite at minimum.</li>
                    <li><strong>Vents:</strong> All attic, soffit, foundation, and other ventilation openings must use ember-resistant vent assemblies that prevent ember intrusion during a wildfire. Standard mesh vents are not compliant.</li>
                    <li><strong>Decks and attached structures:</strong> Non-combustible decking materials or ignition-resistant-treated lumber. The underside of elevated decks must be enclosed with non-combustible materials.</li>
                    <li><strong>Eaves and overhangs:</strong> Enclosed eaves with non-combustible materials. Open eaves — common in mid-century and ranch-style homes — are no longer permitted in WUI zones.</li>
                  </ul>
                  <h3 className="text-xl font-bold text-brand-dark mt-8 mb-4">
                    Defensible Space Requirements
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Beyond the structure itself, California law (PRC 4291) requires homeowners in WUI zones to maintain defensible space around their property. This is divided into two zones:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                    <li><strong>Zone 1 (0-30 feet from the structure):</strong> Lean, clean, and green. Remove all dead vegetation, space trees and shrubs to prevent fire spread, use fire-resistant landscaping, and maintain irrigated ground cover.</li>
                    <li><strong>Zone 2 (30-100 feet):</strong> Reduce fuel. Thin brush and trees, remove ladder fuels (vegetation that allows fire to climb from ground level to tree canopy), and create spacing between plants and trees.</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed">
                    At econstruct, we design and build WUI-compliant structures from the ground up. Our team understands every nuance of Chapter 7A, and we coordinate with landscape architects to ensure your defensible space plan is integrated into the overall site design — not treated as an afterthought.
                  </p>
                </section>
              </AnimatedSection>

              {/* Section 3: Permit Process */}
              <AnimatedSection>
                <section id="permit-process" className="mb-16 scroll-mt-32">
                  <h2 className="text-3xl font-bold text-brand-dark mb-6">
                    The Permit Process
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    The permit process is where many fire rebuild projects stall. The Los Angeles Department of Building and Safety (LADBS) — or the county equivalent for unincorporated areas — must approve your plans before any construction can begin. Understanding this process, and having a team that can navigate it efficiently, will save you months.
                  </p>
                  <h3 className="text-xl font-bold text-brand-dark mt-8 mb-4">
                    Step-by-Step: LADBS Permitting for Fire Rebuilds
                  </h3>
                  <ol className="list-decimal list-inside space-y-3 text-gray-700 mb-4">
                    <li><strong>Site assessment and survey:</strong> Before you can submit plans, you need an updated survey of your lot. After a fire, the topography and site conditions may have changed. A licensed surveyor will document setbacks, easements, and lot boundaries.</li>
                    <li><strong>Architectural plans:</strong> Your architect will produce a full set of construction documents including floor plans, elevations, sections, structural plans, MEP (mechanical, electrical, plumbing), Title 24 energy compliance, and WUI compliance details.</li>
                    <li><strong>Plan check submission:</strong> Plans are submitted to LADBS for review. The city checks for zoning compliance, structural adequacy, fire safety, accessibility, and energy code compliance. Standard plan check takes 4-8 weeks. Express plan check can reduce this to 2-3 weeks.</li>
                    <li><strong>Corrections and resubmission:</strong> Most plans receive correction notices on the first review. Your architect addresses the corrections and resubmits. This back-and-forth can add 2-6 weeks to the timeline if not managed proactively.</li>
                    <li><strong>Permit issuance:</strong> Once plans are approved, you pay permit fees and receive your building permit. You can now begin construction.</li>
                    <li><strong>Inspections during construction:</strong> LADBS conducts inspections at key milestones — foundation, framing, rough MEP, insulation, and final. Each must pass before proceeding to the next phase.</li>
                  </ol>
                  <h3 className="text-xl font-bold text-brand-dark mt-8 mb-4">
                    How econstruct Expedites Permitting
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Our 25+ years of experience with LA permitting means we know exactly what plan checkers look for — and we address those items before submission. We maintain relationships with LADBS staff, use express plan check services, and pre-clear common WUI compliance questions before formal review. The result: our clients typically receive permits 3-4 months faster than the industry average.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    For fire rebuild clients, we also navigate any special expedited permitting programs that the city may implement after a major fire event. These programs are time-limited and require specific documentation — our team ensures you qualify and take advantage of every available acceleration.
                  </p>
                </section>
              </AnimatedSection>

              {/* CTA Banner 2 */}
              <AnimatedSection className="mb-16">
                <div className="bg-gradient-to-r from-brand-dark to-black rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Ready to start the rebuild process?
                    </h3>
                    <p className="text-white/70 text-sm">
                      Our team handles everything from permits to final inspection.
                    </p>
                  </div>
                  <Button href="/contact" variant="primary" size="lg">
                    Talk to Our Team
                  </Button>
                </div>
              </AnimatedSection>

              {/* Section 4: Choosing a Contractor */}
              <AnimatedSection>
                <section id="choosing-contractor" className="mb-16 scroll-mt-32">
                  <h2 className="text-3xl font-bold text-brand-dark mb-6">
                    Choosing a Contractor
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    The contractor you choose will determine the quality of your rebuild, the accuracy of your budget, and whether your project is completed on time. After a major fire event, the market is flooded with out-of-area contractors looking to capitalize on demand. Choosing carefully is critical.
                  </p>
                  <h3 className="text-xl font-bold text-brand-dark mt-8 mb-4">
                    What to Look For
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                    <li><strong>Active California contractor license.</strong> Verify on the CSLB website. Check for any complaints, bond claims, or disciplinary actions. The license should be a General Building (B) classification.</li>
                    <li><strong>Fire rebuild experience.</strong> Building a home from scratch after a fire is different from new construction. There are demolition, environmental, and site remediation issues unique to fire damage. Ask how many fire rebuilds they have completed.</li>
                    <li><strong>WUI compliance expertise.</strong> Not every contractor understands Chapter 7A requirements. Ask specifically about ember-resistant vents, exterior wall assemblies, and defensible space integration. A knowledgeable contractor should be able to discuss these in detail.</li>
                    <li><strong>Insurance coordination experience.</strong> Your contractor should understand how insurance draws work, how to document supplemental claims, and how to structure the project to align with your insurance disbursement schedule.</li>
                    <li><strong>References from similar projects.</strong> Ask for references specifically from fire rebuild clients, not just general construction. Visit a completed project if possible.</li>
                    <li><strong>Detailed, transparent pricing.</strong> A reputable contractor provides line-item budgets, not lump-sum quotes. You should know exactly what every dollar covers.</li>
                  </ul>
                  <h3 className="text-xl font-bold text-brand-dark mt-8 mb-4">
                    Red Flags to Watch For
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                    <li>Demanding large upfront deposits (more than 10% or $1,000, whichever is less, is the California legal maximum for a down payment).</li>
                    <li>No physical office or established local presence.</li>
                    <li>Unwillingness to provide a detailed written contract.</li>
                    <li>Pressure to sign immediately or claims of limited availability.</li>
                    <li>Quotes that are dramatically lower than other bids — this almost always leads to change orders later.</li>
                    <li>No workers&apos; compensation insurance (ask for a certificate of insurance).</li>
                  </ul>
                  <h3 className="text-xl font-bold text-brand-dark mt-8 mb-4">
                    Why econstruct
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    econstruct has been building luxury homes in Los Angeles for over 25 years. We hold California Contractor License #964015, carry comprehensive insurance, and have completed over 340 projects. Owner Frank Neimroozi is personally involved in every project, from initial consultation through final walkthrough. We specialize in WUI-compliant construction, expedited permitting, and insurance coordination — because those are the three areas where fire rebuild homeowners need the most expertise.
                  </p>
                </section>
              </AnimatedSection>

              {/* Section 5: Timeline */}
              <AnimatedSection>
                <section id="timeline" className="mb-16 scroll-mt-32">
                  <h2 className="text-3xl font-bold text-brand-dark mb-6">
                    Timeline & What to Expect
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    A fire rebuild is not a quick process. Understanding the realistic timeline upfront helps you plan your temporary housing, manage your insurance ALE benefits, and set expectations with your family. Here is a breakdown of what a typical fire rebuild timeline looks like:
                  </p>

                  <div className="space-y-6 mb-6">
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <h4 className="font-bold text-brand-dark mb-1">Months 1-2: Assessment & Planning</h4>
                      <p className="text-gray-600 text-sm">
                        Site assessment, soil testing, environmental clearance, insurance coordination, initial design consultations with your architect, and contractor selection. This phase sets the foundation for everything that follows.
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <h4 className="font-bold text-brand-dark mb-1">Months 2-5: Design & Permitting</h4>
                      <p className="text-gray-600 text-sm">
                        Architectural design development, construction documents, engineering, Title 24 compliance, WUI compliance documentation, plan check submission, and permit approval. With econstruct&apos;s expedited approach, this phase can be compressed to 2-3 months.
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <h4 className="font-bold text-brand-dark mb-1">Months 5-7: Site Work & Foundation</h4>
                      <p className="text-gray-600 text-sm">
                        Demolition of remaining structure, grading, utility connections, and foundation construction. In hillside areas, caisson or retaining wall work can extend this phase by several weeks.
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <h4 className="font-bold text-brand-dark mb-1">Months 7-10: Framing & Rough Systems</h4>
                      <p className="text-gray-600 text-sm">
                        Structural framing, roof construction, window and door installation, rough electrical, plumbing, HVAC, and low-voltage wiring. Framing inspection and rough MEP inspections occur during this phase.
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <h4 className="font-bold text-brand-dark mb-1">Months 10-12: Insulation & Drywall</h4>
                      <p className="text-gray-600 text-sm">
                        Insulation installation (per Title 24 energy requirements), drywall hanging, taping, and finishing. Insulation inspection must pass before drywall can be installed.
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <h4 className="font-bold text-brand-dark mb-1">Months 12-16: Finishes & Completion</h4>
                      <p className="text-gray-600 text-sm">
                        Flooring, cabinetry, countertops, tile, paint, fixtures, appliances, landscaping, hardscaping, defensible space compliance, final inspections, and certificate of occupancy. This is the longest phase for luxury builds due to custom material lead times.
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed">
                    <strong>Total timeline: 12-18 months</strong> from permit to completion is typical for a fire rebuild. Ground-up luxury homes with complex designs can extend to 18-24 months. The biggest variables are permitting speed, hillside site conditions, and custom material lead times. Our project managers provide weekly progress reports so you always know exactly where your build stands.
                  </p>
                </section>
              </AnimatedSection>

              {/* CTA Banner 3 */}
              <AnimatedSection className="mb-16">
                <div className="bg-gradient-to-r from-brand-dark to-black rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Get a realistic timeline for your project
                    </h3>
                    <p className="text-white/70 text-sm">
                      Every property is unique. Let us assess your site and provide a custom schedule.
                    </p>
                  </div>
                  <Button href="/contact" variant="primary" size="lg">
                    Get Your Timeline
                  </Button>
                </div>
              </AnimatedSection>

              {/* Section 6: Cost Breakdown */}
              <AnimatedSection>
                <section id="cost-breakdown" className="mb-16 scroll-mt-32">
                  <h2 className="text-3xl font-bold text-brand-dark mb-6">
                    Cost Breakdown
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    One of the most common questions we receive is: &quot;How much does it cost to rebuild after a fire?&quot; The honest answer is that it depends on many factors, but we can provide clear ranges based on our experience across hundreds of projects in Los Angeles.
                  </p>
                  <h3 className="text-xl font-bold text-brand-dark mt-8 mb-4">
                    Typical Cost Ranges (Per Square Foot)
                  </h3>
                  <div className="overflow-x-auto mb-6">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b-2 border-brand-dark">
                          <th className="py-3 pr-4 text-sm font-bold text-brand-dark uppercase tracking-wide">Category</th>
                          <th className="py-3 pr-4 text-sm font-bold text-brand-dark uppercase tracking-wide">Range</th>
                          <th className="py-3 text-sm font-bold text-brand-dark uppercase tracking-wide">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-700 text-sm">
                        <tr className="border-b border-gray-200">
                          <td className="py-3 pr-4 font-medium">Standard Premium Rebuild</td>
                          <td className="py-3 pr-4">$450-$550/sqft</td>
                          <td className="py-3">High-quality materials, efficient design, WUI-compliant</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 pr-4 font-medium">Premium Rebuild</td>
                          <td className="py-3 pr-4">$550-$700/sqft</td>
                          <td className="py-3">Designer finishes, smart home, custom cabinetry</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 pr-4 font-medium">Ultra Premium Rebuild</td>
                          <td className="py-3 pr-4">$700-$800+/sqft</td>
                          <td className="py-3">Bespoke design, imported materials, resort amenities</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 pr-4 font-medium">WUI Compliance Premium</td>
                          <td className="py-3 pr-4">+10-15%</td>
                          <td className="py-3">Fire-rated materials, ember-resistant assemblies</td>
                        </tr>
                        <tr>
                          <td className="py-3 pr-4 font-medium">Hillside / Difficult Access</td>
                          <td className="py-3 pr-4">+10-20%</td>
                          <td className="py-3">Caissons, retaining walls, limited equipment access</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <h3 className="text-xl font-bold text-brand-dark mt-8 mb-4">
                    What Drives Costs Up
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                    <li><strong>Hillside lots:</strong> Steep slopes require engineered foundations (caissons, grade beams, retaining walls) that can add $100,000-$500,000+ depending on the geology.</li>
                    <li><strong>Custom design complexity:</strong> Cantilevered structures, floor-to-ceiling glazing walls, rooftop decks, infinity pools, and home theaters all require specialized engineering and trades.</li>
                    <li><strong>Material selections:</strong> Imported Italian stone vs. domestic tile, custom steel windows vs. aluminum, solid walnut cabinetry vs. painted MDF — material choices can swing costs 30-50%.</li>
                    <li><strong>Market conditions:</strong> After a major fire event, contractor demand surges and material costs increase. Locking in a contract early can save significant money.</li>
                    <li><strong>Design changes during construction:</strong> Change orders are the single biggest cause of budget overruns. Thorough pre-construction planning — which econstruct emphasizes heavily — minimizes this risk.</li>
                  </ul>
                  <h3 className="text-xl font-bold text-brand-dark mt-8 mb-4">
                    Example: 3,500 Sq Ft Premium Rebuild in Pacific Palisades
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    For a 3,500-square-foot home in a WUI zone with premium finishes, the estimated range would be:
                  </p>
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Low Estimate</p>
                        <p className="text-2xl font-bold text-brand-dark">$1.8M</p>
                        <p className="text-xs text-gray-400">~$515/sqft with WUI</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">High Estimate</p>
                        <p className="text-2xl font-bold text-accent-gold">$2.8M</p>
                        <p className="text-xs text-gray-400">~$805/sqft with WUI</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    This range accounts for WUI compliance, premium finishes, and standard site conditions. Hillside sites, complex designs, or ultra-premium materials would push toward the higher end. Use our <a href="/resources/cost-calculator" className="text-accent-gold font-semibold hover:underline">interactive cost calculator</a> to get a quick estimate tailored to your specific project parameters.
                  </p>
                </section>
              </AnimatedSection>

              {/* Section 7: FAQ */}
              <AnimatedSection>
                <section id="faq" className="mb-16 scroll-mt-32">
                  <h2 className="text-3xl font-bold text-brand-dark mb-8">
                    Frequently Asked Questions
                  </h2>
                  <div className="divide-y divide-gray-200">
                    {fireRebuildFaqs.map((faq, index) => (
                      <AccordionItem
                        key={index}
                        question={faq.question}
                        answer={faq.answer}
                        defaultOpen={index === 0}
                      />
                    ))}
                  </div>
                </section>
              </AnimatedSection>
            </div>
          </div>
        </Container>
      </section>

      <ConsultationCTA />
    </>
  );
}

