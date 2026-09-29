"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
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
import { Button } from "@/components/ui/Button";
import { BrandLogo } from "@/components/ui/BrandLogo";

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
        icon: <Layers className="h-4 w-4 text-diagnova-blue" />,
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
        icon: <Cpu className="h-4 w-4 text-diagnova-blue" />,
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

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<"ID" | "EN">("ID");
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md transition-all duration-200 border-b",
        isScrolled
          ? "border-slate-200/80 shadow-sm py-3"
          : "border-slate-100 py-3.5"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo Lockup */}
        <BrandLogo variant="dark" />

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors duration-150",
                    isActive
                      ? "text-diagnova-blue font-semibold bg-diagnova-ice/60"
                      : "text-slate-600 hover:text-diagnova-navy hover:bg-slate-100/70"
                  )}
                >
                  <span>{item.label}</span>
                  {item.children && (
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform duration-200 text-slate-400",
                        activeDropdown === item.label && "rotate-180 text-diagnova-blue"
                      )}
                    />
                  )}
                </Link>

                {/* Mega Dropdown Menu */}
                {item.children && activeDropdown === item.label && (
                  <div className="absolute left-1/2 top-full -translate-x-1/2 pt-2 w-[420px]">
                    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white p-2.5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="grid grid-cols-1 gap-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="group/item flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-diagnova-ice/50"
                          >
                            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 group-hover/item:bg-diagnova-light/60">
                              {child.icon}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5 text-xs font-semibold text-diagnova-navy group-hover/item:text-diagnova-blue">
                                <span>{child.title}</span>
                                <ArrowRight className="h-3 w-3 opacity-0 transition-all -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 text-diagnova-blue" />
                              </div>
                              <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
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
            );
          })}
        </nav>

        {/* Right Section: Language Switcher & Request Demo Button */}
        <div className="hidden items-center gap-3 lg:flex">
          {/* Language Selector UI matching Figma */}
          <div className="flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-slate-50 px-2.5 py-1 text-xs text-slate-600">
            <button
              type="button"
              onClick={() => setLanguage("ID")}
              className={cn(
                "flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-semibold transition-colors",
                language === "ID"
                  ? "bg-white text-diagnova-navy shadow-xs"
                  : "text-slate-400 hover:text-slate-600"
              )}
              title="Bahasa Indonesia"
            >
              {/* Flag ID SVG */}
              <svg className="h-3 w-4 rounded-xs overflow-hidden" viewBox="0 0 640 480">
                <g fillRule="evenodd" strokeWidth="1pt">
                  <path fill="#e70011" d="M0 0h640v240H0z"/>
                  <path fill="#fff" d="M0 240h640v240H0z"/>
                </g>
              </svg>
              <span>ID</span>
            </button>
            <span className="text-slate-300">|</span>
            <button
              type="button"
              onClick={() => setLanguage("EN")}
              className={cn(
                "flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-semibold transition-colors",
                language === "EN"
                  ? "bg-white text-diagnova-navy shadow-xs"
                  : "text-slate-400 hover:text-slate-600"
              )}
              title="English"
            >
              {/* Flag EN/UK SVG */}
              <svg className="h-3 w-4 rounded-xs overflow-hidden" viewBox="0 0 640 480">
                <path fill="#012169" d="M0 0h640v480H0z"/>
                <path fill="#FFF" d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-179L0 64V0h75z"/>
                <path fill="#C8102E" d="m424 288 216 159v33h-44L380 321l44-33zM640 0v10L446 156l-43-32L601 0h39zM0 480v-10l194-145 43 32L39 480H0zM0 0l217 161-44 33L0 33V0z"/>
                <path fill="#FFF" d="M240 0v480h160V0H240zM0 160v160h640V160H0z"/>
                <path fill="#C8102E" d="M267 0v480h106V0H267zM0 187v106h640V187H0z"/>
              </svg>
              <span>EN</span>
            </button>
          </div>

          {/* Primary CTA matching Figma blue button */}
          <Button
            href="/request-demo"
            variant="primary"
            size="sm"
            className="font-semibold px-4 py-2 rounded-full shadow-xs"
          >
            Request Demo
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <Button
            href="/request-demo"
            variant="primary"
            size="sm"
            className="text-xs px-3 py-1.5 rounded-full"
          >
            Demo
          </Button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100"
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
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-5 shadow-xl animate-in fade-in duration-150">
          <div className="space-y-3">
            {navItems.map((item) => (
              <div key={item.label} className="border-b border-slate-100 pb-2.5">
                <Link
                  href={item.href}
                  className="block text-sm font-bold text-diagnova-navy mb-1.5 hover:text-diagnova-blue"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="grid grid-cols-1 gap-1 pl-2">
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
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span>Bahasa:</span>
                <button
                  type="button"
                  onClick={() => setLanguage(language === "ID" ? "EN" : "ID")}
                  className="font-bold text-diagnova-blue underline"
                >
                  {language === "ID" ? "Indonesia (ID)" : "English (EN)"}
                </button>
              </div>

              <Button href="/request-demo" variant="primary" size="sm" className="rounded-full">
                Request Demo
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
