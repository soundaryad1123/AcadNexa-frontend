"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const rawUser = typeof window !== "undefined" ? localStorage.getItem("acadnexa_user") : null;
    if (rawUser) {
      try {
        const user = JSON.parse(rawUser);
        if (user.role === "ADMIN") {
          router.replace("/admin/dashboard");
          return;
        } else if (user.role === "FACULTY") {
          router.replace("/faculty/dashboard");
          return;
        } else if (user.role === "STUDENT") {
          router.replace("/student/dashboard");
          return;
        }
      } catch (e) {
        // Fallback to login
      }
    }
    router.replace("/login");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-medium">Redirecting to AcadNexa Portal...</p>
      </div>
    </div>
  );
}
