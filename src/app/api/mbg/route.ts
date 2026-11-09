import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const menus = await db.mbgMenu.findMany({
      orderBy: { date: "asc" },
    });

    return NextResponse.json({ data: menus });
  } catch (err: unknown) {
    console.error("GET /api/mbg error:", err);
    return NextResponse.json({ error: "Gagal mengambil menu MBG." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Akses ditolak. Hanya Administrator yang dapat memperbarui status MBG." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "ID dan status wajib disertakan." }, { status: 400 });
    }

    const updated = await db.mbgMenu.update({
      where: { id },
      data: { status },
    });

    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "UPDATE_MBG_STATUS",
        details: `Admin ${user.fullName} mengubah status menu MBG hari ${updated.dayName} (${updated.date}) menjadi ${status}.`,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: unknown) {
    console.error("PATCH /api/mbg error:", err);
    return NextResponse.json({ error: "Gagal memperbarui menu MBG." }, { status: 500 });
  }
}
