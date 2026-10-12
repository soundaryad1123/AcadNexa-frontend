"use client";

import React, { useEffect, useState } from "react";
import { Announcement } from "@/types";
import { getAdminAlertsApi, createAdminAlertApi, deleteAdminAlertApi } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Megaphone, Plus, Trash2 } from "lucide-react";

export default function AdminAlertsPage() {
  const [alerts, setAlerts] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("GENERAL");
  const [targetRole, setTargetRole] = useState("ALL");
  const [priority, setPriority] = useState("NORMAL");
  const [submitting, setSubmitting] = useState(false);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const data = await getAdminAlertsApi();
      setAlerts(data || []);
    } catch (err) {
      console.error("Failed to load alerts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createAdminAlertApi({
        title,
        content,
        category,
        target_role: targetRole,
        priority,
      });
      setTitle("");
      setContent("");
      setModalOpen(false);
      fetchAlerts();
    } catch (err) {
      console.error("Failed to publish alert", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAdminAlertApi(id);
      fetchAlerts();
    } catch (err) {
      console.error("Failed to delete alert", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-white">
            Campus Announcements & Alerts
          </h2>
          <p className="text-xs text-muted-foreground">
            Publish and manage campus-wide or role-targeted broadcasts (ADM-03)
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>New Broadcast</span>
        </Button>
      </div>

      {/* Broadcasts List */}
      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      ) : alerts.length === 0 ? (
        <Card className="p-12 text-center text-slate-400">
          <Megaphone className="w-10 h-10 mx-auto text-slate-600 mb-3" />
          <p className="text-sm font-semibold">No active announcements</p>
          <p className="text-xs text-slate-500 mt-1">Publish an alert to notify students and faculty</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {alerts.map((a) => (
            <Card key={a.id} className="p-5 flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      a.priority === "URGENT" || a.priority === "HIGH"
                        ? "destructive"
                        : "indigo"
                    }
                  >
                    {a.priority}
                  </Badge>
                  <span className="text-xs font-semibold text-slate-400">
                    Target: {a.target_role}
                  </span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-slate-500">
                    {new Date(a.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">{a.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{a.content}</p>
              </div>
              <button
                onClick={() => handleDelete(a.id)}
                className="text-slate-500 hover:text-rose-400 p-2 rounded-lg hover:bg-slate-900 transition-colors"
                title="Archive Broadcast"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </Card>
          ))}
        </div>
      )}

      {/* Publish Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <form onSubmit={handleCreate}>
          <DialogHeader>
            <DialogTitle>Publish New Announcement</DialogTitle>
            <DialogDescription>
              Broadcast notices to students, faculty members, or the entire campus.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Notice Title
              </label>
              <Input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Campus Holiday or Exam Schedule Update"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Target Role
                </label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-border bg-slate-900 text-xs text-white"
                >
                  <option value="ALL">All (Entire Campus)</option>
                  <option value="STUDENT">Students Only</option>
                  <option value="FACULTY">Faculty Only</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Priority Level
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-border bg-slate-900 text-xs text-white"
                >
                  <option value="NORMAL">Normal</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Message Content
              </label>
              <textarea
                required
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write the full announcement message here..."
                className="w-full rounded-xl border border-border bg-slate-900 p-3 text-xs text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Publishing..." : "Publish Broadcast"}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}
