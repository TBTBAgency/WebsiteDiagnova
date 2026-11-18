// Unit test: aturan kelayakan Magic Link dari Manajemen Pengguna (tanpa database).
//   npx tsx scripts/qa/magic-link-eligibility.test.ts
import { evaluateMagicLinkEligibility } from "../../lib/magic-link-eligibility";

let pass = 0;
let fail = 0;
const check = (name: string, cond: boolean, extra = "") => {
  cond ? pass++ : fail++;
  console.log(`  ${cond ? "PASS" : "FAIL"}  ${name} ${cond ? "" : extra}`);
};
const now = new Date("2026-11-17T10:00:00Z");
const day = 86400000;
const lead = (approvalStatus: "PENDING" | "APPROVED" | "REJECTED", ageDays: number, id = `lead-${approvalStatus}-${ageDays}`) => ({
  id,
  approvalStatus,
  createdAt: new Date(now.getTime() - ageDays * day),
});
const base = { roleName: "USER", status: 1, demoExpiresAt: null as Date | null, leads: [lead("APPROVED", 1, "L1")] };
const code = (r: ReturnType<typeof evaluateMagicLinkEligibility>) => (r.eligible ? "ELIGIBLE" : r.code);

check("approved lead, active, demo not started -> eligible", code(evaluateMagicLinkEligibility(base, now)) === "ELIGIBLE");
const ok = evaluateMagicLinkEligibility(base, now);
check("eligible result points to the approved lead", ok.eligible && ok.leadId === "L1");
check("active demo still running -> eligible", code(evaluateMagicLinkEligibility({ ...base, demoExpiresAt: new Date(now.getTime() + day) }, now)) === "ELIGIBLE");
check("manual USER without demo request -> NO_DEMO_REQUEST", code(evaluateMagicLinkEligibility({ ...base, leads: [] }, now)) === "NO_DEMO_REQUEST");
check("ADMIN account -> NOT_CLIENT_ACCOUNT", code(evaluateMagicLinkEligibility({ ...base, roleName: "ADMIN" }, now)) === "NOT_CLIENT_ACCOUNT");
check("missing role -> NOT_CLIENT_ACCOUNT", code(evaluateMagicLinkEligibility({ ...base, roleName: null }, now)) === "NOT_CLIENT_ACCOUNT");
check("inactive account -> ACCOUNT_INACTIVE", code(evaluateMagicLinkEligibility({ ...base, status: 0 }, now)) === "ACCOUNT_INACTIVE");
check("only pending request -> REQUEST_PENDING", code(evaluateMagicLinkEligibility({ ...base, leads: [lead("PENDING", 1)] }, now)) === "REQUEST_PENDING");
check("only rejected request -> REQUEST_REJECTED", code(evaluateMagicLinkEligibility({ ...base, leads: [lead("REJECTED", 1)] }, now)) === "REQUEST_REJECTED");
check(
  "rejected newer + approved older -> eligible on the approved one",
  (() => {
    const r = evaluateMagicLinkEligibility({ ...base, leads: [lead("REJECTED", 1), lead("APPROVED", 5, "OLD")] }, now);
    return r.eligible && r.leadId === "OLD";
  })()
);
check("demo access expired -> DEMO_EXPIRED", code(evaluateMagicLinkEligibility({ ...base, demoExpiresAt: new Date(now.getTime() - 1) }, now)) === "DEMO_EXPIRED");
check("expiry exactly now -> DEMO_EXPIRED", code(evaluateMagicLinkEligibility({ ...base, demoExpiresAt: now }, now)) === "DEMO_EXPIRED");
check("inactive check precedes missing request", code(evaluateMagicLinkEligibility({ ...base, status: 0, leads: [] }, now)) === "ACCOUNT_INACTIVE");
check("every ineligible result has a human-readable reason", [
  evaluateMagicLinkEligibility({ ...base, leads: [] }, now),
  evaluateMagicLinkEligibility({ ...base, status: 0 }, now),
  evaluateMagicLinkEligibility({ ...base, demoExpiresAt: new Date(0) }, now),
].every((r) => !r.eligible && r.reason.length > 20));

console.log(`\nResult: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
