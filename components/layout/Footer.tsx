import React from "react";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  const footerLinks = [
    { label: "Platform", href: "/platform" },
    { label: "Overview", href: "/platform" },
    { label: "Modules", href: "/modules" },
    { label: "Nova AI", href: "/nova-ai" },
    { label: "Integrations", href: "/integration" },
    { label: "Log in", href: "/request-demo" },
  ];

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-[#2568BA] via-[#2F79CE] to-[#56ADE2] text-white pt-16 sm:pt-20 lg:pt-24 pb-0">
      <div className="relative z-10 mx-auto max-w-screen-2xl px-6 sm:px-8 lg:px-12">
        {/* Main Footer Flex Layout (Aligned precisely with Navbar left and right bounds) */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-16 pb-4 sm:pb-6 items-stretch">
          {/* Col Left: Brand Logo at Top & Legal / Copyright aligned at Bottom */}
          <div className="flex flex-col justify-between space-y-8 lg:space-y-0 min-h-[210px] sm:min-h-[230px] shrink-0 lg:w-96 xl:w-[420px]">
            <div>
              <Link
                href="/"
                className="inline-block transition-opacity hover:opacity-90"
              >
                <Image
                  src="/images/logo-diagnova.svg"
                  alt="Diagnova Logo"
                  width={320}
                  height={90}
                  className="h-13 sm:h-15 md:h-16 lg:h-[68px] w-auto brightness-0 invert object-contain"
                  priority
                />
              </Link>
            </div>

            <div className="space-y-1.5 text-xs sm:text-sm text-white/90 font-normal leading-relaxed translate-x-[15px] sm:translate-x-[18px] lg:translate-x-[22px]">
              <p>&copy; 2026 Diagnova by PT Tiba Tiba Agency.</p>
              <p className="flex items-center gap-1.5 text-white/80">
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
                <span className="text-white/40">|</span>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>

          {/* Col Right: 4 Platform Link Columns spanning full width to the right edge */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 xl:gap-16 justify-between pt-2.5 sm:pt-3.5 lg:pt-5">
            {[1, 2, 3, 4].map((colIdx) => (
              <div key={colIdx} className="space-y-4">
                <h4 className="font-semibold text-white text-[17px] sm:text-[18.5px] tracking-normal">
                  Platform
                </h4>
                <ul className="space-y-3 text-[14.5px] sm:text-[15.5px] text-white/90 font-normal">
                  {footerLinks.map((link, idx) => (
                    <li key={idx}>
                      <Link
                        href={link.href}
                        className="hover:text-white transition-colors inline-block text-white/85 hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Giant Cropped Logo Watermark at Bottom with Smooth Top-to-Bottom Fade Gradient */}
      <div className="relative w-full overflow-hidden select-none pointer-events-none -mt-4 sm:-mt-8 lg:-mt-12 flex justify-center">
        <div className="relative w-full h-36 sm:h-56 md:h-68 lg:h-84 xl:h-[365px] 2xl:h-[405px] flex items-start justify-center overflow-hidden">
          <div
            className="relative w-full min-w-[1100px] lg:min-w-[1380px] xl:min-w-[1600px] 2xl:min-w-[1850px] aspect-[1430/400] -translate-y-6 sm:-translate-y-5 lg:-translate-y-3 xl:-translate-y-2 scale-[1.06] sm:scale-[1.10] lg:scale-[1.15] xl:scale-[1.20] origin-top"
            style={{
              maskImage:
                "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 25%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.25) 75%, rgba(0,0,0,0.06) 90%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 25%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.25) 75%, rgba(0,0,0,0.06) 90%, transparent 100%)",
            }}
          >
            <Image
              src="/images/logo-diagnova.svg"
              alt="Diagnova Brand Watermark"
              fill
              className="object-contain object-top brightness-0 invert opacity-90"
              priority
            />
          </div>

          {/* Ultra-soft gradient fade overlay in front of giant logo */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[58%] pointer-events-none z-10"
            style={{
              background:
                "linear-gradient(to top, rgba(86, 173, 226, 0.92) 0%, rgba(86, 173, 226, 0.68) 25%, rgba(86, 173, 226, 0.38) 52%, rgba(86, 173, 226, 0.12) 78%, transparent 100%)",
            }}
          />
        </div>
      </div>
    </footer>
  );
}
