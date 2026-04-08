"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const awards = [
  {
    image: "/best_contractor_award.png",
    year: "2024",
    title: "Best Contractor",
    subtitle: "LosAngelesContractors.org",
    href: "https://www.losangelescontractors.org/the-best-restaurant-contractors-in-los-angeles/",
  },
  {
    image: "/top_7_contractors.png",
    year: "2022",
    title: "Top Seven Contractors\nin Glendale",
    subtitle: "GeneralContractors.org",
    href: "https://www.generalcontractors.org/the-best-retail-contractors-in-glendale-california/",
  },
];

function AwardCard({ award, index }: { award: (typeof awards)[number]; index: number }) {
  return (
    <motion.a
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2, duration: 0.6 }}
      href={award.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex flex-col items-center px-4 py-8 text-center no-underline ${
        index === 0 ? "md:pl-4 md:pr-12" : "md:pl-12 md:pr-4"
      }`}
    >
      <div className="mb-4 flex items-center justify-center">
        <div className="relative flex h-[112px] w-[112px] items-center justify-center transition-transform duration-500 group-hover:-translate-y-1 md:h-[128px] md:w-[128px]">
          <Image
            src={award.image}
            alt={award.title}
            fill
            sizes="(min-width: 768px) 112px, 96px"
            className="object-contain p-0 grayscale brightness-75 contrast-110 transition-all duration-500 group-hover:grayscale-0 group-hover:brightness-100 group-hover:contrast-100"
          />
        </div>
      </div>

      <span className="mb-2 text-sm font-bold text-accent-gold">{award.year}</span>
      <h3 className="mb-1 whitespace-pre-line text-lg font-bold leading-tight text-brand-dark transition-colors group-hover:text-accent-gold md:text-xl">
        {award.title}
      </h3>
      <p className="text-sm text-gray-500">{award.subtitle}</p>
    </motion.a>
  );
}

export default function AwardsSection() {
  return (
    <section className="border-b border-gray-100 bg-white py-12 md:py-16">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 divide-y divide-gray-200 md:grid-cols-2 md:divide-x md:divide-y-0">
          {awards.map((award, index) => (
            <AwardCard key={award.title} award={award} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
