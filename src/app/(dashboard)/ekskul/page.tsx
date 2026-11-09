"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ExtracurricularItem, SessionUser } from "@/types";
import {
  Sparkles,
  Users,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  UserPlus,
  ShieldCheck,
} from "lucide-react";

export default function EkskulPage() {
  const [ekskuls, setEkskuls] = useState<ExtracurricularItem[]>([]);
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const categories = ["Semua", "Teknologi", "Olahraga", "Kepemimpinan", "Kemanusiaan", "Seni"];

  useEffect(() => {
    async function loadData() {
      try {
        const [meRes, ekskulRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/ekskul"),
        ]);
        if (meRes.ok) {
          const d = await meRes.json();
          setCurrentUser(d.user);
        }
        if (ekskulRes.ok) {
          const e = await ekskulRes.json();
          setEkskuls(e.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleJoin = async (ekskul: ExtracurricularItem) => {
    setJoiningId(ekskul.id);
    try {
      const res = await fetch("/api/ekskul", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "JOIN", ekskulId: ekskul.id }),
      });

      if (res.ok) {
        const data = await res.json();
        setSuccessMsg(data.message || `Berhasil mendaftar ke ${ekskul.name}!`);
        setEkskuls((prev) =>
          prev.map((item) =>
            item.id === ekskul.id ? { ...item, memberCount: item.memberCount + 1 } : item
          )
        );
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setJoiningId(null);
    }
  };

  const filtered = ekskuls.filter((item) => {
    if (!selectedCategory || selectedCategory === "Semua") return true;
    return item.category === selectedCategory;
  });

  return (
    <DashboardShell title="Ekstrakurikuler & Organisasi">
      <div className="space-y-5">
        {/* Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Pengembangan Minat, Bakat & Kepemimpinan
            </h2>
            <span className="rounded-xs bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-bold text-[10px] px-2 py-0.5 border border-amber-200 dark:border-amber-800">
              Ekskul & Klub Prestasi
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Wadah kegiatan luar kelas untuk mengasah soft skills, prestasi kejuaraan, dan jiwa kolaboratif siswa.
          </p>
        </div>

        {successMsg && (
          <div className="flex items-center gap-2 rounded-md border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-3 text-xs text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = (!selectedCategory && cat === "Semua") || selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === "Semua" ? "" : cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 min-h-[38px] ${
                  isSelected
                    ? "bg-slate-900 dark:bg-indigo-600 text-white shadow-xs"
                    : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Ekskul Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full py-16 text-center text-xs text-slate-500">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600 mx-auto mb-2" />
              <span>Memuat direktori ekstrakurikuler...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="col-span-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center text-xs text-slate-500">
              <Sparkles className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-700 dark:text-slate-300">Tidak ada ekstrakurikuler pada kategori ini.</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-2xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="rounded-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      Kategori {item.category}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      👥 {item.memberCount} Anggota
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {item.name}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="mt-4 space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>Hari Latihan: <strong className="text-slate-700 dark:text-slate-200">{item.scheduleDay}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span>Waktu: {item.scheduleTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span>Lokasi: {item.location}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 truncate max-w-[150px]">
                    Pembina: {item.coachName}
                  </span>

                  <button
                    onClick={() => handleJoin(item)}
                    disabled={joiningId === item.id}
                    className="flex items-center gap-1.5 rounded-md bg-indigo-600 dark:bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors shadow-2xs disabled:opacity-50 min-h-[36px]"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    <span>{joiningId === item.id ? "Memproses..." : "Daftar Gabung"}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
