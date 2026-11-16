"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminCmsHomepageRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/cms?tab=homepage");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600 text-sm font-medium">Mengarahkan ke Pusat Konten CMS (Homepage)...</p>
      </div>
    </div>
  );
}
