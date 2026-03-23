"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { COMPANY } from "@/lib/constants";

export default function FinalCTA() {
  return (
    <section className="py-28 md:py-36 bg-[#F8F6F2] relative overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent-gold/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent-gold/30 to-transparent" />

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <div className="text-center">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border border-brand-dark/20 uppercase tracking-widest text-[10px] font-bold px-4 py-1.5 rounded-full text-brand-dark w-fit mx-auto mb-8 flex gap-2 items-center"
          >
            <span>LET&apos;S</span>
            <span className="text-accent-gold">&bull;</span>
            <span>BUILD</span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-[3.75rem] font-bold text-brand-dark tracking-tight leading-[1.1] mb-6"
          >
            Ready to Rebuild
            <br />
            <span className="text-accent-gold">Your Vision?</span>
          </motion.h2>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 font-medium text-lg md:text-xl max-w-xl mx-auto mb-12 leading-relaxed"
          >
            Partner with Los Angeles&apos; premier construction experts.
            Your consultation is complimentary and commitment-free.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 bg-brand-dark text-white font-bold text-base px-8 py-4.5 rounded-full hover:bg-accent-gold transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-accent-gold/20 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Schedule a Consultation
              <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0 group-hover:bg-white/25 transition-colors">
                <ArrowRight size={14} className="text-white" />
              </span>
            </Link>

            <a
              href={`tel:${COMPANY.phone.primary.replace(/[^0-9+]/g, "")}`}
              className="group inline-flex items-center gap-3 bg-white text-brand-dark font-bold text-base px-8 py-4.5 rounded-full border border-gray-200 hover:border-accent-gold hover:text-accent-gold transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <Phone size={16} className="group-hover:text-accent-gold transition-colors" />
              {COMPANY.phone.primary}
            </a>
          </motion.div>

          {/* Trust signals */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-14 flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs font-semibold text-gray-400 uppercase tracking-wider"
          >
            <span>{COMPANY.license.display}</span>
            <span className="text-accent-gold/40">&bull;</span>
            <span>Bonded & Insured</span>
            <span className="text-accent-gold/40">&bull;</span>
            <span>Free Estimates</span>
            <span className="text-accent-gold/40">&bull;</span>
            <span>25+ Years</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
