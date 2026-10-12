import { apiClient, setAuthToken, clearAuthToken } from "./api-client";
import {
  LoginResponse,
  UserProfile,
  User,
  TimetableSlot,
  AttendanceRecord,
  AttendanceSummaryItem,
  ShortageCheckResponse,
  GradeRecord,
  Announcement,
  SessionRosterResponse,
} from "../types";

// =============================================================================
// AUTHENTICATION & PROFILE APIS
// =============================================================================
export async function loginApi(payload: { email: string; password: string; college_slug?: string }): Promise<LoginResponse> {
  const data = await apiClient<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (data?.access_token) {
    setAuthToken(data.access_token);
    if (typeof window !== "undefined") {
      localStorage.setItem("acadnexa_user", JSON.stringify(data));
    }
  }
  return data;
}

export async function getMeApi(): Promise<UserProfile> {
  return apiClient<UserProfile>("/auth/me");
}

export function logoutApi(): void {
  clearAuthToken();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

// =============================================================================
// ADMIN PORTAL APIS (AG-01, ADM-01 to ADM-04)
// =============================================================================
export async function getAdminUsersApi(params?: { role?: string; department_id?: string; status?: string }): Promise<User[]> {
  const searchParams = new URLSearchParams();
  if (params?.role) searchParams.append("role", params.role);
  if (params?.department_id) searchParams.append("department_id", params.department_id);
  if (params?.status) searchParams.append("status", params.status);
  const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
  return apiClient<User[]>(`/admin/users${query}`);
}

export async function createAdminUserApi(payload: Record<string, any>): Promise<User> {
  return apiClient<User>("/admin/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateAdminUserApi(userId: string, payload: Record<string, any>): Promise<User> {
  return apiClient<User>(`/admin/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function getAdminAttendanceSummaryApi(params?: { start_date?: string; end_date?: string }): Promise<AttendanceSummaryItem[]> {
  const searchParams = new URLSearchParams();
  if (params?.start_date) searchParams.append("start_date", params.start_date);
  if (params?.end_date) searchParams.append("end_date", params.end_date);
  const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
  return apiClient<AttendanceSummaryItem[]>(`/admin/attendance/summary${query}`);
}

export async function getAdminAttendanceLogsApi(params?: { attendance_date?: string; department_id?: string; course_id?: string; status?: string }): Promise<AttendanceRecord[]> {
  const searchParams = new URLSearchParams();
  if (params?.attendance_date) searchParams.append("attendance_date", params.attendance_date);
  if (params?.department_id) searchParams.append("department_id", params.department_id);
  if (params?.course_id) searchParams.append("course_id", params.course_id);
  if (params?.status) searchParams.append("status", params.status);
  const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
  return apiClient<AttendanceRecord[]>(`/admin/attendance/logs${query}`);
}

export async function getAdminAlertsApi(): Promise<Announcement[]> {
  return apiClient<Announcement[]>("/admin/alerts");
}

export async function createAdminAlertApi(payload: { title: string; content: string; category?: string; target_role?: string; priority?: string }): Promise<Announcement> {
  return apiClient<Announcement>("/admin/alerts", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminAlertApi(alertId: string): Promise<null> {
  return apiClient<null>(`/admin/alerts/${alertId}`, {
    method: "DELETE",
  });
}

export async function getAdminTimetablesApi(params?: { department_id?: string; academic_year?: string; semester?: number }): Promise<TimetableSlot[]> {
  const searchParams = new URLSearchParams();
  if (params?.department_id) searchParams.append("department_id", params.department_id);
  if (params?.academic_year) searchParams.append("academic_year", params.academic_year);
  if (params?.semester) searchParams.append("semester", String(params.semester));
  const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
  return apiClient<TimetableSlot[]>(`/admin/timetables${query}`);
}

export async function createAdminTimetableApi(payload: Record<string, any>): Promise<TimetableSlot> {
  return apiClient<TimetableSlot>("/admin/timetables", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminTimetableApi(id: string): Promise<null> {
  return apiClient<null>(`/admin/timetables/${id}`, {
    method: "DELETE",
  });
}

// =============================================================================
// FACULTY PORTAL APIS (AG-02, FAC-01 to FAC-05)
// =============================================================================
export async function getFacultyTimetableApi(): Promise<TimetableSlot[]> {
  return apiClient<TimetableSlot[]>("/faculty/timetable");
}

export async function getSessionRosterApi(sessionId: string): Promise<SessionRosterResponse> {
  return apiClient<SessionRosterResponse>(`/faculty/sessions/${sessionId}/roster`);
}

export async function submitSessionAttendanceApi(sessionId: string, payload: { attendance_date: string; records: { student_id: string; status: string; remarks?: string }[]; verification_mode?: string }): Promise<AttendanceRecord[]> {
  return apiClient<AttendanceRecord[]>(`/faculty/sessions/${sessionId}/attendance`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function overrideAttendanceApi(payload: { student_id: string; course_id: string; timetable_id?: string; attendance_date: string; status: string; remarks: string }): Promise<AttendanceRecord> {
  return apiClient<AttendanceRecord>("/faculty/attendance/override", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getCourseAssessmentsApi(courseId: string, assessmentType?: string): Promise<GradeRecord[]> {
  const query = assessmentType ? `?assessment_type=${encodeURIComponent(assessmentType)}` : "";
  return apiClient<GradeRecord[]>(`/faculty/courses/${courseId}/assessments${query}`);
}

export async function createAssessmentApi(payload: Record<string, any>): Promise<GradeRecord> {
  return apiClient<GradeRecord>("/faculty/assessments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateAssessmentApi(recordId: string, payload: Record<string, any>): Promise<GradeRecord> {
  return apiClient<GradeRecord>(`/faculty/assessments/${recordId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function getFacultyAlertsApi(): Promise<Announcement[]> {
  return apiClient<Announcement[]>("/faculty/alerts");
}

// =============================================================================
// STUDENT PORTAL APIS (AG-03, STD-01 to STD-05)
// =============================================================================
export async function getStudentAttendanceApi(courseId?: string): Promise<AttendanceRecord[]> {
  const query = courseId ? `?course_id=${courseId}` : "";
  return apiClient<AttendanceRecord[]>(`/student/attendance${query}`);
}

export async function getStudentShortageCheckApi(): Promise<ShortageCheckResponse> {
  return apiClient<ShortageCheckResponse>("/student/attendance/shortage-check");
}

export async function getStudentTimetableApi(): Promise<TimetableSlot[]> {
  return apiClient<TimetableSlot[]>("/student/timetable");
}

export async function getStudentAssessmentsApi(courseId?: string, semester?: number): Promise<GradeRecord[]> {
  const searchParams = new URLSearchParams();
  if (courseId) searchParams.append("course_id", courseId);
  if (semester) searchParams.append("semester", String(semester));
  const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
  return apiClient<GradeRecord[]>(`/student/assessments${query}`);
}

export async function getStudentProfileApi(): Promise<Record<string, any>> {
  return apiClient<Record<string, any>>("/student/profile");
}

export async function getStudentAlertsApi(): Promise<Announcement[]> {
  return apiClient<Announcement[]>("/student/alerts");
}
