import { db } from "@/lib/db";
import {
  DemoRequestInput,
  DemoRequestRecord,
  InstitutionType,
  LeadFilterQuery,
  LeadNoteRecord,
  LeadStatus,
} from "@/types";
import {
  InstitutionType as PrismaInstitutionType,
  LeadStatus as PrismaLeadStatus,
  Prisma,
} from "@prisma/client";
import { recordAuditLog } from "./audit.model";

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

export const leadStatusToPrisma: Record<LeadStatus, PrismaLeadStatus> = {
  new: PrismaLeadStatus.NEW,
  contacted: PrismaLeadStatus.CONTACTED,
  scheduled: PrismaLeadStatus.SCHEDULED,
  completed: PrismaLeadStatus.COMPLETED,
};

export const prismaToLeadStatus: Record<PrismaLeadStatus, LeadStatus> = {
  [PrismaLeadStatus.NEW]: "new",
  [PrismaLeadStatus.CONTACTED]: "contacted",
  [PrismaLeadStatus.SCHEDULED]: "scheduled",
  [PrismaLeadStatus.COMPLETED]: "completed",
};

/**
 * Menyimpan lead baru dari form publik Request Demo
 */
export async function createLead(input: DemoRequestInput): Promise<DemoRequestRecord> {
  const prismaInstitution =
    institutionTypeToPrisma[input.institutionType] ?? PrismaInstitutionType.HOSPITAL;

  const record = await db.lead.create({
    data: {
      name: input.name,
      institution: input.institution,
      jobTitle: input.jobTitle,
      email: input.email,
      phone: input.phone,
      institutionType: prismaInstitution,
      notes: input.notes && input.notes.trim() !== "" ? input.notes.trim() : null,
      status: PrismaLeadStatus.NEW,
    },
  });

  // Record audit log for lead creation
  await recordAuditLog({
    action: "CREATE_LEAD",
    entity: "Lead",
    recordId: record.id,
    newValue: {
      name: record.name,
      institution: record.institution,
      email: record.email,
      status: "new",
    },
  });

  return {
    id: record.id,
    name: record.name,
    institution: record.institution,
    jobTitle: record.jobTitle,
    email: record.email,
    phone: record.phone,
    institutionType: prismaToInstitutionType[record.institutionType] ?? "other",
    notes: record.notes ?? undefined,
    status: prismaToLeadStatus[record.status] ?? "new",
    createdAt: record.createdAt.toISOString(),
  };
}

/**
 * Mengambil daftar leads dengan filter, pagination, dan search
 */
export async function getLeadsWithPagination(query: LeadFilterQuery = {}): Promise<{
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

  if (query.status && query.status !== "all") {
    where.status = leadStatusToPrisma[query.status];
  }

  if (query.institutionType && query.institutionType !== "all") {
    where.institutionType = institutionTypeToPrisma[query.institutionType];
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
        notesHistory: {
          orderBy: { createdAt: "desc" },
          take: 3,
          include: {
            author: { select: { name: true } },
          },
        },
      },
    }),
    db.lead.count({ where }),
  ]);

  const leads: DemoRequestRecord[] = records.map((record) => ({
    id: record.id,
    name: record.name,
    institution: record.institution,
    jobTitle: record.jobTitle,
    email: record.email,
    phone: record.phone,
    institutionType: prismaToInstitutionType[record.institutionType] ?? "other",
    notes: record.notes ?? undefined,
    status: prismaToLeadStatus[record.status] ?? "new",
    createdAt: record.createdAt.toISOString(),
    notesHistory: record.notesHistory?.map((n) => ({
      id: n.id,
      leadId: n.leadId,
      authorId: n.authorId,
      authorName: n.author?.name ?? null,
      content: n.content,
      createdAt: n.createdAt.toISOString(),
    })),
  }));

  return {
    leads,
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
      notesHistory: {
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { name: true } },
        },
      },
    },
  });

  if (!record) return null;

  return {
    id: record.id,
    name: record.name,
    institution: record.institution,
    jobTitle: record.jobTitle,
    email: record.email,
    phone: record.phone,
    institutionType: prismaToInstitutionType[record.institutionType] ?? "other",
    notes: record.notes ?? undefined,
    status: prismaToLeadStatus[record.status] ?? "new",
    createdAt: record.createdAt.toISOString(),
    notesHistory: record.notesHistory?.map((n) => ({
      id: n.id,
      leadId: n.leadId,
      authorId: n.authorId,
      authorName: n.author?.name ?? null,
      content: n.content,
      createdAt: n.createdAt.toISOString(),
    })),
  };
}

/**
 * Memperbarui status lead serta menambahkan catatan (opsional) dan audit log
 */
export async function updateLeadStatus(
  leadId: string,
  newStatus: LeadStatus,
  userId?: string,
  noteContent?: string
): Promise<DemoRequestRecord> {
  const currentLead = await db.lead.findUnique({ where: { id: leadId } });
  if (!currentLead) {
    throw new Error(`Lead dengan ID ${leadId} tidak ditemukan`);
  }

  const oldStatusStr = prismaToLeadStatus[currentLead.status];
  const prismaNewStatus = leadStatusToPrisma[newStatus];

  // Gunakan Prisma transaction jika ada penambahan catatan sekaligus
  const updatedRecord = await db.$transaction(async (tx) => {
    const updated = await tx.lead.update({
      where: { id: leadId },
      data: { status: prismaNewStatus },
    });

    if (noteContent && noteContent.trim() !== "") {
      await tx.leadNote.create({
        data: {
          leadId,
          authorId: userId ?? null,
          content: noteContent.trim(),
        },
      });
    }

    return updated;
  });

  // Catat jejak audit
  await recordAuditLog({
    userId,
    action: "UPDATE_LEAD_STATUS",
    entity: "Lead",
    recordId: leadId,
    oldValue: { status: oldStatusStr },
    newValue: { status: newStatus, note: noteContent ?? null },
  });

  return (await getLeadById(leadId))!;
}

/**
 * Menambahkan catatan tindak lanjut sales pada lead
 */
export async function addLeadNote(
  leadId: string,
  content: string,
  authorId?: string
): Promise<LeadNoteRecord> {
  const note = await db.leadNote.create({
    data: {
      leadId,
      authorId: authorId ?? null,
      content: content.trim(),
    },
    include: {
      author: { select: { name: true } },
    },
  });

  await recordAuditLog({
    userId: authorId,
    action: "ADD_LEAD_NOTE",
    entity: "LeadNote",
    recordId: note.id,
    newValue: { leadId, content: note.content },
  });

  return {
    id: note.id,
    leadId: note.leadId,
    authorId: note.authorId,
    authorName: note.author?.name ?? null,
    content: note.content,
    createdAt: note.createdAt.toISOString(),
  };
}

/**
 * Menghitung metrik agregat permohonan demo
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
    if (item.status === PrismaLeadStatus.NEW) newCount = count;
    else if (item.status === PrismaLeadStatus.CONTACTED) contactedCount = count;
    else if (item.status === PrismaLeadStatus.SCHEDULED) scheduledCount = count;
    else if (item.status === PrismaLeadStatus.COMPLETED) completedCount = count;
  }

  return {
    total,
    new: newCount,
    contacted: contactedCount,
    scheduled: scheduledCount,
    completed: completedCount,
  };
}
