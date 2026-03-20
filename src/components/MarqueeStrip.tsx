"use client";
import { motion } from "framer-motion";

export default function MarqueeStrip() {
  const words = ["what we offer", "what we offer", "what we offer", "what we offer"];
  
  return (
    <div className="w-full bg-secondary-background py-6 overflow-hidden border-y border-gray-200">
      <div className="flex w-[200%] md:w-auto relative whitespace-nowrap items-center">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ ease: "linear", duration: 15, repeat: Infinity }}
          className="flex whitespace-nowrap min-w-max text-4xl font-heading text-brand-dark uppercase tracking-widest gap-8"
        >
          {words.map((w, index) => (
            <div key={index} className="flex items-center gap-8">
              <span>{w}</span>
              <span className="text-accent-gold">&bull;</span>
            </div>
          ))}
          {words.map((w, index) => (
            <div key={`copy-${index}`} className="flex items-center gap-8">
              <span>{w}</span>
              <span className="text-accent-gold">&bull;</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
