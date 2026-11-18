/**
 * Seed minimal untuk database PRODUCTION yang baru (setelah `prisma migrate deploy`).
 *
 * Hanya membuat:
 *  - role ADMIN dan USER;
 *  - satu akun admin (admin@diagnova.id) dengan password acak yang kuat.
 *
 * TIDAK membuat data contoh (pasien, dokter, order lab, katalog tes) maupun akun tambahan.
 * Tidak pernah menimpa akun yang sudah ada.
 *
 * Password admin pertama TIDAK pernah dicetak. Sumbernya salah satu:
 *  - ADMIN_INITIAL_PASSWORD (env, min. 16 karakter) — dipakai saat build di Vercel
 *    (lihat scripts/vercel-db-setup.mjs); atau
 *  - dibuat acak lalu ditulis ke ADMIN_PASSWORD_FILE (harus di luar repo).
 *
 * Pemakaian manual (DATABASE_URL menunjuk ke DB production):
 *   SEED_PRODUCTION_CONFIRM=website-diagnova ADMIN_PASSWORD_FILE=<path di luar repo> npx tsx prisma/seed-production.ts
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import fs from "fs";
import path from "path";

const ADMIN_EMAIL = "admin@diagnova.id";

function randomPassword(length = 24): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#%^*-_=+";
  const bytes = crypto.randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) out += alphabet[bytes[i] % alphabet.length];
  // pastikan ada huruf besar, huruf kecil, angka, dan simbol
  return "Dg7!" + out;
}

async function main() {
  if (process.env.SEED_PRODUCTION_CONFIRM !== "website-diagnova") {
    throw new Error("Set SEED_PRODUCTION_CONFIRM=website-diagnova untuk menjalankan seed production.");
  }
  const envPassword = process.env.ADMIN_INITIAL_PASSWORD || "";
  if (envPassword && envPassword.length < 16) {
    throw new Error("ADMIN_INITIAL_PASSWORD minimal 16 karakter.");
  }
  const prisma = new PrismaClient();
  try {
    const roles = [
      { name: "ADMIN", description: "Administrator pengelola sistem, website, dan otorisasi Diagnova" },
      { name: "USER", description: "Pengguna terdaftar / pemohon akses demo Diagnova" },
    ];
    const roleIds: Record<string, string> = {};
    for (const r of roles) {
      const role = await prisma.role.upsert({
        where: { name: r.name },
        update: {},
        create: r,
      });
      roleIds[r.name] = role.id;
    }
    console.log("Roles ready: ADMIN, USER.");

    const existing = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL }, select: { id: true } });
    if (existing) {
      console.log(`Admin ${ADMIN_EMAIL} sudah ada; tidak diubah dan tidak ada password baru.`);
      return;
    }

    // Sumber password hanya diperiksa bila admin memang perlu dibuat.
    let resolvedOut = "";
    if (!envPassword) {
      const outFile = process.env.ADMIN_PASSWORD_FILE;
      if (!outFile) throw new Error("Admin belum ada: isi ADMIN_INITIAL_PASSWORD, atau ADMIN_PASSWORD_FILE (path di luar repo).");
      const repoRoot = path.resolve(__dirname, "..");
      resolvedOut = path.resolve(outFile);
      if (resolvedOut.toLowerCase().startsWith(repoRoot.toLowerCase())) {
        throw new Error("ADMIN_PASSWORD_FILE tidak boleh berada di dalam folder repo.");
      }
    }

    const password = envPassword || randomPassword();
    const passwordHash = await bcrypt.hash(password, 12);
    if (!envPassword) {
      // Tulis file password dulu (wx = gagal bila file sudah ada), baru buat akunnya.
      fs.writeFileSync(
        resolvedOut,
        `Diagnova production admin\nURL: /admin/login\nEmail: ${ADMIN_EMAIL}\nPassword: ${password}\n\nSimpan di password manager, lalu hapus file ini.\n`,
        { flag: "wx" }
      );
    }
    await prisma.user.create({
      data: { name: "Diagnova Admin", email: ADMIN_EMAIL, passwordHash, roleId: roleIds.ADMIN, status: 1 },
    });
    console.log(
      envPassword
        ? `Admin ${ADMIN_EMAIL} dibuat dengan ADMIN_INITIAL_PASSWORD (tidak dicetak).`
        : `Admin ${ADMIN_EMAIL} dibuat. Password ditulis ke file yang ditentukan (tidak dicetak).`
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
