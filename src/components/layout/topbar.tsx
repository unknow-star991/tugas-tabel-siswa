"use client";

import { Menu, LogOut, ArrowLeftRight, Bell, Sun, Moon, Check, X } from "lucide-react";
import { SessionUser, NotificationItem } from "@/types";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "@/components/theme-provider";

interface TopbarProps {
  user: SessionUser | null;
  onOpenSidebar: () => void;
  onLogout: () => void;
  title?: string;
}

export function Topbar({ user, onOpenSidebar, onLogout, title }: TopbarProps) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [switching, setSwitching] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    async function loadNotifications() {
      try {
        const res = await fetch("/api/notifications");
        if (res.ok) {
          const d = await res.json();
          setNotifications(d.data);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };

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
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-3.5 sm:px-6 backdrop-blur-xs transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="rounded-md p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden min-h-[40px] min-w-[40px] flex items-center justify-center"
          aria-label="Buka Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {title && (
          <h1 className="text-sm sm:text-base lg:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Academic Year indicator (desktop) */}
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 rounded-md border border-slate-200/80 dark:border-slate-700/80">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          <span>Semester Gasal 2026/2027</span>
        </div>

        {/* Dark / Light Mode Toggle */}
        <button
          onClick={toggleTheme}
          title={theme === "dark" ? "Beralih ke Mode Terang" : "Beralih ke Mode Gelap"}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs"
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-slate-600" />
          )}
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs"
            aria-label="Notifikasi"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Popup Notifikasi */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-xl z-50">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-3">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Pusat Notifikasi
                  </h4>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 font-bold px-1.5 py-0.2 rounded-xs border border-rose-200 dark:border-rose-800">
                      {unreadCount} baru
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Tandai Semua Dibaca
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2 text-xs">
                {notifications.length === 0 ? (
                  <p className="text-center py-6 text-slate-400 text-xs">
                    Tidak ada notifikasi aktif.
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-lg border transition-colors ${
                        n.isRead
                          ? "bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                          : "bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/60 text-slate-900 dark:text-slate-100"
                      }`}
                    >
                      <p className="font-bold text-xs">{n.title}</p>
                      <p className="text-[11px] mt-0.5 leading-relaxed text-slate-600 dark:text-slate-300">
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Role Switcher Button */}
        <button
          onClick={handleQuickSwitchRole}
          disabled={switching}
          title={isAdmin ? "Uji coba sebagai Siswa (Read-Only)" : "Beralih ke Admin (Full Akses)"}
          className="flex items-center gap-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs min-h-[36px]"
        >
          <ArrowLeftRight className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
          <span className="hidden sm:inline">Ganti Peran:</span>
          <span className={isAdmin ? "text-indigo-600 dark:text-indigo-400 font-bold" : "text-emerald-600 dark:text-emerald-400 font-bold"}>
            {isAdmin ? "Ke Siswa" : "Ke Admin"}
          </span>
        </button>

        {/* Current User Badge & Logout */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="hidden lg:block text-right">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
              {user?.fullName || "Pengguna"}
            </p>
            <p className="text-[10px] text-slate-400">
              {isAdmin ? "Super Administrator" : "Siswa / Tamu"}
            </p>
          </div>
          <button
            onClick={onLogout}
            title="Keluar Akun"
            className="flex items-center justify-center rounded-md p-1.5 text-slate-500 dark:text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50 dark:hover:text-rose-400 transition-colors min-h-[36px] min-w-[36px]"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
