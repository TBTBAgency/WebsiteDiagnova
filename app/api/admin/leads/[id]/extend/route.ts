import { NextRequest } from "next/server";
import { extendDemoAccessController } from "@/lib/controllers/lead.controller";

export const dynamic = "force-dynamic";

/** POST /api/admin/leads/[id]/extend — memperpanjang masa aktif akses demo klien. Body: { days, reason? } */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  return extendDemoAccessController(request, params.id);
}
