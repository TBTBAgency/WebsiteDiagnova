import { db } from "@/lib/db";
import {
  DemoRequestInput,
  DemoRequestRecord,
  InstitutionType,
  LeadApprovalStatus,
  LeadFilterQuery,
} from "@/types";
import {
  InstitutionType as PrismaInstitutionType,
  LeadApprovalStatus as PrismaLeadApprovalStatus,
  Prisma,
} from "@prisma/client";
import { createDemoMagicLink } from "@/lib/magic-link";
import { AppUrlConfigError, getAppBaseUrl } from "@/lib/app-url";

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

/**
 * Status Alur CRM Sales:
 * 1 = Baru
 * 2 = Dihubungi
 * 3 = Jadwal Demo
 * 4 = Selesai
 */
export const STATUS_LABELS: Record<number, string> = {
  1: "Baru",
  2: "Dihubungi",
  3: "Jadwal Demo",
  4: "Selesai",
};

/**
 * Alur status lead (ketentuan bisnis demo request):
 *  - Form demo tersimpan            -> 2 (Dihubungi)            [otomatis, sistem]
 *  - Klien login pertama via Magic Link -> 2 -> 3 (Jadwal Demo) [otomatis, sistem, idempoten]
 *  - Admin konfirmasi demo selesai  -> 3 -> 4 (Selesai)         [manual, admin]
 * Status 1 (Baru) hanya ada pada data lama sebelum aturan ini; admin boleh memindahkannya ke 2.
 * Kedaluwarsa akses demo TIDAK mengubah status.
 */
export const LEAD_STATUS = {
  NEW: 1,
  CONTACTED: 2,
  SCHEDULED: 3,
  COMPLETED: 4,
} as const;

/** Transisi status yang boleh dilakukan admin secara manual. */
export const MANUAL_STATUS_TRANSITIONS: Record<number, number[]> = {
  [LEAD_STATUS.NEW]: [LEAD_STATUS.CONTACTED],
  [LEAD_STATUS.SCHEDULED]: [LEAD_STATUS.COMPLETED],
};

/** Error domain yang dipetakan ke HTTP 4xx oleh controller. */
export class LeadWorkflowError extends Error {
  constructor(
    message: string,
    public readonly httpStatus: 400 | 404 | 409 | 503 = 409
  ) {
    super(message);
    this.name = "LeadWorkflowError";
  }
}

/**
 * Transisi status atomik: hanya berhasil bila status saat ini masih `from`.
 * Mencegah race condition dan transisi ganda (mis. login berulang).
 */
export async function transitionLeadStatus(leadId: string, from: number, to: number): Promise<boolean> {
  const result = await db.lead.updateMany({
    where: { id: leadId, status: from },
    data: { status: to },
  });
  return result.count === 1;
}

/**
 * Helper untuk format Lead Record Prisma ke DemoRequestRecord
 */
function formatLeadRecord(record: any): DemoRequestRecord {
  const latestMagicLink =
    record.magicLinks && record.magicLinks.length > 0
      ? record.magicLinks[0]
      : null;

  return {
    id: record.id,
    userId: record.userId,
    user: record.user
      ? {
          id: record.user.id,
          name: record.user.name,
          email: record.user.email,
          institution: record.user.institution,
          jobTitle: record.user.jobTitle,
          phone: record.user.phone,
          status: record.user.status,
          demoDurationDays: record.user.demoDurationDays,
          demoActivatedAt: record.user.demoActivatedAt
            ? record.user.demoActivatedAt.toISOString()
            : null,
          demoExpiresAt: record.user.demoExpiresAt
            ? record.user.demoExpiresAt.toISOString()
            : null,
          createdAt: record.user.createdAt.toISOString(),
        }
      : null,
    name: record.name,
    institution: record.institution,
    jobTitle: record.jobTitle,
    email: record.email,
    phone: record.phone,
    institutionType: prismaToInstitutionType[record.institutionType as PrismaInstitutionType] ?? "other",
    notes: record.notes ?? undefined,
    status: record.status,
    approvalStatus: (record.approvalStatus as LeadApprovalStatus) || "PENDING",
    approvedAt: record.approvedAt ? record.approvedAt.toISOString() : null,
    approvedBy: record.approvedBy ?? null,
    rejectionReason: record.rejectionReason ?? null,
    requestedDemoDate: record.requestedDemoDate
      ? record.requestedDemoDate.toISOString()
      : record.demoDate
      ? record.demoDate.toISOString()
      : null,
    confirmedDemoDate: record.confirmedDemoDate
      ? record.confirmedDemoDate.toISOString()
      : null,
    demoDate: record.confirmedDemoDate
      ? record.confirmedDemoDate.toISOString()
      : record.requestedDemoDate
      ? record.requestedDemoDate.toISOString()
      : record.demoDate
      ? record.demoDate.toISOString()
      : null,
    demoDurationDays: record.demoDurationDays || 3,
    voucherCode: record.voucherCode ?? null,
    voucherExpiry: record.voucherExpiry ? record.voucherExpiry.toISOString() : null,
    // Token mentah tidak pernah disimpan (hanya hash SHA-256), sehingga URL magic link
    // hanya tersedia sekali pada respons approve. Hash tidak boleh diekspos ke klien.
    magicLinkUrl: null,
    magicLinkUsedAt: latestMagicLink?.usedAt ? latestMagicLink.usedAt.toISOString() : null,
    magicLinkExpiry: latestMagicLink ? latestMagicLink.expiresAt.toISOString() : null,
    createdAt: record.createdAt.toISOString(),
  };
}

/**
 * Helper untuk membuat kode voucher unik jadwal demo
 */
function generateVoucherCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "DGN-";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Menyimpan lead baru dari form publik Request Demo
 * (TIDAK membuat user dummy secara prematur; hanya mengaitkan jika email sudah pernah terdaftar)
 */
export async function createLead(input: DemoRequestInput): Promise<DemoRequestRecord> {
  const prismaInstitution =
    institutionTypeToPrisma[input.institutionType] ?? PrismaInstitutionType.HOSPITAL;

  // Cek apakah email pemohon sudah pernah ada di database pengguna
  const existingUser = await db.user.findUnique({
    where: { email: input.email.toLowerCase().trim() },
  });

  const requestedDate = input.requestedDemoDate
    ? new Date(input.requestedDemoDate)
    : input.demoDate
    ? new Date(input.demoDate)
    : null;

  const record = await db.lead.create({
    data: {
      userId: existingUser ? existingUser.id : null,
      name: input.name,
      institution: input.institution,
      jobTitle: input.jobTitle,
      email: input.email.toLowerCase().trim(),
      phone: input.phone,
      institutionType: prismaInstitution,
      notes: input.notes && input.notes.trim() !== "" ? input.notes.trim() : null,
      requestedDemoDate: requestedDate,
      demoDate: requestedDate,
      status: LEAD_STATUS.CONTACTED, // Ketentuan bisnis: form tersimpan => Dihubungi
      approvalStatus: PrismaLeadApprovalStatus.PENDING,
    },
    include: {
      user: true,
      magicLinks: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  return formatLeadRecord(record);
}

/**
 * Mengambil daftar leads dengan filter status CRM, approvalStatus, tipe institusi, search, dan tanggal
 */
export async function getLeadsWithPagination(
  query: LeadFilterQuery & { approvalStatus?: LeadApprovalStatus | "all" } = {}
): Promise<{
  leads: DemoRequestRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const page = Math.max(1, query.page ?? 1);
  const limit = Math.max(1, Math.min(100, query.limit ?? 10));
  const skip = (page - 1) * limit;

  const where: Prisma.LeadWhereInput = {};

  if (query.status && query.status !== ("all" as unknown)) {
    where.status = Number(query.status);
  }

  if (query.approvalStatus && query.approvalStatus !== "all") {
    where.approvalStatus = query.approvalStatus as PrismaLeadApprovalStatus;
  }

  if (query.institutionType && query.institutionType !== "all") {
    where.institutionType = institutionTypeToPrisma[query.institutionType];
  }

  // Filter Tanggal
  if (query.startDate || query.endDate) {
    where.createdAt = {};
    if (query.startDate) {
      where.createdAt.gte = new Date(query.startDate);
    }
    if (query.endDate) {
      const end = new Date(query.endDate);
      end.setHours(23, 59, 59, 999);
      where.createdAt.lte = end;
    }
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

  const [records, total] = await Promise.all([
    db.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        user: true,
        magicLinks: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    }),
    db.lead.count({ where }),
  ]);

  return {
    leads: records.map(formatLeadRecord),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

/**
 * Mengambil detail lengkap sebuah lead berdasarkan ID
 */
export async function getLeadById(id: string): Promise<DemoRequestRecord | null> {
  const record = await db.lead.findUnique({
    where: { id },
    include: {
      user: true,
      magicLinks: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!record) return null;
  return formatLeadRecord(record);
}

/**
 * Menyetujui permohonan demo, menyiapkan akun demo, dan menghasilkan Magic Link
 */
export async function approveLead(
  leadId: string,
  options: {
    confirmedDemoDate?: string | null;
    durationDays?: number;
    approvedBy?: string;
  }
): Promise<{
  lead: DemoRequestRecord;
  magicLinkUrl: string;
  expiresAt: string;
}> {
  const currentLead = await db.lead.findUnique({
    where: { id: leadId },
    include: { user: { include: { role: true } } },
  });

  if (!currentLead) {
    throw new LeadWorkflowError("Data permohonan demo tidak ditemukan.", 404);
  }

  // Pastikan URL publik aplikasi valid SEBELUM ada perubahan data, agar production tidak
  // pernah menyetujui lead dengan Magic Link yang mengarah ke localhost.
  try {
    getAppBaseUrl();
  } catch (error) {
    if (error instanceof AppUrlConfigError) {
      console.error("Konfigurasi URL aplikasi tidak valid:", error.message);
      throw new LeadWorkflowError(
        "Magic Link tidak dapat dibuat: URL aplikasi (APP_URL) belum dikonfigurasi dengan benar di server. Hubungi pengelola sistem.",
        503
      );
    }
    throw error;
  }

  // Cegah privilege escalation: magic link tidak boleh dibuat untuk email milik akun non-USER
  // (mis. Administrator), karena magic link memberi sesi sesuai role akun tersebut.
  const linkedUser =
    currentLead.user ||
    (await db.user.findUnique({
      where: { email: currentLead.email.toLowerCase().trim() },
      include: { role: true },
    }));
  if (linkedUser && linkedUser.role?.name !== "USER") {
    throw new LeadWorkflowError(
      "Email pemohon terdaftar sebagai akun non-klien (mis. Administrator). Magic Link tidak dapat dibuat untuk akun tersebut.",
      409
    );
  }
  if (linkedUser && linkedUser.status !== 1) {
    throw new LeadWorkflowError(
      "Akun klien demo sedang dinonaktifkan. Aktifkan kembali akun melalui Manajemen Pengguna sebelum membuat tautan baru.",
      409
    );
  }

  const durationDays = options.durationDays ? Math.max(1, options.durationDays) : 7;
  const confirmedDate = options.confirmedDemoDate
    ? new Date(options.confirmedDemoDate)
    : currentLead.requestedDemoDate || currentLead.demoDate;

  // 1. Dapatkan atau buat akun User dengan role "USER"
  let userId: string;
  let user: { id: string } | null = linkedUser;

  if (!user) {
    let targetRole = await db.role.findFirst({ where: { name: "USER" } });
    if (!targetRole) {
      targetRole = await db.role.create({
        data: {
          name: "USER",
          description: "Pengguna terdaftar / pemohon akses demo Diagnova",
        },
      });
    }

    user = await db.user.create({
      data: {
        name: currentLead.name,
        email: currentLead.email.toLowerCase().trim(),
        institution: currentLead.institution,
        jobTitle: currentLead.jobTitle,
        phone: currentLead.phone,
        roleId: targetRole.id,
        status: 1,
        demoDurationDays: durationDays,
      },
    });
    userId = user.id;
  } else {
    userId = user.id;
    // Perbarui durasi demo pada user yang sudah ada
    await db.user.update({
      where: { id: user.id },
      data: {
        demoDurationDays: durationDays,
        status: 1,
      },
    });
  }

  // 2. Generate token Magic Link berkekuatan tinggi (masa berlaku token link: 24 jam)
  const magicLinkResult = await createDemoMagicLink(
    leadId,
    currentLead.email,
    userId,
    24
  );

  // 3. Update data lead: disetujui. Status lead TIDAK diubah di sini — status menjadi
  //    Jadwal Demo (3) hanya setelah klien berhasil login pertama kali via Magic Link.
  const voucherCode = currentLead.voucherCode || generateVoucherCode();
  const voucherExpiry = new Date();
  voucherExpiry.setDate(voucherExpiry.getDate() + durationDays);

  await db.lead.update({
    where: { id: leadId },
    data: {
      userId,
      approvalStatus: PrismaLeadApprovalStatus.APPROVED,
      approvedAt: new Date(),
      approvedBy: options.approvedBy || "Admin Diagnova",
      rejectionReason: null,
      confirmedDemoDate: confirmedDate,
      demoDate: confirmedDate,
      demoDurationDays: durationDays,
      voucherCode,
      voucherExpiry,
    },
  });

  const updatedLead = (await getLeadById(leadId))!;
  return {
    lead: updatedLead,
    magicLinkUrl: magicLinkResult.magicLinkUrl,
    expiresAt: magicLinkResult.expiresAt.toISOString(),
  };
}

/**
 * Menolak permohonan demo. Seluruh magic link yang belum terpakai untuk lead ini
 * langsung dinonaktifkan agar tidak dapat digunakan setelah penolakan.
 * Status pipeline lead tidak diubah.
 */
export async function rejectLead(
  leadId: string,
  options: {
    rejectionReason: string;
    rejectedBy?: string;
  }
): Promise<DemoRequestRecord> {
  const currentLead = await db.lead.findUnique({ where: { id: leadId } });
  if (!currentLead) {
    throw new LeadWorkflowError("Data permohonan demo tidak ditemukan.", 404);
  }

  const now = new Date();
  await db.$transaction([
    db.lead.update({
      where: { id: leadId },
      data: {
        approvalStatus: PrismaLeadApprovalStatus.REJECTED,
        approvedAt: now,
        approvedBy: options.rejectedBy || "Admin Diagnova",
        rejectionReason: options.rejectionReason,
      },
    }),
    db.demoMagicLink.updateMany({
      where: { leadId, usedAt: null, expiresAt: { gt: now } },
      data: { expiresAt: now },
    }),
  ]);

  return (await getLeadById(leadId))!;
}

/**
 * Memperbarui jadwal demo dan/atau status lead secara terkontrol.
 * Hanya transisi pada MANUAL_STATUS_TRANSITIONS yang diizinkan; transisi lain
 * (mis. lompat ke Jadwal Demo, atau mundur dari Selesai) ditolak dengan 409.
 */
export async function updateLeadStatus(
  leadId: string,
  newStatus?: number | null,
  demoDate?: string | Date | null
): Promise<{ lead: DemoRequestRecord; previousStatus: number; statusChanged: boolean }> {
  const currentLead = await db.lead.findUnique({ where: { id: leadId } });
  if (!currentLead) {
    throw new LeadWorkflowError("Data permohonan demo tidak ditemukan.", 404);
  }

  const previousStatus = currentLead.status;
  let statusChanged = false;

  if (newStatus !== undefined && newStatus !== null && newStatus !== previousStatus) {
    const allowed = MANUAL_STATUS_TRANSITIONS[previousStatus] || [];
    if (!allowed.includes(newStatus)) {
      throw new LeadWorkflowError(
        `Perubahan status dari "${STATUS_LABELS[previousStatus] ?? previousStatus}" ke "${
          STATUS_LABELS[newStatus] ?? newStatus
        }" tidak diizinkan. Status Jadwal Demo ditetapkan otomatis saat klien login pertama kali, dan Selesai hanya dari Jadwal Demo.`,
        409
      );
    }
    statusChanged = await transitionLeadStatus(leadId, previousStatus, newStatus);
    if (!statusChanged) {
      throw new LeadWorkflowError("Status lead telah berubah oleh proses lain. Muat ulang data dan coba lagi.", 409);
    }
  }

  if (demoDate !== undefined) {
    const targetDate = demoDate ? new Date(demoDate) : null;
    await db.lead.update({
      where: { id: leadId },
      data: { confirmedDemoDate: targetDate, demoDate: targetDate },
    });
  }

  return { lead: (await getLeadById(leadId))!, previousStatus, statusChanged };
}

/**
 * Admin mengonfirmasi demo telah benar-benar selesai: Jadwal Demo (3) -> Selesai (4).
 */
export async function completeLead(leadId: string): Promise<DemoRequestRecord> {
  const currentLead = await db.lead.findUnique({ where: { id: leadId } });
  if (!currentLead) {
    throw new LeadWorkflowError("Data permohonan demo tidak ditemukan.", 404);
  }
  if (currentLead.status === LEAD_STATUS.COMPLETED) {
    throw new LeadWorkflowError("Demo untuk permohonan ini sudah dikonfirmasi selesai.", 409);
  }
  if (currentLead.status !== LEAD_STATUS.SCHEDULED) {
    throw new LeadWorkflowError(
      "Demo hanya dapat dikonfirmasi selesai setelah klien masuk melalui Magic Link (status Jadwal Demo).",
      409
    );
  }
  const ok = await transitionLeadStatus(leadId, LEAD_STATUS.SCHEDULED, LEAD_STATUS.COMPLETED);
  if (!ok) {
    throw new LeadWorkflowError("Status lead telah berubah oleh proses lain. Muat ulang data dan coba lagi.", 409);
  }
  return (await getLeadById(leadId))!;
}

/**
 * Memperpanjang masa aktif akses demo klien sebanyak `days` hari.
 * Basis perpanjangan: tanggal kedaluwarsa saat ini, atau sekarang bila sudah lewat.
 * Status lead tidak berubah.
 */
export async function extendDemoAccess(
  leadId: string,
  days: number
): Promise<{ lead: DemoRequestRecord; previousExpiresAt: string | null; newExpiresAt: string }> {
  const currentLead = await db.lead.findUnique({ where: { id: leadId }, include: { user: true } });
  if (!currentLead) {
    throw new LeadWorkflowError("Data permohonan demo tidak ditemukan.", 404);
  }
  if (currentLead.approvalStatus !== PrismaLeadApprovalStatus.APPROVED) {
    throw new LeadWorkflowError("Akses demo hanya dapat diperpanjang untuk permohonan yang disetujui.", 409);
  }
  const user = currentLead.user;
  if (!user || !user.demoActivatedAt || !user.demoExpiresAt) {
    throw new LeadWorkflowError(
      "Akses demo belum pernah diaktifkan (klien belum login). Atur durasi melalui approval / tautan baru.",
      409
    );
  }

  const now = new Date();
  const base = user.demoExpiresAt > now ? user.demoExpiresAt : now;
  const newExpiresAt = new Date(base.getTime() + days * 24 * 60 * 60 * 1000);

  await db.$transaction([
    db.user.update({ where: { id: user.id }, data: { demoExpiresAt: newExpiresAt } }),
    db.lead.update({ where: { id: leadId }, data: { voucherExpiry: newExpiresAt } }),
  ]);

  return {
    lead: (await getLeadById(leadId))!,
    previousExpiresAt: user.demoExpiresAt.toISOString(),
    newExpiresAt: newExpiresAt.toISOString(),
  };
}

/**
 * Riwayat lengkap sebuah lead: penerbitan & pemakaian magic link serta audit trail.
 */
export async function getLeadHistory(leadId: string) {
  const [magicLinks, auditLogs] = await Promise.all([
    db.demoMagicLink.findMany({
      where: { leadId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        createdAt: true,
        expiresAt: true,
        usedAt: true,
        ipAddress: true,
        userAgent: true,
      },
    }),
    db.auditLog.findMany({
      where: { entity: "Lead", recordId: leadId },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
  ]);

  const userIds = Array.from(new Set(auditLogs.map((l) => l.userId).filter((id): id is string => !!id)));
  const users = userIds.length
    ? await db.user.findMany({ where: { id: { in: userIds } }, select: { id: true, name: true } })
    : [];
  const nameById = new Map(users.map((u) => [u.id, u.name]));

  return {
    magicLinks: magicLinks.map((m) => ({
      id: m.id,
      createdAt: m.createdAt.toISOString(),
      expiresAt: m.expiresAt.toISOString(),
      usedAt: m.usedAt ? m.usedAt.toISOString() : null,
      ipAddress: m.ipAddress,
      userAgent: m.userAgent,
    })),
    events: auditLogs.map((l) => ({
      id: l.id,
      action: l.action,
      actor: l.userId ? nameById.get(l.userId) || "Pengguna terhapus" : "Sistem",
      oldValue: l.oldValue,
      newValue: l.newValue,
      createdAt: l.createdAt.toISOString(),
    })),
  };
}

/**
 * Menghitung metrik agregat permohonan demo berdasarkan status integer (1, 2, 3, 4)
 */
export async function getLeadMetrics(): Promise<{
  total: number;
  new: number;
  contacted: number;
  scheduled: number;
  completed: number;
}> {
  const counts = await db.lead.groupBy({
    by: ["status"],
    _count: { status: true },
  });

  let total = 0;
  let newCount = 0;
  let contactedCount = 0;
  let scheduledCount = 0;
  let completedCount = 0;

  for (const item of counts) {
    const count = item._count.status;
    total += count;
    if (item.status === 1) newCount = count;
    else if (item.status === 2) contactedCount = count;
    else if (item.status === 3) scheduledCount = count;
    else if (item.status === 4) completedCount = count;
  }

  return {
    total,
    new: newCount,
    contacted: contactedCount,
    scheduled: scheduledCount,
    completed: completedCount,
  };
}
