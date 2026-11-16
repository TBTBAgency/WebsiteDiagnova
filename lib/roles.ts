/**
 * Role yang berlaku: ADMIN dan USER (kolom `roles.code`).
 *
 * Modul ini sengaja tidak mengimpor Prisma agar aman dipakai di middleware (Edge runtime).
 * Otorisasi memakai KODE role, bukan nama tampilan, sehingga mengganti nama role tidak memengaruhi akses.
 * Role lama (Sales Admin, Lab Staff, Pathologist) memiliki code NULL -> tidak punya akses apa pun (OD-01).
 */
export type RoleCode = "ADMIN" | "USER";

export const ADMIN_ROLE: RoleCode = "ADMIN";
export const USER_ROLE: RoleCode = "USER";

/** Nama tampilan default (dipakai seed & pembuatan akun USER). */
export const ROLE_DISPLAY_NAMES: Record<RoleCode, string> = {
  ADMIN: "Super Admin",
  USER: "Demo User",
};

export function isAdminRole(code: string | null | undefined): boolean {
  return code === ADMIN_ROLE;
}

export function isUserRole(code: string | null | undefined): boolean {
  return code === USER_ROLE;
}
