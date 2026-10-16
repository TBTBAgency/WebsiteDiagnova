import { NextRequest } from "next/server";
import {
  getLeadDetailController,
  updateLeadStatusController,
} from "@/lib/controllers/lead.controller";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return getLeadDetailController(request, params.id);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return updateLeadStatusController(request, params.id);
}
