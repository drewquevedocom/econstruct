import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import AnimatedSection from "@/components/ui/AnimatedSection";
import AccordionItem from "@/components/ui/AccordionItem";
import ConsultationCTA from "@/components/ConsultationCTA";
import { PromptServicePage } from "@/lib/data/prompt-services";
import { promptProjects } from "@/lib/data/prompt-projects";

export default function ServiceDetailTemplate({
  service,
}: {
  service: PromptServicePage;
}) {
  const galleryProjects = promptProjects.filter((project) =>
    service.galleryProjectSlugs.includes(project.slug)
  );

  return (
    <>
      <PageHero
        title={service.heroTitle}
        subtitle={service.heroSubtitle}
        breadcrumbs={[
          { label: "Services", href: "/services" },
          { label: service.title },
        ]}
        backgroundImage={service.image}
      />

      <section className="py-24 md:py-32">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1.25fr_0.9fr] lg:items-start">
            <AnimatedSection>
              <SectionHeader
                badge={["Service", "Overview"]}
                title={service.title}
                centered={false}
                className="mb-0"
              />
              <div className="mt-8 space-y-6 text-lg leading-relaxed text-body-text">
                {service.intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <div className="overflow-hidden rounded-3xl border border-gray-100 bg-secondary shadow-sm">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-4 p-8">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-gold">
                    Los Angeles Focus
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {service.serviceAreas.map((area) => (
                      <div
                        key={area.area}
                        className="rounded-2xl border border-gray-200 bg-white p-4"
                      >
                        <p className="font-bold text-brand-dark">{area.area}</p>
                        <p className="mt-2 text-sm leading-relaxed text-body-text">
                          {area.note}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </Container>
      </section>

      <section className="bg-secondary py-24 md:py-32">
        <Container>
          <SectionHeader
            badge={["Process"]}
            title={service.processTitle}
            subtitle="Clear milestones, active communication, and fewer avoidable surprises from start to finish."
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
            {service.processSteps.map((step, index) => (
              <AnimatedSection key={step.label} delay={index * 0.06}>
                <div className="h-full rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent-gold">
                    {step.label}
                  </p>
                  <h3 className="mt-4 text-xl font-bold text-brand-dark">
                    {step.title}
                  </h3>
                  <p className="mt-4 leading-relaxed text-body-text">
                    {step.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-24 md:py-32">
        <Container>
          <SectionHeader
            badge={["Why", "econstruct"]}
            title={service.differentiatorsTitle}
            subtitle="The difference is not only craftsmanship. It is how the project is led."
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {service.differentiators.map((item, index) => (
              <AnimatedSection key={item.title} delay={index * 0.06}>
                <div className="h-full rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                  <h3 className="text-xl font-bold text-brand-dark">
                    {item.title}
                  </h3>
                  <p className="mt-4 leading-relaxed text-body-text">
                    {item.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      {galleryProjects.length > 0 && (
        <section className="bg-[#F8F6F2] py-24 md:py-32">
          <Container>
            <SectionHeader
              badge={["Projects"]}
              title="Related Case Studies"
              subtitle="Original project documentation gives homeowners and AI search engines something concrete to reference."
            />
            <div className="grid gap-8 lg:grid-cols-3">
              {galleryProjects.map((project, index) => (
                <AnimatedSection key={project.slug} delay={index * 0.08}>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="group block overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-8">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-gold">
                        {project.location}
                      </p>
                      <h3 className="mt-3 text-2xl font-bold text-brand-dark">
                        {project.title}
                      </h3>
                      <p className="mt-4 leading-relaxed text-body-text">
                        {project.description}
                      </p>
                      <p className="mt-6 text-sm font-bold text-brand-dark transition-colors group-hover:text-accent-gold">
                        View Project
                      </p>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="py-24 md:py-32">
        <Container size="narrow">
          <SectionHeader
            badge={["Common", "Questions"]}
            title="Common Questions"
            subtitle="Written in plain language for clients who want direct answers before they call."
          />
          <div className="divide-y divide-gray-200 border-t border-gray-200">
            {service.faqs.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
                defaultOpen={index === 0}
              />
            ))}
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            {service.relatedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-brand-dark/15 bg-white px-5 py-3 text-sm font-bold text-brand-dark transition-colors hover:border-accent-gold hover:text-accent-gold"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <ConsultationCTA />
    </>
  );
}
