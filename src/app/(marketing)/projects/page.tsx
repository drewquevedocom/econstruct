/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { generateBreadcrumbSchema } from "@/lib/schema";
import { SITE_URL } from "@/lib/constants";
import { promptProjects } from "@/lib/data/prompt-projects";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import ConsultationCTA from "@/components/ConsultationCTA";

export const metadata: Metadata = {
  title: "Projects | econstruct Ã¢â‚¬â€ Luxury Home Remodels & Custom Builds in Los Angeles",
  description:
    "Explore completed luxury remodel and custom home construction projects by econstruct across Hollywood Hills, Bell Canyon, Lawndale, and greater Los Angeles. 639+ projects delivered since 2001.",
  alternates: {
    canonical: `${SITE_URL}/projects`,
  },
  openGraph: {
    title: "Projects | econstruct Ã¢â‚¬â€ Luxury Home Remodels in Los Angeles",
    description:
      "Portfolio of completed high-end residential projects by econstruct Ã¢â‚¬â€ Hollywood Hills remodels, Bell Canyon estate transformations, coastal condo renovations, and custom engineering.",
    url: `${SITE_URL}/projects`,
    images: [{ url: "/projects/devista-hero.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | econstruct Los Angeles",
    description: "Completed luxury remodel and custom home projects across Los Angeles.",
    images: ["/projects/devista-hero.jpg"],
  },
};

const categoryColors: Record<string, string> = {
  "Home Remodel": "bg-accent-gold/12 text-accent-gold",
  "Custom Engineering": "bg-blue-500/10 text-blue-700",
  "Condo Remodel": "bg-emerald-500/10 text-emerald-700",
  "Luxury Remodel": "bg-accent-gold/12 text-accent-gold",
};

export default function ProjectsPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Projects", url: `${SITE_URL}/projects` },
  ]);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "econstruct Completed Projects Ã¢â‚¬â€ Los Angeles",
    description: "Portfolio of completed luxury residential construction and remodel projects by eConstruct Homes.",
    itemListElement: promptProjects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: project.title,
      url: `${SITE_URL}/projects/${project.slug}`,
      image: `${SITE_URL}${project.image}`,
      description: project.description,
    })),
  };

  const [featured, ...rest] = promptProjects;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      {/* Ã¢â€â‚¬Ã¢â€â‚¬ Hero Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <PageHero
        title="Our Work Across Los Angeles"
        subtitle="639+ projects delivered since 2001 Ã¢â‚¬â€ from Hollywood Hills luxury remodels and Bell Canyon estate transformations to coastal condo renovations and custom engineering solutions."
        breadcrumbs={[{ label: "Projects" }]}
        backgroundImage={featured.image}
        stats={[
          { value: "639+", label: "Projects Completed" },
          { value: "51 Yrs", label: "Combined Partner Experience" },
          { value: "CA #964015", label: "Licensed GC" },
        ]}
      />

      {/* Ã¢â€â‚¬Ã¢â€â‚¬ Featured project Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <section className="bg-[#f6f2ea] py-20 md:py-28">
        <Container>
          <p className="mb-8 text-[11px] font-semibold uppercase tracking-[0.34em] text-accent-gold">
            Featured Project
          </p>

          <Link
            href={`/projects/${featured.slug}`}
            className="group block overflow-hidden rounded-3xl bg-white shadow-[0_24px_60px_rgba(0,0,0,0.1)] transition-all duration-500 hover:shadow-[0_32px_80px_rgba(0,0,0,0.14)] lg:grid lg:grid-cols-[1.2fr_0.8fr]"
          >
            {/* Image */}
            <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[520px]">
              <img
                src={featured.image}
                alt={featured.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute left-6 top-6">
                <span className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] ${categoryColors[featured.category] ?? "bg-white/20 text-white"}`}>
                  {featured.category}
                </span>
              </div>
              <div className="absolute bottom-6 left-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-accent-gold">
                  {featured.neighborhood}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-col justify-between p-8 md:p-12">
              <div>
                <h2 className="font-heading text-[1.85rem] leading-[1.08] tracking-tight text-brand-dark md:text-[2.2rem]">
                  {featured.title}
                </h2>
                <p className="mt-5 text-[0.95rem] leading-[1.75] text-black/60">
                  {featured.description}
                </p>

                <ul className="mt-8 space-y-2.5">
                  {featured.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2.5 text-[0.875rem] text-black/65">
                      <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent-gold" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10 flex flex-wrap gap-4 border-t border-black/8 pt-8 text-[11px] font-semibold uppercase tracking-[0.2em]">
                <div>
                  <p className="text-black/35">Scope</p>
                  <p className="mt-1 text-brand-dark">{featured.scope}</p>
                </div>
                <div>
                  <p className="text-black/35">Location</p>
                  <p className="mt-1 text-brand-dark">{featured.location}</p>
                </div>
                <div>
                  <p className="text-black/35">Year</p>
                  <p className="mt-1 text-brand-dark">{featured.completionDate}</p>
                </div>
              </div>

              <div className="mt-8 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-accent-gold transition-colors group-hover:text-brand-dark">
                View Project
                <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </Link>
        </Container>
      </section>

      {/* Ã¢â€â‚¬Ã¢â€â‚¬ Project grid Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <section className="bg-white py-20 md:py-28">
        <Container>
          <div className="mb-12 flex flex-col gap-4 min-[700px]:flex-row min-[700px]:items-end min-[700px]:justify-between">
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.34em] text-accent-gold">
                All Projects
              </p>
              <h2 className="font-heading text-[2.2rem] leading-tight tracking-tight text-brand-dark md:text-[2.8rem]">
                Portfolio of Work
              </h2>
            </div>
            <p className="max-w-sm text-[0.9rem] leading-[1.7] text-black/50">
              Every project reflects eConstruct Homes commitment to premium execution, clear communication, and results that outlast the build.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-2">
            {rest.map((project, i) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="group block overflow-hidden rounded-2xl border border-black/8 bg-white shadow-sm transition-all duration-400 hover:-translate-y-1 hover:shadow-xl"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-600 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                  <div className="absolute left-5 top-5">
                    <span className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] backdrop-blur-sm ${categoryColors[project.category] ?? "bg-white/20 text-white"}`}>
                      {project.category}
                    </span>
                  </div>
                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-accent-gold">
                      {project.neighborhood}
                    </p>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">
                      {project.completionDate}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-7 md:p-8">
                  <h3 className="font-heading text-[1.35rem] leading-snug tracking-tight text-brand-dark">
                    {project.shortTitle}
                  </h3>
                  <p className="mt-3 text-[0.875rem] leading-[1.72] text-black/55 line-clamp-3">
                    {project.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-x-5 gap-y-1 border-t border-black/8 pt-5">
                    {project.highlights.slice(0, 3).map((h) => (
                      <span key={h} className="flex items-center gap-1.5 text-[11px] font-medium text-black/45">
                        <span className="h-1 w-1 rounded-full bg-accent-gold" />
                        {h}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-accent-gold transition-colors group-hover:text-brand-dark">
                    View Case Study
                    <ArrowUpRight size={13} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <ConsultationCTA />
    </>
  );
}

