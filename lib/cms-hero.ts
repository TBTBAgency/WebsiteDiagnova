/**
 * Shared (client + server safe) types and helpers for CMS-driven page heroes.
 * No server-only imports here: this module is used by client page components.
 */

export interface HeroCtaContent {
  textId: string;
  textEn: string;
  url: string;
}

export interface HeroMetricContent {
  id: string;
  valueId: string;
  valueEn: string;
  labelId: string;
  labelEn: string;
  subId: string;
  subEn: string;
  isActive: boolean;
}

/** Teks bawaan CTA & metrik hero suatu halaman (lihat lib/cms-hero-defaults.ts). */
export interface HeroDefaults {
  primaryCta: HeroCtaContent;
  secondaryCta: HeroCtaContent;
  metrics: HeroMetricContent[];
}

/** Bagian hero yang disimpan admin di page_*.extraContent.hero (semua opsional). */
export interface HeroExtraContent {
  primaryCta?: HeroCtaContent | null;
  secondaryCta?: HeroCtaContent | null;
  metrics?: HeroMetricContent[] | null;
}

export interface CmsPageHero {
  badgeId: string | null;
  badgeEn: string | null;
  titleId: string | null;
  titleEn: string | null;
  subtitleId: string | null;
  subtitleEn: string | null;
  heroExtra?: HeroExtraContent | null;
}

export interface ResolvedCmsHero {
  badge?: string;
  title?: string;
  subtitle?: string;
}

const clean = (v: string | null | undefined) => (v && v.trim() !== "" ? v : undefined);
const pick = (language: "ID" | "EN", id?: string, en?: string) =>
  (language === "ID" ? clean(id) || clean(en) : clean(en) || clean(id)) || "";

/**
 * Picks the hero texts for the active language. Empty values stay undefined so the
 * page keeps its built-in (hardcoded) text as a fallback.
 */
export function resolveCmsHero(
  hero: CmsPageHero | null | undefined,
  language: "ID" | "EN"
): ResolvedCmsHero | undefined {
  if (!hero) return undefined;
  const isId = language === "ID";
  return {
    badge: clean(isId ? hero.badgeId : hero.badgeEn),
    title: clean(isId ? hero.titleId : hero.titleEn),
    subtitle: clean(isId ? hero.subtitleId : hero.subtitleEn),
  };
}

/**
 * Tombol CTA hero: data CMS bila tersimpan, selain itu bawaan halaman.
 * CTA dengan teks atau URL kosong tidak ditampilkan (undefined).
 */
export function heroCta(
  hero: CmsPageHero | null | undefined,
  which: "primaryCta" | "secondaryCta",
  defaults: HeroDefaults,
  language: "ID" | "EN"
): { text: string; href: string } | undefined {
  const saved = hero?.heroExtra?.[which];
  const cta = saved === undefined ? defaults[which] : saved;
  if (!cta) return undefined;
  const text = pick(language, cta.textId, cta.textEn);
  return text && cta.url ? { text, href: cta.url } : undefined;
}

/** Metrik hero aktif: data CMS bila tersimpan (termasuk daftar kosong), selain itu bawaan. */
export function heroMetrics(
  hero: CmsPageHero | null | undefined,
  defaults: HeroDefaults,
  language: "ID" | "EN"
): { value: string; label: string; sub: string }[] {
  const list = Array.isArray(hero?.heroExtra?.metrics) ? hero!.heroExtra!.metrics! : defaults.metrics;
  return list
    .filter((m) => m && m.isActive !== false)
    .map((m) => ({
      value: pick(language, m.valueId, m.valueEn),
      label: pick(language, m.labelId, m.labelEn),
      sub: pick(language, m.subId, m.subEn),
    }))
    .filter((m) => m.value || m.label);
}

export { HERO_DEFAULTS } from "@/lib/cms-hero-defaults";
