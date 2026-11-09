import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    const where: Record<string, unknown> = {};

    // Jika user biasa, tampilkan targetRole ALL atau USER
    if (!user || user.role !== "ADMIN") {
      where.targetRole = { in: ["ALL", "USER"] };
    }

    const announcements = await db.announcement.findMany({
      where,
      include: {
        author: {
          select: { fullName: true, role: true },
        },
      },
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ data: announcements });
  } catch (err: unknown) {
    console.error("GET /api/announcements error:", err);
    return NextResponse.json({ error: "Gagal mengambil pengumuman." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Hanya Administrator yang dapat mempublikasikan pengumuman." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, content, targetRole = "ALL", isPinned = false } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Judul dan isi pengumuman wajib diisi." }, { status: 400 });
    }

    const item = await db.announcement.create({
      data: {
        authorId: user.id,
        title: title.trim(),
        content: content.trim(),
        targetRole,
        isPinned: Boolean(isPinned),
      },
    });

    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "CREATE_ANNOUNCEMENT",
        details: `Admin ${user.fullName} menerbitkan pengumuman baru: "${item.title}".`,
      },
    });

    return NextResponse.json({ success: true, data: item });
  } catch (err: unknown) {
    console.error("POST /api/announcements error:", err);
    return NextResponse.json({ error: "Gagal membuat pengumuman." }, { status: 500 });
  }
}
