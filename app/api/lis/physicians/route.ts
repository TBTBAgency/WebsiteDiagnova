import { NextRequest } from "next/server";
import { getPhysiciansController } from "@/lib/controllers/lis.controller";

export async function GET() {
  return getPhysiciansController();
}
