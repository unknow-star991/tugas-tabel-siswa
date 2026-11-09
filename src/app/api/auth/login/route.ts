import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { comparePassword, signToken, getSessionCookieOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Username/Email dan password wajib diisi." },
        { status: 400 }
      );
    }

    // Cari berdasarkan username atau email
    const user = await db.user.findFirst({
      where: {
        OR: [{ username: identifier.trim() }, { email: identifier.trim() }],
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Kredensial tidak valid. Periksa username dan password Anda." },
        { status: 401 }
      );
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Kredensial tidak valid. Periksa username dan password Anda." },
        { status: 401 }
      );
    }

    const sessionPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role as "ADMIN" | "USER",
      avatar: user.avatar,
    };

    const token = signToken(sessionPayload);
    const cookieStore = await cookies();
    const cookieOptions = getSessionCookieOptions();

    cookieStore.set(cookieOptions.name, token, cookieOptions);

    // Catat log login
    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "USER_LOGIN",
        details: `Pengguna ${user.fullName} (${user.role}) berhasil masuk ke sistem.`,
        ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
      },
    });

    return NextResponse.json({
      success: true,
      user: sessionPayload,
      message: `Selamat datang kembali, ${user.fullName}!`,
    });
  } catch (err: unknown) {
    console.error("Login API Error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
