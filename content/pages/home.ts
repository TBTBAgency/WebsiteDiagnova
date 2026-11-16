// Definisi CMS halaman Home. Default = isi homepage yang sudah ada di database saat restrukturisasi
// (snapshot hasil migrasi 4 tabel anak ke JSON), ditambah FAQ dari kode.
// Konten section home: { badge, title, subtitle } (kolom badge_/title_/subtitle_) + field extra_content.
import type { CmsPageDefinition, SectionContent } from "@/lib/cms/types";
import snapshot from "./home-snapshot.json";
import { homeFaqSection } from "./home-faq";

type SnapshotSection = { label: string; sortOrder: number; content: SectionContent };
const snap = snapshot as unknown as Record<string, SnapshotSection>;
const section = (key: string, fallbackLabel: string) => ({
  label: snap[key]?.label ?? fallbackLabel,
  content: (snap[key]?.content ?? {}) as SectionContent,
});

export const homePage = {
  pageKey: "home",
  sections: {
    hero: section("hero", "Hero Slider"),
    trusted_by: section("trusted_by", "Trusted By (Partner)"),
    about: section("about", "Tentang Diagnova"),
    comparison: section("comparison", "Perbandingan"),
    workflow: section("workflow", "Alur Kerja"),
    infrastructure: section("infrastructure", "Infrastruktur"),
    testimonials: section("testimonials", "Testimoni"),
    faq: homeFaqSection as { label: string; content: SectionContent },
    cta: section("cta", "CTA Banner"),
  },
} satisfies CmsPageDefinition;

/** Section home yang menyimpan badge/title/subtitle di kolom tabel (bukan JSON). */
export const HOME_COLUMN_SECTIONS = new Set(["hero", "trusted_by", "about", "comparison", "workflow", "infrastructure", "testimonials", "cta"]);
