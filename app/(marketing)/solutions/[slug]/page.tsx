import { cache } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageContent } from "@/lib/cms/page-content";
import { solutionsPage, type SolutionsPageContent } from "@/content/pages/solutions";
import { modulesPage } from "@/content/pages/modules";
import type { LocalizedText } from "@/lib/cms/types";
import { SolutionDetailView } from "./SolutionDetailView";

export const revalidate = 60;

interface Props {
  params: { slug: string };
}

/** Konten halaman `solutions` sekali per request (dipakai generateMetadata & halaman). */
const loadSolutionsContent = cache(() => getPageContent(solutionsPage));

function findSolution(content: SolutionsPageContent, slug: string) {
  return content.catalog?.items?.find((s) => s.slug === slug) ?? null;
}

/** Teks Bahasa Indonesia untuk metadata (server; tanpa konteks bahasa). */
function idText(value: LocalizedText | string | null | undefined): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return value.id || value.en || "";
}

export function generateStaticParams() {
  return solutionsPage.sections.catalog.content.items.map((solution) => ({
    slug: solution.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const content = await loadSolutionsContent();
  const labels = content.detail ?? solutionsPage.sections.detail.content;
  const solution = findSolution(content, params.slug);
  if (!solution) return { title: labels.notFoundTitle };

  return {
    title: labels.metaTitle.replace("{name}", idText(solution.name)),
    description: idText(solution.shortDesc),
  };
}

export default async function SolutionDetailPage({ params }: Props) {
  const content = await loadSolutionsContent();
  const solution = findSolution(content, params.slug);

  if (!solution) {
    notFound();
  }

  // Modul terkait dibaca dari CMS halaman modules (item tersembunyi/dihapus tidak ikut)
  const modules = await getPageContent(modulesPage);
  const includedSlugs = (solution.includedModules ?? []).map((m) => m.slug);
  const relatedModules = (modules.modules?.items ?? [])
    .filter((m) => includedSlugs.includes(m.slug))
    .map((m) => ({ slug: m.slug, name: m.name, shortDesc: m.shortDesc }));

  return (
    <SolutionDetailView
      solution={solution}
      labels={content.detail ?? solutionsPage.sections.detail.content}
      cta={content.cta}
      relatedModules={relatedModules}
    />
  );
}
