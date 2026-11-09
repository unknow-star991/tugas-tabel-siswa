"use client";

import { useState, useEffect, useCallback } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StudentModal } from "@/components/siswa/student-modal";
import { StudentDeleteDialog } from "@/components/siswa/student-delete-dialog";
import { StudentDetailDrawer } from "@/components/siswa/student-detail-drawer";
import {
  StudentItem,
  DepartmentItem,
  ClassRoomItem,
  SessionUser,
} from "@/types";
import { getStatusBadge, formatDate } from "@/lib/utils";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Filter,
  Download,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

export default function SiswaPage() {
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [classes, setClasses] = useState<ClassRoomItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [classRoomId, setClassRoomId] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [status, setStatus] = useState("");
  const [gender, setGender] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 10;

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<StudentItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<StudentItem | null>(null);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Load current user
  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const d = await res.json();
          setCurrentUser(d.user);
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchMe();
  }, []);

  // Load departments and classes
  useEffect(() => {
    async function loadMeta() {
      try {
        const [deptRes, classRes] = await Promise.all([
          fetch("/api/departments"),
          fetch("/api/classes"),
        ]);
        if (deptRes.ok) {
          const d = await deptRes.json();
          setDepartments(d.data);
        }
        if (classRes.ok) {
          const c = await classRes.json();
          setClasses(c.data);
        }
      } catch (e) {
        console.error("Failed to load metadata", e);
      }
    }
    loadMeta();
  }, []);

  // Fetch students
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", limit.toString());
      if (search) params.set("search", search);
      if (departmentId) params.set("departmentId", departmentId);
      if (classRoomId) params.set("classRoomId", classRoomId);
      if (gradeLevel) params.set("gradeLevel", gradeLevel);
      if (status) params.set("status", status);
      if (gender) params.set("gender", gender);

      const res = await fetch(`/api/students?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setStudents(json.data);
        setTotalPages(json.pagination.totalPages);
        setTotalCount(json.pagination.total);
      }
    } catch (e) {
      console.error("Error loading students", e);
    } finally {
      setLoading(false);
    }
  }, [page, search, departmentId, classRoomId, gradeLevel, status, gender]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const isAdmin = currentUser?.role === "ADMIN";

  const handleResetFilters = () => {
    setSearch("");
    setDepartmentId("");
    setClassRoomId("");
    setGradeLevel("");
    setStatus("");
    setGender("");
    setPage(1);
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (students.length === 0) return;
    const headers = ["NISN", "NIS", "Nama Lengkap", "Jenis Kelamin", "Jurusan", "Kelas", "Status", "Wali", "No HP"];
    const rows = students.map((s) => [
      `"${s.nisn}"`,
      `"${s.nis || "-"}"`,
      `"${s.fullName}"`,
      s.gender,
      `"${s.department?.name || "-"}"`,
      `"${s.classRoom?.name || "-"}"`,
      s.status,
      `"${s.parentName || "-"}"`,
      `"${s.parentPhone || "-"}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `data_siswa_simas_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardShell title="Direktori Data Siswa">
      <div className="space-y-5">
        {/* Header Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Data Induk Siswa
              </h2>
              {isAdmin ? (
                <span className="rounded-sm bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-700 border border-indigo-200">
                  Full CRUD Admin
                </span>
              ) : (
                <span className="rounded-sm bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700 border border-slate-200">
                  Mode Lihat (Read-Only)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola dan telusuri arsip siswa terdaftar berdasarkan kategori jurusan dan rombongan belajar.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" />
              <span>Ekspor CSV</span>
            </button>

            {/* Tombol Tambah Siswa (Hanya tampil untuk ADMIN) */}
            {isAdmin && (
              <button
                onClick={() => {
                  setStudentToEdit(null);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 shadow-2xs transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Tambah Siswa</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Bar (Search + Dropdown Categories) */}
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            {/* Search Input */}
            <div className="lg:col-span-2 relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Cari nama, NISN, atau NIS..."
                className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
              />
            </div>

            {/* Filter Jurusan */}
            <div>
              <select
                value={departmentId}
                onChange={(e) => {
                  setDepartmentId(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-md border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
              >
                <option value="">Semua Jurusan</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.code} - {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Tingkat Kelas */}
            <div>
              <select
                value={gradeLevel}
                onChange={(e) => {
                  setGradeLevel(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-md border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
              >
                <option value="">Semua Tingkat</option>
                <option value="10">Kelas 10 (X)</option>
                <option value="11">Kelas 11 (XI)</option>
                <option value="12">Kelas 12 (XII)</option>
              </select>
            </div>

            {/* Filter Status */}
            <div>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-md border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
              >
                <option value="">Semua Status</option>
                <option value="ACTIVE">Aktif</option>
                <option value="LEAVE">Cuti</option>
                <option value="TRANSFERRED">Pindah / Mutasi</option>
                <option value="GRADUATED">Lulus</option>
              </select>
            </div>

            {/* Reset Button */}
            <div>
              <button
                onClick={handleResetFilters}
                className="w-full flex items-center justify-center gap-1.5 rounded-md border border-slate-300 bg-slate-50 py-2 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
                <span>Reset Filter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="rounded-lg border border-slate-200 bg-white overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">No</th>
                  <th className="py-3 px-4">Nama Siswa</th>
                  <th className="py-3 px-4 text-right">NISN</th>
                  <th className="py-3 px-4">Program Keahlian</th>
                  <th className="py-3 px-4">Rombel</th>
                  <th className="py-3 px-4 text-center">L/P</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center w-32">
                    {isAdmin ? "Aksi Admin" : "Rincian"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
                        <span className="text-xs">Memuat direktori data siswa...</span>
                      </div>
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500">
                      <p className="font-semibold text-slate-700">Tidak ada data siswa yang cocok.</p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Coba sesuaikan kata kunci pencarian atau bersihkan filter Anda.
                      </p>
                    </td>
                  </tr>
                ) : (
                  students.map((student, idx) => {
                    const badge = getStatusBadge(student.status);
                    const rowNumber = (page - 1) * limit + idx + 1;

                    return (
                      <tr
                        key={student.id}
                        className="hover:bg-slate-50/70 transition-colors"
                      >
                        <td className="py-3 px-4 text-center text-slate-400 font-mono text-[11px]">
                          {rowNumber}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => {
                              setSelectedStudentId(student.id);
                              setDetailDrawerOpen(true);
                            }}
                            className="font-bold text-slate-900 hover:text-indigo-600 text-left transition-colors"
                          >
                            {student.fullName}
                          </button>
                          <span className="block text-[11px] text-slate-400">
                            TTL: {student.birthPlace || "-"}, {formatDate(student.birthDate)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-slate-700 font-medium">
                          {student.nisn}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-700">
                          {student.department?.code} - {student.department?.name}
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-medium">
                          {student.classRoom?.name || "-"}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded-xs font-semibold text-[10px] ${
                              student.gender === "L"
                                ? "bg-sky-50 text-sky-700 border border-sky-200"
                                : "bg-pink-50 text-pink-700 border border-pink-200"
                            }`}
                          >
                            {student.gender}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-sm border font-semibold text-[11px] ${badge.className}`}
                          >
                            {badge.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Tombol Lihat Detail (Tersedia untuk Semua Pengguna) */}
                            <button
                              onClick={() => {
                                setSelectedStudentId(student.id);
                                setDetailDrawerOpen(true);
                              }}
                              title="Lihat Rincian Siswa"
                              className="rounded-md border border-slate-200 p-1 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>

                            {/* Tombol Edit & Hapus (HANYA DITAMPILKAN UNTUK ADMIN) */}
                            {isAdmin && (
                              <>
                                <button
                                  onClick={() => {
                                    setStudentToEdit(student);
                                    setIsModalOpen(true);
                                  }}
                                  title="Edit Data Siswa"
                                  className="rounded-md border border-indigo-200 bg-indigo-50/50 p-1 text-indigo-700 hover:bg-indigo-100 transition-colors"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    setStudentToDelete(student);
                                    setDeleteDialogOpen(true);
                                  }}
                                  title="Hapus Data Siswa"
                                  className="rounded-md border border-rose-200 bg-rose-50/50 p-1 text-rose-700 hover:bg-rose-100 transition-colors"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-slate-200 px-4 py-3 bg-slate-50 gap-2 text-xs text-slate-600">
            <div>
              Menampilkan {students.length > 0 ? (page - 1) * limit + 1 : 0} -{" "}
              {Math.min(page * limit, totalCount)} dari{" "}
              <span className="font-bold text-slate-900">{totalCount}</span> Siswa
            </div>

            <div className="flex items-center gap-1">
              <button
                disabled={page <= 1 || loading}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Sebelumnya</span>
              </button>

              <span className="px-3 py-1 font-semibold text-slate-800">
                Hal {page} dari {totalPages || 1}
              </span>

              <button
                disabled={page >= totalPages || loading}
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                className="flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors"
              >
                <span>Selanjutnya</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Tambah/Edit (Admin Only) */}
      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchStudents}
        studentToEdit={studentToEdit}
        departments={departments}
        classes={classes}
      />

      {/* Dialog Konfirmasi Hapus (Admin Only) */}
      <StudentDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onSuccess={fetchStudents}
        student={studentToDelete}
      />

      {/* Modal Detail Biodata & Akademik 360 */}
      <StudentDetailDrawer
        isOpen={detailDrawerOpen}
        onClose={() => setDetailDrawerOpen(false)}
        studentId={selectedStudentId}
      />
    </DashboardShell>
  );
}
