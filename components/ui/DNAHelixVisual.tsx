import React from "react";
import { cn } from "@/lib/utils";

interface DNAHelixVisualProps {
  className?: string;
  variant?: "floating" | "centerpiece" | "compact";
}

export function DNAHelixVisual({
  className,
  variant = "floating",
}: DNAHelixVisualProps) {
  // A clean, futuristic medical DNA strand visual with gradient spheres and glowing connector rungs
  return (
    <div
      className={cn(
        "relative flex items-center justify-center select-none",
        variant === "centerpiece" && "w-full max-w-md py-6",
        variant === "compact" && "w-48 h-48",
        variant === "floating" && "w-72 h-80",
        className
      )}
    >
      {/* Background glow circle */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-diagnova-blue/20 via-nova-blue/25 to-transparent blur-2xl animate-pulse" />

      <svg
        viewBox="0 0 320 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 w-full h-full filter drop-shadow-xl"
      >
        <defs>
          <linearGradient id="dnaGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#56ADE2" />
            <stop offset="100%" stopColor="#345DAB" />
          </linearGradient>
          <linearGradient id="dnaGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#CAE2F1" />
            <stop offset="100%" stopColor="#56ADE2" />
          </linearGradient>
          <linearGradient id="connectorGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#56ADE2" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#CAE2F1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#345DAB" stopOpacity="0.8" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Dynamic Connected Base Pairs (Rungs) */}
        {[
          { y: 40, x1: 90, x2: 230, r1: 10, r2: 7 },
          { y: 80, x1: 120, x2: 200, r1: 8, r2: 9 },
          { y: 120, x1: 155, x2: 165, r1: 6, r2: 6 },
          { y: 160, x1: 195, x2: 125, r1: 9, r2: 8 },
          { y: 200, x1: 230, x2: 90, r1: 7, r2: 10 },
          { y: 240, x1: 195, x2: 125, r1: 8, r2: 8 },
          { y: 280, x1: 155, x2: 165, r1: 6, r2: 6 },
          { y: 320, x1: 120, x2: 200, r1: 9, r2: 8 },
          { y: 360, x1: 90, x2: 230, r1: 10, r2: 7 },
        ].map((rung, i) => (
          <g key={i} className="transition-all duration-700 hover:opacity-100">
            {/* Connector Rung Line */}
            <line
              x1={rung.x1}
              y1={rung.y}
              x2={rung.x2}
              y2={rung.y}
              stroke="url(#connectorGlow)"
              strokeWidth="3"
              strokeDasharray={i % 2 === 0 ? "none" : "4 2"}
            />
            {/* Left Node */}
            <circle
              cx={rung.x1}
              cy={rung.y}
              r={rung.r1}
              fill="url(#dnaGrad1)"
              filter="url(#glow)"
              className="animate-pulse"
              style={{ animationDelay: `${i * 150}ms` }}
            />
            <circle
              cx={rung.x1}
              cy={rung.y}
              r={rung.r1 * 0.4}
              fill="#FFFFFF"
            />
            {/* Right Node */}
            <circle
              cx={rung.x2}
              cy={rung.y}
              r={rung.r2}
              fill="url(#dnaGrad2)"
              filter="url(#glow)"
              className="animate-pulse"
              style={{ animationDelay: `${(i + 2) * 150}ms` }}
            />
            <circle
              cx={rung.x2}
              cy={rung.y}
              r={rung.r2 * 0.4}
              fill="#FFFFFF"
            />
          </g>
        ))}

        {/* Left Helix Strand Curve */}
        <path
          d="M 90 40 Q 140 120 160 120 T 230 200 T 160 280 T 90 360"
          stroke="url(#dnaGrad1)"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* Right Helix Strand Curve */}
        <path
          d="M 230 40 Q 180 120 160 120 T 90 200 T 160 280 T 230 360"
          stroke="url(#dnaGrad2)"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* Center Smart Intelligence Badge Indicator */}
        <g transform="translate(160, 200)">
          <circle r="22" fill="#0E234B" stroke="#56ADE2" strokeWidth="2.5" />
          <path
            d="M -6 -4 L 0 -10 L 6 -4 L 0 8 Z"
            fill="#56ADE2"
            className="animate-bounce"
            style={{ animationDuration: "2s" }}
          />
        </g>
      </svg>
    </div>
  );
}
