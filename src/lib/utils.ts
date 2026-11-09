import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | Date | null | undefined): string {
  if (!dateString) return "-";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return String(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(d);
  } catch {
    return String(dateString);
  }
}

export function formatDateTime(dateString: string | Date | null | undefined): string {
  if (!dateString) return "-";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return String(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return String(dateString);
  }
}

export function getStatusBadge(status: string) {
  switch (status) {
    case "ACTIVE":
      return {
        label: "Aktif",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        dotClassName: "bg-emerald-500",
      };
    case "GRADUATED":
      return {
        label: "Lulus",
        className: "bg-blue-50 text-blue-700 border-blue-200",
        dotClassName: "bg-blue-500",
      };
    case "LEAVE":
      return {
        label: "Cuti",
        className: "bg-amber-50 text-amber-700 border-amber-200",
        dotClassName: "bg-amber-500",
      };
    case "TRANSFERRED":
      return {
        label: "Pindah / Keluar",
        className: "bg-slate-100 text-slate-700 border-slate-200",
        dotClassName: "bg-slate-400",
      };
    default:
      return {
        label: status,
        className: "bg-slate-50 text-slate-600 border-slate-200",
        dotClassName: "bg-slate-400",
      };
  }
}

export function getAttendanceBadge(status: string) {
  switch (status) {
    case "PRESENT":
      return {
        label: "Hadir",
        code: "H",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      };
    case "SICK":
      return {
        label: "Sakit",
        code: "S",
        className: "bg-sky-50 text-sky-700 border-sky-200",
      };
    case "PERMIT":
      return {
        label: "Izin",
        code: "I",
        className: "bg-amber-50 text-amber-700 border-amber-200",
      };
    case "ABSENT":
      return {
        label: "Alpa",
        code: "A",
        className: "bg-rose-50 text-rose-700 border-rose-200",
      };
    default:
      return {
        label: status,
        code: "-",
        className: "bg-slate-50 text-slate-700 border-slate-200",
      };
  }
}
