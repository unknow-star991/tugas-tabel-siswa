import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const departments = await db.department.findMany({
      include: {
        classes: {
          select: { id: true, name: true, gradeLevel: true },
        },
        _count: {
          select: { students: true, classes: true },
        },
      },
      orderBy: { code: "asc" },
    });

    return NextResponse.json({ data: departments });
  } catch (err: unknown) {
    console.error("GET /api/departments error:", err);
    return NextResponse.json({ error: "Gagal mengambil data jurusan." }, { status: 500 });
  }
}
