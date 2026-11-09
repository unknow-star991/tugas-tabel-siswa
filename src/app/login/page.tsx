"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  ShieldCheck,
  User,
  AlertCircle,
  ArrowRight,
  BookOpen,
  Lock,
  ArrowLeft,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal masuk. Silakan coba lagi.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Terjadi gangguan koneksi ke server.");
    } finally {
      setLoading(false);
    }
  };

  const setCredentials = (user: string, pass: string) => {
    setIdentifier(user);
    setPassword(pass);
    setError(null);
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Kolom Kiri: Branding & Informasi Sistem */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-slate-900 p-12 text-white border-r border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <span className="block text-lg font-bold tracking-tight">SIMAS ACADEMIA</span>
              <span className="block text-xs text-slate-400">SMAN 1 Harapan Bangsa</span>
            </div>
          </div>

          <div className="mt-16 space-y-4 max-w-lg">
            <h1 className="text-3xl font-extrabold tracking-tight leading-tight text-slate-100">
              Sistem Informasi Manajemen Siswa & Akademik Terpadu
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Platform terpusat untuk memantau data pokok kesiswaan, presensi harian,
              pencapaian prestasi, hingga rekapitulasi nilai berbasis Role-Based Access Control.
            </p>
          </div>

          {/* Fitur Highlights */}
          <div className="mt-12 space-y-3.5 border-t border-slate-800 pt-8">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-sm bg-indigo-950 p-1.5 text-indigo-400 border border-indigo-800/60">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200">Hak Akses Ketat (RBAC)</p>
                <p className="text-xs text-slate-400">
                  Admin memiliki kontrol penuh (CRUD), sedangkan User biasa dibatasi hanya untuk melihat & memfilter tabel.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-sm bg-emerald-950 p-1.5 text-emerald-400 border border-emerald-800/60">
                <BookOpen className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200">Ekosistem Data Komprehensif</p>
                <p className="text-xs text-slate-400">
                  Dilengkapi statistik real-time, rekap presensi, catatan poin kedisiplinan (BK), dan arsip pengumuman.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-xs text-slate-500">
          Tahun Ajaran 2026/2027 • Versi Rilis 2.4 Enterprise
        </div>
      </div>

      {/* Kolom Kanan: Form Login */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md bg-white p-8 sm:p-10 rounded-xl border border-slate-200 shadow-xs">
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-4"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Kembali ke Beranda Sekolah</span>
            </Link>

            <div className="lg:hidden flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-600 text-white font-bold">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="font-bold text-slate-900">SIMAS ACADEMIA</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Masuk ke Portal
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Gunakan akun Anda untuk mengakses direktori dan modul akademik.
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Username atau Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin atau siswa"
                  className="block w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-indigo-600 py-2.5 px-4 text-xs font-semibold text-white hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Selector */}
          <div className="mt-8 border-t border-slate-200 pt-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
              Uji Coba Cepat (Klik untuk Otomatis Isi):
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCredentials("admin", "admin123")}
                className="flex flex-col items-start p-2 rounded-md border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 text-left transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-full bg-indigo-600"></span>
                  <span className="text-xs font-bold text-slate-900">Sebagai Admin</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5">Bisa Add, Edit, Delete</span>
              </button>

              <button
                type="button"
                onClick={() => setCredentials("siswa", "siswa123")}
                className="flex flex-col items-start p-2 rounded-md border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 text-left transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-600"></span>
                  <span className="text-xs font-bold text-slate-900">Sebagai Siswa</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5">Hanya Lihat Tabel</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
