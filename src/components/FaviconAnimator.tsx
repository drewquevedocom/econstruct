"use client";

import { useEffect } from "react";

const SIZE = 64;
const SPIN_INTERVAL_MS = 12000;
const SPIN_DURATION_MS = 1800;
const IDLE_ROTATION_DEG = 0;
const FULL_ROTATION_DEG = 360;

function ensureAnimatedLinks(): HTMLLinkElement[] {
  const head = document.head;
  const targets = [
    { rel: "icon", type: "image/png" },
    { rel: "shortcut icon", type: "image/png" },
  ];

  return targets.map(({ rel, type }) => {
    let link = document.querySelector(
      `link[data-econstruct-favicon="${rel}"]`,
    ) as HTMLLinkElement | null;

    if (!link) {
      link = document.createElement("link");
      link.rel = rel;
      link.type = type;
      link.setAttribute("data-econstruct-favicon", rel);
      head.appendChild(link);
    }

    return link;
  });
}

function drawRoundedSquare(
  ctx: CanvasRenderingContext2D,
  size: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(size - radius, 0);
  ctx.quadraticCurveTo(size, 0, size, radius);
  ctx.lineTo(size, size - radius);
  ctx.quadraticCurveTo(size, size, size - radius, size);
  ctx.lineTo(radius, size);
  ctx.quadraticCurveTo(0, size, 0, size - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();
}

function easeInOutCubic(progress: number) {
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
}

export default function FaviconAnimator() {
  useEffect(() => {
    const links = ensureAnimatedLinks();
    if (links.length === 0) return;

    const canvas = document.createElement("canvas");
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId = 0;
    let disposed = false;
    let startedAt = 0;

    const updateHref = () => {
      const href = canvas.toDataURL("image/png");
      links.forEach((link) => {
        link.href = href;
      });
    };

    const draw = (rotationDeg: number) => {
      ctx.clearRect(0, 0, SIZE, SIZE);

      const gradient = ctx.createLinearGradient(0, 0, SIZE, SIZE);
      gradient.addColorStop(0, "#D61F3A");
      gradient.addColorStop(0.5, "#C8102E");
      gradient.addColorStop(1, "#8E0A1D");

      drawRoundedSquare(ctx, SIZE, 14);
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      ctx.stroke();

      ctx.save();
      ctx.translate(SIZE / 2, SIZE / 2);
      ctx.rotate((rotationDeg * Math.PI) / 180);
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "900 34px Arial";
      ctx.fillText("E", 0, 2);
      ctx.restore();

      updateHref();
    };

    const step = (now: number) => {
      if (disposed) return;
      const elapsed = now - startedAt;
      const cycleElapsed = elapsed % SPIN_INTERVAL_MS;
      const spinProgress = Math.min(cycleElapsed / SPIN_DURATION_MS, 1);
      const eased = easeInOutCubic(spinProgress);
      const rotation =
        cycleElapsed <= SPIN_DURATION_MS
          ? IDLE_ROTATION_DEG + eased * FULL_ROTATION_DEG
          : IDLE_ROTATION_DEG;

      draw(rotation);
      rafId = window.requestAnimationFrame(step);
    };

    startedAt = performance.now();
    draw(0);
    rafId = window.requestAnimationFrame(step);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}
