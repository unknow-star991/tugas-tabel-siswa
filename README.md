# 🎓 SIMAS ACADEMIA - Sistem Informasi Manajemen Siswa & Akademik

Aplikasi web manajemen data siswa dan akademik terpadu yang dibangun dengan arsitektur **Next.js 15 (TypeScript)**, **Tailwind CSS**, **Prisma ORM**, dan **SQLite**. Mengimplementasikan **Role-Based Access Control (RBAC)** ketat dan desain antarmuka enterprise **Anti-Slop** (bebas template generic, minim saturasi warna berlebih, tipografi tajam, dan visual data-first).

---

## 👥 Akun Demo & Hak Akses (Credentials)

Sistem telah dilengkapi data awal (seeding). Anda dapat langsung menguji coba akun berikut atau menggunakan tombol jalan pintas (1-click selector) pada halaman login:

| Peran (Role) | Username / Email | Password | Hak Akses Utama |
| :--- | :--- | :--- | :--- |
| **👑 Super Admin** | `admin` *(atau admin@sekolah.sch.id)* | `admin123` | **Full CRUD Data Siswa**, Tambah Siswa, Edit Siswa, Hapus Siswa (Modal Konfirmasi), Menerbitkan Pengumuman, Akses Audit Log, Ekspor CSV. |
| **👤 User Biasa (Siswa)** | `siswa` *(atau siswa@sekolah.sch.id)* | `siswa123` | **Read-Only**: Melihat tabel direktori siswa, memfilter per kategori (Jurusan, Tingkat, Kelas, Status, Gender), pencarian real-time, melihat riwayat presensi & pengumuman. |
| **👩‍🏫 Guru / Wali Kelas** | `guru` *(atau guru@sekolah.sch.id)* | `guru123` | **Read-Only**: Memantau daftar siswa binaan, rekap absensi, dan portofolio prestasi. |

> 💡 **Fitur Cepat Ganti Peran (Role Switcher)**: Pada bagian kanan atas *topbar*, terdapat tombol **"Ganti Peran"** untuk beralih instan antara mode Admin dan mode Siswa dalam 1 kali klik tanpa perlu logout manual!

---

## 🚀 Fitur Unggulan Sistem

1. **Autentikasi & RBAC Strict**:
   - Proteksi sesi via cookie HTTP-only terenkripsi JWT.
   - Pengecekan izin berlapis: baik pada antarmuka (UI buttons tersembunyi untuk user biasa) maupun pada API endpoint (mengembalikan `HTTP 403 Forbidden` jika user biasa mencoba bypass URL/POST/DELETE).
2. **Direktori Data Siswa (Master CRUD)**:
   - Pencarian cerdas (*debounced search*) berdasarkan Nama, NISN, atau NIS.
   - Multi-Kategori Filter: Jurusan (RPL, TKJ, DKV, MIPA), Tingkat (10, 11, 12), Kelas, Status (Aktif, Cuti, Pindah, Lulus), dan Gender (L/P).
   - Form modal bertingkat untuk Admin: validasi NISN unik, input kontak wali, rombel, dan alamat.
   - Dialog konfirmasi hapus data dengan peringatan risiko.
   - Drawer Biodata 360°: Melihat rincian biodata, riwayat presensi harian, nilai rapor semester, piagam prestasi, dan catatan kedisiplinan/BK siswa.
   - Ekspor data tabel ke format CSV / Spreadsheet.
3. **Pusat Rekapitulasi Presensi**:
   - Pemantauan status kehadiran harian (Hadir, Sakit, Izin, Alpa).
   - Filter berdasarkan tanggal dan kelas.
4. **Hall of Fame Prestasi Siswa**:
   - Etalase pencapaian piagam juara lomba tingkat Sekolah, Kabupaten/Kota, Provinsi, hingga Nasional.
5. **Papan Pengumuman & Agenda Akademik**:
   - Publikasi siaran informasi resmi sekolah. Admin dapat menyematkan (*pin*) pengumuman penting di posisi teratas.
6. **Log Audit & Keamanan (Admin Only)**:
   - Pencatatan forensik otomatis setiap kali ada siswa yang ditambahkan, diubah, dihapus, atau pengguna yang login ke dalam sistem.

---

## 💻 Panduan Menjalankan Proyek

Jika ingin menjalankan aplikasi ini di terminal lain:

```bash
# 1. Masuk ke direktori
cd "/data/ai/CODINGAN KE 2"

# 2. Mode Pengembangan (Development)
npm run dev

# 3. Mode Produksi (Production Build & Start)
npm run build
npm run start -p 3000

# 4. Re-seed Database (Reset ke data default)
npx tsx prisma/seed.ts
```

Buka peramban (browser) di: `http://localhost:3000`
