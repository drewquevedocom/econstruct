"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const textColor = "text-white";
  const hoverColor = "hover:text-accent-gold";

  return (
    <header className="absolute top-4 left-0 w-full z-50 pointer-events-none px-4 md:px-8">
      <div 
        className="pointer-events-auto max-w-[1920px] mx-auto w-full flex items-center justify-between px-6 lg:px-10 py-4 bg-brand-dark/60 backdrop-blur-md rounded-full border border-white/10 transition-all duration-500 shadow-xl"
      >
        {/* Left Side: Logo & Nav */}
        <div className="flex items-center gap-8 md:gap-14">
          {/* Logo */}
          <Link href="/" className="flex items-center z-50 shrink-0">
            <div className="h-7 md:h-[30px] flex items-center relative overflow-visible group">
              
              {/* Dual-Image Split Hack for Perfect Logo Control */}
              <div className="h-full relative flex items-center">
                {/* 1. The Red 'e' Box (Original logo clipped to the left side) */}
                <img
                  src="/econstruct_logo.png"
                  alt="eConstruct"
                  className="h-full w-auto object-contain relative z-20"
                  style={{
                    clipPath: "polygon(0 0, 16% 0, 16% 100%, 0 100%)",
                    filter: "saturate(1.4) contrast(1.15) brightness(1.1) drop-shadow(0px 4px 12px rgba(220, 38, 38, 0.5))"
                  }}
                />

                {/* Strong gold glow locked inside the 'e' box */}
                <motion.div
                  className="absolute top-0 left-0 pointer-events-none z-10"
                  style={{
                    width: "16%",
                    height: "100%",
                    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                    overflow: "hidden",
                  }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-sm"
                    style={{
                      background: "radial-gradient(circle at center, rgba(184, 150, 62, 0.95) 0%, rgba(212, 175, 55, 0.6) 40%, rgba(184, 150, 62, 0) 75%)",
                      mixBlendMode: "screen",
                    }}
                    animate={{
                      opacity: [0.5, 1, 0.6, 1, 0.5],
                      scale: [0.85, 1.15, 0.9, 1.2, 0.85],
                    }}
                    transition={{
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: "radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.7) 0%, transparent 55%)",
                      mixBlendMode: "screen",
                    }}
                    animate={{
                      opacity: [0, 0.8, 0.3, 0.9, 0],
                      scale: [0.6, 1.0, 0.7, 1.1, 0.6],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.8,
                    }}
                  />
                </motion.div>
                
                {/* 2. The 'construct' Text (Inverted strictly to white) */}
                <img 
                  src="/econstruct_logo.png" 
                  alt="" 
                  className="h-full w-auto object-contain absolute left-0 top-0 z-10 pointer-events-none"
                  style={{ 
                    clipPath: "polygon(15.5% 0, 100% 0, 100% 100%, 15.5% 100%)",
                    // Turn pure black into crisp glowing white
                    filter: "brightness(0) invert(1) drop-shadow(0px 4px 12px rgba(255, 255, 255, 0.3))"
                  }}
                />
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/" className={`${textColor} ${hoverColor} font-bold text-sm tracking-wide transition-colors relative group`}>
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-gold transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {/* Services with Dropdown */}
            <div className="relative group/services">
              <Link href="/services" className={`${textColor} ${hoverColor} font-bold text-sm tracking-wide transition-colors relative flex items-center gap-1`}>
                Services
                <svg className="w-3 h-3 transition-transform group-hover/services:rotate-180" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2"><path d="M3 5l3 3 3-3"/></svg>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-gold transition-all duration-300 group-hover/services:w-full"></span>
              </Link>
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover/services:opacity-100 group-hover/services:visible transition-all duration-200">
                <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-3 min-w-[220px]">
                  <Link href="/services/fire-rebuild" className="block px-4 py-3 rounded-lg text-brand-dark text-sm font-semibold hover:bg-accent-gold/10 hover:text-accent-gold transition-colors">Fire Rebuild</Link>
                  <Link href="/services/luxury-modernization" className="block px-4 py-3 rounded-lg text-brand-dark text-sm font-semibold hover:bg-accent-gold/10 hover:text-accent-gold transition-colors">Luxury Modernization</Link>
                  <Link href="/services/custom-homes" className="block px-4 py-3 rounded-lg text-brand-dark text-sm font-semibold hover:bg-accent-gold/10 hover:text-accent-gold transition-colors">Custom Homes</Link>
                  <Link href="/services/adu-construction" className="block px-4 py-3 rounded-lg text-brand-dark text-sm font-semibold hover:bg-accent-gold/10 hover:text-accent-gold transition-colors">ADU & Additions</Link>
                </div>
              </div>
            </div>

            <Link href="/our-work" className={`${textColor} ${hoverColor} font-bold text-sm tracking-wide transition-colors relative group`}>
              Our Work
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-gold transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/about" className={`${textColor} ${hoverColor} font-bold text-sm tracking-wide transition-colors relative group`}>
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-gold transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/resources" className={`${textColor} ${hoverColor} font-bold text-sm tracking-wide transition-colors relative group`}>
              Resources
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-gold transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>
        </div>

        {/* Right Side: Contact & CTA */}
        <div className="hidden md:flex items-center gap-6">
          <div className={`flex items-center gap-2 ${textColor} font-semibold transition-colors`}>
            <span className="text-sm">Call Us:</span>
            <a href="tel:8889900303" className="relative group text-sm font-bold tracking-wider">
              (888) 990-0303
              <span className="absolute -bottom-1 left-0 w-full h-px bg-current opacity-50 transition-opacity group-hover:opacity-100"></span>
            </a>
          </div>
          <Link 
            href="/contact" 
            className="bg-accent-gold text-white px-6 py-2.5 outline-none rounded-full font-bold text-sm hover:bg-white hover:text-brand-dark hover:shadow-lg transition-all shadow-md active:scale-95"
          >
            Consultation
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className={`md:hidden ${textColor} z-50 transition-colors pointer-events-auto`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-20 left-4 right-4 bg-white rounded-2xl shadow-2xl flex flex-col p-6 gap-6 md:hidden border border-gray-100 pointer-events-auto"
          >
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-brand-dark hover:text-accent-gold font-medium text-lg">Home</Link>
            <Link href="/services" onClick={() => setMobileMenuOpen(false)} className="text-brand-dark hover:text-accent-gold font-medium text-lg">Services</Link>
            <div className="pl-4 flex flex-col gap-3">
              <Link href="/services/fire-rebuild" onClick={() => setMobileMenuOpen(false)} className="text-gray-500 hover:text-accent-gold font-medium text-sm">Fire Rebuild</Link>
              <Link href="/services/luxury-modernization" onClick={() => setMobileMenuOpen(false)} className="text-gray-500 hover:text-accent-gold font-medium text-sm">Luxury Modernization</Link>
              <Link href="/services/custom-homes" onClick={() => setMobileMenuOpen(false)} className="text-gray-500 hover:text-accent-gold font-medium text-sm">Custom Homes</Link>
              <Link href="/services/adu-construction" onClick={() => setMobileMenuOpen(false)} className="text-gray-500 hover:text-accent-gold font-medium text-sm">ADU & Additions</Link>
            </div>
            <Link href="/our-work" onClick={() => setMobileMenuOpen(false)} className="text-brand-dark hover:text-accent-gold font-medium text-lg">Our Work</Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="text-brand-dark hover:text-accent-gold font-medium text-lg">About</Link>
            <Link href="/resources" onClick={() => setMobileMenuOpen(false)} className="text-brand-dark hover:text-accent-gold font-medium text-lg">Resources</Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="text-brand-dark hover:text-accent-gold font-medium text-lg">Contact</Link>
            
            <a href="tel:8889900303" className="flex justify-center items-center gap-2 mt-4 text-brand-dark font-bold border border-brand-dark/20 py-4 rounded-xl bg-secondary-background">
              <Phone size={18} className="text-accent-gold" />
              Call: (888) 990-0303
            </a>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="bg-accent-gold text-white text-center py-4 rounded-xl font-semibold shadow-md">
              Get a Consultation
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
