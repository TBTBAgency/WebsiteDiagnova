import { NextRequest } from "next/server";
import { completeLeadController } from "@/lib/controllers/lead.controller";

export const dynamic = "force-dynamic";

/** POST /api/admin/leads/[id]/complete — admin mengonfirmasi demo selesai (Jadwal Demo -> Selesai). */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  return completeLeadController(request, params.id);
}
