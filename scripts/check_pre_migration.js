const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const sections = await prisma.cmsSection.findMany({ select: { sectionKey: true, id: true } });
  console.log('CMS Sections count:', sections.length);
  console.log('Keys:', sections.map(s => s.sectionKey));
  
  const nav = await prisma.cmsSection.findUnique({ where: { sectionKey: 'navigation' } });
  console.log('Navigation menus count in JSON:', nav?.extraContent?.menus?.length);
  
  const roles = await prisma.role.findMany();
  console.log('Roles:', roles.map(r => r.name));
  
  const users = await prisma.user.findMany({ include: { role: true } });
  console.log('Users:', users.map(u => ({ email: u.email, role: u.role?.name })));
}

main().catch(console.error).finally(() => prisma.$disconnect());

