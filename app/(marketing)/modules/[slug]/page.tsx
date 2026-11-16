import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageContent } from "@/lib/cms/page-content";
import { modulesPage } from "@/content/pages/modules";
import { ModuleDetailView } from "./ModuleDetailView";

export const revalidate = 60;

interface Props {
  params: { slug: string };
}

// Satu kali baca CMS per request (dipakai generateMetadata & halaman).
const loadContent = cache(() => getPageContent(modulesPage));

async function findModule(slug: string) {
  const content = await loadContent();
  const items = content.modules?.items ?? [];
  const item = items.find(
    (m) => m.slug === slug && !(m as { hidden?: boolean }).hidden && !(m as { deletedAt?: string | null }).deletedAt
  );
  return { content, item };
}

export function generateStaticParams() {
  return modulesPage.sections.modules.content.items.map((module) => ({
    slug: module.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { item: mod } = await findModule(params.slug);
  if (!mod) return { title: "Modul Tidak Ditemukan" };

  return {
    title: `${mod.name.id} — Modul Diagnova`,
    description: mod.shortDesc.id,
  };
}

export default async function ModuleDetailPage({ params }: Props) {
  const { content, item } = await findModule(params.slug);

  if (!content.modules || !item) {
    notFound();
  }

  return <ModuleDetailView content={{ modules: content.modules, cta: content.cta }} item={item} />;
}
