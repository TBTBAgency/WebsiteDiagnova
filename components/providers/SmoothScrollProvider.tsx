"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    const lenis = new Lenis({
      lerp: 0.12, // Responsive & responsive smooth glide
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.0,
      syncTouch: false,
      infinite: false,
    });
    lenisRef.current = lenis;

    let animationFrameId: number;

    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // INSTANT RESET ON ROUTE CHANGE: Prevents Lenis from freezing or fighting Next.js page transitions
  useEffect(() => {
    if (lenisRef.current) {
      if (typeof window !== "undefined" && window.location.hash) {
        // If navigation targeted an anchor (e.g. /platform#workflow), smoothly scroll to that anchor
        const hash = window.location.hash;
        setTimeout(() => {
          const target = document.querySelector(hash);
          if (target && lenisRef.current) {
            lenisRef.current.scrollTo(target as HTMLElement, { offset: -90, immediate: false });
          }
        }, 80);
      } else {
        // Immediate 0ms scroll-to-top on new page load
        lenisRef.current.scrollTo(0, { immediate: true });
        window.scrollTo(0, 0);
      }
    }
  }, [pathname]);

  return <>{children}</>;
}
