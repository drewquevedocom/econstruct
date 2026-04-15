import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ServiceDetailTemplate from "@/components/services/ServiceDetailTemplate";
import {
  getPromptServiceBySlug,
  promptServices,
} from "@/lib/data/prompt-services";
import { generatePageMetadata } from "@/lib/metadata";
import {
  generateBreadcrumbSchema,
  generateFAQSchema,
} from "@/lib/schema";

export function generateStaticParams() {
  return promptServices.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getPromptServiceBySlug(slug);

  if (!service) {
    return {};
  }

  return generatePageMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    path: `/services/${service.slug}`,
    image: service.image,
  });
}

export default async function PromptServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getPromptServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const faqSchema = generateFAQSchema(service.faqs);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://econstructhomes.com" },
    { name: "Services", url: "https://econstructhomes.com/services" },
    {
      name: service.title,
      url: `https://econstructhomes.com/services/${service.slug}`,
    },
  ]);
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    provider: {
      "@type": "GeneralContractor",
      name: "econstruct Inc.",
    },
    areaServed: {
      "@type": "City",
      name: "Los Angeles",
    },
    description: service.metaDescription,
    url: `https://econstructhomes.com/services/${service.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([serviceSchema, faqSchema, breadcrumbSchema]),
        }}
      />
      <ServiceDetailTemplate service={service} />
    </>
  );
}

