"use client";
import { motion, useInView } from "framer-motion";
import { useEffect, useState, useRef } from "react";

// Simple incremental animated counter component
const AnimatedCounter = ({ end, duration = 2, prefix = "", suffix = "" }: { end: number, duration?: number, prefix?: string, suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let startTime: number | null = null;
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        
        // Easing function (easeOutExpo)
        const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        
        setCount(Math.floor(easeOut * end));
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setCount(end); // Ensure we end up precisely on the number
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {prefix}{count}{suffix}
    </span>
  );
};

export default function StatsSection() {
  const stats = [
    {
      value: 340,
      suffix: "+",
      label: "Palisades projects tracked since the fire"
    },
    {
      prefix: "$",
      value: 450,
      suffix: "–$800+",
      label: "Per sq ft for custom builds"
    },
    {
      value: 3,
      suffix: "×",
      label: "Faster permits under executive orders"
    },
    {
      value: 25,
      suffix: "+",
      label: "Years of Frank's experience in LA"
    }
  ];

  return (
    <section className="py-24 bg-gray-100 overflow-hidden">
      <div className="container mx-auto px-6 md:px-8 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 overflow-hidden divide-y sm:divide-y-0 sm:divide-x divide-gray-300">
          
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className={`flex flex-col pt-8 sm:pt-0 ${i !== 0 ? 'sm:pl-8 lg:pl-12' : ''}`}
            >
              {/* Highlight number */}
              <div className="text-5xl md:text-6xl font-bold text-accent-gold mb-4 tracking-tighter drop-shadow-sm">
                <AnimatedCounter 
                  end={stat.value} 
                  prefix={stat.prefix} 
                  suffix={stat.suffix} 
                />
              </div>
              
              {/* Stat description */}
              <p className="text-brand-dark font-semibold text-sm md:text-base leading-snug pr-4">
                {stat.label}
              </p>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}
