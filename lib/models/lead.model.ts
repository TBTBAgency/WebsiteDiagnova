import { db } from "@/lib/db";
import {
  DemoAccessRecord,
  DemoRequestInput,
  DemoRequestRecord,
  InstitutionType,
  LeadApprovalStatus,
  LeadFilterQuery,
  LeadStatus,
} from "@/types";
import { InstitutionType as PrismaInstitutionType, LeadStage, Prisma } from "@prisma/client";
import { issueMagicLink } from "@/lib/magic-link";
import { isUserRole, ROLE_DISPLAY_NAMES } from "@/lib/roles";
import {
  DEFAULT_DEMO_DURATION_DAYS,
  LEAD_STAGE_LABELS,
  getDemoAccessState,
  getMagicLinkState,
  isLeadStage,
  isValidDemoDuration,
} from "@/lib/demo-constants";
import { recordAuditLogTx, type AuditActor } from "@/lib/models/audit.model";
import { jakartaDayEnd, jakartaDayStart, jakartaMonthRange } from "@/lib/time";

/** Error bisnis yang pesannya aman ditampilkan ke admin. */
export class LeadWorkflowError extends Error {
  constructor(
    message: string,
    public readonly httpStatus: number = 409
  ) {
    super(message);
    this.name = "LeadWorkflowError";
  }
}

export type AdminActor = AuditActor & { userId: string };

export const institutionTypeToPrisma: Record<InstitutionType, PrismaInstitutionType> = {
  hospital: PrismaInstitutionType.HOSPITAL,
  "clinical-lab": PrismaInstitutionType.CLINICAL_LAB,
  "pathology-center": PrismaInstitutionType.PATHOLOGY_CENTER,
  "microbiology-center": PrismaInstitutionType.MICROBIOLOGY_CENTER,
  "blood-bank": PrismaInstitutionType.BLOOD_BANK,
  other: PrismaInstitutionType.OTHER,
};

export const prismaToInstitutionType: Record<PrismaInstitutionType, InstitutionType> = {
  [PrismaInstitutionType.HOSPITAL]: "hospital",
  [PrismaInstitutionType.CLINICAL_LAB]: "clinical-lab",
  [PrismaInstitutionType.PATHOLOGY_CENTER]: "pathology-center",
  [PrismaInstitutionType.MICROBIOLOGY_CENTER]: "microbiology-center",
  [PrismaInstitutionType.BLOOD_BANK]: "blood-bank",
  [PrismaInstitutionType.OTHER]: "other",
};

/** Satu peta label untuk seluruh tampilan (dashboard, Leads, filter, CSV). Tidak ada "Baru". */
export const STATUS_LABELS = LEAD_STAGE_LABELS;

const leadInclude = {
  user: { select: { id: true, name: true, email: true, status: true, createdAt: true } },
  demoCompletedBy: { select: { id: true, name: true, email: true } },
  demoAccesses: {
    orderBy: { grantedAt: "desc" as const },
    include: {
      grantedBy: { select: { id: true, name: true } },
      magicLinks: { orderBy: { createdAt: "desc" as const }, take: 1 },
    },
  },
} satisfies Prisma.LeadInclude;

type LeadWithRelations = Prisma.LeadGetPayload<{ include: typeof leadInclude }>;

function formatAccess(a: LeadWithRelations["demoAccesses"][number], now: Date): DemoAccessRecord {
  const link = a.magicLinks[0];
  return {
    id: a.id,
    durationDays: a.durationDays,
    grantedAt: a.grantedAt.toISOString(),
    grantedBy: a.grantedBy,
    activatedAt: a.activatedAt?.toISOString() ?? null,
    expiresAt: a.expiresAt?.toISOString() ?? null,
    revokedAt: a.revokedAt?.toISOString() ?? null,
    extendsAccessId: a.extendsAccessId,
    state: getDemoAccessState(a, now),
    latestLink: link
      ? {
          expiresAt: link.expiresAt.toISOString(),
          usedAt: link.usedAt?.toISOString() ?? null,
          revokedAt: link.revokedAt?.toISOString() ?? null,
          state: getMagicLinkState(link, now),
        }
      : null,
  };
}

function formatLeadRecord(record: LeadWithRelations): DemoRequestRecord {
  const now = new Date();
  const accesses = record.demoAccesses.map((a) => formatAccess(a, now));
  const current = accesses.find((a) => a.state !== "REVOKED") ?? null;
  const hasOpenAccess = accesses.some((a) => ["ACTIVE", "QUEUED", "PENDING_ACTIVATION"].includes(a.state));
  const latestLink = current?.latestLink ?? null;

  return {
    id: record.id,
    userId: record.userId,
    user: record.user
      ? {
          id: record.user.id,
          name: record.user.name,
          email: record.user.email,
          status: record.user.status,
          createdAt: record.user.createdAt.toISOString(),
        }
      : null,
    name: record.name,
    institution: record.institution,
    jobTitle: record.jobTitle,
    email: record.email,
    phone: record.phone,
    institutionType: prismaToInstitutionType[record.institutionType] ?? "other",
    notes: record.notes ?? undefined,
    status: record.status as LeadStatus,
    demoStartedAt: record.demoStartedAt?.toISOString() ?? null,
    demoCompletedAt: record.demoCompletedAt?.toISOString() ?? null,
    demoCompletedBy: record.demoCompletedBy,
    demoCompletionNote: record.demoCompletionNote,
    accesses,
    currentAccess: current,
    accessEnded: record.status === "SCHEDULED" && !hasOpenAccess && accesses.some((a) => a.state === "EXPIRED"),
    approvalStatus: record.approvalStatus as LeadApprovalStatus,
    approvedAt: record.approvedAt?.toISOString() ?? null,
    approvedBy: record.approvedBy ?? null,
    rejectionReason: record.rejectionReason ?? null,
    requestedDemoDate: record.requestedDemoDate?.toISOString() ?? record.demoDate?.toISOString() ?? null,
    confirmedDemoDate: record.confirmedDemoDate?.toISOString() ?? null,
    demoDate:
      record.confirmedDemoDate?.toISOString() ??
      record.requestedDemoDate?.toISOString() ??
      record.demoDate?.toISOString() ??
      null,
    demoDurationDays: current?.durationDays ?? record.demoDurationDays,
    voucherCode: record.voucherCode ?? null,
    voucherExpiry: current?.expiresAt ?? null,
    // Token mentah tidak disimpan (hanya hash): URL hanya dikembalikan sekali saat diterbitkan.
    magicLinkUrl: null,
    magicLinkExpiry: latestLink?.expiresAt ?? null,
    magicLinkStatus: latestLink?.state ?? null,
    createdAt: record.createdAt.toISOString(),
  };
}

async function lockLead(tx: Prisma.TransactionClient, leadId: string) {
  const locked = await tx.$queryRaw<{ id: string }[]>`SELECT id FROM leads WHERE id = ${leadId} FOR UPDATE`;
  if (locked.length === 0) throw new LeadWorkflowError("Permohonan demo tidak ditemukan.", 404);
  return tx.lead.findUniqueOrThrow({ where: { id: leadId } });
}

function openAccessWhere(now: Date): Prisma.DemoAccessWhereInput {
  return { revokedAt: null, OR: [{ activatedAt: null }, { expiresAt: { gt: now } }] };
}

function parseOptionalDate(value: string | null | undefined, field: string): Date | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  const d = new Date(value);
  if (isNaN(d.getTime())) throw new LeadWorkflowError(`Format ${field} tidak valid.`, 400);
  return d;
}

// ---------------------------------------------------------------------------
// Form publik
// ---------------------------------------------------------------------------

/**
 * Menyimpan permohonan dari form publik. Lead langsung berstatus **Dihubungi** (OD-03) dan
 * jejak audit `LEAD_CREATED` ditulis di transaksi yang sama.
 *
 * Lead TIDAK dikaitkan ke akun mana pun di sini: email form publik belum terverifikasi.
 * Relasi lead -> akun USER dibuat saat admin memberi akses demo.
 */
export async function createLead(
  input: DemoRequestInput,
  meta: { ipAddress?: string | null; userAgent?: string | null } = {}
): Promise<DemoRequestRecord> {
  const prismaInstitution = institutionTypeToPrisma[input.institutionType] ?? PrismaInstitutionType.HOSPITAL;
  const requestedDate = parseOptionalDate(input.requestedDemoDate ?? input.demoDate ?? null, "tanggal demo") ?? null;

  const record = await db.$transaction(async (tx) => {
    const created = await tx.lead.create({
      data: {
        name: input.name.trim(),
        institution: input.institution.trim(),
        jobTitle: input.jobTitle.trim(),
        email: input.email.toLowerCase().trim(),
        phone: input.phone.trim(),
        institutionType: prismaInstitution,
        notes: input.notes && input.notes.trim() !== "" ? input.notes.trim() : null,
        requestedDemoDate: requestedDate,
        status: LeadStage.CONTACTED,
      },
      include: leadInclude,
    });

    await recordAuditLogTx(tx, {
      actor: { type: "ANONYMOUS" },
      action: "LEAD_CREATED",
      entity: "leads",
      recordId: created.id,
      newValue: { status: "CONTACTED", institutionType: input.institutionType },
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    return created;
  });

  return formatLeadRecord(record);
}

// ---------------------------------------------------------------------------
// Query
// ---------------------------------------------------------------------------

function buildLeadWhere(query: LeadFilterQuery & { approvalStatus?: LeadApprovalStatus | "all" }): Prisma.LeadWhereInput {
  const where: Prisma.LeadWhereInput = {};

  if (query.status && query.status !== "all" && isLeadStage(query.status)) {
    where.status = query.status as LeadStage;
  }
  if (query.approvalStatus && query.approvalStatus !== "all") {
    where.approvalStatus = query.approvalStatus;
  }
  if (query.institutionType && query.institutionType !== "all" && institutionTypeToPrisma[query.institutionType]) {
    where.institutionType = institutionTypeToPrisma[query.institutionType];
  }

  // Filter tanggal = tanggal kalender WIB (bukan zona waktu proses Node)
  const start = query.startDate ? jakartaDayStart(query.startDate) : null;
  const end = query.endDate ? jakartaDayEnd(query.endDate) : null;
  if (start || end) {
    where.createdAt = { ...(start ? { gte: start } : {}), ...(end ? { lte: end } : {}) };
  }

  if (query.search && query.search.trim() !== "") {
    const search = query.search.trim();
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { institution: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
      { jobTitle: { contains: search, mode: "insensitive" } },
    ];
  }
  return where;
}

export async function getLeadsWithPagination(
  query: LeadFilterQuery & { approvalStatus?: LeadApprovalStatus | "all" } = {}
): Promise<{ leads: DemoRequestRecord[]; total: number; page: number; limit: number; totalPages: number }> {
  const page = Math.max(1, query.page ?? 1);
  const limit = Math.max(1, Math.min(100, query.limit ?? 10));
  const where = buildLeadWhere(query);

  const [records, total] = await Promise.all([
    db.lead.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * limit, take: limit, include: leadInclude }),
    db.lead.count({ where }),
  ]);

  return { leads: records.map(formatLeadRecord), total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
}

/** Seluruh lead sesuai filter (tanpa batas 100) — untuk ekspor CSV. */
export async function getLeadsForExport(
  query: LeadFilterQuery & { approvalStatus?: LeadApprovalStatus | "all" } = {}
): Promise<DemoRequestRecord[]> {
  const records = await db.lead.findMany({ where: buildLeadWhere(query), orderBy: { createdAt: "desc" }, include: leadInclude });
  return records.map(formatLeadRecord);
}

export async function getLeadById(id: string): Promise<DemoRequestRecord | null> {
  const record = await db.lead.findUnique({ where: { id }, include: leadInclude });
  return record ? formatLeadRecord(record) : null;
}

/**
 * Metrik tunggal untuk dashboard, kartu Leads, dan overview (satu sumber: leads.status).
 */
export async function getLeadMetrics(now: Date = new Date()): Promise<{
  total: number;
  contacted: number;
  scheduled: number;
  completed: number;
  upcomingThisMonth: number;
  awaitingCompletion: number;
}> {
  const { end } = jakartaMonthRange(now);
  const [counts, upcomingThisMonth, awaitingCompletion] = await Promise.all([
    db.lead.groupBy({ by: ["status"], _count: { _all: true } }),
    db.lead.count({
      where: { status: { in: ["CONTACTED", "SCHEDULED"] }, confirmedDemoDate: { gte: now, lt: end } },
    }),
    db.lead.count({ where: { status: "SCHEDULED", demoAccesses: { none: openAccessWhere(now) } } }),
  ]);

  const by = Object.fromEntries(counts.map((c) => [c.status, c._count._all])) as Partial<Record<LeadStage, number>>;
  const contacted = by.CONTACTED ?? 0;
  const scheduled = by.SCHEDULED ?? 0;
  const completed = by.COMPLETED ?? 0;
  return { total: contacted + scheduled + completed, contacted, scheduled, completed, upcomingThisMonth, awaitingCompletion };
}

// ---------------------------------------------------------------------------
// Aksi admin
// ---------------------------------------------------------------------------

/** Mengubah jadwal presentasi yang dikonfirmasi. Status Lead TIDAK dapat diubah lewat fungsi ini (OD-06). */
export async function updateLeadSchedule(
  leadId: string,
  input: { confirmedDemoDate: string | null },
  actor: AdminActor
): Promise<DemoRequestRecord> {
  const date = parseOptionalDate(input.confirmedDemoDate, "jadwal demo") ?? null;
  await db.$transaction(async (tx) => {
    const lead = await lockLead(tx, leadId);
    await tx.lead.update({ where: { id: leadId }, data: { confirmedDemoDate: date } });
    await recordAuditLogTx(tx, {
      actor,
      action: "LEAD_SCHEDULE_UPDATED",
      entity: "leads",
      recordId: leadId,
      oldValue: { confirmedDemoDate: lead.confirmedDemoDate?.toISOString() ?? null },
      newValue: { confirmedDemoDate: date?.toISOString() ?? null },
    });
  });
  return (await getLeadById(leadId))!;
}

/**
 * Memberi akses demo (menggantikan "approve"): membuat/menautkan akun USER, satu periode
 * `demo_accesses` baru, dan satu magic link. Status Lead TIDAK berubah.
 * URL mentah dikembalikan sekali ke admin dan tidak pernah disimpan.
 */
export async function grantDemoAccess(
  leadId: string,
  options: { durationDays?: number; confirmedDemoDate?: string | null },
  actor: AdminActor
): Promise<{ lead: DemoRequestRecord; magicLinkUrl: string; expiresAt: string }> {
  const durationDays = options.durationDays ?? DEFAULT_DEMO_DURATION_DAYS;
  if (!isValidDemoDuration(durationDays)) throw new LeadWorkflowError("Durasi demo tidak valid.", 400);
  const confirmedDate = parseOptionalDate(options.confirmedDemoDate, "jadwal demo");
  const now = new Date();

  const issued = await db.$transaction(async (tx) => {
    const lead = await lockLead(tx, leadId);
    if (lead.approvalStatus === "REJECTED") {
      throw new LeadWorkflowError("Permohonan ini sudah ditolak. Akses demo tidak dapat diberikan.");
    }
    if (lead.status === "COMPLETED") {
      throw new LeadWorkflowError("Demo untuk permohonan ini sudah dikonfirmasi selesai. Akses baru tidak dapat diberikan (OD-22).");
    }

    const leadOpen = await tx.demoAccess.findFirst({ where: { leadId, ...openAccessWhere(now) } });
    if (leadOpen) {
      throw new LeadWorkflowError(
        leadOpen.activatedAt
          ? "Akses demo untuk permohonan ini masih aktif. Gunakan Perpanjang Akses bila diperlukan."
          : "Akses demo sudah diberikan dan menunggu aktivasi. Gunakan Buat Tautan Baru untuk mengirim ulang."
      );
    }

    // Akun USER untuk email pemohon
    const email = lead.email.toLowerCase().trim();
    const existing = await tx.user.findUnique({ where: { email }, include: { role: true } });
    let userId: string;

    if (existing) {
      if (!isUserRole(existing.role?.code)) {
        throw new LeadWorkflowError("Email pemohon sudah terdaftar sebagai akun non-USER. Akses demo tidak dapat dibuat untuk email ini.");
      }
      if (existing.deletedAt) throw new LeadWorkflowError("Akun USER untuk email ini telah dihapus. Pulihkan akun terlebih dahulu.");
      if (existing.status !== "ACTIVE") throw new LeadWorkflowError("Akun USER untuk email ini sedang dinonaktifkan. Aktifkan akun terlebih dahulu.");
      await tx.$queryRaw`SELECT id FROM users WHERE id = ${existing.id} FOR UPDATE`;
      const otherOpen = await tx.demoAccess.findFirst({ where: { userId: existing.id, ...openAccessWhere(now) } });
      if (otherOpen) {
        throw new LeadWorkflowError("Akun USER untuk email ini masih memiliki akses demo yang belum berakhir dari permohonan lain.");
      }
      userId = existing.id;
    } else {
      const userRole = await tx.role.findUnique({ where: { code: "USER" } });
      if (!userRole) throw new Error("Role USER belum dikonfigurasi (roles.code = 'user').");
      const created = await tx.user.create({
        data: {
          name: lead.name,
          email,
          institution: lead.institution,
          jobTitle: lead.jobTitle,
          phone: lead.phone,
          roleId: userRole.id,
          status: "ACTIVE",
        },
      });
      userId = created.id;
      await recordAuditLogTx(tx, {
        actor,
        action: "USER_CREATED",
        entity: "users",
        recordId: userId,
        newValue: { email, role: ROLE_DISPLAY_NAMES.USER, source: "DEMO_ACCESS_GRANT", leadId },
      });
    }

    const access = await tx.demoAccess.create({
      data: { leadId, userId, durationDays, grantedAt: now, grantedById: actor.userId },
    });

    await tx.lead.update({
      where: { id: leadId },
      data: {
        userId,
        rejectionReason: null,
        ...(confirmedDate !== undefined ? { confirmedDemoDate: confirmedDate } : {}),
      },
    });

    const link = await issueMagicLink(tx, { demoAccessId: access.id, email }, now);

    await recordAuditLogTx(tx, {
      actor,
      action: "DEMO_ACCESS_GRANTED",
      entity: "demo_accesses",
      recordId: access.id,
      newValue: { leadId, userId, durationDays },
    });
    await recordAuditLogTx(tx, {
      actor,
      action: "MAGIC_LINK_ISSUED",
      entity: "demo_accesses",
      recordId: access.id,
      newValue: { leadId, linkExpiresAt: link.expiresAt.toISOString(), revokedPreviousLinks: link.revokedCount },
    });

    return link;
  });

  return { lead: (await getLeadById(leadId))!, magicLinkUrl: issued.magicLinkUrl, expiresAt: issued.expiresAt.toISOString() };
}

/** Menerbitkan tautan baru untuk periode yang masih berlaku; tautan lama yang belum dipakai dicabut. */
export async function reissueMagicLink(
  leadId: string,
  actor: AdminActor
): Promise<{ lead: DemoRequestRecord; magicLinkUrl: string; expiresAt: string }> {
  const now = new Date();
  const issued = await db.$transaction(async (tx) => {
    const lead = await lockLead(tx, leadId);
    if (lead.approvalStatus === "REJECTED") throw new LeadWorkflowError("Permohonan ini sudah ditolak.");
    const access = await tx.demoAccess.findFirst({
      where: { leadId, ...openAccessWhere(now) },
      orderBy: { grantedAt: "desc" },
      include: { user: true },
    });
    if (!access) {
      throw new LeadWorkflowError("Tidak ada akses demo yang masih berlaku. Beri akses atau perpanjang akses terlebih dahulu.");
    }
    if (access.user.status !== "ACTIVE" || access.user.deletedAt) {
      throw new LeadWorkflowError("Akun USER untuk permohonan ini tidak aktif.");
    }
    const link = await issueMagicLink(tx, { demoAccessId: access.id, email: access.user.email }, now);
    await recordAuditLogTx(tx, {
      actor,
      action: "MAGIC_LINK_ISSUED",
      entity: "demo_accesses",
      recordId: access.id,
      newValue: { leadId, linkExpiresAt: link.expiresAt.toISOString(), revokedPreviousLinks: link.revokedCount },
    });
    return link;
  });
  return { lead: (await getLeadById(leadId))!, magicLinkUrl: issued.magicLinkUrl, expiresAt: issued.expiresAt.toISOString() };
}

/**
 * Perpanjangan (OD-07): periode BARU yang menyambung periode terakhir. Periode lama tetap utuh.
 * - Periode terakhir masih aktif -> periode baru dimulai tepat saat periode lama berakhir (tanpa tautan baru).
 * - Periode terakhir sudah berakhir -> periode baru aktif sekarang + tautan baru untuk login.
 * Status Lead tidak berubah.
 */
export async function extendDemoAccess(
  leadId: string,
  options: { durationDays: number },
  actor: AdminActor
): Promise<{ lead: DemoRequestRecord; magicLinkUrl: string | null; expiresAt: string | null }> {
  if (!isValidDemoDuration(options.durationDays)) throw new LeadWorkflowError("Durasi demo tidak valid.", 400);
  const now = new Date();

  const issued = await db.$transaction(async (tx) => {
    const lead = await lockLead(tx, leadId);
    if (lead.approvalStatus === "REJECTED") throw new LeadWorkflowError("Permohonan ini sudah ditolak.");
    if (lead.status === "COMPLETED") {
      throw new LeadWorkflowError("Demo untuk permohonan ini sudah dikonfirmasi selesai. Akses tidak dapat diperpanjang (OD-22).");
    }

    const latest = await tx.demoAccess.findFirst({
      where: { leadId, revokedAt: null, extendedBy: null },
      orderBy: { grantedAt: "desc" },
      include: { user: true },
    });
    if (!latest) throw new LeadWorkflowError("Belum ada akses demo yang dapat diperpanjang.");
    if (!latest.activatedAt || !latest.expiresAt) {
      throw new LeadWorkflowError("Akses demo belum diaktifkan oleh pemohon. Perpanjangan hanya untuk akses yang sudah berjalan.");
    }
    if (latest.user.status !== "ACTIVE" || latest.user.deletedAt) throw new LeadWorkflowError("Akun USER tidak aktif.");

    const startsAt = latest.expiresAt > now ? latest.expiresAt : now;
    const expiresAt = new Date(startsAt.getTime() + options.durationDays * 24 * 60 * 60 * 1000);
    const extension = await tx.demoAccess.create({
      data: {
        leadId,
        userId: latest.userId,
        durationDays: options.durationDays,
        grantedAt: now,
        grantedById: actor.userId,
        activatedAt: startsAt,
        expiresAt,
        extendsAccessId: latest.id,
      },
    });

    await recordAuditLogTx(tx, {
      actor,
      action: "DEMO_ACCESS_EXTENDED",
      entity: "demo_accesses",
      recordId: extension.id,
      oldValue: { accessId: latest.id, expiresAt: latest.expiresAt.toISOString() },
      newValue: { leadId, durationDays: options.durationDays, startsAt: startsAt.toISOString(), expiresAt: expiresAt.toISOString() },
    });

    if (latest.expiresAt > now) return null;

    const link = await issueMagicLink(tx, { demoAccessId: extension.id, email: latest.user.email }, now);
    await recordAuditLogTx(tx, {
      actor,
      action: "MAGIC_LINK_ISSUED",
      entity: "demo_accesses",
      recordId: extension.id,
      newValue: { leadId, linkExpiresAt: link.expiresAt.toISOString(), revokedPreviousLinks: link.revokedCount },
    });
    return link;
  });

  return {
    lead: (await getLeadById(leadId))!,
    magicLinkUrl: issued?.magicLinkUrl ?? null,
    expiresAt: issued?.expiresAt.toISOString() ?? null,
  };
}

/** Mencabut seluruh periode akses yang belum berakhir beserta tautan yang belum dipakai. Status Lead tidak berubah. */
export async function revokeDemoAccess(leadId: string, actor: AdminActor): Promise<DemoRequestRecord> {
  const now = new Date();
  await db.$transaction(async (tx) => {
    await lockLead(tx, leadId);
    const open = await tx.demoAccess.findMany({ where: { leadId, ...openAccessWhere(now) }, select: { id: true } });
    if (open.length === 0) throw new LeadWorkflowError("Tidak ada akses demo yang perlu dicabut.");
    const ids = open.map((a) => a.id);
    await tx.demoAccess.updateMany({ where: { id: { in: ids } }, data: { revokedAt: now, revokedById: actor.userId } });
    const links = await tx.demoMagicLink.updateMany({
      where: { demoAccessId: { in: ids }, usedAt: null, revokedAt: null },
      data: { revokedAt: now },
    });
    await recordAuditLogTx(tx, {
      actor,
      action: "DEMO_ACCESS_REVOKED",
      entity: "leads",
      recordId: leadId,
      newValue: { accessIds: ids, revokedLinks: links.count },
    });
  });
  return (await getLeadById(leadId))!;
}

/**
 * Menolak permohonan (fitur lama, dipertahankan; status "Ditolak" menunggu OD-02).
 * Hanya untuk lead yang belum pernah login demo. Status Lead TIDAK berubah; akses yang belum
 * diaktifkan & tautannya dicabut.
 */
export async function rejectLead(
  leadId: string,
  options: { rejectionReason: string },
  actor: AdminActor
): Promise<DemoRequestRecord> {
  const now = new Date();
  await db.$transaction(async (tx) => {
    const lead = await lockLead(tx, leadId);
    if (lead.approvalStatus === "REJECTED") throw new LeadWorkflowError("Permohonan ini sudah ditolak.");
    if (lead.status !== "CONTACTED") {
      throw new LeadWorkflowError("Permohonan yang sudah memulai demo tidak dapat ditolak.");
    }
    const open = await tx.demoAccess.findMany({ where: { leadId, ...openAccessWhere(now) }, select: { id: true } });
    if (open.length > 0) {
      const ids = open.map((a) => a.id);
      await tx.demoAccess.updateMany({ where: { id: { in: ids } }, data: { revokedAt: now, revokedById: actor.userId } });
      await tx.demoMagicLink.updateMany({ where: { demoAccessId: { in: ids }, usedAt: null, revokedAt: null }, data: { revokedAt: now } });
    }
    await tx.lead.update({
      where: { id: leadId },
      data: { approvalStatus: "REJECTED", rejectionReason: options.rejectionReason.trim() },
    });
    await recordAuditLogTx(tx, {
      actor,
      action: "LEAD_REJECTED",
      entity: "leads",
      recordId: leadId,
      oldValue: { approvalStatus: lead.approvalStatus },
      newValue: { approvalStatus: "REJECTED", reason: options.rejectionReason.trim(), revokedAccesses: open.length },
    });
  });
  return (await getLeadById(leadId))!;
}

/**
 * "Tandai Demo Selesai": satu-satunya jalan menuju Selesai. Hanya dari Jadwal Demo (OD-20).
 * Mencatat waktu konfirmasi, admin yang mengonfirmasi, dan catatan opsional (OD-18).
 */
export async function completeLeadDemo(
  leadId: string,
  options: { note?: string | null },
  actor: AdminActor
): Promise<DemoRequestRecord> {
  const now = new Date();
  const note = options.note?.trim() ? options.note.trim() : null;

  await db.$transaction(async (tx) => {
    const updated = await tx.lead.updateMany({
      where: { id: leadId, status: "SCHEDULED" },
      data: { status: "COMPLETED", demoCompletedAt: now, demoCompletedById: actor.userId, demoCompletionNote: note },
    });

    if (updated.count !== 1) {
      const lead = await tx.lead.findUnique({ where: { id: leadId }, select: { status: true } });
      if (!lead) throw new LeadWorkflowError("Permohonan demo tidak ditemukan.", 404);
      if (lead.status === "COMPLETED") throw new LeadWorkflowError("Demo untuk permohonan ini sudah dikonfirmasi selesai.");
      throw new LeadWorkflowError("Demo belum dimulai: pemohon belum pernah login demo, sehingga belum dapat ditandai selesai.");
    }

    await recordAuditLogTx(tx, {
      actor,
      action: "LEAD_STATUS_CHANGED",
      entity: "leads",
      recordId: leadId,
      oldValue: { status: "SCHEDULED" },
      newValue: { status: "COMPLETED", trigger: "ADMIN_CONFIRMED_COMPLETION", note },
    });
  });

  return (await getLeadById(leadId))!;
}
