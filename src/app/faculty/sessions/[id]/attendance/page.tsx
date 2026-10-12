"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SessionRosterResponse } from "@/types";
import { getSessionRosterApi, submitSessionAttendanceApi } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, XCircle, Clock, ArrowLeft, Save } from "lucide-react";

export default function SessionAttendancePage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const [roster, setRoster] = useState<SessionRosterResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [statusMap, setStatusMap] = useState<Record<string, "PRESENT" | "ABSENT" | "LATE" | "EXCUSED">>({});
  const [remarksMap, setRemarksMap] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadRoster() {
      try {
        setLoading(true);
        const data = await getSessionRosterApi(sessionId);
        setRoster(data);

        // Default all students to PRESENT
        const initialStatus: Record<string, "PRESENT" | "ABSENT" | "LATE" | "EXCUSED"> = {};
        data?.students?.forEach((s) => {
          initialStatus[s.student_id] = "PRESENT";
        });
        setStatusMap(initialStatus);
      } catch (err) {
        console.error("Failed to load roster", err);
      } finally {
        setLoading(false);
      }
    }
    if (sessionId) {
      loadRoster();
    }
  }, [sessionId]);

  const setStatus = (studentId: string, status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED") => {
    setStatusMap((prev) => ({ ...prev, [studentId]: status }));
  };

  const markAll = (status: "PRESENT" | "ABSENT") => {
    const updated: Record<string, "PRESENT" | "ABSENT" | "LATE" | "EXCUSED"> = {};
    roster?.students?.forEach((s) => {
      updated[s.student_id] = status;
    });
    setStatusMap(updated);
  };

  const handleSubmit = async () => {
    if (!roster) return;
    setSubmitting(true);
    setSuccessMsg(null);

    try {
      const records = roster.students.map((s) => ({
        student_id: s.student_id,
        status: statusMap[s.student_id] || "PRESENT",
        remarks: remarksMap[s.student_id] || undefined,
      }));

      await submitSessionAttendanceApi(sessionId, {
        attendance_date: attendanceDate,
        records,
        verification_mode: "PORTAL",
      });

      setSuccessMsg("Attendance successfully recorded for this session!");
      setTimeout(() => {
        router.push("/faculty/dashboard");
      }, 1500);
    } catch (err: any) {
      alert(err?.message || "Failed to submit attendance");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!roster) {
    return (
      <Card className="p-8 text-center text-slate-400">
        <p>Session not found or roster unavailable.</p>
        <Button onClick={() => router.back()} className="mt-4" variant="outline">
          Go Back
        </Button>
      </Card>
    );
  }

  const presentCount = Object.values(statusMap).filter((s) => s === "PRESENT").length;
  const absentCount = Object.values(statusMap).filter((s) => s === "ABSENT").length;

  return (
    <div className="space-y-6">
      {/* Top Navigation & Session Details */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="h-9 px-2.5"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-primary-400">
                {roster.course_code}
              </span>
              <Badge variant="indigo">{roster.session_type}</Badge>
              <Badge variant="emerald">{roster.room_number}</Badge>
            </div>
            <h2 className="text-2xl font-heading font-extrabold text-white mt-0.5">
              {roster.course_name}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
            className="h-10 px-3 rounded-xl border border-border bg-slate-900 text-xs text-white"
          />
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-1.5 shadow glow"
          >
            <Save className="w-4 h-4" />
            <span>{submitting ? "Saving..." : "Save Attendance"}</span>
          </Button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-accent-emerald text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Roster Controls & Metrics Bar */}
      <Card className="p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">
            Total Enrolled: <strong className="text-white">{roster.total_enrolled}</strong>
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-xs text-accent-emerald">
            Present: <strong>{presentCount}</strong>
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-xs text-rose-400">
            Absent: <strong>{absentCount}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => markAll("PRESENT")}
            className="text-xs text-accent-emerald hover:text-accent-emerald hover:bg-emerald-950/40"
          >
            Mark All Present
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => markAll("ABSENT")}
            className="text-xs text-rose-400 hover:text-rose-400 hover:bg-rose-950/40"
          >
            Clear All
          </Button>
        </div>
      </Card>

      {/* Student Roster Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">#</TableHead>
            <TableHead>Student Name</TableHead>
            <TableHead>Roll Number</TableHead>
            <TableHead>Section</TableHead>
            <TableHead className="text-center w-72">Attendance Status</TableHead>
            <TableHead>Remarks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roster.students.map((student, idx) => {
            const currentStatus = statusMap[student.student_id] || "PRESENT";

            return (
              <TableRow key={student.student_id}>
                <TableCell className="text-slate-400 font-mono text-xs">
                  {idx + 1}
                </TableCell>
                <TableCell className="font-semibold text-white">
                  {student.full_name}
                </TableCell>
                <TableCell className="font-mono text-xs text-slate-300">
                  {student.roll_number}
                </TableCell>
                <TableCell className="text-xs text-slate-400">
                  Sec {student.section}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setStatus(student.student_id, "PRESENT")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        currentStatus === "PRESENT"
                          ? "bg-accent-emerald text-white shadow-sm glow-emerald"
                          : "bg-slate-900 text-slate-400 hover:text-white"
                      }`}
                    >
                      P
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus(student.student_id, "ABSENT")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        currentStatus === "ABSENT"
                          ? "bg-rose-600 text-white shadow-sm"
                          : "bg-slate-900 text-slate-400 hover:text-white"
                      }`}
                    >
                      A
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus(student.student_id, "LATE")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        currentStatus === "LATE"
                          ? "bg-amber-600 text-white shadow-sm"
                          : "bg-slate-900 text-slate-400 hover:text-white"
                      }`}
                    >
                      L
                    </button>
                  </div>
                </TableCell>
                <TableCell>
                  <input
                    type="text"
                    placeholder="Optional note..."
                    value={remarksMap[student.student_id] || ""}
                    onChange={(e) =>
                      setRemarksMap((prev) => ({
                        ...prev,
                        [student.student_id]: e.target.value,
                      }))
                    }
                    className="w-full bg-slate-900/60 border border-border text-xs rounded-lg px-2.5 py-1 text-slate-300 focus:outline-none focus:border-primary"
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
