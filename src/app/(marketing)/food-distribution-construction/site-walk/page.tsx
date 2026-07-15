import type { Metadata } from "next";
import { Suspense } from "react";
import { Shield, Clock, Building2, CheckCircle } from "lucide-react";
import { generatePageMetadata } from "@/lib/metadata";
import { COMPANY } from "@/lib/constants";
import SiteWalkForm from "@/components/contact/SiteWalkForm";

export const metadata: Metadata = generatePageMetadata({
  title: "Request a Commercial Site Walk | econstruct Inc.",
  description:
    "Schedule a site walk for your food distribution center, cold storage facility, ghost kitchen, or commercial TI project in Los Angeles. Licensed GC — CA Lic #964015.",
  path: "/food-distribution-construction/site-walk",
});

const trustPoints = [
  "Licensed General Contractor — CA Lic #964015",
  "Commercial & industrial TI experience across Los Angeles",
  "Cold storage, food processing, and distribution center builds",
  "Permit management, MEP coordination, and code compliance",
];

export default function CommercialSiteWalkPage() {
  return (
    <main className="min-h-screen bg-[#F8F6F2]">
      {/* Hero */}
      <section className="bg-[#07090c] py-20 md:py-28">
        <div className="container mx-auto px-6 max-w-5xl">
          <p className="text-xs font-bold text-accent-gold uppercase tracking-[0.22em] mb-4">
            econstruct Inc. · Commercial Construction
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight mb-6">
            Request a<br className="hidden md:block" /> Commercial Site Walk
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl leading-relaxed">
            For food distribution centers, cold storage facilities, ghost kitchens, and commercial tenant improvements across Los Angeles and Southern California.
          </p>
          <p className="mt-4 text-accent-gold text-sm font-semibold">
            {COMPANY.license.display} · {COMPANY.phone.display}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">

            {/* Form — 3 cols */}
            <div className="lg:col-span-3">
              <Suspense fallback={null}>
                <SiteWalkForm />
              </Suspense>
            </div>

            {/* Sidebar — 2 cols */}
            <div className="lg:col-span-2 flex flex-col gap-6">

              {/* What to expect */}
              <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-accent-gold/10 rounded-xl flex items-center justify-center">
                    <Building2 size={20} className="text-accent-gold" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-dark">What happens next</h3>
                </div>
                <ol className="flex flex-col gap-4">
                  {[
                    "We review your facility type, size, and ZIP — same day.",
                    "Frank's team reaches out within 24 hours to confirm timing.",
                    "We walk the site, assess scope, and give you a straight read on feasibility and cost.",
                  ].map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-brand-dark text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-gray-600 text-sm leading-relaxed">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Trust points */}
              <div className="bg-[#07090c] rounded-2xl p-7 text-white">
                <div className="flex items-center gap-3 mb-5">
                  <Shield size={20} className="text-accent-gold" />
                  <h3 className="text-lg font-bold">Why econstruct</h3>
                </div>
                <ul className="flex flex-col gap-3">
                  {trustPoints.map((point) => (
                    <li key={point} className="flex gap-3 items-start">
                      <CheckCircle size={16} className="text-accent-gold shrink-0 mt-0.5" />
                      <p className="text-white/80 text-sm leading-relaxed">{point}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Response guarantee */}
              <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Clock size={20} className="text-accent-gold" />
                  <h3 className="text-base font-bold text-brand-dark">24-Hour Response</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Every site walk request is reviewed by Frank&apos;s team the same business day. We respond within 24 hours — no auto-responders, no sales hand-off.
                </p>
                <a
                  href={`tel:${COMPANY.phone.primary}`}
                  className="mt-4 inline-flex items-center gap-2 text-brand-dark font-bold text-sm hover:text-accent-gold transition-colors border-b border-brand-dark hover:border-accent-gold pb-0.5"
                >
                  Call {COMPANY.phone.display} for urgent requests
                </a>
              </div>

            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
