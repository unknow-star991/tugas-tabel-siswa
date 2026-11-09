"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, CalendarDays, BookOpen, UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  const links = [
    { name: "Beranda", href: "/dashboard", icon: LayoutDashboard },
    { name: "Siswa", href: "/siswa", icon: Users },
    { name: "Jadwal", href: "/jadwal", icon: CalendarDays },
    { name: "Buku", href: "/buku", icon: BookOpen },
    { name: "MBG", href: "/mbg", icon: UtensilsCrossed },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-2 backdrop-blur-md sm:hidden shadow-lg transition-colors">
      <div className="flex w-full items-center justify-around">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-semibold transition-colors min-w-[56px] min-h-[44px]",
                isActive
                  ? "text-indigo-600 dark:text-indigo-400 font-bold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              )}
            >
              <link.icon
                className={cn(
                  "h-5 w-5 transition-transform",
                  isActive
                    ? "scale-110 text-indigo-600 dark:text-indigo-400 stroke-[2.5]"
                    : "text-slate-400 dark:text-slate-500 stroke-[1.8]"
                )}
              />
              <span className="truncate">{link.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
