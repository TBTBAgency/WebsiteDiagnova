import { db } from "@/lib/db";
import { PatientRecord, PatientSex } from "@/types";
import { gender as PrismaGender, Prisma } from "@prisma/client";

export const prismaGenderToSex: Record<PrismaGender, PatientSex> = {
  [PrismaGender.male]: "male",
  [PrismaGender.female]: "female",
};

export const sexToPrismaGender: Record<PatientSex, PrismaGender> = {
  male: PrismaGender.male,
  female: PrismaGender.female,
};

export interface CreatePatientInput {
  mrn: string;
  nationalId?: string | null;
  name: string;
  birthDate: string | Date;
  sex: PatientSex;
  phone?: string | null;
  address?: string | null;
}

/**
 * Mencari pasien berdasarkan No. RM atau Nama
 */
export async function searchPatients(term: string): Promise<PatientRecord[]> {
  const cleanTerm = term.trim();
  if (!cleanTerm) return [];

  const patients = await db.patient.findMany({
    where: {
      OR: [
        { mrn: { contains: cleanTerm, mode: "insensitive" } },
        { name: { contains: cleanTerm, mode: "insensitive" } },
        { nationalId: { contains: cleanTerm, mode: "insensitive" } },
        { phone: { contains: cleanTerm, mode: "insensitive" } },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return patients.map((p) => ({
    id: p.id,
    mrn: p.mrn,
    nationalId: p.nationalId,
    name: p.name,
    birthDate: p.birthDate.toISOString(),
    sex: prismaGenderToSex[p.sex],
    phone: p.phone,
    address: p.address,
    createdAt: p.createdAt.toISOString(),
  }));
}

/**
 * Mencari pasien berdasarkan No. RM
 */
export async function findPatientByMrn(mrn: string): Promise<PatientRecord | null> {
  const patient = await db.patient.findUnique({
    where: { mrn: mrn.trim().toUpperCase() },
  });

  if (!patient) return null;

  return {
    id: patient.id,
    mrn: patient.mrn,
    nationalId: patient.nationalId,
    name: patient.name,
    birthDate: patient.birthDate.toISOString(),
    sex: prismaGenderToSex[patient.sex],
    phone: patient.phone,
    address: patient.address,
    createdAt: patient.createdAt.toISOString(),
  };
}

/**
 * Mendaftarkan pasien baru ke sistem LIS
 */
export async function createPatient(input: CreatePatientInput): Promise<PatientRecord> {
  const birthDate =
    typeof input.birthDate === "string" ? new Date(input.birthDate) : input.birthDate;

  const patient = await db.patient.create({
    data: {
      mrn: input.mrn.trim().toUpperCase(),
      nationalId: input.nationalId?.trim() || null,
      name: input.name.trim(),
      birthDate,
      sex: sexToPrismaGender[input.sex],
      phone: input.phone?.trim() || null,
      address: input.address?.trim() || null,
    },
  });

  return {
    id: patient.id,
    mrn: patient.mrn,
    nationalId: patient.nationalId,
    name: patient.name,
    birthDate: patient.birthDate.toISOString(),
    sex: prismaGenderToSex[patient.sex],
    phone: patient.phone,
    address: patient.address,
    createdAt: patient.createdAt.toISOString(),
  };
}

/**
 * Mengambil daftar pasien dengan pagination
 */
export async function listPatients(page = 1, limit = 20): Promise<{
  patients: PatientRecord[];
  total: number;
}> {
  const skip = (Math.max(1, page) - 1) * limit;

  const [records, total] = await Promise.all([
    db.patient.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    db.patient.count(),
  ]);

  return {
    patients: records.map((p) => ({
      id: p.id,
      mrn: p.mrn,
      nationalId: p.nationalId,
      name: p.name,
      birthDate: p.birthDate.toISOString(),
      sex: prismaGenderToSex[p.sex],
      phone: p.phone,
      address: p.address,
      createdAt: p.createdAt.toISOString(),
    })),
    total,
  };
}
