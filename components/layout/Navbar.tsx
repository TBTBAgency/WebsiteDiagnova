"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
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

const navItems: NavItem[] = [
  {
    label: "Platform",
    href: "/platform",
    children: [
      {
        title: "Platform Overview",
        description: "Buku catatan super pintar yang menghubungkan instrumen lab dengan dokter",
        href: "/platform",
        icon: <Layers className="h-4 w-4 text-nova-blue" />,
      },
      {
        title: "Workflow",
        description: "Alur kerja 4 tahap dari penerimaan sampel hingga rilis hasil ke dokter",
        href: "/platform/workflow",
        icon: <Activity className="h-4 w-4 text-diagnova-blue" />,
      },
      {
        title: "100% Automation",
        description: "Direct analyzer interfacing & auto-verification memangkas TAT 70%",
        href: "/platform/automation",
        icon: <Cpu className="h-4 w-4 text-nova-blue" />,
      },
      {
        title: "Reporting & Audit Trail",
        description: "Rekam jejak digital transparan untuk setiap perubahan hasil sampel",
        href: "/platform/reporting",
        icon: <ShieldCheck className="h-4 w-4 text-diagnova-blue" />,
      },
      {
        title: "Analytics & Intelligence",
        description: "Pemanfaatan insight data lab untuk mendukung efisiensi & Nova AI",
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
        description: "Solusi terpadu lab pusat, IGD, dan ICU dengan bridging SIMRS/RME",
        href: "/solutions/hospital-laboratory",
        icon: <Building2 className="h-4 w-4 text-diagnova-blue" />,
      },
      {
        title: "Clinical Laboratory",
        description: "Kecepatan registrasi, MCU massal, dan portal hasil pasien online",
        href: "/solutions/clinical-laboratory",
        icon: <Stethoscope className="h-4 w-4 text-nova-blue" />,
      },
      {
        title: "Anatomical Pathology",
        description: "Tracking spesimen jaringan ketat & digital pathology integration",
        href: "/solutions/pathology",
        icon: <Microscope className="h-4 w-4 text-diagnova-blue" />,
      },
      {
        title: "Microbiology & PPRA",
        description: "Kultur bakteri, uji kepekaan antibiotik, dan kalkulasi antibiogram",
        href: "/solutions/microbiology",
        icon: <FlaskConical className="h-4 w-4 text-nova-blue" />,
      },
      {
        title: "Blood Bank & Transfusion",
        description: "Kontrol rantai dingin, validasi crossmatch, dan zero wastage",
        href: "/solutions/blood-bank",
        icon: <HeartPulse className="h-4 w-4 text-rose-500" />,
      },
      {
        title: "Nova AI Intelligence",
        description: "Asisten AI cerdas: mendeteksi anomali & merangkum angka klinis",
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
        description: "Pemeriksaan darah harian & kimia klinik bervolume tinggi",
        href: "/modules/routine-hematology",
        icon: <Activity className="h-4 w-4 text-diagnova-blue" />,
      },
      {
        title: "Blood Bank",
        description: "Ketersediaan, masa kedaluwarsa, crossmatching, dan distribusi darah",
        href: "/modules/blood-bank",
        icon: <HeartPulse className="h-4 w-4 text-rose-500" />,
      },
      {
        title: "Inventory & Reagent",
        description: "Pantau stok reagen real-time & cegah stock-out saat shift berjalan",
        href: "/modules/inventory-reagent",
        icon: <Cpu className="h-4 w-4 text-nova-blue" />,
      },
      {
        title: "Pathology",
        description: "Pencatatan histopatologi & sitologi dengan pelacakan kaset/slide",
        href: "/modules/pathology",
        icon: <Microscope className="h-4 w-4 text-diagnova-blue" />,
      },
      {
        title: "Microbiology",
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
        title: "Nova AI Overview",
        description: "Mengubah angka medis rumit menjadi kalimat ringkas & actionable",
        href: "/nova-ai",
        icon: <Sparkles className="h-4 w-4 text-nova-blue" />,
      },
      {
        title: "How It Works (4 Tahap)",
        description: "Membaca Pola → Menerjemahkan Angka → Notifikasi Cepat → Validasi Dokter",
        href: "/nova-ai/how-it-works",
        icon: <Activity className="h-4 w-4 text-diagnova-blue" />,
      },
      {
        title: "AI + Doctor (Etika & Kolaborasi)",
        description: "AI assists. Doctors decide. Penegasan peran manusia dalam keputusan klinis",
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
        title: "500+ Analyzers",
        description: "Direct interfacing dengan instrumen Roche, Abbott, Sysmex, Mindray, dll",
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
        description: "Koneksi tangguh HL7/ASTM dengan Offline Edge Buffer & Uptime 99.9%",
        href: "/integration/connectivity",
        icon: <Network className="h-4 w-4 text-diagnova-blue" />,
      },
    ],
  },
];

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
  setLanguage: (lang: "ID" | "EN") => void;
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
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<"ID" | "EN">("EN");
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white py-6">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 sm:px-8 lg:px-12">
        {/* Left: Brand Logo */}
        <div className="flex items-center flex-1 justify-start">
          <Link
            href="/"
            className="flex items-center transition-opacity hover:opacity-90 shrink-0"
          >
            <Image
              src="/images/logo-diagnova.svg"
              alt="Diagnova"
              width={215}
              height={60}
              priority
              className="h-9 sm:h-10 md:h-11 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden items-center justify-center gap-9 xl:gap-12 lg:flex shrink-0">
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
                  "py-2 text-[15px] font-normal tracking-normal transition-colors duration-150",
                  pathname.startsWith(item.href)
                    ? "text-diagnova-blue font-medium"
                    : "text-slate-800 hover:text-diagnova-blue"
                )}
              >
                {item.label}
              </Link>

              {/* Mega Dropdown Menu */}
              {item.children && activeDropdown === item.label && (
                <div className="absolute left-1/2 top-full -translate-x-1/2 pt-3 w-[420px]">
                  <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white p-2.5 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="grid grid-cols-1 gap-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="group/item flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-slate-50"
                        >
                          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 group-hover/item:bg-diagnova-blue/10">
                            {child.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 group-hover/item:text-diagnova-blue">
                              <span>{child.title}</span>
                              <ArrowRight className="h-3 w-3 opacity-0 transition-all -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 text-diagnova-blue" />
                            </div>
                            <p className="text-[11px] text-slate-500 leading-snug truncate">
                              {child.description}
                            </p>
                          </div>
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
        <div className="hidden items-center justify-end gap-5 lg:flex flex-1">
          {/* Animated Smooth Language Switcher */}
          <LanguageSwitcher language={language} setLanguage={setLanguage} />

          {/* Primary CTA: Request Demo */}
          <Link
            href="/request-demo"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-t from-diagnova-blue to-nova-blue hover:from-diagnova-dark hover:to-nova-dark px-5 py-2 text-sm font-medium text-white shadow-md shadow-diagnova-blue/20 hover:shadow-lg hover:shadow-diagnova-blue/30 transition-all duration-200 active:scale-[0.98]"
          >
            Request Demo
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/request-demo"
            className="rounded-full bg-gradient-to-t from-diagnova-blue to-nova-blue px-3.5 py-1.5 text-xs font-medium text-white shadow-sm"
          >
            Demo
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            aria-label="Buka Navigasi"
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
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-5 shadow-lg">
          <div className="space-y-4">
            {navItems.map((item) => (
              <div key={item.label} className="border-b border-slate-100 pb-3">
                <Link
                  href={item.href}
                  className="block text-sm font-semibold text-slate-900 mb-2 hover:text-diagnova-blue"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="grid grid-cols-1 gap-1.5 pl-2.5">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="flex items-center gap-2 text-xs text-slate-600 hover:text-diagnova-blue py-1"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-diagnova-blue" />
                        <span>{child.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="flex items-center justify-between pt-2">
              <LanguageSwitcher language={language} setLanguage={setLanguage} />

              <Link
                href="/request-demo"
                className="rounded-full bg-gradient-to-t from-diagnova-blue to-nova-blue hover:from-diagnova-dark hover:to-nova-dark px-4 py-2 text-xs font-medium text-white shadow-md shadow-diagnova-blue/20"
              >
                Request Demo
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

