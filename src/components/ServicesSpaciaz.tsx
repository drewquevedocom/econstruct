/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const services = [
  {
    id: "01",
    title: "Fire Damage Rebuilds",
    slug: "Fire Damage Rebuilds",
    description:
      "econstruct handles complete fire damage restoration and rebuilds across Los Angeles - Palisades, Altadena, and Malibu. We manage insurance claims, demolition permits, and full custom reconstruction.",
    image: "/fire_rebuild_service.png",
    href: "/services/fire-rebuild",
  },
  {
    id: "02",
    title: "Luxury Modernization",
    slug: "Luxury Modernization",
    description:
      "Transform your LA home into a high-performance luxury residence. From kitchen remodels to ADU additions, our design-build team delivers precision craftsmanship with energy-efficient systems for California living.",
    image: "/luxury_mod_service.png",
    href: "/services/luxury-modernization",
  },
  {
    id: "03",
    title: "Ground-Up Custom Homes",
    slug: "Ground-Up Custom Homes",
    description:
      "Build from the ground up in Beverly Hills, Bel Air, or Pacific Palisades. Our licensed general contractors manage architecture, engineering, permitting, and construction - under one roof.",
    image: "/custom_home_service.png",
    href: "/services/custom-homes",
  },
] as const;

export default function ServicesSpaciaz() {
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const rowRefs = useRef<Array<HTMLDivElement | null>>([]);
  const sectionRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const manualOverrideRef = useRef<number | null>(null);
  const overrideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function getActiveIndexFromScroll() {
    if (manualOverrideRef.current !== null) {
      return manualOverrideRef.current;
    }

    const rows = rowRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!rows.length) {
      return 0;
    }

    const viewportCenter = window.innerHeight / 2;
    let bestIndex = 0;
    let bestDistance = Number.POSITIVE_INFINITY;

    rows.forEach((row, index) => {
      const rect = row.getBoundingClientRect();
      const rowCenter = rect.top + rect.height / 2;
      const distance = Math.abs(rowCenter - viewportCenter);

      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    });

    return bestIndex;
  }

  useEffect(() => {
    const updateActiveService = () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = window.requestAnimationFrame(() => {
        const nextIndex = getActiveIndexFromScroll();
        setDisplayedIndex(nextIndex);
        rafRef.current = null;
      });
    };

    if (!rowRefs.current.filter(Boolean).length || !sectionRef.current) {
      return;
    }

    updateActiveService();
    window.addEventListener("scroll", updateActiveService, { passive: true });
    window.addEventListener("resize", updateActiveService);

    return () => {
      window.removeEventListener("scroll", updateActiveService);
      window.removeEventListener("resize", updateActiveService);

      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      if (overrideTimeoutRef.current !== null) {
        clearTimeout(overrideTimeoutRef.current);
        overrideTimeoutRef.current = null;
      }
    };
  }, []);

  function activateService(index: number) {
    manualOverrideRef.current = index;
    setDisplayedIndex(index);

    if (overrideTimeoutRef.current !== null) {
      clearTimeout(overrideTimeoutRef.current);
    }

    overrideTimeoutRef.current = setTimeout(() => {
      manualOverrideRef.current = null;
      overrideTimeoutRef.current = null;
    }, 1800);
  }

  return (
    <section ref={sectionRef} className="bg-[#f6f2ea] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 flex flex-col gap-8 border-b border-black/8 pb-10 min-[900px]:mb-[4.5rem] min-[900px]:flex-row min-[900px]:items-end min-[900px]:justify-between">
          <div className="max-w-3xl">
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.34em] text-accent-gold">
              What We Do
            </p>
            <h2 className="font-heading text-[2.7rem] leading-[0.98] tracking-tight text-brand-dark md:text-[4rem]">
              High-End Home Services
              <br />
              <span className="italic text-accent-gold">Built for Los Angeles</span>
            </h2>
          </div>

          <Link
            href="/services"
            className="group inline-flex items-center gap-3 self-start text-[11px] font-semibold uppercase tracking-[0.28em] text-black/45 transition-colors hover:text-accent-gold"
          >
            <span>All Services</span>
            <ArrowUpRight
              size={18}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        <div className="grid gap-10 min-[900px]:grid-cols-[minmax(0,1fr)_minmax(360px,0.92fr)] min-[900px]:gap-14">
          <div className="border-t border-black/12">
            {services.map((service, index) => {
              const isActive = displayedIndex === index;

                return (
                  <div
                    key={service.id}
                    ref={(node) => {
                      rowRefs.current[index] = node;
                    }}
                    className="border-b border-black/12"
                  >
                  <button
                    type="button"
                    onClick={() => activateService(index)}
                    className="w-full text-left"
                  >
                    <div className="flex w-full items-start gap-4 py-8 md:gap-6 md:py-11">
                      <div
                        className={`w-12 shrink-0 pt-1 font-heading text-[1.7rem] leading-none transition-colors duration-500 md:w-16 md:text-[2rem] ${
                          isActive ? "text-[#c9a227]" : "text-black/24"
                        }`}
                      >
                        {service.id}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div
                          className={`font-heading text-[1.95rem] leading-[1.04] tracking-tight transition-colors duration-500 md:text-[2.1rem] ${
                            isActive ? "text-[#c9a227]" : "text-brand-dark"
                          }`}
                        >
                          {service.title}
                        </div>
                      </div>

                      <div
                        className={`mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
                          isActive
                            ? "border-[#c9a227] bg-[#c9a227] text-brand-dark"
                            : "border-black/15 bg-transparent text-brand-dark"
                        }`}
                      >
                        <ArrowUpRight
                          size={18}
                          className={`transition-transform duration-500 ${
                            isActive ? "rotate-45" : "rotate-0"
                          }`}
                        />
                      </div>
                    </div>
                  </button>

                  <div
                    className={`overflow-hidden transition-[max-height,opacity,padding-bottom] duration-500 ease-out ${
                      isActive
                        ? "max-h-[560px] opacity-100 pb-8 md:pb-12"
                        : "max-h-0 opacity-0 pb-0"
                    }`}
                  >
                    <div className="pr-1 pl-16 md:pl-[5.5rem]">
                      <p className="max-w-2xl text-[0.98rem] leading-7 text-black/62 md:text-[1rem]">
                        {service.description}
                      </p>

                      <div className="mt-5 min-[900px]:hidden">
                        <div className="relative overflow-hidden rounded-lg">
                          <img
                            src={service.image}
                            alt={service.title}
                            className={`h-[260px] w-full object-cover transition-all duration-500 ${
                              isActive ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"
                            }`}
                          />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/38 via-black/8 to-transparent" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="hidden min-[900px]:block">
            <div className="sticky top-20">
              <div className="relative h-[calc(100vh-160px)] max-h-[700px] overflow-hidden rounded-[8px]">
                {services.map((service, index) => {
                  const isActive = displayedIndex === index;

                  return (
                    <img
                      key={service.id}
                      src={service.image}
                      alt={service.title}
                      className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[600ms] ease-out ${
                        isActive ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"
                      }`}
                    />
                  );
                })}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

                <div
                  key={services[displayedIndex].id}
                  className="absolute bottom-5 left-5 inline-flex items-center gap-3 rounded-full border border-[#c9a227]/70 bg-[rgba(15,15,15,0.82)] px-4 py-3 text-[#c9a227] shadow-[0_12px_28px_rgba(0,0,0,0.22)]"
                  style={{ animation: "service-pill-fade 300ms ease-out 200ms both" }}
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c9a227]/55"></span>
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#c9a227]"></span>
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.24em]">
                    {services[displayedIndex].slug}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
