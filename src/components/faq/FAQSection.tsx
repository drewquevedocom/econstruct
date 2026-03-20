"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { faqs, faqCategories } from "@/lib/data/faq";
import AccordionItem from "@/components/ui/AccordionItem";
import Container from "@/components/ui/Container";

export default function FAQSection() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredFaqs =
    activeCategory === "all"
      ? faqs
      : faqs.filter((faq) => faq.category === activeCategory);

  return (
    <section className="py-24 md:py-32">
      <Container size="narrow">
        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
          {faqCategories.map((category) => (
            <button
              key={category.value}
              onClick={() => setActiveCategory(category.value)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                activeCategory === category.value
                  ? "bg-brand-dark text-white shadow-md"
                  : "bg-gray-100 text-body-text hover:bg-gray-200"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {filteredFaqs.map((faq, index) => (
              <AccordionItem
                key={`${activeCategory}-${index}`}
                question={faq.question}
                answer={faq.answer}
                defaultOpen={index === 0}
              />
            ))}

            {filteredFaqs.length === 0 && (
              <p className="text-center text-body-text py-12">
                No questions found in this category.
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </Container>
    </section>
  );
}
