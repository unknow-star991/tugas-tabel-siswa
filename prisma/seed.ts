import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Memulai seeding database SIMAS...");

  // Bersihkan data lama
  await prisma.notification.deleteMany();
  await prisma.extracurricular.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.mbgMenu.deleteMany();
  await prisma.book.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.disciplineRecord.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.grade.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.student.deleteMany();
  await prisma.classRoom.deleteMany();
  await prisma.department.deleteMany();
  await prisma.user.deleteMany();

  // 1. Seed Pengguna (Admin & User Biasa)
  const passwordHashAdmin = await bcrypt.hash("admin123", 10);
  const passwordHashUser = await bcrypt.hash("siswa123", 10);
  const passwordHashGuru = await bcrypt.hash("guru123", 10);

  const admin = await prisma.user.create({
    data: {
      username: "admin",
      email: "admin@sekolah.sch.id",
      password: passwordHashAdmin,
      fullName: "Bpk. H. Suryanto, M.Pd.",
      role: "ADMIN",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    },
  });

  const siswaUser = await prisma.user.create({
    data: {
      username: "siswa",
      email: "siswa@sekolah.sch.id",
      password: passwordHashUser,
      fullName: "Ahmad Pratama",
      role: "USER",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    },
  });

  const guruUser = await prisma.user.create({
    data: {
      username: "guru",
      email: "guru@sekolah.sch.id",
      password: passwordHashGuru,
      fullName: "Ibu Siti Rahmawati, S.Kom",
      role: "USER",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    },
  });

  console.log("✅ Users created (Admin, Siswa, Guru)");

  // 2. Seed Jurusan (Departments)
  const deptRPL = await prisma.department.create({
    data: {
      code: "RPL",
      name: "Rekayasa Perangkat Lunak",
      description: "Konsentrasi keahlian pengembangan aplikasi web, mobile, dan sistem komputasi modern.",
    },
  });

  const deptTKJ = await prisma.department.create({
    data: {
      code: "TKJ",
      name: "Teknik Komputer & Jaringan",
      description: "Konsentrasi infrastruktur jaringan, administrasi server cloud, dan keamanan siber.",
    },
  });

  const deptDKV = await prisma.department.create({
    data: {
      code: "DKV",
      name: "Desain Komunikasi Visual",
      description: "Konsentrasi ilustrasi digital, UI/UX design, animasi 2D/3D, dan branding multimedia.",
    },
  });

  const deptMIPA = await prisma.department.create({
    data: {
      code: "MIPA",
      name: "Matematika & Ilmu Pengetahuan Alam",
      description: "Program peminatan sains analitis, matematika terapan, fisika, kimia, dan biologi.",
    },
  });

  console.log("✅ Departments created");

  // 3. Seed Kelas (ClassRooms)
  const classXRpl1 = await prisma.classRoom.create({
    data: {
      gradeLevel: "10",
      name: "X RPL 1",
      departmentId: deptRPL.id,
      academicYear: "2026/2027",
    },
  });

  const classXRpl2 = await prisma.classRoom.create({
    data: {
      gradeLevel: "10",
      name: "X RPL 2",
      departmentId: deptRPL.id,
      academicYear: "2026/2027",
    },
  });

  const classXIRpl1 = await prisma.classRoom.create({
    data: {
      gradeLevel: "11",
      name: "XI RPL 1",
      departmentId: deptRPL.id,
      academicYear: "2026/2027",
    },
  });

  const classXTkj1 = await prisma.classRoom.create({
    data: {
      gradeLevel: "10",
      name: "X TKJ 1",
      departmentId: deptTKJ.id,
      academicYear: "2026/2027",
    },
  });

  const classXDkv1 = await prisma.classRoom.create({
    data: {
      gradeLevel: "10",
      name: "X DKV 1",
      departmentId: deptDKV.id,
      academicYear: "2026/2027",
    },
  });

  const classXMipa1 = await prisma.classRoom.create({
    data: {
      gradeLevel: "10",
      name: "X MIPA 1",
      departmentId: deptMIPA.id,
      academicYear: "2026/2027",
    },
  });

  console.log("✅ Classrooms created");

  // 4. Seed Siswa (Students)
  const studentsData = [
    {
      nisn: "0081234001",
      nis: "20261001",
      fullName: "Ahmad Pratama",
      gender: "L",
      birthDate: "2008-04-12",
      birthPlace: "Jakarta",
      departmentId: deptRPL.id,
      classRoomId: classXRpl1.id,
      status: "ACTIVE",
      parentName: "Bambang Pratama",
      parentPhone: "081234567801",
      address: "Jl. Merdeka No. 12, Jakarta Selatan",
      photoUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    },
    {
      nisn: "0081234002",
      nis: "20261002",
      fullName: "Beatrix Salma",
      gender: "P",
      birthDate: "2008-08-25",
      birthPlace: "Bandung",
      departmentId: deptRPL.id,
      classRoomId: classXRpl1.id,
      status: "ACTIVE",
      parentName: "Hendra Salma",
      parentPhone: "081234567802",
      address: "Jl. Cendrawasih No. 45, Jakarta Selatan",
      photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
    {
      nisn: "0081234003",
      nis: "20261003",
      fullName: "Cantika Putri Wulandari",
      gender: "P",
      birthDate: "2008-02-14",
      birthPlace: "Surabaya",
      departmentId: deptDKV.id,
      classRoomId: classXDkv1.id,
      status: "ACTIVE",
      parentName: "Agus Wulandari",
      parentPhone: "081234567803",
      address: "Komplek Pesona Indah Blok B-4, Jakarta Barat",
      photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
    },
    {
      nisn: "0081234004",
      nis: "20261004",
      fullName: "Dimas Arya Wijaya",
      gender: "L",
      birthDate: "2008-11-03",
      birthPlace: "Semarang",
      departmentId: deptTKJ.id,
      classRoomId: classXTkj1.id,
      status: "ACTIVE",
      parentName: "Wahyu Wijaya",
      parentPhone: "081234567804",
      address: "Jl. Kemang Timur No. 89, Jakarta Selatan",
      photoUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    },
    {
      nisn: "0081234005",
      nis: "20261005",
      fullName: "Eko Prasetyo Utomo",
      gender: "L",
      birthDate: "2008-06-19",
      birthPlace: "Yogyakarta",
      departmentId: deptRPL.id,
      classRoomId: classXRpl2.id,
      status: "LEAVE",
      parentName: "Joko Utomo",
      parentPhone: "081234567805",
      address: "Jl. Tebet Barat Raya No. 17, Jakarta Selatan",
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    {
      nisn: "0081234006",
      nis: "20261006",
      fullName: "Farhan Maulana",
      gender: "L",
      birthDate: "2008-09-30",
      birthPlace: "Medan",
      departmentId: deptMIPA.id,
      classRoomId: classXMipa1.id,
      status: "ACTIVE",
      parentName: "Zulkifli Maulana",
      parentPhone: "081234567806",
      address: "Jl. Fatmawati No. 30, Jakarta Selatan",
      photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    },
    {
      nisn: "0081234007",
      nis: "20261007",
      fullName: "Gita Permata Sari",
      gender: "P",
      birthDate: "2008-12-05",
      birthPlace: "Denpasar",
      departmentId: deptDKV.id,
      classRoomId: classXDkv1.id,
      status: "ACTIVE",
      parentName: "Wayan Sari",
      parentPhone: "081234567807",
      address: "Jl. Senopati No. 5, Jakarta Selatan",
      photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    },
    {
      nisn: "0081234008",
      nis: "20261008",
      fullName: "Hana Fauziah",
      gender: "P",
      birthDate: "2008-01-18",
      birthPlace: "Bogor",
      departmentId: deptRPL.id,
      classRoomId: classXRpl1.id,
      status: "ACTIVE",
      parentName: "Lukman Hakim",
      parentPhone: "081234567808",
      address: "Jl. Bintaro Utama Sektor 3, Tangerang Selatan",
      photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    },
    {
      nisn: "0071234009",
      nis: "20251009",
      fullName: "Ilham Ramadhan",
      gender: "L",
      birthDate: "2007-10-10",
      birthPlace: "Palembang",
      departmentId: deptRPL.id,
      classRoomId: classXIRpl1.id,
      status: "ACTIVE",
      parentName: "Dedi Ramadhan",
      parentPhone: "081234567809",
      address: "Jl. Margonda Raya No. 102, Depok",
      photoUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    },
    {
      nisn: "0071234010",
      nis: "20251010",
      fullName: "Jessica Olivia",
      gender: "P",
      birthDate: "2007-07-22",
      birthPlace: "Jakarta",
      departmentId: deptRPL.id,
      classRoomId: classXIRpl1.id,
      status: "ACTIVE",
      parentName: "Tony Olivia",
      parentPhone: "081234567810",
      address: "Jl. Boulevard Kelapa Gading Blok M-1, Jakarta Utara",
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    {
      nisn: "0081234011",
      nis: "20261011",
      fullName: "Kevin Sanjaya Putra",
      gender: "L",
      birthDate: "2008-05-15",
      birthPlace: "Banyuwangi",
      departmentId: deptTKJ.id,
      classRoomId: classXTkj1.id,
      status: "TRANSFERRED",
      parentName: "Sugianto",
      parentPhone: "081234567811",
      address: "Jl. Otista Raya No. 44, Jakarta Timur",
      photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    },
    {
      nisn: "0081234012",
      nis: "20261012",
      fullName: "Nadia Salsabila",
      gender: "P",
      birthDate: "2008-03-08",
      birthPlace: "Malang",
      departmentId: deptMIPA.id,
      classRoomId: classXMipa1.id,
      status: "ACTIVE",
      parentName: "Rahmat Salsabila",
      parentPhone: "081234567812",
      address: "Jl. Radio Dalam Raya No. 19, Jakarta Selatan",
      photoUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
    },
  ];

  const createdStudents = [];
  for (const s of studentsData) {
    const student = await prisma.student.create({ data: s });
    createdStudents.push(student);
  }

  console.log(`✅ ${createdStudents.length} Students seeded successfully`);

  // 5. Seed Presensi (Attendances)
  const today = "2026-11-09";
  const yesterday = "2026-11-08";

  for (const [index, student] of createdStudents.entries()) {
    // Tentukan pola status presensi yang realistis
    let statusToday = "PRESENT";
    let statusYesterday = "PRESENT";
    let remarks = null;

    if (index === 2) {
      statusToday = "SICK";
      remarks = "Surat dokter istirahat 2 hari terlampir";
    } else if (index === 4) {
      statusToday = "PERMIT";
      remarks = "Izin urusan keluarga ke luar kota";
    } else if (index === 10) {
      statusToday = "ABSENT";
      remarks = "Tanpa keterangan";
    }

    await prisma.attendance.create({
      data: {
        studentId: student.id,
        date: today,
        status: statusToday,
        remarks,
      },
    });

    await prisma.attendance.create({
      data: {
        studentId: student.id,
        date: yesterday,
        status: statusYesterday,
      },
    });
  }

  console.log("✅ Attendances seeded");

  // 6. Seed Nilai (Grades)
  const firstStudent = createdStudents[0];
  const secondStudent = createdStudents[1];

  const subjects = [
    { name: "Pemrograman Web & Perangkat Bergerak", score: 92, letter: "A" },
    { name: "Basis Data Relasional", score: 88, letter: "A" },
    { name: "Pemodelan Perangkat Lunak", score: 85, letter: "B" },
    { name: "Matematika Terapan", score: 90, letter: "A" },
    { name: "Bahasa Inggris Komunikasi Teknis", score: 86, letter: "B" },
  ];

  for (const sub of subjects) {
    await prisma.grade.create({
      data: {
        studentId: firstStudent.id,
        subjectName: sub.name,
        semester: "Ganjil",
        academicYear: "2026/2027",
        score: sub.score,
        gradeLetter: sub.letter,
      },
    });

    await prisma.grade.create({
      data: {
        studentId: secondStudent.id,
        subjectName: sub.name,
        semester: "Ganjil",
        academicYear: "2026/2027",
        score: sub.score - 4,
        gradeLetter: sub.score - 4 >= 85 ? "A" : "B",
      },
    });
  }

  console.log("✅ Grades seeded");

  // 7. Seed Prestasi (Achievements)
  await prisma.achievement.create({
    data: {
      studentId: firstStudent.id,
      title: "Medali Emas LKS Tingkat Provinsi",
      eventName: "Lomba Kompetensi Siswa (LKS) Bidang Web Technologies 2026",
      level: "Provinsi",
      rank: "Juara 1",
      dateAchieved: "2026-09-15",
    },
  });

  await prisma.achievement.create({
    data: {
      studentId: secondStudent.id,
      title: "Juara Harapan 1 Hackathon Pelajar Nasional",
      eventName: "National Highschool EdTech Hackathon 2026",
      level: "Nasional",
      rank: "Juara 4",
      dateAchieved: "2026-10-02",
    },
  });

  console.log("✅ Achievements seeded");

  // 8. Seed Catatan Kedisiplinan / BK
  await prisma.disciplineRecord.create({
    data: {
      studentId: firstStudent.id,
      type: "MERIT",
      points: 15,
      description: "Menjadi perwakilan teladan pembaca UUD 1945 pada Upacara Hari Sumpah Pemuda",
      date: "2026-10-28",
    },
  });

  await prisma.disciplineRecord.create({
    data: {
      studentId: createdStudents[3].id,
      type: "PENALTY",
      points: 5,
      description: "Terlambat hadir ke sekolah lebih dari 15 menit tanpa surat keterangan",
      date: "2026-11-04",
    },
  });

  console.log("✅ Discipline records seeded");

  // 9. Seed Pengumuman (Announcements)
  await prisma.announcement.create({
    data: {
      authorId: admin.id,
      title: "Pemberitahuan Asesmen Sumatif Akhir Semester Gasal TA 2026/2027",
      content:
        "Diberitahukan kepada seluruh siswa dan dewan guru, bahwa pelaksanaan asesmen sumatif gasal akan diselenggarakan mulai tanggal 1 Desember 2026 secara digital. Pastikan kelengkapan kartu ujian dan akun telah diverifikasi.",
      targetRole: "ALL",
      isPinned: true,
    },
  });

  await prisma.announcement.create({
    data: {
      authorId: admin.id,
      title: "Sosialisasi Program Praktik Kerja Lapangan (PKL) Industri Tingkat XI",
      content:
        "Pertemuan tatap muka bersama perwakilan mitra industri teknologi dan wali murid kelas XI akan diadakan pada Sabtu mendatang di Aula Utama.",
      targetRole: "USER",
      isPinned: false,
    },
  });

  // 10. Seed Buku Pelajaran & E-Library
  const booksData = [
    {
      title: "Pemrograman Web & Perangkat Bergerak (Kurikulum Merdeka)",
      author: "Budi Raharjo & Tim Pengembang",
      publisher: "Pusat Kurikulum dan Perbukuan Kemendikbudristek",
      category: "Kejuruan",
      gradeLevel: "10",
      departmentId: deptRPL.id,
      isbn: "978-623-194-001-2",
      stock: 40,
      available: 36,
      coverUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&auto=format&fit=crop&q=80",
    },
    {
      title: "Administrasi Infrastruktur Jaringan & Cloud Modern",
      author: "Iwan Sofana, S.T., M.T.",
      publisher: "Informatika Bandung",
      category: "Kejuruan",
      gradeLevel: "10",
      departmentId: deptTKJ.id,
      isbn: "978-602-6232-15-4",
      stock: 35,
      available: 30,
      coverUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=300&auto=format&fit=crop&q=80",
    },
    {
      title: "Desain Komunikasi Visual & Prinsip Tipografi Digital",
      author: "Dendi Pratama, M.Sn.",
      publisher: "Penerbit Erlangga",
      category: "Seni",
      gradeLevel: "10",
      departmentId: deptDKV.id,
      isbn: "978-602-298-887-1",
      stock: 30,
      available: 28,
      coverUrl: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=300&auto=format&fit=crop&q=80",
    },
    {
      title: "Matematika Tingkat Lanjut: Aljabar, Geometri & Vektor",
      author: "Drs. Sukino & Tim Asosiasi Guru",
      publisher: "Balai Pustaka",
      category: "MIPA",
      gradeLevel: "10",
      departmentId: deptMIPA.id,
      isbn: "978-979-018-992-0",
      stock: 45,
      available: 42,
      coverUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=300&auto=format&fit=crop&q=80",
    },
    {
      title: "Bahasa Indonesia untuk Komunikasi Ilmiah & Profesional",
      author: "Prof. Dr. Dendy Sugono",
      publisher: "Yudhistira Ghalia",
      category: "Umum",
      gradeLevel: "Semua",
      isbn: "978-979-670-341-8",
      stock: 50,
      available: 48,
      coverUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=300&auto=format&fit=crop&q=80",
    },
    {
      title: "Dasar-Dasar Rekayasa Perangkat Lunak: Algoritma & Basis Data",
      author: "Sandhika Galih, S.Kom., M.T.",
      publisher: "Elex Media Komputindo",
      category: "Kejuruan",
      gradeLevel: "11",
      departmentId: deptRPL.id,
      isbn: "978-623-002-120-9",
      stock: 38,
      available: 35,
      coverUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&auto=format&fit=crop&q=80",
    },
  ];

  for (const b of booksData) {
    await prisma.book.create({ data: b });
  }

  console.log("✅ Books seeded");

  // 11. Seed Menu MBG (Makan Bergizi Gratis)
  const mbgMenus = [
    {
      dayName: "Senin",
      date: "2026-11-09",
      mainCourse: "Nasi Putih Pulen + Ayam Panggang Saus Kecap Madu",
      sideDish: "Tahu Tempe Bacem Gurih",
      vegetable: "Sayur Sup Bening Brokoli & Wortel",
      fruit: "Pisang Cavendish Manis",
      drink: "Susu UHT Segar 125ml",
      calories: 650,
      protein: 28,
      carbs: 85,
      fat: 14,
      allergens: "Kedelai, Laktosa",
      distributionTime: "11:45 - 12:30 WIB",
      status: "DISTRIBUTED",
    },
    {
      dayName: "Selasa",
      date: "2026-11-10",
      mainCourse: "Nasi Kuning Gurih Rempah + Semur Daging Sapi",
      sideDish: "Perkedel Kentang Sayur",
      vegetable: "Tumis Buncis Jagung Manis Pipil",
      fruit: "Jeruk Manis Medan",
      drink: "Air Mineral Higienis / Susu Kedelai",
      calories: 680,
      protein: 30,
      carbs: 88,
      fat: 16,
      allergens: "Kedelai",
      distributionTime: "11:45 - 12:30 WIB",
      status: "SCHEDULED",
    },
    {
      dayName: "Rabu",
      date: "2026-11-11",
      mainCourse: "Nasi Merah Sehat + Ikan Nila Bakar Bumbu Kuning",
      sideDish: "Tahu Goreng Bumbu Lengkuas",
      vegetable: "Sayur Asem Segar Khas Jakarta",
      fruit: "Semangka Merah Tanpa Biji",
      drink: "Susu UHT Rendah Lemak",
      calories: 620,
      protein: 27,
      carbs: 80,
      fat: 12,
      allergens: "Ikan, Laktosa",
      distributionTime: "11:45 - 12:30 WIB",
      status: "SCHEDULED",
    },
    {
      dayName: "Kamis",
      date: "2026-11-12",
      mainCourse: "Nasi Putih Hangat + Rolade Ayam Saus Asam Manis",
      sideDish: "Kering Tempe Wijen Manis Gurih",
      vegetable: "Sayur Capcay Bakso Sayuran Organik",
      fruit: "Melon Madu Segar",
      drink: "Susu Cokelat UHT 125ml",
      calories: 660,
      protein: 29,
      carbs: 86,
      fat: 15,
      allergens: "Telur, Kedelai, Laktosa",
      distributionTime: "11:45 - 12:30 WIB",
      status: "SCHEDULED",
    },
    {
      dayName: "Jumat",
      date: "2026-11-13",
      mainCourse: "Nasi Liwet Harum + Telur Balado Daun Jeruk",
      sideDish: "Bakwan Sayur Jamur Tiram",
      vegetable: "Sayur Lodeh Labu Siam & Jagung",
      fruit: "Pepaya California Potong",
      drink: "Susu Segar Pasteurisasi",
      calories: 630,
      protein: 25,
      carbs: 82,
      fat: 14,
      allergens: "Telur, Laktosa",
      distributionTime: "11:30 - 12:00 WIB",
      status: "SCHEDULED",
    },
  ];

  for (const m of mbgMenus) {
    await prisma.mbgMenu.create({ data: m });
  }

  console.log("✅ MBG menus seeded");

  // 12. Seed Jadwal Pelajaran (Schedules)
  const schedulesData = [
    // SENIN
    {
      classRoomId: classXRpl1.id,
      dayName: "Senin",
      period: 1,
      startTime: "07:15",
      endTime: "08:45",
      subjectName: "Upacara Bendera & Pembinaan Karakter",
      teacherName: "Bpk. H. Suryanto, M.Pd.",
      roomName: "Lapangan Utama",
    },
    {
      classRoomId: classXRpl1.id,
      dayName: "Senin",
      period: 2,
      startTime: "08:45",
      endTime: "10:15",
      subjectName: "Pemrograman Web & Perangkat Bergerak",
      teacherName: "Ibu Siti Rahmawati, S.Kom",
      roomName: "Lab Komputer RPL 1",
    },
    {
      classRoomId: classXRpl1.id,
      dayName: "Senin",
      period: 3,
      startTime: "10:30",
      endTime: "12:00",
      subjectName: "Basis Data Relasional & SQL",
      teacherName: "Bpk. Ridwan Fauzi, M.T.",
      roomName: "Lab Komputer RPL 1",
    },
    {
      classRoomId: classXRpl1.id,
      dayName: "Senin",
      period: 4,
      startTime: "12:45",
      endTime: "14:15",
      subjectName: "Bahasa Inggris Komunikasi Teknis",
      teacherName: "Ibu Sarah Johnson, M.Pd.",
      roomName: "Ruang Teori X-RPL-1",
    },

    // SELASA
    {
      classRoomId: classXRpl1.id,
      dayName: "Selasa",
      period: 1,
      startTime: "07:15",
      endTime: "09:30",
      subjectName: "Algoritma Pemrograman & Struktur Data",
      teacherName: "Ibu Siti Rahmawati, S.Kom",
      roomName: "Lab Komputer RPL 1",
    },
    {
      classRoomId: classXRpl1.id,
      dayName: "Selasa",
      period: 2,
      startTime: "09:45",
      endTime: "11:45",
      subjectName: "Matematika Terapan & Logika Komputasi",
      teacherName: "Drs. Hendro Wibowo",
      roomName: "Ruang Teori X-RPL-1",
    },
    {
      classRoomId: classXRpl1.id,
      dayName: "Selasa",
      period: 3,
      startTime: "12:30",
      endTime: "14:30",
      subjectName: "Pendidikan Jasmani, Olahraga & Kesehatan",
      teacherName: "Bpk. Coach Danu",
      roomName: "Gelanggang Olahraga",
    },

    // RABU
    {
      classRoomId: classXRpl1.id,
      dayName: "Rabu",
      period: 1,
      startTime: "07:15",
      endTime: "09:30",
      subjectName: "Pemodelan Perangkat Lunak (UML & Agile)",
      teacherName: "Bpk. Ridwan Fauzi, M.T.",
      roomName: "Lab Komputer RPL 2",
    },
    {
      classRoomId: classXRpl1.id,
      dayName: "Rabu",
      period: 2,
      startTime: "09:45",
      endTime: "11:45",
      subjectName: "Bahasa Indonesia & Penulisan Ilmiah",
      teacherName: "Ibu Dewi Lestari, M.Pd.",
      roomName: "Ruang Teori X-RPL-1",
    },

    // KAMIS
    {
      classRoomId: classXRpl1.id,
      dayName: "Kamis",
      period: 1,
      startTime: "07:15",
      endTime: "09:30",
      subjectName: "Infrastruktur Jaringan & Server Dasar",
      teacherName: "Bpk. Iwan Sofana, S.T.",
      roomName: "Lab Jaringan TKJ",
    },
    {
      classRoomId: classXRpl1.id,
      dayName: "Kamis",
      period: 2,
      startTime: "09:45",
      endTime: "11:45",
      subjectName: "Pendidikan Pancasila & Kewarganegaraan",
      teacherName: "Bpk. Drs. Sukarman",
      roomName: "Ruang Teori X-RPL-1",
    },

    // JUMAT
    {
      classRoomId: classXRpl1.id,
      dayName: "Jumat",
      period: 1,
      startTime: "07:00",
      endTime: "08:30",
      subjectName: "Literasi Digital & Senam Pagi Sekolah",
      teacherName: "Tim Kesiswaan",
      roomName: "Plaza Utama",
    },
    {
      classRoomId: classXRpl1.id,
      dayName: "Jumat",
      period: 2,
      startTime: "08:45",
      endTime: "11:15",
      subjectName: "Projek Penguatan Profil Pelajar Pancasila (P5)",
      teacherName: "Koordinator Tim P5",
      roomName: "Aula Graha Wiyata",
    },
  ];

  for (const s of schedulesData) {
    await prisma.schedule.create({ data: s });
  }

  console.log("✅ Schedules seeded");

  // 13. Seed Ekstrakurikuler (Extracurriculars)
  const ekskulData = [
    {
      name: "Coding & Cyber Security Club",
      category: "Teknologi",
      coachName: "Bpk. Ridwan Fauzi, M.T. & Alumni Industri",
      scheduleDay: "Rabu",
      scheduleTime: "15:30 - 17:00 WIB",
      location: "Lab Komputer RPL 1 & Ruang Server",
      memberCount: 38,
      description: "Pengembangan web modern, machine learning dasar, CTF (Capture the Flag), dan persiapan Lomba LKS.",
    },
    {
      name: "Robotika & Internet of Things (IoT)",
      category: "Teknologi",
      coachName: "Bpk. Iwan Sofana, S.T.",
      scheduleDay: "Kamis",
      scheduleTime: "15:30 - 17:00 WIB",
      location: "Lab Elektronika & IoT TKJ",
      memberCount: 26,
      description: "Perakitan mikrokontroler Arduino/ESP32, sensor pintar, otomasi industri, dan robot line follower.",
    },
    {
      name: "Pasukan Pengibar Bendera Pusaka (Paskibra)",
      category: "Kepemimpinan",
      coachName: "Pelatih Kodim & Tim Kesiswaan",
      scheduleDay: "Selasa & Jumat",
      scheduleTime: "15:30 - 17:15 WIB",
      location: "Lapangan Upacara Utama",
      memberCount: 42,
      description: "Pelatihan baris-berbaris formal, pembinaan kedisiplinan, postur, serta seleksi paskibraka tingkat kota.",
    },
    {
      name: "Palang Merah Remaja (PMR Wira)",
      category: "Kemanusiaan",
      coachName: "dr. Citra Ananda (UKS & PMI)",
      scheduleDay: "Kamis",
      scheduleTime: "15:30 - 17:00 WIB",
      location: "Gedung UKS Terpadu",
      memberCount: 32,
      description: "Pertolongan pertama gawat darurat, simulasi bencana, donor darah, dan pola hidup sehat sekolah.",
    },
    {
      name: "Futsal & Sepak Bola Prestasi",
      category: "Olahraga",
      coachName: "Coach Danu & Tim Pelatih Lisensi C",
      scheduleDay: "Senin & Kamis",
      scheduleTime: "16:00 - 18:00 WIB",
      location: "Gelanggang Olahraga & Lapangan Futsal",
      memberCount: 45,
      description: "Pengasahan taktik tim, fisik atlet pelajar, dan persiapan turnamen antar-SMA/SMK tingkat provinsi.",
    },
    {
      name: "Desain Grafis & Multimedia Kreatif",
      category: "Seni",
      coachName: "Ibu Dendi Pratama, M.Sn.",
      scheduleDay: "Selasa",
      scheduleTime: "15:30 - 17:00 WIB",
      location: "Studio Multimedia DKV",
      memberCount: 30,
      description: "Eksplorasi ilustrasi digital, UI/UX prototyping, motion graphic, dan fotografi studio komersial.",
    },
  ];

  for (const e of ekskulData) {
    await prisma.extracurricular.create({ data: e });
  }

  console.log("✅ Extracurriculars seeded");

  // 14. Seed Notifikasi Pengguna (Notifications)
  const notificationsData = [
    {
      userId: siswaUser.id,
      title: "🍱 Menu MBG Hari Ini Siap Dibagikan",
      message: "Menu Ayam Panggang Madu + Susu UHT (650 kkal) siap diambil di kantin sehat pukul 11:45 WIB.",
      category: "MBG",
      isRead: false,
    },
    {
      userId: siswaUser.id,
      title: "📚 Batas Pinjam Buku Perpustakaan",
      message: "Buku 'Pemrograman Web & Perangkat Bergerak' dipinjam sejak 5 Nov, batas pengembalian tanggal 12 Nov.",
      category: "LIBRARY",
      isRead: false,
    },
    {
      userId: siswaUser.id,
      title: "🗓️ Perubahan Ruang Kuliah/Praktek",
      message: "Mata pelajaran Basis Data hari ini dipindahkan ke Lab Komputer RPL 1 lantai 2.",
      category: "ACADEMIC",
      isRead: true,
    },
    {
      userId: admin.id,
      title: "🛡️ Audit: Sinkronisasi Master Siswa",
      message: "Data 12 siswa dan rekap presensi harian telah diperbarui oleh sistem.",
      category: "GENERAL",
      isRead: false,
    },
  ];

  for (const n of notificationsData) {
    await prisma.notification.create({ data: n });
  }

  console.log("✅ Notifications seeded");

  // 12. Seed Audit Logs
  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: "INITIAL_SEED",
      details: "Inisialisasi sistem SIMAS dan data master siswa oleh Super Admin.",
      ipAddress: "127.0.0.1",
    },
  });

  console.log("🎉 Seeding selesai! Database siap digunakan.");
}

main()
  .catch((e) => {
    console.error("❌ Gagal seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
