"use client";

import React, { useEffect, useState } from "react";
import { Announcement } from "@/types";
import { getFacultyAlertsApi } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Megaphone } from "lucide-react";

export default function FacultyAlertsPage() {
  const [alerts, setAlerts] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getFacultyAlertsApi();
        setAlerts(data || []);
      } catch (err) {
        console.error("Failed to load alerts", err);
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
          Faculty Announcements Feed
        </h2>
        <p className="text-xs text-muted-foreground">
          Departmental memos, institutional circulars, and academic exam notifications (FAC-05)
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      ) : alerts.length === 0 ? (
        <Card className="p-12 text-center text-slate-400">
          <Megaphone className="w-10 h-10 mx-auto text-slate-600 mb-3" />
          <p className="text-sm font-semibold">No active notices for faculty</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {alerts.map((a) => (
            <Card key={a.id} className="p-5 space-y-2">
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
                <span className="text-xs font-semibold text-slate-400">
                  Target: {a.target_role}
                </span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs text-slate-500">
                  {new Date(a.created_at).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-base font-bold text-white">{a.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{a.content}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
