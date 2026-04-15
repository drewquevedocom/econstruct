import type { Metadata } from "next";
import Hero from "@/components/Hero";
import AwardsSection from "@/components/AwardsSection";
import ServicesSpaciaz from "@/components/ServicesSpaciaz";
import FeaturedProject from "@/components/FeaturedProject";
import ProcessSection from "@/components/ProcessSection";
import StatsSection from "@/components/StatsSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import TestimonialsSection from "@/components/TestimonialsSection";
import StrategicPartnership from "@/components/StrategicPartnership";
import BlogPreview from "@/components/BlogPreview";
import TrustBar from "@/components/TrustBar";
import { generateLocalBusinessSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "econstruct Inc. Ã¢â‚¬â€ Los Angeles' Premier High-End Home Builder",
  description:
    "Fire Rebuilds. Luxury Modernization. Ground-Up Custom Homes. CA License #964015. 639+ projects delivered since 2001 across Los Angeles.",
  alternates: {
    canonical: "https://econstructhomes.com",
  },
  openGraph: {
    title: "econstruct Inc. Ã¢â‚¬â€ Los Angeles' Premier High-End Home Builder",
    description:
      "Fire Rebuilds. Luxury Modernization. Ground-Up Custom Homes. 639+ projects. CA License #964015. Serving Pacific Palisades, Beverly Hills, Malibu & all of LA.",
    url: "https://econstructhomes.com",
    type: "website",
    siteName: "econstruct Inc.",
    images: [{ url: "https://econstructhomes.com/econstruct_logo.png", width: 1200, height: 630, alt: "econstruct Inc. Ã¢â‚¬â€ Los Angeles luxury home builder" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "econstruct Inc. Ã¢â‚¬â€ Los Angeles' Premier High-End Home Builder",
    description: "Fire Rebuilds. Luxury Modernization. Ground-Up Custom Homes. CA License #964015. 639+ projects across LA.",
    images: ["https://econstructhomes.com/econstruct_logo.png"],
  },
};

export default function Home() {
  const jsonLd = generateLocalBusinessSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col min-h-screen bg-transparent w-full">
        <Hero />
        <main className="relative z-10 flex flex-col w-full bg-white shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
          <TrustBar />
          <AwardsSection />
          <ServicesSpaciaz />
          <FeaturedProject />
          <ProcessSection />
          <StatsSection />
          <WhyChooseUs />
          <TestimonialsSection />
          <StrategicPartnership />
          <BlogPreview />
        </main>
      </div>
    </>
  );
}

