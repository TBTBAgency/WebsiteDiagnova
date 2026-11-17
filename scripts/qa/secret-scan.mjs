// Secret / sensitive-data scanner for files that would be published.
//
// Scans (1) every file in the Git index (the tree that will be pushed) and
// (2) every blob a push of the current branch would upload (objects not on any remote).
// Matched values are masked in the output. Exit code 1 when a HIGH finding exists.
//   node scripts/qa/secret-scan.mjs
import { execFileSync } from "child_process";

const git = (...args) => execFileSync("git", args, { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 });
const gitBuf = (...args) => execFileSync("git", args, { maxBuffer: 256 * 1024 * 1024 });

const RULES = [
  { id: "private-key", sev: "HIGH", re: /-----BEGIN (?:RSA |EC |OPENSSH |DSA |PGP )?PRIVATE KEY-----/ },
  { id: "aws-access-key", sev: "HIGH", re: /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/ },
  { id: "github-token", sev: "HIGH", re: /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{36}\b|\bgithub_pat_[A-Za-z0-9_]{50,}\b/ },
  { id: "slack-token", sev: "HIGH", re: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/ },
  { id: "google-api-key", sev: "HIGH", re: /\bAIza[0-9A-Za-z_-]{35}\b/ },
  { id: "stripe-live-key", sev: "HIGH", re: /\b[sr]k_live_[0-9a-zA-Z]{20,}\b/ },
  { id: "resend-api-key", sev: "HIGH", re: /\bre_[A-Za-z0-9]{8,}_[A-Za-z0-9]{16,}\b/ },
  { id: "jwt", sev: "HIGH", re: /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/ },
  { id: "bcrypt-hash", sev: "HIGH", re: /\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}/ },
  { id: "sql-dump-copy-users", sev: "HIGH", re: /^COPY public\.(users|patients|leads) /m },
  {
    id: "db-url-with-password",
    sev: "MEDIUM",
    re: /\b(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?):\/\/[^:\s"'/]+:([^@\s"']+)@/,
    ignore: (m) => /YOUR_PASSWORD|\$\{|<password>|password@/i.test(m),
  },
  {
    id: "hardcoded-secret-assignment",
    sev: "MEDIUM",
    re: /\b(?:AUTH_SECRET|JWT_SECRET|SECRET_KEY|API_KEY|SMTP_PASS|RESEND_API_KEY)\s*[=:]\s*["']([^"'\s]{8,})["']/,
    ignore: (m) => /re_123456789|secret_password|change-this|example/i.test(m),
  },
  {
    id: "hardcoded-password-literal",
    sev: "MEDIUM",
    re: /\b(?:password|passwd|pwd)\s*[:=]\s*["']([^"'\s]{6,})["']/i,
    ignore: (m) => /process\.env|placeholder|\*\*\*|password123|example|wrong-password|QaUser/i.test(m),
  },
  { id: "nik-like-16-digit", sev: "MEDIUM", re: /(?<![\d.])(?:1[1-9]|[2-9]\d)\d{14}(?![\d.])/ },
];

const SKIP_PATH = /(^|\/)(package-lock\.json|.*\.(png|jpe?g|webp|gif|ico|svg|woff2?|ttf|otf|mp4|pdf))$/i;

function mask(s) {
  if (s.length <= 6) return "***";
  return `${s.slice(0, 3)}***${s.slice(-2)} (len ${s.length})`;
}

function scanText(label, text, findings) {
  const lines = text.split(/\r?\n/);
  lines.forEach((line, i) => {
    for (const rule of RULES) {
      const m = line.match(rule.re);
      if (!m) continue;
      if (rule.ignore && rule.ignore(m[0])) continue;
      findings.push({ sev: rule.sev, rule: rule.id, where: `${label}:${i + 1}`, value: mask(m[1] || m[0]) });
    }
  });
}

const findings = [];

// (1) Published tree: every file in the index
const files = git("ls-files", "-z").split("\0").filter(Boolean);
for (const f of files) {
  if (SKIP_PATH.test(f)) continue;
  let buf;
  try {
    buf = gitBuf("show", `:${f}`);
  } catch {
    continue;
  }
  if (buf.includes(0)) continue; // binary
  scanText(f, buf.toString("utf8"), findings);
}

// (2) New blobs a push would upload (not reachable from any remote ref)
const newObjects = git("rev-list", "--objects", "HEAD", "--not", "--remotes")
  .split("\n")
  .filter(Boolean)
  .map((l) => {
    const [sha, ...rest] = l.split(" ");
    return { sha, path: rest.join(" ") };
  })
  .filter((o) => o.path && !SKIP_PATH.test(o.path));
const newFindings = [];
for (const o of newObjects) {
  if (git("cat-file", "-t", o.sha).trim() !== "blob") continue;
  const buf = gitBuf("cat-file", "-p", o.sha);
  if (buf.includes(0)) continue;
  scanText(`${o.path}@${o.sha.slice(0, 7)}`, buf.toString("utf8"), newFindings);
}

const print = (title, list) => {
  console.log(`\n== ${title}: ${list.length} finding(s)`);
  for (const f of list) console.log(`  [${f.sev}] ${f.rule.padEnd(28)} ${f.where}  ${f.value}`);
};
print(`Published tree (${files.length} tracked files)`, findings);
print(`New blobs uploaded by a push (${newObjects.length} objects)`, newFindings);

const high = [...findings, ...newFindings].filter((f) => f.sev === "HIGH");
console.log(`\nHIGH findings: ${high.length}`);
process.exit(high.length ? 1 : 0);
