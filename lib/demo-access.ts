import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

type Client = Prisma.TransactionClient | typeof db;

export interface AccessWindow {
  /** Periode yang sedang berjalan saat `now` */
  currentAccessId: string;
  /** Akhir cakupan akses berturut-turut (termasuk perpanjangan yang sudah terjadwal tepat setelahnya) */
  coverageEnd: Date;
}

/**
 * Menghitung jendela akses demo efektif seorang USER pada waktu `now`.
 * Hanya periode yang sudah diaktifkan dan tidak dicabut yang dihitung. Status periode tidak disimpan;
 * semuanya diturunkan dari timestamp sehingga tidak dibutuhkan job terjadwal (cron).
 */
export async function getUserAccessWindow(
  client: Client,
  userId: string,
  now: Date = new Date()
): Promise<AccessWindow | null> {
  const periods = await client.demoAccess.findMany({
    where: { userId, revokedAt: null, activatedAt: { not: null }, expiresAt: { gt: now } },
    orderBy: { activatedAt: "asc" },
    select: { id: true, activatedAt: true, expiresAt: true },
  });

  const current = periods.find((p) => p.activatedAt! <= now && p.expiresAt! > now);
  if (!current) return null;

  let coverageEnd = current.expiresAt!;
  for (const p of periods) {
    if (p.activatedAt! <= coverageEnd && p.expiresAt! > coverageEnd) coverageEnd = p.expiresAt!;
  }
  return { currentAccessId: current.id, coverageEnd };
}

/** Periode terakhir (tidak dicabut) milik sebuah lead, beserta tautan terbarunya. */
export async function getLatestOpenAccessForLead(client: Client, leadId: string) {
  return client.demoAccess.findFirst({
    where: { leadId, revokedAt: null },
    orderBy: { grantedAt: "desc" },
  });
}
