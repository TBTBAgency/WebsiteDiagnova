// LIS API access-control integration tests.
//
// Verifies every /api/lis/* endpoint and HTTP method for: no session, USER session,
// forged ADMIN JWT for a USER account, deactivated admin, and a real ADMIN.
// LIS DATA IS NEVER MODIFIED: admin calls are reads, or writes that must fail
// validation / uniqueness before anything is stored. Patient/order/specimen counts and
// specimen statuses are compared before and after the run.
//
// Requirements: dev or production server running and a LOCAL development database.
//   node --env-file=.env scripts/qa/lis.test.mjs
import { SignJWT } from "jose";
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

async function forgeSession(payload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(new TextEncoder().encode(process.env.AUTH_SECRET));
  return `diagnova_session=${token}`;
}

async function login(email, password, ip) {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify({ email, password }),
  });
  return (res.headers.get("set-cookie") || "").split(";")[0];
}

async function call(method, path, cookie, body) {
  const headers = {};
  if (cookie) headers.cookie = cookie;
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : typeof body === "string" ? body : JSON.stringify(body),
    redirect: "manual",
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    /* non-JSON (e.g. 405) */
  }
  return { status: res.status, text, json };
}

async function snapshot() {
  const [patients, orders, items, specimens, specimenStatuses] = await Promise.all([
    prisma.patient.count(),
    prisma.labOrder.count(),
    prisma.labOrderItem.count(),
    prisma.specimen.count(),
    prisma.specimen.findMany({ select: { id: true, status: true, receivedAt: true, rejectedAt: true }, orderBy: { id: "asc" } }),
  ]);
  return JSON.stringify({ patients, orders, items, specimens, specimenStatuses });
}

let qaUserId = null;

async function main() {
  const before = await snapshot();

  // Reference data (read-only)
  const anyOrder = await prisma.labOrder.findFirst({ select: { id: true } });
  const anySpecimen = await prisma.specimen.findFirst({ select: { barcodeNumber: true } });
  const anyPatient = await prisma.patient.findFirst({ select: { id: true, mrn: true, nationalId: true, name: true, phone: true } });
  if (!anyOrder || !anySpecimen || !anyPatient) throw new Error("Seed LIS data missing (run prisma/seed.ts first)");

  const PII = [anyPatient.nationalId, anyPatient.name, anyPatient.phone].filter(Boolean);
  const leaksPii = (text) => PII.some((v) => text.includes(v));

  const endpoints = [
    { method: "GET", path: "/api/lis/catalog" },
    { method: "GET", path: "/api/lis/physicians" },
    { method: "GET", path: "/api/lis/patients" },
    { method: "GET", path: `/api/lis/patients?search=${encodeURIComponent(anyPatient.mrn)}` },
    { method: "POST", path: "/api/lis/patients", body: { mrn: `QA-${RUN}`, name: "QA Should Not Exist", birthDate: "1990-01-01", sex: "male" } },
    { method: "GET", path: "/api/lis/orders" },
    { method: "POST", path: "/api/lis/orders", body: { patientId: anyPatient.id, testCatalogCodes: ["HEM-001"] } },
    { method: "GET", path: `/api/lis/orders/${anyOrder.id}` },
    { method: "POST", path: `/api/lis/specimens/${anySpecimen.barcodeNumber}/receive`, body: {} },
    { method: "POST", path: `/api/lis/specimens/${anySpecimen.barcodeNumber}/reject`, body: { reason: "QA unauthorized attempt" } },
  ];

  console.log("== 1. No session -> 401, no data");
  for (const e of endpoints) {
    const r = await call(e.method, e.path, null, e.body);
    check(`anon ${e.method} ${e.path} -> 401`, r.status === 401, `got ${r.status}`);
    check(`anon ${e.method} ${e.path} returns no data / PII`, !r.json?.data && !leaksPii(r.text));
  }

  console.log("== 2. USER session (demo client) -> 403, no data");
  const userRole = await prisma.role.findFirst({ where: { name: "USER" } });
  const qaUser = await prisma.user.create({
    data: { name: "QA LIS User", email: `qa-lis-${RUN}@example.test`, roleId: userRole.id, status: 1 },
  });
  qaUserId = qaUser.id;
  const userCookie = await forgeSession({ userId: qaUser.id, name: qaUser.name, email: qaUser.email, role: "USER" });
  for (const e of endpoints) {
    const r = await call(e.method, e.path, userCookie, e.body);
    check(`USER ${e.method} ${e.path} -> 403`, r.status === 403, `got ${r.status}`);
    check(`USER ${e.method} ${e.path} returns no data / PII`, !r.json?.data && !leaksPii(r.text));
  }

  console.log("== 3. Forged JWT claiming ADMIN for a USER account -> 403 (handler re-checks DB)");
  const forged = await forgeSession({ userId: qaUser.id, name: qaUser.name, email: qaUser.email, role: "ADMIN" });
  for (const e of endpoints) {
    const r = await call(e.method, e.path, forged, e.body);
    check(`forged-admin ${e.method} ${e.path} -> 403`, r.status === 403, `got ${r.status}`);
  }

  console.log("== 4. Deactivated admin with a still-valid JWT -> 403");
  const sales = await login("sales@diagnova.id", process.env.SEED_SALES_PASSWORD || "Sales2026!", `10.33.${RUN.length}.2`);
  check("sales admin login", sales.startsWith("diagnova_session="));
  await prisma.user.update({ where: { email: "sales@diagnova.id" }, data: { status: 0 } });
  try {
    for (const e of endpoints.filter((x) => x.method === "GET")) {
      const r = await call(e.method, e.path, sales, e.body);
      check(`deactivated-admin ${e.method} ${e.path} -> 403`, r.status === 403, `got ${r.status}`);
    }
  } finally {
    await prisma.user.update({ where: { email: "sales@diagnova.id" }, data: { status: 1 } });
  }

  console.log("== 5. Unsupported HTTP methods");
  const paths = [
    "/api/lis/catalog",
    "/api/lis/physicians",
    "/api/lis/patients",
    "/api/lis/orders",
    `/api/lis/orders/${anyOrder.id}`,
    `/api/lis/specimens/${anySpecimen.barcodeNumber}/receive`,
    `/api/lis/specimens/${anySpecimen.barcodeNumber}/reject`,
  ];
  const admin = await login("admin@diagnova.id", process.env.SEED_ADMIN_PASSWORD || "Diagnova2026!", `10.33.${RUN.length}.1`);
  check("admin login", admin.startsWith("diagnova_session="));
  for (const p of paths) {
    for (const m of ["PUT", "PATCH", "DELETE"]) {
      const anon = await call(m, p, null);
      check(`anon ${m} ${p} -> 401`, anon.status === 401, `got ${anon.status}`);
      const adm = await call(m, p, admin);
      check(`admin ${m} ${p} -> 405`, adm.status === 405, `got ${adm.status}`);
    }
  }
  const nested = await call("GET", "/api/lis/does-not-exist/x", null);
  check("anon unknown nested /api/lis/* -> 401", nested.status === 401, `got ${nested.status}`);

  console.log("== 6. ADMIN can use LIS (read-only)");
  for (const e of endpoints.filter((x) => x.method === "GET")) {
    const r = await call(e.method, e.path, admin);
    check(`admin ${e.method} ${e.path} -> 200`, r.status === 200 && r.json?.success === true, `got ${r.status}`);
  }

  console.log("== 7. Admin error responses do not leak patient data (no writes happen)");
  const dup = await call("POST", "/api/lis/patients", admin, {
    mrn: anyPatient.mrn,
    name: "QA Duplicate",
    birthDate: "1990-01-01",
    sex: "male",
  });
  check("duplicate MRN -> 409", dup.status === 409, `got ${dup.status}`);
  check("duplicate MRN response has no PII", !leaksPii(dup.text));
  const badEnum = await call("POST", "/api/lis/patients", admin, {
    mrn: `QA-${RUN}-X`,
    name: "QA Invalid",
    birthDate: "1990-01-01",
    sex: "not-a-sex",
    nationalId: "9999000011112222",
  });
  check("invalid patient payload -> error status", badEnum.status >= 400, `got ${badEnum.status}`);
  check("invalid payload error hides Prisma internals & input", !/prisma|invalid `|9999000011112222/i.test(badEnum.text), badEnum.text.slice(0, 200));
  const badJson = await call("POST", "/api/lis/orders", admin, "{not json");
  check("malformed JSON -> 400", badJson.status === 400, `got ${badJson.status}`);
  const unknownSpecimen = await call("POST", `/api/lis/specimens/QA-NOPE-${RUN}/receive`, admin, {});
  check("unknown barcode -> 400 domain message", unknownSpecimen.status === 400 && /tidak ditemukan/.test(unknownSpecimen.json?.message || ""));
  const missingReason = await call("POST", `/api/lis/specimens/${anySpecimen.barcodeNumber}/reject`, admin, { reason: "  " });
  check("reject without reason -> 400 (no write)", missingReason.status === 400);
  const badOrder = await call("POST", "/api/lis/orders", admin, { patientId: anyPatient.id, testCatalogCodes: [] });
  check("order without tests -> 400 (no write)", badOrder.status === 400);

  console.log("== 8. LIS data unchanged");
  const after = await snapshot();
  check("patient/order/item/specimen counts and specimen statuses unchanged", before === after);
  check("no QA patient was created", (await prisma.patient.count({ where: { mrn: { startsWith: `QA-${RUN}` } } })) === 0);
}

main()
  .catch((e) => {
    console.error(e);
    fail++;
  })
  .finally(async () => {
    if (qaUserId) {
      await prisma.auditLog.deleteMany({ where: { userId: qaUserId } });
      await prisma.user.delete({ where: { id: qaUserId } }).catch(() => {});
    }
    console.log(`\nResult: ${pass} passed, ${fail} failed`);
    await prisma.$disconnect();
    process.exit(fail ? 1 : 0);
  });
