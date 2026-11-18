import path from "path";
import fs from "fs/promises";
import { get, put } from "@vercel/blob";

/**
 * Penyimpanan gambar CMS.
 *
 * - Di Vercel (ada kredensial Blob): file disimpan di Vercel Blob store **private** dengan pathname
 *   `cms/<nama-file>`. Filesystem server Vercel bersifat read-only, jadi folder lokal tidak bisa dipakai.
 * - Di lokal / Docker (tanpa kredensial Blob): file disimpan di `public/uploads/cms` seperti sebelumnya.
 *
 * URL publik selalu `/uploads/cms/<nama-file>` dan disajikan oleh `app/uploads/cms/[filename]/route.ts`,
 * sehingga isi CMS tidak bergantung pada lokasi penyimpanan dan header keamanan (CSP untuk SVG) tetap berlaku.
 */

const BLOB_PREFIX = "cms/";
const LOCAL_DIR = path.join(process.cwd(), "public", "uploads", "cms");

/** True bila kredensial Vercel Blob tersedia (token read-write, atau OIDC + store id di Vercel). */
export function isBlobStorageEnabled(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

/** Menyimpan gambar yang sudah divalidasi. `fileName` harus sudah disanitasi. */
export async function saveCmsImage(fileName: string, data: Buffer, contentType: string): Promise<void> {
  if (isBlobStorageEnabled()) {
    await put(BLOB_PREFIX + fileName, data, {
      access: "private",
      contentType,
      addRandomSuffix: false,
      allowOverwrite: false,
    });
    return;
  }
  await fs.mkdir(LOCAL_DIR, { recursive: true });
  await fs.writeFile(path.join(LOCAL_DIR, fileName), data);
}

/** Membaca gambar yang diunggah. Mengembalikan null bila tidak ada. `fileName` harus sudah divalidasi. */
export async function readCmsImage(fileName: string): Promise<Uint8Array | null> {
  if (isBlobStorageEnabled()) {
    try {
      const result = await get(BLOB_PREFIX + fileName, { access: "private" });
      if (!result || result.statusCode !== 200) return null;
      return new Uint8Array(await new Response(result.stream).arrayBuffer());
    } catch {
      return null;
    }
  }
  try {
    return new Uint8Array(await fs.readFile(path.join(LOCAL_DIR, fileName)));
  } catch {
    return null;
  }
}
