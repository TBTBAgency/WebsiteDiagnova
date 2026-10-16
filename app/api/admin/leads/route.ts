import { NextRequest } from "next/server";
import { getLeadsController } from "@/lib/controllers/lead.controller";

export async function GET(request: NextRequest) {
  return getLeadsController(request);
}
