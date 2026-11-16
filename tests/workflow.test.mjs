// Test workflow Lead & Demo Access (skenario T1–T16, PHASE_2_REVISION_WORKFLOW_AND_DESIGN.md §8.2).
// Workflow: form -> Dihubungi; login demo pertama -> Jadwal Demo; admin "Tandai Demo Selesai" -> Selesai.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { BASE, db, uid, sha256, loginAdmin, createUser, cleanup, json, sessionFromResponse, cookieHeader, randomIp } from "./helpers.mjs";

const leadIds = [];
const userIds = [];
let admin;

before(async () => {
  admin = await loginAdmin();
});
after(async () => {
  await cleanup({ leadIds, userIds });
  await db.$disconnect();
});

const formBody = (extra = {}) => ({
  name: "Dr. Uji Workflow",
  institution: "RS Uji Coba",
  jobTitle: "Kepala Laboratorium",
  email: `wf-${uid()}@example.com`,
  phone: "081234567890",
  institutionType: "hospital",
  requestedDemoDate: "2026-12-01",
  notes: "Kebutuhan integrasi SIMRS",
  ...extra,
});

async function submitForm(extra) {
  const res = await fetch(`${BASE}/api/request-demo`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": randomIp() },
    body: JSON.stringify(formBody(extra)),
  });
  assert.equal(res.status, 201);
  const id = (await res.json()).data.id;
  leadIds.push(id);
  return id;
}

async function grant(leadId, durationDays = 7) {
  const res = await json("POST", `/api/admin/leads/${leadId}/access`, admin, { durationDays });
  const body = await res.json();
  assert.equal(res.status, 200, body.message);
  const lead = await db.lead.findUnique({ where: { id: leadId } });
  if (lead.userId && !userIds.includes(lead.userId)) userIds.push(lead.userId);
  return { url: body.data.magicLinkUrl, token: body.data.magicLinkUrl.split("#token=")[1], body };
}

const consume = (token, headers = {}) =>
  fetch(`${BASE}/api/auth/magic-link/consume`, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify({ token }),
  });

const leadRow = (id) => db.lead.findUnique({ where: { id } });
const auditCount = (recordId, action) => db.auditLog.count({ where: { recordId, action } });

test("T1 form berhasil -> 201, status Dihubungi, demo_started_at NULL, audit LEAD_CREATED", async () => {
  const id = await submitForm();
  const lead = await leadRow(id);
  assert.equal(lead.status, "CONTACTED");
  assert.equal(lead.demoStartedAt, null);
  assert.equal(lead.userId, null);
  assert.equal(await auditCount(id, "LEAD_CREATED"), 1);
});

test("T2 form tidak valid -> 400; jumlah lead & audit tidak berubah", async () => {
  const [leads, audits] = await Promise.all([db.lead.count(), db.auditLog.count({ where: { action: "LEAD_CREATED" } })]);
  const res = await json("POST", "/api/request-demo", null, formBody({ email: "bukan-email" }));
  assert.equal(res.status, 400);
  assert.equal(await db.lead.count(), leads);
  assert.equal(await db.auditLog.count({ where: { action: "LEAD_CREATED" } }), audits);
});

test("T3 admin memberi akses -> status tetap Dihubungi, 1 periode belum aktif, token hanya hash, audit", async () => {
  const id = await submitForm();
  const { url, token } = await grant(id, 7);
  assert.ok(url.startsWith(`${process.env.APP_BASE_URL}/auth/verify-magic-link#token=`), url);
  const lead = await leadRow(id);
  assert.equal(lead.status, "CONTACTED");
  const accesses = await db.demoAccess.findMany({ where: { leadId: id } });
  assert.equal(accesses.length, 1);
  assert.equal(accesses[0].activatedAt, null);
  assert.equal(accesses[0].durationDays, 7);
  const link = await db.demoMagicLink.findUnique({ where: { tokenHash: sha256(token) } });
  assert.ok(link, "token disimpan sebagai SHA-256");
  assert.equal(await db.demoMagicLink.count({ where: { tokenHash: token } }), 0, "token mentah tidak tersimpan");
  assert.equal(await auditCount(accesses[0].id, "DEMO_ACCESS_GRANTED"), 1);
  assert.equal(await auditCount(accesses[0].id, "MAGIC_LINK_ISSUED"), 1);
});

test("T4/T5 bot WhatsApp & membuka halaman verifikasi (GET) -> tidak mengonsumsi token, tanpa sesi, status tetap", async () => {
  const id = await submitForm();
  const { url, token } = await grant(id);
  for (const ua of ["WhatsApp/2.23.20.0 A", "facebookexternalhit/1.1", "Mozilla/5.0"]) {
    for (const u of [url, `${BASE}/auth/verify-magic-link?token=${token}`]) {
      const res = await fetch(u, { headers: { "user-agent": ua } });
      assert.equal(res.status, 200);
      assert.equal(sessionFromResponse(res), null);
    }
  }
  assert.equal((await db.demoMagicLink.findUnique({ where: { tokenHash: sha256(token) } })).usedAt, null);
  assert.equal((await leadRow(id)).status, "CONTACTED");
  assert.equal((await fetch(`${BASE}/api/auth/magic-link/consume`)).status, 405);
});

test("T6 login gagal (invalid / expired / dicabut / akun nonaktif / akun dihapus / akses berakhir) -> status tetap, token tetap, audit", async () => {
  // invalid
  for (const t of ["", "abc", "z".repeat(64), "a".repeat(64)]) assert.equal((await consume(t)).status, 400);

  // expired link
  let id = await submitForm();
  let g = await grant(id);
  await db.demoMagicLink.update({ where: { tokenHash: sha256(g.token) }, data: { expiresAt: new Date(Date.now() - 1000) } });
  assert.equal((await consume(g.token)).status, 410);

  // revoked link (diganti tautan baru)
  id = await submitForm();
  g = await grant(id);
  const relink = await json("POST", `/api/admin/leads/${id}/access/link`, admin);
  assert.equal(relink.status, 200);
  const res = await consume(g.token);
  assert.equal(res.status, 410);
  assert.equal((await res.json()).data.code, "REVOKED");

  // akun nonaktif & akun soft-deleted
  for (const patch of [{ status: "INACTIVE" }, { deletedAt: new Date() }]) {
    id = await submitForm();
    g = await grant(id);
    const lead = await leadRow(id);
    await db.user.update({ where: { id: lead.userId }, data: patch });
    assert.equal((await consume(g.token)).status, 403);
    const after = await leadRow(id);
    assert.equal(after.status, "CONTACTED");
    assert.equal(after.demoStartedAt, null);
    assert.equal((await db.demoMagicLink.findUnique({ where: { tokenHash: sha256(g.token) } })).usedAt, null);
  }
  assert.ok((await db.auditLog.count({ where: { action: "DEMO_LOGIN_FAILED" } })) >= 4);
});

test("T7 login pertama sukses -> sesi, Jadwal Demo, demo_started_at = activated_at, audit transisi", async () => {
  const id = await submitForm();
  const { token } = await grant(id, 3);
  const res = await consume(token, { "user-agent": "test-browser" });
  assert.equal(res.status, 200);
  const cookie = sessionFromResponse(res);
  assert.ok(cookie, "Set-Cookie sesi");
  const lead = await leadRow(id);
  const access = await db.demoAccess.findFirst({ where: { leadId: id } });
  assert.equal(lead.status, "SCHEDULED");
  assert.ok(lead.demoStartedAt);
  assert.equal(lead.demoStartedAt.getTime(), access.activatedAt.getTime());
  assert.equal(access.expiresAt.getTime() - access.activatedAt.getTime(), 3 * 86400000);
  assert.equal(await auditCount(id, "LEAD_STATUS_CHANGED"), 1);
  const demo = await fetch(`${BASE}/demo`, { headers: cookieHeader(cookie), redirect: "manual" });
  assert.equal(demo.status, 200);
});

test("T8 login ulang dengan tautan baru -> tidak ada transisi/audit baru, demo_started_at tetap", async () => {
  const id = await submitForm();
  await consume((await grant(id)).token);
  const before = await leadRow(id);
  const relink = await (await json("POST", `/api/admin/leads/${id}/access/link`, admin)).json();
  const res = await consume(relink.data.magicLinkUrl.split("#token=")[1]);
  assert.equal(res.status, 200);
  const after = await leadRow(id);
  assert.equal(after.status, "SCHEDULED");
  assert.equal(after.demoStartedAt.getTime(), before.demoStartedAt.getTime());
  assert.equal(await auditCount(id, "LEAD_STATUS_CHANGED"), 1);
});

test("T9 akses berakhir -> login ditolak, /demo -> /demo-expired, status tetap Jadwal Demo, tanpa cron", async () => {
  const id = await submitForm();
  const first = await consume((await grant(id)).token);
  const cookie = sessionFromResponse(first);
  const relink = await (await json("POST", `/api/admin/leads/${id}/access/link`, admin)).json();
  const past = new Date(Date.now() - 8 * 86400000);
  await db.demoAccess.updateMany({
    where: { leadId: id },
    data: { activatedAt: past, expiresAt: new Date(past.getTime() + 7 * 86400000) },
  });
  const res = await consume(relink.data.magicLinkUrl.split("#token=")[1]);
  assert.equal(res.status, 410);
  assert.equal((await res.json()).data.code, "DEMO_EXPIRED");
  const demo = await fetch(`${BASE}/demo`, { headers: cookieHeader(cookie), redirect: "manual" });
  assert.equal(demo.status, 307);
  assert.match(demo.headers.get("location"), /demo-expired/);
  const lead = await leadRow(id);
  assert.equal(lead.status, "SCHEDULED");
  assert.equal(lead.demoCompletedAt, null);
  assert.equal((await fetch(`${BASE}/api/cron/expire-demos`, { method: "POST" })).status, 404, "endpoint cron dihapus");

  const list = await (await json("GET", `/api/admin/leads/${id}`, admin)).json();
  assert.equal(list.data.accessEnded, true, "indikator akses berakhir — menunggu konfirmasi");
});

test("Perpanjangan: periode lama utuh, periode baru tersambung, status Lead tidak berubah", async () => {
  const id = await submitForm();
  await consume((await grant(id, 3)).token);
  const original = await db.demoAccess.findFirst({ where: { leadId: id } });
  const res = await json("POST", `/api/admin/leads/${id}/access/extend`, admin, { durationDays: 7 });
  const body = await res.json();
  assert.equal(res.status, 200, body.message);
  assert.equal(body.data.magicLinkUrl, null, "periode masih aktif -> tanpa tautan baru");
  const ext = await db.demoAccess.findFirst({ where: { extendsAccessId: original.id } });
  assert.equal(ext.activatedAt.getTime(), original.expiresAt.getTime());
  assert.equal(ext.expiresAt.getTime() - ext.activatedAt.getTime(), 7 * 86400000);
  assert.deepEqual(await db.demoAccess.findUnique({ where: { id: original.id } }), original);
  assert.equal((await leadRow(id)).status, "SCHEDULED");
  assert.equal(await auditCount(ext.id, "DEMO_ACCESS_EXTENDED"), 1);
  assert.equal((await json("POST", `/api/admin/leads/${id}/access/extend`, admin, { durationDays: 5 })).status, 400);
});

test("Pencabutan akses -> sesi demo ditolak, status Lead tidak berubah", async () => {
  const id = await submitForm();
  const cookie = sessionFromResponse(await consume((await grant(id)).token));
  assert.equal((await json("POST", `/api/admin/leads/${id}/access/revoke`, admin)).status, 200);
  const demo = await fetch(`${BASE}/demo`, { headers: cookieHeader(cookie), redirect: "manual" });
  assert.equal(demo.status, 307);
  assert.equal((await leadRow(id)).status, "SCHEDULED");
});

test("T10 Tandai Demo Selesai -> Selesai + waktu, admin, catatan; audit ADMIN_CONFIRMED_COMPLETION", async () => {
  const id = await submitForm();
  await consume((await grant(id)).token);
  const res = await json("POST", `/api/admin/leads/${id}/complete`, admin, { note: "Demo daring 2 jam, peserta 5 orang" });
  assert.equal(res.status, 200);
  const lead = await leadRow(id);
  const adminUser = await db.user.findUnique({ where: { email: "admin-test@example.com" } });
  assert.equal(lead.status, "COMPLETED");
  assert.ok(lead.demoCompletedAt);
  assert.equal(lead.demoCompletedById, adminUser.id);
  assert.equal(lead.demoCompletionNote, "Demo daring 2 jam, peserta 5 orang");
  const log = await db.auditLog.findFirst({ where: { recordId: id, action: "LEAD_STATUS_CHANGED" }, orderBy: { createdAt: "desc" } });
  assert.equal(log.newValue.trigger, "ADMIN_CONFIRMED_COMPLETION");
  assert.equal(log.actorEmail, "admin-test@example.com");
  // OD-22: tidak ada akses baru/perpanjangan setelah Selesai
  assert.equal((await json("POST", `/api/admin/leads/${id}/access/extend`, admin, { durationDays: 3 })).status, 409);
  assert.equal((await json("POST", `/api/admin/leads/${id}/complete`, admin, {})).status, 409);
});

test("T11 status tidak dapat diubah bebas / mundur lewat PATCH", async () => {
  const id = await submitForm();
  await consume((await grant(id)).token);
  await json("POST", `/api/admin/leads/${id}/complete`, admin, {});
  for (const body of [{ status: "CONTACTED" }, { status: 1 }, { confirmedDemoDate: null, status: "SCHEDULED" }]) {
    assert.equal((await json("PATCH", `/api/admin/leads/${id}`, admin, body)).status, 400, JSON.stringify(body));
  }
  assert.equal((await leadRow(id)).status, "COMPLETED");
  // DB menolak kombinasi status/timestamp yang tidak konsisten (CHECK constraint)
  await assert.rejects(db.lead.update({ where: { id }, data: { status: "CONTACTED" } }));
  const ok = await json("PATCH", `/api/admin/leads/${id}`, admin, { confirmedDemoDate: "2026-12-10T03:00:00.000Z" });
  assert.equal(ok.status, 200);
});

test("T12 8 login bersamaan dengan token sama -> tepat 1 sukses, 1 aktivasi, 1 audit transisi", async () => {
  const id = await submitForm();
  const { token } = await grant(id);
  const results = await Promise.all(Array.from({ length: 8 }, () => consume(token)));
  assert.equal(results.filter((r) => r.status === 200).length, 1);
  assert.equal(await auditCount(id, "LEAD_STATUS_CHANGED"), 1);
  assert.equal(await db.demoAccess.count({ where: { leadId: id, activatedAt: { not: null } } }), 1);
});

test("T13 urutan audit lengkap: CREATED -> GRANTED/ISSUED -> STATUS(scheduled) -> STATUS(completed)", async () => {
  const id = await submitForm();
  await consume((await grant(id)).token);
  await json("POST", `/api/admin/leads/${id}/complete`, admin, {});
  const access = await db.demoAccess.findFirst({ where: { leadId: id } });
  const logs = await db.auditLog.findMany({
    where: { recordId: { in: [id, access.id] } },
    orderBy: { createdAt: "asc" },
  });
  const seq = logs.map((l) => (l.action === "LEAD_STATUS_CHANGED" ? `STATUS:${l.newValue.status}` : l.action));
  const order = ["LEAD_CREATED", "DEMO_ACCESS_GRANTED", "MAGIC_LINK_ISSUED", "STATUS:SCHEDULED", "STATUS:COMPLETED"];
  let pos = -1;
  for (const step of order) {
    const at = seq.indexOf(step, pos + 1);
    assert.ok(at > pos, `urutan audit salah: ${seq.join(" > ")}`);
    pos = at;
  }
  assert.ok(logs.every((l) => l.createdAt), "setiap log punya waktu");
});

test("T14 dashboard = Leads = filter = CSV; tidak ada 'Baru'", async () => {
  const [overview, leads] = await Promise.all([
    json("GET", "/api/admin/overview", admin).then((r) => r.json()),
    json("GET", "/api/admin/leads?limit=1", admin).then((r) => r.json()),
  ]);
  const o = overview.data.summary.leads;
  const m = leads.data.metrics;
  assert.equal(o.new, undefined);
  for (const k of ["contacted", "scheduled", "completed", "total"]) assert.equal(o[k], m[k], k);
  for (const [status, key] of [["CONTACTED", "contacted"], ["SCHEDULED", "scheduled"], ["COMPLETED", "completed"]]) {
    const r = await json("GET", `/api/admin/leads?status=${status}&limit=1`, admin).then((x) => x.json());
    assert.equal(r.data.total, m[key], status);
    assert.equal(await db.lead.count({ where: { status } }), m[key]);
  }
  const csvRes = await fetch(`${BASE}/api/admin/leads/export`, { headers: cookieHeader(admin) });
  assert.equal(csvRes.status, 200);
  const csv = await csvRes.text();
  assert.equal(csv.trim().split("\r\n").length - 1, m.total, "CSV memuat seluruh lead (tanpa batas 100)");
  assert.doesNotMatch(csv, /"Baru"/);
  assert.ok((await db.auditLog.count({ where: { action: "LEAD_EXPORTED" } })) >= 1);
});

test("T15 konfirmasi selesai dari Dihubungi ditolak (OD-20)", async () => {
  const id = await submitForm();
  const res = await json("POST", `/api/admin/leads/${id}/complete`, admin, {});
  assert.equal(res.status, 409);
  assert.equal((await leadRow(id)).status, "CONTACTED");
});

test("Tolak permohonan: hanya Dihubungi, akses & tautan dicabut, status tidak berubah, akses baru ditolak", async () => {
  const id = await submitForm();
  const { token } = await grant(id);
  const res = await json("POST", `/api/admin/leads/${id}/reject`, admin, { rejectionReason: "Bukan fasilitas kesehatan" });
  assert.equal(res.status, 200);
  const lead = await leadRow(id);
  assert.equal(lead.status, "CONTACTED");
  assert.equal(lead.approvalStatus, "REJECTED");
  assert.equal((await consume(token)).status, 410);
  assert.equal((await json("POST", `/api/admin/leads/${id}/access`, admin, { durationDays: 7 })).status, 409);
});

test("Pemberian akses: durasi hanya 3/7/14/30; email milik ADMIN tidak pernah mendapat tautan", async () => {
  const id = await submitForm();
  for (const d of [1, 5, 90, "7x"]) {
    assert.equal((await json("POST", `/api/admin/leads/${id}/access`, admin, { durationDays: d })).status, 400, String(d));
  }
  const adminLike = await createUser({ roleCode: "ADMIN", email: `takeover-${uid()}@example.com` });
  userIds.push(adminLike.id);
  const victim = await submitForm({ email: adminLike.email });
  const res = await json("POST", `/api/admin/leads/${victim}/access`, admin, { durationDays: 7 });
  assert.equal(res.status, 409);
  assert.equal(await db.demoAccess.count({ where: { leadId: victim } }), 0);
});

test("Pemberian akses ganda ditolak selama periode belum berakhir", async () => {
  const id = await submitForm();
  await grant(id);
  assert.equal((await json("POST", `/api/admin/leads/${id}/access`, admin, { durationDays: 7 })).status, 409);
});
