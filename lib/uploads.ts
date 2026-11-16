import path from "path";
import { promises as fs } from "fs";
import crypto from "crypto";

/**
 * Penyimpanan file upload CMS (OD-08 — keputusan storage produksi masih PENDING).
 * File disimpan di luar folder `public/` (file runtime di `public/` tidak dijamin tersaji oleh `next start`)
 * dan disajikan oleh route `/uploads/[...path]`. Production WAJIB memakai volume persisten untuk UPLOAD_DIR
 * (atau mengganti adapter ini dengan object storage).
 * Database hanya menyimpan path publik (mis. "/uploads/cms/2026/11/abc.webp").
 */
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES: Record<string, { ext: string; magic: (b: Buffer) => boolean }> = {
  "image/png": { ext: "png", magic: (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  "image/jpeg": { ext: "jpg", magic: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  "image/webp": { ext: "webp", magic: (b) => b.subarray(0, 4).toString("ascii") === "RIFF" && b.subarray(8, 12).toString("ascii") === "WEBP" },
  "image/gif": { ext: "gif", magic: (b) => b.subarray(0, 6).toString("ascii") === "GIF87a" || b.subarray(0, 6).toString("ascii") === "GIF89a" },
};

const EXT_TO_TYPE: Record<string, string> = { png: "image/png", jpg: "image/jpeg", webp: "image/webp", gif: "image/gif" };

export function getUploadRoot(): string {
  return path.resolve(process.env.UPLOAD_DIR || path.join(process.cwd(), "storage", "uploads"));
}

/** Mendeteksi tipe dari isi file (bukan dari nama/Content-Type kiriman klien). SVG sengaja tidak diizinkan. */
export function detectImageType(buffer: Buffer): string | null {
  for (const [type, spec] of Object.entries(ALLOWED_IMAGE_TYPES)) if (spec.magic(buffer)) return type;
  return null;
}

export async function saveCmsImage(buffer: Buffer): Promise<{ url: string; contentType: string; bytes: number }> {
  const type = detectImageType(buffer);
  if (!type) throw new Error("UNSUPPORTED_TYPE");
  const now = new Date();
  const rel = path.posix.join(
    "cms",
    String(now.getUTCFullYear()),
    String(now.getUTCMonth() + 1).padStart(2, "0"),
    `${crypto.randomBytes(12).toString("hex")}.${ALLOWED_IMAGE_TYPES[type].ext}`
  );
  const target = path.join(getUploadRoot(), ...rel.split("/"));
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, buffer, { flag: "wx" });
  return { url: `/uploads/${rel}`, contentType: type, bytes: buffer.length };
}

/** Resolusi path aman (mencegah path traversal). null bila tidak valid. */
export function resolveUploadPath(segments: string[]): { file: string; contentType: string } | null {
  if (!segments.length || segments.some((s) => !/^[a-zA-Z0-9._-]+$/.test(s) || s.startsWith("."))) return null;
  const ext = segments[segments.length - 1].split(".").pop()?.toLowerCase() ?? "";
  const contentType = EXT_TO_TYPE[ext];
  if (!contentType) return null;
  const root = getUploadRoot();
  const file = path.resolve(root, ...segments);
  if (!file.startsWith(root + path.sep)) return null;
  return { file, contentType };
}
