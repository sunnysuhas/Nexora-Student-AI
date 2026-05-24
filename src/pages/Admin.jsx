import { useEffect, useState } from "react";
import { BellRing, LineChart, Megaphone, Trash2, Users } from "lucide-react";
import { AppShell } from "../layouts/AppShell";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useAppStore } from "../store/useAppStore";

export function Admin() {
  const { adminUsers, adminOverview, deleteUser, loadAdminData, addNotification } = useAppStore();
  const [announcement, setAnnouncement] = useState("");
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;
    loadAdminData()
      .then(() => active && setStatus("ready"))
      .catch(() => active && setStatus("error"));
    return () => {
      active = false;
    };
  }, [loadAdminData]);

  const sendAnnouncement = () => {
    if (!announcement.trim()) return;
    addNotification({ title: "Admin announcement", body: announcement.trim(), type: "announcement", createdAt: new Date().toISOString() });
    setAnnouncement("");
  };

  return (
    <AppShell title="Admin Dashboard" eyebrow="Productivity Platform Admin">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          [Users, "Students", adminOverview?.users ?? 0],
          [LineChart, "Tasks", adminOverview?.tasks ?? 0],
          [BellRing, "Attendance Subjects", adminOverview?.attendance ?? 0],
          [Megaphone, "Alerts", adminOverview?.notifications ?? 0],
        ].map(([Icon, label, value]) => (
          <Card key={label}>
            <Icon className="mb-5 h-5 w-5 text-cyan-500" />
            <p className="text-sm text-slate-600 dark:text-slate-300">{label}</p>
            <p className="mt-2 font-display text-4xl font-bold">{value}</p>
          </Card>
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <h2 className="font-display text-2xl font-bold">Manage users</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Admin-only view for account management during the MVP phase.
          </p>
          {status === "loading" && <p className="mt-5 rounded-lg bg-cyan-400/10 p-4 text-sm font-semibold text-cyan-700 dark:text-cyan-300">Loading live admin data...</p>}
          {status === "error" && <p className="mt-5 rounded-lg bg-rose-400/10 p-4 text-sm font-semibold text-rose-700 dark:text-rose-300">Unable to load admin data from the API.</p>}
          <div className="mt-5 grid gap-3">
            {adminUsers.length ? (
              adminUsers.map((user) => (
                <div key={user.id} className="flex flex-col gap-3 rounded-lg bg-slate-950/5 p-4 dark:bg-white/10 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-bold">{user.name || user.profile?.fullName || user.email}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{user.email} / {user.role}</p>
                  </div>
                  <button type="button" onClick={() => deleteUser(user.id)} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-rose-400/15 px-3 text-sm font-bold text-rose-600 dark:text-rose-300">
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-slate-300/80 p-5 text-sm text-slate-600 dark:border-white/15 dark:text-slate-300">
                No student accounts have been registered in this environment yet.
              </div>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-2xl font-bold">Announcements</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Send platform notices, productivity updates, or emergency alerts to the in-app notification center.
          </p>
          <div className="mt-5 space-y-3">
            <Input value={announcement} onChange={(event) => setAnnouncement(event.target.value)} placeholder="Write an announcement..." />
            <Button type="button" onClick={sendAnnouncement} className="w-full">
              <Megaphone className="h-4 w-4" /> Send Announcement
            </Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
