import { db } from "@/lib/db";
import { SpecimenRecord, SpecimenStatus } from "@/types";
import {
  OrderStatus as PrismaOrderStatus,
  SpecimenStatus as PrismaSpecimenStatus,
} from "@prisma/client";
import { prismaSpecimenToType, prismaTubeToColor } from "./catalog.model";
import { recordAuditLog } from "./audit.model";

export const prismaStatusToSpecimenStatus: Record<PrismaSpecimenStatus, SpecimenStatus> = {
  [PrismaSpecimenStatus.COLLECTED]: "collected",
  [PrismaSpecimenStatus.RECEIVED_IN_LAB]: "received_in_lab",
  [PrismaSpecimenStatus.PROCESSING]: "processing",
  [PrismaSpecimenStatus.REJECTED]: "rejected",
  [PrismaSpecimenStatus.ARCHIVED]: "archived",
};

export const specimenStatusToPrisma: Record<SpecimenStatus, PrismaSpecimenStatus> = {
  collected: PrismaSpecimenStatus.COLLECTED,
  received_in_lab: PrismaSpecimenStatus.RECEIVED_IN_LAB,
  processing: PrismaSpecimenStatus.PROCESSING,
  rejected: PrismaSpecimenStatus.REJECTED,
  archived: PrismaSpecimenStatus.ARCHIVED,
};

/**
 * Mengambil informasi spesimen berdasarkan nomor barcode
 */
export async function getSpecimenByBarcode(barcodeNumber: string): Promise<SpecimenRecord | null> {
  const specimen = await db.specimen.findUnique({
    where: { barcodeNumber: barcodeNumber.trim().toUpperCase() },
  });

  if (!specimen) return null;

  return {
    id: specimen.id,
    barcodeNumber: specimen.barcodeNumber,
    orderId: specimen.orderId,
    specimenType: prismaSpecimenToType[specimen.specimenType],
    tubeColor: prismaTubeToColor[specimen.tubeColor],
    volume: specimen.volume,
    collectedAt: specimen.collectedAt?.toISOString() || null,
    receivedAt: specimen.receivedAt?.toISOString() || null,
    status: prismaStatusToSpecimenStatus[specimen.status],
    rejectionReason: specimen.rejectionReason,
    rejectedBy: specimen.rejectedBy,
    rejectedAt: specimen.rejectedAt?.toISOString() || null,
    receivedBy: specimen.receivedBy,
    createdAt: specimen.createdAt.toISOString(),
  };
}

/**
 * Mencatat penerimaan spesimen di meja lab analis (Check-in Spesimen)
 */
export async function receiveSpecimen(
  barcodeNumber: string,
  receivedBy = "Petugas Lab"
): Promise<SpecimenRecord> {
  const barcode = barcodeNumber.trim().toUpperCase();
  const existing = await db.specimen.findUnique({
    where: { barcodeNumber: barcode },
  });

  if (!existing) {
    throw new Error(`Spesimen dengan barcode ${barcode} tidak ditemukan`);
  }

  if (existing.status === PrismaSpecimenStatus.REJECTED) {
    throw new Error(`Spesimen ${barcode} telah berstatus DITOLAK (REJECTED) dan tidak dapat diterima`);
  }

  const now = new Date();

  // Transaksi pembaruan status spesimen dan order
  const updatedSpecimen = await db.$transaction(async (tx) => {
    const updated = await tx.specimen.update({
      where: { id: existing.id },
      data: {
        status: PrismaSpecimenStatus.RECEIVED_IN_LAB,
        receivedAt: now,
        receivedBy,
      },
    });

    // Cek apakah seluruh spesimen dalam order ini sudah diterima di lab
    const pendingSpecimens = await tx.specimen.count({
      where: {
        orderId: existing.orderId,
        status: PrismaSpecimenStatus.COLLECTED,
      },
    });

    if (pendingSpecimens === 0) {
      // Perbarui status order menjadi SPECIMEN_RECEIVED
      await tx.labOrder.update({
        where: { id: existing.orderId },
        data: { status: PrismaOrderStatus.SPECIMEN_RECEIVED },
      });
    }

    return updated;
  });

  // Catat jejak audit
  await recordAuditLog({
    action: "RECEIVE_SPECIMEN",
    entity: "Specimen",
    recordId: updatedSpecimen.id,
    oldValue: { status: prismaStatusToSpecimenStatus[existing.status] },
    newValue: {
      status: "received_in_lab",
      barcodeNumber: barcode,
      receivedBy,
      receivedAt: now.toISOString(),
    },
  });

  return (await getSpecimenByBarcode(barcode))!;
}

/**
 * Menolak spesimen laboratorium (Penolakan Sampel / Specimen Rejection)
 * Wajib menyertakan alasan penolakan (mis. Darah beku, Hemolisis, Tabung keliru)
 */
export async function rejectSpecimen(
  barcodeNumber: string,
  reason: string,
  rejectedBy = "Petugas Lab"
): Promise<SpecimenRecord> {
  const barcode = barcodeNumber.trim().toUpperCase();
  const cleanReason = reason.trim();

  if (!cleanReason) {
    throw new Error("Alasan penolakan spesimen wajib diisi (SOP Akreditasi Lab)");
  }

  const existing = await db.specimen.findUnique({
    where: { barcodeNumber: barcode },
  });

  if (!existing) {
    throw new Error(`Spesimen dengan barcode ${barcode} tidak ditemukan`);
  }

  const now = new Date();

  const updatedSpecimen = await db.specimen.update({
    where: { id: existing.id },
    data: {
      status: PrismaSpecimenStatus.REJECTED,
      rejectionReason: cleanReason,
      rejectedBy,
      rejectedAt: now,
    },
  });

  // Catat jejak audit penolakan sampel
  await recordAuditLog({
    action: "REJECT_SPECIMEN",
    entity: "Specimen",
    recordId: updatedSpecimen.id,
    oldValue: { status: prismaStatusToSpecimenStatus[existing.status] },
    newValue: {
      status: "rejected",
      barcodeNumber: barcode,
      reason: cleanReason,
      rejectedBy,
      rejectedAt: now.toISOString(),
    },
  });

  return (await getSpecimenByBarcode(barcode))!;
}
