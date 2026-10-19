import { NextRequest } from "next/server";
import { logoutController } from "@/lib/controllers/auth.controller";

export async function POST(request: NextRequest) {
  return logoutController(request);
}
