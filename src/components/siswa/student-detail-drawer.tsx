"use client";

import { useEffect, useState } from "react";
import { X, User, Calendar, Award, AlertCircle, BookOpen, MapPin, Phone } from "lucide-react";
import { StudentItem, GradeItem, AchievementItem, AttendanceItem, DisciplineItem } from "@/types";
import { formatDate, getStatusBadge, getAttendanceBadge } from "@/lib/utils";

interface StudentDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string | null;
}

interface StudentFullDetail extends StudentItem {
  attendances: AttendanceItem[];
  grades: GradeItem[];
  achievements: AchievementItem[];
  disciplineRecords: DisciplineItem[];
}

export function StudentDetailDrawer({
  isOpen,
  onClose,
  studentId,
}: StudentDetailDrawerProps) {
  const [student, setStudent] = useState<StudentFullDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"biodata" | "nilai" | "presensi" | "prestasi">("biodata");

  useEffect(() => {
    if (!studentId || !isOpen) return;

    async function fetchDetail() {
      setLoading(true);
      try {
        const res = await fetch(`/api/students/${studentId}`);
        if (res.ok) {
          const data = await res.json();
          setStudent(data.data);
        }
      } catch (err) {
        console.error("Failed to load student details", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDetail();
  }, [studentId, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-xl my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 font-bold text-sm">
              {student?.fullName?.charAt(0) || "S"}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {student?.fullName || "Memuat Profil Siswa..."}
              </h3>
              <p className="text-xs text-slate-500">
                NISN: {student?.nisn || "-"} • Kelas: {student?.classRoom?.name || "-"} ({student?.department?.code || "-"})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("biodata")}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === "biodata"
                ? "border-indigo-600 text-indigo-600 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Biodata Lengkap
          </button>
          <button
            onClick={() => setActiveTab("presensi")}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === "presensi"
                ? "border-indigo-600 text-indigo-600 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Presensi ({student?.attendances?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("nilai")}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === "nilai"
                ? "border-indigo-600 text-indigo-600 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Rekap Rapor ({student?.grades?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("prestasi")}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === "prestasi"
                ? "border-indigo-600 text-indigo-600 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Prestasi & BK ({student?.achievements?.length || 0})
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
            </div>
          ) : !student ? (
            <div className="text-center py-8 text-xs text-slate-500">
              Data rincian tidak ditemukan.
            </div>
          ) : (
            <>
              {/* TAB 1: BIODATA */}
              {activeTab === "biodata" && (
                <div className="space-y-6 text-xs">
                  {/* Status Banner */}
                  <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3.5">
                    <div>
                      <span className="text-[11px] text-slate-500 uppercase font-semibold">
                        Status Kesiswaan
                      </span>
                      <p className="font-bold text-slate-800 mt-0.5">
                        {student.status === "ACTIVE" ? "Aktif Mengikuti Pembelajaran" : student.status}
                      </p>
                    </div>
                    {(() => {
                      const badge = getStatusBadge(student.status);
                      return (
                        <span className={`px-2.5 py-1 rounded-sm border font-semibold text-xs ${badge.className}`}>
                          {badge.label}
                        </span>
                      );
                    })()}
                  </div>

                  {/* Grid Biodata */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-lg border border-slate-200 p-4 space-y-2.5">
                      <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2">
                        Data Identitas
                      </h4>
                      <div className="flex justify-between">
                        <span className="text-slate-500">NISN:</span>
                        <span className="font-semibold text-slate-800">{student.nisn}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">NIS Sekolah:</span>
                        <span className="font-semibold text-slate-800">{student.nis || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Jenis Kelamin:</span>
                        <span className="font-semibold text-slate-800">
                          {student.gender === "L" ? "Laki-laki" : "Perempuan"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">TTL:</span>
                        <span className="font-semibold text-slate-800">
                          {student.birthPlace || "-"}, {formatDate(student.birthDate)}
                        </span>
                      </div>
                    </div>

                    <div className="rounded-lg border border-slate-200 p-4 space-y-2.5">
                      <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2">
                        Keluarga & Kontak
                      </h4>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Nama Wali:</span>
                        <span className="font-semibold text-slate-800">{student.parentName || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Kontak/WhatsApp:</span>
                        <span className="font-semibold text-slate-800">{student.parentPhone || "-"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-1">Alamat Tinggal:</span>
                        <p className="text-slate-800 font-medium bg-slate-50 p-2 rounded-md border border-slate-100">
                          {student.address || "Belum ada data alamat tercatat."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PRESENSI */}
              {activeTab === "presensi" && (
                <div className="space-y-4 text-xs">
                  <p className="text-slate-500 text-[11px]">
                    Riwayat presensi harian siswa yang tercatat dalam sistem:
                  </p>
                  {student.attendances.length === 0 ? (
                    <div className="rounded-lg border border-slate-200 p-8 text-center text-slate-400">
                      Belum ada catatan presensi untuk siswa ini.
                    </div>
                  ) : (
                    <div className="rounded-lg border border-slate-200 overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                          <tr>
                            <th className="py-2.5 px-4">Tanggal</th>
                            <th className="py-2.5 px-4">Status</th>
                            <th className="py-2.5 px-4">Keterangan</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {student.attendances.map((att) => {
                            const badge = getAttendanceBadge(att.status);
                            return (
                              <tr key={att.id}>
                                <td className="py-2 px-4 text-slate-800 font-medium">
                                  {formatDate(att.date)}
                                </td>
                                <td className="py-2 px-4">
                                  <span className={`inline-block px-2 py-0.5 rounded-sm border font-semibold text-[11px] ${badge.className}`}>
                                    {badge.label}
                                  </span>
                                </td>
                                <td className="py-2 px-4 text-slate-500">
                                  {att.remarks || "-"}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: NILAI */}
              {activeTab === "nilai" && (
                <div className="space-y-4 text-xs">
                  <p className="text-slate-500 text-[11px]">
                    Rekap nilai asesmen sumatif per mata pelajaran:
                  </p>
                  {student.grades.length === 0 ? (
                    <div className="rounded-lg border border-slate-200 p-8 text-center text-slate-400">
                      Belum ada data nilai asesmen yang diunggah.
                    </div>
                  ) : (
                    <div className="rounded-lg border border-slate-200 overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                          <tr>
                            <th className="py-2.5 px-4">Mata Pelajaran</th>
                            <th className="py-2.5 px-4">Semester</th>
                            <th className="py-2.5 px-4 text-right">Skor Angka</th>
                            <th className="py-2.5 px-4 text-center">Predikat</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {student.grades.map((gr) => (
                            <tr key={gr.id}>
                              <td className="py-2 px-4 text-slate-800 font-medium">
                                {gr.subjectName}
                              </td>
                              <td className="py-2 px-4 text-slate-500">
                                {gr.semester} ({gr.academicYear})
                              </td>
                              <td className="py-2 px-4 text-right font-bold text-slate-900">
                                {gr.score}
                              </td>
                              <td className="py-2 px-4 text-center">
                                <span className="inline-block px-2 py-0.5 rounded-sm bg-indigo-50 text-indigo-700 font-bold border border-indigo-200 text-[11px]">
                                  {gr.gradeLetter}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: PRESTASI & BK */}
              {activeTab === "prestasi" && (
                <div className="space-y-6 text-xs">
                  {/* Piagam Prestasi */}
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Piagam & Kejuaraan Siswa</h4>
                    {student.achievements.length === 0 ? (
                      <p className="text-slate-400 italic">Belum ada data prestasi tercatat.</p>
                    ) : (
                      <div className="space-y-2">
                        {student.achievements.map((ach) => (
                          <div key={ach.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3 flex items-start justify-between">
                            <div>
                              <p className="font-bold text-slate-900">{ach.title}</p>
                              <p className="text-slate-500 text-[11px] mt-0.5">{ach.eventName}</p>
                              <p className="text-[10px] text-slate-400 mt-1">
                                Tingkat: {ach.level} • {formatDate(ach.dateAchieved)}
                              </p>
                            </div>
                            <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-sm font-semibold text-[11px]">
                              {ach.rank}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Catatan BK */}
                  <div className="border-t border-slate-100 pt-4">
                    <h4 className="font-bold text-slate-900 mb-2">Rekam Jejak Poin Kedisiplinan / BK</h4>
                    {student.disciplineRecords.length === 0 ? (
                      <p className="text-slate-400 italic">Tidak ada catatan pelanggaran (Siswa berstatus bersih).</p>
                    ) : (
                      <div className="space-y-2">
                        {student.disciplineRecords.map((disc) => (
                          <div key={disc.id} className="rounded-lg border border-slate-200 p-3 flex items-start justify-between">
                            <div>
                              <p className="font-semibold text-slate-800">{disc.description}</p>
                              <p className="text-[11px] text-slate-400 mt-0.5">Tanggal: {formatDate(disc.date)}</p>
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded-sm border font-bold text-[11px] ${
                                disc.type === "MERIT"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-rose-50 text-rose-700 border-rose-200"
                              }`}
                            >
                              {disc.type === "MERIT" ? `+${disc.points} Poin Merit` : `-${disc.points} Poin Pelanggaran`}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-3 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-md border border-slate-300 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
