"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShortageCheckResponse,
  TimetableSlot,
  GradeRecord,
  Announcement,
} from "@/types";
import {
  getStudentShortageCheckApi,
  getStudentTimetableApi,
  getStudentAssessmentsApi,
  getStudentAlertsApi,
} from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AttendanceRing } from "@/components/modules/attendance-ring";
import { formatTime } from "@/lib/utils";
import {
  Radio,
  MapPin,
  AlertTriangle,
  ArrowRight,
  Clock,
  Sparkles,
  ChevronRight,
} from "lucide-react";

export default function StudentDashboardPage() {
  const [shortage, setShortage] = useState<ShortageCheckResponse | null>(null);
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [grades, setGrades] = useState<GradeRecord[]>([]);
  const [alerts, setAlerts] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [sc, tt, gr, al] = await Promise.all([
          getStudentShortageCheckApi(),
          getStudentTimetableApi(),
          getStudentAssessmentsApi(),
          getStudentAlertsApi(),
        ]);
        setShortage(sc);
        setTimetable(tt || []);
        setGrades(gr || []);
        setAlerts(al || []);
      } catch (err) {
        console.error("Failed to load student dashboard", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const nextClass = timetable.length > 0 ? timetable[0] : null;
  const urgentAlert = alerts.find((a) => a.priority === "URGENT" || a.priority === "HIGH") || alerts[0];

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900/80 via-primary-950 to-slate-900 border border-indigo-500/20 p-6 md:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/20 border border-primary-500/30 text-primary-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Student Overview Dashboard</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-white tracking-tight">
              Welcome back, Aarav Sharma 👋
            </h2>
            <p className="text-slate-400 text-xs md:text-sm">
              Dept. of Computer Science & Engineering • Section A • University Roll No:{" "}
              <strong className="text-slate-200">1AT23CS001</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-3 rounded-xl bg-slate-900/80 border border-border text-center min-w-[100px]">
              <span className="text-[11px] text-slate-400 font-medium block">Current CGPA</span>
              <span className="text-xl font-heading font-extrabold text-white">9.42</span>
            </div>
            <div className="px-4 py-3 rounded-xl bg-slate-900/80 border border-border text-center min-w-[100px]">
              <span className="text-[11px] text-slate-400 font-medium block">Attendance</span>
              <span className="text-xl font-heading font-extrabold text-accent-emerald">
                {shortage ? `${shortage.overall_attendance_percentage}%` : "92.4%"}
              </span>
            </div>
            <div className="px-4 py-3 rounded-xl bg-slate-900/80 border border-border text-center min-w-[100px]">
              <span className="text-[11px] text-slate-400 font-medium block">Credits</span>
              <span className="text-xl font-heading font-extrabold text-primary-400">14</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Bento-Grid Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Vitality Ring */}
        {loading ? (
          <Skeleton className="h-64" />
        ) : (
          <AttendanceRing
            percentage={shortage?.overall_attendance_percentage || 92.4}
            attendedClasses={37}
            totalClasses={40}
          />
        )}

        {/* Next Upcoming Class */}
        <Card className="p-6 flex flex-col justify-between glass-card-hover">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-primary/10 text-primary-400 border border-primary/20">
                  <Radio className="w-4 h-4 animate-pulse" />
                </div>
                <h3 className="font-heading font-bold text-sm text-white">Next Upcoming Class</h3>
              </div>
              <Badge variant="indigo">Starts in 25m</Badge>
            </div>

            {nextClass ? (
              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-indigo-500/20 mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-primary-400">
                    {nextClass.course_code} • {nextClass.session_type}
                  </span>
                  <span className="text-xs text-slate-300">
                    {formatTime(nextClass.start_time)} - {formatTime(nextClass.end_time)}
                  </span>
                </div>
                <h4 className="text-lg font-heading font-bold text-white mt-1">
                  {nextClass.course_name}
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Lecture Hall {nextClass.room_number} (CSE Wing)
                </p>
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-slate-400">No more classes today</div>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <span className="text-xs text-slate-400">
              {nextClass?.faculty_name || "Assigned Faculty"}
            </span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium shadow glow">
              <MapPin className="w-3.5 h-3.5" />
              <span>{nextClass?.room_number || "LH-301"}</span>
            </div>
          </div>
        </Card>

        {/* Urgent Notice Card */}
        <Card className="p-6 flex flex-col justify-between glass-card-hover">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-rose-500/10 text-accent-rose border border-rose-500/20">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h3 className="font-heading font-bold text-sm text-white">Urgent Notice</h3>
              </div>
              <Badge variant="destructive">
                {urgentAlert?.priority || "URGENT"}
              </Badge>
            </div>

            <h4 className="text-base font-heading font-bold text-white mb-2 leading-snug">
              {urgentAlert?.title || "Placement Drive Announcement"}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
              {urgentAlert?.content ||
                "Eligible 5th and 7th semester students must register for the upcoming placement drives."}
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border text-xs">
            <span className="text-slate-500 text-[11px]">Campus Placement Cell</span>
            <Link
              href="/student/alerts"
              className="text-primary-400 hover:text-primary-300 font-medium inline-flex items-center gap-1"
            >
              <span>View details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>
      </div>

      {/* Middle Row: Course Breakdown & Recent Grades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Attendance Breakdown */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading font-bold text-base text-white">Course Attendance Breakdown</h3>
              <p className="text-xs text-slate-400">Subject-wise tracking against 75% minimum threshold</p>
            </div>
            <Link
              href="/student/attendance"
              className="text-xs text-primary-400 hover:text-primary-300 font-semibold flex items-center gap-1"
            >
              <span>Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3.5">
            {shortage?.courses?.slice(0, 4).map((c) => (
              <div key={c.course_id} className="p-3 rounded-xl bg-slate-900/60 border border-border">
                <div className="flex items-center justify-between mb-2 text-xs">
                  <div>
                    <span className="font-mono font-bold text-primary-400">{c.course_code}</span>
                    <span className="font-semibold text-white ml-2">{c.course_name}</span>
                  </div>
                  <span
                    className={`font-bold px-2 py-0.5 rounded ${
                      c.is_shortage
                        ? "bg-rose-950 text-rose-300 border border-rose-800"
                        : "bg-emerald-950 text-accent-emerald border border-emerald-800"
                    }`}
                  >
                    {c.attendance_percentage}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      c.is_shortage ? "bg-rose-500" : "bg-accent-emerald"
                    }`}
                    style={{ width: `${Math.min(c.attendance_percentage, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Evaluation Records */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading font-bold text-base text-white">Recent Evaluation Results</h3>
              <p className="text-xs text-slate-400">Continuous assessments & examination marks</p>
            </div>
            <Link
              href="/student/grades"
              className="text-xs text-primary-400 hover:text-primary-300 font-semibold flex items-center gap-1"
            >
              <span>Gradebook</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {grades.slice(0, 3).map((g) => (
              <div
                key={g.id}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-border flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary-400">{g.course_code}</span>
                    <Badge variant="indigo">{g.assessment_type}</Badge>
                  </div>
                  <h4 className="text-sm font-semibold text-white mt-1">{g.assessment_name}</h4>
                  <p className="text-xs text-slate-400 italic mt-0.5">{g.remarks || "Evaluated"}</p>
                </div>
                <div className="text-right">
                  <span className="text-base font-heading font-bold text-white block">
                    {g.marks_obtained} / {g.max_marks}
                  </span>
                  <span className="text-xs font-extrabold text-accent-emerald">
                    Grade {g.grade_letter} ({g.grade_point})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
