"use client";

import React, { useEffect, useState } from "react";
import { getAuthToken, getAuthRole, clearAuthSession } from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";
import { GraduationCap } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRole: "ADMIN" | "FACULTY" | "STUDENT";
}

export function AuthGuard({ children, allowedRole }: AuthGuardProps) {
  const [authorized, setAuthorized] = useState<boolean>(false);

  useEffect(() => {
    // 1. Core token and role validation
    const checkAuth = () => {
      const token = getAuthToken();
      const role = getAuthRole();

      if (!token) {
        clearAuthSession();
        window.location.replace("/login");
        return false;
      }

      if (role && role.toUpperCase() !== allowedRole) {
        clearAuthSession();
        window.location.replace("/login");
        return false;
      }

      setAuthorized(true);
      return true;
    };

    checkAuth();

    // 2. BFCache & Back-Button Protection:
    // When the user clicks the browser 'Back' button after logout, modern browsers
    // restore the page from the Back-Forward Cache (BFCache). The 'pageshow' event
    // with persisted=true indicates a restored page.
    const handlePageShow = (event: PageTransitionEvent) => {
      const token = getAuthToken();
      if (event.persisted || !token) {
        setAuthorized(false);
        clearAuthSession();
        window.location.replace("/login");
      }
    };

    // 3. Multi-Tab Synchronized Logout:
    // If user signs out in any other tab, immediately terminate this session
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "acadnexa_token" && !event.newValue) {
        setAuthorized(false);
        clearAuthSession();
        window.location.replace("/login");
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [allowedRole]);

  // While validating credentials, do not display sensitive protected DOM
  if (!authorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-indigo-400 flex items-center justify-center text-white mb-4 animate-pulse">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
          <span>Verifying encrypted session...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
