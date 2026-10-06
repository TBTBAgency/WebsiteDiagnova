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
    { label: "Log in", href: "/login" },
  ];

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-[#225FA9] via-[#327AC7] to-[#4C9BE6] text-white pt-20 sm:pt-24 lg:pt-28 pb-0">
      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
        {/* Main Footer Top Grid */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 pb-6 sm:pb-8 items-stretch">
          {/* Col 1 (Left): Brand Logo at Top & Legal / Copyright aligned at Bottom */}
          <div className="lg:col-span-5 flex flex-col justify-between py-0.5 space-y-8 lg:space-y-0">
            <div>
              <Link href="/" className="inline-block transition-opacity hover:opacity-90 -translate-x-1.5 sm:-translate-x-2 lg:-translate-x-2.5">
                <Image
                  src="/images/logo-diagnova.svg"
                  alt="Diagnova Logo"
                  width={210}
                  height={52}
                  className="h-8 sm:h-9 md:h-10 w-auto brightness-0 invert object-contain"
                />
              </Link>
            </div>

            <div className="space-y-1 text-xs sm:text-[13px] text-white/90 font-normal leading-relaxed">
              <p>&copy; 2026 Diagnova by PT Tiba Tiba Agency.</p>
              <p className="flex items-center gap-1.5 text-white/80">
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
                <span>|</span>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>

          {/* Col 2-5 (Right): 4 Platform Link Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
            {[1, 2, 3, 4].map((colIdx) => (
              <div key={colIdx} className="space-y-3">
                <h4 className="font-bold text-white text-sm sm:text-base tracking-wide">
                  Platform
                </h4>
                <ul className="space-y-2 text-xs sm:text-[13px] text-white/90">
                  {footerLinks.map((link, idx) => (
                    <li key={idx}>
                      <Link
                        href={link.href}
                        className="hover:text-white hover:translate-x-0.5 transition-all inline-block text-white/85"
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

      {/* Giant Cropped Logo Watermark at Bottom (100% exact alignment, width, and gradient) */}
      <div className="relative w-full overflow-hidden select-none pointer-events-none mt-8 sm:mt-12 lg:mt-14 -mb-8 sm:-mb-14 md:-mb-20 lg:-mb-26 flex justify-center">
        <div
          className="relative w-full min-w-full h-36 sm:h-56 md:h-76 lg:h-96 xl:h-[430px] flex items-start justify-center"
          style={{
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.92) 20%, rgba(0,0,0,0.52) 55%, rgba(0,0,0,0.18) 80%, rgba(0,0,0,0.02) 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.92) 20%, rgba(0,0,0,0.52) 55%, rgba(0,0,0,0.18) 80%, rgba(0,0,0,0.02) 100%)",
          }}
        >
          {/* Logo spanning edge-to-edge with crisp white and gradient mask */}
          <Image
            src="/images/logo-diagnova.svg"
            alt="Diagnova Brand Watermark"
            fill
            className="object-contain object-top brightness-0 invert scale-[1.08] sm:scale-[1.12] lg:scale-[1.06] transform origin-top"
            priority
          />
        </div>
      </div>
    </footer>
  );
}
