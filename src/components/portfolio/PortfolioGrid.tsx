"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { projects, projectCategories } from "@/lib/data/projects";
import Container from "@/components/ui/Container";

export default function PortfolioGrid() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  return (
    <section className="py-24 md:py-32">
      <Container>
        {/* Filter Bar */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {projectCategories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveFilter(cat.value)}
              className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                activeFilter === cat.value
                  ? "bg-brand-dark text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <motion.div
          layout
          className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.slug}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="break-inside-avoid"
              >
                <Link
                  href={`/our-work/${project.slug}`}
                  className="group block relative rounded-2xl overflow-hidden bg-gray-100"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden">
                    <Image
                      src={project.heroImage}
                      alt={project.title}
                      width={800}
                      height={600}
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-brand-dark/0 group-hover:bg-brand-dark/60 transition-all duration-500 flex items-end">
                      <div className="p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <p className="text-white font-bold text-xl">
                          {project.title}
                        </p>
                        <p className="text-white/70 text-sm mt-1">
                          {project.neighborhood}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold text-brand-dark group-hover:text-accent-gold transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {project.neighborhood}
                        </p>
                      </div>
                      <span className="shrink-0 px-3 py-1.5 bg-accent-gold/10 text-accent-gold text-xs font-bold rounded-full uppercase tracking-wide">
                        {
                          projectCategories.find(
                            (c) => c.value === project.category
                          )?.label
                        }
                      </span>
                    </div>

                    {project.specs && (
                      <div className="flex gap-4 mt-4 text-xs text-gray-400 font-medium">
                        {project.specs.sqft && (
                          <span>{project.specs.sqft} sq ft</span>
                        )}
                        {project.specs.timeline && (
                          <span>{project.specs.timeline}</span>
                        )}
                        {project.specs.value && (
                          <span>{project.specs.value}</span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-24">
            <p className="text-gray-400 text-lg font-medium">
              No projects found in this category.
            </p>
          </div>
        )}
      </Container>
    </section>
  );
}
