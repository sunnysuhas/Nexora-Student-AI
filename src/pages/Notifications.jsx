import { CheckCheck, Trash2 } from "lucide-react";
import { AppShell } from "../layouts/AppShell";
import { Card } from "../components/ui/Card";
import { useAppStore } from "../store/useAppStore";

export function Notifications() {
  const { notificationsList, markNotificationRead, deleteNotification } = useAppStore();

  return (
    <AppShell title="Notifications" eyebrow="In-app Alerts">
      <div className="grid gap-3">
        {!notificationsList.length && (
          <Card>
            <h2 className="font-display text-xl font-bold">No notifications yet</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Task reminders, attendance warnings, exam alerts, and productivity suggestions will appear here.
            </p>
          </Card>
        )}
        {notificationsList.map((notification) => (
          <Card key={notification.id} className={notification.read ? "opacity-75" : "border-cyan-400/40"}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-bold text-cyan-700 dark:text-cyan-300">{notification.type}</span>
                <span className="ml-2 rounded-full bg-slate-950/5 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                  {notification.priority || "Low"} priority
                </span>
                <h2 className="mt-4 font-display text-xl font-bold">{notification.title}</h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{notification.body}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => markNotificationRead(notification.id)} className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-400/15 text-emerald-600 dark:text-emerald-300">
                  <CheckCheck className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => deleteNotification(notification.id)} className="grid h-10 w-10 place-items-center rounded-lg bg-rose-400/15 text-rose-600 dark:text-rose-300">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
