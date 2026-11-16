"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnnouncementBar } from "./AnnouncementBar";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { pickText, visibleItems } from "@/lib/cms/text";
import type { AnnouncementContent, NavigationContent } from "@/content/pages/global";

interface NavItem {
  id: string;
  label: string;
  href: string;
  children?: {
    id: string;
    title: string;
    description: string;
    href: string;
    /** Nama ikon lucide & kunci warna aksen dari CMS (saat ini tidak ditampilkan di dropdown). */
    iconName: string;
    accent: string;
  }[];
}

/** Menyusun menu (maks. 2 level) dari konten CMS `global.navigation`. */
function getNavItems(content: NavigationContent | null | undefined, lang: "ID" | "EN"): NavItem[] {
  if (!content) return [];
  return visibleItems(content.items).map((item) => {
    const children = visibleItems(item.children).map((child) => ({
      id: child.id,
      title: pickText(lang, child.title),
      description: pickText(lang, child.description),
      href: child.href,
      iconName: child.iconName,
      accent: child.accent,
    }));
    return {
      id: item.id,
      label: pickText(lang, item.label),
      href: item.href,
      children: children.length > 0 ? children : undefined,
    };
  });
}

// Circular Indonesia Flag SVG Component
function IndonesiaFlag({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("shrink-0 rounded-full", className)}
      aria-hidden="true"
    >
      <defs>
        <clipPath id="circle-flag-id-clip">
          <circle cx="12" cy="12" r="11" />
        </clipPath>
      </defs>
      <g clipPath="url(#circle-flag-id-clip)">
        <rect width="24" height="12" fill="#E11D48" />
        <rect y="12" width="24" height="12" fill="#FFFFFF" />
      </g>
      <circle
        cx="12"
        cy="12"
        r="11"
        fill="none"
        stroke="#E2E8F0"
        strokeWidth="1.2"
      />
    </svg>
  );
}

// Circular UK Flag SVG Component
function UKFlag({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("shrink-0 rounded-full", className)}
      aria-hidden="true"
    >
      <defs>
        <clipPath id="circle-flag-gb-clip">
          <circle cx="12" cy="12" r="11" />
        </clipPath>
      </defs>
      <g clipPath="url(#circle-flag-gb-clip)">
        {/* Navy Blue background */}
        <rect width="24" height="24" fill="#012169" />
        {/* White diagonals */}
        <path d="M0 0 L24 24 M24 0 L0 24" stroke="#FFFFFF" strokeWidth="4.5" />
        {/* Red diagonals */}
        <path d="M0 0 L24 24 M24 0 L0 24" stroke="#C8102E" strokeWidth="2.2" />
        {/* White cross */}
        <path d="M12 0 v24 M0 12 h24" stroke="#FFFFFF" strokeWidth="6.5" />
        {/* Red cross */}
        <path d="M12 0 v24 M0 12 h24" stroke="#C8102E" strokeWidth="4" />
      </g>
      <circle
        cx="12"
        cy="12"
        r="11"
        fill="none"
        stroke="#CBD5E1"
        strokeWidth="1.2"
      />
    </svg>
  );
}

// Animated Language Switcher Component with smooth sliding outline pill
function LanguageSwitcher({
  language,
  setLanguage,
}: {
  language: "ID" | "EN";
  setLanguage: (_lang: "ID" | "EN") => void;
}) {
  return (
    <div className="relative inline-flex items-center rounded-full p-0.5 select-none">
      {/* Smooth Sliding Pill Indicator with Border Outline */}
      <div
        className={cn(
          "absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] rounded-full border border-slate-300 bg-white shadow-sm transition-transform duration-300 ease-in-out pointer-events-none",
          language === "ID" ? "left-0.5 translate-x-0" : "left-0.5 translate-x-full"
        )}
      />

      {/* ID Option */}
      <button
        type="button"
        onClick={() => setLanguage("ID")}
        className={cn(
          "relative z-10 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs transition-colors duration-300 cursor-pointer min-w-[60px]",
          language === "ID"
            ? "font-semibold text-slate-900"
            : "font-normal text-slate-600 hover:text-slate-900"
        )}
        title="Bahasa Indonesia"
      >
        <span>ID</span>
        <IndonesiaFlag className="h-4 w-4" />
      </button>

      {/* EN Option */}
      <button
        type="button"
        onClick={() => setLanguage("EN")}
        className={cn(
          "relative z-10 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs transition-colors duration-300 cursor-pointer min-w-[60px]",
          language === "EN"
            ? "font-semibold text-slate-900"
            : "font-normal text-slate-600 hover:text-slate-900"
        )}
        title="English"
      >
        <span>EN</span>
        <UKFlag className="h-4 w-4" />
      </button>
    </div>
  );
}

interface NavbarProps {
  /** Konten CMS section `global.navigation` (`null` = disembunyikan di CMS). */
  content: NavigationContent | null;
  /** Konten CMS section `global.announcement` (`null` = announcement bar tidak dirender). */
  announcement: AnnouncementContent | null;
}

export function Navbar({ content, announcement }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileOpenSection, setMobileOpenSection] = useState<string | null>(null);
  const { language, setLanguage } = useLanguage();
  const [isDismissed, setIsDismissed] = useState(false);
  const [barHeight, setBarHeight] = useState(42);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const announcementRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const navItems = getNavItems(content, language);
  const hasAnnouncement = announcement != null;

  const updateProgress = (y: number) => {
    if (!progressBarRef.current) return;
    const totalHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress =
      totalHeight > 0 ? Math.min(1, Math.max(0, y / totalHeight)) : 0;
    progressBarRef.current.style.transform = `scaleX(${progress})`;
  };

  const updateNavPosition = (y: number) => {
    const effectiveHeight = isDismissed || !hasAnnouncement ? 0 : barHeight;
    const barOffset = Math.min(y, effectiveHeight);
    const topOffset = Math.max(0, effectiveHeight - y);

    if (announcementRef.current) {
      announcementRef.current.style.transform = `translateY(-${barOffset}px)`;
    }
    if (headerRef.current) {
      headerRef.current.style.top = `${topOffset}px`;
    }
  };

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          updateNavPosition(y);
          updateProgress(y);
          const shouldBeScrolled = y > 15;
          setIsScrolled((prev) => (prev !== shouldBeScrolled ? shouldBeScrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    updateNavPosition(window.scrollY);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDismissed, barHeight, hasAnnouncement]);

  // Announcement bar disembunyikan di CMS: offset konten halaman = 0
  useEffect(() => {
    if (!hasAnnouncement) {
      document.documentElement.style.setProperty("--announcement-bar-height", "0px");
    }
  }, [hasAnnouncement]);

  // Close mobile menu on route change & recalculate scroll progress
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    setMobileOpenSection(null);
    updateProgress(window.scrollY);
    updateNavPosition(window.scrollY);
  }, [pathname]);

  const handleNavClick = (href: string) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);

    // Fast in-page anchor scroll if clicking a link for the current page
    if (href.includes("#")) {
      const [targetPath, hash] = href.split("#");
      if ((targetPath === pathname || targetPath === "") && hash) {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  const effectiveBarHeight = isDismissed || !hasAnnouncement ? 0 : barHeight;

  return (
    <>
      {/* ── Fixed Announcement Bar: Scrolls smoothly out of view (z-30) ── */}
      {announcement && (
      <div
        ref={announcementRef}
        style={{
          transform: "translateY(0px)",
        }}
        className={cn(
          "fixed top-0 left-0 right-0 z-30 transition-opacity duration-300 will-change-transform",
          isDismissed ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
      >
        <AnnouncementBar
          content={announcement}
          language={language}
          onHeightChange={(h) => setBarHeight(h)}
          onDismiss={() => {
            setIsDismissed(true);
            document.documentElement.style.setProperty(
              "--announcement-bar-height",
              "0px"
            );
          }}
        />
      </div>
      )}

      {/* ── Main Navbar: z-40 with solid bg-white. Slides up and stays locked at top:0 ── */}
      <header
        ref={headerRef}
        style={{
          top: `${effectiveBarHeight}px`,
          transition: isDismissed
            ? "top 0.3s ease-out, box-shadow 0.3s"
            : "box-shadow 0.3s",
        }}
        className={cn(
          "fixed left-0 right-0 z-40 bg-white transition-shadow duration-300 py-3.5 sm:py-4 lg:py-5",
          isScrolled
            ? "shadow-[0_2px_14px_-2px_rgba(0,0,0,0.06)]"
            : "shadow-none"
        )}
      >
        <div className="relative z-20 mx-auto flex max-w-[1560px] items-center justify-between px-5 sm:px-6 lg:px-10">
        {/* Left: Brand Logo */}
        <div className="flex items-center flex-1 justify-start">
          {content?.logoUrl && (
          <Link
            href={content.logoHref || "/"}
            prefetch={true}
            className="flex items-center transition-opacity hover:opacity-90 shrink-0 -translate-x-2.5 sm:-translate-x-3.5"
          >
            <Image
              src={content.logoUrl}
              alt={content.logoAlt}
              width={240}
              height={66}
              priority
              className="h-10 sm:h-11 md:h-12 lg:h-[46px] xl:h-12 w-auto object-contain"
            />
          </Link>
          )}
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden items-center justify-center gap-7 xl:gap-10 lg:flex shrink-0">
          {navItems.map((item) => (
            <div
              key={item.id}
              className="relative"
              onMouseEnter={() => setActiveDropdown(item.id)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href={item.href}
                prefetch={true}
                onClick={() => handleNavClick(item.href)}
                className={cn(
                  "group/nav inline-flex items-center gap-1.5 py-2 px-1 text-[15px] xl:text-[15.5px] font-medium tracking-normal transition-colors duration-150",
                  pathname.startsWith(item.href)
                    ? "text-diagnova-blue font-semibold"
                    : "text-slate-700 hover:text-diagnova-blue"
                )}
              >
                <span>{item.label}</span>
                {item.children && (
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 text-slate-400 transition-transform duration-200 group-hover/nav:text-diagnova-blue",
                      activeDropdown === item.id && "rotate-180 text-diagnova-blue"
                    )}
                  />
                )}
              </Link>

              {/* Clean Minimalist Dropdown Menu with Top Caret */}
              {item.children && activeDropdown === item.id && (
                <div className="absolute -left-3 top-full pt-3 z-50">
                  <div className="relative w-[250px] rounded-xl border border-slate-200/90 bg-white py-3.5 px-2 shadow-[0_14px_36px_-10px_rgba(15,23,42,0.12)] animate-dropdown">
                    {/* Top-left triangle caret */}
                    <span
                      aria-hidden="true"
                      className="absolute -top-[6px] left-7 h-3 w-3 rotate-45 border-l border-t border-slate-200/90 bg-white"
                    />
                    <div className="relative z-10 flex flex-col">
                      {item.children.map((child) => (
                        <Link
                          key={child.id}
                          href={child.href}
                          prefetch={true}
                          onClick={() => handleNavClick(child.href)}
                          className={cn(
                            "block px-5 py-2.5 text-[14.5px] leading-snug transition-colors duration-150",
                            pathname === child.href
                              ? "text-[#1D82F5] font-medium"
                              : "text-slate-600 hover:text-[#1D82F5]"
                          )}
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right Section: Language Switcher & Request Demo Button */}
        <div className="hidden items-center justify-end gap-4 lg:flex flex-1">
          {/* Animated Smooth Language Switcher */}
          <LanguageSwitcher language={language} setLanguage={setLanguage} />

          {/* Primary CTA: Request Demo */}
          {content && (
          <Link
            href={content.ctaHref}
            prefetch={true}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2764B8] hover:bg-[#1E5299] px-6 py-2.5 xl:px-7 xl:py-3 text-[15px] xl:text-base font-semibold text-white shadow-sm transition-all duration-200 active:scale-[0.98]"
          >
            <span>{pickText(language, content.ctaLabel)}</span>
          </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 lg:hidden">
          {content && (
          <Link
            href={content.ctaHref}
            prefetch={true}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#2764B8] hover:bg-[#1E5299] px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm"
          >
            <span>{pickText(language, content.ctaMobileLabel)}</span>
          </Link>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            aria-label={content ? pickText(language, content.mobileMenuAriaLabel) : undefined}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu — Instant 1-tap direct page links (no heavy blur or nested accordions) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200/80 bg-white px-5 py-4 shadow-xl">
          <nav className="space-y-1.5" aria-label="Mobile Navigation">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  prefetch={true}
                  onClick={() => handleNavClick(item.href)}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-4 py-3.5 text-[15px] font-semibold transition-colors active:scale-[0.99]",
                    isActive
                      ? "bg-[#EBF3FE] text-[#2764B8]"
                      : "bg-slate-50/70 text-slate-800 hover:bg-slate-100 hover:text-[#2764B8]"
                  )}
                >
                  <span>{item.label}</span>
                  <ChevronRight
                    className={cn(
                      "h-4 w-4",
                      isActive ? "text-[#2764B8]" : "text-slate-400"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <LanguageSwitcher language={language} setLanguage={setLanguage} />
            {content && (
            <Link
              href={content.ctaHref}
              prefetch={true}
              className="inline-flex items-center justify-center gap-2 flex-1 rounded-full bg-[#2764B8] hover:bg-[#1E5299] py-3 text-center text-sm font-semibold text-white shadow-sm active:scale-[0.98]"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>{pickText(language, content.ctaLabel)}</span>
            </Link>
            )}
          </div>
        </div>
      )}

      {/* ── Scroll Progress Bar at the bottom edge of Navbar ── */}
      <div className="absolute bottom-0 left-0 right-0 h-[3.5px] sm:h-[4px] w-full bg-white overflow-hidden pointer-events-none z-10">
        <div
          ref={progressBarRef}
          className="h-full w-full origin-left bg-[#2764B8] will-change-transform"
          style={{
            transform: "scaleX(0)",
          }}
        />
      </div>
    </header>
    </>
  );
}
