#!/usr/bin/env node
// Uji migration dengan fixture sintetis pada server PostgreSQL SEKALI-PAKAI (Phase 8.1 / H-04, H-05, H-06, M-03, M-04).
//
// Wajib:
//   MIGRATION_TEST_ADMIN_URL   URL superuser ke database `postgres` pada server sekali-pakai (host 127.0.0.1/localhost)
//   MIGRATION_TEST_DISPOSABLE=1  pernyataan eksplisit bahwa server boleh dibuat/dihapus database-nya
// Opsional:
//   MIGRATION_TEST_PSQL_CONTAINER  nama container docker berisi psql untuk server tersebut (uji db-roles.sql)
//   MIGRATION_TEST_REPORT          path file JSON hasil matriks
//
// Keselamatan: runner MENOLAK berjalan bila server berisi database selain template/postgres/fx_* (mis. `diagnova`),
// sehingga tidak dapat diarahkan ke server development. Prisma CLI dijalankan dari salinan folder prisma/ di
// direktori sementara (tanpa .env) dengan DATABASE_URL eksplisit.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const require = createRequire(path.join(ROOT, "package.json"));
const { PrismaClient } = require("@prisma/client");
const PRISMA_CLI = require.resolve("prisma/build/index.js");
const TSX_CLI = path.join(ROOT, "node_modules", "tsx", "dist", "cli.mjs");

const ADMIN_URL = process.env.MIGRATION_TEST_ADMIN_URL;
if (!ADMIN_URL || process.env.MIGRATION_TEST_DISPOSABLE !== "1") {
  console.error("Set MIGRATION_TEST_ADMIN_URL dan MIGRATION_TEST_DISPOSABLE=1 (server PostgreSQL sekali-pakai).");
  process.exit(1);
}
const adminUrl = new URL(ADMIN_URL);
if (!["127.0.0.1", "localhost"].includes(adminUrl.hostname)) {
  console.error("Ditolak: server uji harus lokal (127.0.0.1/localhost).");
  process.exit(1);
}
const dbUrl = (name) => {
  const u = new URL(ADMIN_URL);
  u.pathname = `/${name}`;
  return u.toString();
};

const admin = new PrismaClient({ datasources: { db: { url: ADMIN_URL } } });
const foreign = await admin.$queryRawUnsafe(
  `SELECT datname FROM pg_database WHERE datname NOT IN ('postgres','template0','template1') AND datname NOT LIKE 'fx\\_%'`
);
if (foreign.length > 0) {
  console.error(`Ditolak: server berisi database non-fixture (${foreign.map((r) => r.datname).join(", ")}). Bukan server sekali-pakai.`);
  process.exit(1);
}

// Sandbox: salinan prisma/ tanpa .env
const SANDBOX = fs.mkdtempSync(path.join(os.tmpdir(), "diagnova-fx-"));
fs.cpSync(path.join(ROOT, "prisma"), path.join(SANDBOX, "prisma"), { recursive: true });
fs.cpSync(path.join(ROOT, "tests", "migration", "fixtures"), path.join(SANDBOX, "fixtures"), { recursive: true });
const SCHEMA = path.join(SANDBOX, "prisma", "schema.prisma");
const MIG = path.join(SANDBOX, "prisma", "migrations");
const LEGACY = [
  "20261013162422_init_leads",
  "20261016022305_add_users_and_audit",
  "20261016060944_add_lis_core_preanalytic",
  "20261116090000_reconcile_legacy_history",
];
const M5 = "20261116090100_restructure_users_leads_demo_access";
const M6 = "20261116090200_audit_append_only_and_cms_pages";

function prisma(args, url, extraEnv = {}) {
  const r = spawnSync(process.execPath, [PRISMA_CLI, ...args], {
    cwd: SANDBOX,
    encoding: "utf8",
    env: { ...process.env, DATABASE_URL: url, ...extraEnv, PRISMA_HIDE_UPDATE_MESSAGE: "1" },
  });
  return { code: r.status, out: `${r.stdout}\n${r.stderr}` };
}
function execFile(url, file) {
  const r = prisma(["db", "execute", "--file", file, "--schema", SCHEMA], url);
  if (r.code !== 0) throw new Error(`db execute ${path.basename(file)} gagal:\n${r.out}`);
}
function execSql(url, sql) {
  const f = path.join(SANDBOX, `adhoc-${crypto.randomBytes(4).toString("hex")}.sql`);
  fs.writeFileSync(f, sql);
  execFile(url, f);
}
const client = (url) => new PrismaClient({ datasources: { db: { url } } });
const sqlBody = (file) => {
  const s = fs.readFileSync(path.join(SANDBOX, "prisma", "sql", file), "utf8");
  return s.slice(s.indexOf("BEGIN TRANSACTION READ ONLY;") + "BEGIN TRANSACTION READ ONLY;".length, s.lastIndexOf("ROLLBACK;")).trim().replace(/;\s*$/, "");
};

async function createDb(name) {
  await admin.$executeRawUnsafe(`DROP DATABASE IF EXISTS "${name}"`);
  await admin.$executeRawUnsafe(`CREATE DATABASE "${name}"`);
  return dbUrl(name);
}
async function dropDb(name) {
  await admin.$executeRawUnsafe(`DROP DATABASE IF EXISTS "${name}" WITH (FORCE)`);
}

/** DB berstruktur LAMA (= db push main@c944f9a) dibangun dari migration historis + rekonsiliasi, TANPA _prisma_migrations. */
async function legacyDb(name, fixtures = ["00_base.sql"]) {
  const url = await createDb(name);
  for (const m of LEGACY) execFile(url, path.join(MIG, m, "migration.sql"));
  for (const f of fixtures) execFile(url, path.join(SANDBOX, "fixtures", f));
  return url;
}
function baseline(url) {
  for (const m of LEGACY) {
    const r = prisma(["migrate", "resolve", "--applied", m, "--schema", SCHEMA], url);
    if (r.code !== 0) throw new Error(`resolve ${m} gagal:\n${r.out}`);
  }
}
const deploy = (url) => prisma(["migrate", "deploy", "--schema", SCHEMA], url);

async function structureState(c) {
  const [row] = await c.$queryRawUnsafe(`SELECT
    (SELECT count(*) FROM pg_type WHERE typname = 'lead_stage')::int AS lead_stage_type,
    (to_regclass('public.demo_accesses') IS NOT NULL) AS demo_accesses,
    (SELECT count(*) FROM information_schema.columns WHERE table_name = 'roles' AND column_name = 'code')::int AS roles_code,
    (SELECT data_type FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'status') AS leads_status_type,
    (SELECT count(*) FROM information_schema.columns WHERE table_name = 'cms_sections' AND column_name = 'page_key')::int AS cms_page_key,
    (SELECT count(*) FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'jobTitle')::int AS jobtitle_camel`);
  return row;
}
async function migrationRows(c) {
  return c.$queryRawUnsafe(
    `SELECT migration_name AS name, (finished_at IS NOT NULL) AS finished, (rolled_back_at IS NOT NULL) AS rolled_back FROM _prisma_migrations ORDER BY migration_name`
  );
}
const LIS_MD5 = `SELECT md5(string_agg(x, '' ORDER BY x)) AS h FROM (
  SELECT p::text x FROM patients p UNION ALL SELECT o::text FROM lab_orders o UNION ALL SELECT s::text FROM specimens s
  UNION ALL SELECT i::text FROM lab_order_items i UNION ALL SELECT c::text FROM test_catalogs c UNION ALL SELECT d::text FROM physicians d) z`;
const LIS_DDL = `SELECT md5(string_agg(t, '|' ORDER BY t)) AS h FROM (
  SELECT table_name||'.'||column_name||':'||data_type||':'||is_nullable||':'||coalesce(column_default,'') t FROM information_schema.columns
   WHERE table_schema='public' AND table_name IN ('patients','physicians','test_catalogs','lab_orders','lab_order_items','specimens')
  UNION ALL SELECT conrelid::regclass::text||':'||conname||':'||pg_get_constraintdef(oid) FROM pg_constraint
   WHERE conrelid::regclass::text IN ('patients','physicians','test_catalogs','lab_orders','lab_order_items','specimens')
  UNION ALL SELECT tablename||':'||indexdef FROM pg_indexes WHERE schemaname='public'
   AND tablename IN ('patients','physicians','test_catalogs','lab_orders','lab_order_items','specimens')
  UNION ALL SELECT tgrelid::regclass::text||':'||tgname FROM pg_trigger WHERE NOT tgisinternal
   AND tgrelid::regclass::text IN ('patients','physicians','test_catalogs','lab_orders','lab_order_items','specimens')) z`;

// ---------------------------------------------------------------------------------------------
const results = [];
function record(id, fixture, expected, actual, ok) {
  results.push({ id, fixture, expected, actual, status: ok ? "PASS" : "FAIL" });
  console.log(`${ok ? "PASS" : "FAIL"}  ${id.padEnd(6)} ${fixture} — ${actual}`);
}
async function check(id, fixture, expected, fn) {
  try {
    const { ok, actual } = await fn();
    record(id, fixture, expected, actual, ok);
  } catch (e) {
    record(id, fixture, expected, `ERROR: ${String(e.message).split("\n").slice(0, 3).join(" ")}`, false);
  }
}
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// =============================================================================================
// A. Baseline (H-01)
// =============================================================================================
await check("BL-1", "DB lama = 3 migration historis + rekonsiliasi", "db:baseline-check exit 0 (identik dengan schema main@c944f9a)", async () => {
  const url = await legacyDb("fx_baseline_ok", []);
  // cwd = sandbox (salinan prisma/ tanpa .env); skrip memeriksa blob schema baseline sendiri
  const r2 = spawnSync(process.execPath, [path.join(ROOT, "scripts", "db-baseline-check.mjs")], {
    cwd: SANDBOX, encoding: "utf8", env: { ...process.env, TARGET_DATABASE_URL: url, PRISMA_HIDE_UPDATE_MESSAGE: "1" },
  });
  await dropDb("fx_baseline_ok");
  return { ok: r2.status === 0, actual: `exit ${r2.status}` };
});

await check("BL-2", "DB lama dengan kolom tambahan (simulasi DB 5433/artha)", "db:baseline-check exit 2 (STOP)", async () => {
  const url = await legacyDb("fx_baseline_drift", []);
  execSql(url, `ALTER TABLE users ADD COLUMN menu_access text;`);
  const r = spawnSync(process.execPath, [path.join(ROOT, "scripts", "db-baseline-check.mjs")], {
    cwd: SANDBOX, encoding: "utf8", env: { ...process.env, TARGET_DATABASE_URL: url, PRISMA_HIDE_UPDATE_MESSAGE: "1" },
  });
  await dropDb("fx_baseline_drift");
  return { ok: r.status === 2 && /STOP/.test(r.stderr), actual: `exit ${r.status}${/STOP/.test(r.stderr) ? " + pesan STOP" : ""}` };
});

// =============================================================================================
// B. Fixture representatif (positif) — seluruh cabang backfill yang valid
// =============================================================================================
{
  const name = "fx_representative";
  const url = await legacyDb(name, ["00_base.sql", "01_representative.sql"]);
  const c = client(url);
  const before = {
    lisMd5: (await c.$queryRawUnsafe(LIS_MD5))[0].h,
    lisDdl: (await c.$queryRawUnsafe(LIS_DDL))[0].h,
    counts: (await c.$queryRawUnsafe(`SELECT (SELECT count(*) FROM users)::int u, (SELECT count(*) FROM leads)::int l,
      (SELECT count(*) FROM demo_magic_links)::int k, (SELECT count(*) FROM audit_logs)::int a, (SELECT count(*) FROM roles)::int r,
      (SELECT count(*) FROM cms_sections)::int s`))[0],
  };
  const pre = await c.$queryRawUnsafe(sqlBody("precheck-restructure.sql"));
  const preMap = Object.fromEntries(pre.map((r) => [r.check_id, r]));

  await check("PC-1", "representatif — precheck read-only", "0 BLOCKER gagal; INFO M-01=1 (L4), L-09=1 (L7), periode=6", async () => {
    const failed = pre.filter((r) => r.hasil === "GAGAL").map((r) => r.check_id);
    const m01 = Number(preMap["M-01 status 3 tanpa login"].jumlah);
    const l09 = Number(preMap["L-09 approved tanpa user"].jumlah);
    const per = Number(preMap["periode akses dibuat"].jumlah);
    return { ok: failed.length === 0 && m01 === 1 && l09 === 1 && per === 6, actual: `gagal=[${failed}] M-01=${m01} L-09=${l09} periode=${per}` };
  });

  baseline(url);
  const dep = deploy(url);
  await check("FX-01", "representatif — deploy", "migration ke-5 & ke-6 sukses", async () => ({
    ok: dep.code === 0 && /successfully applied/i.test(dep.out), actual: `exit ${dep.code}`,
  }));

  await check("FX-01a", "status lead 1/2/3±aktivasi (item 1–4)", "L1,L2,L4,L5a,L7,L8,L10=contacted; L3,L5b=scheduled", async () => {
    const rows = await c.$queryRawUnsafe(`SELECT id, status::text s FROM leads ORDER BY id`);
    const m = Object.fromEntries(rows.map((r) => [r.id, r.s]));
    const exp = { L1: "contacted", L10: "contacted", L2: "contacted", L3: "scheduled", L4: "contacted", L5a: "contacted", L5b: "scheduled", L7: "contacted", L8: "contacted" };
    return { ok: eq(m, exp), actual: JSON.stringify(m) };
  });

  await check("FX-01b", "demo_started_at = aktivasi lama (UTC)", "L3=2026-11-10T08:00Z, L5b=2026-11-12T09:30Z, lainnya NULL", async () => {
    const rows = await c.$queryRawUnsafe(`SELECT id, to_char(demo_started_at AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI') t FROM leads WHERE demo_started_at IS NOT NULL ORDER BY id`);
    const m = Object.fromEntries(rows.map((r) => [r.id, r.t]));
    return { ok: eq(m, { L3: "2026-11-10T08:00", L5b: "2026-11-12T09:30" }), actual: JSON.stringify(m) };
  });

  await check("FX-01c", "periode akses (item 9, 11, 17)", "6 periode; L7 tanpa periode; durasi {3,7,14,30}; L5b aktif, L5a pending; L10 dicabut", async () => {
    const rows = await c.$queryRawUnsafe(`SELECT lead_id, duration_days d, (activated_at IS NOT NULL) act, (revoked_at IS NOT NULL) rev,
      to_char(expires_at AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI') e FROM demo_accesses ORDER BY lead_id`);
    const m = Object.fromEntries(rows.map((r) => [r.lead_id, `${r.d}d act=${r.act} rev=${r.rev} exp=${r.e}`]));
    const exp = {
      L10: "7d act=false rev=true exp=null", L3: "7d act=true rev=false exp=2026-11-17T08:00", L4: "7d act=false rev=false exp=null",
      L5a: "3d act=false rev=false exp=null", L5b: "14d act=true rev=false exp=2026-11-26T09:30", L8: "30d act=false rev=false exp=null",
    };
    return { ok: eq(m, exp), actual: JSON.stringify(m) };
  });

  await check("FX-01d", "masa berlaku identik dengan data lama (item 13 positif)", "expires_at = users.demo_expires_at untuk u3 & u5", async () => {
    const rows = await c.$queryRawUnsafe(`SELECT count(*)::int n FROM demo_accesses a JOIN users u ON u.id = a.user_id
      WHERE a.activated_at IS NOT NULL AND a.expires_at = u.demo_expires_at`);
    return { ok: rows[0].n === 2, actual: `${rows[0].n} cocok` };
  });

  await check("FX-01e", "magic link (item 14, 16)", "7/7 terpetakan; k8 (dicabut gaya hotfix) revoked_at NULL & kedaluwarsa (L-03); k4n user NULL terpetakan ke akses L4", async () => {
    const [r] = await c.$queryRawUnsafe(`SELECT count(*)::int total, count(demo_access_id)::int mapped,
      (SELECT (revoked_at IS NULL AND expires_at < now())::text FROM demo_magic_links WHERE id='k8') k8,
      (SELECT a.lead_id FROM demo_magic_links m JOIN demo_accesses a ON a.id = m.demo_access_id WHERE m.id='k4n') k4n
      FROM demo_magic_links`);
    return { ok: r.total === 7 && r.mapped === 7 && r.k8 === "true" && r.k4n === "L4", actual: JSON.stringify(r) };
  });

  await check("FX-01f", "role & status user (item 6, 7, 10)", "ADMIN=u_admin; role lama tetap tanpa kode; u_lab & u8 inactive; u6 tanpa periode; u9 tanpa role", async () => {
    const rows = await c.$queryRawUnsafe(`SELECT u.id, u.status::text s, coalesce(r.code::text,'-') c FROM users u LEFT JOIN roles r ON r.id = u.role_id ORDER BY u.id`);
    const m = Object.fromEntries(rows.map((r) => [r.id, `${r.c}/${r.s}`]));
    const exp = { u10: "user/active", u3: "user/active", u4: "user/active", u5: "user/active", u6: "user/active", u8: "user/inactive",
      u9: "-/active", u_admin: "admin/active", u_lab: "-/inactive", u_sales: "-/active" };
    const [p] = await c.$queryRawUnsafe(`SELECT count(*)::int n FROM demo_accesses WHERE user_id = 'u6'`);
    const [unk] = await c.$queryRawUnsafe(`SELECT coalesce(code::text,'NULL') c FROM roles WHERE id='r_unknown_unused'`);
    return { ok: eq(m, exp) && p.n === 0 && unk.c === "NULL", actual: `${JSON.stringify(m)} u6_periode=${p.n} role_tak_dikenal=${unk.c}` };
  });

  await check("FX-01g", "timestamp UTC (item 20)", "L1.created_at 2026-10-01 10:00:00 → 2026-10-01T10:00:00Z", async () => {
    const [r] = await c.$queryRawUnsafe(`SELECT to_char(created_at AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS') t, pg_typeof(created_at)::text ty FROM leads WHERE id='L1'`);
    return { ok: r.t === "2026-10-01T10:00:00" && r.ty === "timestamp with time zone", actual: `${r.t} (${r.ty})` };
  });

  await check("FX-01h", "CMS tabel anak → JSON per field", "hero 2 (h1 lalu h2, h2 hidden), partners 1, comparison 1, testimonials 1; updated_by user hilang → NULL", async () => {
    const [r] = await c.$queryRawUnsafe(`SELECT
      (SELECT string_agg(e->>'id'||':'||(e->>'hidden'), ',') FROM cms_sections s, jsonb_array_elements(s.extra_content->'slides') e WHERE s.section_key='hero') hero,
      (SELECT jsonb_array_length(extra_content->'partners') FROM cms_sections WHERE section_key='trusted_by')::int partners,
      (SELECT (extra_content->'items'->0->>'impactMetric')||'/'||(extra_content->>'diagnovaBadgeId') FROM cms_sections WHERE section_key='comparison') cmp,
      (SELECT (extra_content->'items'->0->>'rating')||'/'||is_published::text FROM cms_sections WHERE section_key='testimonials') testi,
      (SELECT coalesce(updated_by_id,'NULL') FROM cms_sections WHERE section_key='trusted_by') trusted_by_user,
      (SELECT updated_by_id FROM cms_sections WHERE section_key='hero') hero_user`);
    const ok = r.hero === "h1:false,h2:true" && r.partners === 1 && r.cmp === "70%/Diagnova" && r.testi === "4/false" && r.trusted_by_user === "NULL" && r.hero_user === "u_admin";
    return { ok, actual: JSON.stringify(r) };
  });

  await check("FX-01i", "LIS tidak berubah", "md5 data & md5 DDL/constraint/index/trigger LIS identik sebelum/sesudah", async () => {
    const a = (await c.$queryRawUnsafe(LIS_MD5))[0].h;
    const d = (await c.$queryRawUnsafe(LIS_DDL))[0].h;
    return { ok: a === before.lisMd5 && d === before.lisDdl, actual: `data ${a === before.lisMd5 ? "identik" : "BERUBAH"}, struktur ${d === before.lisDdl ? "identik" : "BERUBAH"}` };
  });

  await check("FX-01j", "jumlah baris non-LIS", "users/leads/links/audit/roles/cms_sections sama sebelum & sesudah", async () => {
    const after = (await c.$queryRawUnsafe(`SELECT (SELECT count(*) FROM users)::int u, (SELECT count(*) FROM leads)::int l,
      (SELECT count(*) FROM demo_magic_links)::int k, (SELECT count(*) FROM audit_logs)::int a, (SELECT count(*) FROM roles)::int r,
      (SELECT count(*) FROM cms_sections)::int s`))[0];
    return { ok: eq(after, before.counts), actual: `${JSON.stringify(before.counts)} → ${JSON.stringify(after)}` };
  });

  await check("FX-01k", "verifikasi katalog pasca-migrasi (M-05)", "verify-post-migration.sql: RINGKASAN OK", async () => {
    const rows = await c.$queryRawUnsafe(sqlBody("verify-post-migration.sql"));
    const bad = rows.filter((r) => r.hasil !== "OK").map((r) => `${r.name}=${r.hasil}`);
    return { ok: bad.length === 0, actual: bad.length ? bad.join("; ") : `${rows.length - 1} objek OK` };
  });

  await check("FX-01l", "constraint menolak data tak konsisten", "CHECK menolak status/timestamp & durasi tidak valid", async () => {
    const tries = [
      `UPDATE leads SET status='contacted' WHERE id='L3'`,
      `UPDATE leads SET status='completed' WHERE id='L3'`,
      `INSERT INTO demo_accesses (id, lead_id, user_id, duration_days, updated_at) VALUES ('bad','L1','u6',5,now())`,
      `UPDATE demo_accesses SET expires_at = expires_at + interval '1 hour' WHERE lead_id='L3'`,
      `UPDATE users SET email='UPPER@fixture.example' WHERE id='u6'`,
    ];
    const rejected = [];
    for (const t of tries) {
      try { await c.$executeRawUnsafe(t); } catch { rejected.push(true); }
    }
    return { ok: rejected.length === tries.length, actual: `${rejected.length}/${tries.length} ditolak` };
  });

  await c.$disconnect();
  await dropDb(name);
}

// =============================================================================================
// C. Fixture negatif — migration ke-5 harus BATAL utuh (item 5, 8, 12, 13, 15, 18, 19, 20; H-02, H-03)
// =============================================================================================
const NEGATIVE = [
  { id: "FX-02", label: "status 4 (OD-21)", sql: `INSERT INTO leads (id,name,institution,"jobTitle",email,phone,status,updated_at) VALUES ('Lx','x','x','x','x@fixture.example','1',4,now());`, msg: /OD-21/ },
  { id: "FX-03", label: "status tidak dikenal (9)", sql: `INSERT INTO leads (id,name,institution,"jobTitle",email,phone,status,updated_at) VALUES ('Lx','x','x','x','x@fixture.example','1',9,now());`, msg: /OD-21/ },
  { id: "FX-04", label: "role tak dikenal dipakai user (H-02)", sql: `INSERT INTO roles (id,name) VALUES ('r_x','Administrator'); INSERT INTO users (id,name,email,role_id,updated_at) VALUES ('ux','x','x@fixture.example','r_x',now());`, msg: /H-02.*Administrator/s },
  { id: "FX-05", label: "tidak ada ADMIN aktif ber-password (H-02)", sql: `UPDATE users SET status = 0 WHERE id = 'u_admin';`, msg: /H-02/ },
  { id: "FX-06", label: "aktivasi tanpa lead kandidat (M-02)", sql: `INSERT INTO users (id,name,email,role_id,demo_duration_days,demo_activated_at,demo_expires_at,updated_at) VALUES ('ux','x','x@fixture.example','r_demo',7,'2026-11-01','2026-11-08',now());`, msg: /M-02/ },
  { id: "FX-07", label: "selisih demo_expires_at (M-02)", sql: `INSERT INTO users (id,name,email,role_id,demo_activated_at,demo_expires_at,updated_at) VALUES ('ux','x','x@fixture.example','r_demo','2026-11-01 00:00','2026-11-09 00:00',now());
      INSERT INTO leads (id,user_id,name,institution,"jobTitle",email,phone,status,approval_status,demo_duration_days,updated_at) VALUES ('Lx','ux','x','x','x','x@fixture.example','1',3,'approved',7,now());`, msg: /M-02.*selisih/s },
  { id: "FX-08", label: "magic link user mismatch (L-04)", sql: `INSERT INTO users (id,name,email,role_id,updated_at) VALUES ('ua','a','a@fixture.example','r_demo',now()),('ub','b','b@fixture.example','r_demo',now());
      INSERT INTO leads (id,user_id,name,institution,"jobTitle",email,phone,status,approval_status,demo_duration_days,updated_at) VALUES ('Lx','ua','x','x','x','a@fixture.example','1',2,'approved',7,now());
      INSERT INTO demo_magic_links (id,token_hash,email,lead_id,user_id,expires_at) VALUES ('kx',repeat('b',64),'b@fixture.example','Lx','ub','2099-01-01');`, msg: /L-04.*kx/s },
  { id: "FX-09", label: "durasi tidak valid (5 hari)", sql: `INSERT INTO users (id,name,email,role_id,updated_at) VALUES ('ux','x','x@fixture.example','r_demo',now());
      INSERT INTO leads (id,user_id,name,institution,"jobTitle",email,phone,status,approval_status,demo_duration_days,updated_at) VALUES ('Lx','ux','x','x','x','x@fixture.example','1',2,'approved',5,now());`, msg: /3\/7\/14\/30/ },
  { id: "FX-10", label: "email bukan lowercase", sql: `INSERT INTO users (id,name,email,role_id,updated_at) VALUES ('ux','x','Klien@Fixture.example','r_demo',now());`, msg: /huruf kecil/ },
  { id: "FX-11", label: "TimeZone server bukan UTC (H-03)", dbTz: "Asia/Jakarta", sql: null, msg: /H-03/ },
  { id: "FX-12", label: "status user tidak dikenal (2)", sql: `INSERT INTO users (id,name,email,role_id,status,updated_at) VALUES ('ux','x','x@fixture.example','r_demo',2,now());`, msg: /0\/1/ },
];

for (const n of NEGATIVE) {
  const name = `fx_neg_${n.id.toLowerCase().replace("-", "")}`;
  await check(n.id, n.label, "deploy gagal dengan pesan precheck; 0 perubahan parsial; riwayat: ke-5 failed", async () => {
    const url = await legacyDb(name);
    if (n.sql) execSql(url, n.sql);
    if (n.dbTz) await admin.$executeRawUnsafe(`ALTER DATABASE "${name}" SET timezone TO '${n.dbTz}'`);
    baseline(url);
    const r = deploy(url);
    const c = client(url);
    const st = await structureState(c);
    const rows = await migrationRows(c);
    const m5 = rows.find((x) => x.name === M5);
    await c.$disconnect();
    await dropDb(name);
    const noPartial = st.lead_stage_type === 0 && !st.demo_accesses && st.roles_code === 0 && st.leads_status_type === "integer" && st.jobtitle_camel === 1;
    const ok = r.code !== 0 && n.msg.test(r.out) && noPartial && m5 && !m5.finished && !rows.find((x) => x.name === M6);
    return { ok, actual: `exit ${r.code}, pesan ${n.msg.test(r.out) ? "sesuai" : "TIDAK sesuai"}, parsial=${noPartial ? "tidak ada" : JSON.stringify(st)}, m5=${m5 ? (m5.finished ? "finished" : "failed") : "tidak tercatat"}` };
  });
}

// =============================================================================================
// D. Perilaku kegagalan & pemulihan (H-05)
// =============================================================================================
await check("RB-1", "P3009 & pemulihan setelah migration ke-5 gagal", "deploy ulang diblokir P3009; setelah data diperbaiki + resolve --rolled-back → deploy sukses", async () => {
  const name = "fx_recovery";
  const url = await legacyDb(name);
  execSql(url, `INSERT INTO leads (id,name,institution,"jobTitle",email,phone,status,updated_at) VALUES ('Lx','x','x','x','x@fixture.example','1',4,now());`);
  baseline(url);
  const first = deploy(url);
  const second = deploy(url);
  execSql(url, `DELETE FROM leads WHERE id = 'Lx';`); // perbaikan data sintetis (pada data nyata: keputusan OD-21)
  const resolve = prisma(["migrate", "resolve", "--rolled-back", M5, "--schema", SCHEMA], url);
  const third = deploy(url);
  const c = client(url);
  const rows = await migrationRows(c);
  await c.$disconnect();
  await dropDb(name);
  const allFinished = [M5, M6].every((m) => rows.some((r) => r.name === m && r.finished));
  const ok = first.code !== 0 && second.code !== 0 && /P3009/.test(second.out) && resolve.code === 0 && third.code === 0 && allFinished;
  return { ok, actual: `deploy1 exit ${first.code}; deploy2 ${/P3009/.test(second.out) ? "P3009" : "exit " + second.code}; resolve exit ${resolve.code}; deploy3 exit ${third.code}; ke-5/ke-6 finished=${allFinished}` };
});

await check("RB-2", "migration ke-6 gagal setelah ke-5 sukses", "ke-5 TETAP terpasang (schema leads baru), ke-6 dibatalkan utuh (page_key tidak ada), riwayat: ke-5 finished, ke-6 failed", async () => {
  const name = "fx_m6_fail";
  const url = await legacyDb(name);
  execSql(url, `CREATE FUNCTION audit_logs_block_mutation() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RETURN NULL; END $$;`); // konflik sintetis
  baseline(url);
  const r = deploy(url);
  const c = client(url);
  const st = await structureState(c);
  const rows = await migrationRows(c);
  await c.$disconnect();
  await dropDb(name);
  const m5 = rows.find((x) => x.name === M5);
  const m6 = rows.find((x) => x.name === M6);
  const ok = r.code !== 0 && st.lead_stage_type === 1 && st.demo_accesses && st.cms_page_key === 0 && m5?.finished && m6 && !m6.finished;
  return { ok, actual: `exit ${r.code}; lead_stage=${st.lead_stage_type} demo_accesses=${st.demo_accesses} cms.page_key=${st.cms_page_key}; m5 ${m5?.finished ? "finished" : "?"}, m6 ${m6 ? (m6.finished ? "finished" : "failed") : "-"}` };
});

// =============================================================================================
// E. Fresh deploy (DB kosong)
// =============================================================================================
await check("FR-1", "fresh deploy DB kosong", "6 migration sukses; katalog OK; role admin/user ada; page_key tanpa default", async () => {
  const name = "fx_fresh";
  const url = await createDb(name);
  const r = deploy(url);
  const c = client(url);
  const rows = await c.$queryRawUnsafe(sqlBody("verify-post-migration.sql"));
  const bad = rows.filter((x) => x.hasil !== "OK").map((x) => `${x.name}=${x.hasil}`);
  const roles = await c.$queryRawUnsafe(`SELECT string_agg(name||'='||code::text, ',' ORDER BY name) s FROM roles`);
  await c.$disconnect();
  await dropDb(name);
  return { ok: r.code === 0 && bad.length === 0 && roles[0].s === "Demo User=user,Super Admin=admin", actual: `exit ${r.code}; katalog ${bad.length ? bad.join(";") : "OK"}; roles ${roles[0].s}` };
});

// =============================================================================================
// F. Hak akses audit log (H-06) — memerlukan psql (db-roles.sql memakai \gexec)
// =============================================================================================
const PSQL_CONTAINER = process.env.MIGRATION_TEST_PSQL_CONTAINER;
if (PSQL_CONTAINER) {
  const name = "fx_audit_perms";
  const url = await createDb(name);
  const dep = deploy(url);
  const ownerPw = crypto.randomBytes(12).toString("hex");
  const appPw = crypto.randomBytes(12).toString("hex");
  const dbaPw = crypto.randomBytes(12).toString("hex");
  const roleSql = fs.readFileSync(path.join(ROOT, "prisma", "sql", "db-roles.sql"), "utf8");
  const ps = spawnSync("docker", ["exec", "-i", PSQL_CONTAINER, "psql", "-U", "postgres", "-d", name, "-v", "ON_ERROR_STOP=1",
    "-v", `owner_password=${ownerPw}`, "-v", `app_password=${appPw}`, "-q", "-f", "-"], { input: roleSql, encoding: "utf8" });
  await admin.$executeRawUnsafe(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='fx_dba') THEN CREATE ROLE fx_dba LOGIN NOSUPERUSER PASSWORD '${dbaPw}'; END IF; END $$`);
  await admin.$executeRawUnsafe(`GRANT diagnova_audit_maintainer TO fx_dba`);
  await admin.$executeRawUnsafe(`GRANT CONNECT ON DATABASE "${name}" TO fx_dba`);
  const asRole = (role, pw) => { const u = new URL(url); u.username = role; u.password = pw; return client(u.toString()); };
  const owner0 = client(url);
  await owner0.$executeRawUnsafe(`INSERT INTO audit_logs (id, action, entity) VALUES ('fx1','FX','fx'),('fx2','FX','fx')`);
  await owner0.$disconnect();

  await check("AP-0", "db-roles.sql diterapkan", "skrip sukses; app bukan superuser & bukan pemilik", async () => {
    const c = client(url);
    const [r] = await c.$queryRawUnsafe(`SELECT r.rolsuper::text su, (SELECT tableowner FROM pg_tables WHERE tablename='audit_logs') owner FROM pg_roles r WHERE rolname='diagnova_app'`);
    await c.$disconnect();
    return { ok: dep.code === 0 && ps.status === 0 && r.su === "false" && r.owner === "diagnova_owner", actual: `psql exit ${ps.status}; app superuser=${r.su}; pemilik audit_logs=${r.owner}` };
  });

  const app = asRole("diagnova_app", appPw);
  const attempts = [
    ["UPDATE", `UPDATE audit_logs SET action='X' WHERE id='fx1'`],
    ["DELETE", `DELETE FROM audit_logs WHERE id='fx1'`],
    ["TRUNCATE", `TRUNCATE audit_logs`],
    ["DISABLE TRIGGER", `ALTER TABLE audit_logs DISABLE TRIGGER audit_logs_append_only_row`],
    ["DROP TRIGGER", `DROP TRIGGER audit_logs_append_only_row ON audit_logs`],
    ["DROP FUNCTION", `DROP FUNCTION audit_logs_block_mutation() CASCADE`],
    ["SET GUC lama + DELETE", `DO $$ BEGIN PERFORM set_config('diagnova.audit_maintenance','on',true); DELETE FROM audit_logs WHERE id='fx1'; END $$`],
    ["SET ROLE maintainer", `SET ROLE diagnova_audit_maintainer`],
  ];
  for (const [label, sql] of attempts) {
    await check(`AP-${label}`, `akun aplikasi: ${label}`, "ditolak", async () => {
      try {
        await app.$executeRawUnsafe(sql);
        return { ok: false, actual: "BERHASIL (tidak seharusnya)" };
      } catch (e) {
        return { ok: true, actual: `ditolak: ${String(e.message).match(/(permission denied[^\n"]*|must be owner[^\n"]*|append-only[^\n"]*)/)?.[0] ?? "error"}` };
      }
    });
  }
  await check("AP-app-ok", "akun aplikasi: operasi normal", "INSERT audit & DML tabel bisnis berhasil", async () => {
    await app.$executeRawUnsafe(`INSERT INTO audit_logs (id, action, entity) VALUES ('fx3','FX','fx')`);
    await app.$executeRawUnsafe(`INSERT INTO roles (id, name) VALUES ('fx_role','Fixture Role')`);
    await app.$executeRawUnsafe(`DELETE FROM roles WHERE id='fx_role'`);
    const [r] = await app.$queryRawUnsafe(`SELECT count(*)::int n FROM audit_logs`);
    return { ok: r.n === 3, actual: `audit rows=${r.n}` };
  });
  await app.$disconnect();

  const dba = asRole("fx_dba", dbaPw);
  await check("AP-maint-delete", "maintainer (anggota diagnova_audit_maintainer): DELETE", "berhasil (retensi resmi)", async () => {
    const n = await dba.$executeRawUnsafe(`DELETE FROM audit_logs WHERE id='fx2'`);
    return { ok: n === 1, actual: `${n} baris dihapus` };
  });
  await check("AP-maint-update", "maintainer: UPDATE", "ditolak", async () => {
    try { await dba.$executeRawUnsafe(`UPDATE audit_logs SET action='X' WHERE id='fx1'`); return { ok: false, actual: "BERHASIL" }; }
    catch (e) { return { ok: true, actual: "ditolak" }; }
  });
  await dba.$disconnect();

  const own = asRole("diagnova_owner", ownerPw);
  await check("AP-owner-limit", "pemilik (diagnova_owner): DELETE tanpa keanggotaan maintainer", "ditolak trigger (batasan: pemilik tetap dapat menonaktifkan trigger — didokumentasikan)", async () => {
    let blocked = false;
    try { await own.$executeRawUnsafe(`DELETE FROM audit_logs WHERE id='fx1'`); } catch { blocked = true; }
    let canDisable = false;
    try {
      await own.$transaction(async (tx) => {
        await tx.$executeRawUnsafe(`ALTER TABLE audit_logs DISABLE TRIGGER audit_logs_append_only_row`);
        canDisable = true;
        throw new Error("rollback-sengaja");
      });
    } catch { /* transaksi dibatalkan: trigger tetap aktif */ }
    return { ok: blocked, actual: `DELETE ${blocked ? "ditolak trigger" : "BERHASIL"}; pemilik dapat DISABLE TRIGGER=${canDisable} (batasan terdokumentasi)` };
  });
  await own.$disconnect();
  await dropDb(name);
  await admin.$executeRawUnsafe(`DROP OWNED BY fx_dba`).catch(() => {});
  for (const r of ["fx_dba", "diagnova_app", "diagnova_owner", "diagnova_audit_maintainer"]) {
    await admin.$executeRawUnsafe(`DROP ROLE IF EXISTS ${r}`).catch(() => {});
  }
} else {
  record("AP-*", "hak akses audit log", "membutuhkan MIGRATION_TEST_PSQL_CONTAINER", "DILEWATI", false);
}

// =============================================================================================
// G. Keamanan seed (M-03)
// =============================================================================================
{
  const name = "fx_seed";
  const url = await createDb(name);
  deploy(url);
  const tsx = (file, env) => spawnSync(process.execPath, [TSX_CLI, path.join(ROOT, "prisma", file)], {
    cwd: ROOT, encoding: "utf8", env: { ...process.env, DATABASE_URL: url, NODE_ENV: "development", ...env },
  });
  const c = client(url);
  const counts = async () => (await c.$queryRawUnsafe(`SELECT (SELECT count(*) FROM patients)::int pt, (SELECT count(*) FROM lab_orders)::int o,
    (SELECT count(*) FROM test_catalogs)::int tc, (SELECT count(*) FROM physicians)::int ph, (SELECT count(*) FROM users)::int u,
    (SELECT count(*) FROM roles)::int r, (SELECT count(*) FROM cms_sections)::int s`))[0];

  await check("SD-1", "seed default tanpa SEED_ADMIN_PASSWORD", "gagal; tidak ada user dibuat; tidak ada data LIS", async () => {
    const r = tsx("seed.ts", { SEED_ADMIN_PASSWORD: "" });
    const k = await counts();
    return { ok: r.status !== 0 && k.u === 0 && k.pt === 0, actual: `exit ${r.status}; ${JSON.stringify(k)}` };
  });
  const pw = crypto.randomBytes(12).toString("base64url");
  await check("SD-2", "seed default dengan password (2× berturut-turut)", "1 ADMIN, 2 role berkode; 0 pasien/order/katalog/dokter; idempotent; password tidak tercetak", async () => {
    const r1 = tsx("seed.ts", { SEED_ADMIN_PASSWORD: pw });
    const r2 = tsx("seed.ts", { SEED_ADMIN_PASSWORD: pw });
    const k = await counts();
    const leaked = (r1.stdout + r1.stderr + r2.stdout + r2.stderr).includes(pw);
    return { ok: r1.status === 0 && r2.status === 0 && k.u === 1 && k.r === 2 && k.pt + k.o + k.tc + k.ph === 0 && !leaked, actual: `exit ${r1.status}/${r2.status}; ${JSON.stringify(k)}; password tercetak=${leaked}` };
  });
  await check("SD-3", "seed demo LIS tanpa flag", "ditolak; data LIS tetap 0", async () => {
    const r = tsx("seed-demo-lis.ts", {});
    const k = await counts();
    return { ok: r.status !== 0 && k.pt === 0, actual: `exit ${r.status}; pasien=${k.pt}` };
  });
  await check("SD-4", "seed demo LIS dengan flag pada NODE_ENV=production", "ditolak; data LIS tetap 0", async () => {
    const r = tsx("seed-demo-lis.ts", { SEED_DEMO_LIS: "1", NODE_ENV: "production" });
    const k = await counts();
    return { ok: r.status !== 0 && k.pt === 0, actual: `exit ${r.status}; pasien=${k.pt}` };
  });
  await check("SD-5", "seed demo LIS dengan SEED_DEMO_LIS=1 (non-production)", "data sintetis dibuat; dijalankan ulang tidak menggandakan", async () => {
    const r1 = tsx("seed-demo-lis.ts", { SEED_DEMO_LIS: "1" });
    const k1 = await counts();
    const r2 = tsx("seed-demo-lis.ts", { SEED_DEMO_LIS: "1" });
    const k2 = await counts();
    return { ok: r1.status === 0 && r2.status === 0 && k1.pt > 0 && eq(k1, k2), actual: `exit ${r1.status}/${r2.status}; ${JSON.stringify(k1)} → ${JSON.stringify(k2)}` };
  });
  await check("SD-6", "seed CMS 2×", "run kedua tidak membuat section baru", async () => {
    const r1 = tsx("seed-cms.ts", {});
    const a = (await counts()).s;
    const r2 = tsx("seed-cms.ts", {});
    const b = (await counts()).s;
    return { ok: r1.status === 0 && r2.status === 0 && a > 0 && a === b, actual: `exit ${r1.status}/${r2.status}; section ${a} → ${b}` };
  });
  await c.$disconnect();
  await dropDb(name);
}

// =============================================================================================
// H. Keamanan drift-check (M-04)
// =============================================================================================
{
  const run = (env, args = []) => spawnSync(process.execPath, [path.join(ROOT, "scripts", "db-drift-check.mjs"), ...args], {
    cwd: SANDBOX, encoding: "utf8", env: { ...process.env, PRISMA_HIDE_UPDATE_MESSAGE: "1", ...env },
  });
  const appLike = dbUrl("fx_app_like");
  const cases = [
    ["DC-1", "tanpa SHADOW_DATABASE_URL", { SHADOW_DATABASE_URL: "", DATABASE_URL: appLike }, [], 1],
    ["DC-2", "nama DB tanpa 'shadow'", { SHADOW_DATABASE_URL: dbUrl("fx_drift"), DATABASE_URL: appLike }, ["--confirm-shadow-wipe"], 1],
    ["DC-3", "nama dilindungi (diagnova)", { SHADOW_DATABASE_URL: dbUrl("diagnova"), DATABASE_URL: appLike }, ["--confirm-shadow-wipe"], 1],
    ["DC-4", "sama dengan DATABASE_URL aplikasi", { SHADOW_DATABASE_URL: dbUrl("fx_app_shadow"), DATABASE_URL: dbUrl("fx_app_shadow") }, ["--confirm-shadow-wipe"], 1],
    ["DC-5", "tanpa --confirm-shadow-wipe", { SHADOW_DATABASE_URL: dbUrl("fx_drift_shadow"), DATABASE_URL: appLike }, [], 1],
  ];
  for (const [id, label, env, args, expect] of cases) {
    await check(id, `drift-check: ${label}`, `ditolak (exit ${expect}) sebelum menyentuh DB`, async () => {
      const r = run(env, args);
      return { ok: r.status === expect && !/Prisma schema loaded|Applying/i.test(r.stdout), actual: `exit ${r.status}: ${(r.stderr.match(/✖ ([^\n]*)/) || [])[1] ?? ""}` };
    });
  }
  await check("DC-6", "drift-check: shadow sekali-pakai valid", "exit 0 (migrations = schema.prisma)", async () => {
    await createDb("fx_drift_shadow");
    const r = run({ SHADOW_DATABASE_URL: dbUrl("fx_drift_shadow"), DATABASE_URL: appLike }, ["--confirm-shadow-wipe"]);
    await dropDb("fx_drift_shadow");
    return { ok: r.status === 0, actual: `exit ${r.status}` };
  });
}

// ---------------------------------------------------------------------------------------------
await admin.$disconnect();
const failed = results.filter((r) => r.status !== "PASS");
console.log(`\n${results.length - failed.length}/${results.length} PASS`);
if (process.env.MIGRATION_TEST_REPORT) fs.writeFileSync(process.env.MIGRATION_TEST_REPORT, JSON.stringify(results, null, 2));
try {
  fs.rmSync(SANDBOX, { recursive: true, force: true, maxRetries: 5, retryDelay: 500 });
} catch {
  console.warn(`Catatan: folder sementara ${SANDBOX} tidak dapat dihapus (file dikunci OS); aman dihapus manual.`);
}
process.exit(failed.length ? 1 : 0);
