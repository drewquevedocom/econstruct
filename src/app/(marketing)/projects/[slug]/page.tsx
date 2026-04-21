/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/metadata";
import { generateBreadcrumbSchema } from "@/lib/schema";
import { getPromptProjectBySlug } from "@/lib/data/prompt-projects";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ConsultationCTA from "@/components/ConsultationCTA";

const devistaGalleryImages = [
  {
    src: "/projects/Devista_1-scaled.webp",
    alt: "Devista Hollywood Hills luxury remodel exterior view with pool and patio",
    caption: "Exterior overview: the remodeled backyard connects the home to the pool and outdoor entertaining zones.",
  },
  {
    src: "/projects/Devista_2-scaled.webp",
    alt: "Devista Hollywood Hills remodeled exterior with modern outdoor living area",
    caption: "Outdoor living area: upgraded hardscape and clean modern lines reinforce the home's new indoor-outdoor layout.",
  },
  {
    src: "/projects/Devista_3-scaled.webp",
    alt: "Devista Hollywood Hills luxury remodel patio and poolside detail",
    caption: "Poolside detail: premium exterior finishes and a sharper entertainment-focused layout.",
  },
  {
    src: "/projects/Devista_4-scaled.webp",
    alt: "Devista Hollywood Hills remodeled kitchen or interior living space",
    caption: "Interior transformation: updated finishes and a more open plan create a brighter family living environment.",
  },
  {
    src: "/projects/Devista_5-scaled.webp",
    alt: "Devista Hollywood Hills luxury remodel interior detail with contemporary finishes",
    caption: "Interior detail: contemporary materials and clean sightlines support the home's modernized character.",
  },
  {
    src: "/projects/Devista_6-scaled.webp",
    alt: "Devista Hollywood Hills remodeled kitchen and entertaining space",
    caption: "Entertaining space: the remodel improves flow between the chef's kitchen, living areas, and exterior patio.",
  },
  {
    src: "/projects/Devista_7-scaled.webp",
    alt: "Devista Hollywood Hills backyard remodel with pool and spa",
    caption: "Backyard upgrade: the resurfaced pool and freestanding spa anchor the new outdoor retreat.",
  },
  {
    src: "/projects/Devista_8-scaled.webp",
    alt: "Devista Hollywood Hills outdoor kitchen or patio remodel detail",
    caption: "Outdoor amenity detail: integrated entertaining features support day-to-day living and hosting.",
  },
  {
    src: "/projects/Devista_9-scaled.webp",
    alt: "Devista Hollywood Hills luxury remodel design detail",
    caption: "Design detail: carefully coordinated finish decisions give the remodel a cohesive, high-end result.",
  },
  {
    src: "/projects/Devista_11-scaled.webp",
    alt: "Devista Hollywood Hills completed luxury remodel final exterior view",
    caption: "Final exterior view: the completed project reads as a contemporary Hollywood Hills entertainer's home.",
  },
];



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

  const galleryImages =
    project.slug === "devista-hollywood-hills-luxury-remodel"
      ? [...project.gallery, ...devistaGalleryImages]
      : project.gallery;

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://econstructhomes.com" },
    { name: "Projects", url: "https://econstructhomes.com/projects" },
    {
      name: project.title,
      url: `https://econstructhomes.com/projects/${project.slug}`,
    },
  ]);
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["HomeAndConstructionBusiness", "LocalBusiness"],
    "@id": "https://econstructhomes.com/#business",
    name: "eConstruct",
    url: "https://econstructhomes.com",
    telephone: "+1-310-740-9999",
    email: "info@econstructinc.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Los Angeles",
      addressRegion: "CA",
      addressCountry: "US",
    },
    areaServed: "Greater Los Angeles, CA",
    hasCredential: "CA General Contractor License #964015",
    priceRange: "$$",
    image: "https://econstructhomes.com/opengraph-image.png",
    logo: "https://econstructhomes.com/opengraph-image.png",
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `https://econstructhomes.com/projects/${project.slug}`,
    headline: project.title,
    description: project.description,
    image: galleryImages.map((img) => ({
      "@type": "ImageObject",
      url: `https://econstructhomes.com${img.src}`,
      description: img.alt,
      caption: img.caption,
    })),
    mainEntityOfPage: `https://econstructhomes.com/projects/${project.slug}`,
    author: {
      "@type": "Organization",
      "@id": "https://econstructhomes.com/#business",
      name: "eConstruct",
      url: "https://econstructhomes.com",
    },
    publisher: {
      "@type": "Organization",
      "@id": "https://econstructhomes.com/#business",
      name: "eConstruct",
      url: "https://econstructhomes.com",
      logo: {
        "@type": "ImageObject",
        url: "https://econstructhomes.com/opengraph-image.png",
      },
    },
    ...(project.completionDate && { datePublished: `${project.completionDate}-01-01` }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbSchema, localBusinessSchema, articleSchema]),
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

      <section className="py-20 md:py-28">
        <Container>
          <SectionHeader
            badge={["Project", "Details"]}
            title="At-a-Glance Project Summary"
            subtitle="The essentials clients care about first: scope, timing, scale, and when the work was completed."
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
            title="What We Solved and How We Solved It"
            subtitle="Every project has a different technical pressure point. This section shows the problem, then the execution strategy that resolved it."
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
            subtitle="The build sequence and final result are presented separately so the project reads cleanly for homeowners, architects, and AI search systems."
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
            {galleryImages.map((image, index) => (
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
            badge={["Takeaways", "Next Steps"]}
            title="What the Project Proved"
            subtitle="The final section pulls the practical lessons forward and gives visitors a clear next step if they are planning something similar."
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
                  Why This Result Matters
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
                {project.testimonial && (
                  <>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-gold">
                      Client Perspective
                    </p>
                    <p className="mt-5 text-xl leading-relaxed text-body-text">
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

