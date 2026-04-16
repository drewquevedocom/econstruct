"use client";

import { useEffect } from "react";

const SIZE = 64;
const SPIN_INTERVAL_MS = 12000;
const SPIN_DURATION_MS = 1800;
const FULL_ROTATION_DEG = 360;
const MARK_SIZE = SIZE * 0.65;

function ensureAnimatedLinks(): HTMLLinkElement[] {
  const head = document.head;
  const existing = Array.from(
    document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]'),
  ) as HTMLLinkElement[];
  const targets: HTMLLinkElement[] = existing.length ? existing : [];

  if (!targets.some((link) => link.rel === "icon")) {
    const iconLink = document.createElement("link");
    iconLink.rel = "icon";
    head.appendChild(iconLink);
    targets.push(iconLink);
  }

  if (!targets.some((link) => link.rel === "shortcut icon")) {
    const shortcutLink = document.createElement("link");
    shortcutLink.rel = "shortcut icon";
    head.appendChild(shortcutLink);
    targets.push(shortcutLink);
  }

  return targets;
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
    let ready = false;

    const background = new Image();
    const mark = new Image();
    let loaded = 0;

    const updateHref = () => {
      const href = canvas.toDataURL("image/png");
      links.forEach((link) => {
        link.href = href;
        link.type = "image/png";
        link.sizes = "64x64";
      });
    };

    const draw = (rotationDeg: number) => {
      ctx.clearRect(0, 0, SIZE, SIZE);
      ctx.drawImage(background, 0, 0, SIZE, SIZE);

      ctx.save();
      ctx.translate(SIZE / 2, SIZE / 2);
      ctx.rotate((rotationDeg * Math.PI) / 180);
      ctx.drawImage(mark, -MARK_SIZE / 2, -MARK_SIZE / 2, MARK_SIZE, MARK_SIZE);
      ctx.restore();

      updateHref();
    };

    const step = (now: number) => {
      if (disposed) return;
      if (!ready) {
        rafId = window.requestAnimationFrame(step);
        return;
      }

      const elapsed = now - startedAt;
      const cycleElapsed = elapsed % SPIN_INTERVAL_MS;
      const spinProgress = Math.min(cycleElapsed / SPIN_DURATION_MS, 1);
      const eased = easeInOutCubic(spinProgress);
      const rotation = cycleElapsed <= SPIN_DURATION_MS ? eased * FULL_ROTATION_DEG : 0;

      draw(rotation);
      rafId = window.requestAnimationFrame(step);
    };

    const onAssetLoad = () => {
      loaded += 1;
      if (loaded === 2) {
        ready = true;
        draw(0);
      }
    };

    background.onload = onAssetLoad;
    mark.onload = onAssetLoad;
    background.src = "/econstruct_red_square.png";
    mark.src = "/econstruct_e_white.png";

    startedAt = performance.now();
    rafId = window.requestAnimationFrame(step);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}
