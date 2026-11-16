const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function migrateRolesAndUsers() {
  console.log("=== MEMULAI MIGRASI ROLES & USERS ===");

  await prisma.$transaction(async (tx) => {
    // 1. Ensure ADMIN role exists
    let adminRole = await tx.role.findFirst({ where: { name: "ADMIN" } });
    if (!adminRole) {
      adminRole = await tx.role.create({
        data: {
          name: "ADMIN",
          description: "Administrator pengelola sistem, website, dan otorisasi Diagnova",
        },
      });
      console.log(`Role ADMIN dibuat: ${adminRole.id}`);
    } else {
      console.log(`Role ADMIN sudah ada: ${adminRole.id}`);
    }

    // 2. Ensure USER role exists
    let userRole = await tx.role.findFirst({ where: { name: "USER" } });
    if (!userRole) {
      userRole = await tx.role.create({
        data: {
          name: "USER",
          description: "Pengguna terdaftar / pemohon akses demo Diagnova",
        },
      });
      console.log(`Role USER dibuat: ${userRole.id}`);
    } else {
      console.log(`Role USER sudah ada: ${userRole.id}`);
    }

    // 3. Map users
    // admin@diagnova.id -> ADMIN
    const uAdmin = await tx.user.update({
      where: { email: "admin@diagnova.id" },
      data: { roleId: adminRole.id },
    });
    console.log(`Updated admin@diagnova.id -> ADMIN (roleId: ${adminRole.id})`);

    // sales@diagnova.id -> ADMIN
    const uSales = await tx.user.update({
      where: { email: "sales@diagnova.id" },
      data: { roleId: adminRole.id },
    });
    console.log(`Updated sales@diagnova.id -> ADMIN (roleId: ${adminRole.id})`);

    // erlangga.arta35@smk.belajar.id -> USER
    const uErlangga = await tx.user.update({
      where: { email: "erlangga.arta35@smk.belajar.id" },
      data: { roleId: userRole.id },
    });
    console.log(`Updated erlangga.arta35@smk.belajar.id -> USER (roleId: ${userRole.id})`);

    // artaaazmuridbazma@gmail.com -> USER
    const uArtha = await tx.user.update({
      where: { email: "artaaazmuridbazma@gmail.com" },
      data: { roleId: userRole.id },
    });
    console.log(`Updated artaaazmuridbazma@gmail.com -> USER (roleId: ${userRole.id})`);

    // 4. Verify no user uses old roles
    const usersWithOldRoles = await tx.user.findMany({
      where: {
        roleId: {
          notIn: [adminRole.id, userRole.id],
        },
      },
    });
    if (usersWithOldRoles.length > 0) {
      throw new Error(`Masih ada user dengan role lama: ${JSON.stringify(usersWithOldRoles)}`);
    }

    // 5. Delete obsolete roles
    const deletedRoles = await tx.role.deleteMany({
      where: {
        name: {
          notIn: ["ADMIN", "USER"],
        },
      },
    });
    console.log(`Dihapus ${deletedRoles.count} role lama.`);
  });

  console.log("=== TRANSAKSI MIGRASI SELESAI ===");
  await prisma.$disconnect();
}

migrateRolesAndUsers().catch((e) => {
  console.error("Migration error:", e);
  process.exit(1);
});

