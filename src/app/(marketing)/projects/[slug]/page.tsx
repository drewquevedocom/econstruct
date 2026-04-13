import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/metadata";
import { generateBreadcrumbSchema } from "@/lib/schema";
import {
  getPromptProjectBySlug,
  promptProjects,
} from "@/lib/data/prompt-projects";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ConsultationCTA from "@/components/ConsultationCTA";

export function generateStaticParams() {
  return promptProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getPromptProjectBySlug(slug);

  if (!project) {
    return {};
  }

  return generatePageMetadata({
    title: project.title,
    description: project.description,
    path: `/projects/${project.slug}`,
    image: project.image,
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getPromptProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://econstructinc.com" },
    { name: "Projects", url: "https://econstructinc.com/projects" },
    {
      name: project.title,
      url: `https://econstructinc.com/projects/${project.slug}`,
    },
  ]);
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: project.title,
    description: project.description,
    image: `https://econstructinc.com${project.image}`,
    mainEntityOfPage: `https://econstructinc.com/projects/${project.slug}`,
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
          { label: project.title },
        ]}
        backgroundImage={project.image}
      />

      <section className="py-24 md:py-32">
        <Container>
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-5">
            {[
              ["Location", project.location],
              ["Scope", project.scope],
              ["Timeline", project.timeline],
              ["Square Footage", project.squareFootage],
              ["Completion", project.completionDate],
            ].map(([label, value], index) => (
              <AnimatedSection key={label} delay={index * 0.05}>
                <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
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

      <section className="bg-secondary py-24 md:py-32">
        <Container>
          <div className="grid gap-16 lg:grid-cols-2">
            <AnimatedSection>
              <div className="space-y-6">
                <h2 className="text-4xl font-bold tracking-tight text-brand-dark">
                  The Challenge
                </h2>
                {project.challenge.map((paragraph) => (
                  <p key={paragraph} className="leading-relaxed text-body-text">
                    {paragraph}
                  </p>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.12}>
              <div className="space-y-6">
                <h2 className="text-4xl font-bold tracking-tight text-brand-dark">
                  Our Approach
                </h2>
                {project.approach.map((paragraph) => (
                  <p key={paragraph} className="leading-relaxed text-body-text">
                    {paragraph}
                  </p>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </Container>
      </section>

      <section className="py-24 md:py-32">
        <Container>
          <div className="grid gap-16 lg:grid-cols-2">
            <AnimatedSection>
              <div className="space-y-6">
                <h2 className="text-4xl font-bold tracking-tight text-brand-dark">
                  The Build
                </h2>
                {project.build.map((paragraph) => (
                  <p key={paragraph} className="leading-relaxed text-body-text">
                    {paragraph}
                  </p>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.12}>
              <div className="space-y-6">
                <h2 className="text-4xl font-bold tracking-tight text-brand-dark">
                  The Result
                </h2>
                {project.result.map((paragraph) => (
                  <p key={paragraph} className="leading-relaxed text-body-text">
                    {paragraph}
                  </p>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </Container>
      </section>

      {project.youtubeUrl && (
        <section className="py-24 md:py-32">
          <Container>
            <AnimatedSection>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.34em] text-accent-gold text-center">
                Project Video
              </p>
              <h2 className="mb-10 text-center text-3xl font-bold tracking-tight text-brand-dark md:text-4xl">
                See It in Action
              </h2>
              <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl shadow-[0_24px_60px_rgba(0,0,0,0.12)]">
                <div className="relative aspect-video w-full">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${new URL(project.youtubeUrl).searchParams.get("v")}`}
                    title={project.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
              </div>
            </AnimatedSection>
          </Container>
        </section>
      )}

      <section className="bg-[#F8F6F2] py-24 md:py-32">
        <Container>
          <div className="grid gap-8 lg:grid-cols-3">
            {project.gallery.map((image, index) => (
              <AnimatedSection key={image.src} delay={index * 0.08}>
                <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
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

      <section className="py-24 md:py-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <AnimatedSection>
              <div className="rounded-3xl bg-brand-dark p-10 text-white">
                <h2 className="text-4xl font-bold tracking-tight">
                  Key Takeaways
                </h2>
                <ul className="mt-8 space-y-4 text-white/80">
                  {project.takeaways.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.12}>
              <div className="rounded-3xl border border-gray-100 bg-white p-10 shadow-sm">
                {project.testimonial && (
                  <>
                    <p className="text-xl leading-relaxed text-body-text">
                      &ldquo;{project.testimonial.quote}&rdquo;
                    </p>
                    <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-accent-gold">
                      {project.testimonial.name}
                    </p>
                  </>
                )}
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link
                    href={`/services/${project.serviceSlug}`}
                    className="rounded-full bg-brand-dark px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-accent-gold hover:text-brand-dark"
                  >
                    Related Service
                  </Link>
                  <Link
                    href="/projects"
                    className="rounded-full border border-brand-dark/15 px-5 py-3 text-sm font-bold text-brand-dark transition-colors hover:border-accent-gold hover:text-accent-gold"
                  >
                    Back to Projects
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
