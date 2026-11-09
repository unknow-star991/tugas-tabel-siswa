import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, comparePassword, hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Sesi telah berakhir. Silakan login kembali." }, { status: 401 });
    }

    const body = await req.json();
    const { oldPassword, newPassword } = body;

    if (!oldPassword || !newPassword) {
      return NextResponse.json({ error: "Password lama dan password baru wajib diisi." }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Password baru minimal 6 karakter." }, { status: 400 });
    }

    const dbUser = await db.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "Pengguna tidak ditemukan." }, { status: 404 });
    }

    const isValid = await comparePassword(oldPassword, dbUser.password);
    if (!isValid) {
      return NextResponse.json({ error: "Password lama tidak sesuai." }, { status: 400 });
    }

    const newHashed = await hashPassword(newPassword);
    await db.user.update({
      where: { id: user.id },
      data: { password: newHashed },
    });

    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "CHANGE_PASSWORD",
        details: `Pengguna ${user.fullName} (${user.role}) berhasil memperbarui kata sandi akun.`,
      },
    });

    return NextResponse.json({ success: true, message: "Kata sandi berhasil diperbarui!" });
  } catch (err: unknown) {
    console.error("Change password error:", err);
    return NextResponse.json({ error: "Gagal mengganti kata sandi." }, { status: 500 });
  }
}
