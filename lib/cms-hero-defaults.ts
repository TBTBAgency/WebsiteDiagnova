/**
 * Teks bawaan CTA & metrik hero halaman dalam. DIHASILKAN dari literal yang sebelumnya
 * hardcoded di *PageClient.tsx (tanpa perubahan isi), dipakai sebagai fallback dan sebagai
 * placeholder editor admin. Nilai yang diedit admin disimpan di page_*.extraContent.hero.
 */
import type { HeroDefaults } from "@/lib/cms-hero";

export const HERO_DEFAULTS: Record<"platform" | "solutions" | "modules" | "nova_ai" | "integration", HeroDefaults> = {
  "platform": {
    "primaryCta": {
      "textId": "Jadwalkan Demo Platform",
      "textEn": "Schedule Platform Demo",
      "url": "/request-demo"
    },
    "secondaryCta": {
      "textId": "Pelajari Alur Kerja",
      "textEn": "Explore Workflow",
      "url": "#workflow"
    },
    "metrics": [
      {
        "id": "m1",
        "valueId": "-70%",
        "valueEn": "-70%",
        "labelId": "Pangkas TAT",
        "labelEn": "Cut Turnaround Time",
        "subId": "Dari order ke klinisi",
        "subEn": "Order to clinician",
        "isActive": true
      },
      {
        "id": "m2",
        "valueId": "100%",
        "valueEn": "100%",
        "labelId": "Otomasi Interfacing",
        "labelEn": "Direct Interfacing",
        "subId": "Eliminasi entri manual",
        "subEn": "Zero manual entry",
        "isActive": true
      },
      {
        "id": "m3",
        "valueId": "0 Error",
        "valueEn": "0 Error",
        "labelId": "Salah Sampel",
        "labelEn": "Sample Mix-ups",
        "subId": "Verifikasi barcode 2D",
        "subEn": "2D barcode check",
        "isActive": true
      },
      {
        "id": "m4",
        "valueId": "ISO 15189",
        "valueEn": "ISO 15189",
        "labelId": "Kepatuhan Audit",
        "labelEn": "Audit Compliance",
        "subId": "KARS & JCI compliant",
        "subEn": "KARS & JCI compliant",
        "isActive": true
      }
    ]
  },
  "solutions": {
    "primaryCta": {
      "textId": "Jadwalkan Konsultasi Solusi",
      "textEn": "Schedule Solutions Consultation",
      "url": "/request-demo"
    },
    "secondaryCta": {
      "textId": "Eksplorasi Solusi Fasilitas",
      "textEn": "Explore Facility Solutions",
      "url": "#facility-solutions"
    },
    "metrics": [
      {
        "id": "m1",
        "valueId": "-60%",
        "valueEn": "-60%",
        "labelId": "Pangkas Waktu Antre",
        "labelEn": "Cut Queue Time",
        "subId": "Registrasi cepat MCU & RS",
        "subEn": "Fast MCU & Hospital check-in",
        "isActive": true
      },
      {
        "id": "m2",
        "valueId": "100%",
        "valueEn": "100%",
        "labelId": "Bridging SIMRS & RME",
        "labelEn": "HIS & EMR Bridging",
        "subId": "Dua arah & real-time",
        "subEn": "Bidirectional & real-time",
        "isActive": true
      },
      {
        "id": "m3",
        "valueId": "ISO 15189",
        "valueEn": "ISO 15189",
        "labelId": "Kesiapan Akreditasi",
        "labelEn": "Accreditation Ready",
        "subId": "KARS, JCI & Kemenkes",
        "subEn": "KARS & JCI compliant",
        "isActive": true
      },
      {
        "id": "m4",
        "valueId": "5 Sektor",
        "valueEn": "5 Verticals",
        "labelId": "Solusi Terdedikasi",
        "labelEn": "Dedicated Modules",
        "subId": "RS, MCU, PA, Mikro, BDRS",
        "subEn": "Hospital, MCU, PA, Micro, BDRS",
        "isActive": true
      }
    ]
  },
  "modules": {
    "primaryCta": {
      "textId": "Jadwalkan Demo Modul",
      "textEn": "Schedule Module Demo",
      "url": "/request-demo"
    },
    "secondaryCta": {
      "textId": "Eksplorasi 5 Modul",
      "textEn": "Explore 5 Modules",
      "url": "#modules-explorer"
    },
    "metrics": [
      {
        "id": "m1",
        "valueId": "5 Modul",
        "valueEn": "5 Modules",
        "labelId": "Spesialisasi Lengkap",
        "labelEn": "Dedicated Modules",
        "subId": "Rutin, BDRS, Stok, PA, Mikro",
        "subEn": "Hematology, Blood, Reagents, PA",
        "isActive": true
      },
      {
        "id": "m2",
        "valueId": "100%",
        "valueEn": "100%",
        "labelId": "Interfacing Analyzer",
        "labelEn": "Analyzer Interfacing",
        "subId": "ASTM & HL7 bidireksional",
        "subEn": "Direct bidirectional protocol",
        "isActive": true
      },
      {
        "id": "m3",
        "valueId": "0 Error",
        "valueEn": "0 Error",
        "labelId": "Salah Identifikasi",
        "labelEn": "Zero Sample Mix-ups",
        "subId": "Barcode 2D & delta-check",
        "subEn": "2D micro-barcode tracking",
        "isActive": true
      },
      {
        "id": "m4",
        "valueId": "Plug & Play",
        "valueEn": "Plug & Play",
        "labelId": "Aktivasi Modular",
        "labelEn": "Modular Activation",
        "subId": "Bebas tambah modul bertahap",
        "subEn": "Deploy on-demand per dept",
        "isActive": true
      }
    ]
  },
  "nova_ai": {
    "primaryCta": {
      "textId": "Jadwalkan Demo Nova AI",
      "textEn": "Schedule Nova AI Demo",
      "url": "/request-demo"
    },
    "secondaryCta": {
      "textId": "Lihat Meja Kerja Patologi",
      "textEn": "Explore Pathologist Desk",
      "url": "#workstation-demo"
    },
    "metrics": [
      {
        "id": "m1",
        "valueId": "-70%",
        "valueEn": "-70%",
        "labelId": "Pangkas Waktu Validasi",
        "labelEn": "Turnaround Time (TAT)",
        "subId": "Auto-verifikasi sampel normal",
        "subEn": "Auto-release normal routine",
        "isActive": true
      },
      {
        "id": "m2",
        "valueId": "< 3 Detik",
        "valueEn": "< 3 Sec",
        "labelId": "Kalkulasi Delta-Check",
        "labelEn": "Delta-Check Speed",
        "subId": "Komparasi riwayat serial",
        "subEn": "Serial trend comparison",
        "isActive": true
      },
      {
        "id": "m3",
        "valueId": "100%",
        "valueEn": "100%",
        "labelId": "Kendali Dokter Sp.PK",
        "labelEn": "Physician Sovereignty",
        "subId": "Human-in-the-loop mutlak",
        "subEn": "Absolute clinical control",
        "isActive": true
      },
      {
        "id": "m4",
        "valueId": "KARS & ISO",
        "valueEn": "KARS & ISO",
        "labelId": "Kepatuhan Akreditasi",
        "labelEn": "Audit Compliance",
        "subId": "Standar pelaporan nilai kritis",
        "subEn": "Accredited critical protocol",
        "isActive": true
      }
    ]
  },
  "integration": {
    "primaryCta": {
      "textId": "Jadwalkan Konsultasi Integrasi",
      "textEn": "Schedule Integration Consultation",
      "url": "/request-demo"
    },
    "secondaryCta": {
      "textId": "Eksplorasi Alur Integrasi",
      "textEn": "Explore Integration Flow",
      "url": "#integration-explorer"
    },
    "metrics": [
      {
        "id": "m1",
        "valueId": "500+ Mesin",
        "valueEn": "500+ Analyzers",
        "labelId": "Analyzer Teruji",
        "labelEn": "Supported Analyzers",
        "subId": "Roche, Sysmex, Abbott, Mindray",
        "subEn": "Roche, Sysmex, Abbott, Mindray",
        "isActive": true
      },
      {
        "id": "m2",
        "valueId": "HL7 & FHIR",
        "valueEn": "HL7 & FHIR",
        "labelId": "Standar Kemenkes RI",
        "labelEn": "National Health Standard",
        "subId": "SATUSEHAT & Permenkes 24/2022",
        "subEn": "SATUSEHAT & Permenkes 24/2022",
        "isActive": true
      },
      {
        "id": "m3",
        "valueId": "0 Double Entry",
        "valueEn": "0 Double Entry",
        "labelId": "Bridging SIMRS Dua Arah",
        "labelEn": "Bidirectional HIS Bridging",
        "subId": "Order & billing otomatis realtime",
        "subEn": "Real-time automatic order & billing",
        "isActive": true
      },
      {
        "id": "m4",
        "valueId": "72 Jam",
        "valueEn": "72 Hours",
        "labelId": "Buffer Offline Edge",
        "labelEn": "Offline Resilient Edge",
        "subId": "Zero data loss saat jaringan putus",
        "subEn": "Zero data loss during downtime",
        "isActive": true
      }
    ]
  }
};
