const fs = require('fs');

const helpers = `
import { solutionsData as staticSolutions } from "@/content/solutions";
import { modulesData as staticModules } from "@/content/modules";
import { integrationsData as staticIntegrations } from "@/content/integrations";
import {
  novaAIWorkflowSteps as staticNovaSteps,
  novaAISampleTranslations as staticNovaTranslations,
  novaAIDisclaimer as staticNovaDisclaimer,
} from "@/content/nova-ai";

export async function getSolutionsPageData() {
  const sec = await db.cmsSection.findUnique({ where: { sectionKey: "page_solutions" } });
  const items = (sec?.extraContent as any)?.items;
  return {
    section: sec,
    items: Array.isArray(items) && items.length > 0 ? items : staticSolutions,
  };
}

export async function getModulesPageData() {
  const sec = await db.cmsSection.findUnique({ where: { sectionKey: "page_modules" } });
  const items = (sec?.extraContent as any)?.items;
  return {
    section: sec,
    items: Array.isArray(items) && items.length > 0 ? items : staticModules,
  };
}

export async function getIntegrationsPageData() {
  const sec = await db.cmsSection.findUnique({ where: { sectionKey: "page_integrations" } });
  const items = (sec?.extraContent as any)?.items;
  return {
    section: sec,
    items: Array.isArray(items) && items.length > 0 ? items : staticIntegrations,
  };
}

export async function getNovaAiPageData() {
  const sec = await db.cmsSection.findUnique({ where: { sectionKey: "page_nova_ai" } });
  const extra = (sec?.extraContent as any) || {};
  return {
    section: sec,
    bannerUrl: extra.bannerUrl || "/images/hero-bg-1.webp",
    disclaimer: extra.disclaimer || staticNovaDisclaimer,
    workflowSteps: Array.isArray(extra.workflowSteps) && extra.workflowSteps.length > 0 ? extra.workflowSteps : staticNovaSteps,
    sampleTranslations: Array.isArray(extra.sampleTranslations) && extra.sampleTranslations.length > 0 ? extra.sampleTranslations : staticNovaTranslations,
  };
}

export async function getPlatformPageData() {
  const sec = await db.cmsSection.findUnique({ where: { sectionKey: "page_platform" } });
  const extra = (sec?.extraContent as any) || {};
  return {
    section: sec,
    bannerUrl: extra.bannerUrl || "/images/hero-bg-1.webp",
    submodules: Array.isArray(extra.submodules) ? extra.submodules : [],
  };
}
`;

let content = fs.readFileSync('lib/models/cms.model.ts', 'utf-8');
if (!content.includes('getSolutionsPageData')) {
  content += '\n' + helpers;
  fs.writeFileSync('lib/models/cms.model.ts', content, 'utf-8');
  console.log('Added page getter helpers to lib/models/cms.model.ts');
} else {
  console.log('Already added');
}

