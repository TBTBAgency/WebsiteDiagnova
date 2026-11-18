import type { CmsPageKey } from "@/lib/cms-layout";
import type { PageContentSpec } from "@/lib/cms-page-content";
import { PLATFORM_CONTENT } from "./platform";
import { SOLUTIONS_CONTENT } from "./solutions";
import { MODULES_CONTENT } from "./modules";
import { NOVA_AI_CONTENT } from "./nova-ai";
import { INTEGRATION_CONTENT } from "./integration";

export type InnerPageKey = Exclude<CmsPageKey, "home">;

/** Registry konten section bawaan per halaman dalam. */
export const PAGE_CONTENT: Record<InnerPageKey, PageContentSpec> = {
  platform: PLATFORM_CONTENT,
  solutions: SOLUTIONS_CONTENT,
  modules: MODULES_CONTENT,
  nova_ai: NOVA_AI_CONTENT,
  integration: INTEGRATION_CONTENT,
};
