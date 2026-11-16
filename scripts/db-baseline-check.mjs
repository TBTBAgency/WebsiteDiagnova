#!/usr/bin/env node
// Pemeriksaan struktur READ-ONLY sebelum baseline (`prisma migrate resolve --applied`) — Phase 8.1 / H-01.
//
// Membuktikan bahwa database target IDENTIK dengan schema `main` @ c944f9a (struktur yang selama ini dibuat
// `prisma db push`). Hanya bila identik, baseline 4 migration lama sah dilakukan.
//
// Pemakaian (Windows cmd / PowerShell / bash sama):
//   set TARGET_DATABASE_URL=postgresql://...      (cmd)      $env:TARGET_DATABASE_URL="..." (PowerShell)
//   npm run db:baseline-check
// Exit code: 0 = identik (boleh baseline) · 2 = BERBEDA (STOP) · 1 = error.
// Skrip tidak menulis apa pun ke database dan tidak mencetak URL/credential.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { describeDbUrl, gitBlobSha1, runPrisma, fail } from "./lib/db-safety.mjs";

const BASELINE_COMMIT = "c944f9a";
const BASELINE_SCHEMA = path.join("prisma", "baseline", "schema.c944f9a.prisma");
// Hash blob Git dari prisma/schema.prisma pada commit c944f9a (git rev-parse c944f9a:prisma/schema.prisma)
const EXPECTED_BLOB = "882accd9665f7add1599cca06898b5d0ef6be7ed";

const target = process.env.TARGET_DATABASE_URL;
if (!target) fail("TARGET_DATABASE_URL wajib di-set (sengaja bukan DATABASE_URL agar target dipilih secara sadar).");

let safeName;
try {
  safeName = describeDbUrl(target);
} catch (e) {
  fail(e.message);
}

// 1. Pastikan file schema baseline benar-benar berasal dari commit c944f9a, bukan schema branch aktif
if (!fs.existsSync(BASELINE_SCHEMA)) fail(`File ${BASELINE_SCHEMA} tidak ditemukan.`);
const blob = gitBlobSha1(fs.readFileSync(BASELINE_SCHEMA, "utf8"));
if (blob !== EXPECTED_BLOB) fail(`Isi ${BASELINE_SCHEMA} tidak sama dengan schema ${BASELINE_COMMIT} (blob ${blob}). Jangan lanjutkan.`);
const git = spawnSync("git", ["rev-parse", `${BASELINE_COMMIT}:prisma/schema.prisma`], { encoding: "utf8" });
if (git.status === 0 && git.stdout.trim() !== EXPECTED_BLOB) {
  fail(`Hash schema di commit ${BASELINE_COMMIT} pada repository ini berbeda (${git.stdout.trim()}).`);
}

console.log(`Target   : ${safeName}`);
console.log(`Acuan    : ${BASELINE_SCHEMA} (= ${BASELINE_COMMIT}:prisma/schema.prisma, blob ${EXPECTED_BLOB.slice(0, 12)})`);
console.log("Mode     : read-only (prisma migrate diff --from-url ... --exit-code)\n");

// 2. Diff read-only. DATABASE_URL di-set ke target agar Prisma tidak memuat .env proyek.
const code = runPrisma(
  ["migrate", "diff", "--from-url", target, "--to-schema-datamodel", BASELINE_SCHEMA, "--exit-code"],
  { DATABASE_URL: target }
);

if (code === 0) {
  console.log("\n✔ IDENTIK dengan schema main @ c944f9a. Baseline 4 migration lama boleh dilakukan.");
  console.log("  Catatan: Prisma tidak membandingkan CHECK/trigger/function. Jalankan juga prisma/sql/precheck-restructure.sql");
  console.log("  (baris 'objek di luar Prisma' harus 0).");
  process.exit(0);
}
if (code === 2) {
  fail(
    "STOP: struktur database BERBEDA dari schema main @ c944f9a. JANGAN menjalankan `migrate resolve --applied`.\n" +
      "  Jangan mencoba menyamakan dengan `db push`. Perbedaan harus direkonsiliasi dengan migration khusus yang di-review\n" +
      "  (contoh yang diketahui: DB lokal port 5433 dari branch `artha`).",
    2
  );
}
fail("Pemeriksaan gagal dijalankan (lihat pesan Prisma di atas).", 1);
