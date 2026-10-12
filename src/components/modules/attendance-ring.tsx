"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { NumberTicker } from "@/components/animations/number-ticker";

interface AttendanceRingProps {
  percentage: number;
  attendedClasses: number;
  totalClasses: number;
  className?: string;
}

export function AttendanceRing({
  percentage,
  attendedClasses,
  totalClasses,
  className,
}: AttendanceRingProps) {
  const isShortage = percentage < 75.0;
  const strokeColor = isShortage ? "text-rose-500" : "text-accent-emerald";
  const badgeBg = isShortage
    ? "bg-rose-950 text-rose-300 border-rose-800/60"
    : "bg-emerald-950 text-emerald-300 border-emerald-800/60";

  // Circumference for r=42 is ~264
  const circumference = 264;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Card className={cn("p-6 flex flex-col justify-between glass-card-hover", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              "p-2 rounded-lg border",
              isShortage
                ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                : "bg-emerald-500/10 text-accent-emerald border-emerald-500/20"
            )}
          >
            {isShortage ? (
              <AlertTriangle className="w-4 h-4" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
          </div>
          <h3 className="font-heading font-bold text-sm text-white">Attendance Vitality</h3>
        </div>
        <span
          className={cn(
            "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border",
            badgeBg
          )}
        >
          {isShortage ? "Shortage Warning" : "Safe Status"}
        </span>
      </div>

      {/* Circular Progress Ring */}
      <div className="flex items-center justify-center my-3 relative">
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              stroke="currentColor"
              strokeWidth="8"
              className="text-slate-800"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={cn("transition-all duration-1000 ease-out", strokeColor)}
              fill="transparent"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-heading font-black text-white">
              <NumberTicker value={percentage} decimalPlaces={1} />%
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Overall Rate</span>
          </div>
        </div>
      </div>

      {/* Metrics Breakdown Footer */}
      <div className="pt-3 border-t border-border grid grid-cols-2 gap-2 text-center text-xs">
        <div className="bg-slate-900/60 p-2 rounded-lg">
          <span className="text-slate-400 text-[10px] block">Attended Sessions</span>
          <span className="font-bold text-white text-sm">
            {attendedClasses} / {totalClasses}
          </span>
        </div>
        <div className="bg-slate-900/60 p-2 rounded-lg">
          <span className="text-slate-400 text-[10px] block">
            {isShortage ? "Classes Needed" : "Safe Buffer"}
          </span>
          <span
            className={cn(
              "font-bold text-sm",
              isShortage ? "text-rose-400" : "text-accent-emerald"
            )}
          >
            {isShortage ? "Immediate Action" : "+7 Safe Buffer"}
          </span>
        </div>
      </div>
    </Card>
  );
}
