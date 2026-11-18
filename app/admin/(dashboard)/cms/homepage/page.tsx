"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminLang } from "@/components/admin/AdminLanguage";

export default function AdminCmsHomepageRedirectPage() {
  const router = useRouter();
  const { t } = useAdminLang();

  useEffect(() => {
    router.replace("/admin/cms?tab=homepage");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600 text-sm font-medium">{t("Mengarahkan ke Pusat Konten CMS (Homepage)...", "Redirecting to CMS Content Hub (Homepage)...")}</p>
      </div>
    </div>
  );
}
