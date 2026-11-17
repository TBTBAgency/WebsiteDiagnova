/**
 * Shared (client + server safe) types and helpers for CMS-driven page heroes.
 * No server-only imports here: this module is used by client page components.
 */

export interface CmsPageHero {
  badgeId: string | null;
  badgeEn: string | null;
  titleId: string | null;
  titleEn: string | null;
  subtitleId: string | null;
  subtitleEn: string | null;
}

export interface ResolvedCmsHero {
  badge?: string;
  title?: string;
  subtitle?: string;
}

const clean = (v: string | null | undefined) => (v && v.trim() !== "" ? v : undefined);

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
