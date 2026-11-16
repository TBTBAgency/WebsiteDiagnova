const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tables = await prisma.$queryRaw`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name ASC;
  `;
  console.log('Public tables in PostgreSQL:');
  const tableNames = tables.map(t => t.table_name);
  console.log(tableNames);

  const droppedTables = ['cms_hero_slides', 'cms_comparison_items', 'cms_testimonials', 'cms_partners', 'menus', 'media'];
  const stillExist = droppedTables.filter(t => tableNames.includes(t));
  console.log('Obsolete tables still present (should be empty):', stillExist);

  const requiredTables = [
    'cms_sections', 'users', 'roles', 'leads', 'patients',
    'physicians', 'test_catalogs', 'lab_orders', 'lab_order_items',
    'specimens', 'demo_magic_links', 'audit_logs'
  ];
  const missingRequired = requiredTables.filter(t => !tableNames.includes(t));
  console.log('Required tables missing (should be empty):', missingRequired);

  // Check data integrity
  const users = await prisma.user.findMany({ select: { email: true, role: { select: { name: true } } } });
  console.log('Users count:', users.length, users);

  const cmsSections = await prisma.cmsSection.findMany({ select: { sectionKey: true } });
  console.log('CMS Sections count:', cmsSections.length);
  console.log('Section keys:', cmsSections.map(s => s.sectionKey));
}

main().catch(console.error).finally(() => prisma.$disconnect());

