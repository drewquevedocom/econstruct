"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-24 bg-secondary-background relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="text-center mb-16">
          <div className="mb-4 inline-flex items-center gap-3 text-accent-gold/80 font-bold tracking-[0.2em] uppercase text-xs">
            <span>&mdash;</span>
            <span>Projects</span>
            <span>&mdash;</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading text-brand-dark tracking-tight">
            Our projects generate <br /> lasting dividends
          </h2>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-full rounded-[40px] overflow-hidden shadow-2xl h-[500px] md:h-[700px]"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
            style={{ backgroundImage: "url('/global-cta-premium.png')" }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,10,14,0.16)_0%,rgba(8,10,14,0.38)_46%,rgba(8,10,14,0.72)_100%)]" />

          {/* Floating Card */}
          <div className="absolute bottom-12 right-12 md:bottom-24 md:right-32 w-[300px] md:w-[380px] bg-white/96 backdrop-blur-sm rounded-3xl p-8 shadow-2xl transform transition-transform hover:-translate-y-2">
            <div className="inline-flex items-center gap-2 bg-accent-gold/10 text-accent-gold px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-6">
              <Star size={12} className="fill-accent-gold" />
              Featured
            </div>
            
            <h3 className="text-2xl md:text-3xl font-heading text-brand-dark mb-4">
              Mixed-Use <br /> Development
            </h3>
            
            <p className="text-body-text/80 text-sm leading-relaxed mb-8">
              Premium high-end luxury execution tailored to absolute perfection. See the portfolio to examine our finish quality.
            </p>
            
            {/* The little yellow floating arrow icon on the bottom right of the card */}
            <Link href="/our-work" className="absolute -bottom-6 -right-6 w-14 h-14 bg-[#E4ED64] rounded-full flex items-center justify-center text-brand-dark shadow-lg hover:scale-110 transition-transform">
              <ArrowRight size={20} className="-rotate-45" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
