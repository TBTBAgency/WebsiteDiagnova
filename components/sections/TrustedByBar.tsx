import React from "react";
import Image from "next/image";

// Repeat trust logos to create an infinite, seamless scrolling marquee loop
const logos = Array.from({ length: 8 });

export function TrustedByBar() {
  return (
    <section className="relative w-full bg-white pt-6 sm:pt-7 pb-9 sm:pb-11 overflow-hidden border-b border-slate-100">
      <style>{`
        @keyframes marqueeTrust {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee-trust {
          display: flex;
          width: max-content;
          animation: marqueeTrust 28s linear infinite;
        }
        .animate-marquee-trust:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Centered Heading Label */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center mb-6 sm:mb-7">
        <p className="text-xs sm:text-[13px] font-bold tracking-wider uppercase text-slate-500">
          DIPERCAYA OLEH
        </p>
      </div>

      {/* Marquee Container with Left & Right Soft Fade Masks (Contained Max Width) */}
      <div className="relative mx-auto max-w-5xl sm:max-w-6xl px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Left Fade Gradient Mask */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 sm:w-28 md:w-36 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />

        {/* Right Fade Gradient Mask */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 sm:w-28 md:w-36 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

        {/* Scrolling Track with duplicated items for infinite seamless scroll */}
        <div className="animate-marquee-trust flex items-center gap-10 sm:gap-14 md:gap-18">
          {[...logos, ...logos].map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-center shrink-0 grayscale opacity-85 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            >
              <Image
                src="/images/trust-logo.svg"
                alt="Partner Trust Logo"
                width={220}
                height={64}
                className="h-11 sm:h-12 md:h-14 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
