import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date") || "2026-11-09";
    const classRoomId = searchParams.get("classRoomId") || "";

    const where: Record<string, unknown> = { date };
    if (classRoomId) {
      where.student = { classRoomId };
    }

    const attendances = await db.attendance.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
            nisn: true,
            classRoom: {
              select: { name: true },
            },
            department: {
              select: { code: true },
            },
          },
        },
      },
      orderBy: { student: { fullName: "asc" } },
    });

    return NextResponse.json({ data: attendances });
  } catch (err: unknown) {
    console.error("GET /api/attendances error:", err);
    return NextResponse.json({ error: "Gagal mengambil data presensi." }, { status: 500 });
  }
}
