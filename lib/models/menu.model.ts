import { db } from "@/lib/db";
import { recordAuditLog } from "@/lib/models/audit.model";
import {
  getCmsNavigationMenus,
  getPublicCmsNavigationMenus,
  saveCmsNavigationMenu,
  deleteCmsNavigationMenu,
  CmsNavMenu,
} from "./cms.model";

export type MenuItemDto = any;

/**
 * Mengambil menu navigasi website publik yang aktif dari CMS JSON
 */
export const getPublicNavigationMenus = getPublicCmsNavigationMenus;

/**
 * Mengambil seluruh menu navigasi untuk dashboard admin dari CMS JSON
 */
export const getAllAdminMenus = getCmsNavigationMenus;

/**
 * Membuat menu navigasi baru di CMS JSON
 */
export async function createMenu(data: any, userId?: string) {
  return await saveCmsNavigationMenu(data, userId);
}

/**
 * Memperbarui menu navigasi di CMS JSON
 */
export async function updateMenu(id: string, data: any, userId?: string) {
  return await saveCmsNavigationMenu({ ...data, id }, userId);
}

/**
 * Menghapus menu navigasi dari CMS JSON
 */
export async function deleteMenu(id: string, userId?: string) {
  return await deleteCmsNavigationMenu(id, userId);
}

/**
 * Mengubah status aktif/nonaktif menu navigasi di CMS JSON
 */
export async function toggleMenuStatus(id: string, isActive: boolean, userId?: string) {
  const sec = await db.cmsSection.findUnique({ where: { sectionKey: "navigation" } });
  if (!sec) throw new Error("Section navigation tidak ditemukan");
  const extra = (sec.extraContent as any) || {};
  const menus: CmsNavMenu[] = Array.isArray(extra.menus) ? [...extra.menus] : [];

  let found: any = null;
  const updateStatus = (list: CmsNavMenu[]) => {
    for (const m of list) {
      if (m.id === id) {
        m.isActive = isActive;
        found = m;
        return true;
      }
      if (m.submenus && updateStatus(m.submenus)) return true;
    }
    return false;
  };

  updateStatus(menus);
  if (!found) throw new Error("Menu tidak ditemukan");

  await db.cmsSection.update({
    where: { sectionKey: "navigation" },
    data: {
      extraContent: { ...extra, menus },
      updatedBy: userId || "SYSTEM",
    },
  });

  if (userId) {
    await recordAuditLog({
      userId,
      action: "TOGGLE_MENU_STATUS",
      entity: "CmsNavigation",
      recordId: id,
      newValue: { isActive },
    });
  }

  return found;
}
