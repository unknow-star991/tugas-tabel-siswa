"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Calendar, Search, Filter, CheckCircle2, AlertCircle, Clock, XCircle } from "lucide-react";
import { AttendanceItem, ClassRoomItem } from "@/types";
import { formatDate, getAttendanceBadge } from "@/lib/utils";

export default function PresensiPage() {
  const [attendances, setAttendances] = useState<AttendanceItem[]>([]);
  const [classes, setClasses] = useState<ClassRoomItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("2026-11-09");
  const [classRoomId, setClassRoomId] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchClasses() {
      try {
        const res = await fetch("/api/classes");
        if (res.ok) {
          const d = await res.json();
          setClasses(d.data);
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchClasses();
  }, []);

  useEffect(() => {
    async function fetchAttendances() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("date", selectedDate);
        if (classRoomId) params.set("classRoomId", classRoomId);

        const res = await fetch(`/api/attendances?${params.toString()}`);
        if (res.ok) {
          const d = await res.json();
          setAttendances(d.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchAttendances();
  }, [selectedDate, classRoomId]);

  // Hitung ringkasan hari ini
  const counts = {
    present: attendances.filter((a) => a.status === "PRESENT").length,
    sick: attendances.filter((a) => a.status === "SICK").length,
    permit: attendances.filter((a) => a.status === "PERMIT").length,
    absent: attendances.filter((a) => a.status === "ABSENT").length,
  };

  const filtered = attendances.filter((a) => {
    if (!search) return true;
    return (
      a.student?.fullName.toLowerCase().includes(search.toLowerCase()) ||
      a.student?.nisn.includes(search)
    );
  });

  return (
    <DashboardShell title="Rekapitulasi Presensi">
      <div className="space-y-5">
        <div className="border-b border-slate-200 pb-4">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Presensi & Kehadiran Harian Siswa
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pantau status kedisiplinan dan absensi harian siswa di seluruh kelas dan rombongan belajar.
          </p>
        </div>

        {/* Counter Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <span className="text-[11px] font-semibold uppercase text-slate-500">Hadir (H)</span>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{counts.present}</p>
            <span className="text-[10px] text-slate-400">Siswa tepat waktu</span>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <span className="text-[11px] font-semibold uppercase text-slate-500">Sakit (S)</span>
            <p className="text-2xl font-bold text-sky-600 mt-1">{counts.sick}</p>
            <span className="text-[10px] text-slate-400">Surat keterangan dokter</span>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <span className="text-[11px] font-semibold uppercase text-slate-500">Izin (I)</span>
            <p className="text-2xl font-bold text-amber-600 mt-1">{counts.permit}</p>
            <span className="text-[10px] text-slate-400">Pemberitahuan wali</span>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <span className="text-[11px] font-semibold uppercase text-slate-500">Alpa (A)</span>
            <p className="text-2xl font-bold text-rose-600 mt-1">{counts.absent}</p>
            <span className="text-[10px] text-slate-400">Tanpa keterangan</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex-1 relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau NISN siswa..."
              className="w-full rounded-md border border-slate-300 py-1.5 pl-9 pr-3 text-xs text-slate-900 focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-md border border-slate-300 py-1.5 px-3 text-xs text-slate-800 focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
            />

            <select
              value={classRoomId}
              onChange={(e) => setClassRoomId(e.target.value)}
              className="rounded-md border border-slate-300 py-1.5 px-3 text-xs text-slate-800 focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
            >
              <option value="">Semua Kelas</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-slate-200 bg-white overflow-hidden shadow-2xs">
          <div className="sm:hidden px-3.5 py-2 bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
            <span>👉 Geser tabel ke samping untuk melihat kolom lengkap</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">No</th>
                  <th className="py-3 px-4">Nama Siswa</th>
                  <th className="py-3 px-4">NISN</th>
                  <th className="py-3 px-4">Rombel</th>
                  <th className="py-3 px-4">Jurusan</th>
                  <th className="py-3 px-4 text-center">Status Presensi</th>
                  <th className="py-3 px-4">Keterangan Tambahan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      Memuat presensi...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      Tidak ada rekaman presensi pada filter yang dipilih.
                    </td>
                  </tr>
                ) : (
                  filtered.map((att, idx) => {
                    const badge = getAttendanceBadge(att.status);
                    return (
                      <tr key={att.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 text-center text-slate-400">{idx + 1}</td>
                        <td className="py-2.5 px-4 font-bold text-slate-900">
                          {att.student?.fullName}
                        </td>
                        <td className="py-2.5 px-4 font-mono text-slate-600">
                          {att.student?.nisn}
                        </td>
                        <td className="py-2.5 px-4 text-slate-700">
                          {att.student?.classRoom?.name || "-"}
                        </td>
                        <td className="py-2.5 px-4 font-medium text-slate-700">
                          {att.student?.department?.code || "-"}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-sm border font-bold text-[11px] ${badge.className}`}
                          >
                            {badge.label}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-slate-500 italic">
                          {att.remarks || "-"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
