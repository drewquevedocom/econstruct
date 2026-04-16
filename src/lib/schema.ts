import { COMPANY, SITE_URL } from "./constants";

export function generateLocalBusinessSchema() {
  const streetAddress = [COMPANY.address.street, COMPANY.address.suite]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    "@context": "https://schema.org",
    "@type": ["GeneralContractor", "HomeAndConstructionBusiness"],
    name: COMPANY.name,
    legalName: COMPANY.name,
    description: "Los Angeles' premier high-end residential contractor specializing in fire rebuilds, luxury modernization, and ground-up custom homes. 639+ projects completed since 2001. CA License #964015.",
    url: SITE_URL,
    telephone: COMPANY.phone.primary,
    email: COMPANY.email,
    foundingDate: "2001",
    founder: {
      "@type": "Person",
      name: "Frank Neimroozi",
      jobTitle: "Founder & President",
      worksFor: { "@type": "Organization", name: COMPANY.name },
    },
    address: {
      "@type": "PostalAddress",
      ...(streetAddress ? { streetAddress } : {}),
      addressLocality: COMPANY.address.city,
      addressRegion: COMPANY.address.state,
      ...(COMPANY.address.zip ? { postalCode: COMPANY.address.zip } : {}),
      addressCountry: "US",
    },
    areaServed: [
      { "@type": "City", name: "Los Angeles", sameAs: "https://www.wikidata.org/wiki/Q65" },
      { "@type": "City", name: "Beverly Hills" },
      { "@type": "City", name: "Pacific Palisades" },
      { "@type": "City", name: "Santa Monica" },
      { "@type": "City", name: "Malibu" },
      { "@type": "City", name: "Brentwood" },
      { "@type": "City", name: "Bel Air" },
      { "@type": "City", name: "Encino" },
      { "@type": "City", name: "Sherman Oaks" },
      { "@type": "City", name: "Calabasas" },
      { "@type": "City", name: "Hidden Hills" },
      { "@type": "City", name: "Westlake Village" },
      { "@type": "City", name: "Altadena" },
      { "@type": "City", name: "Bell Canyon" },
    ],
    priceRange: "$$$$",
    image: `${SITE_URL}/econstruct_logo.png`,
    logo: `${SITE_URL}/econstruct_logo.png`,
    sameAs: Object.values(COMPANY.social),
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "California General Contractor License",
      credentialId: "964015",
      recognizedBy: {
        "@type": "Organization",
        name: "Contractors State License Board",
        url: "https://www.cslb.ca.gov",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: "47",
      bestRating: "5",
      worstRating: "1",
    },
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      minValue: 10,
      maxValue: 50,
    },
    knowsAbout: [
      "Fire Rebuild Construction",
      "WUI Code Compliance",
      "Chapter 7A Requirements",
      "Luxury Home Remodeling",
      "Custom Home Construction",
      "Home Additions",
      "ADU Construction Los Angeles",
      "Home Automation",
      "Insurance Rebuild",
    ],
  };
}

export function generateWebPageSchema({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  const url = `${SITE_URL}${path}`;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url,
    isPartOf: {
      "@type": "WebSite",
      name: COMPANY.name,
      url: SITE_URL,
    },
    about: {
      "@type": "GeneralContractor",
      name: COMPANY.name,
      areaServed: "Los Angeles",
    },
  };
}

export function generateServiceSchema(service: { title: string; description: string; slug: string; priceRange?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    provider: {
      "@type": "GeneralContractor",
      name: COMPANY.name,
      url: SITE_URL,
    },
    areaServed: {
      "@type": "City",
      name: "Los Angeles",
    },
    url: `${SITE_URL}/services/${service.slug}`,
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateArticleSchema(article: { title: string; description: string; slug: string; date: string; image: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: `${SITE_URL}${article.image}`,
    datePublished: article.date,
    author: {
      "@type": "Organization",
      name: COMPANY.name,
    },
    publisher: {
      "@type": "Organization",
      name: COMPANY.name,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/econstruct_logo.png`,
      },
    },
    url: `${SITE_URL}/resources/${article.slug}`,
  };
}

