"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import ScrollingPill from "@/components/ui/ScrollingPill";

const caseStudyUrl =
  "https://econstructhomes.com/luxury-home-builders-los-angeles-hollywood-hills-remodel-case-study/";

export default function FeaturedProject() {
  const highlights = [
    "Hollywood Hills remodel",
    "Luxury interior + exterior refresh",
    "Hillside execution with premium finishes",
  ];

  return (
    <section className="overflow-hidden bg-white py-24 md:py-32">
      <div className="container mx-auto max-w-7xl px-6 md:px-8">
        <div className="mb-16 flex flex-col items-start">
          <ScrollingPill
            label="CASE STUDY Â· FEATURED"
            className="mb-6 border-black/10 text-brand-dark"
          />

          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold tracking-tight text-brand-dark md:text-5xl lg:text-6xl"
          >
            Hollywood Hills Remodel
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid overflow-hidden rounded-3xl border border-black/8 bg-[#f8f6f0] shadow-[0_20px_60px_rgba(0,0,0,0.08)] lg:grid-cols-[1.05fr_0.95fr]"
        >
          <div className="relative min-h-[320px] lg:min-h-[520px]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/hollywood_hills_v2.png')" }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,9,12,0.12)_0%,rgba(7,9,12,0.4)_100%)]" />
            <div className="absolute left-6 top-6 rounded-full bg-black/55 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-white backdrop-blur-md">
              Hollywood Hills
            </div>
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
              <div className="max-w-[18rem]">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/75">
                  Remodel case study
                </p>
                <p className="mt-2 text-lg font-semibold leading-snug text-white">
                  A refined hillside transformation with premium materials and modern lines.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between p-8 md:p-12">
            <div>
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.28em] text-black/45">
                Featured Project
              </p>
              <h3 className="text-3xl font-bold leading-tight text-brand-dark md:text-4xl">
                A case study worth opening
              </h3>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-black/60 md:text-lg">
                Explore the Hollywood Hills remodel to see how we approached a premium
                hillside residence with cleaner lines, warmer finishes, and a more
                elevated indoor-outdoor connection.
              </p>

              <div className="mt-8 space-y-3">
                {highlights.map((item) => (
                  <div key={item} className="flex items-center gap-3 text-black/70">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-accent-gold" />
                    <span className="text-sm font-medium md:text-base">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/projects"
                className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-6 py-4 text-sm font-bold text-brand-dark transition-all hover:border-accent-gold hover:text-accent-gold"
              >
                View projects
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

