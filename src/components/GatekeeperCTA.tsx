"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function GatekeeperCTA() {
  return (
    <section className="relative w-full overflow-hidden" style={{ height: "clamp(380px, 55vw, 620px)" }}>
      
      {/* Full-bleed background image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[8s] ease-out hover:scale-105"
        style={{ backgroundImage: "url('/hero.jpg')" }}
      />

      {/* Dark gradient overlay — heavier at bottom-left where text sits */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

      {/* Content layer */}
      <div className="absolute inset-0 flex flex-col justify-end px-8 md:px-14 pb-10 md:pb-14">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 w-full max-w-[1600px] mx-auto">

          {/* LEFT — Large title */}
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-white/60 text-xs font-bold tracking-[0.25em] uppercase mb-4"
            >
              eConstruct — Los Angeles
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-white font-bold leading-[1.05] tracking-tight"
              style={{
                fontSize: "clamp(2rem, 5vw, 4rem)",
                textShadow: "0 2px 30px rgba(0,0,0,0.4)",
              }}
            >
              Ready to Build<br />the Extraordinary?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-white/70 text-base md:text-lg mt-4 max-w-lg leading-relaxed"
            >
              Experience the pinnacle of high-end residential construction. Fast execution, uncompromising quality, and maximum ROI.
            </motion.p>
          </div>

          {/* RIGHT — Pill CTA button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex-shrink-0"
          >
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 bg-[#E4ED64] text-brand-dark font-bold text-sm md:text-base px-7 py-4 rounded-full hover:bg-white transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-black/30 hover:-translate-y-1 active:scale-95"
            >
              Get A Quote
              <span className="w-7 h-7 rounded-full bg-brand-dark flex items-center justify-center flex-shrink-0 group-hover:bg-accent-gold transition-colors duration-300">
                <ArrowUpRight size={14} className="text-white" />
              </span>
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
