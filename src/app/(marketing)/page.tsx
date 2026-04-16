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
import { generatePageMetadata } from "@/lib/metadata";
import { generateWebPageSchema } from "@/lib/schema";

export const dynamic = "force-static";

const homeTitle = "Luxury Home Builder Beverly Hills & Los Angeles | eConstruct Homes";
const homeDescription =
  "eConstruct Homes is a Los Angeles luxury home builder and general contractor specializing in fire rebuilds, custom homes, and high-end remodels. California License #964015.";

export const metadata: Metadata = generatePageMetadata({
  title: homeTitle,
  description: homeDescription,
  path: "",
  image: "/og-homepage.jpg",
  imageAlt: "eConstruct Homes luxury residential construction in Los Angeles",
  openGraphTitle: homeTitle,
  twitterTitle: homeTitle,
});

export default function Home() {
  const webPageSchema = generateWebPageSchema({
    name: homeTitle,
    description: homeDescription,
    path: "",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
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
