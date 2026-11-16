// User Management: hanya USER; ADMIN tidak tampil & tidak dapat diubah; soft delete & restore.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { db, uid, loginAdmin, createUser, cleanup, json } from "./helpers.mjs";

const userIds = [];
let admin;
before(async () => {
  admin = await loginAdmin();
});
after(async () => {
  await cleanup({ userIds });
  await db.$disconnect();
});

test("daftar hanya berisi USER (ADMIN & role lama tidak pernah tampil)", async () => {
  const a = await createUser({ roleCode: "ADMIN" });
  const legacy = await createUser({ roleName: "Lab Staff" });
  const u = await createUser({ roleCode: "USER" });
  userIds.push(a.id, legacy.id, u.id);
  const body = await (await json("GET", "/api/admin/users?includeDeleted=1", admin)).json();
  const ids = body.data.map((x) => x.id);
  assert.ok(ids.includes(u.id));
  assert.ok(!ids.includes(a.id), "ADMIN tidak boleh tampil");
  assert.ok(!ids.includes(legacy.id), "role lama tidak boleh tampil");
  assert.ok(body.data.every((x) => x.roleCode === "USER"));
});

test("ADMIN tidak dapat diedit, dinonaktifkan, dihapus, atau dipulihkan lewat API (403)", async () => {
  const a = await createUser({ roleCode: "ADMIN" });
  userIds.push(a.id);
  assert.equal((await json("PATCH", `/api/admin/users/${a.id}`, admin, { name: "Diubah" })).status, 403);
  assert.equal((await json("PATCH", `/api/admin/users/${a.id}`, admin, { status: "INACTIVE" })).status, 403);
  assert.equal((await json("DELETE", `/api/admin/users/${a.id}`, admin)).status, 403);
  assert.equal((await json("POST", `/api/admin/users/${a.id}/restore`, admin)).status, 403);
  const after = await db.user.findUnique({ where: { id: a.id } });
  assert.equal(after.name, a.name);
  assert.equal(after.status, "ACTIVE");
  assert.equal(after.deletedAt, null);
});

test("role lama tidak dapat dikelola (OD-01); role & email tidak dapat diubah", async () => {
  const legacy = await createUser({ roleName: "Pathologist" });
  const u = await createUser({ roleCode: "USER" });
  userIds.push(legacy.id, u.id);
  assert.equal((await json("PATCH", `/api/admin/users/${legacy.id}`, admin, { name: "x y" })).status, 403);
  assert.equal((await json("PATCH", `/api/admin/users/${u.id}`, admin, { roleId: "x" })).status, 400);
  assert.equal((await json("PATCH", `/api/admin/users/${u.id}`, admin, { email: "x@example.com" })).status, 400);
});

test("USER: buat, ubah, nonaktifkan, soft delete, pulihkan — semua diaudit", async () => {
  const email = `um-${uid()}@example.com`;
  const created = await json("POST", "/api/admin/users", admin, { name: "Klien UM", email, institution: "RS A" });
  assert.equal(created.status, 201);
  const id = (await created.json()).data.id;
  userIds.push(id);
  assert.equal((await json("POST", "/api/admin/users", admin, { name: "Dup", email })).status, 409);
  assert.equal((await json("PATCH", `/api/admin/users/${id}`, admin, { name: "Klien Baru", status: "INACTIVE" })).status, 200);
  assert.equal((await db.user.findUnique({ where: { id } })).status, "INACTIVE");
  assert.equal((await json("DELETE", `/api/admin/users/${id}`, admin)).status, 200);
  assert.ok((await db.user.findUnique({ where: { id } })).deletedAt, "soft delete: baris tetap ada");
  const list = await (await json("GET", "/api/admin/users", admin)).json();
  assert.ok(!list.data.some((x) => x.id === id), "akun terhapus tidak tampil tanpa includeDeleted");
  assert.equal((await json("POST", `/api/admin/users/${id}/restore`, admin)).status, 200);
  assert.equal((await db.user.findUnique({ where: { id } })).deletedAt, null);
  const actions = (await db.auditLog.findMany({ where: { recordId: id }, select: { action: true } })).map((x) => x.action);
  for (const a of ["USER_CREATED", "USER_DEACTIVATED", "USER_DELETED", "USER_RESTORED"]) assert.ok(actions.includes(a), a);
});

test("overview: activeUsers hanya menghitung USER aktif yang tidak dihapus", async () => {
  const expected = await db.user.count({ where: { status: "ACTIVE", deletedAt: null, role: { code: "USER" } } });
  const body = await (await json("GET", "/api/admin/overview", admin)).json();
  assert.equal(body.data.summary.activeUsers, expected);
});
