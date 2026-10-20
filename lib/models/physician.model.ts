import { db } from "@/lib/db";

export interface PhysicianDTO {
  id: string;
  externalCode: string;
  name: string;
  specialization: string;
  department: string;
}

/**
 * Mengambil daftar dokter pengirim dari database
 */
export async function listPhysicians(): Promise<PhysicianDTO[]> {
  const physicians = await db.physician.findMany({
    orderBy: { name: "asc" },
  });

  return physicians.map((p) => ({
    id: p.id,
    externalCode: p.externalCode,
    name: p.name,
    specialization: p.specialization,
    department: p.department,
  }));
}

/**
 * Mengambil detail dokter pengirim berdasarkan ID
 */
export async function getPhysicianById(id: string): Promise<PhysicianDTO | null> {
  const physician = await db.physician.findUnique({
    where: { id },
  });

  if (!physician) return null;

  return {
    id: physician.id,
    externalCode: physician.externalCode,
    name: physician.name,
    specialization: physician.specialization,
    department: physician.department,
  };
}
