"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminSessionContext, AdminShell } from "@/components/admin/AdminShell";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
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
      // Kembali ke beranda: URL login admin tidak ditampilkan di mana pun
      router.replace("/");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
      setIsLoggingOut(false);
    }
  };

  return (
    <AdminSessionContext.Provider value={currentUser}>
      <SmoothScrollProvider duration={0.8}>
        <AdminShell currentUser={currentUser} onLogout={handleLogout} isLoggingOut={isLoggingOut}>
          {children}
        </AdminShell>
      </SmoothScrollProvider>
    </AdminSessionContext.Provider>
  );
}
