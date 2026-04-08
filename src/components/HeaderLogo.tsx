"use client";

import { useEffect, useState } from "react";
import Logo from "@/components/Logo";

const FINAL_ROTATION_DEG = -9;

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
  const [eRotation, setERotation] = useState(0);

  useEffect(() => {
    if (!shouldAnimateOnLoad()) {
      return;
    }

    const animationFrame = window.requestAnimationFrame(() => {
      setERotation(FINAL_ROTATION_DEG);
    });

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <Logo
      height={height}
      tone="dark"
      glow="subtle"
      className={className}
      eRotation={eRotation}
      animateE
    />
  );
}
