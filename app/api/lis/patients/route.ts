import { NextRequest } from "next/server";
import {
  getPatientsController,
  createPatientController,
} from "@/lib/controllers/lis.controller";
import { requireAdmin } from "@/lib/authz";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  return getPatientsController(request);
}

export async function POST(request: NextRequest) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  return createPatientController(request);
}
