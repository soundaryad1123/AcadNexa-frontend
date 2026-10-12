"use client";

import React, { useEffect, useState } from "react";
import { TimetableSlot } from "@/types";
import { getStudentTimetableApi } from "@/lib/api";
import { TimetableGrid } from "@/components/modules/timetable-grid";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentTimetablePage() {
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getStudentTimetableApi();
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
          Personalized Class & Lab Timetable
        </h2>
        <p className="text-xs text-muted-foreground">
          Combined weekly schedule for your enrolled core and elective subjects (STD-02)
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
