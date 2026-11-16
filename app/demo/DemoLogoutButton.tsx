"use client";

import React, { useState } from "react";

export function DemoLogoutButton() {
  const [pending, setPending] = useState(false);

  const handleLogout = async () => {
    setPending(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      window.location.replace("/");
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={pending}
      className="w-full py-2.5 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-60 text-slate-700 text-xs font-semibold transition-colors"
    >
      {pending ? "Keluar..." : "Keluar"}
    </button>
  );
}
