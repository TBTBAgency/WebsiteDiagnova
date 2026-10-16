import { NextRequest } from "next/server";
import { getOrderDetailController } from "@/lib/controllers/lis.controller";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return getOrderDetailController(request, params.id);
}
