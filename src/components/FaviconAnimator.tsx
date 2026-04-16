"use client";

import { useEffect } from "react";

const SIZE = 64;
const CADENCE_MS = 10000;
const ANIMATION_MS = 1200;

function ensureFaviconLink(): HTMLLinkElement | null {
  if (typeof document === "undefined") return null;

  let link = document.querySelector('link[data-econstruct-favicon="true"]') as HTMLLinkElement | null;
  if (link) return link;

  link = document.createElement("link");
  link.rel = "icon";
  link.type = "image/png";
  link.setAttribute("data-econstruct-favicon", "true");
  document.head.appendChild(link);
  return link;
}

export default function FaviconAnimator() {
  useEffect(() => {
    const link = ensureFaviconLink();
    if (!link) return;

    const canvas = document.createElement("canvas");
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const background = new Image();
    const letter = new Image();

    let rafId = 0;
    let intervalId = 0;
    let disposed = false;

    const draw = (rotationDeg: number) => {
      ctx.clearRect(0, 0, SIZE, SIZE);
      ctx.drawImage(background, 0, 0, SIZE, SIZE);

      const letterSize = SIZE * 0.42;
      ctx.save();
      ctx.translate(SIZE / 2, SIZE / 2);
      ctx.rotate((rotationDeg * Math.PI) / 180);
      ctx.drawImage(letter, -letterSize / 2, -letterSize / 2, letterSize, letterSize);
      ctx.restore();

      link.href = canvas.toDataURL("image/png");
    };

    const animateSpin = () => {
      const startedAt = performance.now();

      const step = (now: number) => {
        if (disposed) return;
        const elapsed = now - startedAt;
        const progress = Math.min(elapsed / ANIMATION_MS, 1);
        draw(progress * 360);

        if (progress < 1) {
          rafId = window.requestAnimationFrame(step);
        } else {
          draw(0);
        }
      };

      rafId = window.requestAnimationFrame(step);
    };

    const onReady = () => {
      if (disposed) return;
      draw(0);
      intervalId = window.setInterval(animateSpin, CADENCE_MS);
    };

    let loaded = 0;
    const markLoaded = () => {
      loaded += 1;
      if (loaded === 2) onReady();
    };

    background.onload = markLoaded;
    letter.onload = markLoaded;
    background.src = "/econstruct_red_square.png";
    letter.src = "/econstruct_e_white.png";

    return () => {
      disposed = true;
      if (rafId) window.cancelAnimationFrame(rafId);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, []);

  return null;
}
