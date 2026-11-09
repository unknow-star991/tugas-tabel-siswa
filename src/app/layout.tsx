import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SIMAS - Sistem Informasi Manajemen Siswa & Akademik",
  description: "Aplikasi manajemen data siswa, akademik, presensi, dan prestasi terpadu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
