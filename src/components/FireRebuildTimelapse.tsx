"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const TOTAL_FRAMES = 21;

const phases = [
  {
    label: "Site Cleared",
    description: "Debris removal, soil testing, and foundation preparation",
    frames: [1, 5],
  },
  {
    label: "Framing",
    description: "Structural framing, WUI-compliant materials, and rough inspections",
    frames: [6, 10],
  },
  {
    label: "Enclosure",
    description: "Roofing, fire-rated windows, exterior finishes, and MEP rough-in",
    frames: [11, 16],
  },
  {
    label: "Completed Home",
    description: "Interior finishes, landscaping, defensible space, and final walkthrough",
    frames: [17, 21],
  },
];

function getPhaseIndex(frame: number): number {
  for (let i = 0; i < phases.length; i++) {
    if (frame >= phases[i].frames[0] && frame <= phases[i].frames[1]) {
      return i;
    }
  }
  return phases.length - 1;
}

export default function FireRebuildTimelapse() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentFrame, setCurrentFrame] = useState(1);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // Map scroll progress (0-1) to frame range, with padding so
      // animation plays in the middle ~60% of scroll distance
      const adjusted = Math.max(0, Math.min(1, (latest - 0.2) / 0.6));
      const frameNum = Math.min(
        TOTAL_FRAMES,
        Math.max(1, Math.floor(adjusted * (TOTAL_FRAMES - 1)) + 1)
      );
      setCurrentFrame(frameNum);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const activePhase = getPhaseIndex(currentFrame);

  return (
    <section ref={containerRef} className="relative bg-brand-dark">
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen min-h-[600px] flex flex-col overflow-hidden">
        {/* Frame images */}
        <div className="absolute inset-0">
          {Array.from({ length: TOTAL_FRAMES }).map((_, i) => {
            const frameIndex = i + 1;
            return (
              <img
                key={frameIndex}
                src={`/scroll/ezgif-frame-${frameIndex.toString().padStart(3, "0")}.jpg`}
                alt={`Construction phase frame ${frameIndex}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                  currentFrame === frameIndex ? "opacity-100" : "opacity-0"
                }`}
                loading={frameIndex <= 3 ? "eager" : "lazy"}
              />
            );
          })}
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />
        </div>

        {/* Bottom content */}
        <div className="relative z-10 mt-auto px-6 md:px-14 pb-10 md:pb-14">
          <div className="max-w-[1400px] mx-auto">
            {/* Phase indicator dots */}
            <div className="flex items-center gap-2 mb-6">
              {phases.map((phase, i) => (
                <div key={i} className="flex items-center gap-2">
                  <button
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                      i === activePhase
                        ? "bg-accent-gold w-8"
                        : i < activePhase
                          ? "bg-white/60"
                          : "bg-white/25"
                    }`}
                    aria-label={`Phase ${i + 1}: ${phase.label}`}
                  />
                  {i < phases.length - 1 && (
                    <div
                      className={`w-8 md:w-12 h-px transition-colors duration-500 ${
                        i < activePhase ? "bg-white/40" : "bg-white/15"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Phase label */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <p className="text-accent-gold text-xs font-bold tracking-[0.25em] uppercase mb-2">
                  Phase {activePhase + 1} of {phases.length}
                </p>
                <h3
                  className="text-white font-bold leading-tight tracking-tight"
                  style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)" }}
                >
                  {phases[activePhase].label}
                </h3>
                <p className="text-white/60 text-sm md:text-base mt-2 max-w-md">
                  {phases[activePhase].description}
                </p>
              </div>

              {/* Scroll hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: currentFrame <= 2 ? 1 : 0 }}
                className="text-white/40 text-xs tracking-widest uppercase hidden md:block"
              >
                Scroll to explore &darr;
              </motion.p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll height — controls how long the section "sticks" */}
      <div className="h-[200vh]" aria-hidden="true" />
    </section>
  );
}
