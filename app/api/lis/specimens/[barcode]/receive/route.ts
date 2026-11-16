import { NextRequest } from "next/server";
import { receiveSpecimenController } from "@/lib/controllers/lis.controller";
import { requireAdmin } from "@/lib/authz";

export async function POST(
  request: NextRequest,
  { params }: { params: { barcode: string } }
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  return receiveSpecimenController(request, params.barcode);
}
