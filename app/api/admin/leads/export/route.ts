import { exportLeadsCsvController } from "@/lib/controllers/lead.controller";

export async function GET() {
  return exportLeadsCsvController();
}
