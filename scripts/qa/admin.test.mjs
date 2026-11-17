// Admin dashboard / user management integration tests.
//
// Requirements: dev server running (`npm run dev`) and a LOCAL development database.
// Creates and deletes temporary QA records (emails *@example.test).
//   node --env-file=.env scripts/qa/admin.test.mjs
import { PrismaClient } from "@prisma/client";

if (process.env.NODE_ENV === "production" || !/@(localhost|127\.0\.0\.1)[:/]/.test(process.env.DATABASE_URL || "")) {
  console.error("Refusing to run: QA tests may only run against a local development database.");
  process.exit(2);
}

const BASE = process.env.TEST_BASE_URL || "http://localhost:3000";
const prisma = new PrismaClient();
const RUN = Date.now().toString(36);

let pass = 0;
let fail = 0;
function check(name, cond, extra = "") {
  if (cond) {
    pass++;
    console.log(`  PASS  ${name}`);
  } else {
    fail++;
    console.log(`  FAIL  ${name} ${extra}`);
  }
}

async function call(cookie, method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { cookie, "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: res.status, body: await res.json().catch(() => null) };
}

let createdUserId = null;

async function main() {
  const login = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": "10.88.0.1" },
    body: JSON.stringify({ email: "admin@diagnova.id", password: process.env.SEED_ADMIN_PASSWORD || "Diagnova2026!" }),
  });
  const admin = (login.headers.get("set-cookie") || "").split(";")[0];
  check("admin login", login.status === 200);

  console.log("== Dashboard overview");
  const ov = await call(admin, "GET", "/api/admin/overview");
  check("GET /api/admin/overview -> 200", ov.status === 200, `got ${ov.status}`);

  console.log("== User management + audit trail");
  const email = `qa-user-${RUN}@example.test`;
  const created = await call(admin, "POST", "/api/admin/users", { name: "QA User", email, demoDurationDays: 7 });
  createdUserId = created.body?.data?.id;
  check("create USER -> 201", created.status === 201, JSON.stringify(created.body));
  check("created account role is USER", created.body?.data?.roleName === "USER");
  const dbUser = await prisma.user.findUnique({ where: { email } });
  check("no default password set for USER created without password", dbUser.passwordHash === null);

  console.log("== Tambah Pengguna: USER has no password (Magic Link only)");
  const pwEmail = `qa-pw-${RUN}@example.test`;
  const withPw = await call(admin, "POST", "/api/admin/users", { name: "QA Password", email: pwEmail, password: "QaSecret123!" });
  check("create USER with legacy password field -> 201", withPw.status === 201, JSON.stringify(withPw.body));
  const pwRow = await prisma.user.findUnique({ where: { email: pwEmail } });
  check("password sent by client is NOT stored (passwordHash null)", pwRow?.passwordHash === null);
  const leaks = (body) => /passwordHash|"password"|\$2[aby]\$/.test(JSON.stringify(body));
  check("create response contains no password / hash", !leaks(withPw.body));
  const pwLogin = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": `10.88.${RUN.length}.9` },
    body: JSON.stringify({ email: pwEmail, password: "QaSecret123!" }),
  });
  check("USER cannot log in with email + password", pwLogin.status === 401 || pwLogin.status === 403, `got ${pwLogin.status}`);
  const list = await call(admin, "GET", "/api/admin/users");
  check("GET /api/admin/users -> 200", list.status === 200);
  check("user list contains no password / hash", !leaks(list.body));
  check("user list contains no ADMIN account", !(list.body?.data || []).some((u) => u.roleName !== "USER"));
  const badEmail = await call(admin, "POST", "/api/admin/users", { name: "QA Bad", email: "not-an-email" });
  check("invalid email -> 400", badEmail.status === 400);
  const dupEmail = await call(admin, "POST", "/api/admin/users", { name: "QA Dup", email: pwEmail });
  check("duplicate email -> 400 without internals", dupEmail.status === 400 && !/prisma|P2002/i.test(JSON.stringify(dupEmail.body)));
  if (pwRow) await call(admin, "DELETE", `/api/admin/users/${pwRow.id}`);

  const roleEsc = await call(admin, "POST", "/api/admin/users", {
    name: "QA Escalate",
    email: `qa-esc-${RUN}@example.test`,
    roleId: (await prisma.role.findFirst({ where: { name: "ADMIN" } })).id,
  });
  check("roleId=ADMIN in create payload is ignored (role stays USER)", roleEsc.body?.data?.roleName === "USER");
  if (roleEsc.body?.data?.id) await call(admin, "DELETE", `/api/admin/users/${roleEsc.body.data.id}`);

  const upd = await call(admin, "PUT", `/api/admin/users/${createdUserId}`, { name: "QA User Updated" });
  check("update USER -> 200", upd.status === 200, JSON.stringify(upd.body));
  const st = await call(admin, "PATCH", `/api/admin/users/${createdUserId}/status`, { status: 0 });
  check("deactivate USER -> 200", st.status === 200, JSON.stringify(st.body));

  const adminRow = await prisma.user.findUnique({ where: { email: "admin@diagnova.id" } });
  const touchAdmin = await call(admin, "PUT", `/api/admin/users/${adminRow.id}`, { name: "Hacked" });
  check("editing an ADMIN account via user management -> 403", touchAdmin.status === 403, `got ${touchAdmin.status}`);
  const delAdmin = await call(admin, "DELETE", `/api/admin/users/${adminRow.id}`);
  check("deleting an ADMIN account via user management -> 403", delAdmin.status === 403, `got ${delAdmin.status}`);

  const del = await call(admin, "DELETE", `/api/admin/users/${createdUserId}`);
  check("delete USER -> 200", del.status === 200, JSON.stringify(del.body));

  const actions = (
    await prisma.auditLog.findMany({ where: { entity: "User", recordId: createdUserId }, select: { action: true } })
  ).map((a) => a.action);
  for (const a of ["USER_CREATED", "USER_UPDATED", "USER_STATUS_CHANGED", "USER_DELETED"]) {
    check(`audit log contains ${a}`, actions.includes(a));
  }

  const logs = await call(admin, "GET", "/api/admin/audit-logs");
  check("GET /api/admin/audit-logs -> 200 with entries", logs.status === 200 && (logs.body?.data || []).length > 0);
}

main()
  .catch((e) => {
    console.error(e);
    fail++;
  })
  .finally(async () => {
    if (createdUserId) {
      await prisma.user.deleteMany({ where: { id: createdUserId } });
      await prisma.auditLog.deleteMany({ where: { recordId: createdUserId } });
    }
    await prisma.auditLog.deleteMany({ where: { entity: "User", newValue: { path: ["email"], string_ends_with: "@example.test" } } });
    await prisma.user.deleteMany({ where: { email: { startsWith: "qa-", endsWith: `${RUN}@example.test` } } });
    console.log(`\nResult: ${pass} passed, ${fail} failed`);
    await prisma.$disconnect();
    process.exit(fail ? 1 : 0);
  });
