import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth-session";
import { db } from "@/lib/db";
import { ApiResponse } from "@/types";
import path from "path";
import fs from "fs/promises";

export const dynamic = "force-dynamic";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg+xml",
]);

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

/**
 * Membersihkan nama file dari karakter berbahaya dan path traversal
 */
function sanitizeFileName(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
  const baseName = path.basename(fileName, ext);
  const cleanBase = baseName
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 50);
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  return `${cleanBase}-${timestamp}-${randomSuffix}${ext}`;
}

/**
 * POST /api/admin/cms/upload
 * Menerima unggahan file gambar dari ADMIN (single atau multiple / folder upload)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Akses ditolak. Fitur khusus Administrator." },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const singleFile = formData.get("file") as File | null;

    const fileList: File[] = [];
    if (singleFile && singleFile instanceof File) {
      fileList.push(singleFile);
    }
    if (files && files.length > 0) {
      for (const f of files) {
        if (f instanceof File && !fileList.some((item) => item.name === f.name && item.size === f.size)) {
          fileList.push(f);
        }
      }
    }

    if (fileList.length === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Tidak ada file gambar yang diunggah." },
        { status: 400 }
      );
    }

    // Direktori penyimpanan file publik
    const uploadDir = path.join(process.cwd(), "public", "uploads", "cms");
    await fs.mkdir(uploadDir, { recursive: true });

    const results: Array<{
      id: string;
      originalName: string;
      filename: string;
      url: string;
      sizeBytes: number;
      mimeType: string;
    }> = [];

    const errors: string[] = [];

    for (const file of fileList) {
      // 1. Validasi Tipe MIME
      let mimeType = file.type.toLowerCase();
      // Fallback jika browser mengirim application/octet-stream untuk webp/svg
      if (mimeType === "application/octet-stream" || !mimeType) {
        const ext = path.extname(file.name).toLowerCase();
        if (ext === ".webp") mimeType = "image/webp";
        else if (ext === ".svg") mimeType = "image/svg+xml";
        else if (ext === ".png") mimeType = "image/png";
        else if (ext === ".jpg" || ext === ".jpeg") mimeType = "image/jpeg";
      }

      if (!ALLOWED_MIME_TYPES.has(mimeType)) {
        errors.push(`File '${file.name}' memiliki format tidak didukung (${mimeType}). Hanya JPG, PNG, WEBP, dan SVG yang diizinkan.`);
        continue;
      }

      // 2. Validasi Ukuran File
      if (file.size > MAX_FILE_SIZE_BYTES) {
        errors.push(`File '${file.name}' melebihi batas ukuran maksimal 10MB.`);
        continue;
      }

      // 3. Konversi ke Buffer & Simpan
      const buffer = Buffer.from(await file.arrayBuffer());

      // Sanitasi SVG sederhana (cegah script injection)
      if (mimeType === "image/svg+xml") {
        const svgContent = buffer.toString("utf8");
        if (/<script[\s\S]*?>[\s\S]*?<\/script>/i.test(svgContent) || /onload\s*=/i.test(svgContent) || /javascript:/i.test(svgContent)) {
          errors.push(`File SVG '${file.name}' ditolak karena mengandung script atau event handler tidak aman.`);
          continue;
        }
      }

      const safeFileName = sanitizeFileName(file.name);
      const filePath = path.join(uploadDir, safeFileName);
      await fs.writeFile(filePath, buffer);

      const publicUrl = `/uploads/cms/${safeFileName}`;

      results.push({
        id: safeFileName,
        originalName: file.name,
        filename: safeFileName,
        url: publicUrl,
        sizeBytes: file.size,
        mimeType,
      });
    }

    if (results.length === 0) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Gagal mengunggah file gambar.",
          errors: { files: errors },
        },
        { status: 400 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: `${results.length} gambar berhasil diunggah.`,
      data: {
        file: results[0], // kembalian untuk single upload
        files: results,   // kembalian untuk bulk/folder upload
        errors: errors.length > 0 ? errors : undefined,
      },
    });
  } catch (error: unknown) {
    console.error("Upload CMS error:", error);
    const err = error as { message?: string };
    return NextResponse.json<ApiResponse>(
      { success: false, message: err?.message || "Terjadi kesalahan internal saat memproses unggahan file." },
      { status: 500 }
    );
  }
}
