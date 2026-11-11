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
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Silky smooth organic momentum
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
      infinite: false,
      autoResize: true,
    });
    lenisRef.current = lenis;

    // Expose lenis instance globally for debugging or external programmatic scroll
    if (typeof window !== "undefined") {
      (window as unknown as { lenis: Lenis | null }).lenis = lenis;
    }

    // Attach ResizeObserver to document.body so any dynamic DOM mutations
    // (Next.js route changes, accordions, tabs, CMS loads, image paints)
    // immediately inform Lenis to recalculate height and scroll limits
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && document.body) {
      resizeObserver = new ResizeObserver(() => {
        lenis.resize();
      });
      resizeObserver.observe(document.body);
    }

    let animationFrameId: number;

    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver?.disconnect();
      lenis.destroy();
      lenisRef.current = null;
      if (typeof window !== "undefined") {
        (window as unknown as { lenis: Lenis | null }).lenis = null;
      }
    };
  }, []);

  // INSTANT RESET & MULTI-STAGE RESIZE ON ROUTE CHANGE
  // Prevents Lenis from retaining previous page height limits or freezing during Next.js page transitions
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;

    if (typeof window !== "undefined" && window.location.hash) {
      // If navigation targeted an anchor (e.g. /solutions#facility-solutions or /platform#workflow)
      const hash = window.location.hash;
      const anchorTimer = setTimeout(() => {
        const target = document.querySelector(hash);
        if (target && lenisRef.current) {
          lenisRef.current.scrollTo(target as HTMLElement, { offset: -90, duration: 1.2 });
        }
      }, 100);
      return () => clearTimeout(anchorTimer);
    } else {
      // Scroll to top immediately via Lenis (avoids conflicting browser native scroll events)
      lenis.scrollTo(0, { immediate: true });
    }

    // Multi-stage resize to accommodate Next.js App Router asynchronous rendering and hydration
    lenis.resize();
    const t1 = setTimeout(() => lenisRef.current?.resize(), 60);
    const t2 = setTimeout(() => lenisRef.current?.resize(), 180);
    const t3 = setTimeout(() => lenisRef.current?.resize(), 350);
    const t4 = setTimeout(() => lenisRef.current?.resize(), 700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [pathname]);

  return <>{children}</>;
}
