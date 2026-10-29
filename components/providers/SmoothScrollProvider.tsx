"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    // Option 1: Fluid Lerp (Apple / Linear.app style - butter smooth, continuous & natural glide)
    const lenis = new Lenis({
      lerp: 0.1, // Golden standard lerp: interpolasi 10% per frame, luncuran terasa licin seperti sutra tanpa sentakan awal
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0, // Respon 1:1 natural terhadap roda mouse
      touchMultiplier: 1,
      syncTouch: false,
      infinite: false,  
    });

    let animationFrameId: number;

    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
