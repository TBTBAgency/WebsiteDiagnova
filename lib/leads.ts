/**
 * Bridge file untuk backward-compatibility dengan kode yang sebelumnya mengimpor dari @/lib/leads
 * Implementasi sebenarnya telah distandarisasi ke Layer Model: @/lib/models/lead.model
 */

export {
  createLead as saveLead,
  getLeadsWithPagination,
  getLeadById,
  updateLeadStatus,
  addLeadNote,
  getLeadMetrics,
  institutionTypeToPrisma,
  prismaToInstitutionType,
  leadStatusToPrisma,
  prismaToLeadStatus,
} from "./models/lead.model";

import { getLeadsWithPagination } from "./models/lead.model";
import { DemoRequestRecord } from "@/types";

/**
 * Mengambil daftar leads dari PostgreSQL (helper kompatibilitas)
 */
export async function getLeads(): Promise<DemoRequestRecord[]> {
  const result = await getLeadsWithPagination({ limit: 100 });
  return result.leads;
}
