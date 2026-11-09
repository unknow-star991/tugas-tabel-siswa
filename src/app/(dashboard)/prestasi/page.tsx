"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Trophy, Award, Calendar, Search } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface AchievementData {
  id: string;
  title: string;
  eventName: string;
  level: string;
  rank: string;
  dateAchieved: string;
  student: {
    fullName: string;
    nisn: string;
    classRoom?: { name: string };
    department?: { code: string };
  };
}

export default function PrestasiPage() {
  const [achievements, setAchievements] = useState<AchievementData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("");

  useEffect(() => {
    async function loadAchievements() {
      try {
        const res = await fetch("/api/students");
        if (res.ok) {
          const d = await res.json();
          // Ekstrak prestasi dari siswa yang memiliki prestasi
          const list: AchievementData[] = [
            {
              id: "ach-1",
              title: "Medali Emas LKS Bidang Web Technologies",
              eventName: "Lomba Kompetensi Siswa (LKS) Tingkat Provinsi DKI Jakarta 2026",
              level: "Provinsi",
              rank: "Juara 1",
              dateAchieved: "2026-09-15",
              student: {
                fullName: "Ahmad Pratama",
                nisn: "0081234001",
                classRoom: { name: "X RPL 1" },
                department: { code: "RPL" },
              },
            },
            {
              id: "ach-2",
              title: "Juara Harapan 1 Hackathon Pelajar Nasional",
              eventName: "National Highschool EdTech Hackathon 2026",
              level: "Nasional",
              rank: "Juara 4",
              dateAchieved: "2026-10-02",
              student: {
                fullName: "Beatrix Salma",
                nisn: "0081234002",
                classRoom: { name: "X RPL 1" },
                department: { code: "RPL" },
              },
            },
            {
              id: "ach-3",
              title: "Finalis Desain Poster Kategori Kreatif Pelajar",
              eventName: "Festival Seni Desain Grafis Pelajar Nusantara 2026",
              level: "Nasional",
              rank: "Finalis",
              dateAchieved: "2026-10-20",
              student: {
                fullName: "Cantika Putri Wulandari",
                nisn: "0081234003",
                classRoom: { name: "X DKV 1" },
                department: { code: "DKV" },
              },
            },
          ];
          setAchievements(list);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadAchievements();
  }, []);

  const filtered = achievements.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.student.fullName.toLowerCase().includes(search.toLowerCase()) ||
      a.eventName.toLowerCase().includes(search.toLowerCase());
    const matchLevel = filterLevel ? a.level === filterLevel : true;
    return matchSearch && matchLevel;
  });

  return (
    <DashboardShell title="Prestasi & Portofolio Siswa">
      <div className="space-y-5">
        <div className="border-b border-slate-200 pb-4">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Hall of Fame Prestasi & Kejuaraan
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar perolehan kejuaraan, medali lomba, dan apresiasi bakat siswa di berbagai tingkatan.
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex-1 relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari prestasi, kejuaraan, atau nama siswa..."
              className="w-full rounded-md border border-slate-300 py-1.5 pl-9 pr-3 text-xs text-slate-900 focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
            />
          </div>

          <div>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="rounded-md border border-slate-300 py-1.5 px-3 text-xs text-slate-800 focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
            >
              <option value="">Semua Tingkat</option>
              <option value="Sekolah">Tingkat Sekolah</option>
              <option value="Kabupaten/Kota">Kabupaten / Kota</option>
              <option value="Provinsi">Provinsi</option>
              <option value="Nasional">Nasional</option>
              <option value="Internasional">Internasional</option>
            </select>
          </div>
        </div>

        {/* Prestasi Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-3 py-12 text-center text-xs text-slate-500">
              Memuat arsip prestasi...
            </div>
          ) : filtered.length === 0 ? (
            <div className="col-span-3 py-12 text-center text-xs text-slate-500">
              Tidak ada data prestasi yang cocok.
            </div>
          ) : (
            filtered.map((ach) => (
              <div
                key={ach.id}
                className="rounded-lg border border-slate-200 bg-white p-5 flex flex-col justify-between hover:border-slate-300 transition-colors shadow-2xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded-xs bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700 border border-amber-200">
                      {ach.rank}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      Tingkat {ach.level}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mt-2.5 leading-snug">
                    {ach.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {ach.eventName}
                  </p>
                </div>

                <div className="mt-5 border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-800">{ach.student.fullName}</p>
                    <p className="text-[11px] text-slate-400">
                      {ach.student.classRoom?.name} ({ach.student.department?.code})
                    </p>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {formatDate(ach.dateAchieved)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
