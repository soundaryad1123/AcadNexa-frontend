"use client";

import React, { useEffect, useState } from "react";
import { TimetableSlot } from "@/types";
import { getFacultyTimetableApi } from "@/lib/api";
import { TimetableGrid } from "@/components/modules/timetable-grid";
import { Skeleton } from "@/components/ui/skeleton";

export default function FacultyTimetablePage() {
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getFacultyTimetableApi();
        setSlots(data || []);
      } catch (err) {
        console.error("Failed to load timetable", err);
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
          Personal Teaching Schedule
        </h2>
        <p className="text-xs text-muted-foreground">
          Weekly timetable schedule for assigned lectures and laboratory practicals (FAC-04)
        </p>
      </div>

      {loading ? (
        <Skeleton className="h-96" />
      ) : (
        <TimetableGrid slots={slots} showInstructor={false} />
      )}
    </div>
  );
}
