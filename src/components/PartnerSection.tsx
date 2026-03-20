"use client";
import { motion } from "framer-motion";
import { ShieldCheck, HeartPulse, Recycle, Lightbulb, ArrowUpRight } from "lucide-react";

export default function PartnerSection() {
  const features = [
    {
      icon: ShieldCheck,
      title: "High quality",
      desc: "Our projects set the standard for quality and craftsmanship. Nothing is compromised.",
    },
    {
      icon: HeartPulse,
      title: "Community",
      desc: "We build environments that foster connection and elevate the human experience.",
    },
    {
      icon: Recycle,
      title: "Environmental",
      desc: "Committing to practices that guarantee a sustainable future for the next generation.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      desc: "Pushing boundaries to deliver completely unique, state-of-the-art developments.",
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-white overflow-hidden relative">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        
        {/* Top Feature Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-24">
          
          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 flex gap-3 text-accent-gold/80 font-bold tracking-[0.2em] uppercase text-xs">
              <span>&mdash;</span>
              <span>Our Vision</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-heading text-brand-dark leading-[1.05] mb-12">
              Genuine partner <br /> in every aspect <br /> of development
            </h2>
            
            <a href="/about" className="group inline-flex items-center gap-4 border border-gray-200 rounded-full py-2 px-6 text-brand-dark font-bold hover:border-accent-gold transition-colors duration-300">
              <span className="text-sm uppercase tracking-wider">Learn More</span>
              <div className="w-8 h-8 rounded-full bg-accent-gold text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <ArrowUpRight size={16} />
              </div>
            </a>
          </motion.div>
          
          {/* Right Image element */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* The Spaciaz theme uses these interesting rounded cuts */}
            <div className="relative w-full h-[400px] md:h-[500px] rounded-tl-[100px] rounded-br-[100px] rounded-tr-xl rounded-bl-xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105" style={{ backgroundImage: "url('/fire-rebuild.jpg')" }} />
            </div>
          </motion.div>
        </div>

        {/* Four Column Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="flex flex-col"
            >
              <div className="text-accent-gold mb-6">
                <feature.icon size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl md:text-2xl font-heading text-brand-dark mb-4">
                {feature.title}
              </h3>
              <p className="text-body-text/80 text-sm md:text-base leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
      
      {/* Decorative Bottom Strip like in screenshot */}
      <div className="w-full border-t border-gray-100 mt-24 py-8">
        <div className="container mx-auto px-6 max-w-7xl flex gap-12 overflow-x-auto whitespace-nowrap hide-scrollbar items-center">
          {["Absolute security", "Humanitarian community", "Comprehensive amenities", "Prime locations"].map((badge, i) => (
            <div key={i} className="flex items-center gap-4 shrink-0">
              <span className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                <img src="/hero.jpg" alt="mini badge" className="w-full h-full object-cover" />
              </span>
              <span className="font-heading font-bold text-sm md:text-base tracking-wide text-brand-dark">{badge}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
