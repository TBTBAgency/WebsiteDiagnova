export {
  createLead as saveLead,
  getLeadsWithPagination,
  getLeadById,
  updateLeadStatus,
  approveLead,
  rejectLead,
  getLeadMetrics,
  STATUS_LABELS,
} from "./models/lead.model";

import { getLeadsWithPagination } from "./models/lead.model";
import { DemoRequestRecord } from "@/types";

export async function getLeads(): Promise<DemoRequestRecord[]> {
  const result = await getLeadsWithPagination({ limit: 100 });
  return result.leads;
}
