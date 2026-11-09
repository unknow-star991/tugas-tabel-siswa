"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { BookItem, SessionUser } from "@/types";
import {
  BookOpen,
  Search,
  Filter,
  Plus,
  BookmarkCheck,
  CheckCircle2,
  Download,
  X,
  Library,
} from "lucide-react";

export default function BukuPelajaranPage() {
  const [books, setBooks] = useState<BookItem[]>([]);
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");

  // Modal Tambah Buku (Admin Only)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publisher: "",
    category: "Kejuruan",
    gradeLevel: "10",
    isbn: "",
    stock: 35,
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadInitial() {
      try {
        const [meRes, booksRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/books"),
        ]);
        if (meRes.ok) {
          const d = await meRes.json();
          setCurrentUser(d.user);
        }
        if (booksRes.ok) {
          const b = await booksRes.json();
          setBooks(b.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadInitial();
  }, []);

  const isAdmin = currentUser?.role === "ADMIN";

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category) params.set("category", category);
      if (gradeLevel) params.set("gradeLevel", gradeLevel);

      const res = await fetch(`/api/books?${params.toString()}`);
      if (res.ok) {
        const d = await res.json();
        setBooks(d.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [category, gradeLevel]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBooks();
  };

  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setFormData({
          title: "",
          author: "",
          publisher: "",
          category: "Kejuruan",
          gradeLevel: "10",
          isbn: "",
          stock: 35,
        });
        setSuccessMsg("Koleksi buku baru berhasil ditambahkan!");
        setTimeout(() => setSuccessMsg(null), 4000);
        fetchBooks();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardShell title="Buku Pelajaran & E-Library">
      <div className="space-y-5">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Katalog Buku Pelajaran & Modul Belajar
              </h2>
              <span className="rounded-xs bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 border border-indigo-200">
                Kurikulum Merdeka
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Daftar buku pegangan siswa, modul kejuruan, dan buku paket teks resmi SMAN 1 Harapan Bangsa.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-1.5 rounded-md bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-700 shadow-2xs transition-colors min-h-[40px]"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Buku</span>
            </button>
          )}
        </div>

        {successMsg && (
          <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Filter & Search Bar - Responsive Grid */}
        <div className="rounded-lg border border-slate-200 bg-white p-3.5 sm:p-4 shadow-2xs">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative lg:col-span-2">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari judul buku, penulis, penerbit..."
                className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-xs text-slate-900 focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
              />
            </div>

            <div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-md border border-slate-300 py-2 px-3 text-xs text-slate-800 focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
              >
                <option value="">Semua Kategori</option>
                <option value="Kejuruan">Kejuruan (RPL & TKJ)</option>
                <option value="MIPA">MIPA (Matematika & Sains)</option>
                <option value="Seni">Seni & Desain (DKV)</option>
                <option value="Umum">Umum (Bahasa & Wajib)</option>
              </select>
            </div>

            <div>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full rounded-md border border-slate-300 py-2 px-3 text-xs text-slate-800 focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
              >
                <option value="">Semua Tingkat Kelas</option>
                <option value="10">Kelas 10 (Fase E)</option>
                <option value="11">Kelas 11 (Fase F)</option>
                <option value="12">Kelas 12 (Fase F)</option>
                <option value="Semua">Semua Tingkat</option>
              </select>
            </div>
          </form>
        </div>

        {/* Books Cards Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full py-16 text-center text-xs text-slate-500">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600 mx-auto mb-2" />
              <span>Memuat koleksi buku pelajaran...</span>
            </div>
          ) : books.length === 0 ? (
            <div className="col-span-full rounded-lg border border-slate-200 bg-white p-12 text-center text-xs text-slate-500">
              <BookOpen className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">Tidak ada buku yang sesuai dengan pencarian Anda.</p>
              <p className="text-[11px] text-slate-400 mt-1">Coba gunakan kata kunci lain atau bersihkan filter.</p>
            </div>
          ) : (
            books.map((book) => (
              <div
                key={book.id}
                className="rounded-lg border border-slate-200 bg-white p-4 flex flex-col justify-between hover:border-slate-300 transition-colors shadow-2xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="rounded-xs bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 border border-slate-200">
                      {book.category} • Kelas {book.gradeLevel}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200">
                      Tersedia {book.available}/{book.stock}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {book.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2">
                    Penulis: <span className="font-medium text-slate-800">{book.author}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Penerbit: {book.publisher}
                  </p>
                  {book.isbn && (
                    <p className="text-[10px] font-mono text-slate-400 mt-1">
                      ISBN: {book.isbn}
                    </p>
                  )}
                </div>

                <div className="mt-5 border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500">
                    Rak Perpustakaan: Lantai 2
                  </span>

                  <button
                    onClick={() => alert(`Buku "${book.title}" dapat dipinjam langsung di Perpustakaan Sekolah dengan menunjukkan kartu pelajar/akun SIMAS Anda.`)}
                    className="flex items-center gap-1 rounded-md border border-indigo-200 bg-indigo-50/60 px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors"
                  >
                    <BookmarkCheck className="h-3.5 w-3.5" />
                    <span>Pinjam Buku</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Tambah Buku */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Tambah Koleksi Buku Pelajaran Baru
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-md p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBook} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Judul Buku / Modul
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Pemrograman Basis Data Lanjut"
                  className="w-full rounded-md border border-slate-300 py-1.5 px-3 text-xs text-slate-900 focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Penulis
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Nama pengarang"
                    className="w-full rounded-md border border-slate-300 py-1.5 px-3 text-xs text-slate-900 focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Penerbit
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.publisher}
                    onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                    placeholder="Erlangga / Kemendikbud"
                    className="w-full rounded-md border border-slate-300 py-1.5 px-3 text-xs text-slate-900 focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori Bidang
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-md border border-slate-300 py-1.5 px-3 text-xs text-slate-900 focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
                  >
                    <option value="Kejuruan">Kejuruan (Teknologi)</option>
                    <option value="MIPA">MIPA & Sains</option>
                    <option value="Seni">Seni & Desain</option>
                    <option value="Umum">Umum / Bahasa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tingkat Kelas
                  </label>
                  <select
                    value={formData.gradeLevel}
                    onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                    className="w-full rounded-md border border-slate-300 py-1.5 px-3 text-xs text-slate-900 focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
                  >
                    <option value="10">Kelas 10</option>
                    <option value="11">Kelas 11</option>
                    <option value="12">Kelas 12</option>
                    <option value="Semua">Semua Tingkat</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ISBN
                  </label>
                  <input
                    type="text"
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    placeholder="978-xxx-xxx"
                    className="w-full rounded-md border border-slate-300 py-1.5 px-3 text-xs text-slate-900 focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jumlah Eksemplar Stok
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full rounded-md border border-slate-300 py-1.5 px-3 text-xs text-slate-900 focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-md bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : "Simpan Buku"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
