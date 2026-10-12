"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { TimetableSlot, Announcement } from "@/types";
import { getFacultyTimetableApi, getFacultyAlertsApi } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/shared/stat-card";
import { formatTime } from "@/lib/utils";
import { Clock, BookOpen, MapPin, CheckCircle, ArrowRight, Award } from "lucide-react";

export default function FacultyDashboardPage() {
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [alerts, setAlerts] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [tt, al] = await Promise.all([
          getFacultyTimetableApi(),
          getFacultyAlertsApi(),
        ]);
        setTimetable(tt || []);
        setAlerts(al || []);
      } catch (err) {
        console.error("Failed to load faculty dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-primary-950/60 via-slate-900 to-slate-900 border border-primary/20">
        <div>
          <span className="text-[11px] font-bold text-primary-400 uppercase tracking-wider">
            AG-02 • Academic Faculty Portal
          </span>
          <h2 className="text-2xl font-heading font-extrabold text-white mt-1">
            Faculty Teaching Workspace
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Conduct live session attendance, continuous student evaluations, and lecture scheduling
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Assigned Classes"
          value={timetable.length}
          subtitle="Weekly theory & practical lab sessions"
          icon={BookOpen}
          iconColor="primary"
        />
        <StatCard
          title="Evaluation Deliverables"
          value="CIE 1 & 2"
          subtitle="Continuous assessment tests active"
          icon={Award}
          iconColor="emerald"
        />
        <StatCard
          title="Department Notices"
          value={alerts.length}
          subtitle="Active faculty announcements"
          icon={Clock}
          iconColor="amber"
        />
      </div>

      {/* Scheduled Classes & Sessions List */}
      <Card className="p-6">
        <CardHeader className="p-0 pb-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle>Teaching Sessions & Digital Attendance</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Click &quot;Take Attendance&quot; to open the enrolled student roster (FAC-01)
            </p>
          </div>
          <Link
            href="/faculty/timetable"
            className="text-xs text-primary-400 hover:text-primary-300 font-semibold flex items-center gap-1"
          >
            <span>Full schedule</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <Skeleton className="h-64" />
          ) : timetable.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Clock className="w-8 h-8 mx-auto text-slate-600 mb-2" />
              <p className="text-sm">No teaching slots assigned</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {timetable.map((slot) => (
                <Card
                  key={slot.id}
                  className="p-5 flex flex-col justify-between glass-card-hover"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="indigo">{slot.session_type}</Badge>
                      <span className="text-xs font-mono text-slate-300">
                        {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-primary-400">
                      {slot.course_code}
                    </span>
                    <h4 className="text-base font-heading font-bold text-white mt-0.5">
                      {slot.course_name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Section {slot.section} • Semester {slot.semester}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-primary-400" />
                      <span>{slot.room_number}</span>
                    </div>

                    <Link
                      href={`/faculty/sessions/${slot.id}/attendance`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-600 shadow glow transition-all"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Take Attendance</span>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
