// Unit test: penyembunyian area admin (lib/admin-route.ts). Tidak menyentuh database.
//   npx tsx scripts/qa/admin-route.test.ts
import { getAdminLoginPath, getEffectiveAdminLoginPath, isAdminAreaPath, linksToAdminArea } from "../../lib/admin-route";
import { isSafeCmsUrl } from "../../lib/cms-layout";
import { isSafeContentUrl } from "../../lib/cms-page-content";

let pass = 0;
let fail = 0;
function check(name: string, cond: boolean, extra = "") {
  if (cond) {
    pass++;
    console.log(`  PASS  ${name}`);
  } else {
    fail++;
    console.log(`  FAIL  ${name} ${extra}`);
  }
}
const env = process.env as Record<string, string | undefined>;
function withEnv(vars: Record<string, string | undefined>, fn: () => void) {
  const saved: Record<string, string | undefined> = {};
  for (const k of Object.keys(vars)) {
    saved[k] = env[k];
    if (vars[k] === undefined) delete env[k];
    else env[k] = vars[k];
  }
  try {
    fn();
  } finally {
    for (const k of Object.keys(saved)) {
      if (saved[k] === undefined) delete env[k];
      else env[k] = saved[k];
    }
  }
}

console.log("== ADMIN_LOGIN_PATH validation");
for (const [value, expected] of [
  ["/masuk-7f3k9q2x", "/masuk-7f3k9q2x"],
  ["  /masuk-7f3k9q2x  ", "/masuk-7f3k9q2x"],
  ["", null],
  ["/short", null], // < 8 karakter
  ["/admin", null], // reserved
  ["/request-demo", null], // reserved (rute publik)
  ["/a/b-c-d-e-f-g", null], // lebih dari satu segmen
  ["masuk-7f3k9q2x", null], // tanpa garis miring awal
  ["/masuk 7f3k9q2x", null], // spasi
  ["/" + "x".repeat(65), null], // > 64 karakter
] as const) {
  withEnv({ ADMIN_LOGIN_PATH: value }, () => {
    const got = getAdminLoginPath();
    check(`ADMIN_LOGIN_PATH=${JSON.stringify(value)} -> ${expected}`, got === expected, `got ${got}`);
  });
}

console.log("== Effective login path (fail-closed in production)");
withEnv({ ADMIN_LOGIN_PATH: undefined, NODE_ENV: "production" }, () =>
  check("production without env -> null (no admin login)", getEffectiveAdminLoginPath() === null)
);
withEnv({ ADMIN_LOGIN_PATH: "/admin", NODE_ENV: "production" }, () =>
  check("production with invalid env -> null", getEffectiveAdminLoginPath() === null)
);
withEnv({ ADMIN_LOGIN_PATH: undefined, NODE_ENV: "development" }, () =>
  check("development without env -> /admin/login", getEffectiveAdminLoginPath() === "/admin/login")
);
withEnv({ ADMIN_LOGIN_PATH: "/masuk-7f3k9q2x", NODE_ENV: "production" }, () =>
  check("production with env -> secret path", getEffectiveAdminLoginPath() === "/masuk-7f3k9q2x")
);

console.log("== Admin area paths");
check("/admin and /admin/* are admin area", ["/admin", "/admin/", "/admin/login", "/admin/leads/1"].every(isAdminAreaPath));
check("/administrator, /admins, /platform are not", !["/administrator", "/admins", "/platform", "/"].some(isAdminAreaPath));

console.log("== CMS links to the admin area");
withEnv({ ADMIN_LOGIN_PATH: "/masuk-7f3k9q2x" }, () => {
  const blocked = ["/admin", "/admin/", "/admin/login", "/ADMIN/Dashboard", "/admin?from=x", "/admin#top", "https://diagnova.id/admin/login", "HTTP://example.com/Admin", "/masuk-7f3k9q2x", "/MASUK-7f3k9q2x?x=1"];
  for (const url of blocked) {
    check(`blocked: ${url}`, linksToAdminArea(url) && !isSafeCmsUrl(url) && !isSafeContentUrl(url));
  }
  const allowed = ["", "/", "/platform#workflow", "/administrator-guide", "#admin", "https://diagnova.id/platform", "/request-demo", "/masuk-7f3k9q2x-lain"];
  for (const url of allowed) {
    check(`allowed: ${JSON.stringify(url)}`, !linksToAdminArea(url) && isSafeCmsUrl(url) && isSafeContentUrl(url));
  }
  check("existing rules kept: javascript: and //host rejected", !isSafeCmsUrl("javascript:alert(1)") && !isSafeCmsUrl("//evil.example") && !isSafeContentUrl("//evil.example"));
});

console.log(`\nResult: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
