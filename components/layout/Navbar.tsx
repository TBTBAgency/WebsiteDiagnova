"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Activity,
  Layers,
  Sparkles,
  Network,
  Cpu,
  ArrowRight,
  ShieldCheck,
  Building2,
  Stethoscope,
  Microscope,
  FlaskConical,
  HeartPulse,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AnnouncementBar } from "./AnnouncementBar";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface NavItem {
  label: string;
  href: string;
  children?: {
    title: string;
    description: string;
    href: string;
    icon: React.ReactNode;
  }[];
}

function getNavItems(lang: "ID" | "EN"): NavItem[] {
  if (lang === "ID") {
    return [
      {
        label: "Platform",
        href: "/platform",
        children: [
          {
            title: "Gambaran Platform",
            description: "Buku catatan super pintar yang menghubungkan instrumen lab dengan dokter",
            href: "/platform",
            icon: <Layers className="h-4 w-4 text-diagnova-blue" />,
          },
          {
            title: "Alur Kerja",
            description: "Alur kerja 4 tahap dari penerimaan sampel hingga rilis hasil ke dokter",
            href: "/platform/workflow",
            icon: <Activity className="h-4 w-4 text-diagnova-blue" />,
          },
          {
            title: "100% Otomasi",
            description: "Antarmuka analyzer langsung & verifikasi otomatis memangkas TAT 70%",
            href: "/platform/automation",
            icon: <Cpu className="h-4 w-4 text-diagnova-blue" />,
          },
          {
            title: "Pelaporan & Jejak Audit",
            description: "Rekam jejak digital transparan untuk setiap perubahan hasil sampel",
            href: "/platform/reporting",
            icon: <ShieldCheck className="h-4 w-4 text-diagnova-blue" />,
          },
          {
            title: "Analitik & Inteligensi",
            description: "Pemanfaatan insight data lab untuk mendukung efisiensi & Nova AI",
            href: "/platform/analytics",
            icon: <Sparkles className="h-4 w-4 text-nova-blue" />,
          },
        ],
      },
      {
        label: "Solusi",
        href: "/solutions",
        children: [
          {
            title: "Laboratorium Rumah Sakit",
            description: "Solusi terpadu lab pusat, IGD, dan ICU dengan bridging SIMRS/RME",
            href: "/solutions/hospital-laboratory",
            icon: <Building2 className="h-4 w-4 text-diagnova-blue" />,
          },
          {
            title: "Laboratorium Klinik",
            description: "Kecepatan registrasi, MCU massal, dan portal hasil pasien online",
            href: "/solutions/clinical-laboratory",
            icon: <Stethoscope className="h-4 w-4 text-nova-blue" />,
          },
          {
            title: "Patologi Anatomi",
            description: "Pelacakan spesimen jaringan ketat & integrasi patologi digital",
            href: "/solutions/pathology",
            icon: <Microscope className="h-4 w-4 text-diagnova-blue" />,
          },
          {
            title: "Mikrobiologi & PPRA",
            description: "Kultur bakteri, uji kepekaan antibiotik, dan kalkulasi antibiogram",
            href: "/solutions/microbiology",
            icon: <FlaskConical className="h-4 w-4 text-nova-blue" />,
          },
          {
            title: "Bank Darah & Transfusi",
            description: "Kontrol rantai dingin, validasi crossmatch, dan zero wastage",
            href: "/solutions/blood-bank",
            icon: <HeartPulse className="h-4 w-4 text-rose-500" />,
          },
          {
            title: "Nova AI Inteligensi",
            description: "Asisten AI cerdas: mendeteksi anomali & merangkum angka klinis",
            href: "/solutions/nova-ai",
            icon: <Sparkles className="h-4 w-4 text-amber-500" />,
          },
        ],
      },
      {
        label: "Modul",
        href: "/modules",
        children: [
          {
            title: "Rutin & Hematologi",
            description: "Pemeriksaan darah harian & kimia klinik bervolume tinggi",
            href: "/modules/routine-hematology",
            icon: <Activity className="h-4 w-4 text-diagnova-blue" />,
          },
          {
            title: "Bank Darah",
            description: "Ketersediaan, masa kedaluwarsa, crossmatching, dan distribusi darah",
            href: "/modules/blood-bank",
            icon: <HeartPulse className="h-4 w-4 text-rose-500" />,
          },
          {
            title: "Inventaris & Reagen",
            description: "Pantau stok reagen real-time & cegah kehabisan saat shift berjalan",
            href: "/modules/inventory-reagent",
            icon: <Cpu className="h-4 w-4 text-nova-blue" />,
          },
          {
            title: "Patologi",
            description: "Pencatatan histopatologi & sitologi dengan pelacakan kaset/slide",
            href: "/modules/pathology",
            icon: <Microscope className="h-4 w-4 text-diagnova-blue" />,
          },
          {
            title: "Mikrobiologi",
            description: "Identifikasi kuman, kultur bakteri, dan uji resistensi antibiotik",
            href: "/modules/microbiology",
            icon: <FlaskConical className="h-4 w-4 text-nova-blue" />,
          },
        ],
      },
      {
        label: "Nova AI",
        href: "/nova-ai",
        children: [
          {
            title: "Gambaran Nova AI",
            description: "Mengubah angka medis rumit menjadi kalimat ringkas & dapat ditindaklanjuti",
            href: "/nova-ai",
            icon: <Sparkles className="h-4 w-4 text-nova-blue" />,
          },
          {
            title: "Cara Kerja (4 Tahap)",
            description: "Membaca Pola → Menerjemahkan Angka → Notifikasi Cepat → Validasi Dokter",
            href: "/nova-ai/how-it-works",
            icon: <Activity className="h-4 w-4 text-diagnova-blue" />,
          },
          {
            title: "AI + Dokter (Etika & Kolaborasi)",
            description: "AI membantu. Dokter memutuskan. Penegasan peran manusia dalam keputusan klinis",
            href: "/nova-ai/ai-doctor",
            icon: <ShieldCheck className="h-4 w-4 text-emerald-600" />,
          },
        ],
      },
      {
        label: "Integrasi",
        href: "/integration",
        children: [
          {
            title: "Gambaran Integrasi",
            description: "Konektivitas siap pakai dengan sistem & instrumen laboratorium Anda",
            href: "/integration",
            icon: <Network className="h-4 w-4 text-diagnova-blue" />,
          },
          {
            title: "SIMRS / HIS",
            description: "Bridging native dua arah untuk penerimaan order & rilis hasil",
            href: "/integration/simrs-his",
            icon: <Building2 className="h-4 w-4 text-nova-blue" />,
          },
          {
            title: "RME (Rekam Medis Elektronik)",
            description: "Kepatuhan Permenkes 24/2022 dengan riwayat lab longitudinal",
            href: "/integration/rme",
            icon: <Activity className="h-4 w-4 text-diagnova-blue" />,
          },
          {
            title: "500+ Analyzer",
            description: "Antarmuka langsung dengan instrumen Roche, Abbott, Sysmex, Mindray, dll",
            href: "/integration/analyzer",
            icon: <Cpu className="h-4 w-4 text-nova-blue" />,
          },
          {
            title: "SATUSEHAT Kemenkes",
            description: "Interoperabilitas HL7 FHIR standar data kesehatan nasional",
            href: "/integration/satusehat",
            icon: <ShieldCheck className="h-4 w-4 text-emerald-600" />,
          },
          {
            title: "Smart Resilient Gateway",
            description: "Koneksi tangguh HL7/ASTM dengan Offline Edge Buffer & Uptime 99,9%",
            href: "/integration/connectivity",
            icon: <Network className="h-4 w-4 text-diagnova-blue" />,
          },
        ],
      },
    ];
  }

  // English
  return [
    {
      label: "Platform",
      href: "/platform",
      children: [
        {
          title: "Platform Overview",
          description: "A smart notebook connecting lab instruments with physicians seamlessly",
          href: "/platform",
          icon: <Layers className="h-4 w-4 text-diagnova-blue" />,
        },
        {
          title: "Workflow",
          description: "4-stage workflow from sample receipt to result release to physicians",
          href: "/platform/workflow",
          icon: <Activity className="h-4 w-4 text-diagnova-blue" />,
        },
        {
          title: "100% Automation",
          description: "Direct analyzer interfacing & auto-verification cutting TAT by 70%",
          href: "/platform/automation",
          icon: <Cpu className="h-4 w-4 text-diagnova-blue" />,
        },
        {
          title: "Reporting & Audit Trail",
          description: "Transparent digital trail for every sample result change",
          href: "/platform/reporting",
          icon: <ShieldCheck className="h-4 w-4 text-diagnova-blue" />,
        },
        {
          title: "Analytics & Intelligence",
          description: "Leverage lab data insights to drive efficiency & power Nova AI",
          href: "/platform/analytics",
          icon: <Sparkles className="h-4 w-4 text-nova-blue" />,
        },
      ],
    },
    {
      label: "Solutions",
      href: "/solutions",
      children: [
        {
          title: "Hospital Laboratory",
          description: "Unified solution for central lab, ER, and ICU with HIS/EMR bridging",
          href: "/solutions/hospital-laboratory",
          icon: <Building2 className="h-4 w-4 text-diagnova-blue" />,
        },
        {
          title: "Clinical Laboratory",
          description: "Fast registration, mass check-ups, and online patient result portal",
          href: "/solutions/clinical-laboratory",
          icon: <Stethoscope className="h-4 w-4 text-nova-blue" />,
        },
        {
          title: "Anatomical Pathology",
          description: "Strict tissue specimen tracking & digital pathology integration",
          href: "/solutions/pathology",
          icon: <Microscope className="h-4 w-4 text-diagnova-blue" />,
        },
        {
          title: "Microbiology & PPRA",
          description: "Bacterial culture, antibiotic sensitivity testing, and antibiogram calculation",
          href: "/solutions/microbiology",
          icon: <FlaskConical className="h-4 w-4 text-nova-blue" />,
        },
        {
          title: "Blood Bank & Transfusion",
          description: "Cold chain control, crossmatch validation, and zero wastage",
          href: "/solutions/blood-bank",
          icon: <HeartPulse className="h-4 w-4 text-rose-500" />,
        },
        {
          title: "Nova AI Intelligence",
          description: "Smart AI assistant: detects anomalies & summarizes clinical figures",
          href: "/solutions/nova-ai",
          icon: <Sparkles className="h-4 w-4 text-amber-500" />,
        },
      ],
    },
    {
      label: "Modules",
      href: "/modules",
      children: [
        {
          title: "Routine & Hematology",
          description: "Daily blood tests & high-volume clinical chemistry processing",
          href: "/modules/routine-hematology",
          icon: <Activity className="h-4 w-4 text-diagnova-blue" />,
        },
        {
          title: "Blood Bank",
          description: "Availability, expiry tracking, crossmatching, and blood distribution",
          href: "/modules/blood-bank",
          icon: <HeartPulse className="h-4 w-4 text-rose-500" />,
        },
        {
          title: "Inventory & Reagent",
          description: "Real-time reagent stock monitoring & prevent stock-outs during shifts",
          href: "/modules/inventory-reagent",
          icon: <Cpu className="h-4 w-4 text-nova-blue" />,
        },
        {
          title: "Pathology",
          description: "Histopathology & cytology recording with cassette/slide tracking",
          href: "/modules/pathology",
          icon: <Microscope className="h-4 w-4 text-diagnova-blue" />,
        },
        {
          title: "Microbiology",
          description: "Germ identification, bacterial culture, and antibiotic resistance testing",
          href: "/modules/microbiology",
          icon: <FlaskConical className="h-4 w-4 text-nova-blue" />,
        },
      ],
    },
    {
      label: "Nova AI",
      href: "/nova-ai",
      children: [
        {
          title: "Nova AI Overview",
          description: "Turning complex medical numbers into concise & actionable summaries",
          href: "/nova-ai",
          icon: <Sparkles className="h-4 w-4 text-nova-blue" />,
        },
        {
          title: "How It Works (4 Steps)",
          description: "Read Patterns → Translate Numbers → Fast Alerts → Doctor Validation",
          href: "/nova-ai/how-it-works",
          icon: <Activity className="h-4 w-4 text-diagnova-blue" />,
        },
        {
          title: "AI + Doctor (Ethics & Collaboration)",
          description: "AI assists. Doctors decide. Affirming the human role in clinical decisions",
          href: "/nova-ai/ai-doctor",
          icon: <ShieldCheck className="h-4 w-4 text-emerald-600" />,
        },
      ],
    },
    {
      label: "Integration",
      href: "/integration",
      children: [
        {
          title: "Integration Overview",
          description: "Ready-to-use connectivity with your lab systems & instruments",
          href: "/integration",
          icon: <Network className="h-4 w-4 text-diagnova-blue" />,
        },
        {
          title: "HIS / EMR",
          description: "Native two-way bridging for order reception & result release",
          href: "/integration/simrs-his",
          icon: <Building2 className="h-4 w-4 text-nova-blue" />,
        },
        {
          title: "Electronic Medical Records",
          description: "Compliance with national health data standards & longitudinal lab history",
          href: "/integration/rme",
          icon: <Activity className="h-4 w-4 text-diagnova-blue" />,
        },
        {
          title: "500+ Analyzers",
          description: "Direct interfacing with Roche, Abbott, Sysmex, Mindray instruments & more",
          href: "/integration/analyzer",
          icon: <Cpu className="h-4 w-4 text-nova-blue" />,
        },
        {
          title: "SATUSEHAT (National Health)",
          description: "HL7 FHIR interoperability with national health data standards",
          href: "/integration/satusehat",
          icon: <ShieldCheck className="h-4 w-4 text-emerald-600" />,
        },
        {
          title: "Smart Resilient Gateway",
          description: "Robust HL7/ASTM connection with Offline Edge Buffer & 99.9% Uptime",
          href: "/integration/connectivity",
          icon: <Network className="h-4 w-4 text-diagnova-blue" />,
        },
      ],
    },
  ];
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

export function Navbar() {
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
  const navItems = getNavItems(language);

  const updateProgress = (y: number) => {
    if (!progressBarRef.current) return;
    const totalHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress =
      totalHeight > 0 ? Math.min(1, Math.max(0, y / totalHeight)) : 0;
    progressBarRef.current.style.transform = `scaleX(${progress})`;
  };

  const updateNavPosition = (y: number) => {
    const effectiveHeight = isDismissed ? 0 : barHeight;
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
  }, [isDismissed, barHeight]);

  // Close mobile menu on route change & recalculate scroll progress
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    setMobileOpenSection(null);
    updateProgress(window.scrollY);
    updateNavPosition(window.scrollY);
  }, [pathname]);

  const effectiveBarHeight = isDismissed ? 0 : barHeight;

  return (
    <>
      {/* ── Fixed Announcement Bar: Scrolls smoothly out of view (z-30) ── */}
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
        <div className="relative z-20 mx-auto flex max-w-[1560px] items-center justify-between px-6 sm:px-8 lg:px-10">
        {/* Left: Brand Logo */}
        <div className="flex items-center flex-1 justify-start">
          <Link
            href="/"
            className="flex items-center transition-opacity hover:opacity-90 shrink-0 -translate-x-2.5 sm:-translate-x-3.5"
          >
            <Image
              src="/images/logo-diagnova.svg"
              alt="Diagnova"
              width={240}
              height={66}
              priority
              className="h-10 sm:h-11 md:h-12 lg:h-[46px] xl:h-12 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden items-center justify-center gap-7 xl:gap-10 lg:flex shrink-0">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => setActiveDropdown(item.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href={item.href}
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
                      activeDropdown === item.label && "rotate-180 text-diagnova-blue"
                    )}
                  />
                )}
              </Link>

              {/* Ultra-Minimalist Dropdown Menu - Premium 1 Column */}
              {item.children && activeDropdown === item.label && (
                <div className="absolute left-1/2 top-full -translate-x-1/2 pt-2.5 z-50">
                  <div className="relative w-[320px] overflow-hidden rounded-2xl border border-slate-100 bg-white/95 backdrop-blur-xl p-2 shadow-[0_20px_45px_-12px_rgba(15,23,42,0.12),0_0_1px_1px_rgba(15,23,42,0.04)] animate-dropdown">
                    <div className="flex flex-col gap-0.5">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="group/item relative flex flex-col justify-center rounded-xl px-3.5 py-2.5 transition-all duration-150 hover:bg-slate-50/90 active:bg-slate-100/80"
                        >
                          {/* Micro indicator line on hover */}
                          <span className="absolute left-1.5 top-2.5 bottom-2.5 w-[2.5px] rounded-full bg-[#2764B8] opacity-0 transition-all duration-150 group-hover/item:opacity-100" />

                          <span className="text-[13.5px] font-medium tracking-tight text-slate-800 transition-colors group-hover/item:text-[#2764B8] group-hover/item:translate-x-0.5 duration-150">
                            {child.title}
                          </span>
                          <span className="mt-0.5 text-[11px] text-slate-400 transition-colors group-hover/item:text-slate-500 group-hover/item:translate-x-0.5 duration-150 line-clamp-1">
                            {child.description}
                          </span>
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
          <Link
            href="/request-demo"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2764B8] hover:bg-[#1E5299] px-6 py-2.5 xl:px-7 xl:py-3 text-[15px] xl:text-base font-semibold text-white shadow-sm transition-all duration-200 active:scale-[0.98]"
          >
            <span>{language === "ID" ? "Minta Demo" : "Request Demo"}</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/request-demo"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#2764B8] hover:bg-[#1E5299] px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm"
          >
            <span>Demo</span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            aria-label={language === "ID" ? "Buka Navigasi" : "Open Navigation"}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden max-h-[calc(100vh-80px)] overflow-y-auto border-t border-slate-200/80 bg-white/95 backdrop-blur-xl px-4 py-4 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="space-y-2">
            {navItems.map((item) => {
              const isOpen = mobileOpenSection === item.label;
              return (
                <div
                  key={item.label}
                  className="rounded-xl border border-slate-100 bg-slate-50/50 overflow-hidden"
                >
                  {item.children ? (
                    <div>
                      <button
                        type="button"
                        onClick={() =>
                          setMobileOpenSection(isOpen ? null : item.label)
                        }
                        className="flex w-full items-center justify-between p-3.5 text-left text-sm font-semibold text-slate-800 transition-colors hover:text-diagnova-blue"
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 text-slate-400 transition-transform duration-200",
                            isOpen && "rotate-180 text-diagnova-blue"
                          )}
                        />
                      </button>
                      {isOpen && (
                        <div className="border-t border-slate-100 bg-white p-1.5 space-y-0.5">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className="block rounded-lg px-3 py-2 transition-colors hover:bg-slate-50"
                            >
                              <p className="text-xs font-medium text-slate-800">
                                {child.title}
                              </p>
                              <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                                {child.description}
                              </p>
                            </Link>
                          ))}
                          <div className="pt-1 px-3 pb-1">
                            <Link
                              href={item.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-diagnova-blue"
                            >
                              <span>
                                {language === "ID" ? "Buka Halaman" : "Open Page"} {item.label}
                              </span>
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block p-3.5 text-sm font-semibold text-slate-800 hover:text-diagnova-blue"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              );
            })}

            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <LanguageSwitcher language={language} setLanguage={setLanguage} />
              <Link
                href="/request-demo"
                className="inline-flex items-center justify-center gap-2 flex-1 rounded-full bg-[#2764B8] hover:bg-[#1E5299] py-2.5 text-center text-xs sm:text-sm font-semibold text-white shadow-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>{language === "ID" ? "Minta Demo" : "Request Demo"}</span>
              </Link>
            </div>
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
