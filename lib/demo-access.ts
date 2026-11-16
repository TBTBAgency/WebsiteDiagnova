import { db } from "@/lib/db";
import { LEAD_STATUS } from "@/lib/demo-constants";

export * from "@/lib/demo-constants";

/**
 * Menandai lead "Jadwal Demo" yang masa demo akunnya sudah berakhir menjadi "Selesai".
 *
 * Idempoten: hanya lead berstatus Jadwal Demo yang diubah, sehingga menjalankan ulang
 * (cron berulang, request ganda) tidak mengubah apa pun dan tidak pernah menurunkan status.
 */
export async function expireDemoLeads(now: Date = new Date()): Promise<number> {
  const result = await db.lead.updateMany({
    where: {
      status: LEAD_STATUS.SCHEDULED,
      user: { is: { demoExpiresAt: { lte: now } } },
    },
    data: { status: LEAD_STATUS.COMPLETED },
  });
  return result.count;
}
