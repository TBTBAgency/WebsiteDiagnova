import { NextRequest } from "next/server";
import { getOrderDetailController } from "@/lib/controllers/lis.controller";
import { requireAdmin } from "@/lib/authz";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  return getOrderDetailController(request, params.id);
}
