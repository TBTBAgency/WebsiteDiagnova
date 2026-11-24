/**
 * Konten global situs yang dikelola CMS: Footer, FAQ, dan Announcement Bar.
 *
 * Disimpan di tabel cms_sections (tanpa tabel baru), satu baris per jenis:
 *   footer        -> extraContent: FooterContent
 *   faq           -> badge/title/subtitle di kolom baris + extraContent: { supportPrompt*, supportCta*, categories, items }
 *   announcement  -> extraContent: AnnouncementContent
 * Bila baris belum ada, website memakai DEFAULT_* di bawah ini (= konten yang sebelumnya
 * hardcoded), sehingga tampilan tidak berubah sampai admin menyimpan.
 *
 * Aman untuk client & server (tanpa import server-only).
 */

import { linksToAdminArea } from "@/lib/admin-route";

export type Lang = "ID" | "EN";

export interface LinkItem {
  id: string;
  labelId: string;
  labelEn: string;
  url: string;
  isActive: boolean;
}

export interface FooterColumn {
  id: string;
  titleId: string;
  titleEn: string;
  isActive: boolean;
  links: LinkItem[];
}

export interface SocialLink {
  id: string;
  platform: string; // label bebas, mis. "LinkedIn"
  url: string;
  isActive: boolean;
}

export interface FooterContent {
  logoUrl: string;
  descriptionId: string;
  descriptionEn: string;
  copyrightId: string;
  copyrightEn: string;
  contact: { email: string; phone: string; whatsapp: string; addressId: string; addressEn: string };
  columns: FooterColumn[];
  social: SocialLink[];
  legal: { showTerms: boolean; showPrivacy: boolean };
}

export interface FaqCategory {
  id: string;
  labelId: string;
  labelEn: string;
}

export interface FaqItem {
  id: string;
  category: string;
  questionId: string;
  questionEn: string;
  answerId: string;
  answerEn: string;
  isActive: boolean;
}

export interface FaqContent {
  badgeId: string;
  badgeEn: string;
  titleId: string;
  titleEn: string;
  subtitleId: string;
  subtitleEn: string;
  supportPromptId: string;
  supportPromptEn: string;
  supportCtaId: string;
  supportCtaEn: string;
  supportCtaUrl: string;
  categories: FaqCategory[];
  items: FaqItem[];
}

export interface AnnouncementContent {
  enabled: boolean;
  promptId: string;
  promptEn: string;
  /** ISO datetime opsional; di luar periode, bar tidak tampil. */
  startsAt: string | null;
  endsAt: string | null;
  items: LinkItem[];
}

const link = (id: string, labelId: string, labelEn: string, url: string): LinkItem => ({ id, labelId, labelEn, url, isActive: true });

// Tautan bawaan memakai URL kanonik (anchor halaman induk) agar tidak melewati redirect 307.
export const DEFAULT_FOOTER: FooterContent = {
  logoUrl: "/images/logo-diagnova.svg",
  descriptionId: "",
  descriptionEn: "",
  copyrightId: "© 2026 Diagnova by PT Tiba Tiba Agency.",
  copyrightEn: "© 2026 Diagnova by PT Tiba Tiba Agency.",
  contact: { email: "", phone: "", whatsapp: "", addressId: "", addressEn: "" },
  columns: [
    {
      id: "col-platform",
      titleId: "Platform",
      titleEn: "Platform",
      isActive: true,
      links: [
        link("l-platform-1", "Gambaran Platform", "Overview", "/platform"),
        link("l-platform-2", "Alur Kerja", "Workflow", "/platform#workflow"),
        link("l-platform-3", "100% Otomasi", "100% Automation", "/platform#automation"),
        link("l-platform-4", "Pelaporan & Audit", "Reporting & Audit", "/platform#reporting"),
        link("l-platform-5", "Analitik Lab", "Lab Analytics", "/platform#analytics"),
        link("l-platform-6", "Nova AI Copilot", "Nova AI Copilot", "/nova-ai"),
      ],
    },
    {
      id: "col-solutions",
      titleId: "Solusi",
      titleEn: "Solutions",
      isActive: true,
      links: [
        link("l-solutions-1", "Gambaran Solusi", "Overview", "/solutions"),
        link("l-solutions-2", "Laboratorium Rumah Sakit", "Hospital Laboratory", "/solutions#hospital-laboratory"),
        link("l-solutions-3", "Laboratorium Klinik", "Clinical Laboratory", "/solutions#clinical-laboratory"),
        link("l-solutions-4", "Pusat Medical Check Up", "Health Screening Center", "/solutions#clinical-laboratory"),
        link("l-solutions-5", "Laboratorium Multi-Cabang", "Multi-branch Laboratory", "/solutions#facility-solutions"),
        link("l-solutions-6", "Cara Kerja Nova AI", "How Nova AI Works", "/nova-ai#how-it-works"),
      ],
    },
    {
      id: "col-modules",
      titleId: "Modul",
      titleEn: "Modules",
      isActive: true,
      links: [
        link("l-modules-1", "Gambaran Modul", "Overview", "/modules"),
        link("l-modules-2", "Rutin & Hematologi", "Routine & Hematology", "/modules#routine-hematology"),
        link("l-modules-3", "Kimia Klinik", "Clinical Chemistry", "/modules#routine-hematology"),
        link("l-modules-4", "Manajemen Bank Darah", "Blood Bank Management", "/modules#blood-bank"),
        link("l-modules-5", "Inventaris & Reagen", "Inventory & Reagent", "/modules#inventory-reagent"),
        link("l-modules-6", "Patologi Anatomi", "Anatomical Pathology", "/modules#pathology"),
      ],
    },
    {
      id: "col-integration",
      titleId: "Integrasi",
      titleEn: "Integration",
      isActive: true,
      links: [
        link("l-integration-1", "Gambaran Integrasi", "Overview", "/integration"),
        link("l-integration-2", "Bridging SIMRS / HIS", "SIMRS / HIS Bridging", "/integration#simrs-his"),
        link("l-integration-3", "Rekam Medis (RME)", "Electronic Medical Record (EMR)", "/integration#rme"),
        link("l-integration-4", "500+ Analyzer Medis", "500+ Medical Analyzers", "/integration#analyzer"),
        link("l-integration-5", "SATUSEHAT Kemenkes", "SATUSEHAT Kemenkes", "/integration#satusehat"),
      ],
    },
  ],
  social: [],
  legal: { showTerms: true, showPrivacy: true },
};

export const DEFAULT_ANNOUNCEMENT: AnnouncementContent = {
  enabled: true,
  promptId: "Pilih kebutuhan laboratorium Anda untuk memulai. Saya ingin...",
  promptEn: "Select your laboratory goal to get started. I want to...",
  startsAt: null,
  endsAt: null,
  items: [
    link("ann-demo", "Request Demo", "Request a Demo", "/request-demo"),
    link("ann-workflow", "Lihat Workflow Lab", "Explore Lab Workflow", "/#workflow"),
    link("ann-analyzers", "Koneksi 500+ Alat", "500+ Analyzers", "/#infrastructure"),
    link("ann-satusehat", "Integrasi SATUSEHAT", "SATUSEHAT Bridging", "/#infrastructure"),
    link("ann-comparison", "Kenapa Diagnova", "Why Choose Diagnova", "/#comparison"),
  ],
};

// --- Resolver: data tersimpan (bisa sebagian / rusak) + bawaan ---

export const str = (v: unknown, fallback = ""): string => (typeof v === "string" ? v : fallback);
export const bool = (v: unknown, fallback: boolean): boolean => (typeof v === "boolean" ? v : fallback);
export const arr = (v: unknown): Record<string, unknown>[] =>
  Array.isArray(v) ? (v.filter((x) => x && typeof x === "object") as Record<string, unknown>[]) : [];

function toLinks(v: unknown, fallback: LinkItem[]): LinkItem[] {
  if (!Array.isArray(v)) return fallback;
  return arr(v).map((l, i) => ({
    id: str(l.id, `link-${i}`),
    labelId: str(l.labelId),
    labelEn: str(l.labelEn),
    url: str(l.url),
    isActive: bool(l.isActive, true),
  })).filter((l) => !linksToAdminArea(l.url)); // tautan ke area admin tidak pernah tampil di publik
}

export function resolveFooter(raw: unknown): FooterContent {
  if (!raw || typeof raw !== "object") return DEFAULT_FOOTER;
  const r = raw as Record<string, unknown>;
  const c = (r.contact && typeof r.contact === "object" ? r.contact : {}) as Record<string, unknown>;
  const legal = (r.legal && typeof r.legal === "object" ? r.legal : {}) as Record<string, unknown>;
  return {
    logoUrl: str(r.logoUrl, DEFAULT_FOOTER.logoUrl) || DEFAULT_FOOTER.logoUrl,
    descriptionId: str(r.descriptionId),
    descriptionEn: str(r.descriptionEn),
    copyrightId: str(r.copyrightId, DEFAULT_FOOTER.copyrightId),
    copyrightEn: str(r.copyrightEn, DEFAULT_FOOTER.copyrightEn),
    contact: {
      email: str(c.email),
      phone: str(c.phone),
      whatsapp: str(c.whatsapp),
      addressId: str(c.addressId),
      addressEn: str(c.addressEn),
    },
    columns: Array.isArray(r.columns)
      ? arr(r.columns).map((col, i) => ({
          id: str(col.id, `col-${i}`),
          titleId: str(col.titleId),
          titleEn: str(col.titleEn),
          isActive: bool(col.isActive, true),
          links: toLinks(col.links, []),
        }))
      : DEFAULT_FOOTER.columns,
    social: Array.isArray(r.social)
      ? arr(r.social).map((s, i) => ({ id: str(s.id, `social-${i}`), platform: str(s.platform), url: str(s.url), isActive: bool(s.isActive, true) }))
      : DEFAULT_FOOTER.social,
    legal: { showTerms: bool(legal.showTerms, true), showPrivacy: bool(legal.showPrivacy, true) },
  };
}

export function resolveAnnouncement(raw: unknown): AnnouncementContent {
  if (!raw || typeof raw !== "object") return DEFAULT_ANNOUNCEMENT;
  const r = raw as Record<string, unknown>;
  return {
    enabled: bool(r.enabled, true),
    promptId: str(r.promptId, DEFAULT_ANNOUNCEMENT.promptId),
    promptEn: str(r.promptEn, DEFAULT_ANNOUNCEMENT.promptEn),
    startsAt: typeof r.startsAt === "string" && r.startsAt ? r.startsAt : null,
    endsAt: typeof r.endsAt === "string" && r.endsAt ? r.endsAt : null,
    items: toLinks(r.items, DEFAULT_ANNOUNCEMENT.items),
  };
}

/** Apakah announcement tampil sekarang (aktif, punya isi, dan dalam periode). */
export function isAnnouncementVisible(a: AnnouncementContent | null | undefined, now: Date = new Date()): boolean {
  if (!a || !a.enabled) return false;
  if (a.startsAt && now < new Date(a.startsAt)) return false;
  if (a.endsAt && now > new Date(a.endsAt)) return false;
  return a.items.some((i) => i.isActive && i.url) || !!(a.promptId || a.promptEn);
}

export const pickLang = (lang: Lang, id: string, en: string) => (lang === "ID" ? id || en : en || id);
