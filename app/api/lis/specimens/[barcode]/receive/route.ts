import { NextRequest } from "next/server";
import { receiveSpecimenController } from "@/lib/controllers/lis.controller";

export async function POST(
  request: NextRequest,
  { params }: { params: { barcode: string } }
) {
  return receiveSpecimenController(request, params.barcode);
}
