import { exportLeadsCsvController } from "@/lib/controllers/lead.controller";

export const dynamic = "force-dynamic";

export async function GET() {
  return exportLeadsCsvController();
}
