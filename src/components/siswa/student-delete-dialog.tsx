"use client";

import { useState } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { StudentItem } from "@/types";

interface StudentDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  student: StudentItem | null;
}

export function StudentDeleteDialog({
  isOpen,
  onClose,
  onSuccess,
  student,
}: StudentDeleteDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !student) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/students/${student.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal menghapus siswa.");
        return;
      }

      onSuccess();
      onClose();
    } catch {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-rose-600">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="text-sm font-bold text-slate-900">
              Konfirmasi Hapus Data Siswa
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Apakah Anda yakin ingin menghapus data siswa berikut secara permanen dari sistem?
          </p>

          <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Nama Siswa:</span>
              <span className="font-bold text-slate-900">{student.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">NISN:</span>
              <span className="font-semibold text-slate-700">{student.nisn}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Kelas:</span>
              <span className="font-semibold text-slate-700">
                {student.classRoom?.name || "-"} ({student.department?.code || "-"})
              </span>
            </div>
          </div>

          <p className="mt-3 text-[11px] text-rose-600 font-medium">
            Tindakan ini tidak dapat dibatalkan. Seluruh riwayat presensi, nilai, dan prestasi terkait siswa ini akan turut dihapus.
          </p>
        </div>

        {error && (
          <div className="mt-3 rounded-md bg-rose-50 p-2 text-xs text-rose-700 border border-rose-200">
            {error}
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-md bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 transition-colors shadow-2xs disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>{loading ? "Menghapus..." : "Ya, Hapus Data"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
