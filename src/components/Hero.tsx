"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";

export default function Hero() {
  const { scrollY } = useScroll();
  const [frame, setFrame] = useState(1);

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
            style={{ y: useTransform(scrollY, [0, 1000], [0, 150]) }}
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
                  style={{ objectPosition: useTransform(scrollY, [0, 600], ["100% 50%", "50% 50%"]) }}
                  loading="eager"
                />
              );
            })}
          </motion.div>
          <div className="absolute inset-0 bg-black/40" />
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
                className="text-5xl md:text-7xl lg:text-[6.5rem] font-bold leading-[1.05] tracking-tight drop-shadow-lg pb-1"
                style={{ color: "#ffffff" }}
              >
                Los Angeles&apos; Premier
              </motion.h1>
              <motion.h1
                variants={{
                  hidden: { opacity: 0, y: 50, filter: "blur(10px)", scale: 0.95 },
                  visible: { opacity: 1, y: 0, filter: "blur(0px)", scale: 1, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } },
                }}
                className="text-5xl md:text-7xl lg:text-[6.5rem] font-bold leading-[1.05] tracking-tight drop-shadow-lg pb-1"
                style={{ color: "#ffffff", textShadow: "0px 0px 30px rgba(255,255,255,0.4)" }}
              >
                High-End
              </motion.h1>
              <motion.h1
                variants={{
                  hidden: { opacity: 0, y: 50, filter: "blur(10px)", scale: 0.95 },
                  visible: { opacity: 1, y: 0, filter: "blur(0px)", scale: 1, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } },
                }}
                className="text-5xl md:text-7xl lg:text-[6.5rem] font-bold leading-[1.05] tracking-tight drop-shadow-lg"
                style={{ color: "#ffffff" }}
              >
                Home Builder
              </motion.h1>
            </motion.div>
          </div>

          {/* Bottom CTAs */}
          <div className="w-full flex flex-col items-start gap-8 mt-auto border-l-2 border-accent-gold pl-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
              className="max-w-2xl text-left"
            >
              <h2
                className="font-medium text-lg md:text-2xl leading-relaxed drop-shadow-md tracking-wide"
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
                className="group flex items-center justify-center gap-2 bg-accent-gold text-white px-8 py-4 rounded-full font-bold text-sm md:text-base hover:bg-white hover:text-brand-dark transition-all shadow-xl hover:shadow-2xl hover:shadow-accent-gold/20 active:scale-95"
              >
                Schedule Your Free Consultation
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/our-work"
                className="flex items-center justify-center bg-white/5 border border-white/40 text-white px-8 py-4 rounded-full font-bold text-sm md:text-base hover:bg-white/10 hover:border-white transition-all backdrop-blur-md active:scale-95"
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
