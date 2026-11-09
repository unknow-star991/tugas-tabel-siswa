"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Trophy,
  Megaphone,
  ShieldAlert,
  GraduationCap,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SessionUser } from "@/types";

interface SidebarProps {
  user: SessionUser | null;
  isOpen?: boolean;
  onClose?: () => void;
  onLogout?: () => void;
}

export function Sidebar({ user, isOpen, onClose, onLogout }: SidebarProps) {
  const pathname = usePathname();
  const isAdmin = user?.role === "ADMIN";

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      adminOnly: false,
    },
    {
      name: "Data Siswa",
      href: "/siswa",
      icon: Users,
      adminOnly: false,
    },
    {
      name: "Presensi Harian",
      href: "/presensi",
      icon: CalendarCheck,
      adminOnly: false,
    },
    {
      name: "Prestasi Siswa",
      href: "/prestasi",
      icon: Trophy,
      adminOnly: false,
    },
    {
      name: "Pengumuman",
      href: "/pengumuman",
      icon: Megaphone,
      adminOnly: false,
    },
    {
      name: "Audit Log & Keamanan",
      href: "/audit-logs",
      icon: ShieldAlert,
      adminOnly: true,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white font-semibold shadow-xs">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-sm font-bold tracking-tight text-slate-900">
                SIMAS ACADEMIA
              </span>
              <span className="block text-[11px] font-medium text-slate-500">
                SMAN 1 Harapan Bangsa
              </span>
            </div>
          </Link>

          {onClose && (
            <button
              onClick={onClose}
              className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden"
              aria-label="Tutup Menu"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Role Pill Banner */}
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
              Hak Akses Anda
            </span>
            <span
              className={cn(
                "inline-flex items-center rounded-sm px-2 py-0.5 text-[11px] font-semibold border",
                isAdmin
                  ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
              )}
            >
              {isAdmin ? "ADMINISTRATOR" : "USER (LIHAT SAJA)"}
            </span>
          </div>
        </div>

        {/* Nav links */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Menu Utama
          </div>
          <nav className="space-y-1">
            {navigation
              .filter((item) => !item.adminOnly || isAdmin)
              .map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-slate-900 text-white font-semibold"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        isActive
                          ? "text-white"
                          : "text-slate-400 group-hover:text-slate-600"
                      )}
                    />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="border-t border-slate-100 p-3">
          <div className="flex items-center gap-3 rounded-md p-2 hover:bg-slate-50">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">
              {user?.fullName?.charAt(0) || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-800">
                {user?.fullName || "Pengguna"}
              </p>
              <p className="truncate text-[11px] text-slate-400">
                {user?.email || "user@sekolah.sch.id"}
              </p>
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                title="Keluar Akun"
                className="rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
