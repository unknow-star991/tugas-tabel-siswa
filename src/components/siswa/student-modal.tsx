"use client";

import { useState, useEffect } from "react";
import { X, Save, AlertCircle } from "lucide-react";
import { StudentItem, DepartmentItem, ClassRoomItem } from "@/types";

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  studentToEdit?: StudentItem | null;
  departments: DepartmentItem[];
  classes: ClassRoomItem[];
}

export function StudentModal({
  isOpen,
  onClose,
  onSuccess,
  studentToEdit,
  departments,
  classes,
}: StudentModalProps) {
  const isEdit = Boolean(studentToEdit);

  const [formData, setFormData] = useState({
    nisn: "",
    nis: "",
    fullName: "",
    gender: "L" as "L" | "P",
    birthDate: "",
    birthPlace: "",
    departmentId: "",
    classRoomId: "",
    status: "ACTIVE",
    parentName: "",
    parentPhone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (studentToEdit) {
      setFormData({
        nisn: studentToEdit.nisn || "",
        nis: studentToEdit.nis || "",
        fullName: studentToEdit.fullName || "",
        gender: studentToEdit.gender || "L",
        birthDate: studentToEdit.birthDate || "",
        birthPlace: studentToEdit.birthPlace || "",
        departmentId: studentToEdit.departmentId || "",
        classRoomId: studentToEdit.classRoomId || "",
        status: studentToEdit.status || "ACTIVE",
        parentName: studentToEdit.parentName || "",
        parentPhone: studentToEdit.parentPhone || "",
        address: studentToEdit.address || "",
      });
    } else {
      setFormData({
        nisn: "",
        nis: "",
        fullName: "",
        gender: "L",
        birthDate: "",
        birthPlace: "",
        departmentId: departments[0]?.id || "",
        classRoomId: classes[0]?.id || "",
        status: "ACTIVE",
        parentName: "",
        parentPhone: "",
        address: "",
      });
    }
    setError(null);
  }, [studentToEdit, departments, classes, isOpen]);

  // Filter kelas berdasarkan jurusan yang dipilih
  const filteredClasses = formData.departmentId
    ? classes.filter((c) => c.departmentId === formData.departmentId)
    : classes;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = isEdit ? `/api/students/${studentToEdit?.id}` : "/api/students";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal menyimpan data siswa.");
        return;
      }

      onSuccess();
      onClose();
    } catch {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isEdit ? "Perbarui Data Siswa" : "Tambah Siswa Baru"}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Isi data pokok siswa sesuai dengan dokumen identitas resmi (Kartu Keluarga / Ijazah).
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Row 1: NISN & NIS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                NISN <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={10}
                value={formData.nisn}
                onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                placeholder="10 digit nomor nasional"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                NIS Sekolah
              </label>
              <input
                type="text"
                value={formData.nis}
                onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                placeholder="Nomor induk internal sekolah"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
              />
            </div>
          </div>

          {/* Row 2: Nama Lengkap & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Lengkap Siswa <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Nama lengkap sesuai akta kelahiran"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jenis Kelamin <span className="text-rose-600">*</span>
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as "L" | "P" })}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
              >
                <option value="L">Laki-laki (L)</option>
                <option value="P">Perempuan (P)</option>
              </select>
            </div>
          </div>

          {/* Row 3: Jurusan & Kelas & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Program Keahlian <span className="text-rose-600">*</span>
              </label>
              <select
                required
                value={formData.departmentId}
                onChange={(e) => {
                  const deptId = e.target.value;
                  const firstClass = classes.find((c) => c.departmentId === deptId);
                  setFormData({
                    ...formData,
                    departmentId: deptId,
                    classRoomId: firstClass?.id || "",
                  });
                }}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
              >
                <option value="">Pilih Jurusan</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Rombel / Kelas <span className="text-rose-600">*</span>
              </label>
              <select
                required
                value={formData.classRoomId}
                onChange={(e) => setFormData({ ...formData, classRoomId: e.target.value })}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
              >
                <option value="">Pilih Kelas</option>
                {filteredClasses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Status Keaktifan
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
              >
                <option value="ACTIVE">Aktif Belajar</option>
                <option value="LEAVE">Cuti Sementara</option>
                <option value="TRANSFERRED">Pindah / Mutasi</option>
                <option value="GRADUATED">Telah Lulus</option>
              </select>
            </div>
          </div>

          {/* Row 4: Tempat Lahir & Tanggal Lahir */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tempat Lahir
              </label>
              <input
                type="text"
                value={formData.birthPlace}
                onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                placeholder="Kota / Kabupaten lahir"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tanggal Lahir
              </label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
              />
            </div>
          </div>

          {/* Row 5: Wali & Kontak */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Orang Tua / Wali
              </label>
              <input
                type="text"
                value={formData.parentName}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                placeholder="Nama ayah / ibu / wali"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor Kontak / WhatsApp
              </label>
              <input
                type="text"
                value={formData.parentPhone}
                onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                placeholder="08xxxxxxxxxx"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
              />
            </div>
          </div>

          {/* Row 6: Alamat */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alamat Domisili Lengkap
            </label>
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Nama jalan, RT/RW, kelurahan, kecamatan"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors shadow-2xs disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? "Menyimpan..." : isEdit ? "Perbarui Data" : "Simpan Siswa"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
