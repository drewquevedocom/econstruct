"use client";
import { motion } from "framer-motion";
import { useState } from "react";

// Custom SVG Laurel Badge — drawn in the style of the attached award icons
function LaurelBadge({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Left laurel branch */}
      <g fill="currentColor" opacity="0.85">
        <ellipse cx="18" cy="60" rx="5" ry="3" transform="rotate(-10 18 60)" />
        <ellipse cx="14" cy="52" rx="5" ry="3" transform="rotate(-20 14 52)" />
        <ellipse cx="13" cy="43" rx="5" ry="3" transform="rotate(-30 13 43)" />
        <ellipse cx="15" cy="35" rx="5" ry="3" transform="rotate(-45 15 35)" />
        <ellipse cx="20" cy="28" rx="5" ry="3" transform="rotate(-55 20 28)" />
        <ellipse cx="27" cy="22" rx="5" ry="3" transform="rotate(-65 27 22)" />
        <ellipse cx="14" cy="68" rx="5" ry="3" transform="rotate(5 14 68)" />
        <ellipse cx="16" cy="76" rx="5" ry="3" transform="rotate(15 16 76)" />
        <ellipse cx="20" cy="83" rx="5" ry="3" transform="rotate(25 20 83)" />
        <ellipse cx="26" cy="90" rx="5" ry="3" transform="rotate(40 26 90)" />
        {/* Stem */}
        <path d="M32 90 Q20 60 32 28" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </g>
      {/* Right laurel branch (mirrored) */}
      <g fill="currentColor" opacity="0.85">
        <ellipse cx="102" cy="60" rx="5" ry="3" transform="rotate(10 102 60)" />
        <ellipse cx="106" cy="52" rx="5" ry="3" transform="rotate(20 106 52)" />
        <ellipse cx="107" cy="43" rx="5" ry="3" transform="rotate(30 107 43)" />
        <ellipse cx="105" cy="35" rx="5" ry="3" transform="rotate(45 105 35)" />
        <ellipse cx="100" cy="28" rx="5" ry="3" transform="rotate(55 100 28)" />
        <ellipse cx="93" cy="22" rx="5" ry="3" transform="rotate(65 93 22)" />
        <ellipse cx="106" cy="68" rx="5" ry="3" transform="rotate(-5 106 68)" />
        <ellipse cx="104" cy="76" rx="5" ry="3" transform="rotate(-15 104 76)" />
        <ellipse cx="100" cy="83" rx="5" ry="3" transform="rotate(-25 100 83)" />
        <ellipse cx="94" cy="90" rx="5" ry="3" transform="rotate(-40 94 90)" />
        {/* Stem */}
        <path d="M88 90 Q100 60 88 28" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </g>
      {/* Stars top row */}
      <g fill="currentColor" opacity="0.7">
        {[40, 50, 60, 70, 80].map((cx, i) => (
          <polygon key={i} points={`${cx},13 ${cx+2},18 ${cx+5},18 ${cx+3},21 ${cx+4},26 ${cx},23 ${cx-4},26 ${cx-3},21 ${cx-5},18 ${cx-2},18`} transform="scale(0.6) translate(40,10)" />
        ))}
      </g>
      {/* Inner content area */}
      <foreignObject x="30" y="20" width="60" height="75">
        <div className="w-full h-full flex items-center justify-center">
          {children}
        </div>
      </foreignObject>
    </svg>
  );
}

// Trophy SVG icon
function TrophyIcon() {
  return (
    <svg viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
      <path d="M8 4H32V22C32 29.7 26.6 36 20 36C13.4 36 8 29.7 8 22V4Z" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M8 8H2V14C2 18 4.5 21 8 22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M32 8H38V14C38 18 35.5 21 32 22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M20 36V42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 44H28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M15 15L18.5 22L20 19L21.5 22L25 15" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
    </svg>
  );
}

// Rosette/Medal SVG icon
function RosetteIcon() {
  return (
    <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
      <circle cx="22" cy="22" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="22" cy="22" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => (
        <line
          key={i}
          x1={22 + 12 * Math.cos((deg * Math.PI) / 180)}
          y1={22 + 12 * Math.sin((deg * Math.PI) / 180)}
          x2={22 + 17 * Math.cos((deg * Math.PI) / 180)}
          y2={22 + 17 * Math.sin((deg * Math.PI) / 180)}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ))}
      <text x="22" y="26" textAnchor="middle" fontSize="8" fill="currentColor" fontWeight="bold">1st</text>
    </svg>
  );
}

const awards = [
  {
    image: "/award_2024.png",
    icon: <RosetteIcon />,
    year: "2024",
    title: "Best Restaurant\nContractor",
    subtitle: "LosAngelesContractors.org",
    detail: "Recognized for excellence in commercial restaurant builds across Los Angeles County.",
  },
  {
    image: "/award_2022.png",
    icon: <TrophyIcon />,
    year: "2022",
    title: "Top 7 Contractors\nin Glendale",
    subtitle: "GC Magazine",
    detail: "Named among the top general contractors in Glendale for craftsmanship and client satisfaction.",
  },
];

function AwardCard({ award, index }: { award: typeof awards[0], index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2, duration: 0.6 }}
      className={`flex flex-col items-center text-center py-6 px-4 ${
        index === 0 ? "md:pr-12 md:pl-4" : "md:pl-12 md:pr-4"
      }`}
    >
      {/* Badge / Image */}
      <div className="mb-4 flex justify-center items-center">
        {award.image ? (
          <div className="w-16 h-16 md:w-20 md:h-20 flex justify-center items-center relative overflow-hidden rounded-full drop-shadow-sm">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src={award.image} alt={award.title} className="w-full h-full object-cover scale-[1.03] filter grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-default" />
          </div>
        ) : (
          <div className="w-16 h-16 md:w-20 md:h-20 text-gray-400 flex items-center justify-center filter grayscale opacity-60">
            {award.icon}
          </div>
        )}
      </div>

      {/* Year */}
      <span className="text-sm font-bold text-gray-600 mb-2">
        {award.year}
      </span>

      {/* Title */}
      <h3 className="text-lg md:text-xl font-bold text-brand-dark mb-1 leading-tight whitespace-pre-line">
        {award.title}
      </h3>

      {/* Subtitle */}
      <p className="text-sm text-gray-400">
        {award.subtitle}
      </p>
    </motion.div>
  );
}

export default function AwardsSection() {
  return (
    <section className="py-16 md:py-20 bg-white border-b border-gray-100">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          {awards.map((award, index) => (
            <AwardCard key={index} award={award} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
