"use client";

import React from "react";
import { Search, Bell, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Topbar({
  userName = "User",
  roleName = "Portal",
}: {
  userName?: string;
  roleName?: string;
}) {
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <header className="h-20 bg-slate-950/80 backdrop-blur-md border-b border-border px-6 md:px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Search Input */}
      <div className="relative max-w-md w-full hidden sm:block">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <Input
          type="text"
          placeholder="Search subjects, schedules, students, notices..."
          className="pl-10 h-10 text-xs bg-slate-900 border-border"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Academic Session Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-800/40 text-xs text-indigo-300 font-medium">
          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
          <span>Academic Year 2025-2026 (Odd Sem)</span>
        </div>

        {/* Notifications Button */}
        <button className="relative p-2.5 rounded-xl bg-slate-900 border border-border text-slate-300 hover:text-white hover:border-slate-700 transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
        </button>

        {/* Profile Pill */}
        <div className="flex items-center gap-3 pl-2 border-l border-border">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-white leading-none">{userName}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{roleName}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-indigo-400 flex items-center justify-center text-white font-bold text-xs shadow-md">
            {getInitials(userName)}
          </div>
        </div>
      </div>
    </header>
  );
}
