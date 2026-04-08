"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const AnimatedCounter = ({
  end,
  duration = 2,
  prefix = "",
  suffix = "",
}: {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;

      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    window.requestAnimationFrame(step);
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
};

export default function StatsSection() {
  const stats: { value: number; label: string; prefix?: string; suffix?: string }[] = [
    {
      value: 25,
      suffix: "+",
      label: "Years of Frank's experience in LA",
    },
    {
      value: 634,
      label: "Projects Completed Successfully",
    },
    {
      value: 51,
      suffix: " Years",
      label: "Collective Experience Between Partners",
    },
  ];

  return (
    <section className="overflow-hidden bg-[#f6f2ea] py-20 md:py-28">
      <div className="container mx-auto max-w-7xl px-6 md:px-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="group relative overflow-hidden rounded-3xl border border-black/8 bg-white p-8 shadow-[0_18px_45px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(0,0,0,0.08)] md:p-10"
            >
              <div className="absolute inset-x-0 top-0 h-[3px] bg-accent-gold" />

              <div className="mb-5 text-[11px] font-semibold uppercase tracking-[0.32em] text-black/35">
                Key Metric
              </div>

              <div className="mb-4 text-5xl font-bold tracking-tight text-brand-dark md:text-6xl">
                <AnimatedCounter
                  end={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </div>

              <p className="max-w-sm text-base font-semibold leading-snug text-black/70 md:text-lg">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
