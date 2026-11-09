"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ShieldAlert, Clock, User, Info, AlertTriangle } from "lucide-react";
import { AuditLogItem, SessionUser } from "@/types";
import { formatDateTime } from "@/lib/utils";

export default function AuditLogsPage() {
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    async function loadLogs() {
      try {
        const meRes = await fetch("/api/auth/me");
        if (meRes.ok) {
          const d = await meRes.json();
          setCurrentUser(d.user);
          if (d.user?.role !== "ADMIN") {
            setAccessDenied(true);
            setLoading(false);
            return;
          }
        }

        const res = await fetch("/api/audit-logs");
        if (res.ok) {
          const json = await res.json();
          setLogs(json.data);
        } else if (res.status === 403) {
          setAccessDenied(true);
        }
      } catch (e) {
        console.error("Failed to load audit logs", e);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  if (accessDenied) {
    return (
      <DashboardShell title="Akses Terbatas">
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-8 text-center max-w-lg mx-auto my-12">
          <AlertTriangle className="h-10 w-10 text-rose-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-rose-900">
            Akses Ditolak (403 Forbidden)
          </h3>
          <p className="text-xs text-rose-700 mt-2 leading-relaxed">
            Halaman log audit keamanan dan riwayat manipulasi data hanya dapat diakses oleh akun dengan peran <strong>Administrator</strong>.
          </p>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Log Audit & Riwayat Keamanan">
      <div className="space-y-5">
        <div className="border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Audit Trail & Aktivitas Sistem
            </h2>
            <span className="rounded-sm bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-700 border border-indigo-200">
              Admin Exclusive
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Rekam jejak forensik seluruh operasi penambahan, modifikasi, penghapusan data siswa, dan riwayat login.
          </p>
        </div>

        {/* Logs Table */}
        <div className="rounded-lg border border-slate-200 bg-white overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-44">Waktu Kejadian</th>
                  <th className="py-3 px-4 w-36">Pengguna</th>
                  <th className="py-3 px-4 w-36">Tindakan</th>
                  <th className="py-3 px-4">Deskripsi Aktivitas</th>
                  <th className="py-3 px-4 w-28 text-right">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500">
                      Memuat rekam jejak audit...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500">
                      Belum ada catatan aktivitas di log audit.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => {
                    const isDelete = log.action.includes("DELETE");
                    const isCreate = log.action.includes("CREATE");
                    const isLogin = log.action.includes("LOGIN");

                    return (
                      <tr key={log.id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                          {formatDateTime(log.createdAt)}
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-slate-900">
                            {log.user?.fullName || "Sistem"}
                          </p>
                          <span className="text-[10px] text-slate-400">
                            {log.user?.role || "SYSTEM"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-xs font-mono font-bold text-[10px] border ${
                              isDelete
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : isCreate
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : isLogin
                                ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                : "bg-slate-100 text-slate-700 border-slate-200"
                            }`}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-700 font-medium">
                          {log.details}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-slate-400 text-[11px]">
                          {log.ipAddress || "127.0.0.1"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
