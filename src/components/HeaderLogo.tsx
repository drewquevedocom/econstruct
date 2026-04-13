"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";

const FINAL_ROTATION_DEG = -9;
const INTRO_DELAY_MS = 3500;
const ROTATION_MS = 1100;
const GLOW_MS = 1700;

function shouldAnimateOnLoad(): boolean {
  try {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    return !prefersReducedMotion;
  } catch {
    return false;
  }
}

interface HeaderLogoProps {
  height?: number;
  className?: string;
}

export default function HeaderLogo({
  height = 38,
  className = "",
}: HeaderLogoProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [eRotation, setERotation] = useState(isHome ? 0 : FINAL_ROTATION_DEG);
  const [showGlow, setShowGlow] = useState(false);

  useEffect(() => {
    if (!isHome) {
      return;
    }

    if (!shouldAnimateOnLoad()) {
      const settleTimer = window.setTimeout(() => {
        setERotation(FINAL_ROTATION_DEG);
        setShowGlow(false);
      }, 0);

      return () => {
        window.clearTimeout(settleTimer);
      };
    }

    const rotationTimer = window.setTimeout(() => {
      setERotation(FINAL_ROTATION_DEG);
    }, INTRO_DELAY_MS);

    const glowTimer = window.setTimeout(() => {
      setShowGlow(true);
    }, INTRO_DELAY_MS + ROTATION_MS + 150);

    const glowResetTimer = window.setTimeout(() => {
      setShowGlow(false);
    }, INTRO_DELAY_MS + ROTATION_MS + GLOW_MS);

    return () => {
      window.clearTimeout(rotationTimer);
      window.clearTimeout(glowTimer);
      window.clearTimeout(glowResetTimer);
    };
  }, [isHome]);

  return (
    <Logo
      height={height}
      tone="dark"
      glow={showGlow ? "burst" : "none"}
      className={className}
      eRotation={eRotation}
    />
  );
}
