import { MetadataRoute } from "next";
import { modulesData } from "@/content/modules";
import { solutionsData } from "@/content/solutions";
import { integrationsData } from "@/content/integrations";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://diagnova.id";

  const staticRoutes = [
    "",
    "/platform",
    "/platform/workflow",
    "/platform/automation",
    "/platform/reporting",
    "/platform/analytics",
    "/solutions",
    "/modules",
    "/nova-ai",
    "/nova-ai/how-it-works",
    "/nova-ai/ai-doctor",
    "/integration",
    "/request-demo",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const moduleRoutes = modulesData.map((m) => ({
    url: `${baseUrl}/modules/${m.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const solutionRoutes = solutionsData.map((s) => ({
    url: `${baseUrl}/solutions/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const integrationRoutes = integrationsData.map((i) => ({
    url: `${baseUrl}/integration/${i.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...moduleRoutes, ...solutionRoutes, ...integrationRoutes];
}
