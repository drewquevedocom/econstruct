import { COMPANY } from "./constants";

export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["GeneralContractor", "HomeAndConstructionBusiness"],
    name: COMPANY.name,
    legalName: "econstruct Inc.",
    description: "Los Angeles' premier high-end residential contractor specializing in fire rebuilds, luxury modernization, and ground-up custom homes. 639+ projects completed since 2001. CA License #964015.",
    url: "https://econstructinc.com",
    telephone: COMPANY.phone.primary,
    email: COMPANY.email,
    foundingDate: "2001",
    founder: {
      "@type": "Person",
      name: "Frank Neimroozi",
      jobTitle: "Founder & President",
      worksFor: { "@type": "Organization", name: "econstruct Inc." },
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: `${COMPANY.address.street} ${COMPANY.address.suite}`,
      addressLocality: COMPANY.address.city,
      addressRegion: COMPANY.address.state,
      postalCode: COMPANY.address.zip,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 34.4208,
      longitude: -118.5764,
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
    priceRange: "$$$",
    image: "https://econstructinc.com/econstruct_logo.png",
    logo: "https://econstructinc.com/econstruct_logo.png",
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

export function generateServiceSchema(service: { title: string; description: string; slug: string; priceRange?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    provider: {
      "@type": "GeneralContractor",
      name: COMPANY.name,
      url: "https://econstructinc.com",
    },
    areaServed: {
      "@type": "City",
      name: "Los Angeles",
    },
    url: `https://econstructinc.com/services/${service.slug}`,
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
    image: `https://econstructinc.com${article.image}`,
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
        url: "https://econstructinc.com/econstruct_logo.png",
      },
    },
    url: `https://econstructinc.com/resources/${article.slug}`,
  };
}
