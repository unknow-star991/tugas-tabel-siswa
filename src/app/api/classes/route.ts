import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const classes = await db.classRoom.findMany({
      include: {
        department: {
          select: { id: true, code: true, name: true },
        },
        _count: {
          select: { students: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ data: classes });
  } catch (err: unknown) {
    console.error("GET /api/classes error:", err);
    return NextResponse.json({ error: "Gagal mengambil data kelas." }, { status: 500 });
  }
}
