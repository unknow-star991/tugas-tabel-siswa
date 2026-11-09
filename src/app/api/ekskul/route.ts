import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const ekskuls = await db.extracurricular.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ data: ekskuls });
  } catch (err: unknown) {
    console.error("GET /api/ekskul error:", err);
    return NextResponse.json({ error: "Gagal mengambil data ekskul." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });
    }

    const body = await req.json();
    const { action, ekskulId } = body;

    // Action: join ekskul
    if (action === "JOIN") {
      const ekskul = await db.extracurricular.update({
        where: { id: ekskulId },
        data: { memberCount: { increment: 1 } },
      });

      // Tambahkan notifikasi personal
      await db.notification.create({
        data: {
          userId: user.id,
          title: "🎉 Pendaftaran Ekskul Berhasil",
          message: `Selamat, Anda telah terdaftar sebagai anggota baru di "${ekskul.name}". Sampai jumpa di sesi latihan ${ekskul.scheduleDay}!`,
          category: "ACADEMIC",
        },
      });

      return NextResponse.json({ success: true, message: `Berhasil bergabung dengan ${ekskul.name}!` });
    }

    return NextResponse.json({ error: "Aksi tidak dikenali." }, { status: 400 });
  } catch (err: unknown) {
    console.error("POST /api/ekskul error:", err);
    return NextResponse.json({ error: "Gagal memproses pendaftaran ekskul." }, { status: 500 });
  }
}
