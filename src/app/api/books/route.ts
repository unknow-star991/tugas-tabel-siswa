import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";
    const category = searchParams.get("category") || "";
    const gradeLevel = searchParams.get("gradeLevel") || "";

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { author: { contains: search } },
        { publisher: { contains: search } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (gradeLevel) {
      where.gradeLevel = gradeLevel;
    }

    const books = await db.book.findMany({
      where,
      include: {
        department: {
          select: { id: true, code: true, name: true },
        },
      },
      orderBy: { title: "asc" },
    });

    return NextResponse.json({ data: books });
  } catch (err: unknown) {
    console.error("GET /api/books error:", err);
    return NextResponse.json({ error: "Gagal mengambil data buku." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Akses ditolak. Hanya Administrator yang dapat menambah koleksi buku." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, author, publisher, category, gradeLevel = "10", departmentId, isbn, stock = 30 } = body;

    if (!title || !author || !publisher || !category) {
      return NextResponse.json(
        { error: "Field judul, pengarang, penerbit, dan kategori wajib diisi." },
        { status: 400 }
      );
    }

    const book = await db.book.create({
      data: {
        title: title.trim(),
        author: author.trim(),
        publisher: publisher.trim(),
        category,
        gradeLevel,
        departmentId: departmentId || null,
        isbn: isbn?.trim() || null,
        stock: Number(stock),
        available: Number(stock),
        coverUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300&auto=format&fit=crop&q=80",
      },
    });

    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "CREATE_BOOK",
        details: `Admin ${user.fullName} menambahkan buku pelajaran baru: "${book.title}".`,
      },
    });

    return NextResponse.json({ success: true, data: book });
  } catch (err: unknown) {
    console.error("POST /api/books error:", err);
    return NextResponse.json({ error: "Gagal menyimpan data buku." }, { status: 500 });
  }
}
