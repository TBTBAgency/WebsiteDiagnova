"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { DEFAULT_FOOTER, pickLang, type FooterContent } from "@/lib/site-content";

export function Footer({ content = DEFAULT_FOOTER }: { content?: FooterContent }) {
  const { language } = useLanguage();
  const t = (id: string, en: string) => pickLang(language, id, en);
  const footerSections = content.columns
    .filter((c) => c.isActive)
    .map((c) => ({
      id: c.id,
      title: t(c.titleId, c.titleEn),
      links: c.links.filter((l) => l.isActive && l.url).map((l) => ({ label: t(l.labelId, l.labelEn), href: l.url })),
    }))
    .filter((c) => c.title || c.links.length > 0);
  const description = t(content.descriptionId, content.descriptionEn);
  const address = t(content.contact.addressId, content.contact.addressEn);
  const social = content.social.filter((s) => s.isActive && s.url);
  const waDigits = content.contact.whatsapp.replace(/[^0-9]/g, "").replace(/^0/, "62");
  const logo = content.logoUrl || DEFAULT_FOOTER.logoUrl;

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-[#2568BA] via-[#2F79CE] to-[#56ADE2] text-white pt-16 sm:pt-20 lg:pt-24 pb-0">
      <div className="relative z-10 mx-auto max-w-[1560px] px-6 sm:px-8 lg:px-10">
        {/* Main Footer Flex Layout (Aligned precisely with Navbar left and right bounds) */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-16 pb-4 sm:pb-6 items-stretch">
          {/* Col Left: Brand Logo at Top & Legal / Copyright aligned at Bottom */}
          <div className="flex flex-col justify-between space-y-8 lg:space-y-0 min-h-[210px] sm:min-h-[230px] shrink-0 lg:w-88 xl:w-[380px]">
            <div className="flex items-center">
              <Link
                href="/"
                className="flex items-center transition-opacity hover:opacity-90 shrink-0 -translate-x-0.5 sm:-translate-x-1 lg:-translate-x-1.5"
              >
                <Image
                  src={logo}
                  alt="Diagnova"
                  width={270}
                  height={75}
                  className="h-11 sm:h-12 md:h-13 lg:h-[52px] xl:h-[54px] w-auto brightness-0 invert object-contain"
                  priority
                />
              </Link>
            </div>

            {(description || content.contact.email || content.contact.phone || content.contact.whatsapp || address || social.length > 0) && (
              <div className="space-y-2 text-[13px] text-white/85 leading-relaxed max-w-sm" data-testid="footer-about">
                {description && <p>{description}</p>}
                {content.contact.email && (
                  <p>
                    <a href={`mailto:${content.contact.email}`} className="hover:text-white transition-colors">{content.contact.email}</a>
                  </p>
                )}
                {content.contact.phone && <p>{content.contact.phone}</p>}
                {content.contact.whatsapp && waDigits && (
                  <p>
                    <a href={`https://wa.me/${waDigits}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      WhatsApp {content.contact.whatsapp}
                    </a>
                  </p>
                )}
                {address && <p className="whitespace-pre-line">{address}</p>}
                {social.length > 0 && (
                  <p className="flex flex-wrap gap-x-3 gap-y-1">
                    {social.map((s) => (
                      <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline hover:text-white">
                        {s.platform}
                      </a>
                    ))}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-1 text-[11px] sm:text-xs text-white/80 font-normal leading-relaxed sm:translate-x-2 lg:translate-x-2.5">
              {t(content.copyrightId, content.copyrightEn) && <p>{t(content.copyrightId, content.copyrightEn)}</p>}
              {(content.legal.showTerms || content.legal.showPrivacy) && (
                <p className="flex items-center gap-1.5 text-white/70">
                  {content.legal.showTerms && (
                    <Link href="/terms" className="hover:text-white transition-colors">
                      {language === "ID" ? "Syarat & Ketentuan" : "Terms of Service"}
                    </Link>
                  )}
                  {content.legal.showTerms && content.legal.showPrivacy && <span className="text-white/40">|</span>}
                  {content.legal.showPrivacy && (
                    <Link href="/privacy" className="hover:text-white transition-colors">
                      {language === "ID" ? "Kebijakan Privasi" : "Privacy Policy"}
                    </Link>
                  )}
                </p>
              )}
            </div>
          </div>

          {/* Col Right: 4 Nav Link Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-10 lg:gap-11 xl:gap-14 pt-2.5 sm:pt-3.5 lg:pt-4 lg:ml-auto">
            {footerSections.map((section) => (
              <div key={section.id} className="space-y-3.5">
                <h4 className="font-semibold text-white text-[15px] sm:text-base tracking-normal">
                  {section.title}
                </h4>
                <ul className="space-y-2.5 text-[13.5px] sm:text-sm text-white/80 font-normal">
                  {section.links.map((link, idx) => (
                    <li key={idx}>
                      <Link
                        href={link.href}
                        className="hover:text-white transition-colors inline-block hover:translate-x-0.5 duration-150"
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
            <Image
              src="/images/logo-diagnova.svg"
              alt="Diagnova Brand Watermark"
              fill
              className="object-contain object-top brightness-0 invert opacity-90"
              priority
            />
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
