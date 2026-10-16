import { NextRequest } from "next/server";
import { rejectSpecimenController } from "@/lib/controllers/lis.controller";

export async function POST(
  request: NextRequest,
  { params }: { params: { barcode: string } }
) {
  return rejectSpecimenController(request, params.barcode);
}
