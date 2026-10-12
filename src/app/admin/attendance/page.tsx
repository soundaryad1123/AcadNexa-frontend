"use client";

import React, { useEffect, useState } from "react";
import { AttendanceRecord, AttendanceSummaryItem } from "@/types";
import { getAdminAttendanceSummaryApi, getAdminAttendanceLogsApi } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarCheck, CheckCircle2, XCircle, Clock } from "lucide-react";

export default function AdminAttendancePage() {
  const [summary, setSummary] = useState<AttendanceSummaryItem[]>([]);
  const [logs, setLogs] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [sum, lg] = await Promise.all([
          getAdminAttendanceSummaryApi(),
          getAdminAttendanceLogsApi(),
        ]);
        setSummary(sum || []);
        setLogs(lg || []);
      } catch (err) {
        console.error("Failed to load attendance", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalPresent = logs.filter((l) => l.status === "PRESENT").length;
  const totalAbsent = logs.filter((l) => l.status === "ABSENT").length;
  const totalLate = logs.filter((l) => l.status === "LATE").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-heading font-extrabold text-white">
          Campus Attendance Analytics
        </h2>
        <p className="text-xs text-muted-foreground">
          Real-time aggregated campus attendance metrics & verification audit logs (ADM-02)
        </p>
      </div>

      {/* Aggregate KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-accent-emerald border border-emerald-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Logged Present</span>
            <h4 className="text-2xl font-heading font-extrabold text-white">{totalPresent}</h4>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Logged Absent</span>
            <h4 className="text-2xl font-heading font-extrabold text-white">{totalAbsent}</h4>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 text-accent-amber border border-amber-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Logged Late</span>
            <h4 className="text-2xl font-heading font-extrabold text-white">{totalLate}</h4>
          </div>
        </Card>
      </div>

      {/* Real-time Session Logs Table */}
      <Card className="p-6">
        <CardHeader className="p-0 pb-4">
          <CardTitle>Session Attendance Audit Trail</CardTitle>
          <p className="text-xs text-muted-foreground">
            Complete student attendance events logged by faculty and digital session entry
          </p>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <Skeleton className="h-64" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Roll Number</TableHead>
                  <TableHead>Subject Code</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-400">
                      No attendance records found
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-semibold text-white">
                        {log.student_name || "Student"}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-slate-300">
                        {log.roll_number || "-"}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-primary-400">
                        {log.course_code || "-"}
                      </TableCell>
                      <TableCell className="text-xs text-slate-300">
                        {log.attendance_date}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            log.status === "PRESENT"
                              ? "emerald"
                              : log.status === "ABSENT"
                              ? "destructive"
                              : "amber"
                          }
                        >
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-slate-400">
                        {log.verification_mode}
                      </TableCell>
                      <TableCell className="text-xs text-slate-400 italic">
                        {log.remarks || "-"}
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
