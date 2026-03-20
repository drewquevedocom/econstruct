"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const services = [
  {
    id: "01",
    title: "Fire Rebuilds",
    description:
      "LA's fastest fire rebuild specialist. We navigate executive order permits, coordinate with your insurance adjuster, and deliver a turn-key rebuild — from cleared lot to certificate of occupancy — with unmatched speed and precision.",
    image: "/fire_rebuild_service.png",
    href: "/services/fire-rebuild",
    hoverBg: "#1C1C1E",
    hoverText: "#ffffff",
    hoverMuted: "rgba(255,255,255,0.6)",
    hoverDivider: "rgba(255,255,255,0.2)",
    hoverNum: "rgba(255,255,255,0.2)",
  },
  {
    id: "02",
    title: "Luxury Modernization",
    description:
      "Transform an aging property into a premium asset. Our modernization projects maximize livable square footage, upgrade structural systems, and deliver high-end finishes that command top-dollar valuations.",
    image: "/luxury_mod_service.png",
    href: "/services/luxury-modernization",
    hoverBg: "#1A2744",
    hoverText: "#ffffff",
    hoverMuted: "rgba(255,255,255,0.6)",
    hoverDivider: "rgba(255,255,255,0.2)",
    hoverNum: "rgba(255,255,255,0.2)",
  },
  {
    id: "03",
    title: "Ground-Up Custom Homes",
    description:
      "From bare dirt to bespoke architecture. We manage every phase — design, engineering, permitting, and construction — delivering a fully custom residence built to your exact vision.",
    image: "/custom_home_service.png",
    href: "/services/custom-homes",
    hoverBg: "#B8963E",
    hoverText: "#1C1C1E",
    hoverMuted: "rgba(28,28,30,0.65)",
    hoverDivider: "rgba(28,28,30,0.2)",
    hoverNum: "rgba(28,28,30,0.2)",
  },
];

const CARD_TOP_PX = 130;  // Where the card sticks
const GAP_PX = 48;        // Spacing between cards

function ServiceCard({
  service,
  index,
  total,
}: {
  service: (typeof services)[0];
  index: number;
  total: number;
}) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // The math:
  // Card 1 sticks at `130px`. 
  // Card 2 physically sits exactly `cardHeight + GAP_PX` below the top of Card 1.
  // As the user scrolls, Card 2 slides over Card 1.
  // Card 2 fully covers Card 1 exactly when the user has scrolled `cardHeight + GAP_PX` pixels.
  // Therefore, Card 1 should fade/shrink concurrently with that specific scroll distance!

  const { scrollYProgress } = useScroll({
    target: cardRef,
    // [0] = when top of card hits sticky point
    // [1] = when bottom of card has scrolled "up" past the sticky point by exactly GAP_PX
    offset: [`start ${CARD_TOP_PX}px`, `end ${CARD_TOP_PX - GAP_PX}px`],
  });

  const isLast = index === total - 1;
  const scale = useTransform(scrollYProgress, [0, 1], [1, isLast ? 1 : 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, isLast ? 1 : 0.4]);
  const imageOverlayOpacity = useTransform(scrollYProgress, [0, 1], [0, isLast ? 0 : 0.85]);

  return (
    <div
      ref={cardRef}
      className="sticky w-full flex justify-center"
      style={{
        top: `${CARD_TOP_PX}px`,
        zIndex: index + 1,
      }}
    >
      <motion.div
        style={{ scale, opacity, transformOrigin: "top center" }}
        className="w-full max-w-[1200px] bg-white rounded-[32px] overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.12)] border border-gray-100 flex flex-col md:flex-row h-auto md:h-[65vh] min-h-[460px] max-h-[640px]"
        animate={{ backgroundColor: hovered ? service.hoverBg : "#ffffff" }}
        transition={{ duration: 0.45, ease: "easeInOut" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image */}
        <div className="relative w-full md:w-[45%] h-56 md:h-full overflow-hidden flex-shrink-0 bg-gray-100">
          <motion.img
            src={service.image}
            alt={service.title}
            className="absolute inset-0 w-full h-full object-cover"
            animate={{ scale: hovered ? 1.05 : 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
          {/* Overlay to fade out the image when scrolling behind another card */}
          <motion.div 
            className="absolute inset-0 bg-black pointer-events-none"
            style={{ opacity: imageOverlayOpacity }}
          />
        </div>

        {/* Text */}
        <div className="flex-1 flex flex-col justify-center px-8 py-10 md:p-14 relative">
          <motion.span
            animate={{ color: hovered ? service.hoverNum : "#d1d5db" }}
            transition={{ duration: 0.35 }}
            className="text-xs font-bold tracking-[0.25em] uppercase mb-4"
          >
            {service.id}
          </motion.span>

          <motion.h3
            animate={{ color: hovered ? service.hoverText : "#1C1C1E" }}
            transition={{ duration: 0.35 }}
            className="text-3xl md:text-5xl lg:text-[3.25rem] font-bold leading-tight mb-5 md:mb-8"
          >
            {service.title}
          </motion.h3>

          <motion.div
            animate={{ backgroundColor: hovered ? service.hoverDivider : "#e5e7eb" }}
            transition={{ duration: 0.35 }}
            className="w-12 h-[2px] mb-5 md:mb-6"
          />

          <motion.p
            animate={{ color: hovered ? service.hoverMuted : "#6b7280" }}
            transition={{ duration: 0.35 }}
            className="text-base md:text-lg leading-relaxed max-w-lg mb-8 md:mb-0"
          >
            {service.description}
          </motion.p>

          <div className="md:absolute md:bottom-12 md:right-12 mt-4 md:mt-0 flex justify-end">
            <Link
              href={service.href}
              className="group w-14 h-14 bg-[#E4ED64] rounded-full flex items-center justify-center hover:bg-brand-dark transition-all duration-300 shadow-[0_8px_20px_rgba(228,237,100,0.3)]"
            >
              <ArrowUpRight
                size={22}
                className="text-brand-dark group-hover:text-white transition-colors"
                strokeWidth={2.5}
              />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ServicesSpaciaz() {
  return (
    <section className="bg-[#F5F3EE] pt-28 pb-40 w-full relative">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header Block */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-10">
          <div className="mb-4">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-gray-300 bg-white text-gray-500 text-xs font-bold tracking-[0.2em] uppercase shadow-sm">
              What We Offer
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-[4.5rem] font-bold text-brand-dark tracking-tight">
            Our services
          </h2>
        </div>

        {/* Card Stack */}
        <div 
          className="flex flex-col relative w-full"
          style={{ gap: `${GAP_PX}px` }}
        >
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              total={services.length}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
