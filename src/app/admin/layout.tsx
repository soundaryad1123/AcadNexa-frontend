"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/shared/sidebar";
import { Topbar } from "@/components/shared/topbar";
import { AuthGuard } from "@/components/shared/auth-guard";
import { UserProfile } from "@/types";
import { getMeApi } from "@/lib/api";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    getMeApi()
      .then((data) => setUser(data))
      .catch(() => {});
  }, []);

  return (
    <AuthGuard allowedRole="ADMIN">
      <div className="min-h-screen flex antialiased bg-background text-foreground">
        <Sidebar
          role="ADMIN"
          userName={user?.full_name || "Admin User"}
          userIdentifier={user?.email || "admin@aitm.edu.in"}
        />
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <Topbar
            userName={user?.full_name || "Admin User"}
            roleName="College Administrator"
          />
          <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
