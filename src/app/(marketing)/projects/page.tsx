import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { generatePageMetadata } from "@/lib/metadata";
import { generateBreadcrumbSchema } from "@/lib/schema";
import { promptProjects } from "@/lib/data/prompt-projects";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ConsultationCTA from "@/components/ConsultationCTA";

export const metadata: Metadata = generatePageMetadata({
  title: "Our Work - Los Angeles Construction Projects",
  description:
    "Explore Los Angeles construction projects from econstruct including fire rebuild case studies and luxury custom homes.",
  path: "/projects",
});

export default function ProjectsPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://econstructinc.com" },
    { name: "Projects", url: "https://econstructinc.com/projects" },
  ]);
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: promptProjects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: project.title,
      url: `https://econstructinc.com/projects/${project.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbSchema, itemListSchema]),
        }}
      />

      <PageHero
        title="Our Work - Los Angeles Construction Projects"
        subtitle="Case studies and project documentation across fire rebuilds and luxury custom homes."
        breadcrumbs={[{ label: "Projects" }]}
      />

      <section className="py-24 md:py-32">
        <Container>
          <div className="grid gap-8 lg:grid-cols-3">
            {promptProjects.map((project, index) => (
              <AnimatedSection key={project.slug} delay={index * 0.08}>
                <Link
                  href={`/projects/${project.slug}`}
                  className="group block overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-brand-dark/20 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-gold/90">
                        {project.location}
                      </p>
                      <h2 className="mt-3 text-3xl font-bold text-white">
                        {project.title}
                      </h2>
                    </div>
                  </div>
                  <div className="p-8">
                    <p className="leading-relaxed text-body-text">
                      {project.description}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3 text-xs font-bold uppercase tracking-[0.18em] text-accent-gold">
                      <span>{project.scope}</span>
                      <span>{project.timeline}</span>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      <ConsultationCTA />
    </>
  );
}
