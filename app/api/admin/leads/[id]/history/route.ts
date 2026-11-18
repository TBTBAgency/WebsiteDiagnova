import { NextRequest } from "next/server";
import { getLeadHistoryController } from "@/lib/controllers/lead.controller";

export const dynamic = "force-dynamic";

/** GET /api/admin/leads/[id]/history — riwayat magic link dan audit trail lead. */
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  return getLeadHistoryController(params.id);
}
