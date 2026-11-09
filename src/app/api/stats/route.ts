import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const totalStudents = await db.student.count();
    const activeStudents = await db.student.count({ where: { status: "ACTIVE" } });
    const leaveStudents = await db.student.count({ where: { status: "LEAVE" } });
    const transferredStudents = await db.student.count({ where: { status: "TRANSFERRED" } });
    const graduatedStudents = await db.student.count({ where: { status: "GRADUATED" } });

    const maleCount = await db.student.count({ where: { gender: "L" } });
    const femaleCount = await db.student.count({ where: { gender: "P" } });

    const departments = await db.department.findMany({
      include: {
        _count: {
          select: { students: true, classes: true },
        },
      },
    });

    const todayDate = "2026-11-09";
    const attendancesToday = await db.attendance.groupBy({
      by: ["status"],
      where: { date: todayDate },
      _count: {
        status: true,
      },
    });

    const attendanceStats = {
      present: 0,
      sick: 0,
      permit: 0,
      absent: 0,
      totalRecorded: 0,
    };

    for (const item of attendancesToday) {
      if (item.status === "PRESENT") attendanceStats.present = item._count.status;
      if (item.status === "SICK") attendanceStats.sick = item._count.status;
      if (item.status === "PERMIT") attendanceStats.permit = item._count.status;
      if (item.status === "ABSENT") attendanceStats.absent = item._count.status;
      attendanceStats.totalRecorded += item._count.status;
    }

    const totalAchievements = await db.achievement.count();
    const totalAnnouncements = await db.announcement.count();

    return NextResponse.json({
      data: {
        students: {
          total: totalStudents,
          active: activeStudents,
          leave: leaveStudents,
          transferred: transferredStudents,
          graduated: graduatedStudents,
          male: maleCount,
          female: femaleCount,
        },
        departments: departments.map((d) => ({
          id: d.id,
          code: d.code,
          name: d.name,
          studentCount: d._count.students,
          classCount: d._count.classes,
        })),
        attendanceToday: attendanceStats,
        totalAchievements,
        totalAnnouncements,
      },
    });
  } catch (err: unknown) {
    console.error("GET /api/stats error:", err);
    return NextResponse.json({ error: "Gagal mengambil data statistik." }, { status: 500 });
  }
}
