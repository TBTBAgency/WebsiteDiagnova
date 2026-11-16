// Registri seluruh halaman CMS (urutan = urutan di menu admin).
import type { CmsPageDefinition } from "./types";
import { globalPage } from "@/content/pages/global";
import { homePage } from "@/content/pages/home";
import { platformPage } from "@/content/pages/platform";
import { solutionsPage } from "@/content/pages/solutions";
import { modulesPage } from "@/content/pages/modules";
import { novaAiPage } from "@/content/pages/nova-ai";
import { integrationPage } from "@/content/pages/integration";
import { requestDemoPage } from "@/content/pages/request-demo";

export const CMS_DEFINITIONS: Record<string, CmsPageDefinition> = {
  global: globalPage,
  home: homePage,
  platform: platformPage,
  solutions: solutionsPage,
  modules: modulesPage,
  "nova-ai": novaAiPage,
  integration: integrationPage,
  "request-demo": requestDemoPage,
};

/** Path publik yang perlu di-revalidate saat konten halaman berubah. */
export const CMS_PAGE_PATHS: Record<string, string[]> = {
  global: ["/", "/platform", "/solutions", "/modules", "/nova-ai", "/integration", "/request-demo"],
  home: ["/"],
  platform: ["/platform"],
  solutions: ["/solutions", "/solutions/[slug]"],
  modules: ["/modules", "/modules/[slug]"],
  "nova-ai": ["/nova-ai"],
  integration: ["/integration", "/integration/[slug]"],
  "request-demo": ["/request-demo"],
};
