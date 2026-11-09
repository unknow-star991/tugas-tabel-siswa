import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const where: Record<string, unknown> = {};
    if (user.role !== "ADMIN") {
      where.studentName = user.fullName;
    }

    const requests = await db.counselingRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: requests });
  } catch (err: unknown) {
    console.error("GET counseling error:", err);
    return NextResponse.json({ error: "Gagal memuat konsultasi BK." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });
    }

    const body = await req.json();
    const { category, notes, classRoom } = body;

    if (!category || !notes) {
      return NextResponse.json({ error: "Kategori dan catatan konsultasi wajib diisi." }, { status: 400 });
    }

    const item = await db.counselingRequest.create({
      data: {
        studentName: user.fullName,
        classRoom: classRoom || "Kelas 10",
        category,
        notes: notes.trim(),
        status: "PENDING",
      },
    });

    // Tambahkan notifikasi
    await db.notification.create({
      data: {
        userId: user.id,
        title: "🔒 Permohonan Konseling Diterima",
        message: `Konsultasi kategori "${category}" telah diterima oleh Guru BK. Anda akan segera dihubungi untuk jadwal temu.`,
        category: "ACADEMIC",
      },
    });

    return NextResponse.json({ success: true, message: "Permohonan konseling berhasil dikirim!", data: item });
  } catch (err: unknown) {
    console.error("POST counseling error:", err);
    return NextResponse.json({ error: "Gagal mengirim permohonan." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Hanya Admin / Guru BK yang berhak mengubah status." }, { status: 403 });
    }

    const body = await req.json();
    const { id, status, scheduledDate } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "ID dan status wajib disertakan." }, { status: 400 });
    }

    const updated = await db.counselingRequest.update({
      where: { id },
      data: {
        status,
        ...(scheduledDate !== undefined ? { scheduledDate } : {}),
      },
    });

    return NextResponse.json({ success: true, message: "Status konsultasi berhasil diperbarui.", data: updated });
  } catch (err: unknown) {
    console.error("PATCH counseling error:", err);
    return NextResponse.json({ error: "Gagal memperbarui status konsultasi." }, { status: 500 });
  }
}
