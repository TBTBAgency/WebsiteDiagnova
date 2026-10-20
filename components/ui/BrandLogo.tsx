import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  variant?: "dark" | "light";
  className?: string;
  showTagline?: boolean;
}

export function BrandLogo({
  variant = "dark",
  className,
  showTagline = false,
}: BrandLogoProps) {
  const isLight = variant === "light";

  return (
    <Link
      href="/"
      className={cn(
        "group flex items-center gap-2.5 transition-opacity hover:opacity-95 select-none",
        className
      )}
    >
      {/* SVG Icon: 3 Helix vertical-diagonal nodes symbol from Figma */}
      <div className="relative flex h-8 w-8 items-center justify-center shrink-0">
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7 transition-transform duration-300 group-hover:scale-105"
        >
          {/* Node columns */}
          <rect
            x="4"
            y="7"
            width="3.5"
            height="18"
            rx="1.75"
            fill={isLight ? "#97CFEE" : "#345DAB"}
          />
          <rect
            x="14.25"
            y="4"
            width="3.5"
            height="24"
            rx="1.75"
            fill={isLight ? "#CAE2F1" : "#56ADE2"}
          />
          <rect
            x="24.5"
            y="7"
            width="3.5"
            height="18"
            rx="1.75"
            fill={isLight ? "#FFFFFF" : "#0E234B"}
          />
          {/* Cross connecting bonds */}
          <path
            d="M7.5 11L14.25 15M17.75 15L24.5 19M7.5 21L14.25 17M17.75 17L24.5 13"
            stroke={isLight ? "#FFFFFF" : "#345DAB"}
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeOpacity={isLight ? "0.85" : "0.7"}
          />
        </svg>
      </div>

      <div className="flex flex-col">
        <span
          className={cn(
            "font-display text-lg font-extrabold tracking-wider leading-none",
            isLight ? "text-white" : "text-[#0E234B]"
          )}
        >
          DIAGNOVA
        </span>
        {showTagline && (
          <span
            className={cn(
              "text-[8.5px] font-semibold uppercase tracking-widest mt-0.5",
              isLight ? "text-slate-200" : "text-diagnova-blue"
            )}
          >
            Laboratory Intelligence
          </span>
        )}
      </div>
    </Link>
  );
}
