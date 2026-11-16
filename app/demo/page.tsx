import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShieldCheck, Clock } from "lucide-react";
import { getCurrentSession } from "@/lib/auth-session";
import { db } from "@/lib/db";
import { isUserRole } from "@/lib/roles";
import { getUserAccessWindow } from "@/lib/demo-access";
import { DemoLogoutButton } from "./DemoLogoutButton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Demo Diagnova",
  robots: { index: false, follow: false },
};

/**
 * Halaman tujuan akun demo (USER) setelah login magic link.
 *
 * Akses diverifikasi ulang ke database pada setiap request: akun harus ada, ber-role USER,
 * aktif, tidak dihapus, dan memiliki periode akses demo yang sedang berjalan (demo_accesses). Isi halaman sengaja minimal; cakupan fitur yang
 * boleh diakses akun demo menunggu keputusan desain (Phase 3).
 */
export default async function DemoHomePage() {
  const session = await getCurrentSession();
  if (!session?.userId) redirect("/");

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: {
      name: true,
      institution: true,
      status: true,
      deletedAt: true,
      role: { select: { code: true } },
    },
  });

  if (!user || !isUserRole(user.role?.code) || user.status !== "ACTIVE" || user.deletedAt) redirect("/");
  const window = await getUserAccessWindow(db, session.userId);
  if (!window) redirect("/demo-expired");

  const expiresLabel = window.coverageEnd.toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-5">
        <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-slate-900 font-display">Selamat datang, {user.name}</h1>
          {user.institution && <p className="text-xs text-slate-500">{user.institution}</p>}
        </div>
        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-2">
          <Clock className="h-4 w-4 mt-0.5 shrink-0" />
          <span>
            Akses demo Anda aktif hingga <strong>{expiresLabel} WIB</strong>.
          </span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Tim Diagnova akan memandu sesi demo sesuai jadwal yang telah dikonfirmasi.
        </p>
        <DemoLogoutButton />
      </div>
    </div>
  );
}
