"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MoveRight } from "lucide-react";
import { useRef } from "react";

const services = [
  {
    title: "Fire Rebuilds",
    description: "Rapid, empathetic, and comprehensive rebuilding process bringing your home back to life.",
    href: "/services/fire-rebuild",
    image: "/fire-rebuild.jpg",
  },
  {
    title: "Luxury Custom Homes",
    description: "Architectural masterpieces tailored to your exact specifications and highest standards.",
    href: "/services/luxury-custom",
    image: "/luxury-kitchen.jpg",
  },
  {
    title: "Major Remodels",
    description: "Transforming existing spaces into modern, functional, and deeply luxurious environments.",
    href: "/services/major-remodels",
    image: "/hero.jpg", 
  },
  {
    title: "Project Management",
    description: "Comprehensive end-to-end management ensuring timelines, budget, and quality are flawlessly maintained.",
    href: "/services/project-management",
    image: "/fire-rebuild.jpg", 
  }
];

export default function ServicesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  return (
    <section className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
          <div className="max-w-3xl">
            <motion.h4 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="font-medium text-accent-gold uppercase tracking-widest text-sm mb-6 flex items-center gap-3"
            >
              <div className="w-12 h-px bg-accent-gold"></div>
              What We Offer
            </motion.h4>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-heading text-brand-dark leading-[1.1]"
            >
              We develop quality infrastructure <br /> & real estate projects.
            </motion.h2>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link 
              href="/services" 
              className="group flex items-center gap-4 text-brand-dark font-bold border-b-2 border-brand-dark/20 pb-2 hover:border-accent-gold transition-colors duration-300"
            >
              <span className="group-hover:text-accent-gold transition-colors">View all services</span>
              <MoveRight className="group-hover:translate-x-2 group-hover:text-accent-gold transition-all" size={24} />
            </Link>
          </motion.div>
        </div>

        {/* Carousel / Grid Area */}
        {/* Using a modern horizontal scrolling container for desktop & tablet */}
        <div className="relative w-full">
          <div 
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto snap-x snap-mandatory pb-12 hide-scrollbar scroll-smooth"
            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
          >
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="group relative flex-none w-[85vw] sm:w-[50vw] md:w-[40vw] lg:w-[30vw] snap-center"
              >
                <Link href={service.href} className="block w-full h-full relative cursor-pointer overflow-hidden rounded-md">
                  {/* Image Container */}
                  <div className="h-[400px] md:h-[500px] w-full overflow-hidden relative">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                      style={{ backgroundImage: `url(${service.image})` }}
                    />
                    {/* Dark gradient for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                    
                    {/* Content positioning */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                      <h3 className="text-2xl md:text-3xl font-heading text-white mb-4 group-hover:-translate-y-2 transition-transform duration-500">
                        {service.title}
                      </h3>
                      <p className="text-white/80 opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-500 h-0 group-hover:h-auto overflow-hidden">
                        {service.description}
                      </p>
                    </div>

                    {/* Floating Arrow Badge */}
                    <div className="absolute top-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-xl">
                      <ArrowRight size={20} className="text-brand-dark -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
        
      </div>
    </section>
  );
}
