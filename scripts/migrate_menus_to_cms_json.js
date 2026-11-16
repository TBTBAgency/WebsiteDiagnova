const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrateMenusToJson() {
  console.log('--- Migrasi Data Menus ke CmsSection.extraContent.navigation ---');

  // 1. Ambil seluruh data menu dan section dari DB
  const sections = await prisma.cmsSection.findMany();
  const sectionIdToKey = new Map();
  sections.forEach(s => sectionIdToKey.set(s.id, s.sectionKey));

  const allMenus = await prisma.menu.findMany({
    where: { isDeleted: false },
    orderBy: { sortOrder: 'asc' },
  });

  console.log(`Ditemukan ${allMenus.length} menu aktif di tabel 'menus'.`);

  // 2. Pisahkan root dan submenus
  const rootMenus = allMenus.filter(m => !m.parentId);
  const childMenus = allMenus.filter(m => m.parentId);

  console.log(`Root menus: ${rootMenus.length}, Submenus: ${childMenus.length}`);

  const hierarchicalMenus = rootMenus.map(root => {
    const children = childMenus
      .filter(c => c.parentId === root.id)
      .map(child => ({
        id: child.id,
        labelId: child.labelId,
        labelEn: child.labelEn,
        descriptionId: child.descriptionId || '',
        descriptionEn: child.descriptionEn || '',
        url: child.url || '',
        sectionKey: child.sectionId ? (sectionIdToKey.get(child.sectionId) || null) : null,
        iconName: child.iconName || 'Layers',
        sortOrder: child.sortOrder,
        isActive: child.isActive,
      }));

    return {
      id: root.id,
      labelId: root.labelId,
      labelEn: root.labelEn,
      descriptionId: root.descriptionId || '',
      descriptionEn: root.descriptionEn || '',
      url: root.url || '',
      sectionKey: root.sectionId ? (sectionIdToKey.get(root.sectionId) || null) : null,
      iconName: root.iconName || 'Layers',
      sortOrder: root.sortOrder,
      isActive: root.isActive,
      submenus: children,
    };
  });

  // 3. Upsert CmsSection dengan sectionKey: 'navigation'
  const navSection = await prisma.cmsSection.upsert({
    where: { sectionKey: 'navigation' },
    update: {
      badgeId: 'Navigasi',
      badgeEn: 'Navigation',
      titleId: 'Menu Navigasi Website Diagnova',
      titleEn: 'Diagnova Website Navigation Menu',
      extraContent: {
        menus: hierarchicalMenus,
      },
      isPublished: true,
    },
    create: {
      sectionKey: 'navigation',
      badgeId: 'Navigasi',
      badgeEn: 'Navigation',
      titleId: 'Menu Navigasi Website Diagnova',
      titleEn: 'Diagnova Website Navigation Menu',
      extraContent: {
        menus: hierarchicalMenus,
      },
      isPublished: true,
    },
  });

  console.log(`[SUKSES] Navigasi berhasil disimpan ke CmsSection (id: ${navSection.id})`);
  const totalSub = hierarchicalMenus.reduce((sum, r) => sum + r.submenus.length, 0);
  console.log(`Tersimpan: ${hierarchicalMenus.length} root menus, ${totalSub} submenus di JSON.`);
}

migrateMenusToJson()
  .catch(err => {
    console.error('Migration error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

