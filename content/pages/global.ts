// Konten global (Announcement Bar, Navbar, Footer) yang dikelola CMS.
// Nilai di bawah adalah default/seed; konten aktif dimuat lewat getPageContent(globalPage).
import type { CmsPageDefinition } from "@/lib/cms/types";

export const globalPage = {
  pageKey: "global",
  sections: {
    announcement: {
      label: "Announcement Bar",
      content: {
        prompt: {
          id: "Pilih kebutuhan laboratorium Anda untuk memulai. Saya ingin...",
          en: "Select your laboratory goal to get started. I want to..."
        },
        items: [
          {
            id: "demo",
            label: {
              id: "Request Demo",
              en: "Request a Demo"
            },
            targetId: "cta-banner",
            href: "/request-demo"
          },
          {
            id: "workflow",
            label: {
              id: "Lihat Workflow Lab",
              en: "Explore Lab Workflow"
            },
            targetId: "workflow",
            href: ""
          },
          {
            id: "analyzers",
            label: {
              id: "Koneksi 500+ Alat",
              en: "500+ Analyzers"
            },
            targetId: "infrastructure",
            href: ""
          },
          {
            id: "satusehat",
            label: {
              id: "Integrasi SATUSEHAT",
              en: "SATUSEHAT Bridging"
            },
            targetId: "infrastructure",
            href: ""
          },
          {
            id: "comparison",
            label: {
              id: "Kenapa Diagnova",
              en: "Why Choose Diagnova"
            },
            targetId: "comparison",
            href: ""
          }
        ]
      },
    },
    navigation: {
      label: "Navigasi (Navbar)",
      content: {
        logoUrl: "/images/logo-nav.png",
        logoAlt: "Diagnova",
        logoHref: "/",
        items: [
          {
            id: "platform",
            label: {
              id: "Platform",
              en: "Platform"
            },
            href: "/platform",
            children: [
              {
                id: "platform-overview",
                title: {
                  id: "Gambaran Platform",
                  en: "Platform Overview"
                },
                description: {
                  id: "Buku catatan super pintar yang menghubungkan instrumen lab dengan dokter",
                  en: "A smart notebook connecting lab instruments with physicians seamlessly"
                },
                href: "/platform",
                iconName: "Layers",
                accent: "diagnova-blue"
              },
              {
                id: "platform-workflow",
                title: {
                  id: "Alur Kerja",
                  en: "Workflow"
                },
                description: {
                  id: "Alur kerja 4 tahap dari penerimaan sampel hingga rilis hasil ke dokter",
                  en: "4-stage workflow from sample receipt to result release to physicians"
                },
                href: "/platform#workflow",
                iconName: "Activity",
                accent: "diagnova-blue"
              },
              {
                id: "platform-automation",
                title: {
                  id: "100% Otomasi",
                  en: "100% Automation"
                },
                description: {
                  id: "Antarmuka analyzer langsung & verifikasi otomatis memangkas TAT 70%",
                  en: "Direct analyzer interfacing & auto-verification cutting TAT by 70%"
                },
                href: "/platform#automation",
                iconName: "Cpu",
                accent: "diagnova-blue"
              },
              {
                id: "platform-reporting",
                title: {
                  id: "Pelaporan & Jejak Audit",
                  en: "Reporting & Audit Trail"
                },
                description: {
                  id: "Rekam jejak digital transparan untuk setiap perubahan hasil sampel",
                  en: "Transparent digital trail for every sample result change"
                },
                href: "/platform#reporting",
                iconName: "ShieldCheck",
                accent: "diagnova-blue"
              },
              {
                id: "platform-analytics",
                title: {
                  id: "Analitik & Inteligensi",
                  en: "Analytics & Intelligence"
                },
                description: {
                  id: "Pemanfaatan insight data lab untuk mendukung efisiensi & Nova AI",
                  en: "Leverage lab data insights to drive efficiency & power Nova AI"
                },
                href: "/platform#analytics",
                iconName: "Sparkles",
                accent: "nova-blue"
              }
            ]
          },
          {
            id: "solutions",
            label: {
              id: "Solusi",
              en: "Solutions"
            },
            href: "/solutions",
            children: [
              {
                id: "solutions-hospital-laboratory",
                title: {
                  id: "Laboratorium Rumah Sakit",
                  en: "Hospital Laboratory"
                },
                description: {
                  id: "Solusi terpadu lab pusat, IGD, dan ICU dengan bridging SIMRS/RME",
                  en: "Unified solution for central lab, ER, and ICU with HIS/EMR bridging"
                },
                href: "/solutions#hospital-laboratory",
                iconName: "Building2",
                accent: "diagnova-blue"
              },
              {
                id: "solutions-clinical-laboratory",
                title: {
                  id: "Laboratorium Klinik",
                  en: "Clinical Laboratory"
                },
                description: {
                  id: "Kecepatan registrasi, MCU massal, dan portal hasil pasien online",
                  en: "Fast registration, mass check-ups, and online patient result portal"
                },
                href: "/solutions#clinical-laboratory",
                iconName: "Stethoscope",
                accent: "nova-blue"
              },
              {
                id: "solutions-pathology",
                title: {
                  id: "Patologi Anatomi",
                  en: "Anatomical Pathology"
                },
                description: {
                  id: "Pelacakan spesimen jaringan ketat & integrasi patologi digital",
                  en: "Strict tissue specimen tracking & digital pathology integration"
                },
                href: "/solutions#pathology",
                iconName: "Microscope",
                accent: "diagnova-blue"
              },
              {
                id: "solutions-microbiology",
                title: {
                  id: "Mikrobiologi & PPRA",
                  en: "Microbiology & PPRA"
                },
                description: {
                  id: "Kultur bakteri, uji kepekaan antibiotik, dan kalkulasi antibiogram",
                  en: "Bacterial culture, antibiotic sensitivity testing, and antibiogram calculation"
                },
                href: "/solutions#microbiology",
                iconName: "FlaskConical",
                accent: "nova-blue"
              },
              {
                id: "solutions-blood-bank",
                title: {
                  id: "Bank Darah & Transfusi",
                  en: "Blood Bank & Transfusion"
                },
                description: {
                  id: "Kontrol rantai dingin, validasi crossmatch, dan zero wastage",
                  en: "Cold chain control, crossmatch validation, and zero wastage"
                },
                href: "/solutions#blood-bank",
                iconName: "HeartPulse",
                accent: "rose"
              },
              {
                id: "solutions-nova-ai",
                title: {
                  id: "Nova AI Inteligensi",
                  en: "Nova AI Intelligence"
                },
                description: {
                  id: "Asisten AI cerdas: mendeteksi anomali & merangkum angka klinis",
                  en: "Smart AI assistant: detects anomalies & summarizes clinical figures"
                },
                href: "/solutions#nova-ai",
                iconName: "Sparkles",
                accent: "amber"
              }
            ]
          },
          {
            id: "modules",
            label: {
              id: "Modul",
              en: "Modules"
            },
            href: "/modules",
            children: [
              {
                id: "modules-routine-hematology",
                title: {
                  id: "Rutin & Hematologi",
                  en: "Routine & Hematology"
                },
                description: {
                  id: "Pemeriksaan darah harian & kimia klinik bervolume tinggi",
                  en: "Daily blood tests & high-volume clinical chemistry processing"
                },
                href: "/modules#routine-hematology",
                iconName: "Activity",
                accent: "diagnova-blue"
              },
              {
                id: "modules-blood-bank",
                title: {
                  id: "Bank Darah",
                  en: "Blood Bank"
                },
                description: {
                  id: "Ketersediaan, masa kedaluwarsa, crossmatching, dan distribusi darah",
                  en: "Availability, expiry tracking, crossmatching, and blood distribution"
                },
                href: "/modules#blood-bank",
                iconName: "HeartPulse",
                accent: "rose"
              },
              {
                id: "modules-inventory-reagent",
                title: {
                  id: "Inventaris & Reagen",
                  en: "Inventory & Reagent"
                },
                description: {
                  id: "Pantau stok reagen real-time & cegah kehabisan saat shift berjalan",
                  en: "Real-time reagent stock monitoring & prevent stock-outs during shifts"
                },
                href: "/modules#inventory-reagent",
                iconName: "Cpu",
                accent: "nova-blue"
              },
              {
                id: "modules-pathology",
                title: {
                  id: "Patologi",
                  en: "Pathology"
                },
                description: {
                  id: "Pencatatan histopatologi & sitologi dengan pelacakan kaset/slide",
                  en: "Histopathology & cytology recording with cassette/slide tracking"
                },
                href: "/modules#pathology",
                iconName: "Microscope",
                accent: "diagnova-blue"
              },
              {
                id: "modules-microbiology",
                title: {
                  id: "Mikrobiologi",
                  en: "Microbiology"
                },
                description: {
                  id: "Identifikasi kuman, kultur bakteri, dan uji resistensi antibiotik",
                  en: "Germ identification, bacterial culture, and antibiotic resistance testing"
                },
                href: "/modules#microbiology",
                iconName: "FlaskConical",
                accent: "nova-blue"
              }
            ]
          },
          {
            id: "nova-ai",
            label: {
              id: "Nova AI",
              en: "Nova AI"
            },
            href: "/nova-ai",
            children: [
              {
                id: "nova-ai-overview",
                title: {
                  id: "Gambaran Nova AI",
                  en: "Nova AI Overview"
                },
                description: {
                  id: "Mengubah angka medis rumit menjadi kalimat ringkas & dapat ditindaklanjuti",
                  en: "Turning complex medical numbers into concise & actionable summaries"
                },
                href: "/nova-ai",
                iconName: "Sparkles",
                accent: "nova-blue"
              },
              {
                id: "nova-ai-how-it-works",
                title: {
                  id: "Cara Kerja (4 Tahap)",
                  en: "How It Works (4 Steps)"
                },
                description: {
                  id: "Membaca Pola → Menerjemahkan Angka → Notifikasi Cepat → Validasi Dokter",
                  en: "Read Patterns → Translate Numbers → Fast Alerts → Doctor Validation"
                },
                href: "/nova-ai#how-it-works",
                iconName: "Activity",
                accent: "diagnova-blue"
              },
              {
                id: "nova-ai-ai-doctor",
                title: {
                  id: "AI + Dokter (Etika & Kolaborasi)",
                  en: "AI + Doctor (Ethics & Collaboration)"
                },
                description: {
                  id: "AI membantu. Dokter memutuskan. Penegasan peran manusia dalam keputusan klinis",
                  en: "AI assists. Doctors decide. Affirming the human role in clinical decisions"
                },
                href: "/nova-ai#ai-doctor",
                iconName: "ShieldCheck",
                accent: "emerald"
              }
            ]
          },
          {
            id: "integration",
            label: {
              id: "Integrasi",
              en: "Integration"
            },
            href: "/integration",
            children: [
              {
                id: "integration-overview",
                title: {
                  id: "Gambaran Integrasi",
                  en: "Integration Overview"
                },
                description: {
                  id: "Konektivitas siap pakai dengan sistem & instrumen laboratorium Anda",
                  en: "Ready-to-use connectivity with your lab systems & instruments"
                },
                href: "/integration",
                iconName: "Network",
                accent: "diagnova-blue"
              },
              {
                id: "integration-simrs-his",
                title: {
                  id: "SIMRS / HIS",
                  en: "HIS / EMR"
                },
                description: {
                  id: "Bridging native dua arah untuk penerimaan order & rilis hasil",
                  en: "Native two-way bridging for order reception & result release"
                },
                href: "/integration#simrs-his",
                iconName: "Building2",
                accent: "nova-blue"
              },
              {
                id: "integration-rme",
                title: {
                  id: "RME (Rekam Medis Elektronik)",
                  en: "Electronic Medical Records"
                },
                description: {
                  id: "Kepatuhan Permenkes 24/2022 dengan riwayat lab longitudinal",
                  en: "Compliance with national health data standards & longitudinal lab history"
                },
                href: "/integration#rme",
                iconName: "Activity",
                accent: "diagnova-blue"
              },
              {
                id: "integration-analyzer",
                title: {
                  id: "500+ Analyzer",
                  en: "500+ Analyzers"
                },
                description: {
                  id: "Antarmuka langsung dengan instrumen Roche, Abbott, Sysmex, Mindray, dll",
                  en: "Direct interfacing with Roche, Abbott, Sysmex, Mindray instruments & more"
                },
                href: "/integration#analyzer",
                iconName: "Cpu",
                accent: "nova-blue"
              },
              {
                id: "integration-satusehat",
                title: {
                  id: "SATUSEHAT Kemenkes",
                  en: "SATUSEHAT (National Health)"
                },
                description: {
                  id: "Interoperabilitas HL7 FHIR standar data kesehatan nasional",
                  en: "HL7 FHIR interoperability with national health data standards"
                },
                href: "/integration#satusehat",
                iconName: "ShieldCheck",
                accent: "emerald"
              },
              {
                id: "integration-connectivity",
                title: {
                  id: "Smart Resilient Gateway",
                  en: "Smart Resilient Gateway"
                },
                description: {
                  id: "Koneksi tangguh HL7/ASTM dengan Offline Edge Buffer & Uptime 99,9%",
                  en: "Robust HL7/ASTM connection with Offline Edge Buffer & 99.9% Uptime"
                },
                href: "/integration#connectivity",
                iconName: "Network",
                accent: "diagnova-blue"
              }
            ]
          }
        ],
        ctaLabel: {
          id: "Minta Demo",
          en: "Request Demo"
        },
        ctaMobileLabel: {
          id: "Demo",
          en: "Demo"
        },
        ctaHref: "/request-demo",
        mobileMenuAriaLabel: {
          id: "Buka Navigasi",
          en: "Open Navigation"
        }
      },
    },
    footer: {
      label: "Footer",
      content: {
        logoUrl: "/images/logo-diagnova.svg",
        logoAlt: "Diagnova",
        logoHref: "/",
        copyright: "© 2026 Diagnova by PT Tiba Tiba Agency.",
        legalLinks: [
          {
            id: "terms",
            label: {
              id: "Syarat & Ketentuan",
              en: "Terms of Service"
            },
            href: "/terms"
          },
          {
            id: "privacy",
            label: {
              id: "Kebijakan Privasi",
              en: "Privacy Policy"
            },
            href: "/platform/reporting"
          }
        ],
        columns: [
          {
            id: "platform",
            title: {
              id: "Platform",
              en: "Platform"
            },
            links: [
              {
                id: "platform-1",
                label: {
                  id: "Gambaran Platform",
                  en: "Overview"
                },
                href: "/platform"
              },
              {
                id: "platform-2",
                label: {
                  id: "Alur Kerja",
                  en: "Workflow"
                },
                href: "/platform/workflow"
              },
              {
                id: "platform-3",
                label: {
                  id: "100% Otomasi",
                  en: "100% Automation"
                },
                href: "/platform/automation"
              },
              {
                id: "platform-4",
                label: {
                  id: "Pelaporan & Audit",
                  en: "Reporting & Audit"
                },
                href: "/platform/reporting"
              },
              {
                id: "platform-5",
                label: {
                  id: "Analitik Lab",
                  en: "Lab Analytics"
                },
                href: "/platform/analytics"
              },
              {
                id: "platform-6",
                label: {
                  id: "Nova AI Copilot",
                  en: "Nova AI Copilot"
                },
                href: "/nova-ai"
              }
            ]
          },
          {
            id: "solutions",
            title: {
              id: "Solusi",
              en: "Solutions"
            },
            links: [
              {
                id: "solutions-1",
                label: {
                  id: "Gambaran Solusi",
                  en: "Overview"
                },
                href: "/solutions"
              },
              {
                id: "solutions-2",
                label: {
                  id: "Laboratorium Rumah Sakit",
                  en: "Hospital Laboratory"
                },
                href: "/solutions/hospital-laboratory"
              },
              {
                id: "solutions-3",
                label: {
                  id: "Laboratorium Klinik",
                  en: "Clinical Laboratory"
                },
                href: "/solutions/clinical-laboratory"
              },
              {
                id: "solutions-4",
                label: {
                  id: "Pusat Medical Check Up",
                  en: "Health Screening Center"
                },
                href: "/solutions/health-screening"
              },
              {
                id: "solutions-5",
                label: {
                  id: "Laboratorium Multi-Cabang",
                  en: "Multi-branch Laboratory"
                },
                href: "/solutions/multi-branch"
              },
              {
                id: "solutions-6",
                label: {
                  id: "Cara Kerja Nova AI",
                  en: "How Nova AI Works"
                },
                href: "/nova-ai/how-it-works"
              }
            ]
          },
          {
            id: "modules",
            title: {
              id: "Modul",
              en: "Modules"
            },
            links: [
              {
                id: "modules-1",
                label: {
                  id: "Gambaran Modul",
                  en: "Overview"
                },
                href: "/modules"
              },
              {
                id: "modules-2",
                label: {
                  id: "Rutin & Hematologi",
                  en: "Routine & Hematology"
                },
                href: "/modules/routine-hematology"
              },
              {
                id: "modules-3",
                label: {
                  id: "Kimia Klinik",
                  en: "Clinical Chemistry"
                },
                href: "/modules/clinical-chemistry"
              },
              {
                id: "modules-4",
                label: {
                  id: "Manajemen Bank Darah",
                  en: "Blood Bank Management"
                },
                href: "/modules/blood-bank"
              },
              {
                id: "modules-5",
                label: {
                  id: "Inventaris & Reagen",
                  en: "Inventory & Reagent"
                },
                href: "/modules/inventory-reagent"
              },
              {
                id: "modules-6",
                label: {
                  id: "Patologi Anatomi",
                  en: "Anatomical Pathology"
                },
                href: "/modules/pathology"
              }
            ]
          },
          {
            id: "integration",
            title: {
              id: "Integrasi",
              en: "Integration"
            },
            links: [
              {
                id: "integration-1",
                label: {
                  id: "Gambaran Integrasi",
                  en: "Overview"
                },
                href: "/integration"
              },
              {
                id: "integration-2",
                label: {
                  id: "Bridging SIMRS / HIS",
                  en: "SIMRS / HIS Bridging"
                },
                href: "/integration/simrs-his"
              },
              {
                id: "integration-3",
                label: {
                  id: "Rekam Medis (RME)",
                  en: "Electronic Medical Record (EMR)"
                },
                href: "/integration/rme"
              },
              {
                id: "integration-4",
                label: {
                  id: "500+ Analyzer Medis",
                  en: "500+ Medical Analyzers"
                },
                href: "/integration/analyzer"
              },
              {
                id: "integration-5",
                label: {
                  id: "SATUSEHAT Kemenkes",
                  en: "SATUSEHAT Kemenkes"
                },
                href: "/integration/satusehat"
              }
              // Tautan "Portal Admin LIS" sengaja dihapus: area admin tidak boleh ditautkan dari halaman publik.
            ]
          }
        ],
        watermarkUrl: "/images/logo-diagnova.svg",
        watermarkAlt: "Diagnova Brand Watermark"
      },
    },
  },
} satisfies CmsPageDefinition;

export type GlobalPageContent = {
  [K in keyof typeof globalPage.sections]: (typeof globalPage.sections)[K]["content"] | null;
};
export type AnnouncementContent = typeof globalPage.sections.announcement.content;
export type NavigationContent = typeof globalPage.sections.navigation.content;
export type FooterContent = typeof globalPage.sections.footer.content;
