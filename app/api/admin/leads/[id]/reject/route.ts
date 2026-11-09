import { NextRequest } from "next/server";
import { rejectLeadController } from "@/lib/controllers/lead.controller";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return rejectLeadController(request, params.id);
}

