"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminSessionContext, AdminTopNav } from "@/components/admin/AdminTopNav";
import { AuthSessionPayload } from "@/types";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AuthSessionPayload | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    // Ambil data user aktif dari endpoint /api/auth/me
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setCurrentUser(data.data);
        }
      })
      .catch((err) => console.error("Error fetching user session:", err));
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
      setIsLoggingOut(false);
    }
  };

  return (
    <AdminSessionContext.Provider value={currentUser}>
      <div className="min-h-screen overflow-x-clip bg-[#E9ECF1] font-sans text-[#17191D] selection:bg-[#CAE2F1] selection:text-[#087BEE]">
        <AdminTopNav
          currentUser={currentUser}
          onLogout={handleLogout}
          isLoggingOut={isLoggingOut}
        />

        <main className="px-3 pb-10 pt-5 sm:px-5 sm:pt-6 lg:px-8 lg:pt-8">
          <div className="mx-auto min-w-0 max-w-[1440px]">{children}</div>
        </main>
      </div>
    </AdminSessionContext.Provider>
  );
}
