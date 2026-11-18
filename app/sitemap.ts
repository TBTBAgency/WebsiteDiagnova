import { MetadataRoute } from "next";

/**
 * Hanya URL kanonik yang benar-benar dirender. Sub-halaman lama (/platform/workflow,
 * /solutions/[slug], /modules/[slug], /integration/[slug], /nova-ai/how-it-works, ...)
 * dialihkan (redirect) ke anchor pada halaman induk lewat next.config.mjs, sehingga
 * tidak dimasukkan ke sitemap.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://diagnova.id";

  return ["", "/platform", "/solutions", "/modules", "/nova-ai", "/integration", "/request-demo"].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1.0 : 0.8,
    })
  );
}
