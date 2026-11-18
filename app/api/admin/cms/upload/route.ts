import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { ApiResponse } from "@/types";
import path from "path";
import crypto from "crypto";
import { saveCmsImage } from "@/lib/cms-image-storage";

export const dynamic = "force-dynamic";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

type DetectedImage = { mimeType: string; ext: string };

/**
 * Mendeteksi tipe gambar dari isi file (magic bytes), bukan dari nama file / MIME kiriman browser.
 */
function detectImageType(buffer: Buffer): DetectedImage | null {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { mimeType: "image/jpeg", ext: ".jpg" };
  }
  if (
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) {
    return { mimeType: "image/png", ext: ".png" };
  }
  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return { mimeType: "image/webp", ext: ".webp" };
  }
  const head = buffer.subarray(0, 1024).toString("utf8").replace(/^﻿/, "").trimStart().toLowerCase();
  if (head.startsWith("<svg") || (head.startsWith("<?xml") && head.includes("<svg"))) {
    return { mimeType: "image/svg+xml", ext: ".svg" };
  }
  return null;
}

/**
 * Menolak SVG yang dapat mengeksekusi script atau memuat sumber eksternal.
 */
function isUnsafeSvg(content: string): boolean {
  const c = content.toLowerCase();
  return (
    /<script/.test(c) ||
    /\son[a-z]+\s*=/.test(c) ||
    /javascript:/.test(c) ||
    /<foreignobject/.test(c) ||
    /<(iframe|embed|object|audio|video)/.test(c) ||
    /<!entity/.test(c) ||
    /(?:xlink:)?href\s*=\s*["']\s*(?!#|data:image\/(?:png|jpeg|webp|gif);)/.test(c)
  );
}

/**
 * Membuat nama file aman: nama asli disanitasi, ekstensi diambil dari tipe hasil deteksi.
 */
function buildSafeFileName(originalName: string, ext: string): string {
  const baseName = path.basename(originalName, path.extname(originalName));
  const cleanBase =
    baseName
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .substring(0, 50) || "image";
  return `${cleanBase}-${Date.now()}-${crypto.randomBytes(4).toString("hex")}${ext}`;
}

/**
 * POST /api/admin/cms/upload
 * Menerima unggahan file gambar dari ADMIN (single atau multiple / folder upload)
 */
export async function POST(request: NextRequest) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;
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

    // Penyimpanan: Vercel Blob di Vercel, public/uploads/cms di lokal (lihat lib/cms-image-storage.ts)

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
      // 1. Validasi Ukuran File
      if (file.size > MAX_FILE_SIZE_BYTES) {
        errors.push(`File '${file.name}' melebihi batas ukuran maksimal 10MB.`);
        continue;
      }

      // 2. Validasi tipe berdasarkan isi file (magic bytes)
      const buffer = Buffer.from(await file.arrayBuffer());
      const detected = detectImageType(buffer);
      if (!detected) {
        errors.push(`File '${file.name}' bukan gambar yang didukung. Hanya JPG, PNG, WEBP, dan SVG yang diizinkan.`);
        continue;
      }
      const mimeType = detected.mimeType;

      // 3. SVG wajib bebas script / event handler / referensi eksternal
      if (mimeType === "image/svg+xml" && isUnsafeSvg(buffer.toString("utf8"))) {
        errors.push(`File SVG '${file.name}' ditolak karena mengandung script, event handler, atau referensi eksternal.`);
        continue;
      }

      const safeFileName = buildSafeFileName(file.name, detected.ext);
      await saveCmsImage(safeFileName, buffer, mimeType);

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
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Terjadi kesalahan internal saat memproses unggahan file." },
      { status: 500 }
    );
  }
}
