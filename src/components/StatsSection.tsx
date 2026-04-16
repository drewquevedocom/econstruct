"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const AnimatedCounter = ({
  end,
  duration = 2.2,
  decimals = 0,
  suffix = "",
  isInView,
}: {
  end: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  isInView: boolean;
}) => {
  const [count, setCount] = useState(end);

  useEffect(() => {
    if (!isInView) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(parseFloat((easeOut * end).toFixed(decimals)));
      if (progress < 1) window.requestAnimationFrame(step);
      else setCount(end);
    };
    window.requestAnimationFrame(step);
  }, [isInView, end, duration, decimals]);

  return (
    <>
      {decimals > 0 ? count.toFixed(decimals) : count}
      {suffix && <sup className="text-[0.42em] align-super">{suffix}</sup>}
    </>
  );
};

// topPct = vertical position of the dot/number from the top of the section
const stats = [
  { label: ["Building in Los", "Angeles Since"],       value: 2001, suffix: "",     decimals: 0, topPct: 52 },
  { label: ["Projects Completed", "Successfully"],     value: 639,  suffix: "+",    decimals: 0, topPct: 18 },
  { label: ["Collective Experience", "Btwn Partners"], value: 51,   suffix: " Yrs", decimals: 0, topPct: 42 },
];

const slideUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: (delay: number) => ({
    opacity: 1, y: 0,
    transition: {
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      delay,
    },
  }),
};

export default function StatsSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-160px" });

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{
        minHeight: "72vh",
        backgroundImage: "url('/hollywood_hills.png')",
        backgroundAttachment: "scroll",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.4)_100%)]" />

      {/* Section label */}
      <motion.p
        custom={0}
        variants={slideUp}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="absolute left-0 right-0 top-10 text-center text-[10px] font-semibold uppercase tracking-[0.4em] text-white/30"
      >
        Key Metrics
      </motion.p>

      {/* Stats grid — evenly spaced, centered */}
      <div className="absolute inset-0 flex items-stretch">
        {stats.map((stat, i) => (
          <div key={i} className="relative flex-1">

            {/* Vertical line: from below dot to bottom, centered in column */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: i * 0.18 + 0.5 }}
              style={{ originY: 1, top: `calc(${stat.topPct}% + 148px)`, left: "50%", transform: "translateX(-50%)" }}
              className="absolute bottom-0 w-[1px] bg-white/25"
            />

            {/* Content — centered in column */}
            <motion.div
              custom={i * 0.28 + 0.1}
              variants={slideUp}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="absolute left-0 right-0 flex flex-col items-center"
              style={{ top: `${stat.topPct}%` }}
            >
              {/* Number */}
              <div className="overflow-hidden">
                <motion.div
                  custom={i * 0.18 + 0.28}
                  variants={slideUp}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  className="font-heading text-[2.4rem] font-black leading-none text-white md:text-[5.4rem]"
                >
                  <AnimatedCounter
                    end={stat.value}
                    decimals={stat.decimals}
                    suffix={stat.suffix}
                    duration={2.2}
                    isInView={isInView}
                  />
                </motion.div>
              </div>

              {/* Label */}
              <div className="mt-3 space-y-[3px] text-center">
                {stat.label.map((line, j) => (
                  <div key={j} className="overflow-hidden">
                    <motion.p
                      custom={i * 0.18 + j * 0.06 + 0.38}
                      variants={slideUp}
                      initial="hidden"
                      animate={isInView ? "visible" : "hidden"}
                      className="text-[11px] font-black uppercase tracking-[0.2em] text-white/60"
                    >
                      {line}
                    </motion.p>
                  </div>
                ))}
              </div>

              {/* Dot — sits right below the label */}
              <motion.span
                custom={i * 0.18 + 0.48}
                variants={slideUp}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="mt-4 block h-[7px] w-[7px] rounded-full bg-[#c8f135]"
              />
            </motion.div>

          </div>
        ))}
      </div>
    </section>
  );
}
