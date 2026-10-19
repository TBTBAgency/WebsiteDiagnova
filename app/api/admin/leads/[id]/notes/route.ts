import { NextRequest } from "next/server";
import { addLeadNoteController } from "@/lib/controllers/lead.controller";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return addLeadNoteController(request, params.id);
}
