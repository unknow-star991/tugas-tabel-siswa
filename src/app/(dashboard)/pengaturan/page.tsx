"use client";

import { useState, useEffect } from "react";
import {
  User,
  Lock,
  Palette,
  Shield,
  CheckCircle2,
  AlertCircle,
  Save,
  Sun,
  Moon,
  Laptop,
  KeyRound,
  GraduationCap,
  Sparkles,
  BookOpen,
  CalendarCheck,
  Award,
} from "lucide-react";
import { SessionUser } from "@/types";
import { useTheme } from "@/components/theme-provider";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function PengaturanPage() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<"profil" | "keamanan" | "preferensi">("profil");

  // Profile State
  const [profileData, setProfileData] = useState<{
    user: SessionUser & { createdAt?: string };
    studentRecord?: any;
  } | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Password State
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const res = await fetch("/api/auth/profile");
        if (res.ok) {
          const d = await res.json();
          if (d.data?.user) {
            setProfileData(d.data);
            setFullName(d.data.user.fullName || "");
            setEmail(d.data.user.email || "");
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setProfileMsg({ type: "error", text: data.error || "Gagal memperbarui profil." });
        return;
      }

      setProfileMsg({ type: "success", text: "Informasi profil Anda berhasil diperbarui." });
      if (profileData) {
        setProfileData({
          ...profileData,
          user: { ...profileData.user, fullName, email },
        });
      }
    } catch {
      setProfileMsg({ type: "error", text: "Terjadi kesalahan saat menyimpan data." });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "Konfirmasi kata sandi baru tidak cocok." });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMsg({ type: "error", text: "Kata sandi baru minimal harus 6 karakter." });
      return;
    }

    setSavingPassword(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPasswordMsg({ type: "error", text: data.error || "Gagal mengganti kata sandi." });
        return;
      }

      setPasswordMsg({ type: "success", text: "Kata sandi akun Anda berhasil diperbarui!" });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setPasswordMsg({ type: "error", text: "Terjadi kesalahan saat mengubah kata sandi." });
    } finally {
      setSavingPassword(false);
    }
  };

  const isAdmin = profileData?.user?.role === "ADMIN";

  return (
    <DashboardShell title="Pengaturan Akun">
      <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Pengaturan Akun & Keamanan
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Kelola profil identitas, perbarui kata sandi, dan sesuaikan preferensi tampilan sistem SIMAS.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-1 sm:space-x-3 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("profil")}
          className={`flex items-center gap-2 px-3.5 py-2.5 border-b-2 transition-colors min-h-[40px] ${
            activeTab === "profil"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <User className="h-4 w-4" />
          <span>Profil Pengguna</span>
        </button>

        <button
          onClick={() => setActiveTab("keamanan")}
          className={`flex items-center gap-2 px-3.5 py-2.5 border-b-2 transition-colors min-h-[40px] ${
            activeTab === "keamanan"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <Lock className="h-4 w-4" />
          <span>Keamanan & Password</span>
        </button>

        <button
          onClick={() => setActiveTab("preferensi")}
          className={`flex items-center gap-2 px-3.5 py-2.5 border-b-2 transition-colors min-h-[40px] ${
            activeTab === "preferensi"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <Palette className="h-4 w-4" />
          <span>Tampilan & Hak Akses</span>
        </button>
      </div>

      {/* Content Tabs */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">
          Memuat data pengaturan akun...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Tab 1: Profil */}
            {activeTab === "profil" && (
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      Informasi Akun Pribadi
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Perubahan nama dan kontak akan tersinkronisasi di laporan presensi dan cetak surat.
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-xs border uppercase tracking-wider ${
                      isAdmin
                        ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-800"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800"
                    }`}
                  >
                    {isAdmin ? "Super Admin" : "Siswa Aktif"}
                  </span>
                </div>

                {profileMsg && (
                  <div
                    className={`mb-4 p-3 rounded-md text-xs flex items-center gap-2 border ${
                      profileMsg.type === "success"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                        : "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800"
                    }`}
                  >
                    {profileMsg.type === "success" ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                    )}
                    <span>{profileMsg.text}</span>
                  </div>
                )}

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Username Login (Terkunci)
                      </label>
                      <input
                        type="text"
                        disabled
                        value={profileData?.user?.username || ""}
                        className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 px-3 py-2 text-xs text-slate-500 cursor-not-allowed font-mono"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">Username dikelola oleh Tata Usaha.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Peran Akun
                      </label>
                      <input
                        type="text"
                        disabled
                        value={isAdmin ? "Super Administrator" : "Siswa Sekolah"}
                        className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 px-3 py-2 text-xs text-slate-500 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Nama Lengkap Resmi
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Alamat Email Aktif
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 disabled:opacity-50 min-h-[36px]"
                    >
                      <Save className="h-3.5 w-3.5" />
                      <span>{savingProfile ? "Menyimpan..." : "Simpan Pembaruan Profil"}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Tab 2: Keamanan */}
            {activeTab === "keamanan" && (
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Ganti Kata Sandi Akun
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Gunakan kombinasi sandi yang kuat untuk menjaga kerahasiaan data akademik Anda.
                  </p>
                </div>

                {passwordMsg && (
                  <div
                    className={`mb-4 p-3 rounded-md text-xs flex items-center gap-2 border ${
                      passwordMsg.type === "success"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                        : "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800"
                    }`}
                  >
                    {passwordMsg.type === "success" ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                    )}
                    <span>{passwordMsg.text}</span>
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Kata Sandi Saat Ini
                    </label>
                    <input
                      type="password"
                      required
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Masukkan kata sandi lama"
                      className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Kata Sandi Baru
                      </label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Minimal 6 karakter"
                        className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Ulangi Kata Sandi Baru
                      </label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Samakan dengan di atas"
                        className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="rounded-md bg-slate-50 dark:bg-slate-800/60 p-3 text-[11px] text-slate-500 dark:text-slate-400 space-y-1 border border-slate-200 dark:border-slate-800">
                    <p className="font-bold text-slate-700 dark:text-slate-300">Tips Keamanan Sandi:</p>
                    <ul className="list-disc list-inside space-y-0.5">
                      <li>Hindari menggunakan tanggal lahir atau nama pengguna</li>
                      <li>Kombinasikan huruf besar, huruf kecil, dan angka</li>
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <button
                      type="submit"
                      disabled={savingPassword}
                      className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 disabled:opacity-50 min-h-[36px]"
                    >
                      <KeyRound className="h-3.5 w-3.5" />
                      <span>{savingPassword ? "Memperbarui..." : "Perbarui Kata Sandi"}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Tab 3: Preferensi & Hak Akses */}
            {activeTab === "preferensi" && (
              <div className="space-y-6">
                {/* Theme Selector */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Tema Tampilan Antarmuka
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-4">
                    Pilih tema yang paling nyaman untuk mata Anda saat beraktivitas di portal SIMAS.
                  </p>

                  <div className="grid grid-cols-2 gap-3 max-w-sm">
                    <button
                      onClick={() => theme === "dark" && toggleTheme()}
                      className={`flex items-center gap-2.5 p-3 rounded-lg border text-left text-xs font-bold transition-all ${
                        theme === "light"
                          ? "border-indigo-600 bg-indigo-50/50 text-indigo-700 ring-1 ring-indigo-600"
                          : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Sun className="h-4 w-4 text-amber-500" />
                      <span>Mode Terang (Light)</span>
                    </button>

                    <button
                      onClick={() => theme === "light" && toggleTheme()}
                      className={`flex items-center gap-2.5 p-3 rounded-lg border text-left text-xs font-bold transition-all ${
                        theme === "dark"
                          ? "border-indigo-500 bg-indigo-950/40 text-indigo-300 ring-1 ring-indigo-500"
                          : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Moon className="h-4 w-4 text-indigo-400" />
                      <span>Mode Gelap (Dark)</span>
                    </button>
                  </div>
                </div>

                {/* Role Matrix */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Matriks Kewenangan & Izin Modul
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-4">
                    Hak akses Anda saat ini sebagai <span className="font-bold">{profileData?.user?.role}</span>:
                  </p>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    <div className="py-2.5 flex items-center justify-between">
                      <span className="text-slate-700 dark:text-slate-300">Data Pokok Siswa</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {isAdmin ? "Full Akses (Tambah, Edit, Hapus, Export)" : "Read-Only (Lihat & Filter)"}
                      </span>
                    </div>

                    <div className="py-2.5 flex items-center justify-between">
                      <span className="text-slate-700 dark:text-slate-300">Menu Makan Bergizi Gratis (MBG)</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {isAdmin ? "Ubah Status Distribusi & Menu" : "Lihat Jadwal & Menu Gizi"}
                      </span>
                    </div>

                    <div className="py-2.5 flex items-center justify-between">
                      <span className="text-slate-700 dark:text-slate-300">Katalog Buku Perpustakaan</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {isAdmin ? "Manajemen Stok & Tambah Buku" : "Pinjam Buku & Unduh E-Book"}
                      </span>
                    </div>

                    <div className="py-2.5 flex items-center justify-between">
                      <span className="text-slate-700 dark:text-slate-300">Layanan Konseling BK</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {isAdmin ? "Tanggapi & Jadwalkan Sesi" : "Ajukan Sesi Konseling Privat"}
                      </span>
                    </div>

                    <div className="py-2.5 flex items-center justify-between">
                      <span className="text-slate-700 dark:text-slate-300">Audit Forensik & Keamanan</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {isAdmin ? "Akses Penuh Audit Log" : "Akses Dibatasi (Admin Saja)"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Side Info Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-800 dark:text-slate-100 text-base">
                  {profileData?.user?.fullName?.charAt(0) || "U"}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {profileData?.user?.fullName}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    @{profileData?.user?.username}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Status Akun:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    Aktif & Terverifikasi
                  </span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Tingkat Hak Akses:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {profileData?.user?.role}
                  </span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Unit Sekolah:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    SMAN 1 Harapan Bangsa
                  </span>
                </div>
              </div>
            </div>

            {/* If Student record exists, show academic snapshot */}
            {profileData?.studentRecord && (
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100">
                  <GraduationCap className="h-4 w-4 text-indigo-600" />
                  <span>Rekam Jejak Siswa Terkait</span>
                </div>

                <div className="text-xs space-y-2 text-slate-600 dark:text-slate-400">
                  <p>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">NISN:</span>{" "}
                    {profileData.studentRecord.nisn}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Kelas:</span>{" "}
                    {profileData.studentRecord.classRoom?.name}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Konsentrasi:</span>{" "}
                    {profileData.studentRecord.department?.name}
                  </p>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-sm">
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                        {profileData.studentRecord._count?.attendances || 0}
                      </p>
                      <p className="text-[10px] text-slate-400">Presensi</p>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-sm">
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                        {profileData.studentRecord._count?.achievements || 0}
                      </p>
                      <p className="text-[10px] text-slate-400">Prestasi</p>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-sm">
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                        {profileData.studentRecord._count?.grades || 0}
                      </p>
                      <p className="text-[10px] text-slate-400">Nilai Mapel</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    </DashboardShell>
  );
}
