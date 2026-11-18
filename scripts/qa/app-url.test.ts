// Unit test: resolusi base URL untuk Magic Link (lib/app-url.ts). Tidak menyentuh database.
//   npx tsx scripts/qa/app-url.test.ts
import { AppUrlConfigError, buildMagicLinkUrl, getAppBaseUrl } from "../../lib/app-url";

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
const env = (vars: Record<string, string>) => vars as unknown as NodeJS.ProcessEnv;
function resolves(vars: Record<string, string>): string | Error {
  try {
    return getAppBaseUrl(env(vars));
  } catch (e) {
    return e as Error;
  }
}
const VERCEL_DOMAIN = "https://website-diagnova.vercel.app";
const TOKEN = "a".repeat(64);

console.log("== Development");
check("dev without config -> localhost", resolves({ NODE_ENV: "development" }) === "http://localhost:3000");
check("dev APP_URL wins over NEXT_PUBLIC_APP_URL", resolves({ NODE_ENV: "development", APP_URL: VERCEL_DOMAIN, NEXT_PUBLIC_APP_URL: "http://localhost:3000" }) === VERCEL_DOMAIN);
check("dev legacy NEXT_PUBLIC_APP_URL still honoured", resolves({ NODE_ENV: "development", NEXT_PUBLIC_APP_URL: "http://localhost:3001" }) === "http://localhost:3001");

console.log("== Production");
check("prod APP_URL=vercel domain", resolves({ NODE_ENV: "production", APP_URL: VERCEL_DOMAIN }) === VERCEL_DOMAIN);
check("prod trailing slash / path stripped to origin", resolves({ NODE_ENV: "production", APP_URL: `${VERCEL_DOMAIN}/some/path/` }) === VERCEL_DOMAIN);
check("prod host without scheme -> https", resolves({ NODE_ENV: "production", APP_URL: "website-diagnova.vercel.app" }) === VERCEL_DOMAIN);
const noConfig = resolves({ NODE_ENV: "production" });
check("prod without any URL -> AppUrlConfigError (no localhost fallback)", noConfig instanceof AppUrlConfigError);
for (const local of ["http://localhost:3000", "http://127.0.0.1:3000", "http://0.0.0.0:3000", "http://[::1]:3000"]) {
  check(`prod APP_URL=${local} rejected`, resolves({ NODE_ENV: "production", APP_URL: local }) instanceof AppUrlConfigError);
}
check("prod legacy NEXT_PUBLIC_APP_URL=localhost rejected", resolves({ NODE_ENV: "production", NEXT_PUBLIC_APP_URL: "http://localhost:3000" }) instanceof AppUrlConfigError);
check("prod plain http (non-local) rejected", resolves({ NODE_ENV: "production", APP_URL: "http://website-diagnova.vercel.app" }) instanceof AppUrlConfigError);
check("prod invalid URL rejected", resolves({ NODE_ENV: "production", APP_URL: "https://exa mple" }) instanceof AppUrlConfigError);
check("prod ftp scheme rejected", resolves({ NODE_ENV: "production", APP_URL: "ftp://example.com" }) instanceof AppUrlConfigError);
check(
  "local prod QA opt-in ALLOW_LOCALHOST_APP_URL=true allows localhost (not on Vercel)",
  resolves({ NODE_ENV: "production", APP_URL: "http://localhost:3000", ALLOW_LOCALHOST_APP_URL: "true" }) === "http://localhost:3000"
);

console.log("== Vercel");
check(
  "Vercel production without APP_URL -> VERCEL_PROJECT_PRODUCTION_URL",
  resolves({ NODE_ENV: "production", VERCEL: "1", VERCEL_ENV: "production", VERCEL_PROJECT_PRODUCTION_URL: "website-diagnova.vercel.app", VERCEL_URL: "website-diagnova-abc123.vercel.app" }) === VERCEL_DOMAIN
);
check(
  "Vercel preview without APP_URL -> VERCEL_URL of the deployment",
  resolves({ NODE_ENV: "production", VERCEL: "1", VERCEL_ENV: "preview", VERCEL_URL: "website-diagnova-abc123.vercel.app" }) === "https://website-diagnova-abc123.vercel.app"
);
check(
  "Vercel ignores ALLOW_LOCALHOST_APP_URL (localhost always rejected)",
  resolves({ NODE_ENV: "production", VERCEL: "1", APP_URL: "http://localhost:3000", ALLOW_LOCALHOST_APP_URL: "true" }) instanceof AppUrlConfigError
);
check("Vercel with no URL at all -> error", resolves({ NODE_ENV: "production", VERCEL: "1" }) instanceof AppUrlConfigError);

console.log("== Magic Link URL");
const link = buildMagicLinkUrl(TOKEN, env({ NODE_ENV: "production", APP_URL: `${VERCEL_DOMAIN}/` }));
check("link = <APP_URL>/auth/verify-magic-link?token=<token>", link === `${VERCEL_DOMAIN}/auth/verify-magic-link?token=${TOKEN}`, link);
let threw = false;
try {
  buildMagicLinkUrl(TOKEN, env({ NODE_ENV: "production", APP_URL: "http://localhost:3000" }));
} catch (e) {
  threw = e instanceof AppUrlConfigError;
}
check("production link never built for localhost", threw);
check("error message does not include the token", !String(noConfig instanceof Error ? noConfig.message : "").includes(TOKEN));

console.log(`\nResult: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
