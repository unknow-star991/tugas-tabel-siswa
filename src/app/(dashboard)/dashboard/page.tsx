"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import {
  Users,
  CalendarCheck,
  Trophy,
  ArrowRight,
  ShieldCheck,
  Megaphone,
} from "lucide-react";

interface StatsData {
  students: {
    total: number;
    active: number;
    leave: number;
    transferred: number;
    graduated: number;
    male: number;
    female: number;
  };
  departments: Array<{
    id: string;
    code: string;
    name: string;
    studentCount: number;
    classCount: number;
  }>;
  attendanceToday: {
    present: number;
    sick: number;
    permit: number;
    absent: number;
    totalRecorded: number;
  };
  totalAchievements: number;
  totalAnnouncements: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data.data);
        }
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <DashboardShell title="Ringkasan Eksekutif">
      <div className="space-y-6">
        {/* Banner Selamat Datang Ringkas */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Pusat Kendali SIMAS ACADEMIA
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Data pokok terintegrasi: kesiswaan, rombongan belajar, presensi harian, dan piagam prestasi.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/siswa"
                className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors shadow-2xs"
              >
                <span>Buka Tabel Siswa</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Anti-Slop KPI Row: Type-driven, flat surfaces, zero icons-in-tinted-circles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Siswa */}
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Total Siswa Terdaftar
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                {loading ? "..." : stats?.students.total || 0}
              </span>
              <span className="text-xs font-medium text-emerald-600">
                {stats?.students.active || 0} Aktif
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2.5">
              <span>Laki-laki: {stats?.students.male || 0}</span>
              <span>Perempuan: {stats?.students.female || 0}</span>
            </div>
          </div>

          {/* Card 2: Kehadiran Hari Ini */}
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Presensi Hari Ini (9 Nov)
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                {loading
                  ? "..."
                  : stats?.attendanceToday.totalRecorded
                  ? `${Math.round(
                      ((stats.attendanceToday.present) /
                        stats.attendanceToday.totalRecorded) *
                        100
                    )}%`
                  : "0%"}
              </span>
              <span className="text-xs font-medium text-slate-500">
                Tingkat Hadir
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2.5">
              <span className="text-emerald-600 font-medium">{stats?.attendanceToday.present || 0} Hadir</span>
              <span className="text-sky-600 font-medium">{stats?.attendanceToday.sick || 0} Sakit</span>
              <span className="text-amber-600 font-medium">{stats?.attendanceToday.permit || 0} Izin</span>
            </div>
          </div>

          {/* Card 3: Jurusan & Rombel */}
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Program Keahlian
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                {loading ? "..." : stats?.departments.length || 0}
              </span>
              <span className="text-xs font-medium text-slate-500">
                Jurusan Aktif
              </span>
            </div>
            <div className="mt-3 text-[11px] text-slate-500 border-t border-slate-100 pt-2.5 truncate">
              RPL • TKJ • DKV • MIPA
            </div>
          </div>

          {/* Card 4: Prestasi */}
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Piagam Prestasi
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                {loading ? "..." : stats?.totalAchievements || 0}
              </span>
              <span className="text-xs font-medium text-indigo-600">
                Terverifikasi
              </span>
            </div>
            <div className="mt-3 text-[11px] text-slate-500 border-t border-slate-100 pt-2.5 truncate">
              Tingkat Provinsi & Nasional
            </div>
          </div>
        </div>

        {/* Two-Column Content: Department Distribution & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kolom Kiri (2 cols): Distribusi Siswa per Jurusan */}
          <div className="lg:col-span-2 rounded-lg border border-slate-200 bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Distribusi Siswa per Konsentrasi Keahlian
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Rasio jumlah siswa terdaftar berdasarkan jurusan kejuruan & peminatan.
                </p>
              </div>
              <Link
                href="/siswa"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Lihat Detail
              </Link>
            </div>

            <div className="space-y-4 mt-6">
              {stats?.departments.map((dept) => {
                const total = stats.students.total || 1;
                const percentage = Math.round((dept.studentCount / total) * 100);

                return (
                  <div key={dept.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">
                        {dept.name} ({dept.code})
                      </span>
                      <span className="text-slate-500 font-medium">
                        {dept.studentCount} Siswa ({percentage}%)
                      </span>
                    </div>
                    {/* Flat bar without gradients */}
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-slate-800 transition-all duration-300"
                        style={{ width: `${Math.max(percentage, 5)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Kolom Kanan (1 col): Panduan Peran & Fitur Tambahan */}
          <div className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Panduan Role-Based Access
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Sistem ini membedakan tampilan dan fungsionalitas secara otomatis:
              </p>

              <div className="mt-4 space-y-3">
                <div className="rounded-md border border-indigo-100 bg-indigo-50/50 p-3 text-xs">
                  <span className="font-bold text-indigo-900 block">👑 Mode Administrator:</span>
                  <p className="text-indigo-800 mt-1 leading-relaxed">
                    Dapat menambah siswa baru, mengedit biodata, menghapus data dengan modal konfirmasi, melihat audit log, dan menerbitkan pengumuman.
                  </p>
                </div>

                <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-xs">
                  <span className="font-bold text-slate-900 block">👤 Mode User Biasa (Siswa):</span>
                  <p className="text-slate-600 mt-1 leading-relaxed">
                    Hanya dapat melihat tabel direktori, memfilter berdasarkan kategori (Jurusan, Kelas, Status), dan mencari nama tanpa izin mengubah data.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link
                href="/siswa"
                className="flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-indigo-600"
              >
                <span>Uji Coba Filter Kategori di Tabel Siswa</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
        {/* Layanan Terpadu Sekolah: Menu MBG & Katalog Buku Pelajaran */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card MBG */}
          <div className="rounded-lg border border-slate-200 bg-white p-5 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200">
                  Program Gizi Nasional
                </span>
                <span className="text-xs text-slate-400">11:45 - 12:30 WIB</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-1">
                🍱 Makan Bergizi Gratis (MBG) Hari Ini
              </h3>
              <p className="text-xs text-slate-600 font-semibold mt-1.5">
                Nasi Putih Pulen + Ayam Panggang Madu
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Lengkap dengan Tahu Tempe Bacem, Sayur Sup Brokoli, Pisang Cavendish, & Susu UHT (650 kkal).
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-emerald-600">
                ✓ Telah Selesai Dibagikan
              </span>
              <Link
                href="/mbg"
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                <span>Lihat Menu 1 Minggu</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Card Buku Pelajaran */}
          <div className="rounded-lg border border-slate-200 bg-white p-5 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-xs border border-indigo-200">
                  Perpustakaan & Modul
                </span>
                <span className="text-xs text-slate-400">Kurikulum Merdeka</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-1">
                📚 Buku Pelajaran & Modul Kejuruan
              </h3>
              <p className="text-xs text-slate-600 font-semibold mt-1.5">
                Koleksi Buku Paket Kelas 10, 11, & 12
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Tersedia buku pegangan siswa untuk konsentrasi RPL, TKJ, DKV, MIPA, dan Umum.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500">
                6 Buku Tersedia
              </span>
              <Link
                href="/buku"
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                <span>Buka Katalog Buku</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
