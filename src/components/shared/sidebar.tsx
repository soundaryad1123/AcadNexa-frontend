"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  CalendarCheck,
  Clock,
  Award,
  Megaphone,
  User,
  LogOut,
  FolderOpen,
} from "lucide-react";
import { logoutApi } from "@/lib/api";
import { Role } from "@/types";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const adminNavItems: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "User Directory", href: "/admin/users", icon: Users },
  { label: "Campus Attendance", href: "/admin/attendance", icon: CalendarCheck },
  { label: "Master Timetables", href: "/admin/timetables", icon: Clock },
  { label: "Announcements", href: "/admin/alerts", icon: Megaphone },
];

const facultyNavItems: NavItem[] = [
  { label: "Dashboard", href: "/faculty/dashboard", icon: LayoutDashboard },
  { label: "Teaching Schedule", href: "/faculty/timetable", icon: Clock },
  { label: "Gradebook", href: "/faculty/assessments", icon: Award },
  { label: "Announcements", href: "/faculty/alerts", icon: Megaphone },
];

const studentNavItems: NavItem[] = [
  { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
  { label: "Attendance Hub", href: "/student/attendance", icon: CalendarCheck, badge: "92.4%" },
  { label: "Class Timetable", href: "/student/timetable", icon: Clock },
  { label: "Grades & CGPA", href: "/student/grades", icon: Award, badge: "9.42" },
  { label: "Announcements", href: "/student/alerts", icon: Megaphone },
  { label: "My Profile", href: "/student/profile", icon: User },
];

export function Sidebar({
  role,
  userName = "User",
  userIdentifier = "ID-001",
}: {
  role: Role;
  userName?: string;
  userIdentifier?: string;
}) {
  const pathname = usePathname();

  const navItems =
    role === "ADMIN"
      ? adminNavItems
      : role === "FACULTY"
      ? facultyNavItems
      : studentNavItems;

  const roleLabels = {
    ADMIN: "College Admin",
    FACULTY: "Faculty Member",
    STUDENT: "Student Portal",
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <aside className="w-64 bg-slate-950 border-r border-border flex flex-col justify-between hidden md:flex shrink-0 sticky top-0 h-screen z-30">
      <div>
        {/* Institutional Branding */}
        <div className="h-20 flex items-center gap-3 px-6 border-b border-border">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-indigo-400 flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
              AcadNexa
            </h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
              Apex Inst. of Tech
            </p>
          </div>
        </div>

        {/* User Role Indicator Pill */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between px-3 py-2 bg-slate-900/80 rounded-xl border border-border">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse"></span>
              <span className="text-xs font-semibold text-slate-300">{roleLabels[role]}</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary-950 text-primary-400 border border-primary-800/60">
              Active
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-4 space-y-1 mt-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all group ${
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? "text-white" : "group-hover:text-primary-400"
                  }`}
                />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-accent-emerald/20 text-accent-emerald"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Footer Profile & Logout */}
      <div className="p-4 border-t border-border">
        <div className="p-3 rounded-xl bg-slate-900/90 border border-border flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              {getInitials(userName)}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-accent-emerald border-2 border-slate-900"></span>
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-semibold text-white truncate">{userName}</h4>
            <p className="text-[10px] text-slate-400 truncate">{userIdentifier}</p>
          </div>
          <button
            onClick={() => logoutApi()}
            className="ml-auto text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
