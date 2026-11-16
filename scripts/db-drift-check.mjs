#!/usr/bin/env node
// Drift check: apakah folder prisma/migrations menghasilkan struktur yang sama dengan prisma/schema.prisma?
// Phase 8.1 / M-04.
//
// PERINGATAN: Prisma MENGOSONGKAN (reset) shadow database saat pemeriksaan ini. Shadow database WAJIB
// database sekali-pakai khusus, BUKAN database development/staging/produksi.
//
// Pemakaian (sama di Windows cmd, PowerShell, Linux/macOS):
//   cmd        : set SHADOW_DATABASE_URL=postgresql://.../diagnova_shadow && npm run db:drift-check -- --confirm-shadow-wipe
//   PowerShell : $env:SHADOW_DATABASE_URL="postgresql://.../diagnova_shadow"; npm run db:drift-check -- --confirm-shadow-wipe
//   bash       : SHADOW_DATABASE_URL=postgresql://.../diagnova_shadow npm run db:drift-check -- --confirm-shadow-wipe
// Exit code: 0 = tidak ada drift · 2 = drift · 1 = error / ditolak pemeriksaan keselamatan.
import { describeDbUrl, parseDbUrl, readAppDatabaseUrl, sameDatabase, runPrisma, fail } from "./lib/db-safety.mjs";

const PROTECTED_DB_NAMES = ["diagnova", "postgres", "template0", "template1"];
const shadow = process.env.SHADOW_DATABASE_URL;

if (!shadow) fail("SHADOW_DATABASE_URL wajib di-set ke database sekali-pakai (nama database harus mengandung 'shadow').");

let info;
try {
  info = parseDbUrl(shadow);
} catch (e) {
  fail(e.message);
}

if (!/shadow/i.test(info.database)) {
  fail(`Ditolak: nama database shadow "${info.database}" tidak mengandung kata 'shadow'. Gunakan database khusus, mis. diagnova_shadow.`);
}
if (PROTECTED_DB_NAMES.includes(info.database.toLowerCase())) {
  fail(`Ditolak: "${info.database}" adalah nama database yang dilindungi.`);
}

const appUrl = readAppDatabaseUrl();
if (appUrl) {
  let same = false;
  try {
    same = sameDatabase(shadow, appUrl);
  } catch {
    same = false;
  }
  if (same) fail("Ditolak: SHADOW_DATABASE_URL menunjuk database yang sama dengan DATABASE_URL aplikasi.");
}
for (const key of ["TARGET_DATABASE_URL", "PRODUCTION_DATABASE_URL", "STAGING_DATABASE_URL"]) {
  if (process.env[key]) {
    try {
      if (sameDatabase(shadow, process.env[key])) fail(`Ditolak: SHADOW_DATABASE_URL sama dengan ${key}.`);
    } catch {
      /* abaikan URL lain yang tidak valid */
    }
  }
}

console.log(`Shadow DB : ${describeDbUrl(shadow)}`);
console.log("PERINGATAN: isi shadow database di atas akan DIHAPUS oleh Prisma selama pemeriksaan.\n");

if (!process.argv.includes("--confirm-shadow-wipe")) {
  fail("Tambahkan argumen --confirm-shadow-wipe untuk menyatakan bahwa shadow database boleh dikosongkan.");
}

// DATABASE_URL di-set ke shadow agar Prisma tidak memuat .env proyek (tidak ada koneksi ke DB aplikasi).
const code = runPrisma(
  [
    "migrate", "diff",
    "--from-migrations", "prisma/migrations",
    "--to-schema-datamodel", "prisma/schema.prisma",
    "--shadow-database-url", shadow,
    "--exit-code",
  ],
  { DATABASE_URL: shadow }
);

if (code === 0) {
  console.log("\n✔ Tidak ada drift: migrations = schema.prisma (level Prisma).");
  console.log("  CHECK/trigger/function diverifikasi terpisah dengan prisma/sql/verify-post-migration.sql.");
} else if (code === 2) {
  console.error("\n✖ DRIFT: migrations berbeda dari schema.prisma. Buat migration baru yang ditulis & di-review manual.");
}
process.exit(code);
