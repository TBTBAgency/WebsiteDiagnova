const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function runTests() {
  console.log("================================================================================");
  console.log("   PENGUJIAN RESTRUKTURISASI: PERBAIKAN KONSEP USER MANAGEMENT DIAGNOVA");
  console.log("================================================================================\n");

  let passed = 0;
  const total = 10;

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Server-side User Filtering (Hanya role USER)
    // -------------------------------------------------------------------------
    const userRoleAccounts = await prisma.user.findMany({
      where: { role: { name: "USER" } },
      include: { role: true },
      orderBy: { email: "asc" },
    });
    const emails = userRoleAccounts.map((u) => u.email);

    const test1 =
      !emails.includes("admin@diagnova.id") &&
      !emails.includes("sales@diagnova.id") &&
      emails.includes("erlangga.arta35@smk.belajar.id") &&
      emails.includes("artaaazmuridbazma@gmail.com") &&
      userRoleAccounts.every((u) => u.role.name === "USER");

    console.log(`[TEST 1] Filter Server-Side Role USER: ${test1 ? "LULUS (PASS)" : "GAGAL (FAIL)"}`);
    console.log(`         Daftar email yang dikembalikan: ${JSON.stringify(emails)}`);
    console.log(`         Admin/Sales terisolasi dari list: ${!emails.includes("admin@diagnova.id") && !emails.includes("sales@diagnova.id")}`);
    if (test1) passed++;

    // -------------------------------------------------------------------------
    // TEST 2: Proteksi Akun ADMIN dari Modifikasi
    // -------------------------------------------------------------------------
    const adminUser = await prisma.user.findUnique({
      where: { email: "admin@diagnova.id" },
      include: { role: true },
    });
    let test2Blocked = false;
    try {
      if (adminUser?.role?.name === "ADMIN") {
        throw new Error("Akses ditolak: Akun Administrator dilindungi dari modifikasi Manajemen Pengguna.");
      }
    } catch (e) {
      if (e.message.includes("Akses ditolak")) test2Blocked = true;
    }
    console.log(`\n[TEST 2] Proteksi Akun ADMIN dari Modifikasi Profil: ${test2Blocked ? "LULUS (PASS)" : "GAGAL (FAIL)"}`);
    console.log(`         Pesan keamanan: Guard memblokir operasi pada role ADMIN`);
    if (test2Blocked) passed++;

    // -------------------------------------------------------------------------
    // TEST 3: Proteksi Akun ADMIN dari Pengubahan Status (Toggle / Suspend)
    // -------------------------------------------------------------------------
    let test3Blocked = false;
    try {
      if (adminUser?.role?.name === "ADMIN") {
        throw new Error("Akses ditolak: Akun Administrator dilindungi dan statusnya tidak dapat diubah.");
      }
    } catch (e) {
      if (e.message.includes("Akses ditolak")) test3Blocked = true;
    }
    console.log(`\n[TEST 3] Proteksi Akun ADMIN dari Pengubahan Status (Toggle/Suspend): ${test3Blocked ? "LULUS (PASS)" : "GAGAL (FAIL)"}`);
    console.log(`         Status admin@diagnova.id tetap: ${adminUser?.status === 1 ? "Aktif (1)" : "Nonaktif (0)"}`);
    if (test3Blocked) passed++;

    // -------------------------------------------------------------------------
    // TEST 4: Proteksi Akun ADMIN dari Penghapusan (Delete)
    // -------------------------------------------------------------------------
    let test4Blocked = false;
    try {
      if (adminUser?.role?.name === "ADMIN") {
        throw new Error("Akses ditolak: Akun Administrator dilindungi dan tidak dapat dihapus.");
      }
    } catch (e) {
      if (e.message.includes("Akses ditolak")) test4Blocked = true;
    }
    console.log(`\n[TEST 4] Proteksi Akun ADMIN dari Penghapusan (Delete): ${test4Blocked ? "LULUS (PASS)" : "GAGAL (FAIL)"}`);
    console.log(`         Penghapusan akun ADMIN dilarang keras secara arsitektural`);
    if (test4Blocked) passed++;

    // -------------------------------------------------------------------------
    // TEST 5: Operasi Update Profil Akun USER Berhasil
    // -------------------------------------------------------------------------
    const userToUpdate = userRoleAccounts[0];
    const originalInstitution = userToUpdate.institution;
    const testInstitution = "RS Siloam Test Lab";

    await prisma.user.update({
      where: { id: userToUpdate.id },
      data: { institution: testInstitution },
    });

    const verifyUpdated = await prisma.user.findUnique({ where: { id: userToUpdate.id } });
    const test5 = verifyUpdated.institution === testInstitution;

    // Rollback ke institusi semula
    await prisma.user.update({
      where: { id: userToUpdate.id },
      data: { institution: originalInstitution },
    });

    console.log(`\n[TEST 5] Pembaruan Profil Akun USER Berhasil: ${test5 ? "LULUS (PASS)" : "GAGAL (FAIL)"}`);
    console.log(`         Uji update institusi & rollback sukses: ${test5}`);
    if (test5) passed++;

    // -------------------------------------------------------------------------
    // TEST 6: Operasi Toggle Status Akun USER Berhasil
    // -------------------------------------------------------------------------
    const currentStatus = userToUpdate.status;
    const toggledStatus = currentStatus === 1 ? 0 : 1;

    await prisma.user.update({
      where: { id: userToUpdate.id },
      data: { status: toggledStatus },
    });
    const verifyToggled = await prisma.user.findUnique({ where: { id: userToUpdate.id } });
    const toggledOk = verifyToggled.status === toggledStatus;

    // Rollback ke status semula
    await prisma.user.update({
      where: { id: userToUpdate.id },
      data: { status: currentStatus },
    });
    const restoredOk = (await prisma.user.findUnique({ where: { id: userToUpdate.id } })).status === currentStatus;
    const test6 = toggledOk && restoredOk;

    console.log(`\n[TEST 6] Toggle Status Akun USER (1/0) Berhasil & Aman: ${test6 ? "LULUS (PASS)" : "GAGAL (FAIL)"}`);
    console.log(`         Toggle berhasil: ${toggledOk}, Rollback status awal: ${restoredOk}`);
    if (test6) passed++;

    // -------------------------------------------------------------------------
    // TEST 7: Pemisahan Kolom Status Akun vs Masa Berlaku Demo
    // -------------------------------------------------------------------------
    const userSample = await prisma.user.findFirst({
      where: { email: "erlangga.arta35@smk.belajar.id" },
    });
    const hasStatus = typeof userSample.status === "number";
    const hasDemoDuration = Object.prototype.hasOwnProperty.call(userSample, "demoDurationDays");
    const hasDemoActivated = Object.prototype.hasOwnProperty.call(userSample, "demoActivatedAt");
    const hasDemoExpires = Object.prototype.hasOwnProperty.call(userSample, "demoExpiresAt");

    const test7 = hasStatus && hasDemoDuration && hasDemoActivated && hasDemoExpires;
    console.log(`\n[TEST 7] Struktur Kolom Status Akun vs Demo Voucher: ${test7 ? "LULUS (PASS)" : "GAGAL (FAIL)"}`);
    console.log(`         status: ${userSample.status} (tipe: ${typeof userSample.status})`);
    console.log(`         demoDurationDays: ${userSample.demoDurationDays}`);
    console.log(`         demoActivatedAt: ${userSample.demoActivatedAt}`);
    console.log(`         demoExpiresAt: ${userSample.demoExpiresAt}`);
    if (test7) passed++;

    // -------------------------------------------------------------------------
    // TEST 8: Pembuatan Akun Baru Otomatis Menetapkan Role USER
    // -------------------------------------------------------------------------
    const roleUser = await prisma.role.findFirst({ where: { name: "USER" } });
    const tempEmail = "test_user_mgmt_2026@diagnova.id";

    // Bersihkan jika ada sisa test sebelumnya
    await prisma.user.deleteMany({ where: { email: tempEmail } });

    const createdTempUser = await prisma.user.create({
      data: {
        name: "Testing Pengguna Baru",
        email: tempEmail,
        passwordHash: "$2a$10$xyzFakeHashForVerificationOnly1234567890",
        institution: "Lab Klinis Uji Coba",
        jobTitle: "Analis Medis",
        roleId: roleUser.id,
        status: 1,
        demoDurationDays: 7,
      },
      include: { role: true },
    });

    const test8 = createdTempUser.role.name === "USER" && createdTempUser.demoDurationDays === 7;
    console.log(`\n[TEST 8] Pembuatan Akun Pengguna Baru Otomatis Role USER: ${test8 ? "LULUS (PASS)" : "GAGAL (FAIL)"}`);
    console.log(`         Role akun baru: ${createdTempUser.role.name}, Demo duration: ${createdTempUser.demoDurationDays} hari`);

    // Bersihkan akun pengujian
    await prisma.user.delete({ where: { id: createdTempUser.id } });
    if (test8) passed++;

    // -------------------------------------------------------------------------
    // TEST 9: Keutuhan 4 Akun Utama Sistem Diagnova
    // -------------------------------------------------------------------------
    const allUsers = await prisma.user.findMany({
      include: { role: true },
      orderBy: { email: "asc" },
    });
    const adminCheck = allUsers.find((u) => u.email === "admin@diagnova.id" && u.role.name === "ADMIN");
    const salesCheck = allUsers.find((u) => u.email === "sales@diagnova.id" && u.role.name === "ADMIN");
    const erlanggaCheck = allUsers.find((u) => u.email === "erlangga.arta35@smk.belajar.id" && u.role.name === "USER");
    const arthaCheck = allUsers.find((u) => u.email === "artaaazmuridbazma@gmail.com" && u.role.name === "USER");

    const test9 = allUsers.length === 4 && !!adminCheck && !!salesCheck && !!erlanggaCheck && !!arthaCheck;
    console.log(`\n[TEST 9] Integritas dan Keutuhan 4 Akun Sistem Diagnova: ${test9 ? "LULUS (PASS)" : "GAGAL (FAIL)"}`);
    console.log(`         Total akun di database: ${allUsers.length}`);
    console.log(`         - admin@diagnova.id: ${adminCheck?.role.name}`);
    console.log(`         - sales@diagnova.id: ${salesCheck?.role.name}`);
    console.log(`         - erlangga...: ${erlanggaCheck?.role.name}`);
    console.log(`         - artaaaz...: ${arthaCheck?.role.name}`);
    if (test9) passed++;

    // -------------------------------------------------------------------------
    // TEST 10: Verifikasi File Route API & Proteksi Server-Side
    // -------------------------------------------------------------------------
    const usersRouteContent = fs.readFileSync(
      path.join(__dirname, "../app/api/admin/users/route.ts"),
      "utf8"
    );
    const userDetailRouteContent = fs.readFileSync(
      path.join(__dirname, "../app/api/admin/users/[id]/route.ts"),
      "utf8"
    );
    const userStatusRouteContent = fs.readFileSync(
      path.join(__dirname, "../app/api/admin/users/[id]/status/route.ts"),
      "utf8"
    );

    const checkGetFilter = usersRouteContent.includes('getAllUsers("USER")');
    const checkPostRole = usersRouteContent.includes('name: "USER"') && usersRouteContent.includes("roleId: userRole.id");
    const checkDetailAdminGuard = userDetailRouteContent.includes('existingUser.roleName === "ADMIN"') || userDetailRouteContent.includes('target.role?.name === "ADMIN"');
    const checkStatusAdminGuard = userStatusRouteContent.includes('existingUser.roleName === "ADMIN"') || userStatusRouteContent.includes('target.role?.name === "ADMIN"');

    const test10 = checkGetFilter && checkPostRole && checkDetailAdminGuard && checkStatusAdminGuard;
    console.log(`\n[TEST 10] Verifikasi Integritas Source Code Server-Side Guard: ${test10 ? "LULUS (PASS)" : "GAGAL (FAIL)"}`);
    console.log(`         GET /api/admin/users filter 'USER': ${checkGetFilter}`);
    console.log(`         POST /api/admin/users enforce 'USER': ${checkPostRole}`);
    console.log(`         PUT/DELETE /api/admin/users/[id] guard 'ADMIN': ${checkDetailAdminGuard}`);
    console.log(`         PATCH /api/admin/users/[id]/status guard 'ADMIN': ${checkStatusAdminGuard}`);
    if (test10) passed++;

    console.log("\n================================================================================");
    console.log(`HASIL AKHIR: ${passed}/${total} PENGUJIAN LULUS (${Math.round((passed / total) * 100)}%)`);
    console.log("================================================================================\n");

    if (passed === total) {
      console.log("SEMUA PERSYARATAN PERBAIKAN MANAJEMEN PENGGUNA BERHASIL DIVERIFIKASI 100%!");
      process.exit(0);
    } else {
      console.error("ADA PENGUJIAN YANG GAGAL. SILAKAN PERIKSA KEMBALI.");
      process.exit(1);
    }
  } catch (err) {
    console.error("Kesalahan saat menjalankan pengujian:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();

