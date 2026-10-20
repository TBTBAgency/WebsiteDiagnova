import { db } from "@/lib/db";
import {
  LabOrderRecord,
  OrderPriority,
  OrderStatus,
} from "@/types";
import {
  OrderPriority as PrismaOrderPriority,
  OrderStatus as PrismaOrderStatus,
  SpecimenStatus as PrismaSpecimenStatus,
  SpecimenType as PrismaSpecimenType,
  TubeColor as PrismaTubeColor,
  Prisma,
} from "@prisma/client";
import { prismaGenderToSex } from "./patient.model";
import { prismaSpecimenToType, prismaTubeToColor } from "./catalog.model";
import { prismaStatusToSpecimenStatus } from "./specimen.model";
import { recordAuditLog } from "./audit.model";

export const prismaPriorityToOrderPriority: Record<PrismaOrderPriority, OrderPriority> = {
  [PrismaOrderPriority.ROUTINE]: "routine",
  [PrismaOrderPriority.CITO]: "cito",
  [PrismaOrderPriority.URGENT]: "urgent",
};

export const orderPriorityToPrisma: Record<OrderPriority, PrismaOrderPriority> = {
  routine: PrismaOrderPriority.ROUTINE,
  cito: PrismaOrderPriority.CITO,
  urgent: PrismaOrderPriority.URGENT,
};

export const prismaStatusToOrderStatus: Record<PrismaOrderStatus, OrderStatus> = {
  [PrismaOrderStatus.ORDERED]: "ordered",
  [PrismaOrderStatus.SPECIMEN_RECEIVED]: "specimen_received",
  [PrismaOrderStatus.PROCESSING]: "processing",
  [PrismaOrderStatus.PARTIALLY_VALIDATED]: "partially_validated",
  [PrismaOrderStatus.COMPLETED]: "completed",
  [PrismaOrderStatus.CANCELLED]: "cancelled",
};

export const orderStatusToPrisma: Record<OrderStatus, PrismaOrderStatus> = {
  ordered: PrismaOrderStatus.ORDERED,
  specimen_received: PrismaOrderStatus.SPECIMEN_RECEIVED,
  processing: PrismaOrderStatus.PROCESSING,
  partially_validated: PrismaOrderStatus.PARTIALLY_VALIDATED,
  completed: PrismaOrderStatus.COMPLETED,
  cancelled: PrismaOrderStatus.CANCELLED,
};

export interface CreateLabOrderInput {
  patientId: string;
  physicianId?: string | null;
  sourceLocation: string; // misal IGD, Rawat Inap, Poli
  priority: OrderPriority;
  clinicalNotes?: string | null;
  testCatalogCodes: string[];
  userId?: string | null;
}

/**
 * Generate nomor order unik berurutan: ORD-YYYYMMDD-XXXX
 */
async function generateOrderNumber(): Promise<string> {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const datePrefix = `ORD-${year}${month}${day}-`;

  const lastOrder = await db.labOrder.findFirst({
    where: { orderNumber: { startsWith: datePrefix } },
    orderBy: { orderNumber: "desc" },
    select: { orderNumber: true },
  });

  let nextSequence = 1;
  if (lastOrder && lastOrder.orderNumber) {
    const parts = lastOrder.orderNumber.split("-");
    const lastSeq = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(lastSeq)) {
      nextSequence = lastSeq + 1;
    }
  }

  return `${datePrefix}${String(nextSequence).padStart(4, "0")}`;
}

/**
 * Mendapatkan sequence barcode berikutnya
 */
async function getNextBarcodeSequence(): Promise<number> {
  const today = new Date();
  const yy = String(today.getFullYear()).slice(-2);
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const prefix = `SP-${yy}${mm}${dd}-`;

  const lastSpecimen = await db.specimen.findFirst({
    where: { barcodeNumber: { startsWith: prefix } },
    orderBy: { barcodeNumber: "desc" },
    select: { barcodeNumber: true },
  });

  let nextSeq = 1;
  if (lastSpecimen && lastSpecimen.barcodeNumber) {
    const parts = lastSpecimen.barcodeNumber.split("-");
    const parsed = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(parsed)) {
      nextSeq = parsed + 1;
    }
  }

  return nextSeq;
}

/**
 * Membuat Lab Order baru secara atomik dengan perhitungan tabung spesimen otomatis
 */
export async function createLabOrder(input: CreateLabOrderInput): Promise<LabOrderRecord> {
  if (!input.testCatalogCodes || input.testCatalogCodes.length === 0) {
    throw new Error("Pilih minimal satu item pemeriksaan laboratorium");
  }

  // 1. Ambil data katalog tes
  const testItems = await db.testCatalog.findMany({
    where: {
      code: { in: input.testCatalogCodes.map((c) => c.toUpperCase()) },
      isActive: true,
    },
  });

  if (testItems.length === 0) {
    throw new Error("Item pemeriksaan laboratorium yang dipilih tidak valid");
  }

  // 2. Kelompokkan tes berdasarkan kombinasi specimenType dan tubeColor
  // (Tes yang menggunakan tabung yang sama cukup mengambil 1 tabung!)
  const tubeMap = new Map<
    string,
    { specimenType: PrismaSpecimenType; tubeColor: PrismaTubeColor }
  >();
  for (const item of testItems) {
    const key = `${item.specimenType}_${item.tubeColor}`;
    if (!tubeMap.has(key)) {
      tubeMap.set(key, {
        specimenType: item.specimenType,
        tubeColor: item.tubeColor,
      });
    }
  }

  const orderNumber = await generateOrderNumber();
  const prismaPriority = orderPriorityToPrisma[input.priority] ?? PrismaOrderPriority.ROUTINE;

  let currentBarcodeSeq = await getNextBarcodeSequence();
  const today = new Date();
  const yy = String(today.getFullYear()).slice(-2);
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const barcodePrefix = `SP-${yy}${mm}${dd}-`;

  // 3. Eksekusi database transaction
  const createdOrder = await db.$transaction(async (tx) => {
    // A. Buat Order
    const order = await tx.labOrder.create({
      data: {
        orderNumber,
        patientId: input.patientId,
        physicianId: input.physicianId || null,
        sourceLocation: input.sourceLocation || "Poliklinik",
        priority: prismaPriority,
        clinicalNotes: input.clinicalNotes?.trim() || null,
        status: PrismaOrderStatus.ORDERED,
      },
    });

    // B. Buat Order Items
    await tx.labOrderItem.createMany({
      data: testItems.map((test) => ({
        orderId: order.id,
        testCatalogId: test.id,
      })),
    });

    // C. Buat Spesimen & Barcode Unik untuk setiap tabung yang dibutuhkan
    const tubeList = Array.from(tubeMap.values());
    for (const tube of tubeList) {
      const barcodeNumber = `${barcodePrefix}${String(currentBarcodeSeq++).padStart(4, "0")}`;
      await tx.specimen.create({
        data: {
          barcodeNumber,
          orderId: order.id,
          specimenType: tube.specimenType,
          tubeColor: tube.tubeColor,
          volume: "3.0 mL",
          collectedAt: new Date(),
          status: PrismaSpecimenStatus.COLLECTED,
        },
      });
    }

    return order;
  });

  // 4. Catat jejak audit
  await recordAuditLog({
    userId: input.userId,
    action: "CREATE_LAB_ORDER",
    entity: "LabOrder",
    recordId: createdOrder.id,
    newValue: {
      orderNumber,
      patientId: input.patientId,
      priority: input.priority,
      itemsCount: testItems.length,
      tubesCount: tubeMap.size,
    },
  });

  return (await getLabOrderById(createdOrder.id))!;
}

/**
 * Mengambil detail lengkap Lab Order berdasarkan ID
 */
export async function getLabOrderById(id: string): Promise<LabOrderRecord | null> {
  const order = await db.labOrder.findUnique({
    where: { id },
    include: {
      patient: true,
      physician: true,
      items: {
        include: {
          testCatalog: true,
        },
      },
      specimens: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!order) return null;

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    patientId: order.patientId,
    patient: {
      id: order.patient.id,
      mrn: order.patient.mrn,
      nationalId: order.patient.nationalId,
      name: order.patient.name,
      birthDate: order.patient.birthDate.toISOString(),
      sex: prismaGenderToSex[order.patient.sex],
      phone: order.patient.phone,
      address: order.patient.address,
      createdAt: order.patient.createdAt.toISOString(),
    },
    physicianId: order.physicianId,
    physician: order.physician
      ? {
          id: order.physician.id,
          externalCode: order.physician.externalCode,
          name: order.physician.name,
          specialization: order.physician.specialization,
          department: order.physician.department,
        }
      : null,
    sourceLocation: order.sourceLocation,
    priority: prismaPriorityToOrderPriority[order.priority],
    clinicalNotes: order.clinicalNotes,
    status: prismaStatusToOrderStatus[order.status],
    orderedAt: order.orderedAt.toISOString(),
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((it) => ({
      id: it.id,
      testCatalogId: it.testCatalogId,
      testCatalog: {
        id: it.testCatalog.id,
        code: it.testCatalog.code,
        name: it.testCatalog.name,
        category: it.testCatalog.category,
        specimenType: prismaSpecimenToType[it.testCatalog.specimenType],
        tubeColor: prismaTubeToColor[it.testCatalog.tubeColor],
        unit: it.testCatalog.unit,
        tatMinutes: it.testCatalog.tatMinutes,
        isActive: it.testCatalog.isActive,
      },
    })),
    specimens: order.specimens.map((sp) => ({
      id: sp.id,
      barcodeNumber: sp.barcodeNumber,
      orderId: sp.orderId,
      specimenType: prismaSpecimenToType[sp.specimenType],
      tubeColor: prismaTubeToColor[sp.tubeColor],
      volume: sp.volume,
      collectedAt: sp.collectedAt?.toISOString() || null,
      receivedAt: sp.receivedAt?.toISOString() || null,
      status: prismaStatusToSpecimenStatus[sp.status],
      rejectionReason: sp.rejectionReason,
      rejectedBy: sp.rejectedBy,
      rejectedAt: sp.rejectedAt?.toISOString() || null,
      receivedBy: sp.receivedBy,
      createdAt: sp.createdAt.toISOString(),
    })),
  };
}

/**
 * Mengambil daftar lab orders dengan filter status, prioritas, dan pagination
 */
export async function getLabOrders(options?: {
  status?: string;
  priority?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{
  orders: LabOrderRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const page = Math.max(1, options?.page ?? 1);
  const limit = Math.max(1, Math.min(100, options?.limit ?? 15));
  const skip = (page - 1) * limit;

  const where: Prisma.LabOrderWhereInput = {};

  if (options?.status && options.status !== "all") {
    where.status = orderStatusToPrisma[options.status as OrderStatus];
  }

  if (options?.priority && options.priority !== "all") {
    where.priority = orderPriorityToPrisma[options.priority as OrderPriority];
  }

  if (options?.search && options.search.trim() !== "") {
    const s = options.search.trim();
    where.OR = [
      { orderNumber: { contains: s, mode: "insensitive" } },
      { patient: { name: { contains: s, mode: "insensitive" } } },
      { patient: { mrn: { contains: s, mode: "insensitive" } } },
      { sourceLocation: { contains: s, mode: "insensitive" } },
    ];
  }

  const [records, total] = await Promise.all([
    db.labOrder.findMany({
      where,
      skip,
      take: limit,
      orderBy: [
        // CITO / STAT didahulukan di atas Rutin!
        { priority: "asc" },
        { orderedAt: "desc" },
      ],
      include: {
        patient: true,
        physician: true,
        items: {
          include: { testCatalog: true },
        },
        specimens: true,
      },
    }),
    db.labOrder.count({ where }),
  ]);

  const orders: LabOrderRecord[] = records.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    patientId: order.patientId,
    patient: {
      id: order.patient.id,
      mrn: order.patient.mrn,
      nationalId: order.patient.nationalId,
      name: order.patient.name,
      birthDate: order.patient.birthDate.toISOString(),
      sex: prismaGenderToSex[order.patient.sex],
      phone: order.patient.phone,
      address: order.patient.address,
      createdAt: order.patient.createdAt.toISOString(),
    },
    physicianId: order.physicianId,
    physician: order.physician
      ? {
          id: order.physician.id,
          externalCode: order.physician.externalCode,
          name: order.physician.name,
          specialization: order.physician.specialization,
          department: order.physician.department,
        }
      : null,
    sourceLocation: order.sourceLocation,
    priority: prismaPriorityToOrderPriority[order.priority],
    clinicalNotes: order.clinicalNotes,
    status: prismaStatusToOrderStatus[order.status],
    orderedAt: order.orderedAt.toISOString(),
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((it) => ({
      id: it.id,
      testCatalogId: it.testCatalogId,
      testCatalog: {
        id: it.testCatalog.id,
        code: it.testCatalog.code,
        name: it.testCatalog.name,
        category: it.testCatalog.category,
        specimenType: prismaSpecimenToType[it.testCatalog.specimenType],
        tubeColor: prismaTubeToColor[it.testCatalog.tubeColor],
        unit: it.testCatalog.unit,
        tatMinutes: it.testCatalog.tatMinutes,
        isActive: it.testCatalog.isActive,
      },
    })),
    specimens: order.specimens.map((sp) => ({
      id: sp.id,
      barcodeNumber: sp.barcodeNumber,
      orderId: sp.orderId,
      specimenType: prismaSpecimenToType[sp.specimenType],
      tubeColor: prismaTubeToColor[sp.tubeColor],
      volume: sp.volume,
      collectedAt: sp.collectedAt?.toISOString() || null,
      receivedAt: sp.receivedAt?.toISOString() || null,
      status: prismaStatusToSpecimenStatus[sp.status],
      rejectionReason: sp.rejectionReason,
      rejectedBy: sp.rejectedBy,
      rejectedAt: sp.rejectedAt?.toISOString() || null,
      receivedBy: sp.receivedBy,
      createdAt: sp.createdAt.toISOString(),
    })),
  }));

  return {
    orders,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
}
