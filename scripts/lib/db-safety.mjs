// Utilitas keselamatan untuk skrip database (Phase 8.1). Tidak pernah mencetak URL/credential.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

/** Identitas aman (tanpa user/password) dari URL PostgreSQL: host:port/db */
export function describeDbUrl(raw) {
  const u = parseDbUrl(raw);
  return `${u.hostname}:${u.port || "5432"}/${u.database}`;
}

export function parseDbUrl(raw) {
  let u;
  try {
    u = new URL(raw);
  } catch {
    throw new Error("URL database tidak valid (format harus postgresql://...).");
  }
  if (!/^postgres(ql)?:$/.test(u.protocol)) throw new Error("URL database harus memakai protokol postgresql://");
  const database = decodeURIComponent(u.pathname.replace(/^\//, ""));
  if (!database) throw new Error("URL database tidak menyebut nama database.");
  return { hostname: u.hostname.toLowerCase(), port: u.port || "5432", database };
}

export function sameDatabase(a, b) {
  const x = parseDbUrl(a);
  const y = parseDbUrl(b);
  const local = (h) => (["localhost", "127.0.0.1", "::1", "[::1]"].includes(h) ? "local" : h);
  return local(x.hostname) === local(y.hostname) && x.port === y.port && x.database === y.database;
}

/**
 * Membaca DATABASE_URL aplikasi dari environment proses atau file .env di direktori kerja,
 * hanya untuk DIBANDINGKAN (tidak pernah dicetak). Mengembalikan null bila tidak ada.
 */
export function readAppDatabaseUrl(cwd = process.cwd()) {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const file = path.join(cwd, ".env");
  if (!fs.existsSync(file)) return null;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = /^\s*DATABASE_URL\s*=\s*(.*)\s*$/.exec(line);
    if (m) return m[1].replace(/^["']|["']$/g, "");
  }
  return null;
}

/** Hash blob Git (sha1) dari isi teks dengan EOL dinormalisasi ke LF — sama dengan `git hash-object`. */
export function gitBlobSha1(content) {
  const buf = Buffer.from(content.replace(/\r\n/g, "\n"), "utf8");
  return crypto.createHash("sha1").update(Buffer.concat([Buffer.from(`blob ${buf.length}\0`), buf])).digest("hex");
}

/** Menjalankan Prisma CLI lokal (node_modules) tanpa shell; env eksplisit agar .env tidak ikut terbaca. */
export function runPrisma(args, env) {
  // Prisma CLI dari node_modules proyek (bukan dari direktori kerja) agar skrip dapat dijalankan dari mana saja.
  const require = createRequire(path.join(PROJECT_ROOT, "package.json"));
  const cli = require.resolve("prisma/build/index.js");
  const result = spawnSync(process.execPath, [cli, ...args], { stdio: "inherit", env: { ...process.env, ...env } });
  if (result.error) throw result.error;
  return result.status ?? 1;
}

export function fail(message, code = 1) {
  console.error(`\n✖ ${message}\n`);
  process.exit(code);
}
