import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Diagnova: role & akun ADMIN awal...");

  // 1. Seed Roles — hanya dua role yang berlaku: ADMIN ("Super Admin") & USER ("Demo User").
  //    Role lama (Sales Admin, Lab Staff, Pathologist) tidak dibuat lagi dan tidak dihapus (OD-01).
  const roles = [
    { name: "Super Admin", description: "ADMIN — mengelola sistem dan permohonan demo", code: "ADMIN" as const },
    { name: "Demo User", description: "USER — akun demo calon klien (login via magic link)", code: "USER" as const },
  ];

  const roleMap: Record<string, string> = {};
  for (const r of roles) {
    const roleRecord = await prisma.role.upsert({
      where: { name: r.name },
      update: { description: r.description, code: r.code },
      create: { name: r.name, description: r.description, code: r.code },
    });
    roleMap[r.name] = roleRecord.id;
  }
  console.log("Roles seeded successfully.");

  // 2. Akun ADMIN awal. Password WAJIB dari environment; tidak ada password default di repository
  //    dan password tidak pernah dicetak ke log.
  const adminEmail = (process.env.SEED_ADMIN_EMAIL || "admin@diagnova.id").toLowerCase().trim();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    if (!adminPassword || adminPassword.length < 12) {
      throw new Error("SEED_ADMIN_PASSWORD wajib diisi (minimal 12 karakter) untuk membuat akun ADMIN awal.");
    }
    await prisma.user.create({
      data: {
        name: "Diagnova Super Admin",
        email: adminEmail,
        passwordHash: await bcrypt.hash(adminPassword, 10),
        roleId: roleMap["Super Admin"],
        status: "ACTIVE",
      },
    });
    console.log(`ADMIN account created: ${adminEmail}`);
  } else {
    // Akun yang sudah ada tidak diubah (password tidak ditimpa)
    console.log(`ADMIN account already exists: ${adminEmail} (unchanged)`);
  }

  console.log("Seeding completed successfully (role + ADMIN). Data LIS contoh TIDAK dibuat; gunakan npm run db:seed:demo-lis untuk lingkungan demo/test.");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
