"use client";
import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Consultation & Assessment",
    description:
      "We begin with a comprehensive on-site walkthrough of your property. Our team evaluates structural conditions, code requirements, site challenges, and your vision — then delivers a detailed feasibility report with transparent cost projections.",
    details: ["Site & structural evaluation", "Code & zoning analysis", "Budget framework", "Timeline projection"],
  },
  {
    num: "02",
    title: "Design & Permitting",
    description:
      "Our in-house design team collaborates with your architect to finalize plans that balance aesthetics, engineering, and budget. We then navigate LA's permitting process — leveraging executive order fast-tracking where applicable — so construction starts without delay.",
    details: ["Architectural coordination", "Engineering & structural plans", "LADBS permit expediting", "HOA & zoning compliance"],
  },
  {
    num: "03",
    title: "Construction & Rebuild",
    description:
      "Execution begins with military-grade scheduling. Every trade — foundation, framing, MEP, finishes — is sequenced for maximum speed without sacrificing craftsmanship. Weekly progress reports and a dedicated project manager keep you informed at every stage.",
    details: ["Dedicated project manager", "Weekly client updates", "Quality control checkpoints", "Subcontractor coordination"],
  },
  {
    num: "04",
    title: "Final Walkthrough & Handover",
    description:
      "Before we hand you the keys, we conduct a meticulous multi-point inspection. Every detail is verified — from structural integrity to finish quality. You receive a complete warranty package, maintenance guide, and our commitment to long-term support.",
    details: ["200+ point inspection", "Punch-list completion", "Warranty documentation", "Ongoing support"],
  },
];

export default function ProcessSection() {
  return (
    <section className="py-28 md:py-36 bg-white overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-20 md:mb-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border border-brand-dark/20 uppercase tracking-widest text-[10px] font-bold px-4 py-1.5 rounded-full text-brand-dark w-fit mx-auto mb-6 flex gap-2 items-center"
          >
            <span>HOW WE</span>
            <span className="text-accent-gold">&bull;</span>
            <span>DELIVER</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-dark tracking-tight"
          >
            The eConstruct Process
          </motion.h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical center line — desktop only */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 -translate-x-1/2" />

          <div className="flex flex-col gap-20 lg:gap-28">
            {steps.map((step, i) => {
              const isEven = i % 2 === 0;

              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="relative"
                >
                  {/* Center dot — desktop */}
                  <div className="hidden lg:flex absolute left-1/2 top-8 -translate-x-1/2 z-10">
                    <div className="w-14 h-14 rounded-full bg-white border-2 border-accent-gold flex items-center justify-center shadow-lg shadow-accent-gold/10">
                      <span className="text-accent-gold font-bold text-sm tracking-wider font-heading">
                        {step.num}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`lg:grid lg:grid-cols-2 lg:gap-20 ${
                      isEven ? "" : "lg:direction-rtl"
                    }`}
                  >
                    {/* Content side */}
                    <div
                      className={`${
                        isEven
                          ? "lg:pr-16 lg:text-right"
                          : "lg:col-start-2 lg:pl-16 lg:text-left"
                      }`}
                    >
                      {/* Mobile step number */}
                      <div className="lg:hidden flex items-center gap-4 mb-5">
                        <div className="w-12 h-12 rounded-full border-2 border-accent-gold flex items-center justify-center flex-shrink-0">
                          <span className="text-accent-gold font-bold text-sm tracking-wider font-heading">
                            {step.num}
                          </span>
                        </div>
                        <div className="h-px flex-1 bg-gray-200" />
                      </div>

                      <h3 className="text-2xl md:text-3xl font-bold text-brand-dark mb-4 leading-tight">
                        {step.title}
                      </h3>
                      <p className="text-gray-500 font-medium leading-relaxed mb-6 max-w-lg lg:max-w-none">
                        {step.description}
                      </p>

                      {/* Detail pills */}
                      <div
                        className={`flex flex-wrap gap-2 ${
                          isEven ? "lg:justify-end" : "lg:justify-start"
                        }`}
                      >
                        {step.details.map((detail) => (
                          <span
                            key={detail}
                            className="inline-flex items-center px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold tracking-wide"
                          >
                            {detail}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Empty side (keeps grid alignment) */}
                    <div className="hidden lg:block" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
