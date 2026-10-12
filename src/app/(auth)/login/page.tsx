"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Lock, Mail, Building2, ArrowRight } from "lucide-react";
import { loginApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("aarav.sharma@aitm.edu.in");
  const [password, setPassword] = useState("Student@123");
  const [collegeSlug, setCollegeSlug] = useState("apex-tech");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await loginApi({ email, password, college_slug: collegeSlug });
      if (res.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (res.role === "FACULTY") {
        router.push("/faculty/dashboard");
      } else if (res.role === "STUDENT") {
        router.push("/student/dashboard");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err?.message || "Invalid credentials. Please verify your email and password.");
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (role: "ADMIN" | "FACULTY" | "STUDENT") => {
    if (role === "ADMIN") {
      setEmail("admin@aitm.edu.in");
      setPassword("Admin@2026");
    } else if (role === "FACULTY") {
      setEmail("priya.sharma@aitm.edu.in");
      setPassword("Faculty@123");
    } else if (role === "STUDENT") {
      setEmail("aarav.sharma@aitm.edu.in");
      setPassword("Student@123");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-950 via-[#0B101E] to-indigo-950/40 relative overflow-hidden">
      {/* Ambient background glow circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Branding Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-indigo-400 flex items-center justify-center text-white mx-auto shadow-xl shadow-primary/30 mb-4 glow">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-white tracking-tight">
            AcadNexa
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise Multi-Tenant Campus Management System
          </p>
        </div>

        {/* Login Card */}
        <Card className="p-8 glass-card border border-border shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs">
                {error}
              </div>
            )}

            {/* Institution Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-primary-400" />
                <span>Select Institution / College</span>
              </label>
              <select
                value={collegeSlug}
                onChange={(e) => setCollegeSlug(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-border bg-slate-900 text-xs text-white focus:outline-none focus:border-primary"
              >
                <option value="apex-tech">Apex Institute of Technology (AITM)</option>
                <option value="horizon-univ">National Horizon University (NHU)</option>
              </select>
            </div>

            {/* Email Field */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-primary-400" />
                <span>Campus Email Address</span>
              </label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@aitm.edu.in"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-primary-400" />
                <span>Password</span>
              </label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 text-sm font-semibold mt-2"
            >
              {loading ? "Authenticating..." : "Sign In to Portal"}
              {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </form>

          {/* Quick Demo Logins Pill Strip */}
          <div className="mt-6 pt-5 border-t border-border">
            <p className="text-[11px] font-semibold text-slate-400 text-center uppercase tracking-wider mb-2.5">
              1-Click Demo Credentials
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDemoCredentials("ADMIN")}
                className="py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-border text-[11px] font-medium text-slate-300 text-center transition-colors"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials("FACULTY")}
                className="py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-border text-[11px] font-medium text-slate-300 text-center transition-colors"
              >
                Faculty
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials("STUDENT")}
                className="py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-border text-[11px] font-medium text-slate-300 text-center transition-colors"
              >
                Student
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
