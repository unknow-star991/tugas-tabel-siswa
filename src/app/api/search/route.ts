import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() || "";

    if (!q || q.length < 2) {
      return NextResponse.json({ data: [] });
    }

    const [students, books, mbg, ekskuls, announcements] = await Promise.all([
      db.student.findMany({
        where: {
          OR: [{ fullName: { contains: q } }, { nisn: { contains: q } }],
        },
        take: 4,
        include: { classRoom: true },
      }),
      db.book.findMany({
        where: {
          OR: [{ title: { contains: q } }, { author: { contains: q } }],
        },
        take: 4,
      }),
      db.mbgMenu.findMany({
        where: {
          OR: [{ mainCourse: { contains: q } }, { dayName: { contains: q } }],
        },
        take: 3,
      }),
      db.extracurricular.findMany({
        where: {
          OR: [{ name: { contains: q } }, { category: { contains: q } }],
        },
        take: 3,
      }),
      db.announcement.findMany({
        where: { title: { contains: q } },
        take: 3,
      }),
    ]);

    const results = [
      ...students.map((s) => ({
        type: "Siswa",
        title: s.fullName,
        subtitle: `NISN: ${s.nisn} • ${s.classRoom?.name || "Siswa"}`,
        href: `/siswa`,
      })),
      ...books.map((b) => ({
        type: "Buku Pelajaran",
        title: b.title,
        subtitle: `${b.author} • ${b.category}`,
        href: `/buku`,
      })),
      ...mbg.map((m) => ({
        type: "Menu MBG",
        title: `Hari ${m.dayName}: ${m.mainCourse}`,
        subtitle: `${m.calories} kkal • ${m.fruit}`,
        href: `/mbg`,
      })),
      ...ekskuls.map((e) => ({
        type: "Ekstrakurikuler",
        title: e.name,
        subtitle: `${e.category} • Latihan hari ${e.scheduleDay}`,
        href: `/ekskul`,
      })),
      ...announcements.map((a) => ({
        type: "Pengumuman",
        title: a.title,
        subtitle: "Siaran Resmi Sekolah",
        href: `/pengumuman`,
      })),
    ];

    return NextResponse.json({ data: results });
  } catch (err: unknown) {
    console.error("Global search error:", err);
    return NextResponse.json({ error: "Gagal melakukan pencarian." }, { status: 500 });
  }
}
