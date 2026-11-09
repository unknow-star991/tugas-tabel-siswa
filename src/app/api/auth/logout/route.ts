import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionCookieOptions } from "@/lib/auth";

export async function POST() {
  const cookieStore = await cookies();
  const options = getSessionCookieOptions();
  cookieStore.delete(options.name);

  return NextResponse.json({
    success: true,
    message: "Berhasil keluar dari akun.",
  });
}
