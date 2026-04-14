"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Phone, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import HeaderLogo from "@/components/HeaderLogo";
import { COMPANY } from "@/lib/constants";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const textColor = "text-white";
  const hoverColor = "hover:text-accent-gold";

  return (
    <header className="fixed top-4 left-0 w-full z-50 pointer-events-none px-4 md:top-5 md:px-8">
      <div
        className="pointer-events-auto mx-auto flex w-full max-w-[1920px] items-center justify-between rounded-full border border-white/12 bg-[rgba(12,14,18,0.72)] px-5 py-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.26)] backdrop-blur-xl transition-all duration-500 lg:px-8"
      >
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="z-50 flex shrink-0 items-center">
            <HeaderLogo height={38} />
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            <Link href="/" className={`${textColor} ${hoverColor} relative group text-[12px] font-semibold uppercase tracking-[0.2em] transition-colors`}>
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-gold transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <div className="relative group/services">
              <Link href="/services" className={`${textColor} ${hoverColor} relative flex items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.2em] transition-colors`}>
                Services
                <svg className="w-3 h-3 transition-transform group-hover/services:rotate-180" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2"><path d="M3 5l3 3 3-3"/></svg>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-gold transition-all duration-300 group-hover/services:w-full"></span>
              </Link>
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover/services:opacity-100 group-hover/services:visible transition-all duration-200">
                <div className="min-w-[220px] rounded-2xl border border-white/10 bg-[#111419]/95 p-3 shadow-2xl backdrop-blur-xl">
                  <Link href="/services/luxury-home-builder-los-angeles" className="block rounded-lg px-4 py-3 text-sm font-semibold text-white/75 transition-colors hover:bg-accent-gold/10 hover:text-accent-gold">Luxury Home Building</Link>
                  <Link href="/services/fire-rebuild-contractor-los-angeles" className="block rounded-lg px-4 py-3 text-sm font-semibold text-white/75 transition-colors hover:bg-accent-gold/10 hover:text-accent-gold">Fire Rebuild</Link>
                  <Link href="/services/custom-home-construction-los-angeles" className="block rounded-lg px-4 py-3 text-sm font-semibold text-white/75 transition-colors hover:bg-accent-gold/10 hover:text-accent-gold">Custom Home Construction</Link>
                  <Link href="/services/home-additions-los-angeles" className="block rounded-lg px-4 py-3 text-sm font-semibold text-white/75 transition-colors hover:bg-accent-gold/10 hover:text-accent-gold">Home Additions</Link>
                  <Link href="/services/home-automation-los-angeles" className="block rounded-lg px-4 py-3 text-sm font-semibold text-white/75 transition-colors hover:bg-accent-gold/10 hover:text-accent-gold">Home Automation</Link>
                </div>
              </div>
            </div>

            <Link href="/projects" className={`${textColor} ${hoverColor} relative group text-[12px] font-semibold uppercase tracking-[0.2em] transition-colors`}>
              Projects
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-gold transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/blog" className={`${textColor} ${hoverColor} relative group text-[12px] font-semibold uppercase tracking-[0.2em] transition-colors`}>
              Blog
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-gold transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/about" className={`${textColor} ${hoverColor} relative group text-[12px] font-semibold uppercase tracking-[0.2em] transition-colors`}>
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-gold transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/contact" className={`${textColor} ${hoverColor} relative group text-[12px] font-semibold uppercase tracking-[0.2em] transition-colors`}>
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-gold transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-5">
          <div className={`flex items-center gap-2 ${textColor} font-semibold transition-colors`}>
            <span className="text-xs uppercase tracking-[0.18em] text-white/65">Call</span>
            <a href={`tel:${COMPANY.phone.primary}`} className="relative group text-sm font-bold tracking-wider">
              {COMPANY.phone.display}
              <span className="absolute -bottom-1 left-0 w-full h-px bg-current opacity-50 transition-opacity group-hover:opacity-100"></span>
            </a>
          </div>
          <Link
            href="/free-consultation"
            className="rounded-full border border-accent-gold/50 bg-accent-gold px-6 py-2.5 text-sm font-bold text-white shadow-[0_14px_24px_rgba(184,150,62,0.2)] outline-none transition-all hover:bg-white hover:text-brand-dark hover:shadow-lg active:scale-95"
          >
            Consultation
          </Link>
        </div>

        {/* Mobile-only action icons + hamburger */}
        <div className="md:hidden flex items-center gap-3">
          <a
            href={`tel:${COMPANY.phone.primary}`}
            aria-label="Call econstruct"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(201,162,39,0.5)", color: "#c9a227" }}
          >
            <Phone size={17} />
          </a>
          <a
            href="mailto:info@econstructinc.com"
            aria-label="Email econstruct"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(201,162,39,0.5)", color: "#c9a227" }}
          >
            <Mail size={17} />
          </a>
          <button
            className={`${textColor} z-50 transition-colors pointer-events-auto`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto absolute left-4 right-4 top-20 flex flex-col gap-6 rounded-3xl border border-white/10 bg-[#111419]/95 p-6 shadow-2xl backdrop-blur-2xl md:hidden"
          >
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-white hover:text-accent-gold">Home</Link>
            <Link href="/services" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-white hover:text-accent-gold">Services</Link>
            <div className="pl-4 flex flex-col gap-3">
              <Link href="/services/luxury-home-builder-los-angeles" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-white/65 hover:text-accent-gold">Luxury Home Building</Link>
              <Link href="/services/fire-rebuild-contractor-los-angeles" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-white/65 hover:text-accent-gold">Fire Rebuild</Link>
              <Link href="/services/custom-home-construction-los-angeles" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-white/65 hover:text-accent-gold">Custom Home Construction</Link>
              <Link href="/services/home-additions-los-angeles" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-white/65 hover:text-accent-gold">Home Additions</Link>
              <Link href="/services/home-automation-los-angeles" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-white/65 hover:text-accent-gold">Home Automation</Link>
            </div>
            <Link href="/projects" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-white hover:text-accent-gold">Projects</Link>
            <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-white hover:text-accent-gold">Blog</Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-white hover:text-accent-gold">About</Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-white hover:text-accent-gold">Contact</Link>

            <a href={`tel:${COMPANY.phone.primary}`} className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-4 font-bold text-white">
              <Phone size={18} className="text-accent-gold" />
              Call: {COMPANY.phone.display}
            </a>
            <Link href="/free-consultation" onClick={() => setMobileMenuOpen(false)} className="rounded-xl bg-accent-gold py-4 text-center font-semibold text-white shadow-md">
              Get a Consultation
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
