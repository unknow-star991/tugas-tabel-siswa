import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "10"));
    const search = searchParams.get("search")?.trim() || "";
    const departmentId = searchParams.get("departmentId") || "";
    const classRoomId = searchParams.get("classRoomId") || "";
    const gradeLevel = searchParams.get("gradeLevel") || "";
    const status = searchParams.get("status") || "";
    const gender = searchParams.get("gender") || "";

    // Build Prisma where conditions
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { nisn: { contains: search } },
        { nis: { contains: search } },
      ];
    }

    if (departmentId) {
      where.departmentId = departmentId;
    }

    if (classRoomId) {
      where.classRoomId = classRoomId;
    }

    if (status) {
      where.status = status;
    }

    if (gender) {
      where.gender = gender;
    }

    if (gradeLevel) {
      where.classRoom = {
        gradeLevel: gradeLevel,
      };
    }

    const total = await db.student.count({ where });

    const students = await db.student.findMany({
      where,
      include: {
        department: {
          select: { id: true, code: true, name: true },
        },
        classRoom: {
          select: { id: true, name: true, gradeLevel: true },
        },
        _count: {
          select: {
            attendances: true,
            grades: true,
            achievements: true,
            disciplineRecords: true,
          },
        },
      },
      orderBy: { fullName: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: students,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (err: unknown) {
    console.error("GET /api/students error:", err);
    return NextResponse.json(
      { error: "Gagal mengambil data siswa." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Akses ditolak. Hanya Administrator yang dapat menambah data siswa." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      nisn,
      nis,
      fullName,
      gender,
      birthDate,
      birthPlace,
      departmentId,
      classRoomId,
      status = "ACTIVE",
      parentName,
      parentPhone,
      address,
      photoUrl,
    } = body;

    if (!nisn || !fullName || !gender || !departmentId || !classRoomId) {
      return NextResponse.json(
        { error: "Field NISN, Nama Lengkap, Jenis Kelamin, Jurusan, dan Kelas wajib diisi." },
        { status: 400 }
      );
    }

    // Cek duplikasi NISN
    const existing = await db.student.findUnique({
      where: { nisn: nisn.trim() },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Siswa dengan NISN ${nisn} sudah terdaftar dalam sistem.` },
        { status: 400 }
      );
    }

    const newStudent = await db.student.create({
      data: {
        nisn: nisn.trim(),
        nis: nis?.trim() || null,
        fullName: fullName.trim(),
        gender: gender === "P" ? "P" : "L",
        birthDate: birthDate || null,
        birthPlace: birthPlace?.trim() || null,
        departmentId,
        classRoomId,
        status,
        parentName: parentName?.trim() || null,
        parentPhone: parentPhone?.trim() || null,
        address: address?.trim() || null,
        photoUrl: photoUrl || null,
      },
      include: {
        department: true,
        classRoom: true,
      },
    });

    // Audit log
    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "CREATE_STUDENT",
        details: `Admin ${user.fullName} menambahkan siswa baru: ${newStudent.fullName} (NISN: ${newStudent.nisn}) ke kelas ${newStudent.classRoom.name}.`,
        ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Data siswa berhasil ditambahkan.",
      data: newStudent,
    });
  } catch (err: unknown) {
    console.error("POST /api/students error:", err);
    return NextResponse.json(
      { error: "Gagal menyimpan data siswa." },
      { status: 500 }
    );
  }
}
