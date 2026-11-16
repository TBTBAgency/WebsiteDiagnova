"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCmsText, visibleItems } from "@/lib/cms/text";
import type { FooterContent } from "@/content/pages/global";

interface FooterProps {
  /** Konten CMS section `global.footer` (`null` = footer tidak dirender). */
  content: FooterContent | null;
}

export function Footer({ content }: FooterProps) {
  const t = useCmsText();

  if (!content) return null;

  const footerSections = visibleItems(content.columns);
  const legalLinks = visibleItems(content.legalLinks);

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-[#2568BA] via-[#2F79CE] to-[#56ADE2] text-white pt-16 sm:pt-20 lg:pt-24 pb-0">
      <div className="relative z-10 mx-auto max-w-[1560px] px-6 sm:px-8 lg:px-10">
        {/* Main Footer Flex Layout (Aligned precisely with Navbar left and right bounds) */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-16 pb-4 sm:pb-6 items-stretch">
          {/* Col Left: Brand Logo at Top & Legal / Copyright aligned at Bottom */}
          <div className="flex flex-col justify-between space-y-8 lg:space-y-0 min-h-[210px] sm:min-h-[230px] shrink-0 lg:w-88 xl:w-[380px]">
            <div className="flex items-center">
              {content.logoUrl && (
              <Link
                href={content.logoHref || "/"}
                className="flex items-center transition-opacity hover:opacity-90 shrink-0 -translate-x-0.5 sm:-translate-x-1 lg:-translate-x-1.5"
              >
                <Image
                  src={content.logoUrl}
                  alt={content.logoAlt}
                  width={270}
                  height={75}
                  className="h-11 sm:h-12 md:h-13 lg:h-[52px] xl:h-[54px] w-auto brightness-0 invert object-contain"
                  priority
                />
              </Link>
              )}
            </div>

            <div className="space-y-1 text-[11px] sm:text-xs text-white/80 font-normal leading-relaxed sm:translate-x-2 lg:translate-x-2.5">
              <p>{t(content.copyright)}</p>
              <p className="flex items-center gap-1.5 text-white/70">
                {legalLinks.map((link, idx) => (
                  <React.Fragment key={link.id}>
                    {idx > 0 && <span className="text-white/40">|</span>}
                    <Link href={link.href} className="hover:text-white transition-colors">
                      {t(link.label)}
                    </Link>
                  </React.Fragment>
                ))}
              </p>
            </div>
          </div>

          {/* Col Right: 4 Nav Link Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-10 lg:gap-11 xl:gap-14 pt-2.5 sm:pt-3.5 lg:pt-4 lg:ml-auto">
            {footerSections.map((section) => (
              <div key={section.id} className="space-y-3.5">
                <h4 className="font-semibold text-white text-[15px] sm:text-base tracking-normal">
                  {t(section.title)}
                </h4>
                <ul className="space-y-2.5 text-[13.5px] sm:text-sm text-white/80 font-normal">
                  {visibleItems(section.links).map((link) => (
                    <li key={link.id}>
                      <Link
                        href={link.href}
                        className="hover:text-white transition-colors inline-block hover:translate-x-0.5 duration-150"
                      >
                        {t(link.label)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Giant Cropped Logo Watermark at Bottom */}
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
            {content.watermarkUrl && (
            <Image
              src={content.watermarkUrl}
              alt={content.watermarkAlt}
              fill
              className="object-contain object-top brightness-0 invert opacity-90"
              priority
            />
            )}
          </div>

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
