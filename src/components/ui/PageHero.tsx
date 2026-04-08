"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Container from "./Container";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  backgroundImage?: string;
  compact?: boolean;
}

export default function PageHero({ title, subtitle, breadcrumbs, backgroundImage, compact = false }: PageHeroProps) {
  return (
    <section
      className={`relative overflow-hidden bg-brand-dark ${
        compact
          ? "pt-32 pb-12 md:pt-36 md:pb-14"
          : "pt-34 pb-14 md:pt-40 md:pb-18"
      }`}
    >
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-28"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_6%,rgba(217,182,97,0.18),transparent_28%),linear-gradient(180deg,rgba(7,9,12,0.7)_0%,rgba(7,9,12,0.82)_42%,rgba(7,9,12,0.94)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />

      <Container className="relative z-10">
        <div className="pointer-events-none absolute left-2 top-10 h-44 w-44 rounded-full bg-accent-gold/12 blur-3xl md:left-4 md:top-12 md:h-56 md:w-56" />
        {breadcrumbs && breadcrumbs.length > 0 && (
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6 flex flex-wrap items-center gap-2 text-sm font-medium text-white/82"
          >
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-2">
                <ChevronRight size={14} />
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-white transition-colors">{crumb.label}</Link>
                ) : (
                  <span className="text-white/92">{crumb.label}</span>
                )}
              </span>
            ))}
          </motion.nav>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-5xl text-4xl font-extrabold leading-[0.94] tracking-tight text-[#fffaf0] [text-wrap:balance] drop-shadow-[0_18px_40px_rgba(0,0,0,0.48)] md:text-[4.35rem] lg:text-[5.1rem]"
          style={{ textShadow: "0 12px 32px rgba(0,0,0,0.45)" }}
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 max-w-3xl text-lg font-medium leading-relaxed text-white/92 md:text-[1.35rem]"
          >
            {subtitle}
          </motion.p>
        )}
      </Container>
    </section>
  );
}
