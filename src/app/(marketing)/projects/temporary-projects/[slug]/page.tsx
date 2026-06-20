/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/metadata";
import { generateBreadcrumbSchema } from "@/lib/schema";
import { getTemporaryProjectBySlug } from "@/lib/data/temp-projects";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ConsultationCTA from "@/components/ConsultationCTA";

export async function generateStaticParams() {
  const { temporaryProjectPages } = await import("@/lib/data/temp-projects");
  return temporaryProjectPages.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getTemporaryProjectBySlug(slug);

  if (!project) {
    return {};
  }

  return {
    ...generatePageMetadata({
      title: `${project.title} | Temporary Review`,
      description: project.description,
      path: `/projects/temporary-projects/${project.slug}`,
      image: project.image,
    }),
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function TemporaryProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getTemporaryProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://econstructhomes.com" },
    { name: "Projects", url: "https://econstructhomes.com/projects" },
    { name: "Temporary Projects", url: "https://econstructhomes.com/projects/temporary-projects" },
    {
      name: project.title,
      url: `https://econstructhomes.com/projects/temporary-projects/${project.slug}`,
    },
  ]);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `https://econstructhomes.com/projects/temporary-projects/${project.slug}`,
    headline: project.title,
    description: project.description,
    image: project.gallery.map((img) => ({
      "@type": "ImageObject",
      url: `https://econstructhomes.com${img.src}`,
      description: img.alt,
      caption: img.caption,
    })),
    mainEntityOfPage: `https://econstructhomes.com/projects/temporary-projects/${project.slug}`,
    author: {
      "@type": "Organization",
      name: "eConstruct",
      url: "https://econstructhomes.com",
    },
    publisher: {
      "@type": "Organization",
      name: "eConstruct",
      url: "https://econstructhomes.com",
      logo: {
        "@type": "ImageObject",
        url: "https://econstructhomes.com/opengraph-image.png",
      },
    },
    datePublished: `${project.completionDate}-01-01`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbSchema, articleSchema]),
        }}
      />

      <PageHero
        title={project.heroTitle}
        subtitle={project.heroSubtitle}
        breadcrumbs={[
          { label: "Projects", href: "/projects" },
          { label: "Temporary Projects", href: "/projects/temporary-projects" },
          { label: project.shortTitle },
        ]}
        backgroundImage={project.image}
      />

      <section className="py-20 md:py-28">
        <Container>
          <SectionHeader
            badge={["Temporary", "Project Review"]}
            title="At-a-Glance Project Summary"
            subtitle="This page mirrors the live case-study structure, but remains hidden from indexing until the project and image set are approved."
            centered={false}
            className="mb-12"
          />
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-5">
            {[
              ["Location", project.location],
              ["Scope", project.scope],
              ["Timeline", project.timeline],
              ["Square Footage", project.squareFootage],
              ["Completion", project.completionDate],
            ].map(([label, value], index) => (
              <AnimatedSection key={label} delay={index * 0.05}>
                <div className="h-full rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition-transform duration-300 hover:-translate-y-1">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-gold">
                    {label}
                  </p>
                  <p className="mt-4 text-lg font-bold text-brand-dark">
                    {value}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-secondary py-20 md:py-28">
        <Container>
          <SectionHeader
            badge={["Challenge", "Strategy"]}
            title="What the Project Was Solving"
            subtitle="The case-study language stays consistent with the live portfolio so approval can happen in the real presentation format."
            centered={false}
            className="mb-12"
          />
          <div className="grid gap-8 lg:grid-cols-2">
            <AnimatedSection>
              <div className="h-full rounded-[2rem] border border-black/8 bg-white p-8 shadow-sm md:p-10">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-gold">
                  The Challenge
                </p>
                <div className="mt-6 space-y-5">
                  {project.challenge.map((paragraph) => (
                    <p key={paragraph} className="leading-relaxed text-body-text">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.12}>
              <div className="h-full rounded-[2rem] bg-brand-dark p-8 text-white shadow-[0_24px_70px_rgba(0,0,0,0.14)] md:p-10">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-gold">
                  Our Approach
                </p>
                <div className="mt-6 space-y-5">
                  {project.approach.map((paragraph) => (
                    <p key={paragraph} className="leading-relaxed text-white/80">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </Container>
      </section>

      <section className="py-20 md:py-28">
        <Container>
          <SectionHeader
            badge={["Execution", "Outcome"]}
            title="How the Work Progressed"
            subtitle="Build sequence and result stay separate so the project reads clearly for approvals and future publishing."
            centered={false}
            className="mb-12"
          />
          <div className="grid gap-8 lg:grid-cols-2">
            <AnimatedSection>
              <div className="h-full rounded-[2rem] border border-black/8 bg-white p-8 shadow-sm md:p-10">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-gold">
                  The Build
                </p>
                <div className="mt-6 space-y-5">
                  {project.build.map((paragraph) => (
                    <p key={paragraph} className="leading-relaxed text-body-text">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.12}>
              <div className="h-full rounded-[2rem] border border-black/8 bg-[#18181B] p-8 text-white shadow-[0_24px_70px_rgba(0,0,0,0.18)] md:p-10">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-gold">
                  The Result
                </p>
                <div className="mt-6 space-y-5">
                  {project.result.map((paragraph) => (
                    <p key={paragraph} className="leading-relaxed text-white/80">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </Container>
      </section>

      <section className="bg-[#F8F6F2] py-24 md:py-32">
        <Container>
          <div className="grid gap-8 lg:grid-cols-3">
            {project.gallery.map((image, index) => (
              <AnimatedSection key={image.src} delay={index * 0.08}>
                <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
                  <div className="relative aspect-[4/3]">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="p-6">
                    <p className="leading-relaxed text-body-text">
                      {image.caption}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 md:py-28">
        <Container>
          <SectionHeader
            badge={["Takeaways", "Approval"]}
            title="What the Project Proved"
            subtitle="Final section for the same live-case-study cadence, with a clear path back to the hidden review index."
            centered={false}
            className="mb-12"
          />
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <AnimatedSection>
              <div className="rounded-[2rem] bg-brand-dark p-8 text-white shadow-[0_24px_70px_rgba(0,0,0,0.18)] md:p-10">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-gold">
                  Key Takeaways
                </p>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
                  Why This Project Belongs in the Portfolio
                </h2>
                <ul className="mt-8 space-y-4 text-white/80">
                  {project.takeaways.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-accent-gold" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.12}>
              <div className="rounded-[2rem] border border-black/8 bg-white p-8 shadow-sm md:p-10">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-gold">
                  Review Status
                </p>
                <p className="mt-5 text-xl leading-relaxed text-body-text">
                  Hidden temporary project page. Keep this case study off the main portfolio until images and copy are approved.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link
                    href={`/services/${project.serviceSlug}`}
                    className="rounded-full bg-brand-dark px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-accent-gold hover:text-brand-dark"
                  >
                    Related Service
                  </Link>
                  <Link
                    href="/projects/temporary-projects"
                    className="rounded-full border border-brand-dark/15 px-5 py-3 text-sm font-bold text-brand-dark transition-colors hover:border-accent-gold hover:text-accent-gold"
                  >
                    Back to Temporary Projects
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </Container>
      </section>

      <ConsultationCTA />
    </>
  );
}
