"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Trophy,
  BookOpen,
  UtensilsCrossed,
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

  const navigationGroups = [
    {
      title: "Menu Utama",
      items: [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, adminOnly: false },
      ],
    },
    {
      title: "Kesiswaan & Disiplin",
      items: [
        { name: "Data Siswa", href: "/siswa", icon: Users, adminOnly: false },
        { name: "Presensi Harian", href: "/presensi", icon: CalendarCheck, adminOnly: false },
        { name: "Prestasi Siswa", href: "/prestasi", icon: Trophy, adminOnly: false },
      ],
    },
    {
      title: "Layanan & Akademik",
      items: [
        { name: "Buku Pelajaran", href: "/buku", icon: BookOpen, adminOnly: false },
        { name: "Menu MBG (Makan Sehat)", href: "/mbg", icon: UtensilsCrossed, adminOnly: false, badge: "Program MBG" },
        { name: "Pengumuman", href: "/pengumuman", icon: Megaphone, adminOnly: false },
      ],
    },
    {
      title: "Keamanan Sistem",
      items: [
        { name: "Audit Log & Forensik", href: "/audit-logs", icon: ShieldAlert, adminOnly: true },
      ],
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 shadow-sm lg:shadow-none",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold shadow-xs">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-sm font-bold tracking-tight text-slate-900">
                SIMAS ACADEMIA
              </span>
              <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                SMAN 1 Harapan Bangsa
              </span>
            </div>
          </Link>

          {onClose && (
            <button
              onClick={onClose}
              className="rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Tutup Menu"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Role Pill Banner */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Hak Akses Anda
            </span>
            <span
              className={cn(
                "inline-flex items-center rounded-xs px-2 py-0.5 text-[10px] font-bold border",
                isAdmin
                  ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
              )}
            >
              {isAdmin ? "ADMINISTRATOR" : "SISWA (LIHAT SAJA)"}
            </span>
          </div>
        </div>

        {/* Nav links grouped */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {navigationGroups.map((group) => {
            const visibleItems = group.items.filter((item) => !item.adminOnly || isAdmin);
            if (visibleItems.length === 0) return null;

            return (
              <div key={group.title}>
                <div className="px-3 mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {group.title}
                </div>
                <nav className="space-y-0.5">
                  {visibleItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "group flex items-center justify-between rounded-md px-3 py-2 text-xs font-medium transition-colors min-h-[40px]",
                          isActive
                            ? "bg-slate-900 text-white font-semibold"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <item.icon
                            className={cn(
                              "h-4 w-4 shrink-0 transition-colors",
                              isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"
                            )}
                          />
                          <span>{item.name}</span>
                        </div>
                        {item.badge && !isActive && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-xs bg-amber-50 text-amber-700 border border-amber-200">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            );
          })}
        </div>

        {/* User Card & Logout */}
        <div className="border-t border-slate-100 p-3">
          <div className="flex items-center gap-2.5 rounded-md p-2 hover:bg-slate-50 transition-colors">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">
              {user?.fullName?.charAt(0) || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-slate-900 leading-tight">
                {user?.fullName || "Pengguna"}
              </p>
              <p className="truncate text-[10px] text-slate-400 mt-0.5">
                {user?.email || "user@sekolah.sch.id"}
              </p>
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                title="Keluar Akun"
                className="rounded-md p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
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
