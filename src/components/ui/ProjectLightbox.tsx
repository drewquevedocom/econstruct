"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface LightboxImage {
  src: string;
  alt: string;
  caption?: string;
}

interface ProjectLightboxProps {
  images: LightboxImage[];
}

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 80 : -80,
    opacity: 0,
    scale: 0.97,
  }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({
    x: dir > 0 ? -80 : 80,
    opacity: 0,
    scale: 0.97,
  }),
};

export default function ProjectLightbox({ images }: ProjectLightboxProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const thumbsRef = useRef<HTMLDivElement>(null);

  const openAt = useCallback((i: number) => {
    setIndex(i);
    setDirection(0);
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  const navigate = useCallback(
    (dir: number) => {
      setDirection(dir);
      setIndex((prev) => {
        const next = prev + dir;
        if (next < 0) return images.length - 1;
        if (next >= images.length) return 0;
        return next;
      });
    },
    [images.length]
  );

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "ArrowRight") navigate(1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, close, navigate]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open || !thumbsRef.current) return;
    const thumb = thumbsRef.current.children[index] as HTMLElement;
    thumb?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [index, open]);

  return (
    <>
      {/* ── Gallery grid ── */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, i) => (
          <motion.button
            key={image.src}
            onClick={() => openAt(i)}
            className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm cursor-zoom-in text-left w-full"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: Math.min(i * 0.06, 0.36) }}
          >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.src}
                alt={image.alt}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                loading="lazy"
                decoding="async"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {/* Zoom icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
                  <ZoomIn className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>
              </div>
              {/* Counter pill */}
              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold tracking-[0.15em] px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {i + 1}&nbsp;/&nbsp;{images.length}
              </div>
            </div>

            {/* Caption */}
            {image.caption && (
              <div className="p-5 border-t border-gray-100/80">
                <p className="text-sm leading-relaxed text-gray-500">{image.caption}</p>
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {/* ── Lightbox overlay ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[300] flex flex-col select-none"
            style={{ backgroundColor: "rgba(5, 5, 7, 0.96)", backdropFilter: "blur(2px)" }}
            onClick={close}
          >
            {/* Top bar */}
            <div
              className="flex items-center justify-between px-5 md:px-8 py-5 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Counter */}
              <div className="font-mono text-sm tracking-[0.2em]">
                <span style={{ color: "#B8963E" }} className="font-bold text-base">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-white/30 mx-2">·</span>
                <span className="text-white/40">{String(images.length).padStart(2, "0")}</span>
              </div>

              {/* Close */}
              <button
                onClick={close}
                className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all duration-200"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Main stage */}
            <div
              className="flex-1 relative flex items-center justify-center px-14 md:px-20 min-h-0"
              onClick={close}
            >
              {/* Prev */}
              <button
                onClick={(e) => { e.stopPropagation(); navigate(-1); }}
                className="absolute left-2 md:left-5 z-10 w-11 h-11 rounded-full border border-white/12 bg-white/4 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white hover:bg-white/12 hover:border-white/25 transition-all duration-200 group"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 transition-transform duration-150 group-hover:-translate-x-0.5" />
              </button>

              {/* Animated image */}
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={index}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center justify-center max-h-full max-w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={images[index].src}
                    alt={images[index].alt}
                    className="max-h-[calc(100vh-260px)] max-w-full object-contain rounded-xl shadow-[0_32px_80px_rgba(0,0,0,0.7)]"
                    draggable={false}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Next */}
              <button
                onClick={(e) => { e.stopPropagation(); navigate(1); }}
                className="absolute right-2 md:right-5 z-10 w-11 h-11 rounded-full border border-white/12 bg-white/4 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white hover:bg-white/12 hover:border-white/25 transition-all duration-200 group"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 transition-transform duration-150 group-hover:translate-x-0.5" />
              </button>
            </div>

            {/* Caption */}
            <div
              className="px-6 pt-3 pb-2 text-center shrink-0 min-h-[3.5rem] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="text-white/50 text-sm max-w-xl mx-auto leading-relaxed"
                >
                  {images[index].caption ?? ""}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Thumbnail strip */}
            <div
              className="px-4 pb-5 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                ref={thumbsRef}
                className="flex gap-2 overflow-x-auto justify-center"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {images.map((img, i) => (
                  <button
                    key={img.src}
                    onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
                    className="shrink-0 relative overflow-hidden transition-all duration-200"
                    style={{
                      width: 60,
                      height: 45,
                      borderRadius: 8,
                      outline: i === index ? "2px solid #B8963E" : "2px solid transparent",
                      outlineOffset: 2,
                      opacity: i === index ? 1 : 0.38,
                      transform: i === index ? "scale(1.08)" : "scale(1)",
                    }}
                    aria-label={`View image ${i + 1}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
