export type UserRole = "ADMIN" | "USER";

export interface SessionUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatar?: string | null;
}

export type StudentStatus = "ACTIVE" | "GRADUATED" | "LEAVE" | "TRANSFERRED";

export interface StudentItem {
  id: string;
  nisn: string;
  nis?: string | null;
  fullName: string;
  gender: "L" | "P";
  birthDate?: string | null;
  birthPlace?: string | null;
  departmentId: string;
  department?: {
    id: string;
    code: string;
    name: string;
  };
  classRoomId: string;
  classRoom?: {
    id: string;
    gradeLevel: string;
    name: string;
  };
  status: StudentStatus;
  parentName?: string | null;
  parentPhone?: string | null;
  address?: string | null;
  photoUrl?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  _count?: {
    attendances?: number;
    grades?: number;
    achievements?: number;
    disciplineRecords?: number;
  };
}

export interface DepartmentItem {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  _count?: {
    students?: number;
    classes?: number;
  };
}

export interface ClassRoomItem {
  id: string;
  gradeLevel: string;
  name: string;
  departmentId: string;
  department?: DepartmentItem;
  academicYear: string;
  _count?: {
    students?: number;
  };
}

export type AttendanceStatus = "PRESENT" | "SICK" | "PERMIT" | "ABSENT";

export interface AttendanceItem {
  id: string;
  studentId: string;
  student?: {
    id?: string;
    fullName: string;
    nisn: string;
    classRoom?: {
      name: string;
    };
    department?: {
      code: string;
      name?: string;
    };
  };
  date: string;
  status: AttendanceStatus;
  remarks?: string | null;
}

export interface GradeItem {
  id: string;
  studentId: string;
  student?: {
    fullName: string;
    nisn: string;
  };
  subjectName: string;
  semester: string;
  academicYear: string;
  score: number;
  gradeLetter: string;
}

export interface AchievementItem {
  id: string;
  studentId: string;
  student?: {
    fullName: string;
    nisn: string;
  };
  title: string;
  eventName: string;
  level: string;
  rank: string;
  dateAchieved: string;
}

export interface DisciplineItem {
  id: string;
  studentId: string;
  student?: {
    fullName: string;
    nisn: string;
  };
  type: "PENALTY" | "MERIT";
  points: number;
  description: string;
  date: string;
}

export interface AnnouncementItem {
  id: string;
  authorId?: string | null;
  author?: {
    fullName: string;
  } | null;
  title: string;
  content: string;
  targetRole: "ALL" | "ADMIN" | "USER";
  isPinned: boolean;
  createdAt: string | Date;
}

export interface AuditLogItem {
  id: string;
  userId?: string | null;
  user?: {
    fullName: string;
    role: string;
  } | null;
  action: string;
  details: string;
  ipAddress?: string | null;
  createdAt: string | Date;
}

export interface BookItem {
  id: string;
  title: string;
  author: string;
  publisher: string;
  category: string;
  gradeLevel: string;
  departmentId?: string | null;
  department?: {
    id: string;
    code: string;
    name: string;
  } | null;
  isbn?: string | null;
  stock: number;
  available: number;
  coverUrl?: string | null;
  fileUrl?: string | null;
  createdAt: string | Date;
}

export interface MbgMenuItem {
  id: string;
  dayName: string;
  date: string;
  mainCourse: string;
  sideDish: string;
  vegetable: string;
  fruit: string;
  drink: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  allergens?: string | null;
  distributionTime: string;
  status: "SCHEDULED" | "DISTRIBUTED";
  createdAt: string | Date;
}

export interface ScheduleItem {
  id: string;
  classRoomId: string;
  classRoom?: {
    id: string;
    name: string;
    gradeLevel: string;
  };
  dayName: string;
  period: number;
  startTime: string;
  endTime: string;
  subjectName: string;
  teacherName: string;
  roomName: string;
}

export interface ExtracurricularItem {
  id: string;
  name: string;
  category: string;
  coachName: string;
  scheduleDay: string;
  scheduleTime: string;
  location: string;
  memberCount: number;
  description: string;
  createdAt: string | Date;
}

export interface NotificationItem {
  id: string;
  userId?: string | null;
  title: string;
  message: string;
  category: string;
  isRead: boolean;
  createdAt: string | Date;
}

export interface CounselingItem {
  id: string;
  studentName: string;
  classRoom: string;
  category: string;
  notes: string;
  status: "PENDING" | "SCHEDULED" | "RESOLVED" | "CANCELLED";
  scheduledDate?: string | null;
  createdAt: string | Date;
}
