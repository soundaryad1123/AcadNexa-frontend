"use client";

import React, { useState } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createAdminUserApi } from "@/lib/api";

interface OnboardingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function OnboardingModal({ open, onOpenChange, onSuccess }: OnboardingModalProps) {
  const [role, setRole] = useState<"STUDENT" | "FACULTY" | "ADMIN">("STUDENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("Password@123");
  const [phone, setPhone] = useState("");

  // Student Fields
  const [rollNumber, setRollNumber] = useState("");
  const [regNo, setRegNo] = useState("");
  const [semester, setSemester] = useState(1);
  const [section, setSection] = useState("A");

  // Faculty Fields
  const [employeeCode, setEmployeeCode] = useState("");
  const [designation, setDesignation] = useState("Assistant Professor");
  const [qualification, setQualification] = useState("M.Tech / Ph.D");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload: Record<string, any> = {
        full_name: fullName,
        email,
        password,
        phone_number: phone || null,
        role,
        status: "active",
      };

      if (role === "STUDENT") {
        payload.roll_number = rollNumber;
        payload.registration_no = regNo;
        payload.current_semester = Number(semester);
        payload.current_year = Math.ceil(Number(semester) / 2);
        payload.section = section;
      } else if (role === "FACULTY") {
        payload.employee_code = employeeCode;
        payload.designation = designation;
        payload.qualification = qualification;
      }

      await createAdminUserApi(payload);
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      setError(err?.message || "Failed to onboard user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>Onboard New Campus User</DialogTitle>
          <DialogDescription>
            Register students, professors, or administrators to your institutional directory.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <Tabs
          value={role}
          onValueChange={(val) => setRole(val as any)}
          className="mb-4"
        >
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="STUDENT">Student</TabsTrigger>
            <TabsTrigger value="FACULTY">Faculty</TabsTrigger>
            <TabsTrigger value="ADMIN">Admin</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
            <Input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Aarav Sharma"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@aitm.edu.in"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Default Password</label>
              <Input
                type="text"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Phone Number (Optional)</label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98450 00000"
            />
          </div>

          {role === "STUDENT" && (
            <div className="pt-2 border-t border-border space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Roll Number</label>
                  <Input
                    required
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    placeholder="1AT23CS001"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Registration No</label>
                  <Input
                    required
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    placeholder="REG2023CSE001"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Semester</label>
                  <Input
                    type="number"
                    min={1}
                    max={12}
                    required
                    value={semester}
                    onChange={(e) => setSemester(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Section</label>
                  <Input
                    required
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    placeholder="A"
                  />
                </div>
              </div>
            </div>
          )}

          {role === "FACULTY" && (
            <div className="pt-2 border-t border-border space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Employee Code</label>
                  <Input
                    required
                    value={employeeCode}
                    onChange={(e) => setEmployeeCode(e.target.value)}
                    placeholder="FAC-CSE-001"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Designation</label>
                  <Input
                    required
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="Associate Professor"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Qualification</label>
                <Input
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  placeholder="Ph.D. in Computer Science"
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Onboarding..." : "Onboard User"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
