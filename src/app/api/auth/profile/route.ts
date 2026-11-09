import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await db.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
        avatar: true,
        createdAt: true,
      },
    });

    // Hitung statistik personal
    const student = await db.student.findFirst({
      where: { fullName: dbUser?.fullName },
      include: {
        classRoom: true,
        department: true,
        _count: {
          select: { attendances: true, achievements: true, grades: true },
        },
      },
    });

    return NextResponse.json({
      data: {
        user: dbUser,
        studentRecord: student,
      },
    });
  } catch (err: unknown) {
    console.error("GET profile error:", err);
    return NextResponse.json({ error: "Gagal mengambil profil." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { fullName, email } = body;

    if (!fullName || !email) {
      return NextResponse.json({ error: "Nama lengkap dan email wajib diisi." }, { status: 400 });
    }

    const updated = await db.user.update({
      where: { id: user.id },
      data: {
        fullName: fullName.trim(),
        email: email.trim(),
      },
    });

    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "UPDATE_PROFILE",
        details: `Pengguna ${updated.fullName} memperbarui informasi biodata profil.`,
      },
    });

    return NextResponse.json({ success: true, message: "Profil berhasil diperbarui!", user: updated });
  } catch (err: unknown) {
    console.error("PUT profile error:", err);
    return NextResponse.json({ error: "Gagal memperbarui profil." }, { status: 500 });
  }
}
