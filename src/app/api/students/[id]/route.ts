import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const student = await db.student.findUnique({
      where: { id },
      include: {
        department: true,
        classRoom: true,
        attendances: {
          orderBy: { date: "desc" },
          take: 20,
        },
        grades: {
          orderBy: { subjectName: "asc" },
        },
        achievements: {
          orderBy: { dateAchieved: "desc" },
        },
        disciplineRecords: {
          orderBy: { date: "desc" },
        },
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Data siswa tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: student });
  } catch (err: unknown) {
    console.error("GET /api/students/[id] error:", err);
    return NextResponse.json(
      { error: "Gagal mengambil rincian data siswa." },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Akses ditolak. Hanya Administrator yang dapat memperbarui data siswa." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await req.json();

    const existingStudent = await db.student.findUnique({
      where: { id },
    });

    if (!existingStudent) {
      return NextResponse.json(
        { error: "Data siswa tidak ditemukan." },
        { status: 404 }
      );
    }

    // Jika NISN diubah, pastikan tidak duplikat dengan siswa lain
    if (body.nisn && body.nisn !== existingStudent.nisn) {
      const duplicateNisn = await db.student.findUnique({
        where: { nisn: body.nisn.trim() },
      });
      if (duplicateNisn) {
        return NextResponse.json(
          { error: `NISN ${body.nisn} telah digunakan oleh siswa lain.` },
          { status: 400 }
        );
      }
    }

    const updatedStudent = await db.student.update({
      where: { id },
      data: {
        nisn: body.nisn ? body.nisn.trim() : existingStudent.nisn,
        nis: body.nis !== undefined ? (body.nis?.trim() || null) : existingStudent.nis,
        fullName: body.fullName ? body.fullName.trim() : existingStudent.fullName,
        gender: body.gender || existingStudent.gender,
        birthDate: body.birthDate !== undefined ? body.birthDate : existingStudent.birthDate,
        birthPlace: body.birthPlace !== undefined ? body.birthPlace : existingStudent.birthPlace,
        departmentId: body.departmentId || existingStudent.departmentId,
        classRoomId: body.classRoomId || existingStudent.classRoomId,
        status: body.status || existingStudent.status,
        parentName: body.parentName !== undefined ? body.parentName : existingStudent.parentName,
        parentPhone: body.parentPhone !== undefined ? body.parentPhone : existingStudent.parentPhone,
        address: body.address !== undefined ? body.address : existingStudent.address,
        photoUrl: body.photoUrl !== undefined ? body.photoUrl : existingStudent.photoUrl,
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
        action: "UPDATE_STUDENT",
        details: `Admin ${user.fullName} memperbarui profil siswa ${updatedStudent.fullName} (NISN: ${updatedStudent.nisn}).`,
        ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Data siswa berhasil diperbarui.",
      data: updatedStudent,
    });
  } catch (err: unknown) {
    console.error("PUT /api/students/[id] error:", err);
    return NextResponse.json(
      { error: "Gagal memperbarui data siswa." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Akses ditolak. Hanya Administrator yang dapat menghapus data siswa." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const student = await db.student.findUnique({
      where: { id },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Data siswa tidak ditemukan." },
        { status: 404 }
      );
    }

    // Hapus data siswa
    await db.student.delete({
      where: { id },
    });

    // Audit log
    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "DELETE_STUDENT",
        details: `Admin ${user.fullName} menghapus permanen siswa: ${student.fullName} (NISN: ${student.nisn}).`,
        ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
      },
    });

    return NextResponse.json({
      success: true,
      message: `Data siswa ${student.fullName} berhasil dihapus.`,
    });
  } catch (err: unknown) {
    console.error("DELETE /api/students/[id] error:", err);
    return NextResponse.json(
      { error: "Gagal menghapus data siswa." },
      { status: 500 }
    );
  }
}
