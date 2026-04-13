"use client";
import { motion } from "framer-motion";

const valueProps = [
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
        <rect x="6" y="22" width="36" height="20" rx="3" />
        <path d="M6 28h36" />
        <path d="M16 22V14a8 8 0 1116 0v8" />
        <circle cx="24" cy="36" r="3" />
        <path d="M24 39v2" />
      </svg>
    ),
    title: "25+ Years of Experience",
    description:
      "Over two decades building luxury residential projects across Southern California. Our leadership team has delivered more than $200M in high-end construction on time and on budget.",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
        <path d="M24 44c8-4 14-10 14-20V10L24 4 10 10v14c0 10 6 16 14 20z" />
        <path d="M16 24l5 5 11-11" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Fire Rebuild Specialists",
    description:
      "Los Angeles' fire rebuild team. We have navigated WUI codes, expedited permitting, and insurance coordination for dozens of families rebuilding after loss.",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
        <circle cx="24" cy="24" r="18" />
        <path d="M24 14v12l8 4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="24" cy="24" r="2" fill="currentColor" />
      </svg>
    ),
    title: "Transparent Communication",
    description:
      "Weekly progress reports, a dedicated project manager, and real-time budget tracking. You'll never wonder where your project stands. Our clients call it the most stress-free build experience they've had.",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
        <path d="M8 40V18l16-12 16 12v22a2 2 0 01-2 2H10a2 2 0 01-2-2z" />
        <path d="M18 42V28h12v14" />
        <path d="M4 20l20-15 20 15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Premium Craftsmanship",
    description:
      "We don't cut corners. Every project features hand-selected materials, master-level tradesmen, and obsessive quality control. The result: homes that command top-dollar valuations and stand the test of time.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 md:py-32 bg-[#f6f2ea] overflow-hidden relative">
      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.18) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border border-black/10 uppercase tracking-widest text-[10px] font-bold px-4 py-1.5 rounded-full text-black/55 w-fit mx-auto mb-6 flex gap-2 items-center bg-white/60 backdrop-blur-sm"
          >
            <span>WHY</span>
            <span className="text-accent-gold">&bull;</span>
            <span>eCONSTRUCT</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-dark tracking-tight mb-5"
          >
            Built Different
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-black/60 font-medium text-lg max-w-2xl mx-auto"
          >
            The difference between a contractor and a construction partner.
          </motion.p>
        </div>

        {/* Value Props Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {valueProps.map((prop, i) => (
            <motion.div
              key={prop.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-3xl border border-black/8 bg-white p-8 md:p-12 shadow-[0_18px_45px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(0,0,0,0.08)]"
            >
              {/* Gold accent line on hover */}
              <div className="absolute top-0 left-0 w-0 h-[2px] bg-accent-gold group-hover:w-full transition-all duration-700" />

              <div className="text-black/30 group-hover:text-accent-gold transition-colors duration-500 mb-8">
                {prop.icon}
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-brand-dark mb-4 leading-tight">
                {prop.title}
              </h3>
              <p className="text-black/60 font-medium leading-relaxed text-[15px]">
                {prop.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
