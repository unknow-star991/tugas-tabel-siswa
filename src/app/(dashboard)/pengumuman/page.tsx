"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Megaphone, Pin, Plus, Calendar, User, CheckCircle2 } from "lucide-react";
import { AnnouncementItem, SessionUser } from "@/types";
import { formatDateTime } from "@/lib/utils";

export default function PengumumanPage() {
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form buat pengumuman baru (Admin Only)
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [targetRole, setTargetRole] = useState<"ALL" | "ADMIN" | "USER">("ALL");
  const [isPinned, setIsPinned] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [meRes, annRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/announcements"),
        ]);
        if (meRes.ok) {
          const d = await meRes.json();
          setCurrentUser(d.user);
        }
        if (annRes.ok) {
          const d = await annRes.json();
          setAnnouncements(d.data);
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, targetRole, isPinned }),
      });

      if (res.ok) {
        const created = await res.json();
        setAnnouncements([created.data, ...announcements]);
        setTitle("");
        setContent("");
        setIsPinned(false);
        setShowForm(false);
        setMessage("Pengumuman berhasil dipublikasikan!");
        setTimeout(() => setMessage(null), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardShell title="Papan Pengumuman Sekolah">
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Informasi & Agenda Akademik
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Siaran resmi dari tata usaha dan pimpinan sekolah mengenai kegiatan belajar mengajar.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors shadow-2xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{showForm ? "Tutup Form" : "Buat Pengumuman"}</span>
            </button>
          )}
        </div>

        {message && (
          <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{message}</span>
          </div>
        )}

        {/* Form Tambah Pengumuman (Admin Only) */}
        {isAdmin && showForm && (
          <div className="rounded-lg border border-indigo-200 bg-indigo-50/30 p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Publikasikan Siaran / Pengumuman Baru
            </h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Judul Pengumuman
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Jadwal Libur Awal Puasa dan Cuti Bersama"
                  className="w-full rounded-md border border-slate-300 bg-white py-2 px-3 text-xs text-slate-900 focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Isi Surat Edaran / Berita
                </label>
                <textarea
                  rows={3}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tuliskan isi pengumuman secara jelas dan terperinci..."
                  className="w-full rounded-md border border-slate-300 bg-white py-2 px-3 text-xs text-slate-900 focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPinned}
                      onChange={(e) => setIsPinned(e.target.checked)}
                      className="rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <span>Sematkan ke bagian paling atas (Pin)</span>
                  </label>

                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value as "ALL" | "ADMIN" | "USER")}
                    className="rounded-md border border-slate-300 bg-white py-1 px-2.5 text-xs text-slate-700"
                  >
                    <option value="ALL">Untuk Semua Pengguna</option>
                    <option value="USER">Khusus Siswa & Tamu</option>
                    <option value="ADMIN">Khusus Staf Admin</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-md bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {submitting ? "Memproses..." : "Terbitkan Sekarang"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* List of announcements */}
        <div className="space-y-3">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-500">
              Memuat pengumuman...
            </div>
          ) : announcements.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
              Belum ada siaran pengumuman aktif saat ini.
            </div>
          ) : (
            announcements.map((item) => (
              <div
                key={item.id}
                className={`rounded-lg border p-5 bg-white transition-all ${
                  item.isPinned
                    ? "border-amber-300/80 bg-amber-50/20 shadow-2xs"
                    : "border-slate-200"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {item.isPinned && (
                        <span className="flex items-center gap-1 rounded-xs bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-300">
                          <Pin className="h-3 w-3" />
                          <span>PENTING / DISEMATKAN</span>
                        </span>
                      )}
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {item.title}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-700 mt-2 leading-relaxed whitespace-pre-line">
                      {item.content}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    <span>Diterbitkan oleh: {item.author?.fullName || "Tata Usaha Sekolah"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>{formatDateTime(item.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
