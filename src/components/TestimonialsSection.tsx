"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "eConstruct stepped in after the devastating fire and completely handled our complex hillside rebuild. They navigated the nightmare of insurance gaps and WUI codes seamlessly. Our new home is an absolute masterpiece.",
    name: "Sarah C.",
    neighborhood: "Pacific Palisades",
    rating: 5,
  },
  {
    quote: "We brought Frank and his team in for a massive luxury kitchen and living modernization. The craftsmanship is flawless, the communication was stellar, and they kept an incredibly tight schedule. Highly recommended.",
    name: "James M.",
    neighborhood: "Brentwood",
    rating: 5,
  },
  {
    quote: "Building a ground-up custom luxury home is terrifying, but eConstruct made it an incredible experience. From the foundation to the final high-end finishes, they delivered beyond our wildest expectations.",
    name: "Elena R.",
    neighborhood: "Santa Monica",
    rating: 5,
  }
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 md:py-32 bg-[#F8F6F2] overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl text-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border border-brand-dark/20 uppercase tracking-widest text-[10px] font-bold px-4 py-1.5 rounded-full text-brand-dark w-fit mx-auto mb-12 flex gap-2 items-center"
        >
          <span>CLIENTS</span> 
          <span className="text-accent-gold">•</span>
          <span>TESTIMONIALS</span>
        </motion.div>

        <div className="relative h-[250px] md:h-[200px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute w-full px-4"
            >
              <div className="flex justify-center gap-1 mb-8">
                {Array.from({ length: testimonials[currentIndex].rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent-gold text-accent-gold" />
                ))}
              </div>
              <h3 className="text-xl md:text-3xl font-heading text-brand-dark leading-relaxed mb-8 max-w-4xl mx-auto">
                "{testimonials[currentIndex].quote}"
              </h3>
              <p className="font-bold text-brand-dark tracking-wide uppercase text-sm">
                {testimonials[currentIndex].name} <span className="text-accent-gold mx-2">|</span> <span className="text-gray-500 font-medium">{testimonials[currentIndex].neighborhood}</span>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-3 mt-12">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "bg-accent-gold w-8" : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
