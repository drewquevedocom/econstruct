"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { List } from "lucide-react";

interface Section {
  id: string;
  title: string;
}

interface TableOfContentsProps {
  sections: Section[];
}

export default function TableOfContents({ sections }: TableOfContentsProps) {
  const [activeSection, setActiveSection] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(section.id);
            }
          });
        },
        {
          rootMargin: "-20% 0px -60% 0px",
          threshold: 0,
        }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [sections]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile: Inline collapsible ToC */}
      <div className="lg:hidden mb-10">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-6 py-4 shadow-sm"
        >
          <span className="flex items-center gap-3 font-bold text-brand-dark">
            <List size={20} className="text-accent-gold" />
            Table of Contents
          </span>
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-accent-gold text-xl"
          >
            &#9662;
          </motion.span>
        </button>
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm"
          >
            <ul className="flex flex-col gap-1">
              {sections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => handleClick(section.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      activeSection === section.id
                        ? "bg-accent-gold/10 text-accent-gold"
                        : "text-gray-600 hover:text-brand-dark hover:bg-gray-50"
                    }`}
                  >
                    {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </div>

      {/* Desktop: Sticky sidebar ToC */}
      <nav className="hidden lg:block sticky top-32 self-start">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="flex items-center gap-3 font-bold text-brand-dark mb-5 text-sm uppercase tracking-wide">
            <List size={18} className="text-accent-gold" />
            In This Guide
          </h3>
          <ul className="flex flex-col gap-0.5">
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  onClick={() => handleClick(section.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all border-l-2 ${
                    activeSection === section.id
                      ? "border-accent-gold bg-accent-gold/5 text-accent-gold"
                      : "border-transparent text-gray-500 hover:text-brand-dark hover:bg-gray-50"
                  }`}
                >
                  {section.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}
