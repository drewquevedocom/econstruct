"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative w-full h-[165vh] z-0">
      <section className="sticky top-0 h-screen min-h-[700px] flex items-center justify-center bg-transparent overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-brand-dark overflow-hidden">
          <motion.div
            className="absolute inset-x-0 bottom-0 h-[116%] w-full"
            style={{ transform: "translateY(7%) scale(1.14)", transformOrigin: "center bottom" }}
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 h-full w-full object-cover"
              src="/hero_video.mp4"
            />
          </motion.div>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,9,12,0.72)_0%,rgba(7,9,12,0.38)_22%,rgba(7,9,12,0.24)_48%,rgba(7,9,12,0.44)_100%)]" />
          <div className="absolute inset-x-0 top-0 h-[24vh] bg-gradient-to-b from-black/45 via-black/18 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(190,155,72,0.08),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.05),transparent_32%)]" />
        </div>

        <div className="mx-auto w-[95%] max-w-[1920px] px-6 md:px-8 h-full flex flex-col justify-between pt-[20vh] pb-16 relative z-10">
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
                className="hero-display font-heading text-5xl md:text-7xl lg:text-[6.5rem] font-bold leading-[1.05] tracking-tight"
                style={{ color: "#ffffff" }}
              >
                <span className="block pb-1">Los Angeles Luxury</span>
                <span className="block pb-1">Home Builder</span>
                <span className="block">and General Contractor</span>
              </motion.h1>
            </motion.div>
          </div>

          <div className="mt-auto flex w-full flex-col items-start gap-8 border-l border-accent-gold/75 pl-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
              className="max-w-2xl text-left"
            >
              <h2
                className="font-heading text-lg font-medium leading-relaxed tracking-[0.12em] text-white/92 md:text-2xl"
                style={{ color: "#ffffff" }}
              >
                Fire Rebuild Contractor <span className="text-accent-gold mx-2">&bull;</span>
                Luxury Remodel Contractor <span className="text-accent-gold mx-2">&bull;</span>
                Custom Home Builder
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 1, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-2"
            >
              <Link
                href="/free-consultation"
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
