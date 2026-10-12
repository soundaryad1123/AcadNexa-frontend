"use client";

import React, { useEffect, useState } from "react";
import { ShortageCheckResponse, AttendanceRecord } from "@/types";
import { getStudentShortageCheckApi, getStudentAttendanceApi } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarCheck, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function StudentAttendancePage() {
  const [shortage, setShortage] = useState<ShortageCheckResponse | null>(null);
  const [logs, setLogs] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [sc, lg] = await Promise.all([
          getStudentShortageCheckApi(),
          getStudentAttendanceApi(),
        ]);
        setShortage(sc);
        setLogs(lg || []);
      } catch (err) {
        console.error("Failed to load attendance", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-heading font-extrabold text-white">
          Attendance Hub & Shortage Monitor
        </h2>
        <p className="text-xs text-muted-foreground">
          Dynamic real-time attendance calculation and shortage check against 75% criteria (STD-01)
        </p>
      </div>

      {/* Shortage Alert Banner if any course is < 75% */}
      {shortage?.has_any_shortage ? (
        <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-800 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-rose-200">Attendance Shortage Warning Detected</h4>
            <p className="text-xs text-rose-300">
              One or more subjects have fallen below the mandatory 75% criteria. Attend all upcoming sessions to avoid exam detention.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-accent-emerald shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-emerald-200">Excellent Attendance Record</h4>
            <p className="text-xs text-emerald-300">
              Your overall attendance is {shortage?.overall_attendance_percentage}%. You are comfortably above the university threshold.
            </p>
          </div>
        </div>
      )}

      {/* Subject-wise Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {shortage?.courses?.map((course) => (
          <Card key={course.course_id} className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-primary-400">
                  {course.course_code}
                </span>
                <h4 className="text-base font-heading font-bold text-white">
                  {course.course_name}
                </h4>
              </div>
              <Badge variant={course.is_shortage ? "destructive" : "emerald"}>
                {course.attendance_percentage}%
              </Badge>
            </div>

            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  course.is_shortage ? "bg-rose-500" : "bg-accent-emerald"
                }`}
                style={{ width: `${Math.min(course.attendance_percentage, 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span>
                Attended: <strong className="text-white">{course.attended_classes}</strong> / {course.total_classes} classes
              </span>
              <span>
                {course.is_shortage ? (
                  <strong className="text-rose-400">Shortage alert</strong>
                ) : (
                  <strong className="text-accent-emerald">Eligible</strong>
                )}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Session History Log Table */}
      <Card className="p-6">
        <CardHeader className="p-0 pb-4">
          <CardTitle>Session Attendance History Log</CardTitle>
          <p className="text-xs text-muted-foreground">Every class session and verification record</p>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <Skeleton className="h-48" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject Code</TableHead>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Verification Mode</TableHead>
                  <TableHead>Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-400">
                      No attendance records found
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell className="font-mono text-xs text-primary-400">
                        {l.course_code}
                      </TableCell>
                      <TableCell className="font-semibold text-white">
                        {l.course_name}
                      </TableCell>
                      <TableCell className="text-xs text-slate-300">
                        {l.attendance_date}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            l.status === "PRESENT"
                              ? "emerald"
                              : l.status === "ABSENT"
                              ? "destructive"
                              : "amber"
                          }
                        >
                          {l.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-slate-400">
                        {l.verification_mode}
                      </TableCell>
                      <TableCell className="text-xs text-slate-400 italic">
                        {l.remarks || "-"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
