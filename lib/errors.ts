/**
 * Mengembalikan pesan error yang aman ditampilkan ke klien.
 *
 * Hanya `Error` biasa (error domain yang sengaja dilempar oleh model/service, mis.
 * "Spesimen tidak ditemukan") yang pesannya diteruskan. Error Prisma, TypeError, dan
 * error internal lain dapat memuat nama tabel/kolom/stack sehingga diganti pesan generik.
 * Detail lengkap tetap dicatat di log server oleh pemanggil.
 */
export function publicErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.constructor === Error && error.message) {
    return error.message;
  }
  return fallback;
}
