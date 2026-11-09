"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ScheduleItem, ClassRoomItem } from "@/types";
import {
  CalendarDays,
  Clock,
  MapPin,
  User,
  BookOpen,
  Sparkles,
  ChevronRight,
} from "lucide-react";

export default function JadwalPage() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [classes, setClasses] = useState<ClassRoomItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState("Senin");
  const [selectedClassId, setSelectedClassId] = useState("");

  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

  useEffect(() => {
    async function fetchClasses() {
      try {
        const res = await fetch("/api/classes");
        if (res.ok) {
          const d = await res.json();
          setClasses(d.data);
          if (d.data.length > 0) {
            setSelectedClassId(d.data[0].id);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchClasses();
  }, []);

  useEffect(() => {
    async function fetchSchedules() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedClassId) params.set("classRoomId", selectedClassId);
        if (selectedDay) params.set("dayName", selectedDay);

        const res = await fetch(`/api/schedules?${params.toString()}`);
        if (res.ok) {
          const d = await res.json();
          setSchedules(d.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    if (selectedClassId) {
      fetchSchedules();
    }
  }, [selectedClassId, selectedDay]);

  // Hitung apakah suatu jam sedang berlangsung saat ini
  const isPeriodActive = (startTime: string, endTime: string) => {
    const now = new Date();
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);

    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    return nowMinutes >= startMinutes && nowMinutes <= endMinutes;
  };

  return (
    <DashboardShell title="Jadwal Pelajaran & Ruang Belajar">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Jadwal Mata Pelajaran & Praktikum Lab
              </h2>
              <span className="rounded-xs bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 font-bold text-[10px] px-2 py-0.5 border border-indigo-200 dark:border-indigo-800">
                TA 2026/2027
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Jadwal tatap muka, praktikum laboratorium komputer, dan projek pembelajaran kesiswaan.
            </p>
          </div>

          {/* Rombel Selector */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Rombel:
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:border-indigo-600 focus:outline-hidden"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.department?.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Day Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {days.map((day) => {
            const isSelected = selectedDay === day;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 min-h-[40px] ${
                  isSelected
                    ? "bg-slate-900 dark:bg-indigo-600 text-white shadow-xs"
                    : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>

        {/* Schedule List */}
        <div className="space-y-3">
          {loading ? (
            <div className="py-16 text-center text-xs text-slate-500">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600 mx-auto mb-2" />
              <span>Memuat jadwal mata pelajaran...</span>
            </div>
          ) : schedules.length === 0 ? (
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center text-xs text-slate-500">
              <CalendarDays className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="font-semibold text-slate-700 dark:text-slate-300">
                Tidak ada jadwal pelajaran di hari {selectedDay} untuk kelas ini.
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Jadwal mungkin kosong atau dialokasikan untuk kegiatan mandiri / libur.
              </p>
            </div>
          ) : (
            schedules.map((sch) => {
              const active = isPeriodActive(sch.startTime, sch.endTime);

              return (
                <div
                  key={sch.id}
                  className={`rounded-lg border p-4 sm:p-5 transition-all bg-white dark:bg-slate-900 shadow-2xs ${
                    active
                      ? "border-emerald-400 dark:border-emerald-600 bg-emerald-50/20 dark:bg-emerald-950/20 ring-1 ring-emerald-400"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      {/* Period Badge */}
                      <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        <span className="text-[9px] uppercase tracking-wider text-slate-400">Jam</span>
                        <span className="text-sm leading-none font-extrabold">{sch.period}</span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                            {sch.subjectName}
                          </h3>
                          {active && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              Sedang Berlangsung
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                          <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                            <User className="h-3.5 w-3.5 text-slate-400" />
                            {sch.teacherName}
                          </span>
                          <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium">
                            <MapPin className="h-3.5 w-3.5" />
                            {sch.roomName}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span>{sch.startTime} - {sch.endTime} WIB</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
