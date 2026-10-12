"use client";

import React, { useEffect, useState } from "react";
import { GradeRecord, TimetableSlot } from "@/types";
import { getFacultyTimetableApi, getCourseAssessmentsApi, createAssessmentApi } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Award, Plus, Filter } from "lucide-react";

export default function FacultyAssessmentsPage() {
  const [courses, setCourses] = useState<{ id: string; code: string; name: string }[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [grades, setGrades] = useState<GradeRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      try {
        const timetable = await getFacultyTimetableApi();
        const courseMap = new Map<string, { id: string; code: string; name: string }>();
        timetable?.forEach((slot) => {
          if (!courseMap.has(slot.course_id)) {
            courseMap.set(slot.course_id, {
              id: slot.course_id,
              code: slot.course_code || "",
              name: slot.course_name || "",
            });
          }
        });
        const courseList = Array.from(courseMap.values());
        setCourses(courseList);
        if (courseList.length > 0) {
          setSelectedCourseId(courseList[0].id);
        }
      } catch (err) {
        console.error("Failed to load faculty courses", err);
      }
    }
    loadCourses();
  }, []);

  useEffect(() => {
    async function loadGrades() {
      if (!selectedCourseId) return;
      try {
        setLoading(true);
        const data = await getCourseAssessmentsApi(selectedCourseId);
        setGrades(data || []);
      } catch (err) {
        console.error("Failed to load assessments", err);
      } finally {
        setLoading(false);
      }
    }
    loadGrades();
  }, [selectedCourseId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-heading font-extrabold text-white">
          Continuous Assessment & Gradebook
        </h2>
        <p className="text-xs text-muted-foreground">
          Record, calculate, and publish student scores for tests, lab vivas, and term exams (FAC-03)
        </p>
      </div>

      {/* Course Filter Bar */}
      <Card className="p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-300">Select Subject Course:</span>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="h-10 px-3 rounded-xl border border-border bg-slate-900 text-xs text-white"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} — {c.name}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Grade Records Table */}
      <Card className="p-6">
        <CardHeader className="p-0 pb-4">
          <CardTitle>Published Evaluation Sheet</CardTitle>
          <p className="text-xs text-muted-foreground">
            Grade points and letters evaluated for enrolled students
          </p>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <Skeleton className="h-64" />
          ) : grades.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Award className="w-8 h-8 mx-auto text-slate-600 mb-2" />
              <p className="text-sm">No assessment scores submitted for this course yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Roll Number</TableHead>
                  <TableHead>Evaluation Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Marks Scored</TableHead>
                  <TableHead className="text-center">Grade Letter</TableHead>
                  <TableHead>Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grades.map((g) => (
                  <TableRow key={g.id}>
                    <TableCell className="font-semibold text-white">
                      {g.student_name}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-slate-300">
                      {g.roll_number}
                    </TableCell>
                    <TableCell className="text-slate-200">
                      {g.assessment_name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="indigo">{g.assessment_type}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold text-white">
                      {g.marks_obtained.toFixed(2)} / {g.max_marks.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="px-2 py-0.5 rounded text-xs font-extrabold bg-emerald-950 text-accent-emerald border border-emerald-800/60">
                        {g.grade_letter || "O"} ({g.grade_point || "10.0"})
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-slate-400 italic">
                      {g.remarks || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
