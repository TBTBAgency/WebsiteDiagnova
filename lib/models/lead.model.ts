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
import { getMagicLinkStatus, issueMagicLink } from "@/lib/magic-link";
import { DEMO_ROLE_NAME, isDemoRole } from "@/lib/roles";
import { DEFAULT_DEMO_DURATION_DAYS, isValidDemoDuration } from "@/lib/demo-constants";

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
    // Token mentah tidak disimpan (hanya hash), sehingga URL tidak dapat direkonstruksi dari DB.
    // URL hanya dikembalikan sekali saat dibuat (approve); di sini hanya status tautan terakhir.
    magicLinkUrl: null,
    magicLinkExpiry: latestMagicLink ? latestMagicLink.expiresAt.toISOString() : null,
    magicLinkStatus: latestMagicLink ? getMagicLinkStatus(latestMagicLink) : null,
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
 * Menyimpan lead baru dari form publik Request Demo.
 *
 * Lead TIDAK dikaitkan ke akun mana pun di sini: email pada form publik belum terverifikasi,
 * sehingga mengaitkan berdasarkan email memungkinkan pihak lain menempel ke akun orang lain
 * (termasuk akun admin). Relasi lead -> akun demo dibuat saat admin menyetujui permohonan.
 */
export async function createLead(input: DemoRequestInput): Promise<DemoRequestRecord> {
  const prismaInstitution =
    institutionTypeToPrisma[input.institutionType] ?? PrismaInstitutionType.HOSPITAL;

  const requestedDate = input.requestedDemoDate
    ? new Date(input.requestedDemoDate)
    : input.demoDate
    ? new Date(input.demoDate)
    : null;

  const record = await db.lead.create({
    data: {
      userId: null,
      name: input.name,
      institution: input.institution,
      jobTitle: input.jobTitle,
      email: input.email.toLowerCase().trim(),
      phone: input.phone,
      institutionType: prismaInstitution,
      notes: input.notes && input.notes.trim() !== "" ? input.notes.trim() : null,
      requestedDemoDate: requestedDate,
      demoDate: requestedDate,
      status: 1, // Status awal: 1 (Baru)
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
 * Menyetujui permohonan demo, menyiapkan akun demo, dan menerbitkan Magic Link baru.
 *
 * - Status CRM TIDAK diubah di sini. "Jadwal Demo" hanya terjadi saat client berhasil login
 *   pertama kali (lihat consumeMagicLink).
 * - Email pemohon yang sudah dipakai akun non-demo (mis. admin) ditolak agar tautan tidak
 *   pernah dapat dipakai untuk masuk ke akun tersebut.
 * - Seluruh langkah berada dalam satu transaksi; baris lead dikunci (FOR UPDATE) sehingga
 *   approve paralel untuk lead yang sama berjalan berurutan dan hanya tautan terakhir yang aktif.
 * - URL mentah dikembalikan sekali ke admin dan tidak pernah disimpan.
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
  if (options.durationDays !== undefined && !isValidDemoDuration(options.durationDays)) {
    throw new LeadWorkflowError("Durasi demo tidak valid.", 400);
  }
  const durationDays = options.durationDays ?? DEFAULT_DEMO_DURATION_DAYS;

  let confirmedFromInput: Date | null = null;
  if (options.confirmedDemoDate) {
    confirmedFromInput = new Date(options.confirmedDemoDate);
    if (isNaN(confirmedFromInput.getTime())) {
      throw new LeadWorkflowError("Format jadwal demo tidak valid.", 400);
    }
  }

  const issued = await db.$transaction(async (tx) => {
    const locked = await tx.$queryRaw<{ id: string }[]>`SELECT id FROM leads WHERE id = ${leadId} FOR UPDATE`;
    if (locked.length === 0) {
      throw new LeadWorkflowError("Permohonan demo tidak ditemukan.", 404);
    }

    const lead = await tx.lead.findUniqueOrThrow({ where: { id: leadId } });
    const email = lead.email.toLowerCase().trim();

    // 1. Akun demo: pakai akun demo yang sudah ada untuk email ini, atau buat baru
    const existing = await tx.user.findUnique({ where: { email }, include: { role: true } });
    let userId: string;
    let userDemoExpiresAt: Date | null = null;

    if (existing) {
      if (!isDemoRole(existing.role?.name)) {
        throw new LeadWorkflowError(
          "Email pemohon sudah terdaftar sebagai akun non-demo. Akses demo tidak dapat dibuat untuk email ini."
        );
      }
      if (existing.status !== 1) {
        throw new LeadWorkflowError(
          "Akun demo untuk email ini sedang dinonaktifkan. Aktifkan akun terlebih dahulu sebelum mengirim tautan baru."
        );
      }
      if (existing.demoExpiresAt && existing.demoExpiresAt <= new Date()) {
        throw new LeadWorkflowError(
          "Masa demo akun untuk email ini sudah berakhir. Perpanjangan masa demo belum tersedia."
        );
      }
      userId = existing.id;
      userDemoExpiresAt = existing.demoExpiresAt;
    } else {
      const demoRole = await tx.role.upsert({
        where: { name: DEMO_ROLE_NAME },
        update: {},
        create: { name: DEMO_ROLE_NAME, description: "Akses terbatas untuk akun uji coba / demo LIS" },
      });
      const created = await tx.user.create({
        data: {
          name: lead.name,
          email,
          institution: lead.institution,
          jobTitle: lead.jobTitle,
          phone: lead.phone,
          roleId: demoRole.id,
          status: 1,
        },
      });
      userId = created.id;
    }

    // 2. Terbitkan tautan baru (tautan lama yang belum dipakai otomatis dicabut)
    const link = await issueMagicLink(tx, { leadId, email, userId });

    // 3. Tandai disetujui. Masa berlaku demo baru diisi saat aktivasi (login pertama).
    const confirmedDate = confirmedFromInput ?? lead.requestedDemoDate ?? lead.demoDate;
    await tx.lead.update({
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
        voucherCode: lead.voucherCode || generateVoucherCode(),
        voucherExpiry: userDemoExpiresAt,
      },
    });

    return link;
  });

  const updatedLead = (await getLeadById(leadId))!;
  return {
    lead: updatedLead,
    magicLinkUrl: issued.magicLinkUrl,
    expiresAt: issued.expiresAt.toISOString(),
  };
}

/**
 * Menolak permohonan demo
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
    throw new Error(`Lead dengan ID ${leadId} tidak ditemukan.`);
  }

  await db.lead.update({
    where: { id: leadId },
    data: {
      approvalStatus: PrismaLeadApprovalStatus.REJECTED,
      approvedAt: new Date(),
      approvedBy: options.rejectedBy || "Admin Diagnova",
      rejectionReason: options.rejectionReason,
    },
  });

  return (await getLeadById(leadId))!;
}

/**
 * Memperbarui status CRM lead serta men-generate voucher jika status menjadi Jadwal Demo (3)
 */
export async function updateLeadStatus(
  leadId: string,
  newStatus: number,
  voucherDays: number = 3,
  demoDate?: string | Date | null
): Promise<DemoRequestRecord> {
  const currentLead = await db.lead.findUnique({ where: { id: leadId }, include: { user: true } });
  if (!currentLead) {
    throw new LeadWorkflowError("Permohonan demo tidak ditemukan.", 404);
  }

  const updateData: Prisma.LeadUpdateInput = {
    status: newStatus,
  };

  if (demoDate !== undefined) {
    const targetDate = demoDate ? new Date(demoDate) : null;
    if (targetDate && isNaN(targetDate.getTime())) {
      throw new LeadWorkflowError("Format jadwal demo tidak valid.", 400);
    }
    updateData.confirmedDemoDate = targetDate;
    updateData.demoDate = targetDate;
  }

  if (newStatus === 3) {
    updateData.voucherCode = currentLead.voucherCode || generateVoucherCode();
    // Masa berlaku demo dimiliki akun (users.demo_expires_at) dan ditetapkan saat login pertama.
    // Durasi hanya boleh diubah selama akun demo belum diaktifkan.
    if (!currentLead.user?.demoActivatedAt && isValidDemoDuration(voucherDays)) {
      updateData.demoDurationDays = voucherDays;
    }
  }

  await db.lead.update({
    where: { id: leadId },
    data: updateData,
  });

  return (await getLeadById(leadId))!;
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
