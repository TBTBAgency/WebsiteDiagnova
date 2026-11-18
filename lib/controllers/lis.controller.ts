import { NextRequest, NextResponse } from "next/server";
import { getTestCatalog, ensureDefaultCatalog } from "@/lib/models/catalog.model";
import { searchPatients, createPatient, listPatients } from "@/lib/models/patient.model";
import { createLabOrder, getLabOrders, getLabOrderById } from "@/lib/models/order.model";
import { receiveSpecimen, rejectSpecimen } from "@/lib/models/specimen.model";
import { listPhysicians } from "@/lib/models/physician.model";
import { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/auth-guard";
import { ApiResponse, OrderPriority } from "@/types";

/**
 * Seluruh operasi LIS (data pasien, order, spesimen, katalog, dokter) hanya untuk ADMIN.
 * Diverifikasi di setiap handler (cek ulang ke database), tidak hanya di middleware/UI.
 */

/** Batas ukuran halaman daftar LIS agar satu request tidak dapat mengambil seluruh data pasien. */
const MAX_PAGE_SIZE = 100;

/** Parse query integer dengan default & batas (NaN / di luar rentang => dijepit). */
function clampInt(raw: string | null, fallback: number, min: number, max: number): number {
  const n = raw === null ? fallback : parseInt(raw, 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

/**
 * Pesan error yang aman dikirim ke klien. Error Prisma dapat memuat isi query/input
 * (mis. NIK, nama pasien) sehingga tidak pernah diteruskan; hanya pesan domain dari
 * model LIS (Error biasa) yang boleh tampil.
 */
function safeLisErrorMessage(error: unknown, fallback: string): string {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientUnknownRequestError ||
    error instanceof Prisma.PrismaClientValidationError ||
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientRustPanicError
  ) {
    return fallback;
  }
  if (error instanceof SyntaxError) return "Format data permintaan tidak valid.";
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

async function readJsonBody(request: NextRequest): Promise<Record<string, any> | null> {
  try {
    const body = await request.json();
    return body && typeof body === "object" ? body : null;
  } catch {
    return null;
  }
}

const invalidBodyResponse = () =>
  NextResponse.json<ApiResponse>({ success: false, message: "Format data permintaan tidak valid." }, { status: 400 });

/**
 * Controller untuk mengambil daftar katalog tes lab
 */
export async function getCatalogController(): Promise<NextResponse<ApiResponse>> {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;
    await ensureDefaultCatalog(); // Pastikan tes default RS tersedia
    const catalog = await getTestCatalog();

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Katalog pemeriksaan lab berhasil dimuat.",
        data: catalog,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("getCatalogController error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Gagal memuat katalog tes lab." },
      { status: 500 }
    );
  }
}

/**
 * Controller untuk mencari atau menampilkan daftar pasien
 */
export async function getPatientsController(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    if (search && search.trim() !== "") {
      const results = await searchPatients(search);
      return NextResponse.json<ApiResponse>(
        { success: true, message: "Hasil pencarian pasien.", data: results },
        { status: 200 }
      );
    }

    const page = clampInt(searchParams.get("page"), 1, 1, 100000);
    const limit = clampInt(searchParams.get("limit"), 20, 1, MAX_PAGE_SIZE);

    const list = await listPatients(page, limit);
    return NextResponse.json<ApiResponse>(
      { success: true, message: "Daftar pasien.", data: list },
      { status: 200 }
    );
  } catch (error) {
    console.error("getPatientsController error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Gagal memuat data pasien." },
      { status: 500 }
    );
  }
}

/**
 * Controller untuk mendaftarkan pasien baru
 */
export async function createPatientController(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;

    const body = await readJsonBody(request);
    if (!body) return invalidBodyResponse();
    if (!body.mrn || !body.name || !body.birthDate || !body.sex) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Field mrn, name, birthDate, dan sex wajib diisi." },
        { status: 400 }
      );
    }

    const patient = await createPatient(body as Parameters<typeof createPatient>[0]);
    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Data pasien berhasil didaftarkan.",
        data: patient,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("createPatientController error:", error);
    const isDuplicate = error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: isDuplicate
          ? "Nomor Rekam Medis (MRN) ini sudah terdaftar di sistem."
          : safeLisErrorMessage(error, "Gagal mendaftarkan pasien."),
      },
      { status: isDuplicate ? 409 : 500 }
    );
  }
}

/**
 * Controller untuk mengambil worklist Lab Orders
 */
export async function getOrdersController(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "all";
    const priority = searchParams.get("priority") || "all";
    const search = searchParams.get("search") || undefined;
    const page = clampInt(searchParams.get("page"), 1, 1, 100000);
    const limit = clampInt(searchParams.get("limit"), 15, 1, MAX_PAGE_SIZE);

    const data = await getLabOrders({ status, priority, search, page, limit });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Worklist order lab berhasil dimuat.",
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("getOrdersController error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Gagal memuat daftar order lab." },
      { status: 500 }
    );
  }
}

/**
 * Controller untuk mengambil detail single order
 */
export async function getOrderDetailController(
  request: NextRequest,
  id: string
): Promise<NextResponse<ApiResponse>> {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;

    const order = await getLabOrderById(id);
    if (!order) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Order lab tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Detail order lab berhasil dimuat.",
        data: order,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("getOrderDetailController error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Gagal memuat detail order." },
      { status: 500 }
    );
  }
}

/**
 * Controller untuk membuat Lab Order baru + kalkulasi tabung spesimen + generate barcode unik
 */
export async function createOrderController(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;
    const session = guard.session;

    const body = await readJsonBody(request);
    if (!body) return invalidBodyResponse();

    if (!body.patientId || !body.testCatalogCodes || body.testCatalogCodes.length === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Pasien dan item pemeriksaan laboratorium wajib dipilih." },
        { status: 400 }
      );
    }

    const order = await createLabOrder({
      patientId: body.patientId,
      physicianId: body.physicianId || null,
      sourceLocation: body.sourceLocation || "Poliklinik",
      priority: (body.priority as OrderPriority) || "routine",
      clinicalNotes: body.clinicalNotes || null,
      testCatalogCodes: body.testCatalogCodes,
      userId: session.userId,
    });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: `Order ${order.orderNumber} berhasil dibuat dengan ${order.specimens.length} barcode tabung spesimen.`,
        data: order,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("createOrderController error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: safeLisErrorMessage(error, "Gagal membuat order lab."),
      },
      { status: 500 }
    );
  }
}

/**
 * Controller untuk mencatat penerimaan spesimen di lab (Check-in spesimen)
 */
export async function receiveSpecimenController(
  request: NextRequest,
  barcode: string
): Promise<NextResponse<ApiResponse>> {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;
    const receiverName = guard.session.name;

    const updated = await receiveSpecimen(barcode, receiverName);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: `Spesimen barcode ${barcode} berhasil diterima di meja lab.`,
        data: updated,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("receiveSpecimenController error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: safeLisErrorMessage(error, "Gagal mencatat penerimaan spesimen."),
      },
      { status: 400 }
    );
  }
}

/**
 * Controller untuk menolak spesimen lab (Specimen Rejection)
 */
export async function rejectSpecimenController(
  request: NextRequest,
  barcode: string
): Promise<NextResponse<ApiResponse>> {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;
    const session = guard.session;

    const body = await readJsonBody(request);
    if (!body) return invalidBodyResponse();

    if (typeof body.reason !== "string" || !body.reason.trim()) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Alasan penolakan spesimen wajib diisi." },
        { status: 400 }
      );
    }

    const rejecterName = session.name;
    const updated = await rejectSpecimen(barcode, body.reason, rejecterName);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: `Spesimen barcode ${barcode} ditolak. Alasan: ${body.reason}`,
        data: updated,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("rejectSpecimenController error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: safeLisErrorMessage(error, "Gagal menolak spesimen."),
      },
      { status: 400 }
    );
  }
}

/**
 * Controller untuk mengambil daftar dokter pengirim
 */
export async function getPhysiciansController(): Promise<NextResponse<ApiResponse>> {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;
    const physicians = await listPhysicians();
    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Daftar dokter pengirim berhasil dimuat.",
        data: physicians,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("getPhysiciansController error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Gagal memuat daftar dokter." },
      { status: 500 }
    );
  }
}

