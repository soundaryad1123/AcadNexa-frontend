"use client";

import React, { useState } from "react";
import { TimetableSlot } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatTime } from "@/lib/utils";
import { Clock, MapPin, User, BookOpen } from "lucide-react";

interface TimetableGridProps {
  slots: TimetableSlot[];
  showInstructor?: boolean;
}

const DAYS = [
  { id: 1, name: "Monday" },
  { id: 2, name: "Tuesday" },
  { id: 3, name: "Wednesday" },
  { id: 4, name: "Thursday" },
  { id: 5, name: "Friday" },
  { id: 6, name: "Saturday" },
];

export function TimetableGrid({ slots, showInstructor = true }: TimetableGridProps) {
  const [selectedDay, setSelectedDay] = useState(1);

  const daySlots = slots
    .filter((s) => s.day_of_week === selectedDay)
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  return (
    <div className="space-y-6">
      {/* Day Selector Buttons */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-border">
        {DAYS.map((day) => {
          const count = slots.filter((s) => s.day_of_week === day.id).length;
          const isSelected = selectedDay === day.id;

          return (
            <button
              key={day.id}
              onClick={() => setSelectedDay(day.id)}
              className={`flex-1 min-w-[100px] py-2.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                isSelected
                  ? "bg-primary text-white shadow-md shadow-primary/25 glow"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <span>{day.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Slots List for Selected Day */}
      {daySlots.length === 0 ? (
        <Card className="p-12 text-center text-slate-400">
          <Clock className="w-10 h-10 mx-auto text-slate-600 mb-3" />
          <p className="text-sm font-medium">No sessions scheduled for this day</p>
          <p className="text-xs text-slate-500 mt-1">Enjoy your study break or lab preparation</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {daySlots.map((slot) => {
            const isLab = slot.session_type === "LAB";

            return (
              <Card
                key={slot.id}
                className="p-5 relative overflow-hidden glass-card-hover flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant={isLab ? "purple" : "indigo"}>
                      {slot.session_type}
                    </Badge>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-primary-400" />
                      <span>
                        {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-xs font-mono font-bold text-primary-400">
                      {slot.course_code}
                    </span>
                    <h4 className="text-base font-heading font-bold text-white mt-0.5">
                      {slot.course_name}
                    </h4>
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                  {showInstructor && slot.faculty_name ? (
                    <div className="flex items-center gap-1.5 text-slate-300 truncate max-w-[160px]">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{slot.faculty_name}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Section {slot.section}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-border text-slate-200 font-mono text-xs">
                    <MapPin className="w-3 h-3 text-primary-400" />
                    <span>{slot.room_number}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
