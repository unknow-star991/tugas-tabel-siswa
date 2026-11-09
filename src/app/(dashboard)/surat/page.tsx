"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StudentItem, SessionUser } from "@/types";
import {
  FileText,
  Printer,
  Download,
  CheckCircle2,
  GraduationCap,
  Calendar,
  Building,
  UserCheck,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function SuratPage() {
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentItem | null>(null);
  const [purpose, setPurpose] = useState("Pengajuan Beasiswa Program Indonesia Pintar (PIP)");
  const [letterNumber] = useState("421.3/084/SMAN1-HB/XI/2026");

  useEffect(() => {
    async function loadData() {
      try {
        const [meRes, stuRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/students?limit=20"),
        ]);
        if (meRes.ok) {
          const d = await meRes.json();
          setCurrentUser(d.user);
        }
        if (stuRes.ok) {
          const s = await stuRes.json();
          setStudents(s.data);
          if (s.data.length > 0) {
            setSelectedStudent(s.data[0]);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <DashboardShell title="Layanan Persuratan Siswa">
      <div className="space-y-6">
        {/* Header (Hidden on print) */}
        <div className="print:hidden border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Generator Surat Keterangan Siswa Aktif
              </h2>
              <span className="rounded-xs bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold text-[10px] px-2 py-0.5 border border-emerald-200 dark:border-emerald-800">
                E-Document Resmi
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Penerbitan surat keterangan resmi sekolah untuk keperluan beasiswa, BPJS, tunjangan anak, atau syarat lomba.
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 shadow-2xs transition-colors min-h-[40px]"
          >
            <Printer className="h-4 w-4" />
            <span>Cetak / Unduh PDF Surat</span>
          </button>
        </div>

        {/* Form Selector (Hidden on print) */}
        <div className="print:hidden rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-2xs grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Pilih Siswa yang Diterangkan:
            </label>
            <select
              value={selectedStudent?.id || ""}
              onChange={(e) => {
                const found = students.find((s) => s.id === e.target.value);
                if (found) setSelectedStudent(found);
              }}
              className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-1.5 px-3 text-xs text-slate-900 dark:text-slate-100 focus:border-indigo-600 focus:outline-hidden"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fullName} ({s.nisn}) - {s.classRoom?.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Keperluan Penerbitan Surat:
            </label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-1.5 px-3 text-xs text-slate-900 dark:text-slate-100 focus:border-indigo-600 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Surat Resmi Preview (Designed as Physical A4 Paper) */}
        <div className="mx-auto w-full max-w-3xl rounded-xl border border-slate-300 dark:border-slate-700 bg-white p-8 sm:p-12 text-slate-900 shadow-lg print:border-none print:shadow-none print:p-0 print:m-0">
          {/* KOP SURAT */}
          <div className="border-b-4 border-double border-slate-900 pb-4 text-center">
            <div className="flex items-center justify-center gap-3 mb-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-700 text-white font-bold">
                <GraduationCap className="h-8 w-8" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest font-semibold text-slate-600">
                  Pemerintah Provinsi DKI Jakarta • Dinas Pendidikan
                </p>
                <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-950 uppercase leading-tight">
                  SMA NEGERI 1 HARAPAN BANGSA
                </h1>
                <p className="text-[11px] text-slate-600 leading-tight">
                  Jl. Pendidikan No. 45 Jakarta Selatan • Telp: (021) 7891234 • Email: info@sman1harapanbangsa.sch.id
                </p>
              </div>
            </div>
          </div>

          {/* JUDUL SURAT */}
          <div className="mt-6 text-center">
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider underline">
              SURAT KETERANGAN SISWA AKTIF
            </h2>
            <p className="text-xs font-mono text-slate-600 mt-0.5">
              Nomor: {letterNumber}
            </p>
          </div>

          {/* ISI SURAT */}
          <div className="mt-6 space-y-4 text-xs sm:text-sm leading-relaxed text-slate-800">
            <p>
              Yang bertanda tangan di bawah ini Kepala Sekolah Menengah Atas (SMA) Negeri 1 Harapan Bangsa, dengan ini menerangkan dengan sesungguhnya bahwa:
            </p>

            {/* TABEL DATA SISWA */}
            <div className="my-3 pl-4 sm:pl-8 space-y-1.5 font-medium text-xs sm:text-sm">
              <div className="grid grid-cols-3">
                <span className="text-slate-600">Nama Lengkap</span>
                <span className="col-span-2 font-bold text-slate-950">: {selectedStudent?.fullName || "Ahmad Pratama"}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-slate-600">NISN / NIS</span>
                <span className="col-span-2">: {selectedStudent?.nisn || "0081234001"} / {selectedStudent?.nis || "20261001"}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-slate-600">Tempat, Tanggal Lahir</span>
                <span className="col-span-2">: {selectedStudent?.birthPlace || "Jakarta"}, {formatDate(selectedStudent?.birthDate)}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-slate-600">Jenis Kelamin</span>
                <span className="col-span-2">: {selectedStudent?.gender === "L" ? "Laki-laki" : "Perempuan"}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-slate-600">Tingkat / Rombel</span>
                <span className="col-span-2">: {selectedStudent?.classRoom?.name || "X RPL 1"} ({selectedStudent?.department?.name || "Rekayasa Perangkat Lunak"})</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-slate-600">Nama Orang Tua / Wali</span>
                <span className="col-span-2">: {selectedStudent?.parentName || "Bambang Pratama"}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-slate-600">Alamat Tempat Tinggal</span>
                <span className="col-span-2">: {selectedStudent?.address || "Jl. Merdeka No. 12, Jakarta Selatan"}</span>
              </div>
            </div>

            <p>
              Adalah benar siswa yang bersangkutan saat ini <strong>terdaftar secara resmi dan aktif mengikuti kegiatan pembelajaran</strong> pada Semester Gasal Tahun Ajaran 2026/2027 di SMAN 1 Harapan Bangsa.
            </p>

            <p>
              Surat keterangan ini diterbitkan dengan sebenarnya atas permintaan yang bersangkutan untuk keperluan:{" "}
              <strong className="underline">{purpose}</strong>.
            </p>

            <p>
              Demikian surat keterangan ini kami buat untuk dapat dipergunakan sebagaimana mestinya.
            </p>
          </div>

          {/* TANDA TANGAN */}
          <div className="mt-10 flex justify-end text-xs sm:text-sm">
            <div className="text-left w-64 space-y-1">
              <p>Jakarta, 9 November 2026</p>
              <p className="text-slate-600">Kepala Sekolah,</p>

              {/* Tanda Tangan & Cap Digital */}
              <div className="relative py-4">
                <div className="inline-block border border-dashed border-indigo-400 bg-indigo-50/60 text-indigo-800 text-[10px] font-bold px-2 py-1 rounded-sm">
                  ✓ VERIFIKASI RESMI SIMAS
                </div>
              </div>

              <p className="font-bold underline text-slate-950">
                Bpk. H. Suryanto, M.Pd.
              </p>
              <p className="text-slate-600 text-xs">
                NIP. 19750812 200003 1 004
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
