"use client";

import Link from "next/link";
import { useState } from "react";
import {
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  UtensilsCrossed,
  Trophy,
  Users,
  CheckCircle2,
  CalendarCheck,
  ChevronRight,
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  Clock,
  Sparkles,
  Sun,
  Moon,
  HeartHandshake,
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export default function PublicLandingPage() {
  const { theme, toggleTheme } = useTheme();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const stats = [
    { value: "1.250+", label: "Siswa Aktif Terdaftar", sub: "Tahun Ajaran 2026/2027" },
    { value: "98.4%", label: "Tingkat Kelulusan", sub: "Terserap PTN & Industri" },
    { value: "4", label: "Konsentrasi Keahlian", sub: "RPL, TKJ, DKV, MIPA" },
    { value: "24+", label: "Mitra Dunia Usaha/Industri", sub: "Kerjasama Magang & Sertifikasi" },
  ];

  const majors = [
    {
      code: "RPL",
      name: "Rekayasa Perangkat Lunak",
      badge: "Teknologi Informasi",
      desc: "Mencetak software engineer tangguh yang menguasai full-stack web, mobile app development, basis data cloud, dan arsitektur microservices.",
      skills: ["React & Next.js", "Python & Node.js", "Database PostgreSQL", "REST & GraphQL API"],
      color: "border-indigo-500/30 bg-indigo-50/30 dark:bg-indigo-950/20",
    },
    {
      code: "TKJ",
      name: "Teknik Komputer & Jaringan",
      badge: "Infrastruktur & Cloud",
      desc: "Fokus pada rekayasa jaringan fiber optic, konfigurasi routing/switching enterprise, administrasi server Linux, dan mitigasi keamanan siber.",
      skills: ["MikroTik MTCNA", "Cisco CCNA", "Linux Server DevOps", "Cybersecurity Audit"],
      color: "border-sky-500/30 bg-sky-50/30 dark:bg-sky-950/20",
    },
    {
      code: "DKV",
      name: "Desain Komunikasi Visual",
      badge: "Kreatif & Multimedia",
      desc: "Menghasilkan kreator visual handal di bidang branding produk, ilustrasi digital, motion graphic, videografi komersial, dan perancangan UI/UX.",
      skills: ["UI/UX Figma Design", "Motion Graphics", "3D Blender Modeling", "Brand Identity"],
      color: "border-fuchsia-500/30 bg-fuchsia-50/30 dark:bg-fuchsia-950/20",
    },
    {
      code: "MIPA",
      name: "Matematika & Ilmu Pengetahuan Alam",
      badge: "Sains & Analitika",
      desc: "Peminatan sains analitis dengan fokus riset ilmiah, fisika terapan, kimia analitik, pemodelan matematika, dan persiapan olimpiade internasional.",
      skills: ["Riset Laboratorium", "Kalkulus & Statistika", "Bio-Teknologi Ramah Lingkungan", "Robotika Sains"],
      color: "border-emerald-500/30 bg-emerald-50/30 dark:bg-emerald-950/20",
    },
  ];

  const features = [
    {
      icon: UtensilsCrossed,
      title: "Program Makan Bergizi Gratis (MBG)",
      desc: "Pelaksanaan program asupan gizi seimbang harian dengan monitoring kalori, protein, dan alergen oleh tenaga ahli gizi bersertifikat.",
      badge: "Higienis & Teruji",
    },
    {
      icon: BookOpen,
      title: "Perpustakaan Pintar & E-Library",
      desc: "Katalog ribuan buku teks kurikulum merdeka dan referensi digital yang dapat dipinjam atau diakses daring tanpa batas ruang dan waktu.",
      badge: "Kurikulum Merdeka",
    },
    {
      icon: CalendarCheck,
      title: "Presensi Real-Time & Notifikasi",
      desc: "Pencatatan kehadiran digital harian yang transparan dan terhubung dengan laporan disiplin serta rekapitulasi kehadiran orang tua.",
      badge: "Disiplin Positif",
    },
    {
      icon: HeartHandshake,
      title: "Bimbingan & Konseling Terpadu",
      desc: "Layanan konsultasi privat daring untuk pengembangan karir, penjurusan perguruan tinggi, bimbingan psikososial, dan konseling siswa.",
      badge: "Privat & Aman",
    },
    {
      icon: Sparkles,
      title: "12+ Cabang Ekstrakurikuler",
      desc: "Wadah pembinaan minat dan bakat di bidang olimpiade riset sains, esport programming, seni musik, paskibra, hingga olahraga prestasi.",
      badge: "Bakat & Minat",
    },
    {
      icon: ShieldCheck,
      title: "Tata Kelola Berbasis Audit Log",
      desc: "Sistem keamanan dengan audit log menyeluruh guna menjamin kerahasiaan data nilai dan akuntabilitas rekam jejak akademik.",
      badge: "Enterprise Grade",
    },
  ];

  const faqs = [
    {
      q: "Bagaimana cara siswa dan guru masuk ke portal SIMAS?",
      a: "Siswa dan guru dapat menekan tombol 'Portal Akademik' di pojok kanan atas, lalu memasukkan username dan kata sandi resmi yang telah dibagikan oleh staf tata usaha sekolah.",
    },
    {
      q: "Apakah orang tua dapat memantau menu harian Program Makan Bergizi (MBG)?",
      a: "Ya, menu harian MBG beserta informasi kalori, makronutrisi, jadwal distribusi, dan keterangan alergen terbuka secara publik dan dapat dipantau langsung melalui portal sekolah.",
    },
    {
      q: "Bagaimana alur pengajuan Surat Keterangan Siswa Aktif?",
      a: "Siswa dapat mengakses menu 'Layanan Surat Siswa' di portal akademik, mengisi keperluan surat, dan sistem akan langsung menerbitkan dokumen resmi ber-kop sekolah yang siap dicetak atau diunduh sebagai PDF.",
    },
    {
      q: "Apakah data pribadi dalam layanan Konseling BK bersifat rahasia?",
      a: "Benar. Setiap permohonan konseling dilindungi enkripsi dan hanya dapat diakses secara privat oleh siswa bersangkutan dan Guru BK yang ditugaskan.",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-150">
      {/* Top Banner Akreditasi */}
      <div className="bg-slate-900 dark:bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-slate-200">
              SMAN 1 Harapan Bangsa &bull; NPSN: 20108922 &bull; Terakreditasi A (Unggul)
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-slate-400 text-[11px]">
            <span>Semester Gasal 2026/2027</span>
            <span>&bull;</span>
            <span>Layanan Publik Resmi Kemendikdasmen</span>
          </div>
        </div>
      </div>

      {/* Main Header / Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Identity */}
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-slate-900 dark:text-slate-50 text-base">
                  SIMAS ACADEMIA
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-xs bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  SMAN 1
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Pusat Tata Kelola Pendidikan Terpadu
              </p>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a href="#profil" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Profil
            </a>
            <a href="#kejuruan" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Konsentrasi Keahlian
            </a>
            <a href="#layanan" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Program Unggulan
            </a>
            <a href="#faq" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              FAQ
            </a>
            <a href="#kontak" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Kontak
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleTheme}
              title={theme === "dark" ? "Mode Terang" : "Mode Gelap"}
              className="h-9 w-9 flex items-center justify-center rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
            </button>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors min-h-[36px]"
            >
              <span>Portal Akademik</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            {/* Accreditation Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              Akreditasi A Unggul (96.8) &bull; Sekolah Siaga Digital 2026
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 leading-[1.15]">
              Mencetak Generasi Unggul, Berkarakter & Berdaya Saing Global.
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              SMAN 1 Harapan Bangsa memadukan kurikulum komprehensif, teknologi informasi terintegrasi,
              fasilitas perpustakaan pintar, pendampingan karir, serta pemantauan Program Makan Bergizi
              Gratis (MBG) untuk kesehatan dan masa depan siswa.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-xs hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
              >
                <span>Masuk Portal Siswa & Guru</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#kejuruan"
                className="inline-flex items-center gap-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <span>Lihat Konsentrasi Keahlian</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Stats Ribbon (Anti-slop typography, 1px flat borders) */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 border-t border-slate-200 dark:border-slate-800 pt-8">
            {stats.map((s) => (
              <div key={s.label} className="p-3">
                <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 tabular-nums">
                  {s.value}
                </p>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">
                  {s.label}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {s.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Profil Sekolah Singkat */}
      <section id="profil" className="py-16 bg-slate-50/70 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Tentang SMAN 1 Harapan Bangsa
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-2">
                Pusat Pembelajaran Holistik yang Menghubungkan Akademik dan Karakter
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
                Berdiri sejak tahun 1998, SMAN 1 Harapan Bangsa senantiasa berkomitmen menghasilkan lulusan
                yang tidak hanya unggul secara kognitif, tetapi juga berintegritas moral, berjiwa wirausaha,
                serta siap bersaing di perguruan tinggi terkemuka dan industri global.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Visi Sekolah</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Menjadi institusi pendidikan pelopor dalam inovasi sains-teknologi, kepemimpinan berwawasan lingkungan, dan akhlak mulia.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Fasilitas Modern</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Didukung 4 laboratorium komputer mutakhir, lab sains terpadu, studio multimedia podcast, smart library berkatalog daring, dan kantin sehat berstandar nasional.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
                <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 font-bold text-base">
                    BS
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      Drs. H. Bambang Sudirman, M.Pd.
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Kepala Sekolah SMAN 1 Harapan Bangsa
                    </p>
                  </div>
                </div>

                <blockquote className="mt-4 text-xs italic text-slate-600 dark:text-slate-300 leading-relaxed">
                  &ldquo;Pendidikan sejati bukanlah sekadar transfer pengetahuan, melainkan penanaman nilai kejujuran,
                  daya nalar kritis, dan kesiapan berkontribusi nyata bagi bangsa. Melalui ekosistem SIMAS ACADEMIA,
                  kami menghadirkan transparansi dan akuntabilitas pendidikan bagi seluruh civitas.&rdquo;
                </blockquote>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Masa Bakti: 2024 - Sekarang</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">Sambutan Resmi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Keahlian / Jurusan */}
      <section id="kejuruan" className="py-16 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Pilihan Peminatan & Keahlian
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-2">
              4 Konsentrasi Keahlian Berbasis Kebutuhan Industri
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Setiap jurusan dirancang dengan standar kurikulum berbasis kompetensi dan sertifikasi nasional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {majors.map((m) => (
              <div
                key={m.code}
                className={`rounded-xl border p-6 flex flex-col justify-between transition-all hover:shadow-xs ${m.color}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                      {m.badge}
                    </span>
                    <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                      {m.code}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {m.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    {m.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Kompetensi Unggulan:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {m.skills.map((s) => (
                      <span
                        key={s}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-xs bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Unggulan Sekolah (MBG, Smart Library, BK, Ekstrakurikuler) */}
      <section id="layanan" className="py-16 bg-slate-50/70 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Layanan & Inovasi Sekolah
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-2">
              Ekosistem Lengkap untuk Prestasi & Kesejahteraan Siswa
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Bukan sekadar sistem data siswa biasa, melainkan platform terpadu yang menaungi seluruh kebutuhan civitas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="h-9 w-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {f.badge}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {f.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Pusat Bantuan
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-2">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Informasi penting seputar akses portal, layanan siswa, dan tata kelola SIMAS ACADEMIA.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={faq.q}
                  className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="text-xs text-slate-400 shrink-0 ml-4 font-mono">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 bg-indigo-600 dark:bg-indigo-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Akses Seluruh Fasilitas Akademik Sekolah Sekarang
          </h2>
          <p className="mt-3 text-sm sm:text-base text-indigo-100 max-w-2xl mx-auto leading-relaxed">
            Kelola data siswa, pantau absensi kelas, unduh modul buku pelajaran, ajukan surat keterangan,
            atau pesan jadwal konseling BK dengan cepat dan aman.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-xs sm:text-sm font-bold text-indigo-900 shadow-md hover:bg-indigo-50 focus:outline-hidden transition-colors"
            >
              <span>Masuk Portal Sekarang</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Resmi */}
      <footer id="kontak" className="bg-slate-900 text-slate-400 text-xs py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            {/* Col 1: Identity */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 text-white font-bold text-sm mb-3">
                <GraduationCap className="h-5 w-5 text-indigo-400" />
                <span>SMAN 1 Harapan Bangsa</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Institusi pendidikan tingkat menengah atas berprestasi yang mengedepankan integritas,
                teknologi modern, dan kepemimpinan masa depan.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-xs bg-slate-800 text-emerald-400 border border-slate-700">
                  BAN-S/M Unggul (A)
                </span>
              </div>
            </div>

            {/* Col 2: Alamat Dinas */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                Alamat Kampus
              </h4>
              <ul className="space-y-2 text-[11px]">
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                  <span>Jl. Pendidikan Mandiri No. 45, Kompleks Akademika, Jawa Barat 40123</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-500 shrink-0" />
                  <span>(021) 8892-1044 / 0812-9988-7711</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-500 shrink-0" />
                  <span>kontak@sman1harapanbangsa.sch.id</span>
                </li>
              </ul>
            </div>

            {/* Col 3: Layanan Portal */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                Layanan SIMAS
              </h4>
              <ul className="space-y-1.5 text-[11px]">
                <li><Link href="/login" className="hover:text-white transition-colors">Presensi & Kehadiran Harian</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Program Makan Bergizi Gratis (MBG)</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Katalog E-Library & Buku Ajar</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Layanan E-Surat Keterangan</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Konseling & Bimbingan Karir</Link></li>
              </ul>
            </div>

            {/* Col 4: Jam Kerja Tata Usaha */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                Jam Layanan TU
              </h4>
              <ul className="space-y-2 text-[11px]">
                <li className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Senin &ndash; Jumat</p>
                    <p className="text-slate-400">07:00 &ndash; 15:30 WIB</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Sabtu (Ekskul & Riset)</p>
                    <p className="text-slate-400">08:00 &ndash; 12:00 WIB</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>&copy; 2026 SMAN 1 Harapan Bangsa &bull; SIMAS ACADEMIA. Hak Cipta Dilindungi.</p>
            <div className="flex items-center gap-4">
              <span>Keamanan Standar ISO 27001</span>
              <span>&bull;</span>
              <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
                Masuk Staf & Siswa
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
