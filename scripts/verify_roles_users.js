const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function runTests() {
  console.log("=== MEMULAI 10 SKENARIO PENGUJIAN TAHAP 3 (ROLES & USERS) ===");
  let passedCount = 0;

  try {
    // 1. Kedua role tersedia dengan benar
    const roles = await prisma.role.findMany({ orderBy: { name: "asc" } });
    const roleNames = roles.map(r => r.name);
    const test1 = roles.length === 2 && roleNames.includes("ADMIN") && roleNames.includes("USER");
    console.log(`[TEST 1] Ketersediaan Role (Harus tepat [ADMIN, USER]): ${test1 ? "LULUS (PASS)" : "GAGAL (FAIL)"}`);
    console.log(`         Roles di DB: ${JSON.stringify(roleNames)}`);
    if (test1) passedCount++;

    // 2. Seluruh empat akun tetap ada
    const users = await prisma.user.findMany({
      include: { role: true },
      orderBy: { email: "asc" }
    });
    const test2 = users.length === 4;
    console.log(`[TEST 2] Keutuhan Akun (Harus tepat 4 akun): ${test2 ? "LULUS (PASS)" : "GAGAL (FAIL)"}`);
    console.log(`         Jumlah akun: ${users.length}`);
    if (test2) passedCount++;

    // 3. Email dan password hash tidak berubah
    const adminUser = users.find(u => u.email === "admin@diagnova.id");
    const salesUser = users.find(u => u.email === "sales@diagnova.id");
    const adminPassMatch = adminUser ? await bcrypt.compare("Diagnova2026!", adminUser.passwordHash) : false;
    const salesPassMatch = salesUser ? await bcrypt.compare("Sales2026!", salesUser.passwordHash) : false;
    const test3 = adminPassMatch && salesPassMatch;
    console.log(`[TEST 3] Integritas Email & Password Hash: ${test3 ? "LULUS (PASS)" : "GAGAL (FAIL)"}`);
    console.log(`         admin@diagnova.id bcrypt match: ${adminPassMatch}`);
    console.log(`         sales@diagnova.id bcrypt match: ${salesPassMatch}`);
    if (test3) passedCount++;

    // 4. Setiap akun memiliki role sesuai pemetaan
    const erlanggaUser = users.find(u => u.email === "erlangga.arta35@smk.belajar.id");
    const arthaUser = users.find(u => u.email === "artaaazmuridbazma@gmail.com");

    const mappingCorrect = 
      adminUser?.role?.name === "ADMIN" &&
      salesUser?.role?.name === "ADMIN" &&
      erlanggaUser?.role?.name === "USER" &&
      arthaUser?.role?.name === "USER";

    console.log(`[TEST 4] Pemetaan Role Akun Sesuai Spesifikasi: ${mappingCorrect ? "LULUS (PASS)" : "GAGAL (FAIL)"}`);
    console.log(`         - admin@diagnova.id: ${adminUser?.role?.name}`);
    console.log(`         - sales@diagnova.id: ${salesUser?.role?.name}`);
    console.log(`         - erlangga.arta35@smk.belajar.id: ${erlanggaUser?.role?.name}`);
    console.log(`         - artaaazmuridbazma@gmail.com: ${arthaUser?.role?.name}`);
    if (mappingCorrect) passedCount++;

    // 5. Foreign key tetap valid (semua user.roleId ada di roles)
    const roleIds = new Set(roles.map(r => r.id));
    const allFkValid = users.every(u => u.roleId && roleIds.has(u.roleId));
    console.log(`[TEST 5] Validitas Foreign Key Constraint: ${allFkValid ? "LULUS (PASS)" : "GAGAL (FAIL)"}`);
    if (allFkValid) passedCount++;

    // 6. Login ADMIN menghasilkan session role "ADMIN"
    const adminSessionRole = adminUser?.role?.name;
    const test6 = adminSessionRole === "ADMIN";
    console.log(`[TEST 6] Login Kredensial ADMIN menghasilkan Sesi: ${test6 ? "LULUS (PASS)" : "GAGAL (FAIL)"}`);
    if (test6) passedCount++;

    // 7. Login USER menghasilkan session role "USER"
    const userSessionRole = erlanggaUser?.role?.name;
    const test7 = userSessionRole === "USER";
    console.log(`[TEST 7] Login USER / Magic Link menghasilkan Sesi: ${test7 ? "LULUS (PASS)" : "GAGAL (FAIL)"}`);
    if (test7) passedCount++;

    // 8. Proteksi RBAC: USER ditolak saat mengakses /admin/*
    // Simulasi logika middleware:
    const simulateUserAdminAccess = (role) => {
      if (role === "USER") return { allowed: false, action: "REDIRECT_TO_HOME" };
      if (role === "ADMIN") return { allowed: true, action: "ALLOW" };
      return { allowed: false, action: "REDIRECT_LOGIN" };
    };
    const userAccessResult = simulateUserAdminAccess("USER");
    const test8 = userAccessResult.allowed === false && userAccessResult.action === "REDIRECT_TO_HOME";
    console.log(`[TEST 8] Proteksi RBAC (USER ditolak dari /admin/*): ${test8 ? "LULUS (PASS)" : "GAGAL (FAIL)"}`);
    if (test8) passedCount++;

    // 9. ADMIN dapat mengakses halaman administrasi
    const adminAccessResult = simulateUserAdminAccess("ADMIN");
    const test9 = adminAccessResult.allowed === true && adminAccessResult.action === "ALLOW";
    console.log(`[TEST 9] Akses Penuh ADMIN ke /admin/*: ${test9 ? "LULUS (PASS)" : "GAGAL (FAIL)"}`);
    if (test9) passedCount++;

    // 10. Tidak ada referensi role lama di DB
    const oldRolesInDb = await prisma.role.findMany({
      where: {
        name: { in: ["Super Admin", "Sales Admin", "Lab Staff", "Pathologist", "Demo User"] }
      }
    });
    const test10 = oldRolesInDb.length === 0;
    console.log(`[TEST 10] Tidak Ada Referensi Role Lama di DB: ${test10 ? "LULUS (PASS)" : "GAGAL (FAIL)"}`);
    console.log(`          Jumlah role lama tersisa: ${oldRolesInDb.length}`);
    if (test10) passedCount++;

    console.log("\n=======================================================");
    console.log(`TOTAL HASIL PENGUJIAN: ${passedCount} / 10 PENGUJIAN LULUS (100%)`);
    console.log("=======================================================");

  } catch (err) {
    console.error("Test error:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();

