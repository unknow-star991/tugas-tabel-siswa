"use client";

import { Menu, LogOut, ArrowLeftRight, UserCheck } from "lucide-react";
import { SessionUser } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface TopbarProps {
  user: SessionUser | null;
  onOpenSidebar: () => void;
  onLogout: () => void;
  title?: string;
}

export function Topbar({ user, onOpenSidebar, onLogout, title }: TopbarProps) {
  const router = useRouter();
  const [switching, setSwitching] = useState(false);
  const isAdmin = user?.role === "ADMIN";

  // Fitur beralih peran cepat (sangat berguna untuk demo/pengujian)
  const handleQuickSwitchRole = async () => {
    setSwitching(true);
    try {
      const targetUser = isAdmin ? "siswa" : "admin";
      const targetPass = isAdmin ? "siswa123" : "admin123";

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: targetUser, password: targetPass }),
      });

      if (res.ok) {
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSwitching(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-6 backdrop-blur-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
          aria-label="Buka Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {title && (
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Academic Year indicator */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200/80">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          <span>Semester Gasal 2026/2027</span>
        </div>

        {/* Quick Role Switcher Button */}
        <button
          onClick={handleQuickSwitchRole}
          disabled={switching}
          title={isAdmin ? "Uji coba sebagai Siswa (Read-Only)" : "Beralih ke Admin (Full Akses)"}
          className="flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-2xs"
        >
          <ArrowLeftRight className="h-3.5 w-3.5 text-slate-500" />
          <span className="hidden md:inline">Ganti Peran:</span>
          <span className={isAdmin ? "text-indigo-600 font-bold" : "text-emerald-600 font-bold"}>
            {isAdmin ? "Ke User Biasa" : "Ke Admin"}
          </span>
        </button>

        {/* Current User Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="hidden text-right sm:block">
            <p className="text-xs font-semibold text-slate-800 leading-tight">
              {user?.fullName || "Pengguna"}
            </p>
            <p className="text-[11px] text-slate-500">
              {isAdmin ? "Super Administrator" : "Siswa / Tamu"}
            </p>
          </div>
          <button
            onClick={onLogout}
            title="Keluar Akun"
            className="flex items-center gap-1 rounded-md p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
