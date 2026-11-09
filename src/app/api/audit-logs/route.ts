import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Akses ditolak. Log audit hanya dapat diakses oleh Administrator." },
        { status: 403 }
      );
    }

    const logs = await db.auditLog.findMany({
      include: {
        user: {
          select: { fullName: true, role: true, username: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ data: logs });
  } catch (err: unknown) {
    console.error("GET /api/audit-logs error:", err);
    return NextResponse.json({ error: "Gagal mengambil audit logs." }, { status: 500 });
  }
}
