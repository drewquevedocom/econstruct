"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function Hero() {
  const { scrollY } = useScroll();
  const [frame, setFrame] = useState(1);
  const heroParallaxY = useTransform(scrollY, [0, 1000], [0, 150]);
  const frameObjectPosition = useTransform(scrollY, [0, 600], ["100% 50%", "50% 50%"]);

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      // 21 frames total (1 to 21). Spread over 600px of scroll.
      const frameNum = Math.min(21, Math.max(1, Math.floor((latest / 600) * 20) + 1));
      setFrame(frameNum);
    });
    return () => unsubscribe();
  }, [scrollY]);

  return (
    <div className="relative w-full h-[165vh] z-0">
      <section className="sticky top-0 h-screen min-h-[700px] flex items-center justify-center bg-transparent overflow-hidden">
        {/* Background Frame Sequence */}
        <div className="absolute inset-0 -z-10 bg-brand-dark overflow-hidden">
          <motion.div
            className="absolute inset-x-0 bottom-0 h-[110%] w-full"
            style={{ y: heroParallaxY }}
          >
            {/* The looping video sits underneath everything. It acts as "Frame 1" */}
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover"
              src="/loop.mp4"
            />
            {Array.from({ length: 21 }).map((_, i) => {
              const frameIndex = i + 1;
              return (
                <motion.img
                  key={frameIndex}
                  src={`/scroll/ezgif-frame-${frameIndex.toString().padStart(3, "0")}.jpg`}
                  alt="Scroll Animation Frame"
                  className={`absolute inset-0 w-full h-full object-cover will-change-opacity ${
                    frame === frameIndex && frame !== 1 ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ objectPosition: frameObjectPosition }}
                  loading="eager"
                />
              );
            })}
          </motion.div>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,9,12,0.72)_0%,rgba(7,9,12,0.38)_22%,rgba(7,9,12,0.24)_48%,rgba(7,9,12,0.44)_100%)]" />
          <div className="absolute inset-x-0 top-0 h-[24vh] bg-gradient-to-b from-black/45 via-black/18 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(190,155,72,0.08),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.05),transparent_32%)]" />
          <div className="pointer-events-none absolute right-[4vw] top-[12vh] hidden h-[32vh] w-[24vw] max-w-[400px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_68%)] lg:block">
            <div className="hero-blueprint-grid absolute inset-4" />
          </div>
          <div className="pointer-events-none absolute bottom-[14vh] left-[4vw] hidden h-[18vh] w-[18vw] max-w-[280px] border border-white/[0.06] bg-[linear-gradient(90deg,rgba(255,255,255,0.03),transparent_72%)] lg:block">
            <div className="hero-blueprint-grid absolute inset-3" />
          </div>
          <div className="pointer-events-none absolute right-[9vw] top-[18vh] hidden h-[10rem] w-[10rem] rounded-full border border-white/[0.06] lg:block" />
          <div className="pointer-events-none absolute left-[14vw] top-[28vh] hidden h-[6rem] w-[18rem] border border-white/[0.05] lg:block" />
        </div>

        {/* Content */}
        <div className="mx-auto w-[95%] max-w-[1920px] px-6 md:px-8 h-full flex flex-col justify-between pt-[20vh] pb-16 relative z-10">
          {/* Main Title */}
          <div className="flex-1 flex flex-col justify-center text-left mt-8 md:mt-16">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
              }}
            >
              <motion.h1
                variants={{
                  hidden: { opacity: 0, y: 50, filter: "blur(10px)", scale: 0.95 },
                  visible: { opacity: 1, y: 0, filter: "blur(0px)", scale: 1, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } },
                }}
                className="hero-display text-5xl md:text-7xl lg:text-[6.5rem] font-bold leading-[1.05] tracking-tight pb-1"
                style={{ color: "#ffffff" }}
              >
                Los Angeles&apos; Premier
              </motion.h1>
              <motion.h1
                variants={{
                  hidden: { opacity: 0, y: 50, filter: "blur(10px)", scale: 0.95 },
                  visible: { opacity: 1, y: 0, filter: "blur(0px)", scale: 1, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } },
                }}
                className="hero-display text-5xl md:text-7xl lg:text-[6.5rem] font-bold leading-[1.05] tracking-tight pb-1"
                style={{ color: "#ffffff" }}
              >
                High-End
              </motion.h1>
              <motion.h1
                variants={{
                  hidden: { opacity: 0, y: 50, filter: "blur(10px)", scale: 0.95 },
                  visible: { opacity: 1, y: 0, filter: "blur(0px)", scale: 1, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } },
                }}
                className="hero-display text-5xl md:text-7xl lg:text-[6.5rem] font-bold leading-[1.05] tracking-tight"
                style={{ color: "#ffffff" }}
              >
                Home Builder
              </motion.h1>
            </motion.div>
          </div>

          {/* Bottom CTAs */}
          <div className="mt-auto flex w-full flex-col items-start gap-8 border-l border-accent-gold/75 pl-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
              className="max-w-2xl text-left"
            >
              <h2
                className="text-lg font-medium leading-relaxed tracking-[0.12em] text-white/92 md:text-2xl"
                style={{ color: "#ffffff" }}
              >
                Fire Rebuilds <span className="text-accent-gold mx-2">•</span>
                Luxury Modernization <span className="text-accent-gold mx-2">•</span>
                Ground-Up Custom Homes
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 1, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-2"
            >
              <Link
                href="/contact"
                className="group flex items-center justify-center gap-2 rounded-full border border-accent-gold/45 bg-accent-gold px-8 py-4 text-sm font-bold text-white shadow-[0_16px_30px_rgba(184,150,62,0.18)] transition-all hover:bg-white hover:text-brand-dark hover:shadow-2xl hover:shadow-accent-gold/10 active:scale-95 md:text-base"
              >
                Schedule Your Free Consultation
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/our-work"
                className="flex items-center justify-center rounded-full border border-white/25 bg-white/[0.06] px-8 py-4 text-sm font-bold text-white transition-all backdrop-blur-md hover:border-white/45 hover:bg-white/[0.1] active:scale-95 md:text-base"
              >
                View Our Work
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
