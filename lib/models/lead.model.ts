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
    magicLinkUrl: latestMagicLink ? `http://localhost:3000/auth/verify-magic-link?token=${latestMagicLink.tokenHash}` : null,
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
    include: { user: true },
  });

  if (!currentLead) {
    throw new Error(`Lead dengan ID ${leadId} tidak ditemukan.`);
  }

  const durationDays = options.durationDays ? Math.max(1, options.durationDays) : 7;
  const confirmedDate = options.confirmedDemoDate
    ? new Date(options.confirmedDemoDate)
    : currentLead.requestedDemoDate || currentLead.demoDate;

  // 1. Dapatkan atau buat akun User dengan role "Demo User"
  let userId = currentLead.userId;
  let user = currentLead.user;

  if (!user) {
    user = await db.user.findUnique({
      where: { email: currentLead.email.toLowerCase().trim() },
    });
  }

  if (!user) {
    let demoRole = await db.role.findFirst({ where: { name: "Demo User" } });
    if (!demoRole) {
      demoRole = await db.role.create({
        data: {
          name: "Demo User",
          description: "Akses terbatas untuk akun uji coba / demo LIS",
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
        roleId: demoRole.id,
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

  // 3. Update data lead: disetujui, sinkron status Jadwal Demo (3)
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
      status: 3, // Otomatis sync dengan status Jadwal Demo di CRM
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
  const currentLead = await db.lead.findUnique({ where: { id: leadId } });
  if (!currentLead) {
    throw new Error(`Lead dengan ID ${leadId} tidak ditemukan`);
  }

  const updateData: Prisma.LeadUpdateInput = {
    status: newStatus,
  };

  if (demoDate !== undefined) {
    const targetDate = demoDate ? new Date(demoDate) : null;
    updateData.confirmedDemoDate = targetDate;
    updateData.demoDate = targetDate;
  }

  if (newStatus === 3) {
    const days = Math.max(3, voucherDays);
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + days);

    updateData.voucherCode = currentLead.voucherCode || generateVoucherCode();
    updateData.voucherExpiry = expiry;
    updateData.demoDurationDays = days;
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
