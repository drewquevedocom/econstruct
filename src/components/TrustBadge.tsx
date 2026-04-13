"use client";
import { motion } from "framer-motion";
import { ShieldCheck, Clock, Award, HardHat } from "lucide-react";

export default function TrustBadge() {
  const stats = [
    { icon: Clock, value: "25+", label: "Years Experience" },
    { icon: ShieldCheck, value: "Lic #", label: "964015" },
    { icon: Award, value: "100%", label: "Satisfaction Focus" },
    { icon: HardHat, value: "639+", label: "Projects Completed" },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="bg-badge-navy rounded-3xl p-10 md:p-16 text-white shadow-2xl relative overflow-hidden">
          {/* Decorative glass element */}
          <div className="absolute top-[-50%] right-[-10%] w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h2 className="text-3xl md:text-5xl font-heading mb-6">
                A Legacy of <span className="text-accent-gold">Excellence</span>
              </h2>
              <p className="text-white/80 text-lg mb-8 leading-relaxed max-w-xl">
                For over 25 years, econstruct has set the benchmark for luxury residential construction in Los Angeles. We don't just build homes; we forge partnerships based on absolute transparency, speed, and uncompromising quality.
              </p>
              <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-lg font-bold tracking-widest text-accent-gold shadow-sm">
                FULLY LICENSED & INSURED
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex flex-col items-center justify-center text-center hover:bg-white/15 transition-colors"
                >
                  <stat.icon size={36} className="text-accent-gold mb-4" />
                  <div className="text-3xl font-heading font-bold mb-1">{stat.value}</div>
                  <div className="text-xs md:text-sm font-medium text-white/70 uppercase tracking-widest">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
