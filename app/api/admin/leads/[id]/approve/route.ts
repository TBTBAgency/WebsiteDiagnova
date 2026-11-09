import { NextRequest } from "next/server";
import { approveLeadController } from "@/lib/controllers/lead.controller";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return approveLeadController(request, params.id);
}

