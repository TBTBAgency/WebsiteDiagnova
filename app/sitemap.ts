import { MetadataRoute } from "next";
import { getPageContent } from "@/lib/cms/page-content";
import { modulesPage } from "@/content/pages/modules";
import { solutionsPage } from "@/content/pages/solutions";
import { integrationPage } from "@/content/pages/integration";

export const revalidate = 3600;

/** Sitemap mengikuti konten CMS (item yang disembunyikan/dihapus tidak dicantumkan). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://diagnova.id";
  const entry = (route: string, priority: number, changeFrequency: "weekly" | "monthly") => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  });

  const [modules, solutions, integration] = await Promise.all([
    getPageContent(modulesPage),
    getPageContent(solutionsPage),
    getPageContent(integrationPage),
  ]);

  const slugs = (items: unknown) =>
    (Array.isArray(items) ? items : []).map((i) => (i as { slug?: string }).slug).filter((s): s is string => !!s);

  return [
    ...["", "/platform", "/solutions", "/modules", "/nova-ai", "/integration", "/request-demo"].map((r) =>
      entry(r, r === "" ? 1.0 : 0.8, "weekly")
    ),
    ...slugs(modules.modules?.items).map((s) => entry(`/modules/${s}`, 0.7, "monthly")),
    ...slugs(solutions.catalog?.items).map((s) => entry(`/solutions/${s}`, 0.7, "monthly")),
    ...(integration.detailPage ? slugs(integration.integrations?.items).map((s) => entry(`/integration/${s}`, 0.7, "monthly")) : []),
  ];
}
