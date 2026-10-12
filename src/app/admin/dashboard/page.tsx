"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Users, CalendarCheck, Clock, Megaphone, Plus, ArrowRight } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { OnboardingModal } from "@/components/modules/onboarding-modal";
import {
  getAdminUsersApi,
  getAdminAttendanceSummaryApi,
  getAdminAlertsApi,
  getAdminTimetablesApi,
} from "@/lib/api";
import { User, AttendanceSummaryItem, Announcement, TimetableSlot } from "@/types";

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [attendance, setAttendance] = useState<AttendanceSummaryItem[]>([]);
  const [alerts, setAlerts] = useState<Announcement[]>([]);
  const [timetables, setTimetables] = useState<TimetableSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [u, att, al, tt] = await Promise.all([
        getAdminUsersApi(),
        getAdminAttendanceSummaryApi(),
        getAdminAlertsApi(),
        getAdminTimetablesApi(),
      ]);
      setUsers(u || []);
      setAttendance(att || []);
      setAlerts(al || []);
      setTimetables(tt || []);
    } catch (err) {
      console.error("Failed to load admin dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalStudents = users.filter((u) => u.role === "STUDENT").length;
  const totalFaculty = users.filter((u) => u.role === "FACULTY").length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-primary-950/40 to-slate-900 border border-primary/20">
        <div>
          <span className="text-[11px] font-bold text-primary-400 uppercase tracking-wider">
            AG-01 • Institutional Administration
          </span>
          <h2 className="text-2xl font-heading font-extrabold text-white mt-1">
            Admin Command Center
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time multi-tenant monitoring, academic scheduling, and campus user directory
          </p>
        </div>
        <Button onClick={() => setOnboardingOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>Onboard User</span>
        </Button>
      </div>

      {/* KPI Cards Row */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Enrolled Students"
            value={totalStudents}
            subtitle="Active across all departments"
            icon={Users}
            iconColor="emerald"
            badge="Active"
          />
          <StatCard
            title="Faculty Members"
            value={totalFaculty}
            subtitle="Teaching & laboratory staff"
            icon={Users}
            iconColor="primary"
          />
          <StatCard
            title="Scheduled Sessions"
            value={timetables.length}
            subtitle="Master weekly timetable slots"
            icon={Clock}
            iconColor="purple"
          />
          <StatCard
            title="Active Broadcasts"
            value={alerts.length}
            subtitle="Campus & department notices"
            icon={Megaphone}
            iconColor="rose"
          />
        </div>
      )}

      {/* Bento Grid: Recent Broadcasts & Department Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recent Notices Feed */}
        <Card className="lg:col-span-2 p-6">
          <CardHeader className="p-0 pb-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Campus Announcements</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Active notifications broadcast to students and faculty
              </p>
            </div>
            <Link
              href="/admin/alerts"
              className="text-xs text-primary-400 hover:text-primary-300 font-semibold flex items-center gap-1"
            >
              <span>Manage all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="p-0 space-y-3">
            {alerts.slice(0, 3).map((a) => (
              <div
                key={a.id}
                className="p-4 rounded-xl bg-slate-900/60 border border-border flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        a.priority === "URGENT" || a.priority === "HIGH"
                          ? "destructive"
                          : "indigo"
                      }
                    >
                      {a.priority}
                    </Badge>
                    <span className="text-[10px] text-slate-400">
                      Target: {a.target_role}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{a.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{a.content}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Right: Quick Navigation Card */}
        <Card className="p-6 flex flex-col justify-between">
          <CardHeader className="p-0 pb-4">
            <CardTitle>Quick Management</CardTitle>
            <p className="text-xs text-muted-foreground">Jump directly to core operations</p>
          </CardHeader>
          <CardContent className="p-0 space-y-2.5">
            <Link
              href="/admin/users"
              className="block p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-border text-xs font-semibold text-slate-200 transition-colors"
            >
              👥 Manage Campus User Directory
            </Link>
            <Link
              href="/admin/attendance"
              className="block p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-border text-xs font-semibold text-slate-200 transition-colors"
            >
              📊 Campus Attendance Logs & Analytics
            </Link>
            <Link
              href="/admin/timetables"
              className="block p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-border text-xs font-semibold text-slate-200 transition-colors"
            >
              🗓️ Master Schedule & Timetable Planner
            </Link>
            <Link
              href="/admin/alerts"
              className="block p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-border text-xs font-semibold text-slate-200 transition-colors"
            >
              📢 Publish Alert or Broadcast
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Onboarding Modal */}
      <OnboardingModal
        open={onboardingOpen}
        onOpenChange={setOnboardingOpen}
        onSuccess={fetchData}
      />
    </div>
  );
}
