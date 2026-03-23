import type { Metadata } from "next";
import Hero from "@/components/Hero";
import AwardsSection from "@/components/AwardsSection";
import ServicesSpaciaz from "@/components/ServicesSpaciaz";
import FeaturedProject from "@/components/FeaturedProject";
import ProcessSection from "@/components/ProcessSection";
import StatsSection from "@/components/StatsSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import TestimonialsSection from "@/components/TestimonialsSection";
import GatekeeperCTA from "@/components/GatekeeperCTA";
import BlogPreview from "@/components/BlogPreview";
import FinalCTA from "@/components/FinalCTA";
import ConsultationCTA from "@/components/ConsultationCTA";
import TrustBar from "@/components/TrustBar";
import { generateLocalBusinessSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "eConstruct Inc. — Los Angeles' Premier High-End Home Builder",
  description:
    "Fire Rebuilds. Luxury Modernization. Ground-Up Custom Homes. CA License #964015. 25+ years of premium residential construction in Los Angeles.",
  openGraph: {
    title: "eConstruct Inc. — Los Angeles' Premier High-End Home Builder",
    description:
      "Fire Rebuilds. Luxury Modernization. Ground-Up Custom Homes. 25+ years of premium residential construction.",
    url: "https://econstructinc.com",
    images: [{ url: "/econstruct_logo.png", width: 1200, height: 630 }],
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
          <GatekeeperCTA />
          <BlogPreview />
          <FinalCTA />
          <ConsultationCTA />
        </main>
      </div>
    </>
  );
}
