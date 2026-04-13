/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Flame, MessageSquare, Star, Wrench, Palette } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "25+ Years Licensed Experience",
    description:
      "Our leadership team holds California General Contractor licenses with over $200M in completed luxury residential projects.",
  },
  {
    icon: Flame,
    title: "Fire Rebuild Specialists",
    description:
      "We navigate WUI codes, expedited permits, and insurance coordination for families rebuilding in Palisades, Altadena, and Malibu.",
  },
  {
    icon: MessageSquare,
    title: "Transparent Communication",
    description:
      "Weekly progress reports, a dedicated project manager, and real-time budget tracking so you always know exactly where your project stands.",
  },
  {
    icon: Star,
    title: "Premium Craftsmanship",
    description:
      "Hand-selected materials, master-level tradesmen, and obsessive quality control — homes built to command top-dollar valuations.",
  },
  {
    icon: Wrench,
    title: "Construction & Fixture Warranty",
    description:
      "We stand behind our work with comprehensive warranties on both construction and installed fixtures for your peace of mind.",
  },
  {
    icon: Palette,
    title: "Fully Custom Process",
    description:
      "From architecture through interior finishes, every decision is tailored to you — no templates, no shortcuts, no compromises.",
  },
];

const MARQUEE_TEXT = "Our commitment · Our commitment · Our commitment · Our commitment · ";

export default function WhyChooseUs() {
  return (
    <section className="bg-[#f6f2ea] py-24 md:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-14 min-[900px]:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] min-[900px]:gap-20 min-[900px]:items-start">

          {/* ── LEFT: sticky column ── */}
          <div className="min-[900px]:sticky min-[900px]:top-24">

            {/* Photo */}
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src="/Frank3.png"
                alt="econstruct team"
                className="h-[420px] w-full object-cover object-top min-[900px]:h-[480px]"
              />
              {/* Gold accent bar */}
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-accent-gold" />
            </div>

            {/* Scrolling marquee */}
            <div className="relative mt-6 overflow-hidden border-y border-black/10 py-3">
              <div
                className="flex whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.28em] text-black/35"
                style={{ animation: "marquee-ltr 18s linear infinite" }}
              >
                <span>{MARQUEE_TEXT}</span>
                <span aria-hidden>{MARQUEE_TEXT}</span>
              </div>
            </div>

            {/* Heading */}
            <div className="mt-8">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.34em] text-accent-gold">
                Our Core
              </p>
              <h2 className="font-heading text-[2.6rem] leading-[1.01] tracking-tight text-brand-dark md:text-[3.2rem]">
                What makes us
                <br />
                <span className="italic text-accent-gold">different</span>
              </h2>
            </div>

            {/* CTA */}
            <Link
              href="/about"
              className="group mt-8 inline-flex items-center gap-3 rounded-full border border-black/15 bg-white px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-dark shadow-sm transition-all duration-300 hover:border-accent-gold hover:text-accent-gold hover:shadow-md"
            >
              Learn More
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* ── RIGHT: 2×3 icon grid ── */}
          <div className="grid grid-cols-1 divide-y divide-black/10 sm:grid-cols-2 sm:divide-y-0">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              const isRight = i % 2 === 1;
              const isTopRow = i < 2;

              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.08 }}
                  className={`relative p-8 md:p-10 ${
                    isRight ? "sm:border-l sm:border-black/10" : ""
                  } ${
                    !isTopRow ? "sm:border-t sm:border-black/10" : ""
                  }`}
                >
                  {/* Gold circle icon */}
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-accent-gold/12 ring-1 ring-accent-gold/30">
                    <Icon size={22} className="text-accent-gold" strokeWidth={1.75} />
                  </div>

                  <h3 className="mb-3 font-heading text-[1.18rem] leading-snug tracking-tight text-brand-dark">
                    {feature.title}
                  </h3>

                  <p className="text-[0.9rem] leading-[1.72] text-black/55">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Marquee keyframes */}
      <style>{`
        @keyframes marquee-ltr {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
