"use client";

import { useState, useEffect } from "react";
import {
  HeartHandshake,
  Plus,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  User,
  GraduationCap,
  MessageSquare,
  Search,
  Filter,
  X,
  Send,
} from "lucide-react";
import { CounselingItem, SessionUser } from "@/types";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function KonselingPage() {
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [items, setItems] = useState<CounselingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState<CounselingItem | null>(null);

  // Form State
  const [category, setCategory] = useState("Karir & Perguruan Tinggi");
  const [classRoom, setClassRoom] = useState("12-RPL-A");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Admin Schedule Update Form
  const [updateStatus, setUpdateStatus] = useState<"PENDING" | "SCHEDULED" | "RESOLVED" | "CANCELLED">("SCHEDULED");
  const [scheduledDate, setScheduledDate] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [meRes, konselingRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/counseling"),
        ]);

        if (meRes.ok) {
          const meData = await meRes.json();
          setCurrentUser(meData.user);
        }

        if (konselingRes.ok) {
          const kData = await konselingRes.json();
          setItems(kData.data || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const isAdmin = currentUser?.role === "ADMIN";

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) {
      setErrorMsg("Mohon tuliskan topik atau kendala yang ingin dikonsultasikan.");
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/counseling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, classRoom, notes }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Gagal mengirim permohonan konseling.");
        return;
      }

      setItems([data.data, ...items]);
      setNotes("");
      setShowCreateModal(false);
      setSuccessMsg("Permohonan konseling berhasil dikirim! Guru BK akan segera merespon.");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch {
      setErrorMsg("Terjadi kegagalan komunikasi ke server.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showScheduleModal) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/counseling", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: showScheduleModal.id,
          status: updateStatus,
          scheduledDate: scheduledDate || showScheduleModal.scheduledDate,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setItems(items.map((i) => (i.id === showScheduleModal.id ? data.data : i)));
        setShowScheduleModal(null);
        setSuccessMsg("Status konsultasi siswa berhasil diperbarui.");
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    } catch {
      alert("Gagal memperbarui status.");
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered Items
  const filteredItems = items.filter((item) => {
    const matchCategory = categoryFilter === "ALL" || item.category === categoryFilter;
    const matchStatus = statusFilter === "ALL" || item.status === statusFilter;
    const matchQuery =
      item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchStatus && matchQuery;
  });

  // Stats
  const totalCount = items.length;
  const pendingCount = items.filter((i) => i.status === "PENDING").length;
  const scheduledCount = items.filter((i) => i.status === "SCHEDULED").length;
  const resolvedCount = items.filter((i) => i.status === "RESOLVED").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-[11px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <Clock className="h-3 w-3" />
            Menunggu Tanggapan
          </span>
        );
      case "SCHEDULED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-[11px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            <Calendar className="h-3 w-3" />
            Dijadwalkan Temu
          </span>
        );
      case "RESOLVED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="h-3 w-3" />
            Selesai / Terbantu
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-[11px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400">
            {status}
          </span>
        );
    }
  };

  return (
    <DashboardShell title="Bimbingan & Konseling">
      <div className="space-y-6">
      {/* Header & Deskripsi Layanan */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Bimbingan & Konseling (BK)
            </h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
              <ShieldCheck className="h-3 w-3" />
              Tersandikan & Privat
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Layanan pendampingan akademik, pemilihan karir/perguruan tinggi, dan pembinaan karakter bersama Guru BK.
          </p>
        </div>

        <div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 focus:outline-hidden transition-colors min-h-[38px]"
          >
            <Plus className="h-4 w-4" />
            <span>Ajukan Konseling Baru</span>
          </button>
        </div>
      </div>

      {/* Alert Notifikasi Sukses */}
      {successMsg && (
        <div className="rounded-md border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-3.5 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Stats Cards (Anti-slop typography, 1px flat borders) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Total Sesi Terdaftar
          </p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 tabular-nums">
            {totalCount}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Riwayat semester ini
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Menunggu Respon
          </p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400 tabular-nums">
            {pendingCount}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Dalam antrean verifikasi
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Dijadwalkan Temu
          </p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400 tabular-nums">
            {scheduledCount}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Tatap muka di Ruang BK
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Selesai / Terbantu
          </p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums">
            {resolvedCount}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Solusi & rekomendasi tuntas
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari siswa, topik masalah, atau kata kunci..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="Karir & Perguruan Tinggi">Karir & Perguruan Tinggi</option>
            <option value="Akademik">Akademik</option>
            <option value="Pribadi & Sosial">Pribadi & Sosial</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden"
          >
            <option value="ALL">Semua Status</option>
            <option value="PENDING">Menunggu</option>
            <option value="SCHEDULED">Dijadwalkan</option>
            <option value="RESOLVED">Selesai</option>
          </select>
        </div>
      </div>

      {/* List of Requests */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
            Memuat daftar permohonan bimbingan...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
            <HeartHandshake className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Tidak Ada Permohonan Konseling
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Belum ada permohonan bimbingan yang sesuai kriteria pencarian atau filter yang dipilih.
            </p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-colors hover:border-slate-300 dark:hover:border-slate-700"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {item.studentName}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-xs">
                      {item.classRoom}
                    </span>
                    <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-xs border border-indigo-200 dark:border-indigo-800">
                      {item.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal pt-1">
                    {item.notes}
                  </p>

                  {item.scheduledDate && (
                    <div className="mt-2.5 flex items-center gap-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50/70 dark:bg-indigo-950/40 px-3 py-1.5 rounded-md border border-indigo-100 dark:border-indigo-900/60">
                      <Calendar className="h-3.5 w-3.5 shrink-0 text-indigo-600 dark:text-indigo-400" />
                      <span>Jadwal Sesi: {item.scheduledDate}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-start sm:items-end justify-between gap-2 shrink-0">
                  {getStatusBadge(item.status)}
                  <span className="text-[10px] text-slate-400 tabular-nums">
                    Diajukan: {new Date(item.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        setShowScheduleModal(item);
                        setUpdateStatus(item.status);
                        setScheduledDate(item.scheduledDate || "");
                      }}
                      className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 underline underline-offset-2"
                    >
                      Ubah Status / Jadwal &rarr;
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info Banner Kerahasiaan BK */}
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-4 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          <p className="font-bold text-slate-800 dark:text-slate-200">
            Jaminan Kode Etik Bimbingan & Konseling
          </p>
          <p className="mt-0.5">
            Semua data, keluhan, dan curahan hati dalam formulir ini dijaga kerahasiaannya sesuai kode etik profesi Bimbingan dan Konseling Indonesia (ABKIN). Tidak ada pihak ketiga yang dapat membaca catatan tanpa persetujuan Anda.
          </p>
        </div>
      </div>

      {/* Modal Ajukan Konseling Baru */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <HeartHandshake className="h-5 w-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Formulir Permohonan Bimbingan Konseling
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="mt-3 p-2.5 text-xs rounded-md bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-900 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateRequest} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Kategori Konsultasi
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Karir & Perguruan Tinggi">Karir & Perguruan Tinggi (SNBP, SNBT, Kedinasan)</option>
                  <option value="Akademik">Akademik & Pendampingan Kesulitan Belajar</option>
                  <option value="Pribadi & Sosial">Pribadi, Sosial & Adaptasi Lingkungan Sekolah</option>
                  <option value="Kedisiplinan">Kedisiplinan & Poin Pelanggaran</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Kelas / Rombongan Belajar
                </label>
                <input
                  type="text"
                  value={classRoom}
                  onChange={(e) => setClassRoom(e.target.value)}
                  placeholder="Contoh: 12-RPL-A"
                  className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Topik Masalah / Hal yang Ingin Didiskusikan
                </label>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tuliskan kendala Anda secara singkat dan jelas. Contoh: Saya ingin berkonsultasi mengenai peluang lolos jurusan Teknik Informatika UI jalur prestasi..."
                  className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Data ini hanya dibaca oleh Guru BK dan tidak akan disebarluaskan.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-md border border-slate-300 dark:border-slate-700 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{submitting ? "Mengirim..." : "Kirim Permohonan"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Admin Ubah Status / Jadwal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Tanggapi Konsultasi & Jadwalkan
              </h3>
              <button
                onClick={() => setShowScheduleModal(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-md border border-slate-200 dark:border-slate-800 text-xs">
              <p className="font-bold text-slate-900 dark:text-slate-100">
                {showScheduleModal.studentName} ({showScheduleModal.classRoom})
              </p>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                Kategori: {showScheduleModal.category}
              </p>
            </div>

            <form onSubmit={handleUpdateSchedule} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Status Bimbingan
                </label>
                <select
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value as any)}
                  className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden"
                >
                  <option value="PENDING">PENDING - Menunggu</option>
                  <option value="SCHEDULED">SCHEDULED - Dijadwalkan Temu</option>
                  <option value="RESOLVED">RESOLVED - Selesai & Terbantu</option>
                  <option value="CANCELLED">CANCELLED - Dibatalkan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Jadwal & Lokasi Temu
                </label>
                <input
                  type="text"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  placeholder="Contoh: Rabu, 11 Nov 2026 - 10:30 WIB (Ruang BK 2)"
                  className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(null)}
                  className="rounded-md border border-slate-300 dark:border-slate-700 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-md bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </DashboardShell>
  );
}
