"use client";

import React, { useEffect, useState } from "react";
import { GradeRecord } from "@/types";
import { getStudentAssessmentsApi } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Award, TrendingUp } from "lucide-react";

export default function StudentGradesPage() {
  const [grades, setGrades] = useState<GradeRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getStudentAssessmentsApi();
        setGrades(data || []);
      } catch (err) {
        console.error("Failed to load assessments", err);
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
          Academic Performance & Gradebook
        </h2>
        <p className="text-xs text-muted-foreground">
          Continuous internal assessment (CIE) test scores, lab practical evaluations, and final grades (STD-03)
        </p>
      </div>

      {/* CGPA Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10 text-primary-400 border border-primary/20">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Cumulative CGPA</span>
            <h4 className="text-2xl font-heading font-extrabold text-white">9.42 / 10.0</h4>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-accent-emerald border border-emerald-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Semester Standing</span>
            <h4 className="text-2xl font-heading font-extrabold text-accent-emerald">Distinction (O)</h4>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Evaluations Completed</span>
            <h4 className="text-2xl font-heading font-extrabold text-white">{grades.length}</h4>
          </div>
        </Card>
      </div>

      {/* Grades Table */}
      <Card className="p-6">
        <CardHeader className="p-0 pb-4">
          <CardTitle>Evaluation Results & Term Grades</CardTitle>
          <p className="text-xs text-muted-foreground">Verified marks and evaluator remarks</p>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <Skeleton className="h-64" />
          ) : grades.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Award className="w-8 h-8 mx-auto text-slate-600 mb-2" />
              <p className="text-sm">No evaluation scores published yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Code & Name</TableHead>
                  <TableHead>Evaluation Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Marks Scored</TableHead>
                  <TableHead className="text-center">Grade Letter</TableHead>
                  <TableHead>Evaluator Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grades.map((g) => (
                  <TableRow key={g.id}>
                    <TableCell className="font-semibold text-white">
                      <span className="text-primary-400 font-mono">{g.course_code}</span> • {g.course_name}
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
