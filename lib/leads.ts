import { DemoRequestInput, DemoRequestRecord } from "@/types";

// In-memory mock store for development / local testing
// TODO [Database Integration]: Hubungkan ke database permanen (mis. PostgreSQL via Supabase/Neon/Prisma atau MongoDB)
const inMemoryLeads: DemoRequestRecord[] = [];

/**
 * Menyimpan data lead permohonan demo Diagnova
 * @param input Data permohonan demo yang sudah tervalidasi
 * @returns Data record permohonan demo yang tersimpan
 */
export async function saveLead(
  input: DemoRequestInput
): Promise<DemoRequestRecord> {
  const record: DemoRequestRecord = {
    ...input,
    id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    status: "new",
  };

  // Mock saving to memory / console log
  inMemoryLeads.push(record);
  console.log(" [Diagnova Lead Captured]:", {
    id: record.id,
    name: record.name,
    institution: record.institution,
    email: record.email,
    phone: record.phone,
    type: record.institutionType,
    time: record.createdAt,
  });

  /*
   * TODO [Database Example Implementation]:
   * await prisma.lead.create({
   *   data: {
   *     name: input.name,
   *     institution: input.institution,
   *     jobTitle: input.jobTitle,
   *     email: input.email,
   *     phone: input.phone,
   *     institutionType: input.institutionType,
   *     notes: input.notes,
   *   }
   * });
   */

  return record;
}

/**
 * Mengambil daftar leads (helper untuk dashboard internal / debugging)
 */
export async function getLeads(): Promise<DemoRequestRecord[]> {
  return inMemoryLeads;
}
