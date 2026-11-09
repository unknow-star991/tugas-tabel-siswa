import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const classRoomId = searchParams.get("classRoomId") || "";
    const dayName = searchParams.get("dayName") || "";

    const where: Record<string, unknown> = {};

    if (classRoomId) {
      where.classRoomId = classRoomId;
    }

    if (dayName) {
      where.dayName = dayName;
    }

    const schedules = await db.schedule.findMany({
      where,
      include: {
        classRoom: {
          select: { id: true, name: true, gradeLevel: true },
        },
      },
      orderBy: [{ dayName: "asc" }, { period: "asc" }],
    });

    return NextResponse.json({ data: schedules });
  } catch (err: unknown) {
    console.error("GET /api/schedules error:", err);
    return NextResponse.json({ error: "Gagal mengambil jadwal pelajaran." }, { status: 500 });
  }
}
