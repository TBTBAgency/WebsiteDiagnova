/**
 * Tata letak halaman CMS (urutan, aktif/nonaktif, teks header section, dan section kustom).
 *
 * Disimpan di tabel cms_sections (TANPA tabel baru) sebagai satu baris per halaman:
 *   sectionKey = "layout_<page>"   extraContent = { sections: StoredSection[] }
 * Baris dibuat hanya ketika admin menyimpan tata letak; bila belum ada, halaman memakai
 * urutan & teks bawaan di registry ini sehingga tampilan tidak berubah.
 *
 * Modul ini aman untuk client & server (tanpa import server-only).
 */

import type { CmsPageHero } from "@/lib/cms-hero";

/** Props CMS yang diterima client component halaman dalam dari server page. */
export interface InnerPageCmsProps {
  cmsHero?: CmsPageHero | null;
  layout?: ResolvedSection[] | null;
  cta?: { section?: unknown } | null;
}

export type CmsPageKey ="home" | "platform" | "solutions" | "modules" | "nova_ai" | "integration";
export type Lang = "ID" | "EN";
type Bilingual = [id: string, en: string];

export interface SectionDefaults {
  badge?: Bilingual;
  title?: Bilingual;
  subtitle?: Bilingual;
}

export interface SectionDefinition {
  key: string;
  label: string;
  /** Section yang selalu tampil dan selalu di posisi pertama (hero). */
  locked?: boolean;
  /** Anchor (#id) yang dipakai menu navigasi; ditampilkan sebagai peringatan di admin. */
  anchor?: string;
  /** Teks header bawaan; bila ada, admin dapat menimpa badge/judul/deskripsi section ini. */
  defaults?: SectionDefaults;
  /** Catatan untuk admin, mis. lokasi editor konten section. */
  note?: string;
}

export interface CmsPageDefinition {
  key: CmsPageKey;
  label: string;
  path: string;
  /** Baris CmsSection berisi hero halaman (badge/judul/subjudul); null untuk homepage. */
  heroSectionKey: string | null;
  sections: SectionDefinition[];
}

export interface SectionTextContent {
  badgeId?: string;
  badgeEn?: string;
  titleId?: string;
  titleEn?: string;
  subtitleId?: string;
  subtitleEn?: string;
}

export interface CustomSectionContent extends SectionTextContent {
  imageUrl?: string;
  imageAlt?: string;
  ctaTextId?: string;
  ctaTextEn?: string;
  ctaUrl?: string;
}

export interface StoredSection {
  key: string;
  type: "builtin" | "custom";
  isActive: boolean;
  sortOrder: number;
  content?: CustomSectionContent;
}

export interface ResolvedSection extends StoredSection {
  label: string;
  locked: boolean;
  anchor?: string;
  defaults?: SectionDefaults;
  note?: string;
}

export const LAYOUT_SECTION_PREFIX = "layout_";
export const layoutSectionKey = (page: CmsPageKey) => `${LAYOUT_SECTION_PREFIX}${page}`;
export const CUSTOM_KEY_PATTERN = /^custom-[a-z0-9-]{4,40}$/;

const HOME_NOTE = "Konten diedit di tab Homepage pada CMS Hub.";

export const CMS_PAGES: CmsPageDefinition[] = [
  {
    key: "home",
    label: "Homepage",
    path: "/",
    heroSectionKey: null,
    sections: [
      { key: "hero", label: "Hero Slider", locked: true, note: HOME_NOTE },
      { key: "trusted_by", label: "Dipercaya Oleh (Logo Mitra)", note: HOME_NOTE },
      { key: "about", label: "Tentang Diagnova", note: HOME_NOTE },
      { key: "comparison", label: "Perbandingan", anchor: "comparison", note: HOME_NOTE },
      { key: "workflow", label: "Alur Kerja", anchor: "workflow", note: HOME_NOTE },
      { key: "infrastructure", label: "Infrastruktur", anchor: "infrastructure", note: HOME_NOTE },
      { key: "testimonials", label: "Testimoni", note: HOME_NOTE },
      { key: "faq", label: "FAQ", note: "Konten diedit di menu Konten Global › FAQ." },
      { key: "cta", label: "CTA Penutup", anchor: "cta-banner", note: HOME_NOTE },
    ],
  },
  {
    key: "platform",
    label: "Platform",
    path: "/platform",
    heroSectionKey: "page_platform",
    sections: [
      { key: "hero", label: "Hero Halaman", locked: true },
      { key: "workflow", label: "Alur Kerja 4 Tahap", anchor: "workflow", note: "Komponen Alur Kerja bersama (teks bawaan)." },
      {
        key: "automation",
        label: "Otomatisasi 100%",
        anchor: "automation",
        defaults: {
          badge: ["Otomatisasi 100%", "100% Automation"],
          title: ["Interfacing Dua Arah dengan 500+ Instrumen Medis", "Direct Bidirectional Interfacing with 500+ Medical Analyzers"],
          subtitle: [
            "Mengeliminasi entri data manual sepenuhnya. Diagnova berkomunikasi langsung dua arah dengan instrumen laboratorium melalui protokol HL7 dan ASTM standar internasional.",
            "Completely eliminate manual data entry. Diagnova establishes native two-way communication with any laboratory instrument brand via industry-standard HL7 and ASTM protocols.",
          ],
        },
      },
      {
        key: "reporting",
        label: "Kepatuhan & Jejak Audit",
        anchor: "reporting",
        defaults: {
          badge: ["Kepatuhan & Akreditasi", "Compliance & Accreditation"],
          title: ["Jejak Audit Digital Permanen,\nStandar KARS & ISO 15189", "Permanent Digital Audit Trail,\nKARS & ISO 15189 Ready"],
          subtitle: [
            "Transparansi penuh untuk setiap tindakan laboratorium. Setiap perubahan hasil, kalibrasi alat, dan approval dokter tercatat permanen dengan cap waktu (timestamp) hingga milidetik.",
            "Absolute transparency for every clinical action. Every result change, instrument calibration, and physician sign-off is permanently recorded with millisecond-level timestamps.",
          ],
        },
      },
      {
        key: "analytics",
        label: "Nova AI & Analitik",
        anchor: "analytics",
        defaults: {
          badge: ["Nova AI & Analitik", "Nova AI & Analytics"],
          title: ["Wawasan Operasional & Asisten Klinis Nova AI", "Operational Insights & Nova AI Clinical Intelligence"],
          subtitle: [
            "Mengubah jutaan titik data pemeriksaan laboratorium menjadi wawasan strategis. Memantau utilisasi instrumen, efisiensi reagen, dan membantu dokter mendeteksi lonjakan biomarker kritis.",
            "Transforming millions of laboratory data points into actionable intelligence. Monitor analyzer utilization, reagent efficiency, and empower clinicians with rapid anomaly detection.",
          ],
        },
      },
      {
        key: "enterprise",
        label: "Keandalan Enterprise",
        defaults: {
          badge: ["Keandalan Enterprise", "Enterprise Reliability"],
          title: ["Dukungan 24/7, Peta Jalan AI & Jaringan Multi-Unit", "24/7 Support SLA, AI Roadmap & Multi-Site Network"],
          subtitle: [
            "Dirancang untuk operasional laboratorium rumah sakit yang tidak pernah berhenti—lengkap dengan eskalasi teknis instan dan sinkronisasi lintas cabang.",
            "Engineered for non-stop hospital diagnostics with instant engineering escalation and unified multi-branch synchronization.",
          ],
        },
      },
      { key: "cta", label: "CTA Penutup", note: "Konten mengikuti section CTA di tab Homepage." },
    ],
  },
  {
    key: "solutions",
    label: "Solusi",
    path: "/solutions",
    heroSectionKey: "page_solutions",
    sections: [
      { key: "hero", label: "Hero Halaman", locked: true },
      {
        key: "facility-solutions",
        label: "Solusi per Fasilitas",
        anchor: "facility-solutions",
        defaults: {
          badge: ["Mengapa Diagnova?", "Why Diagnova?"],
          title: ["Dirancang untuk Membuat Kerja Laboratorium Lebih Mudah", "Designed to Make Laboratory Work Effortless"],
          subtitle: [
            "Pengalaman diagnostik yang lebih lancar dan cerdas, mulai dari bridging SIMRS dua arah hingga rangkuman klinis Nova AI.",
            "Experience a smoother, smarter way to run clinical workflows from HIS bridging to Nova AI summaries.",
          ],
        },
      },
      {
        key: "tiers",
        label: "Paket per Skala Faskes",
        defaults: {
          title: ["Solusi Tepat untuk Setiap Skala Faskes", "Tailored Architectures for Every Facility Scale"],
          subtitle: [
            "Pilih konfigurasi yang dirancang khusus untuk kebutuhan dan kapasitas instansi Anda. Tanpa biaya tersembunyi, fokus pada efisiensi kerja klinis.",
            "Choose an architecture engineered for your institution's specific tier. No bloatware, focused purely on clinical speed and compliance.",
          ],
        },
      },
      {
        key: "efficiency",
        label: "Dampak Terukur",
        defaults: {
          badge: ["Dampak Terukur", "Measurable Impact"],
          title: ["Transformasi Efisiensi Operasional Laboratorium", "Transforming Laboratory Operational Efficiency"],
          subtitle: [
            "Bandingkan alur kerja manual berbasis entri ulang dengan otomatisasi end-to-end Diagnova di setiap tahapan pemeriksaan.",
            "Compare manual re-entry bottlenecks against end-to-end Diagnova automation across every diagnostic stage.",
          ],
        },
      },
      {
        key: "rollout",
        label: "Implementasi 4 Minggu",
        defaults: {
          badge: ["Implementasi Terstruktur", "Structured Rollout"],
          title: ["Dari Audit Awal Hingga Go-Live dalam 4 Minggu", "From Initial Audit to 24/7 Go-Live in 4 Weeks"],
          subtitle: [
            "Metodologi deployment tanpa mengganggu layanan pasien aktif, lengkap dengan tim engineer khusus.",
            "Zero-downtime deployment methodology led by dedicated clinical integration engineers.",
          ],
        },
      },
      { key: "cta", label: "CTA Penutup", note: "Konten mengikuti section CTA di tab Homepage." },
    ],
  },
  {
    key: "modules",
    label: "Modul",
    path: "/modules",
    heroSectionKey: "page_modules",
    sections: [
      { key: "hero", label: "Hero Halaman", locked: true },
      {
        key: "modules-explorer",
        label: "Pelaporan Pasien Nova AI",
        anchor: "modules-explorer",
        defaults: {
          badge: ["Nova AI • Pelaporan Pasien", "Nova AI • Patient Reporting"],
          title: ["Laporan Pasien Cerdas dengan Validasi Klinis Penuh", "Intelligent Patient Reporting with Full Clinical Oversight"],
          subtitle: [
            "Nova AI menerjemahkan hasil patologi dan laboratorium yang kompleks menjadi ringkasan yang jelas, empatik, dan mudah dipahami pasien—tanpa mengurangi otoritas diagnostik dokter.",
            "Nova AI translates complex laboratory and pathology findings into clear, empathetic patient summaries—while keeping diagnostic authority firmly with the attending physician.",
          ],
        },
      },
      {
        key: "catalog",
        label: "Katalog Modul",
        defaults: {
          badge: ["Katalog Modul Lengkap", "Complete Module Catalog"],
          title: ["Arsitektur 5 Modul Inti &\nGateway Laboratorium", "Your Connected Suite of\nClinical Modules."],
          subtitle: [
            "Diagnova mengotomatiskan setiap alur kerja laboratorium—mulai dari interfacing analyzer, kontrol reagen, pelacakan Bank Darah, hingga pelaporan patologi & mikrobiologi terpadu.",
            "Diagnova automates every mission-critical workflow across your laboratory — analyzer interfacing, reagent telemetry, blood bank safety, and specialized pathology & microbiology reporting.",
          ],
        },
      },
      {
        key: "architecture",
        label: "Arsitektur Tanpa Silo",
        defaults: {
          badge: ["Arsitektur Tanpa Silo", "Zero Data Silos"],
          title: ["Satu Pasien, Satu Basis Data Laboratorium Terpadu", "Single Patient ID, One Unified Laboratory Database"],
          subtitle: [
            "Walaupun setiap modul menangani alur kerja spesifik, seluruh data bermuara pada satu pusat data Diagnova. Dokter dapat melihat hasil darah rutin, riwayat transfusi, dan laporan patologi dalam satu rekam medis terpadu tanpa fragmentasi sistem.",
            "Even with department-specific workflows, all clinical data converges into Diagnova's unified clinical registry. Physicians review routine hematology, blood bank logs, and pathology reports in one seamless patient timeline.",
          ],
        },
      },
      {
        key: "scalability",
        label: "Skalabilitas",
        defaults: {
          badge: ["Skalabilitas Terbukti", "Proven Scalability"],
          title: ["Butuh akselerasi waktu rilis hasil?", "Looking for faster diagnostic turnaround?"],
          subtitle: [
            "Setiap modul Diagnova diskalakan sesuai kompleksitas fasilitas—mulai dari klinik pratama hingga jejaring rumah sakit rujukan nasional.",
            "Every Diagnova module scales to your facility's diagnostic volume—from primary clinics to national reference hospital chains.",
          ],
        },
      },
      { key: "cta", label: "CTA Penutup", note: "Konten mengikuti section CTA di tab Homepage." },
    ],
  },
  {
    key: "nova_ai",
    label: "Nova AI",
    path: "/nova-ai",
    heroSectionKey: "page_nova_ai",
    sections: [
      { key: "hero", label: "Hero Halaman", locked: true },
      {
        key: "system-of-action",
        label: "System of Action",
        defaults: {
          badge: ["Paradigma Baru LIS", "The LIS System of Action"],
          title: ["Dari System of Record Menuju System of Action", "From System of Record to System of Action"],
          subtitle: [
            "LIS konvensional berhenti pada pencatatan pasif. Nova AI membaca konteks klinis secara aktif—mengekstrak order, menghitung tren delta, dan menyiapkan draf laporan siap sah.",
            "Traditional LIS stops at passive record-keeping. Nova AI reads clinical context actively—extracting orders, computing delta trends, and preparing sign-off-ready drafts.",
          ],
        },
      },
      {
        key: "workstation-demo",
        label: "Meja Kerja Patologi",
        anchor: "workstation-demo",
        defaults: {
          badge: ["Meja Kerja Patologi Klinik", "Pathologist Workstation"],
          title: ["Bagaimana Nova AI Mendukung Otorisasi Dokter", "How Nova AI Powers Pathologist Sign-Off Workflows"],
          subtitle: [
            "Enam kapabilitas agen cerdas yang tertanam langsung di meja kerja dokter Sp.PK—mempercepat validasi tanpa mengurangi otoritas medis.",
            "Six embedded AI capabilities inside the pathologist desk—accelerating sign-off without altering physician authority.",
          ],
        },
      },
      {
        key: "how-it-works",
        label: "Alur Kerja 4 Tahap",
        anchor: "how-it-works",
        defaults: {
          badge: ["Alur Kerja 4 Tahap", "4-Stage Clinical Pipeline"],
          title: ["Alur Kerja Terstruktur yang Menjamin Presisi & Keselamatan Pasien", "Structured Pipeline Safeguarding Clinical Integrity & Accuracy"],
          subtitle: [
            "Dari pembacaan instrumen analitik hingga otorisasi digital dokter spesialis, setiap tahap didesain dengan ketertelusuran penuh dan kepatuhan akreditasi rumah sakit.",
            "From direct analyzer telemetry to certified pathologist authorization, every phase is engineered with full audit traceability and hospital accreditation standards.",
          ],
        },
      },
      {
        key: "ai-doctor",
        label: "Tata Kelola Klinis",
        anchor: "ai-doctor",
        defaults: {
          badge: ["Tata Kelola Klinis & Keamanan Data", "Clinical Governance & Security"],
          title: ["Kepatuhan & Keamanan untuk Data Klinis Sensitif", "Compliance & Security Built for Clinical Data"],
          subtitle: [
            "Nova AI beroperasi dengan prinsip Human-in-the-Loop mutlak—mempercepat analisis data laboratorium sekaligus menjaga otoritas hukum dokter dan keamanan rekam medis.",
            "Nova AI operates under strict Human-in-the-Loop governance—accelerating lab intelligence while safeguarding physician sovereignty and patient record security.",
          ],
        },
      },
      { key: "cta", label: "CTA Penutup", note: "Konten mengikuti section CTA di tab Homepage." },
    ],
  },
  {
    key: "integration",
    label: "Integrasi",
    path: "/integration",
    heroSectionKey: "page_integrations",
    sections: [
      { key: "hero", label: "Hero Halaman", locked: true },
      {
        key: "integration-explorer",
        label: "Hub Interoperabilitas",
        anchor: "integration-explorer",
        defaults: {
          badge: ["Arsitektur Interoperabilitas", "Interoperability Architecture"],
          title: ["Satu Hub Terpadu untuk Seluruh Ekosistem Data Medis", "One Unified Hub for Your Entire Clinical Data Ecosystem"],
          subtitle: [
            "Klik simpul mana saja pada diagram untuk memeriksa alur otomatisasi dan protokolnya.",
            "Select any node on the diagram to inspect its live automation flow and protocols.",
          ],
        },
      },
      {
        key: "architecture",
        label: "Kapabilitas Teknis",
        anchor: "architecture",
        defaults: {
          badge: ["Kapabilitas Teknis", "Engineering Capabilities"],
          title: ["Semua yang Dibutuhkan untuk Integrasi Tanpa Friksi", "Everything You Need for Frictionless Lab Integration"],
          subtitle: [
            "Dari Host Query barcode, validasi Westgard QC, pemetaan LOINC, hingga ketahanan jaringan offline—seluruhnya dirancang presisi.",
            "From barcode Host Query and Westgard QC gating to LOINC normalization and offline edge resilience.",
          ],
        },
      },
      {
        key: "analyzer-directory",
        label: "Direktori Analyzer",
        defaults: {
          badge: ["Direktori 500+ Analyzer", "500+ Analyzer Directory"],
          title: ["Matriks Kompatibilitas Instrumen Laboratorium", "Laboratory Instrument Compatibility Matrix"],
          subtitle: [
            "Cari merek atau seri mesin laboratorium Anda untuk melihat antarmuka fisik dan protokol yang didukung native.",
            "Search your analyzer brand or series to inspect natively supported physical interfaces and protocols.",
          ],
        },
      },
      {
        key: "compliance",
        label: "Kepatuhan Regulasi",
        defaults: {
          badge: ["Kepatuhan Regulasi & Privasi", "Regulatory & Privacy Compliance"],
          title: ["Arsitektur Interoperabilitas Sesuai Regulasi Kesehatan Nasional", "Interoperability Architecture Built for National Health Compliance"],
          subtitle: [
            "Setiap pertukaran data dilindungi enkripsi TLS 1.3 / AES-256 serta memenuhi amanat Permenkes 24/2022, standar SATUSEHAT Kemenkes RI, dan UU Perlindungan Data Pribadi.",
            "Every data exchange is guarded by TLS 1.3 / AES-256 encryption, fully aligning with Permenkes 24/2022, MoH SATUSEHAT FHIR, and Indonesia's PDP Act.",
          ],
        },
      },
      { key: "cta", label: "CTA Penutup", note: "Konten mengikuti section CTA di tab Homepage." },
    ],
  },
];

export const CMS_PAGE_KEYS = CMS_PAGES.map((p) => p.key);

export function getPageDefinition(page: string): CmsPageDefinition | undefined {
  return CMS_PAGES.find((p) => p.key === page);
}

/**
 * Menggabungkan tata letak tersimpan dengan registry:
 * - section bawaan yang tidak dikenal registry diabaikan;
 * - section bawaan baru (belum ada di data tersimpan) ditambahkan pada posisi bawaannya;
 * - section terkunci (hero) selalu aktif dan selalu pertama;
 * - section kustom dipertahankan sesuai urutan tersimpan.
 */
export function resolvePageLayout(page: CmsPageKey, stored: unknown): ResolvedSection[] {
  const def = getPageDefinition(page);
  if (!def) return [];
  const raw = Array.isArray((stored as { sections?: unknown })?.sections)
    ? ((stored as { sections: unknown[] }).sections as Partial<StoredSection>[])
    : [];

  const byKey = new Map<string, ResolvedSection>();
  def.sections.forEach((s, i) => {
    byKey.set(s.key, {
      key: s.key,
      type: "builtin",
      isActive: true,
      sortOrder: (i + 1) * 10,
      label: s.label,
      locked: !!s.locked,
      anchor: s.anchor,
      defaults: s.defaults,
      note: s.note,
    });
  });

  const result: ResolvedSection[] = [];
  const seen = new Set<string>();
  for (const item of raw) {
    if (!item || typeof item.key !== "string" || seen.has(item.key)) continue;
    const sortOrder = Number.isFinite(item.sortOrder) ? Number(item.sortOrder) : 9999;
    if (item.type === "custom") {
      if (!CUSTOM_KEY_PATTERN.test(item.key)) continue;
      seen.add(item.key);
      result.push({
        key: item.key,
        type: "custom",
        isActive: item.isActive !== false,
        sortOrder,
        content: item.content && typeof item.content === "object" ? item.content : {},
        label: "Section Kustom",
        locked: false,
      });
      continue;
    }
    const base = byKey.get(item.key);
    if (!base) continue;
    seen.add(item.key);
    result.push({
      ...base,
      isActive: base.locked ? true : item.isActive !== false,
      sortOrder,
      content: item.content && typeof item.content === "object" ? item.content : undefined,
    });
  }
  // Section bawaan yang belum tersimpan: pakai urutan bawaan relatif terhadap tetangganya.
  def.sections.forEach((s, i) => {
    if (seen.has(s.key)) return;
    const base = byKey.get(s.key)!;
    const prevKey = def.sections[i - 1]?.key;
    const prev = prevKey ? result.find((r) => r.key === prevKey) : undefined;
    result.push({ ...base, sortOrder: prev ? prev.sortOrder + 0.5 : base.sortOrder });
  });

  result.sort((a, b) => a.sortOrder - b.sortOrder);
  const locked = result.filter((r) => r.locked);
  const rest = result.filter((r) => !r.locked);
  return [...locked, ...rest].map((r, i) => ({ ...r, sortOrder: (i + 1) * 10 }));
}

/** Layout default (tanpa data tersimpan) — dipakai bila database tidak tersedia. */
export function defaultPageLayout(page: CmsPageKey): ResolvedSection[] {
  return resolvePageLayout(page, null);
}

const nonEmpty = (v: string | undefined | null) => (typeof v === "string" && v.trim() !== "" ? v : undefined);

/** Ambil teks override (bahasa aktif) untuk header section; undefined bila tidak ditimpa. */
export function getSectionOverride(
  layout: ResolvedSection[] | null | undefined,
  key: string,
  field: "badge" | "title" | "subtitle",
  language: Lang
): string | undefined {
  const content = layout?.find((s) => s.key === key)?.content;
  if (!content) return undefined;
  const suffix = language === "ID" ? "Id" : "En";
  return nonEmpty(content[`${field}${suffix}` as keyof SectionTextContent]);
}

/** URL yang aman untuk tautan/ gambar dari CMS: path relatif, anchor, atau http(s). */
export function isSafeCmsUrl(url: string): boolean {
  const v = url.trim();
  if (v === "") return true;
  if (v.startsWith("//")) return false;
  if (v.startsWith("/") || v.startsWith("#")) return true;
  return /^https?:\/\/[^\s]+$/i.test(v);
}
