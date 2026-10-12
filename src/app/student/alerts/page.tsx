"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getStudentAlertsApi } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, AlertTriangle, Info, Calendar, Sparkles } from "lucide-react";

export default function StudentAlertsPage() {
  const { data: alerts, isLoading, error } = useQuery({
    queryKey: ["studentAlerts"],
    queryFn: getStudentAlertsApi,
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-blue-900/60 via-slate-900 to-indigo-950/60 rounded-2xl border border-blue-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <Bell className="w-5 h-5" />
            </span>
            <span className="text-xs uppercase tracking-wider text-blue-400 font-semibold">Campus Broadcasts</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Institutional & Department Alerts</h1>
          <p className="text-sm text-slate-400 mt-1">
            Official announcements, schedule revisions, exam guidelines, and campus notifications.
          </p>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="grid gap-4">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full rounded-xl bg-slate-800/50" />
            <Skeleton className="h-32 w-full rounded-xl bg-slate-800/50" />
            <Skeleton className="h-32 w-full rounded-xl bg-slate-800/50" />
          </div>
        ) : error ? (
          <Card className="border-red-500/20 bg-red-950/20">
            <CardContent className="p-6 text-center text-red-400">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-red-400" />
              Failed to load campus announcements. Please check your connection or contact the administrator.
            </CardContent>
          </Card>
        ) : !alerts || alerts.length === 0 ? (
          <Card className="border-slate-800 bg-slate-900/40 text-center py-12">
            <CardContent className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-medium text-slate-200">No Active Notifications</h3>
              <p className="text-sm text-slate-400 max-w-sm mx-auto">
                All caught up! There are currently no pending announcements or urgent advisories for your class.
              </p>
            </CardContent>
          </Card>
        ) : (
          alerts.map((alert) => {
            const isUrgent = alert.priority === "URGENT" || alert.priority === "HIGH";
            const dateStr = alert.created_at
              ? new Date(alert.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Recent";

            return (
              <Card
                key={alert.id}
                className={`transition-all duration-200 hover:border-slate-700 bg-slate-900/60 backdrop-blur-md ${
                  isUrgent ? "border-amber-500/30" : "border-slate-800/80"
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {isUrgent ? (
                        <Badge variant="destructive" className="flex items-center gap-1 font-semibold uppercase text-xs">
                          <AlertTriangle className="w-3 h-3" />
                          Urgent
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="flex items-center gap-1 font-semibold uppercase text-xs">
                          <Info className="w-3 h-3" />
                          {alert.category || "General"}
                        </Badge>
                      )}
                      {alert.target_role && (
                        <Badge variant="outline" className="text-xs">
                          Audience: {alert.target_role}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{dateStr}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg font-semibold text-white mt-2">
                    {alert.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                    {alert.content}
                  </p>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
