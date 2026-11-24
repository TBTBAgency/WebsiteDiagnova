// Test alur Magic Link, aktivasi demo, status lead, dan job expiry.
// Membutuhkan server dijalankan dengan APP_BASE_URL = TEST_BASE_URL dan CRON_SECRET terkonfigurasi.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { BASE, db, uid, sha256, loginAdmin, cookieHeader, sessionFromResponse } from "./helpers.mjs";

const DOMAIN = "magic.test.local";
const CRON_SECRET = process.env.CRON_SECRET;
let adminCookie;

before(async () => {
  adminCookie = cookieHeader(await loginAdmin());
});

after(async () => {
  await db.lead.deleteMany({ where: { email: { endsWith: `@${DOMAIN}` } } });
  await db.user.deleteMany({ where: { email: { endsWith: `@${DOMAIN}` } } });
  await db.$disconnect();
});

// ---------- helpers ----------
async function submitLead(email = `lead-${uid()}@${DOMAIN}`) {
  const res = await fetch(`${BASE}/api/request-demo`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      name: "Dr. Test Client",
      institution: "RS Test",
      jobTitle: "Kepala Lab",
      email,
      phone: "081234567890",
      institutionType: "hospital",
      notes: "",
    }),
  });
  assert.equal(res.status, 201, "submit form demo");
  const { data } = await res.json();
  return { id: data.id, email };
}

async function approve(leadId, body = { durationDays: 7 }) {
  const res = await fetch(`${BASE}/api/admin/leads/${leadId}/approve`, {
    method: "POST",
    headers: { "content-type": "application/json", ...adminCookie },
    body: JSON.stringify(body),
  });
  return { res, json: await res.json() };
}

function tokenFromUrl(url) {
  const m = url.match(/#token=([a-f0-9]{64})$/);
  assert.ok(m, `URL magic link harus memakai fragment #token=: ${url}`);
  return m[1];
}

async function approvedLead(durationDays = 7) {
  const lead = await submitLead();
  const { res, json } = await approve(lead.id, { durationDays });
  assert.equal(res.status, 200, JSON.stringify(json));
  return { ...lead, url: json.data.magicLinkUrl, token: tokenFromUrl(json.data.magicLinkUrl) };
}

const consume = (token, extraHeaders = {}) =>
  fetch(`${BASE}/api/auth/magic-link/consume`, {
    method: "POST",
    headers: { "content-type": "application/json", ...extraHeaders },
    body: JSON.stringify({ token }),
  });

const linkByToken = (token) => db.demoMagicLink.findUnique({ where: { tokenHash: sha256(token) } });

// ---------- tests ----------

test("approve: URL memakai base URL environment, token hanya disimpan sebagai hash", async () => {
  const lead = await approvedLead();
  assert.ok(lead.url.startsWith(`${BASE}/auth/verify-magic-link#token=`), lead.url);

  const link = await linkByToken(lead.token);
  assert.ok(link, "hash token harus ada di DB");
  assert.notEqual(link.tokenHash, lead.token);
  assert.equal(await db.demoMagicLink.count({ where: { tokenHash: lead.token } }), 0, "token mentah tidak boleh tersimpan");

  // Detail lead (yang dipakai halaman admin) tidak lagi mengembalikan URL palsu berbasis hash
  const res = await fetch(`${BASE}/api/admin/leads/${lead.id}`, { headers: adminCookie });
  const body = await res.text();
  const detail = JSON.parse(body).data;
  assert.equal(detail.magicLinkUrl, null);
  assert.equal(detail.magicLinkStatus, "ACTIVE");
  assert.ok(!body.includes(link.tokenHash), "hash token tidak boleh bocor ke UI admin");
  assert.ok(!body.includes(lead.token), "token mentah tidak boleh bocor ke UI admin");
});

test("approve TIDAK mengubah status menjadi Jadwal Demo", async () => {
  const lead = await approvedLead();
  const row = await db.lead.findUnique({ where: { id: lead.id } });
  assert.equal(row.status, 1);
  assert.equal(row.approvalStatus, "APPROVED");
  assert.equal(row.voucherExpiry, null, "masa berlaku baru ditetapkan saat aktivasi");
});

test("preview WhatsApp / bot (GET) tidak mengonsumsi token dan tidak membuat sesi", async () => {
  const lead = await approvedLead();
  const bots = [
    "WhatsApp/2.23.20.0 A",
    "facebookexternalhit/1.1",
    "Mozilla/5.0 (compatible; Googlebot/2.1)",
    "Microsoft Office/16.0 (SafeLinks)",
  ];
  for (const ua of bots) {
    // fetch tidak mengirim fragment; uji juga format lama ?token= yang terkirim ke server
    for (const url of [lead.url, `${BASE}/auth/verify-magic-link?token=${lead.token}`]) {
      const res = await fetch(url, { headers: { "user-agent": ua } });
      assert.equal(res.status, 200, `${ua} ${url}`);
      assert.equal(sessionFromResponse(res), null, "GET tidak boleh membuat sesi");
    }
  }
  const link = await linkByToken(lead.token);
  assert.equal(link.usedAt, null, "token harus tetap belum terpakai");
  assert.equal((await db.lead.findUnique({ where: { id: lead.id } })).status, 1);
});

test("GET /api/auth/magic-link/consume ditolak (hanya POST)", async () => {
  const res = await fetch(`${BASE}/api/auth/magic-link/consume`);
  assert.equal(res.status, 405);
});

test("token valid -> login pertama: sesi dibuat, masa demo aktif, status Jadwal Demo", async () => {
  const lead = await approvedLead(14);
  const before = Date.now();
  const res = await consume(lead.token, { "user-agent": "test-browser" });
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.data.redirectUrl, "/demo");

  const setCookie = (res.headers.getSetCookie?.() ?? []).join(";");
  assert.match(setCookie, /diagnova_session=[^;]+/);
  assert.match(setCookie, /HttpOnly/i);
  assert.match(setCookie, /SameSite=lax/i);
  const maxAge = Number((setCookie.match(/Max-Age=(\d+)/) || [])[1]);
  assert.ok(maxAge > 0 && maxAge <= 86400, `Max-Age ${maxAge}`);

  const link = await linkByToken(lead.token);
  assert.ok(link.usedAt, "token ditandai terpakai");
  assert.equal(link.userAgent, "test-browser");

  const row = await db.lead.findUnique({ where: { id: lead.id }, include: { user: true } });
  assert.equal(row.status, 3, "Jadwal Demo setelah login pertama");
  assert.ok(row.user.demoActivatedAt);
  const expectedExpiry = before + 14 * 86400000;
  assert.ok(Math.abs(row.user.demoExpiresAt.getTime() - expectedExpiry) < 60000, "expiry = aktivasi + 14 hari");
  assert.equal(row.voucherExpiry.getTime(), row.user.demoExpiresAt.getTime(), "satu nilai expiry");

  // Sesi demo: boleh /demo, tidak boleh area/API admin
  const session = cookieHeader(sessionFromResponse(res));
  assert.equal((await fetch(`${BASE}/demo`, { headers: session, redirect: "manual" })).status, 200);
  assert.equal((await fetch(`${BASE}/api/admin/leads`, { headers: session })).status, 403);
  assert.equal((await fetch(`${BASE}/api/lis/patients`, { headers: session })).status, 403);
  // Area admin tersembunyi: sesi demo mendapat 404 biasa (bukan redirect ke halaman login)
  assert.equal((await fetch(`${BASE}/admin/dashboard`, { headers: session, redirect: "manual" })).status, 404);
});

test("token dipakai dua kali -> ditolak (USED)", async () => {
  const lead = await approvedLead();
  assert.equal((await consume(lead.token)).status, 200);
  const second = await consume(lead.token);
  assert.equal(second.status, 409);
  assert.equal((await second.json()).data.code, "USED");
});

test("request bersamaan -> tepat satu yang berhasil", async () => {
  const lead = await approvedLead();
  const results = await Promise.all(Array.from({ length: 8 }, () => consume(lead.token)));
  const statuses = results.map((r) => r.status).sort();
  assert.equal(statuses.filter((s) => s === 200).length, 1, `statuses: ${statuses}`);
  assert.equal(statuses.filter((s) => s === 409).length, 7, `statuses: ${statuses}`);
  const sessions = results.map(sessionFromResponse).filter(Boolean);
  assert.equal(sessions.length, 1, "hanya satu sesi yang dibuat");
});

test("token expired -> ditolak (EXPIRED) dan tetap tidak terpakai", async () => {
  const lead = await approvedLead();
  await db.demoMagicLink.update({
    where: { tokenHash: sha256(lead.token) },
    data: { expiresAt: new Date(Date.now() - 1000) },
  });
  const res = await consume(lead.token);
  assert.equal(res.status, 410);
  assert.equal((await res.json()).data.code, "EXPIRED");
  assert.equal((await linkByToken(lead.token)).usedAt, null);
});

test("token invalid / format salah / kosong -> 400 INVALID", async () => {
  for (const token of [crypto.randomBytes(32).toString("hex"), "abc", "' OR 1=1 --", "", null]) {
    const res = await consume(token);
    assert.equal(res.status, 400, String(token));
    assert.equal((await res.json()).data.code, "INVALID");
  }
  const noBody = await fetch(`${BASE}/api/auth/magic-link/consume`, { method: "POST" });
  assert.equal(noBody.status, 400);
});

test("approve ulang mencabut tautan lama yang belum dipakai", async () => {
  const lead = await approvedLead();
  const { json } = await approve(lead.id);
  const newToken = tokenFromUrl(json.data.magicLinkUrl);

  const oldRes = await consume(lead.token);
  assert.equal(oldRes.status, 410, "tautan lama harus tidak berlaku");
  assert.equal((await consume(newToken)).status, 200, "tautan baru berlaku");
});

test("login ulang dengan tautan baru: masa demo & status tidak berubah", async () => {
  const lead = await approvedLead();
  assert.equal((await consume(lead.token)).status, 200);
  const first = await db.lead.findUnique({ where: { id: lead.id }, include: { user: true } });

  const { json } = await approve(lead.id, { durationDays: 30 });
  assert.equal((await consume(tokenFromUrl(json.data.magicLinkUrl))).status, 200);
  const second = await db.lead.findUnique({ where: { id: lead.id }, include: { user: true } });

  assert.equal(second.user.demoExpiresAt.getTime(), first.user.demoExpiresAt.getTime());
  assert.equal(second.user.demoActivatedAt.getTime(), first.user.demoActivatedAt.getTime());
  assert.equal(second.status, 3);
});

test("akun demo nonaktif -> ditolak, token tidak terpakai; approve ulang juga ditolak", async () => {
  const lead = await approvedLead();
  const link = await linkByToken(lead.token);
  await db.user.update({ where: { id: link.userId }, data: { status: 0 } });

  const res = await consume(lead.token);
  assert.equal(res.status, 403);
  assert.equal((await res.json()).data.code, "ACCOUNT_INACTIVE");
  assert.equal((await linkByToken(lead.token)).usedAt, null);

  const again = await approve(lead.id);
  assert.equal(again.res.status, 409);
});

test("akun tidak ditemukan (dihapus) -> ditolak, tidak membuat akun baru", async () => {
  const lead = await approvedLead();
  const link = await linkByToken(lead.token);
  await db.user.delete({ where: { id: link.userId } });

  const res = await consume(lead.token);
  assert.equal(res.status, 400);
  assert.equal((await res.json()).data.code, "INVALID");
  assert.equal(await db.user.count({ where: { email: lead.email } }), 0, "tidak boleh membuat akun otomatis");
  assert.equal((await linkByToken(lead.token)).usedAt, null);
});

test("masa demo berakhir -> login ditolak, sesi lama diarahkan ke /demo-expired, approve ulang ditolak", async () => {
  const lead = await approvedLead();
  const login = await consume(lead.token);
  assert.equal(login.status, 200);
  const session = cookieHeader(sessionFromResponse(login));
  const { userId } = await linkByToken(lead.token);

  // Siapkan tautan baru valid sebelum masa demo diakhiri
  const { json } = await approve(lead.id);
  const freshToken = tokenFromUrl(json.data.magicLinkUrl);
  await db.user.update({ where: { id: userId }, data: { demoExpiresAt: new Date(Date.now() - 1000) } });

  const res = await consume(freshToken);
  assert.equal(res.status, 410);
  const body = await res.json();
  assert.equal(body.data.code, "DEMO_EXPIRED");
  assert.equal(body.data.redirectUrl, "/demo-expired");
  assert.equal((await linkByToken(freshToken)).usedAt, null);

  const page = await fetch(`${BASE}/demo`, { headers: session, redirect: "manual" });
  assert.equal(page.status, 307);
  assert.match(page.headers.get("location") || "", /\/demo-expired/);

  assert.equal((await approve(lead.id)).res.status, 409, "perpanjangan belum didukung");
});

test("job expiry: butuh secret, mengubah Jadwal Demo -> Selesai, idempoten", async () => {
  assert.ok(CRON_SECRET, "CRON_SECRET wajib di-set untuk test ini");
  const lead = await approvedLead();
  assert.equal((await consume(lead.token)).status, 200);
  const { userId } = await linkByToken(lead.token);

  const call = (auth) =>
    fetch(`${BASE}/api/cron/expire-demos`, { method: "POST", headers: auth ? { authorization: auth } : {} });

  assert.equal((await call()).status, 401);
  assert.equal((await call("Bearer wrong-secret-value-xyz")).status, 401);

  // Belum berakhir -> tidak berubah
  assert.equal((await call(`Bearer ${CRON_SECRET}`)).status, 200);
  assert.equal((await db.lead.findUnique({ where: { id: lead.id } })).status, 3);

  await db.user.update({ where: { id: userId }, data: { demoExpiresAt: new Date(Date.now() - 1000) } });
  const run = await call(`Bearer ${CRON_SECRET}`);
  assert.equal(run.status, 200);
  assert.ok((await run.json()).data.expired >= 1);
  assert.equal((await db.lead.findUnique({ where: { id: lead.id } })).status, 4);

  // Dijalankan ulang / bersamaan: tetap Selesai, tidak ada perubahan berulang
  const reruns = await Promise.all([1, 2, 3].map(() => call(`Bearer ${CRON_SECRET}`)));
  for (const r of reruns) assert.equal(r.status, 200);
  assert.equal((await db.lead.findUnique({ where: { id: lead.id } })).status, 4);
});

test("status tidak mundur: login pada lead berstatus Selesai tidak mengubahnya kembali", async () => {
  const lead = await approvedLead();
  await db.lead.update({ where: { id: lead.id }, data: { status: 4 } });
  assert.equal((await consume(lead.token)).status, 200);
  assert.equal((await db.lead.findUnique({ where: { id: lead.id } })).status, 4);
});

test("pengambilalihan akun: email admin/non-demo pada form tidak menghasilkan tautan", async () => {
  for (const email of ["admin@diagnova.id", "sales@diagnova.id"]) {
    const lead = await submitLead(email);
    const row = await db.lead.findUnique({ where: { id: lead.id } });
    assert.equal(row.userId, null, "form publik tidak boleh menempel ke akun yang ada");

    const { res } = await approve(lead.id);
    assert.equal(res.status, 409, email);
    assert.equal(await db.demoMagicLink.count({ where: { leadId: lead.id } }), 0);
    await db.lead.delete({ where: { id: lead.id } });
  }
});

test("durasi demo hanya 3/7/14/30 (backend)", async () => {
  const lead = await submitLead();
  for (const bad of [1, 5, 60, 90, -3]) {
    const { res } = await approve(lead.id, { durationDays: bad });
    assert.equal(res.status, 400, `durasi ${bad}`);
  }
  for (const ok of [3, 7, 14, 30]) {
    const { res } = await approve(lead.id, { durationDays: ok });
    assert.equal(res.status, 200, `durasi ${ok}`);
  }
  const patch = await fetch(`${BASE}/api/admin/leads/${lead.id}`, {
    method: "PATCH",
    headers: { "content-type": "application/json", ...adminCookie },
    body: JSON.stringify({ status: 2, voucherDays: 45 }),
  });
  assert.equal(patch.status, 400);
});
