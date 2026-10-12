"use client";

import React, { useEffect, useState } from "react";
import { getStudentProfileApi } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { User, BookOpen, GraduationCap, Phone, Mail, Hash } from "lucide-react";

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getStudentProfileApi();
        setProfile(data);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-extrabold text-white">
          Student Academic Profile
        </h2>
        <p className="text-xs text-muted-foreground">
          Official enrollment records, curriculum registration, and university identifier (STD-04)
        </p>
      </div>

      {loading ? (
        <Skeleton className="h-96" />
      ) : !profile ? (
        <Card className="p-8 text-center text-slate-400">Profile data unavailable</Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Identity Card */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-indigo-400 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-primary/30">
                {profile.full_name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <h3 className="text-lg font-heading font-bold text-white">
                  {profile.full_name}
                </h3>
                <p className="text-xs text-slate-400">{profile.email}</p>
                <Badge variant="emerald" className="mt-1">
                  Enrolled Active
                </Badge>
              </div>
            </div>

            <div className="pt-4 border-t border-border space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5" />
                  <span>University Roll No</span>
                </span>
                <span className="font-mono font-bold text-white">
                  {profile.roll_number}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Registration No</span>
                </span>
                <span className="font-mono text-slate-200">
                  {profile.registration_no}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Current Semester</span>
                <span className="font-bold text-primary-400">
                  Semester {profile.current_semester} (Year {profile.current_year})
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Class Section</span>
                <span className="font-bold text-white">Section {profile.section}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Academic Batch</span>
                <span className="font-semibold text-slate-300">{profile.batch_year}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Cumulative CGPA</span>
                <span className="font-bold text-accent-emerald text-sm">
                  {profile.cgpa} / 10.0
                </span>
              </div>
            </div>
          </Card>

          {/* Enrolled Courses List */}
          <Card className="lg:col-span-2 p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle>Registered Courses & Curriculum</CardTitle>
              <p className="text-xs text-muted-foreground">
                Approved courses registered for Academic Year 2025-2026
              </p>
            </CardHeader>
            <CardContent className="p-0 space-y-3">
              {profile.enrolled_courses?.map((c: any) => (
                <div
                  key={c.course_id}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-border flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary-400">
                        {c.code}
                      </span>
                      <Badge variant="indigo">{c.course_type}</Badge>
                      <Badge variant="emerald">{c.enrollment_status}</Badge>
                    </div>
                    <h4 className="text-sm font-semibold text-white">{c.name}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-primary-300 block">
                      {c.credits} Credits
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Sem {c.semester}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
