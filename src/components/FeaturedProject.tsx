"use client";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, MoveHorizontal } from "lucide-react";

export default function FeaturedProject() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    let clientX = 0;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = (e as React.MouseEvent).clientX;
    }

    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderPosition(percentage);
  };

  const handleMouseDown = () => {
    const handleMouseMove = (e: MouseEvent | TouchEvent) => handleDrag(e as any);
    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("touchend", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleMouseMove);
    window.addEventListener("touchend", handleMouseUp);
  };

  return (
    <section className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-6 md:px-8 max-w-7xl">
        
        {/* Top Header */}
        <div className="flex flex-col items-start mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border border-brand-dark/20 uppercase tracking-widest text-[10px] font-bold px-4 py-1.5 rounded-full text-brand-dark w-fit mb-6 flex gap-2 items-center"
          >
            <span>CASE STUDY</span> 
            <span className="text-accent-gold">•</span>
            <span>FEATURED</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-dark leading-[1.05] tracking-tight"
          >
            Palisades Fire Rebuild
          </motion.h2>
        </div>

        {/* 2 Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left: Before/After Slider */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full relative rounded-2xl overflow-hidden shadow-2xl h-[400px] md:h-[600px] cursor-ew-resize select-none group"
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
          >
            {/* After Image (Background) */}
            <div 
              className="absolute inset-0 bg-cover bg-center pointer-events-none"
              style={{ backgroundImage: `url('/custom_home_service.png')` }}
            >
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full">
                AFTER
              </div>
            </div>

            {/* Before Image (Foreground Masked) */}
            <div 
              className="absolute top-0 bottom-0 left-0 bg-cover bg-center pointer-events-none border-r-4 border-white/80 transition-all duration-75 ease-out shadow-[4px_0_24px_rgba(0,0,0,0.5)]"
              style={{ 
                width: `${sliderPosition}%`,
                backgroundImage: `url('/fire_rebuild_service.png')` 
              }}
            >
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full">
                BEFORE
              </div>

              {/* Slider Handle Widget */}
              <div className="absolute top-1/2 -right-[22px] -mt-[22px] w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-2xl text-brand-dark transition-transform group-hover:scale-110 pointer-events-auto">
                <MoveHorizontal size={20} />
              </div>
            </div>
          </motion.div>

          {/* Right: Project Narrative */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col h-full justify-center"
          >
            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 mb-12 py-8 border-y border-gray-100">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Neighborhood</p>
                <p className="font-semibold text-brand-dark text-lg">Pacific Palisades</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Timeline</p>
                <p className="font-semibold text-brand-dark text-lg">14 Months</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Scope</p>
                <p className="font-semibold text-brand-dark text-lg">Complete Ground-Up Rebuild</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Scale</p>
                <p className="font-semibold text-brand-dark text-lg">6,200 sq.ft.</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-brand-dark mb-4">The Challenge</h3>
              <p className="text-gray-500 leading-relaxed font-medium">
                Following devastating wildlife destruction, the client faced a complex hillside foundation that was completely compromised. Strict new WUI (Wildland-Urban Interface) codes meant traversing a severely restrictive permitting pipeline.
              </p>
            </div>

            <div className="mb-10">
              <h3 className="text-2xl font-bold text-brand-dark mb-4">The Solution</h3>
              <p className="text-gray-500 leading-relaxed font-medium">
                We fully expedited the executive order permitting process cutting the red tape by 60%. Implementing our massive concrete retaining systems combined with a luxury modernist steel-glass structure, we delivered an impregnable architectural asset with panoramic ocean views—ahead of schedule.
              </p>
            </div>

            <Link 
              href="/our-work" 
              className="group flex gap-3 items-center text-brand-dark font-bold border-b border-brand-dark/20 w-fit pb-1 hover:border-accent-gold hover:text-accent-gold transition-colors"
            >
              See Full Case Study
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
