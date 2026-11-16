const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();
Promise.all([
  p.role.findMany(),
  p.user.findMany({ select: { id: true, name: true, email: true, roleId: true, role: { select: { id: true, name: true } }, status: true } })
]).then(([r, u]) => {
  console.log("=== ROLES ===");
  console.log(JSON.stringify(r, null, 2));
  console.log("=== USERS ===");
  console.log(JSON.stringify(u, null, 2));
}).finally(() => p.$disconnect());

