// T16: penandatanganan sesi gagal -> seluruh transaksi login dibatalkan (GW-04).
// Dijalankan langsung terhadap modul server (tanpa HTTP) memakai DB test.
import { test, after } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { db } from "../../lib/db";
import { consumeMagicLink, hashMagicToken } from "../../lib/magic-link";

const dbName = new URL(process.env.DATABASE_URL || "").pathname.slice(1);
if (!/test/i.test(dbName)) throw new Error(`Menolak berjalan pada database "${dbName}"`);

const ids: { lead?: string; user?: string } = {};
after(async () => {
  if (ids.lead) {
    await db.demoMagicLink.deleteMany({ where: { demoAccess: { leadId: ids.lead } } });
    await db.demoAccess.deleteMany({ where: { leadId: ids.lead } });
    await db.lead.delete({ where: { id: ids.lead } });
  }
  if (ids.user) await db.user.delete({ where: { id: ids.user } });
  await db.$disconnect();
});

test("T16 kegagalan tanda tangan JWT -> status tetap Dihubungi, token belum terpakai, periode belum aktif, tanpa audit", async () => {
  const role = await db.role.findUniqueOrThrow({ where: { code: "USER" } });
  const email = `rollback-${crypto.randomBytes(4).toString("hex")}@example.com`;
  const user = await db.user.create({ data: { name: "Rollback", email, roleId: role.id } });
  ids.user = user.id;
  const lead = await db.lead.create({
    data: { name: "Rollback", institution: "RS", jobTitle: "Lab", email, phone: "0812345678", userId: user.id },
  });
  ids.lead = lead.id;
  const access = await db.demoAccess.create({ data: { leadId: lead.id, userId: user.id, durationDays: 7 } });
  const token = crypto.randomBytes(32).toString("hex");
  await db.demoMagicLink.create({
    data: { tokenHash: hashMagicToken(token), email, demoAccessId: access.id, expiresAt: new Date(Date.now() + 3600_000) },
  });

  await assert.rejects(
    consumeMagicLink(token, {}, async () => {
      throw new Error("simulated signing failure");
    }),
    /simulated signing failure/
  );

  const [leadAfter, link, accessAfter, audits] = await Promise.all([
    db.lead.findUniqueOrThrow({ where: { id: lead.id } }),
    db.demoMagicLink.findUniqueOrThrow({ where: { tokenHash: hashMagicToken(token) } }),
    db.demoAccess.findUniqueOrThrow({ where: { id: access.id } }),
    db.auditLog.count({ where: { recordId: { in: [lead.id, access.id] } } }),
  ]);
  assert.equal(leadAfter.status, "CONTACTED");
  assert.equal(leadAfter.demoStartedAt, null);
  assert.equal(link.usedAt, null);
  assert.equal(accessAfter.activatedAt, null);
  assert.equal(audits, 0);

  // Setelah penanda tangan normal, token yang sama tetap dapat dipakai
  const ok = await consumeMagicLink(token, {}, async () => "signed-token");
  assert.equal(ok.success, true);
  assert.equal((await db.lead.findUniqueOrThrow({ where: { id: lead.id } })).status, "SCHEDULED");
});
