import { db } from "@/lib/db";
import { AuditLogRecord } from "@/types";
import { Prisma } from "@prisma/client";

/** Snapshot pelaku disimpan bersama log agar identitas tetap terbaca walau akun berubah/dihapus. */
export interface AuditActor {
  type: "ADMIN" | "USER" | "SYSTEM" | "ANONYMOUS";
  userId?: string | null;
  email?: string | null;
  role?: string | null;
}

export interface CreateAuditLogParams {
  /** @deprecated pakai `actor.userId`; tetap didukung untuk pemanggil lama */
  userId?: string | null;
  actor?: AuditActor;
  action: string;
  entity: string;
  recordId?: string | null;
  oldValue?: Record<string, unknown> | null;
  newValue?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

type AuditClient = Prisma.TransactionClient | typeof db;

function toData(params: CreateAuditLogParams): Prisma.AuditLogCreateInput {
  const userId = params.actor?.userId ?? params.userId ?? null;
  return {
    userId,
    actorType: params.actor?.type ?? (userId ? null : "ANONYMOUS"),
    actorEmail: params.actor?.email ?? null,
    actorRole: params.actor?.role ?? null,
    action: params.action,
    entity: params.entity,
    recordId: params.recordId ?? null,
    oldValue: params.oldValue ? (params.oldValue as Prisma.InputJsonValue) : Prisma.JsonNull,
    newValue: params.newValue ? (params.newValue as Prisma.InputJsonValue) : Prisma.JsonNull,
    ipAddress: params.ipAddress ? params.ipAddress.substring(0, 50) : null,
    userAgent: params.userAgent ? params.userAgent.substring(0, 255) : null,
  };
}

/**
 * Menulis jejak audit di luar transaksi bisnis (mis. login gagal).
 * Kegagalan audit dicatat ke log server tetapi tidak menggagalkan alur utama.
 */
export async function recordAuditLog(params: CreateAuditLogParams): Promise<void> {
  try {
    await db.auditLog.create({ data: toData(params) });
  } catch (error) {
    console.error("Failed to record audit log:", error);
  }
}

/**
 * Menulis jejak audit DI DALAM transaksi yang sama dengan perubahan data.
 * Bila gagal, seluruh transaksi dibatalkan (perubahan & audit tidak pernah terpisah).
 */
export async function recordAuditLogTx(tx: AuditClient, params: CreateAuditLogParams): Promise<void> {
  await tx.auditLog.create({ data: toData(params) });
}

/**
 * Mengambil riwayat audit log (terbaru dulu)
 */
export async function getAuditLogs(options?: {
  entity?: string;
  recordId?: string;
  userId?: string;
  action?: string;
  limit?: number;
}): Promise<AuditLogRecord[]> {
  const limit = Math.min(Math.max(options?.limit ?? 50, 1), 500);

  const logs = await db.auditLog.findMany({
    where: {
      ...(options?.entity ? { entity: options.entity } : {}),
      ...(options?.recordId ? { recordId: options.recordId } : {}),
      ...(options?.userId ? { userId: options.userId } : {}),
      ...(options?.action ? { action: options.action } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return logs.map((log) => ({
    id: log.id,
    userId: log.userId,
    userName: log.actorEmail,
    actorType: log.actorType,
    actorEmail: log.actorEmail,
    actorRole: log.actorRole,
    action: log.action,
    entity: log.entity,
    recordId: log.recordId,
    oldValue: (log.oldValue as Record<string, unknown>) ?? null,
    newValue: (log.newValue as Record<string, unknown>) ?? null,
    ipAddress: log.ipAddress,
    userAgent: log.userAgent,
    createdAt: log.createdAt.toISOString(),
  }));
}
