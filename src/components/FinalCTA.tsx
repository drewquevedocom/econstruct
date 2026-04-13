"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { COMPANY } from "@/lib/constants";

export default function FinalCTA() {
  return (
    <section className="py-28 md:py-36 bg-[#F8F6F2] relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.12]"
        style={{ backgroundImage: "url('/make_wider_2K_202604072157.png')" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(248,246,242,0.92)_0%,rgba(248,246,242,0.94)_100%)]" />
      {/* Subtle decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent-gold/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent-gold/30 to-transparent" />

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <div className="text-center">
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/free-consultation"
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
            transition={{ delay: 0.25 }}
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
