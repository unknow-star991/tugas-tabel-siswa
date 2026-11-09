"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { BottomNav } from "./bottom-nav";
import { SessionUser } from "@/types";

interface DashboardShellProps {
  children: React.ReactNode;
  title?: string;
}

export function DashboardShell({ children, title }: DashboardShellProps) {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.replace("/login");
          return;
        }
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
        } else {
          router.replace("/login");
        }
      } catch (e) {
        console.error("Auth check failed:", e);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
          <p className="text-xs font-semibold tracking-wide">Memuat SIMAS ACADEMIA...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Desktop Sidebar & Mobile Off-canvas Drawer */}
      <Sidebar
        user={user}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <div className="flex flex-1 flex-col min-w-0">
        <Topbar
          user={user}
          onOpenSidebar={() => setSidebarOpen(true)}
          onLogout={handleLogout}
          title={title}
        />

        {/* Responsive Content Area with mobile bottom padding */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 pb-24 sm:pb-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Mobile Quick Bottom Navigation Bar */}
        <BottomNav />
      </div>
    </div>
  );
}
