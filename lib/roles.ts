/**
 * Definisi role yang berhak mengelola dashboard admin.
 *
 * Modul ini sengaja tidak mengimpor Prisma agar aman dipakai di middleware (Edge runtime).
 * Saat ini role disimpan sebagai nama bebas di tabel `roles`; daftar ini menjadi satu-satunya
 * sumber kebenaran otorisasi admin sampai restrukturisasi role ADMIN/USER (Phase 2+).
 */
export const ADMIN_ROLE_NAMES: readonly string[] = ["Super Admin"];

/** Role akun client/demo (calon USER pada desain final). */
export const DEMO_ROLE_NAME = "Demo User";

export function isAdminRole(roleName: string | null | undefined): boolean {
  return !!roleName && ADMIN_ROLE_NAMES.includes(roleName);
}

export function isDemoRole(roleName: string | null | undefined): boolean {
  return roleName === DEMO_ROLE_NAME;
}
