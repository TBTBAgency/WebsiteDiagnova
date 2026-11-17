/**
 * FAQ bawaan + resolver (dipisah agar isi FAQ tidak ikut bundle Footer/Navbar).
 */
import { faqContentEN, faqContentID } from "@/content/faq";
import { arr, bool, str, type FaqContent } from "@/lib/site-content";

function buildDefaultFaq(): FaqContent {
  const enById = new Map(faqContentEN.items.map((i) => [i.id, i]));
  const enCat = new Map(faqContentEN.categories.map((c) => [c.id, c.label]));
  return {
    badgeId: faqContentID.sectionBadge,
    badgeEn: faqContentEN.sectionBadge,
    titleId: faqContentID.sectionTitle,
    titleEn: faqContentEN.sectionTitle,
    subtitleId: faqContentID.sectionSubtitle,
    subtitleEn: faqContentEN.sectionSubtitle,
    supportPromptId: faqContentID.supportPrompt,
    supportPromptEn: faqContentEN.supportPrompt,
    supportCtaId: faqContentID.supportCta,
    supportCtaEn: faqContentEN.supportCta,
    supportCtaUrl: "/request-demo",
    categories: faqContentID.categories.map((c) => ({ id: c.id, labelId: c.label, labelEn: enCat.get(c.id) || c.label })),
    items: faqContentID.items.map((i) => {
      const en = enById.get(i.id);
      return {
        id: i.id,
        category: i.category,
        questionId: i.question,
        questionEn: en?.question || i.question,
        answerId: i.answer,
        answerEn: en?.answer || i.answer,
        isActive: true,
      };
    }),
  };
}

export const DEFAULT_FAQ: FaqContent = buildDefaultFaq();

export function resolveFaq(row: { badgeId?: string | null; badgeEn?: string | null; titleId?: string | null; titleEn?: string | null; subtitleId?: string | null; subtitleEn?: string | null; extraContent?: unknown } | null): FaqContent {
  if (!row) return DEFAULT_FAQ;
  const r = (row.extraContent && typeof row.extraContent === "object" ? row.extraContent : {}) as Record<string, unknown>;
  const d = DEFAULT_FAQ;
  return {
    badgeId: row.badgeId ?? d.badgeId,
    badgeEn: row.badgeEn ?? d.badgeEn,
    titleId: row.titleId ?? d.titleId,
    titleEn: row.titleEn ?? d.titleEn,
    subtitleId: row.subtitleId ?? d.subtitleId,
    subtitleEn: row.subtitleEn ?? d.subtitleEn,
    supportPromptId: str(r.supportPromptId, d.supportPromptId),
    supportPromptEn: str(r.supportPromptEn, d.supportPromptEn),
    supportCtaId: str(r.supportCtaId, d.supportCtaId),
    supportCtaEn: str(r.supportCtaEn, d.supportCtaEn),
    supportCtaUrl: str(r.supportCtaUrl, d.supportCtaUrl) || d.supportCtaUrl,
    categories: Array.isArray(r.categories)
      ? arr(r.categories).map((c, i) => ({ id: str(c.id, `cat-${i}`), labelId: str(c.labelId), labelEn: str(c.labelEn) }))
      : d.categories,
    items: Array.isArray(r.items)
      ? arr(r.items).map((it, i) => ({
          id: str(it.id, `faq-${i}`),
          category: str(it.category),
          questionId: str(it.questionId),
          questionEn: str(it.questionEn),
          answerId: str(it.answerId),
          answerEn: str(it.answerEn),
          isActive: bool(it.isActive, true),
        }))
      : d.items,
  };
}

