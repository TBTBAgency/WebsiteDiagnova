import { db } from "@/lib/db";
import { AuditLogRecord } from "@/types";
import { Prisma } from "@prisma/client";

export interface CreateAuditLogParams {
  userId?: string | null;
  action: string;
  entity: string;
  recordId?: string | null;
  oldValue?: Record<string, unknown> | null;
  newValue?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

/**
 * Menyimpan jejak audit sistem ke database (append-only)
 */
export async function recordAuditLog(params: CreateAuditLogParams): Promise<void> {
  try {
    await db.auditLog.create({
      data: {
        userId: params.userId ?? null,
        action: params.action,
        entity: params.entity,
        recordId: params.recordId ?? null,
        oldValue: params.oldValue ? (params.oldValue as Prisma.InputJsonValue) : Prisma.JsonNull,
        newValue: params.newValue ? (params.newValue as Prisma.InputJsonValue) : Prisma.JsonNull,
        ipAddress: params.ipAddress ?? null,
        userAgent: params.userAgent ? params.userAgent.substring(0, 255) : null,
      },
    });
  } catch (error) {
    // Audit log failure must not crash the primary operational flow, but must be logged
    console.error("Failed to record audit log:", error);
  }
}

/**
 * Mengambil riwayat audit log dengan pagination
 */
export async function getAuditLogs(options?: {
  entity?: string;
  recordId?: string;
  userId?: string;
  limit?: number;
}): Promise<AuditLogRecord[]> {
  const limit = options?.limit ?? 50;

  const logs = await db.auditLog.findMany({
    where: {
      ...(options?.entity ? { entity: options.entity } : {}),
      ...(options?.recordId ? { recordId: options.recordId } : {}),
      ...(options?.userId ? { userId: options.userId } : {}),
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return logs.map((log) => ({
    id: log.id,
    userId: log.userId,
    userName: log.user?.name ?? null,
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
