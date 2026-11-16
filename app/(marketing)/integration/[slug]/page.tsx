import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageContent } from "@/lib/cms/page-content";
import { integrationPage } from "@/content/pages/integration";
import { IntegrationDetailView } from "./IntegrationDetailView";

export const revalidate = 60;

interface Props {
  params: { slug: string };
}

/** Item integrasi dari CMS (section `integrations` halaman induk). `null` bila tidak ada / disembunyikan. */
async function getIntegration(slug: string) {
  const content = await getPageContent(integrationPage);
  const item = content.integrations?.items.find((i) => i.slug === slug) ?? null;
  return { content, item };
}

export function generateStaticParams() {
  return integrationPage.sections.integrations.content.items.map((integ) => ({
    slug: integ.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { item } = await getIntegration(params.slug);
  if (!item) return { title: "Integrasi Tidak Ditemukan" };

  return {
    title: `${item.detail.name.id} — Integrasi Diagnova LIS`,
    description: item.detail.shortDesc.id,
  };
}

export default async function IntegrationDetailPage({ params }: Props) {
  const { content, item } = await getIntegration(params.slug);

  // Item tidak ditemukan/disembunyikan, atau section label halaman detail disembunyikan di CMS -> 404.
  if (!item || !content.detailPage) {
    notFound();
  }

  return <IntegrationDetailView content={content} item={item} />;
}
