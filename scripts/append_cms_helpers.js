const fs = require('fs');

const extraCode = `
export interface AllCmsData {
  homepage: CmsHomepageData;
  navigation: CmsNavMenu[];
  platform: any;
  solutions: any;
  modules: any;
  novaAi: any;
  integrations: any;
}

/**
 * Mengambil seluruh data CMS untuk Single-Hub CMS Administrator
 */
export async function getAllCmsContent(): Promise<AllCmsData> {
  const [homepage, navigation, platform, solutions, modules, novaAi, integrations] = await Promise.all([
    getCmsHomepageContent(),
    getCmsNavigationMenus(),
    getCmsSectionByKey("page_platform"),
    getCmsSectionByKey("page_solutions"),
    getCmsSectionByKey("page_modules"),
    getCmsSectionByKey("page_nova_ai"),
    getCmsSectionByKey("page_integrations"),
  ]);

  return {
    homepage,
    navigation,
    platform: platform ? { section: platform, extraContent: platform.extraContent } : null,
    solutions: solutions ? { section: solutions, items: (solutions.extraContent as any)?.items || [] } : null,
    modules: modules ? { section: modules, items: (modules.extraContent as any)?.items || [] } : null,
    novaAi: novaAi ? { section: novaAi, extraContent: novaAi.extraContent } : null,
    integrations: integrations ? { section: integrations, items: (integrations.extraContent as any)?.items || [] } : null,
  };
}

/**
 * Simpan atau perbarui item solusi pada page_solutions
 */
export async function saveSolutionItem(item: any, userId?: string) {
  const sec = await db.cmsSection.findUnique({ where: { sectionKey: "page_solutions" } });
  if (!sec) throw new Error("Section 'page_solutions' tidak ditemukan.");
  const extra = (sec.extraContent as any) || {};
  const items: any[] = Array.isArray(extra.items) ? [...extra.items] : [];
  let saved: any;
  if (item.slug) {
    const idx = items.findIndex((i) => i.slug === item.slug);
    if (idx >= 0) {
      saved = { ...items[idx], ...item };
      items[idx] = saved;
    } else {
      saved = { ...item };
      items.push(saved);
    }
  } else {
    saved = { ...item, slug: "solusi-" + Date.now() };
    items.push(saved);
  }
  await db.cmsSection.update({
    where: { sectionKey: "page_solutions" },
    data: { extraContent: { ...extra, items } },
  });
  await recordAuditLog({
    userId,
    action: "SAVE_SOLUTION_ITEM_JSON",
    entity: "cms_sections",
    recordId: saved.slug,
    newValue: saved,
  });
  return saved;
}

export async function deleteSolutionItem(slug: string, userId?: string) {
  const sec = await db.cmsSection.findUnique({ where: { sectionKey: "page_solutions" } });
  if (!sec) throw new Error("Section 'page_solutions' tidak ditemukan.");
  const extra = (sec.extraContent as any) || {};
  const items: any[] = (extra.items || []).filter((i: any) => i.slug !== slug);
  await db.cmsSection.update({
    where: { sectionKey: "page_solutions" },
    data: { extraContent: { ...extra, items } },
  });
  await recordAuditLog({
    userId,
    action: "DELETE_SOLUTION_ITEM_JSON",
    entity: "cms_sections",
    recordId: slug,
  });
  return { success: true };
}

/**
 * Simpan atau perbarui item modul pada page_modules
 */
export async function saveModuleItem(item: any, userId?: string) {
  const sec = await db.cmsSection.findUnique({ where: { sectionKey: "page_modules" } });
  if (!sec) throw new Error("Section 'page_modules' tidak ditemukan.");
  const extra = (sec.extraContent as any) || {};
  const items: any[] = Array.isArray(extra.items) ? [...extra.items] : [];
  let saved: any;
  if (item.slug) {
    const idx = items.findIndex((i) => i.slug === item.slug);
    if (idx >= 0) {
      saved = { ...items[idx], ...item };
      items[idx] = saved;
    } else {
      saved = { ...item };
      items.push(saved);
    }
  } else {
    saved = { ...item, slug: "modul-" + Date.now() };
    items.push(saved);
  }
  await db.cmsSection.update({
    where: { sectionKey: "page_modules" },
    data: { extraContent: { ...extra, items } },
  });
  await recordAuditLog({
    userId,
    action: "SAVE_MODULE_ITEM_JSON",
    entity: "cms_sections",
    recordId: saved.slug,
    newValue: saved,
  });
  return saved;
}

export async function deleteModuleItem(slug: string, userId?: string) {
  const sec = await db.cmsSection.findUnique({ where: { sectionKey: "page_modules" } });
  if (!sec) throw new Error("Section 'page_modules' tidak ditemukan.");
  const extra = (sec.extraContent as any) || {};
  const items: any[] = (extra.items || []).filter((i: any) => i.slug !== slug);
  await db.cmsSection.update({
    where: { sectionKey: "page_modules" },
    data: { extraContent: { ...extra, items } },
  });
  await recordAuditLog({
    userId,
    action: "DELETE_MODULE_ITEM_JSON",
    entity: "cms_sections",
    recordId: slug,
  });
  return { success: true };
}

/**
 * Simpan atau perbarui item integrasi pada page_integrations
 */
export async function saveIntegrationItem(item: any, userId?: string) {
  const sec = await db.cmsSection.findUnique({ where: { sectionKey: "page_integrations" } });
  if (!sec) throw new Error("Section 'page_integrations' tidak ditemukan.");
  const extra = (sec.extraContent as any) || {};
  const items: any[] = Array.isArray(extra.items) ? [...extra.items] : [];
  let saved: any;
  if (item.slug) {
    const idx = items.findIndex((i) => i.slug === item.slug);
    if (idx >= 0) {
      saved = { ...items[idx], ...item };
      items[idx] = saved;
    } else {
      saved = { ...item };
      items.push(saved);
    }
  } else {
    saved = { ...item, slug: "integrasi-" + Date.now() };
    items.push(saved);
  }
  await db.cmsSection.update({
    where: { sectionKey: "page_integrations" },
    data: { extraContent: { ...extra, items } },
  });
  await recordAuditLog({
    userId,
    action: "SAVE_INTEGRATION_ITEM_JSON",
    entity: "cms_sections",
    recordId: saved.slug,
    newValue: saved,
  });
  return saved;
}

export async function deleteIntegrationItem(slug: string, userId?: string) {
  const sec = await db.cmsSection.findUnique({ where: { sectionKey: "page_integrations" } });
  if (!sec) throw new Error("Section 'page_integrations' tidak ditemukan.");
  const extra = (sec.extraContent as any) || {};
  const items: any[] = (extra.items || []).filter((i: any) => i.slug !== slug);
  await db.cmsSection.update({
    where: { sectionKey: "page_integrations" },
    data: { extraContent: { ...extra, items } },
  });
  await recordAuditLog({
    userId,
    action: "DELETE_INTEGRATION_ITEM_JSON",
    entity: "cms_sections",
    recordId: slug,
  });
  return { success: true };
}
`;

let current = fs.readFileSync('lib/models/cms.model.ts', 'utf-8');
if (!current.includes('getAllCmsContent')) {
  current += '\n' + extraCode;
  fs.writeFileSync('lib/models/cms.model.ts', current, 'utf-8');
  console.log('Appended CMS helpers to lib/models/cms.model.ts');
} else {
  console.log('Already appended');
}

