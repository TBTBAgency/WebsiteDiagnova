/**
 * Dijalankan oleh `npm run vercel-build` (Vercel otomatis memakai script ini saat build).
 *
 * Hanya untuk deployment PRODUCTION (VERCEL_ENV=production):
 *   1. prisma migrate deploy        — menerapkan migration yang belum terpasang (baseline + berikutnya)
 *   2. prisma/seed-production.ts    — role ADMIN/USER + admin pertama bila belum ada (tidak menimpa)
 *   3. prisma/seed-cms.ts           — konten awal beranda; section yang sudah ada dilewati
 *   4. scripts/sync_page_hero_defaults.js — hero halaman dalam; hanya membuat yang belum ada
 * Semua langkah aman diulang. Preview/development build tidak menyentuh database.
 *
 * Koneksi memakai DATABASE_URL_UNPOOLED (koneksi langsung Neon) bila tersedia, karena Prisma Migrate
 * tidak bekerja lewat connection pooler. Tidak ada connection string atau password yang dicetak.
 */
import { spawnSync } from "child_process";

if (process.env.VERCEL_ENV !== "production") {
  console.log(`[db-setup] VERCEL_ENV=${process.env.VERCEL_ENV || "(none)"}: database setup dilewati.`);
  process.exit(0);
}

const directUrl = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!directUrl) {
  console.error("[db-setup] DATABASE_URL tidak tersedia.");
  process.exit(1);
}

const env = { ...process.env, DATABASE_URL: directUrl, SEED_PRODUCTION_CONFIRM: "website-diagnova" };

const steps = [
  ["prisma migrate deploy", ["npx", "prisma", "migrate", "deploy"]],
  ["seed production (role + admin)", ["npx", "tsx", "prisma/seed-production.ts"]],
  ["seed CMS homepage", ["npx", "tsx", "prisma/seed-cms.ts"]],
  ["sync page hero defaults", ["node", "scripts/sync_page_hero_defaults.js"]],
];

for (const [label, [cmd, ...args]] of steps) {
  console.log(`[db-setup] ${label} ...`);
  const r = spawnSync(cmd, args, { env, stdio: "inherit", shell: process.platform === "win32" });
  if (r.status !== 0) {
    console.error(`[db-setup] GAGAL: ${label} (exit ${r.status}). Build dihentikan.`);
    process.exit(r.status || 1);
  }
}
console.log("[db-setup] selesai.");
