"use client";

import React, { useEffect, useState } from "react";
import { TimetableSlot } from "@/types";
import { getAdminTimetablesApi } from "@/lib/api";
import { TimetableGrid } from "@/components/modules/timetable-grid";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminTimetablesPage() {
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTimetables() {
      try {
        setLoading(true);
        const data = await getAdminTimetablesApi();
        setSlots(data || []);
      } catch (err) {
        console.error("Failed to load timetables", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTimetables();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-heading font-extrabold text-white">
          Master Institutional Timetables
        </h2>
        <p className="text-xs text-muted-foreground">
          View, organize, and manage campus lecture halls, theory schedules, and lab sessions (ADM-04)
        </p>
      </div>

      {loading ? (
        <Skeleton className="h-96" />
      ) : (
        <TimetableGrid slots={slots} showInstructor={true} />
      )}
    </div>
  );
}
