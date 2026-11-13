"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollRevealProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const main = document.querySelector("main");
    if (!main) return;

    const sections = Array.from(main.querySelectorAll("section"));
    const targets: HTMLElement[] = [];

    sections.forEach((section, sectionIdx) => {
      // Skip the top hero section (handled by Hero / PageHero entrance)
      if (sectionIdx === 0) return;

      // Skip sections that use sticky scroll tracks (transform on ancestors breaks sticky)
      const hasSticky = section.querySelector(".sticky, [class*='sticky']");
      if (hasSticky || section.hasAttribute("data-no-reveal")) return;

      // 1. Reveal section header block (first direct heading container inside max-w wrapper)
      const headerHeading = section.querySelector("h2");
      const headerWrapper = headerHeading?.parentElement;
      if (headerWrapper && !headerWrapper.classList.contains("grid")) {
        headerWrapper.style.setProperty("--ll-delay", "0ms");
        headerWrapper.classList.add("ll-reveal");
        targets.push(headerWrapper);
      }

      // 2. Stagger reveal grid cards & bento items
      const grids = Array.from(section.querySelectorAll(".grid"));
      grids.forEach((grid) => {
        // Avoid double-animating nested grids inside already-targeted cards
        if (grid.closest(".ll-reveal")) return;

        const children = Array.from(grid.children) as HTMLElement[];
        children.forEach((child, idx) => {
          // Skip tiny decorative sub-grids
          if (child.offsetHeight < 48) return;
          const delay = Math.min(idx * 75, 300);
          child.style.setProperty("--ll-delay", `${delay}ms`);
          child.classList.add("ll-reveal");
          targets.push(child);
        });
      });
    });

    if (targets.length === 0) return;

    const revealElement = (el: HTMLElement) => {
      el.setAttribute("data-revealed", "true");
    };

    // Immediately reveal elements already visible or above the viewport
    const viewportCutoff = window.innerHeight * 0.96;
    const pending: HTMLElement[] = [];

    targets.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top <= viewportCutoff) {
        requestAnimationFrame(() => revealElement(el));
      } else {
        pending.push(el);
      }
    });

    if (pending.length === 0 || typeof IntersectionObserver === "undefined") {
      pending.forEach(revealElement);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealElement(entry.target as HTMLElement);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.06,
        rootMargin: "0px 0px -36px 0px",
      }
    );

    pending.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [pathname]);

  return <>{children}</>;
}
