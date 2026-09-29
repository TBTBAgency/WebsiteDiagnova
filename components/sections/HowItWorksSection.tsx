"use client";

import React, { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SectionBadge } from "@/components/ui/SectionBadge";

// Register ScrollTrigger plugin safely
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface WorkflowStep {
  number: string;
  title: string;
  description: string;
  desktopPosition: string;
  floatOffset: number;
  floatDuration: number;
}

const workflowCards: WorkflowStep[] = [
  {
    number: "01",
    title: "Smart Reception & Labeling",
    description:
      "Penerimaan sampel & barcode 2D unik yang otomatis sinkron dengan order SIMRS/HIS.",
    desktopPosition: "lg:top-3 lg:left-0 xl:left-2",
    floatOffset: -4,
    floatDuration: 5.2,
  },
  {
    number: "02",
    title: "Auto-Verification",
    description:
      "Distribusi worklist otomatis ke analyzer dan validasi rule-based delta check cerdas.",
    desktopPosition: "lg:bottom-3 lg:left-6 xl:left-14",
    floatOffset: 4,
    floatDuration: 5.8,
  },
  {
    number: "03",
    title: "Early Detection & Data Checks",
    description:
      "Nova AI mendeteksi anomali pola dan nilai kritis seketika sebelum rilis hasil.",
    desktopPosition: "lg:bottom-3 lg:right-6 xl:right-14",
    floatOffset: -5,
    floatDuration: 6.2,
  },
  {
    number: "04",
    title: "Accurate Results Ready",
    description:
      "Hasil analisis tervalidasi seketika terdistribusi ke RME dokter & portal pasien.",
    desktopPosition: "lg:top-3 lg:right-0 xl:right-2",
    floatOffset: 3,
    floatDuration: 4.8,
  },
];

export function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headerBadgeRef = useRef<HTMLDivElement | null>(null);
  const headerTitleRef = useRef<HTMLHeadingElement | null>(null);
  const headerDescRef = useRef<HTMLParagraphElement | null>(null);
  const dnaWrapperRef = useRef<HTMLDivElement | null>(null);
  const dnaStrandRef = useRef<HTMLDivElement | null>(null);
  const dnaGlowRef = useRef<HTMLDivElement | null>(null);
  const cardsContainerRef = useRef<HTMLDivElement | null>(null);
  const desktopCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const mobileCardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      // Check if user prefers reduced motion
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        // Ensure static elements are fully visible without animation
        gsap.set(
          [
            headerBadgeRef.current,
            headerTitleRef.current,
            headerDescRef.current,
            desktopCardsRef.current,
            mobileCardsRef.current,
          ],
          { opacity: 1, y: 0, scale: 1 }
        );
        return;
      }

      /* -------------------------------------------------------------
       * 1. SECTION ENTRANCE (ScrollTrigger - Runs Once)
       * ----------------------------------------------------------- */
      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });

      // Heading & Badge
      entranceTl
        .fromTo(
          [headerBadgeRef.current, headerTitleRef.current],
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            stagger: 0.1,
          }
        )
        // Supporting context description
        .fromTo(
          headerDescRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.6"
        )
        // Desktop Workflow Cards Stagger
        .fromTo(
          desktopCardsRef.current.filter(Boolean),
          { opacity: 0, y: 35, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.14,
            ease: "power3.out",
            onComplete: () => {
              // Start individual subtle floating once entrance finishes
              desktopCardsRef.current.forEach((card, index) => {
                if (!card) return;
                const config = workflowCards[index] || {
                  floatOffset: 3,
                  floatDuration: 5,
                };
                gsap.to(card, {
                  y: config.floatOffset,
                  duration: config.floatDuration,
                  repeat: -1,
                  yoyo: true,
                  ease: "sine.inOut",
                });
              });
            },
          },
          "-=0.5"
        )
        // Mobile Workflow Cards Stagger
        .fromTo(
          mobileCardsRef.current.filter(Boolean),
          { opacity: 0, y: 25, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
            stagger: 0.12,
            ease: "power3.out",
          },
          "-=0.7"
        );

      /* -------------------------------------------------------------
       * 2. DNA ORGANIC LIVING FLOAT (Multi-axis Organic Loop)
       * ----------------------------------------------------------- */
      if (dnaStrandRef.current) {
        const dnaTl = gsap.timeline({ repeat: -1, yoyo: true });
        dnaTl
          .to(dnaStrandRef.current, {
            y: -14,
            x: 7,
            rotation: 1,
            scale: 1.012,
            duration: 10,
            ease: "sine.inOut",
          })
          .to(dnaStrandRef.current, {
            y: 9,
            x: -6,
            rotation: -0.8,
            scale: 0.996,
            duration: 11,
            ease: "sine.inOut",
          });
      }

      /* -------------------------------------------------------------
       * 3. DNA BREATHING & AMBIENT GLOW
       * ----------------------------------------------------------- */
      if (dnaGlowRef.current) {
        gsap.to(dnaGlowRef.current, {
          opacity: 0.55,
          scale: 1.025,
          duration: 7.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      /* -------------------------------------------------------------
       * 4. DNA SCROLL PARALLAX (Subtle Depth Effect)
       * ----------------------------------------------------------- */
      if (dnaWrapperRef.current && sectionRef.current) {
        gsap.to(dnaWrapperRef.current, {
          yPercent: 7,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      }

      /* -------------------------------------------------------------
       * 5. DESKTOP MOUSE MICRO-PARALLAX (Pointer Move)
       * ----------------------------------------------------------- */
      const sectionEl = sectionRef.current;
      if (
        sectionEl &&
        window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches
      ) {
        const dnaXTo = dnaStrandRef.current
          ? gsap.quickTo(dnaStrandRef.current, "x", {
              duration: 0.8,
              ease: "power3.out",
            })
          : null;
        const dnaYTo = dnaStrandRef.current
          ? gsap.quickTo(dnaStrandRef.current, "y", {
              duration: 0.8,
              ease: "power3.out",
            })
          : null;

        const cardsXTo = cardsContainerRef.current
          ? gsap.quickTo(cardsContainerRef.current, "x", {
              duration: 0.9,
              ease: "power3.out",
            })
          : null;
        const cardsYTo = cardsContainerRef.current
          ? gsap.quickTo(cardsContainerRef.current, "y", {
              duration: 0.9,
              ease: "power3.out",
            })
          : null;

        const handlePointerMove = (e: PointerEvent) => {
          const rect = sectionEl.getBoundingClientRect();
          const relX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
          const relY = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5

          if (dnaXTo && dnaYTo) {
            dnaXTo(relX * 14);
            dnaYTo(relY * 10);
          }
          if (cardsXTo && cardsYTo) {
            cardsXTo(relX * -6);
            cardsYTo(relY * -4);
          }
        };

        const handlePointerLeave = () => {
          if (dnaXTo && dnaYTo) {
            dnaXTo(0);
            dnaYTo(0);
          }
          if (cardsXTo && cardsYTo) {
            cardsXTo(0);
            cardsYTo(0);
          }
        };

        sectionEl.addEventListener("pointermove", handlePointerMove);
        sectionEl.addEventListener("pointerleave", handlePointerLeave);

        return () => {
          sectionEl.removeEventListener("pointermove", handlePointerMove);
          sectionEl.removeEventListener("pointerleave", handlePointerLeave);
        };
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative w-full overflow-hidden bg-[linear-gradient(180deg,#1D4388_0%,#2960AC_22%,#3884CA_48%,#5BB5E4_72%,#BCE0F5_90%,#E8F4FC_100%)] py-20 lg:py-28 text-white select-none"
    >
      {/* 1. Ambient Scientific Atmosphere Background Glows */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-75"
        aria-hidden="true"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 50% 54%, rgba(255, 255, 255, 0.22) 0%, rgba(91, 181, 228, 0.18) 45%, transparent 75%),
            radial-gradient(circle at 18% 28%, rgba(255, 255, 255, 0.12) 0%, transparent 40%),
            radial-gradient(circle at 82% 32%, rgba(91, 181, 228, 0.16) 0%, transparent 45%)
          `,
        }}
      />

      {/* 2. FULL-BLEED / EDGE-TO-EDGE GIANT 3D BLUE DNA HELIX */}
      <div
        ref={dnaWrapperRef}
        className="pointer-events-none select-none absolute left-1/2 top-[56%] sm:top-[55%] lg:top-[54%] z-10 w-[195vw] sm:w-[160vw] md:w-[145vw] lg:w-[132vw] xl:w-[126vw] min-w-[1300px] max-w-none aspect-[2/1] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center will-change-transform"
        aria-hidden="true"
      >
        {/* Layer 2: Ambient Soft Cyan/Blue Glow Backdrop */}
        <div
          ref={dnaGlowRef}
          className="absolute inset-0 w-full h-full filter blur-3xl opacity-40 pointer-events-none will-change-transform"
        >
          <Image
            src="/images/dna-helix-3d.png"
            alt=""
            fill
            priority
            className="object-contain"
            sizes="135vw"
          />
        </div>

        {/* Layer 1: Giant Crisp 3D Blue DNA Helix Strand */}
        <div
          ref={dnaStrandRef}
          className="relative w-full h-full pointer-events-none will-change-transform"
        >
          <Image
            src="/images/dna-helix-3d.png"
            alt="Diagnova Full-Bleed 3D DNA Molecular Flow"
            fill
            priority
            className="object-contain drop-shadow-[0_20px_45px_rgba(10,35,80,0.35)]"
            sizes="135vw"
          />
        </div>
      </div>

      {/* 3. Foreground Content Container (Typography & Floating Glass Workflow Cards) */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Grid: Prominent Anchor Title & Supporting Context */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-16 lg:mb-20">
          <div className="space-y-3 max-w-xl">
            <div ref={headerBadgeRef}>
              <SectionBadge
                variant="dark"
                className="border-white/30 bg-white/15 text-white/95 text-[11px] font-semibold tracking-wider uppercase backdrop-blur-md shadow-sm"
              >
                How It Works
              </SectionBadge>
            </div>
            <h2
              ref={headerTitleRef}
              className="font-display text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-extrabold text-white tracking-tight leading-[1.12] drop-shadow-sm"
            >
              How Diagnova Guides a
              <br />
              Drop of Blood
            </h2>
          </div>

          <p
            ref={headerDescRef}
            className="text-sm sm:text-base text-white/85 max-w-md lg:text-right leading-relaxed font-normal drop-shadow-sm"
          >
            Bagaimana Diagnova mengawal setiap spesimen medis dari titik pengambilan hingga
            menjadi keputusan klinis dokter dalam hitungan menit.
          </p>
        </div>

        {/* Desktop Floating Workflow Cards Stage (Cards float elegantly over the full-bleed DNA) */}
        <div
          ref={cardsContainerRef}
          className="relative hidden lg:block min-h-[480px] xl:min-h-[520px] will-change-transform"
        >
          {workflowCards.map((card, idx) => (
            <div
              key={card.number}
              ref={(el) => {
                desktopCardsRef.current[idx] = el;
              }}
              className={`absolute ${card.desktopPosition} w-[285px] xl:w-[310px] pointer-events-auto rounded-xl border border-white/35 bg-white/[0.18] p-5 backdrop-blur-md shadow-[0_8px_28px_rgba(8,21,46,0.14)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.01] hover:bg-white/[0.24] hover:border-white/60 hover:shadow-[0_16px_36px_rgba(8,21,46,0.22)] group`}
            >
              {/* Card Header: Title & Step Number Badge */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <h4 className="font-display text-[15px] xl:text-base font-bold text-white tracking-tight leading-snug">
                  {card.title}
                </h4>
                <span className="shrink-0 font-mono text-xs font-bold text-sky-100 bg-white/20 border border-white/30 px-2.5 py-0.5 rounded-md shadow-inner">
                  {card.number}
                </span>
              </div>

              {/* Card Description */}
              <p className="text-xs xl:text-[13px] text-sky-50/90 leading-relaxed font-normal">
                {card.description}
              </p>

              {/* Subtle accent bar */}
              <div className="mt-3.5 h-0.5 w-7 rounded-full bg-white/35 group-hover:w-12 group-hover:bg-white transition-all duration-300 ease-out" />
            </div>
          ))}
        </div>

        {/* Mobile / Tablet Workflow Cards Grid (Clean Responsive Layout) */}
        <div className="relative z-20 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 lg:hidden">
          {workflowCards.map((card, idx) => (
            <div
              key={card.number}
              ref={(el) => {
                mobileCardsRef.current[idx] = el;
              }}
              className="rounded-xl border border-white/30 bg-white/[0.18] p-4 sm:p-5 backdrop-blur-md shadow-[0_6px_20px_rgba(8,21,46,0.12)]"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <h4 className="font-display text-sm font-bold text-white tracking-tight">
                  {card.title}
                </h4>
                <span className="shrink-0 font-mono text-xs font-bold text-sky-100 bg-white/25 border border-white/30 px-2 py-0.5 rounded-md">
                  {card.number}
                </span>
              </div>
              <p className="text-xs text-sky-50/90 leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
