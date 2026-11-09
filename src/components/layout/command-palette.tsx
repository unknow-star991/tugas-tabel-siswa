"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, User, BookOpen, UtensilsCrossed, Sparkles, Megaphone, LayoutDashboard } from "lucide-react";

interface SearchResult {
  type: string;
  title: string;
  subtitle: string;
  href: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Default Quick Navigation Pages
  const quickLinks: SearchResult[] = [
    { type: "Navigasi", title: "Dashboard Eksekutif", subtitle: "Ringkasan statistik sekolah", href: "/dashboard" },
    { type: "Navigasi", title: "Data Siswa Master", subtitle: "Direktori siswa & rombel", href: "/siswa" },
    { type: "Navigasi", title: "Jadwal Pelajaran", subtitle: "Jadwal harian & lab", href: "/jadwal" },
    { type: "Navigasi", title: "Menu MBG (Makan Sehat)", subtitle: "Program gizi mingguan", href: "/mbg" },
    { type: "Navigasi", title: "Katalog Buku Pelajaran", subtitle: "E-Library kurikulum merdeka", href: "/buku" },
    { type: "Navigasi", title: "Layanan Surat Keterangan", subtitle: "Cetak surat aktif siswa", href: "/surat" },
    { type: "Navigasi", title: "Layanan Konseling BK", subtitle: "Konsultasi bimbingan siswa & karir", href: "/konseling" },
    { type: "Navigasi", title: "Ekstrakurikuler", subtitle: "Klub bakat & minat siswa", href: "/ekskul" },
    { type: "Navigasi", title: "Prestasi Siswa", subtitle: "Hall of fame & kejuaraan", href: "/prestasi" },
    { type: "Navigasi", title: "Pengaturan Akun & Profil", subtitle: "Ganti password & profil", href: "/pengaturan" },
  ];

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const d = await res.json();
          setResults(d.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (href: string) => {
    onClose();
    router.push(href);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "Siswa": return <User className="h-4 w-4 text-indigo-500" />;
      case "Buku Pelajaran": return <BookOpen className="h-4 w-4 text-emerald-500" />;
      case "Menu MBG": return <UtensilsCrossed className="h-4 w-4 text-amber-500" />;
      case "Ekstrakurikuler": return <Sparkles className="h-4 w-4 text-pink-500" />;
      case "Pengumuman": return <Megaphone className="h-4 w-4 text-sky-500" />;
      default: return <LayoutDashboard className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-xl rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden transition-all">
        {/* Search Bar Input */}
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 px-4 py-3.5">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari siswa, buku, jadwal, menu MBG, atau menu... (Ketik minimal 2 huruf)"
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden"
          />
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {loading && (
            <div className="py-8 text-center text-xs text-slate-400">
              Mencari di seluruh database...
            </div>
          )}

          {!loading && query.length >= 2 && results.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-400">
              Tidak ada hasil pencarian untuk "{query}".
            </div>
          )}

          {/* Jika belum ada input pencarian, tampilkan shortcut navigasi cepat */}
          {!loading && query.length < 2 && (
            <div>
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Pintasan Cepat Portal
              </div>
              {quickLinks.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleSelect(item.href)}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg text-left hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    {getIcon(item.type)}
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                </button>
              ))}
            </div>
          )}

          {/* Hasil Pencarian Aktif */}
          {!loading && results.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Hasil Ditemukan ({results.length})
              </div>
              {results.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(item.href)}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg text-left hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    {getIcon(item.type)}
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-xs border border-indigo-200 dark:border-indigo-800">
                    {item.type}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer Shortcut Guide */}
        <div className="border-t border-slate-100 dark:border-slate-800 px-4 py-2 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between text-[11px] text-slate-400">
          <span>Navigasi instan dengan keyboard</span>
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 rounded-xs bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-mono text-[10px]">ESC</kbd>
            <span>untuk tutup</span>
          </div>
        </div>
      </div>
    </div>
  );
}
