"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/shared/sidebar";
import { Topbar } from "@/components/shared/topbar";
import { UserProfile } from "@/types";
import { getMeApi } from "@/lib/api";

export default function FacultyLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    getMeApi()
      .then((data) => setUser(data))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex antialiased bg-background text-foreground">
      <Sidebar
        role="FACULTY"
        userName={user?.full_name || "Faculty Member"}
        userIdentifier={user?.employee_code || "FAC-CSE-001"}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Topbar
          userName={user?.full_name || "Faculty Member"}
          roleName={user?.designation || "Associate Professor"}
        />
        <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
