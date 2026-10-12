export type Role = "ADMIN" | "FACULTY" | "STUDENT";

export interface User {
  id: string;
  college_id: string;
  department_id?: string | null;
  department_name?: string | null;
  email: string;
  full_name: string;
  phone_number?: string | null;
  role: Role;
  status: string;
  created_at?: string;
}

export interface UserProfile extends User {
  college_name?: string | null;
  department_code?: string | null;
  avatar_url?: string | null;
  last_login_at?: string | null;
  roll_number?: string | null;
  registration_no?: string | null;
  current_semester?: number | null;
  current_year?: number | null;
  section?: string | null;
  cgpa?: number | null;
  employee_code?: string | null;
  designation?: string | null;
  specialization?: string | null;
  cabin_room?: string | null;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  college_id: string;
  email: string;
  full_name: string;
  role: Role;
  department_id?: string | null;
  department_name?: string | null;
}

export interface TimetableSlot {
  id: string;
  college_id: string;
  department_id: string;
  department_name?: string | null;
  course_id: string;
  course_code?: string | null;
  course_name?: string | null;
  faculty_id: string;
  faculty_name?: string | null;
  day_of_week: number;
  day_name?: string | null;
  start_time: string;
  end_time: string;
  room_number: string;
  section: string;
  session_type: "THEORY" | "LAB" | "SEMINAR" | "TUTORIAL";
  semester: number;
  academic_year: string;
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  student_name?: string | null;
  roll_number?: string | null;
  course_id: string;
  course_code?: string | null;
  course_name?: string | null;
  timetable_id?: string | null;
  attendance_date: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
  verification_mode: string;
  remarks?: string | null;
  created_at: string;
}

export interface AttendanceSummaryItem {
  department_id?: string | null;
  department_name?: string | null;
  attendance_date?: string | null;
  status: string;
  count: number;
}

export interface StudentCourseAttendanceSummary {
  course_id: string;
  course_code: string;
  course_name: string;
  total_classes: number;
  attended_classes: number;
  attendance_percentage: number;
  is_shortage: boolean;
}

export interface ShortageCheckResponse {
  student_id: string;
  overall_attendance_percentage: number;
  has_any_shortage: boolean;
  courses: StudentCourseAttendanceSummary[];
}

export interface GradeRecord {
  id: string;
  student_id: string;
  student_name?: string | null;
  roll_number?: string | null;
  course_id: string;
  course_code?: string | null;
  course_name?: string | null;
  faculty_id: string;
  faculty_name?: string | null;
  assessment_type: string;
  assessment_name: string;
  marks_obtained: number;
  max_marks: number;
  grade_letter?: string | null;
  grade_point?: number | null;
  semester: number;
  academic_year: string;
  remarks?: string | null;
  evaluated_at: string;
}

export interface Announcement {
  id: string;
  college_id: string;
  department_id?: string | null;
  department_name?: string | null;
  author_id: string;
  author_name?: string | null;
  title: string;
  content: string;
  category: string;
  target_role: string;
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  expires_at?: string | null;
  created_at: string;
  published_at?: string | null;
}

export interface RosterStudent {
  enrollment_id: string;
  student_id: string;
  user_id: string;
  full_name: string;
  email: string;
  roll_number: string;
  registration_no: string;
  section: string;
  semester: number;
}

export interface SessionRosterResponse {
  timetable_id: string;
  course_id: string;
  course_code: string;
  course_name: string;
  room_number: string;
  session_type: string;
  total_enrolled: number;
  students: RosterStudent[];
}
