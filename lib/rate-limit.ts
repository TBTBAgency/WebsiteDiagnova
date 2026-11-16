import { db } from "@/lib/db";

/**
 * Pembatasan laju berbasis jejak `audit_logs`.
 * Tidak membutuhkan store tambahan (Redis dsb.) dan konsisten lintas instance karena
 * sumbernya database yang sama. Cocok untuk volume rendah (login admin, form permohonan demo).
 */
export const LOGIN_LIMITS = {
  windowMs: 15 * 60 * 1000,
  maxFailuresPerAccount: 5,
  maxFailuresPerIp: 20,
} as const;

export const LEAD_FORM_LIMITS = {
  windowMs: 60 * 60 * 1000,
  maxPerIp: 5,
} as const;

export async function countRecentAuditEvents(params: {
  actions: string[];
  windowMs: number;
  ipAddress?: string | null;
  recordId?: string | null;
}): Promise<number> {
  return db.auditLog.count({
    where: {
      action: { in: params.actions },
      createdAt: { gte: new Date(Date.now() - params.windowMs) },
      ...(params.ipAddress ? { ipAddress: params.ipAddress } : {}),
      ...(params.recordId ? { recordId: params.recordId } : {}),
    },
  });
}
