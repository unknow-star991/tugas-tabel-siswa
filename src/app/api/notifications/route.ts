import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ data: [] });
    }

    const notifications = await db.notification.findMany({
      where: {
        OR: [{ userId: user.id }, { userId: null }],
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ data: notifications });
  } catch (err: unknown) {
    console.error("GET /api/notifications error:", err);
    return NextResponse.json({ error: "Gagal mengambil notifikasi." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, markAll } = body;

    if (markAll) {
      const user = await getCurrentUser();
      if (user) {
        await db.notification.updateMany({
          where: { OR: [{ userId: user.id }, { userId: null }] },
          data: { isRead: true },
        });
      }
      return NextResponse.json({ success: true });
    }

    if (id) {
      await db.notification.update({
        where: { id },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Parameter tidak lengkap." }, { status: 400 });
  } catch (err: unknown) {
    console.error("PATCH /api/notifications error:", err);
    return NextResponse.json({ error: "Gagal memperbarui notifikasi." }, { status: 500 });
  }
}
