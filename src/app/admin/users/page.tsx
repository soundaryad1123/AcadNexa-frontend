"use client";

import React, { useEffect, useState } from "react";
import { User, Role } from "@/types";
import { getAdminUsersApi } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { OnboardingModal } from "@/components/modules/onboarding-modal";
import { Users, Plus, Search, Filter } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = roleFilter !== "ALL" ? { role: roleFilter } : undefined;
      const data = await getAdminUsersApi(params);
      setUsers(data || []);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-white">
            Campus User Directory
          </h2>
          <p className="text-xs text-muted-foreground">
            Onboard, inspect, and manage university students, faculty members, and admins (ADM-01)
          </p>
        </div>
        <Button onClick={() => setOnboardingOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>Onboard New User</span>
        </Button>
      </div>

      {/* Filter and Search Toolbar */}
      <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="pl-9 h-9 text-xs"
          />
        </div>

        {/* Role Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-border w-full sm:w-auto">
          {["ALL", "STUDENT", "FACULTY", "ADMIN"].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                roleFilter === r
                  ? "bg-primary text-white shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </Card>

      {/* User Data Table */}
      {loading ? (
        <Skeleton className="h-96" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User Full Name</TableHead>
              <TableHead>Email Address</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-slate-400">
                  No users found matching your search criteria
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-semibold text-white">
                    {u.full_name}
                  </TableCell>
                  <TableCell className="font-mono text-slate-300 text-xs">
                    {u.email}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        u.role === "STUDENT"
                          ? "emerald"
                          : u.role === "FACULTY"
                          ? "indigo"
                          : "secondary"
                      }
                    >
                      {u.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-300">
                    {u.department_name || "Institutional"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={u.status === "active" ? "emerald" : "destructive"}>
                      {u.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-400 text-xs">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString() : "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      {/* Onboarding Modal */}
      <OnboardingModal
        open={onboardingOpen}
        onOpenChange={setOnboardingOpen}
        onSuccess={fetchUsers}
      />
    </div>
  );
}
