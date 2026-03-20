"use client";
import { motion } from "framer-motion";
import SectionBadge from "./SectionBadge";

interface SectionHeaderProps {
  badge?: string[];
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
  className?: string;
}

export default function SectionHeader({ badge, title, subtitle, centered = true, light = false, className = "" }: SectionHeaderProps) {
  return (
    <div className={`${centered ? "text-center" : ""} mb-16 ${className}`}>
      {badge && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <SectionBadge items={badge} centered={centered} className={light ? "border-white/30 text-white" : ""} />
        </motion.div>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight ${light ? "text-white" : "text-brand-dark"}`}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className={`mt-6 text-lg md:text-xl font-medium max-w-2xl ${centered ? "mx-auto" : ""} ${light ? "text-white/80" : "text-gray-500"}`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
