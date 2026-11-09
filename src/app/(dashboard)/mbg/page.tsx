"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { MbgMenuItem, SessionUser } from "@/types";
import {
  UtensilsCrossed,
  Flame,
  Dna,
  Clock,
  CheckCircle2,
  AlertCircle,
  Apple,
  Sparkles,
  Calendar,
  Check,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function MbgPage() {
  const [menus, setMenus] = useState<MbgMenuItem[]>([]);
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState("Senin");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [meRes, mbgRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/mbg"),
        ]);
        if (meRes.ok) {
          const d = await meRes.json();
          setCurrentUser(d.user);
        }
        if (mbgRes.ok) {
          const m = await mbgRes.json();
          setMenus(m.data);
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

  const handleToggleStatus = async (menu: MbgMenuItem) => {
    const nextStatus = menu.status === "DISTRIBUTED" ? "SCHEDULED" : "DISTRIBUTED";
    setUpdatingId(menu.id);
    try {
      const res = await fetch("/api/mbg", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: menu.id, status: nextStatus }),
      });

      if (res.ok) {
        setMenus((prev) =>
          prev.map((m) => (m.id === menu.id ? { ...m, status: nextStatus } : m))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  const currentMenu = menus.find((m) => m.dayName === selectedDay) || menus[0];

  return (
    <DashboardShell title="Program Makan Bergizi Gratis (MBG)">
      <div className="space-y-6">
        {/* Header Hero */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-xs bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                  Program Gizi Nasional
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500 font-medium">SMAN 1 Harapan Bangsa</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight mt-1.5">
                Jadwal & Komposisi Nutrisi MBG Mingguan
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                Pemantauan menu makan sehat bergizi seimbang untuk seluruh siswa kelas 10, 11, dan 12.
                Dilengkapi rincian makronutrisi, kalori terukur, dan panduan keamanan alergen.
              </p>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
              <span className="text-[11px] text-slate-400">Jam Distribusi Makan:</span>
              <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md mt-0.5">
                11:45 - 12:30 WIB
              </span>
            </div>
          </div>
        </div>

        {/* Day Selector Pills for Mobile & Desktop */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {menus.map((m) => {
            const isSelected = selectedDay === m.dayName;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedDay(m.dayName)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shrink-0 min-h-[42px] ${
                  isSelected
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span>{m.dayName}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-xs font-semibold ${
                    m.status === "DISTRIBUTED"
                      ? isSelected
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-emerald-50 text-emerald-700"
                      : isSelected
                      ? "bg-slate-800 text-slate-400"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {m.status === "DISTRIBUTED" ? "Selesai" : "Jadwal"}
                </span>
              </button>
            );
          })}
        </div>

        {/* Featured Menu Card for Selected Day */}
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600 mx-auto mb-2" />
            <span>Memuat jadwal menu MBG...</span>
          </div>
        ) : currentMenu ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Kolom Kiri (2 cols): Komposisi Menu Makanan */}
            <div className="lg:col-span-2 rounded-lg border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Menu Hari {currentMenu.dayName}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tanggal: {formatDate(currentMenu.date)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-xs font-bold border ${
                      currentMenu.status === "DISTRIBUTED"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {currentMenu.status === "DISTRIBUTED" ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Telah Selesai Dibagikan</span>
                      </>
                    ) : (
                      <>
                        <Clock className="h-3.5 w-3.5 text-amber-600" />
                        <span>Dijadwalkan Hari Ini</span>
                      </>
                    )}
                  </span>

                  {/* Tombol Aksi Status Admin */}
                  {isAdmin && (
                    <button
                      onClick={() => handleToggleStatus(currentMenu)}
                      disabled={updatingId === currentMenu.id}
                      className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      {updatingId === currentMenu.id
                        ? "Memperbarui..."
                        : currentMenu.status === "DISTRIBUTED"
                        ? "Ubah ke Belum"
                        : "Tandai Selesai"}
                    </button>
                  )}
                </div>
              </div>

              {/* Rincian Komponen Piring Gizi */}
              <div className="space-y-3.5">
                <div className="rounded-md border border-slate-100 bg-slate-50/70 p-3 flex items-start gap-3">
                  <span className="rounded-md bg-white border border-slate-200 p-2 text-indigo-600 font-bold text-xs shrink-0">
                    🍗 Lauk Utama
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {currentMenu.mainCourse}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Sumber protein hewani berkualitas tinggi untuk mendukung konsentrasi dan stamina belajar.
                    </p>
                  </div>
                </div>

                <div className="rounded-md border border-slate-100 bg-slate-50/70 p-3 flex items-start gap-3">
                  <span className="rounded-md bg-white border border-slate-200 p-2 text-amber-600 font-bold text-xs shrink-0">
                    🍢 Pendamping
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {currentMenu.sideDish}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Sumber protein nabati kaya serat dari olahan kedelai lokal higienis.
                    </p>
                  </div>
                </div>

                <div className="rounded-md border border-slate-100 bg-slate-50/70 p-3 flex items-start gap-3">
                  <span className="rounded-md bg-white border border-slate-200 p-2 text-emerald-600 font-bold text-xs shrink-0">
                    🥦 Sayur Hijau
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {currentMenu.vegetable}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Kaya vitamin A, C, dan zat besi untuk daya tahan tubuh siswa.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-md border border-slate-100 bg-slate-50/70 p-3 flex items-start gap-3">
                    <span className="rounded-md bg-white border border-slate-200 p-2 text-pink-600 font-bold text-xs shrink-0">
                      🍌 Buah Segar
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {currentMenu.fruit}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Pencuci mulut alami sarat kalium dan serat.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-md border border-slate-100 bg-slate-50/70 p-3 flex items-start gap-3">
                    <span className="rounded-md bg-white border border-slate-200 p-2 text-sky-600 font-bold text-xs shrink-0">
                      🥛 Minuman
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {currentMenu.drink}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Kalsium dan vitamin D untuk kepadatan tulang.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Allergen alert */}
              {currentMenu.allergens && (
                <div className="rounded-md border border-amber-200 bg-amber-50/50 p-3 text-xs flex items-start gap-2.5">
                  <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="text-amber-800">
                    <strong>Catatan Alergen:</strong> Menu hari ini mengandung{" "}
                    <span className="font-semibold underline">{currentMenu.allergens}</span>. Siswa dengan riwayat alergi khusus harap melapor ke petugas UKS / Wali Kelas.
                  </span>
                </div>
              )}
            </div>

            {/* Kolom Kanan (1 col): Ringkasan Nutrisi & Kalori */}
            <div className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Rincian Nilai Gizi Per Porsi
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Standar kecukupan gizi anak usia sekolah menengah (15-18 tahun).
                </p>

                {/* Kalori Utama */}
                <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Total Energi
                  </span>
                  <div className="mt-1 flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-extrabold text-slate-900">
                      {currentMenu.calories}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      kkal
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    ~32% dari kebutuhan energi harian
                  </span>
                </div>

                {/* Makronutrisi Bars */}
                <div className="mt-6 space-y-4 text-xs">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold text-slate-700">Protein</span>
                      <span className="font-bold text-slate-900">{currentMenu.protein} gram</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${Math.min(currentMenu.protein * 2.5, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold text-slate-700">Karbohidrat</span>
                      <span className="font-bold text-slate-900">{currentMenu.carbs} gram</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${Math.min(currentMenu.carbs * 0.9, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold text-slate-700">Lemak Sehat</span>
                      <span className="font-bold text-slate-900">{currentMenu.fat} gram</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${Math.min(currentMenu.fat * 3.5, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
                Diawasi langsung oleh Ahli Gizi Puskesmas & Tim UKS Sekolah.
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </DashboardShell>
  );
}
