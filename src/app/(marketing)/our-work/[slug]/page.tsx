import { projects } from "@/lib/data/projects";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import ConsultationCTA from "@/components/ConsultationCTA";
import {
  Ruler,
  Clock,
  DollarSign,
  Layers,
  ArrowLeft,
  ArrowRight,
  Quote,
  MapPin,
} from "lucide-react";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.title} | Our Work | eConstruct`,
    description: project.description,
    openGraph: {
      title: `${project.title} | eConstruct`,
      description: project.description,
      images: [{ url: project.heroImage }],
    },
  };
}

const specIcons = {
  sqft: Ruler,
  timeline: Clock,
  value: DollarSign,
  scope: Layers,
};

const specLabels: Record<string, string> = {
  sqft: "Square Feet",
  timeline: "Timeline",
  value: "Project Value",
  scope: "Scope",
};

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject =
    currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  const specEntries = Object.entries(project.specs).filter(
    ([, value]) => value
  ) as [keyof typeof specIcons, string][];

  return (
    <>
      {/* Full-Width Hero */}
      <section className="relative h-[60vh] md:h-[70vh] min-h-[480px] overflow-hidden">
        <Image
          src={project.heroImage}
          alt={project.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/50 to-brand-dark/20" />

        <Container className="relative z-10 h-full flex flex-col justify-end pb-16 md:pb-20">
          <AnimatedSection>
            <Link
              href="/our-work"
              className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Our Work
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-4 h-4 text-accent-gold" />
              <span className="text-white/80 font-medium">
                {project.neighborhood}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight max-w-4xl">
              {project.title}
            </h1>
          </AnimatedSection>
        </Container>
      </section>

      {/* Specs Bar */}
      <section className="bg-brand-dark border-t border-white/10">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 md:py-10">
            {specEntries.map(([key, value], i) => {
              const Icon = specIcons[key];
              return (
                <AnimatedSection key={key} delay={i * 0.08}>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Icon className="w-4 h-4 text-accent-gold" />
                      <span className="text-xs font-bold text-white/50 uppercase tracking-wider">
                        {specLabels[key]}
                      </span>
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-white">
                      {value}
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Project Description */}
      <section className="py-24 md:py-32">
        <Container>
          <div className="max-w-3xl mx-auto">
            <AnimatedSection>
              <div className="border border-brand-dark/20 uppercase tracking-widest text-[10px] font-bold px-4 py-1.5 rounded-full text-brand-dark w-fit mb-6 flex gap-2 items-center">
                <span>PROJECT</span>
                <span className="text-accent-gold">&bull;</span>
                <span>OVERVIEW</span>
              </div>
              <p className="text-lg md:text-xl text-body-text leading-relaxed">
                {project.description}
              </p>
            </AnimatedSection>
          </div>
        </Container>
      </section>

      {/* Photo Gallery */}
      {project.images.length > 0 && (
        <section className="py-24 md:py-32 bg-secondary">
          <Container>
            <AnimatedSection>
              <div className="border border-brand-dark/20 uppercase tracking-widest text-[10px] font-bold px-4 py-1.5 rounded-full text-brand-dark w-fit mb-8 flex gap-2 items-center">
                <span>PROJECT</span>
                <span className="text-accent-gold">&bull;</span>
                <span>GALLERY</span>
              </div>
            </AnimatedSection>

            <div
              className={`grid gap-4 ${
                project.images.length === 1
                  ? "grid-cols-1 max-w-4xl mx-auto"
                  : project.images.length === 2
                  ? "grid-cols-1 md:grid-cols-2"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {project.images.map((image, i) => (
                <AnimatedSection key={i} delay={i * 0.08}>
                  <div
                    className={`relative rounded-2xl overflow-hidden ${
                      project.images.length === 1
                        ? "aspect-[16/9]"
                        : "aspect-[4/3]"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${project.title} - Photo ${i + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Testimonial */}
      {project.testimonial && (
        <section className="py-24 md:py-32">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <AnimatedSection>
                <div className="w-16 h-16 rounded-full bg-accent-gold/10 flex items-center justify-center mx-auto mb-8">
                  <Quote className="w-8 h-8 text-accent-gold" />
                </div>
                <blockquote className="text-2xl md:text-3xl font-bold text-brand-dark leading-snug mb-8 tracking-tight">
                  &ldquo;{project.testimonial.quote}&rdquo;
                </blockquote>
                <div className="text-body-text font-medium">
                  &mdash; {project.testimonial.name},{" "}
                  <span className="text-accent-gold">
                    {project.neighborhood}
                  </span>
                </div>
              </AnimatedSection>
            </div>
          </Container>
        </section>
      )}

      {/* Navigation Between Projects */}
      <section className="py-16 bg-secondary border-t border-gray-200">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {prevProject ? (
              <Link
                href={`/our-work/${prevProject.slug}`}
                className="group flex items-center gap-3 text-body-text hover:text-brand-dark transition-colors"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-body-text/60">
                    Previous Project
                  </div>
                  <div className="font-bold">{prevProject.title}</div>
                </div>
              </Link>
            ) : (
              <div />
            )}

            <Button href="/our-work" variant="secondary">
              View All Projects
            </Button>

            {nextProject ? (
              <Link
                href={`/our-work/${nextProject.slug}`}
                className="group flex items-center gap-3 text-body-text hover:text-brand-dark transition-colors text-right"
              >
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-body-text/60">
                    Next Project
                  </div>
                  <div className="font-bold">{nextProject.title}</div>
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </Container>
      </section>

      <ConsultationCTA />
    </>
  );
}
