"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Menu,
  X,
  Globe,
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

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<"ID" | "EN">("ID");
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-diagnova-navy/95 backdrop-blur-md shadow-lg shadow-diagnova-navy/20 py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo Lockup */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-white transition-opacity hover:opacity-90"
        >
          {/* Stylized DNA / Helix Brand Mark */}
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-diagnova-blue via-nova-blue to-white p-0.5 shadow-md shadow-nova-blue/30">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-diagnova-navy font-display text-base font-black text-white">
              <span className="text-nova-blue">§</span>
              <span className="font-extrabold text-white">D</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg font-bold tracking-wider text-white">
              DIAGNOVA
            </span>
            <span className="text-[9px] font-medium uppercase tracking-widest text-nova-light/80 -mt-1">
              Laboratory Intelligence
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 lg:flex">
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
                  "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
                  pathname.startsWith(item.href)
                    ? "bg-white/15 text-white shadow-sm"
                    : "text-slate-100 hover:bg-white/10 hover:text-white"
                )}
              >
                <span>{item.label}</span>
                {item.children && (
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform duration-200",
                      activeDropdown === item.label && "rotate-180 text-nova-blue"
                    )}
                  />
                )}
              </Link>

              {/* Mega Dropdown Menu */}
              {item.children && activeDropdown === item.label && (
                <div className="absolute left-1/2 top-full -translate-x-1/2 pt-2 w-[440px]">
                  <div className="overflow-hidden rounded-2xl border border-white/15 bg-diagnova-navy/95 p-3 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-1 gap-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="group/item flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-white/10"
                        >
                          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 group-hover/item:bg-nova-blue/20">
                            {child.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 text-sm font-semibold text-white group-hover/item:text-nova-light">
                              <span>{child.title}</span>
                              <ArrowRight className="h-3 w-3 opacity-0 transition-all -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 text-nova-blue" />
                            </div>
                            <p className="text-xs text-slate-300 leading-snug">
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
        <div className="hidden items-center gap-3 lg:flex">
          {/* Language Switcher UI (Placeholder) */}
          <button
            type="button"
            onClick={() => setLanguage(language === "ID" ? "EN" : "ID")}
            className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/90 transition-colors hover:bg-white/15 hover:text-white"
            title="Ganti Bahasa (Placeholder)"
          >
            <Globe className="h-3.5 w-3.5 text-nova-blue" />
            <span>{language}</span>
          </button>

          {/* Primary CTA */}
          <Button
            href="/request-demo"
            variant="secondary"
            size="sm"
            className="font-semibold shadow-nova-blue/30"
          >
            Request Demo
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <Button
            href="/request-demo"
            variant="secondary"
            size="sm"
            className="text-xs px-3 py-1.5"
          >
            Demo
          </Button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20"
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
        <div className="lg:hidden border-t border-white/15 bg-diagnova-navy/98 px-4 py-6 shadow-2xl backdrop-blur-xl">
          <div className="space-y-4">
            {navItems.map((item) => (
              <div key={item.label} className="border-b border-white/10 pb-3">
                <Link
                  href={item.href}
                  className="block text-base font-bold text-white mb-2 hover:text-nova-blue"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="grid grid-cols-1 gap-2 pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="flex items-center gap-2 text-xs text-slate-300 hover:text-nova-light py-1"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-nova-blue" />
                        <span>{child.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setLanguage(language === "ID" ? "EN" : "ID")}
                className="flex items-center gap-2 rounded-lg border border-white/20 px-3 py-1.5 text-xs text-white"
              >
                <Globe className="h-4 w-4 text-nova-blue" />
                <span>Bahasa: {language}</span>
              </button>

              <Button href="/request-demo" variant="secondary" size="sm">
                Request Demo
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
