"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "econstruct built our dream home — best custom homebuilders in Los Angeles. I highly recommend their personalized approach...",
    name: "Nathan Hughes",
    neighborhood: "Los Angeles",
    rating: 5,
  },
  {
    quote: "econstruct remodeled my master bedroom and went above and beyond — new walk-in closet, balcony, and bath. I would love to use them again for my next project...",
    name: "Eugene Shakhov",
    neighborhood: "Los Angeles",
    rating: 5,
  },
  {
    quote: "Great team and amazing quality. econstruct delivered exactly what we envisioned and made the process seamless from start to finish...",
    name: "Hashen Hamedani",
    neighborhood: "Los Angeles",
    rating: 5,
  },
  {
    quote: "econstruct brings construction expertise and a level of detail most GCs simply can't match. The finish work is top notch and they build on a quick schedule...",
    name: "Neil M.",
    neighborhood: "Los Angeles",
    rating: 5,
  },
  {
    quote: "econstruct did an outstanding job in all areas — super high quality work, they went above and beyond what was expected. I could not be more impressed...",
    name: "Randy W.",
    neighborhood: "Los Angeles",
    rating: 5,
  },
  {
    quote: "econstruct completed a major remodel — new roof, decks, stucco, re-plumbing, all new stone floors. The subcontractors were excellent and the finished product was beautiful...",
    name: "Tony Biscaglia",
    neighborhood: "Bell Canyon",
    rating: 5,
  },
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

        <div className="relative min-h-[180px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="w-full px-4"
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
