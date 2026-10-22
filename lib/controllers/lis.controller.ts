import { NextRequest, NextResponse } from "next/server";
import { getTestCatalog, ensureDefaultCatalog } from "@/lib/models/catalog.model";
import { searchPatients, createPatient, listPatients } from "@/lib/models/patient.model";
import { createLabOrder, getLabOrders, getLabOrderById } from "@/lib/models/order.model";
import { receiveSpecimen, rejectSpecimen } from "@/lib/models/specimen.model";
import { listPhysicians } from "@/lib/models/physician.model";
import { getCurrentSession } from "@/lib/auth-session";
import { ApiResponse, OrderPriority } from "@/types";

/**
 * Controller untuk mengambil daftar katalog tes lab
 */
export async function getCatalogController(): Promise<NextResponse<ApiResponse>> {
  try {
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
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    if (search && search.trim() !== "") {
      const results = await searchPatients(search);
      return NextResponse.json<ApiResponse>(
        { success: true, message: "Hasil pencarian pasien.", data: results },
        { status: 200 }
      );
    }

    const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 20;

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
    const body = await request.json();
    if (!body.mrn || !body.name || !body.birthDate || !body.sex) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Field mrn, name, birthDate, dan sex wajib diisi." },
        { status: 400 }
      );
    }

    const patient = await createPatient(body);
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
    const isDuplicate = error.code === "P2002";
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: isDuplicate
          ? "Nomor Rekam Medis (MRN) ini sudah terdaftar di sistem."
          : error.message || "Gagal mendaftarkan pasien.",
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
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "all";
    const priority = searchParams.get("priority") || "all";
    const search = searchParams.get("search") || undefined;
    const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 15;

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
    const session = await getCurrentSession();
    const body = await request.json();

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
      userId: session?.userId || null,
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
        message: error.message || "Gagal membuat order lab.",
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
    const session = await getCurrentSession();
    const receiverName = session?.name || "Petugas Lab";

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
        message: error.message || "Gagal mencatat penerimaan spesimen.",
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
    const session = await getCurrentSession();
    const body = await request.json();

    if (!body.reason || !body.reason.trim()) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Alasan penolakan spesimen wajib diisi." },
        { status: 400 }
      );
    }

    const rejecterName = session?.name || "Petugas Lab";
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
        message: error.message || "Gagal menolak spesimen.",
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

