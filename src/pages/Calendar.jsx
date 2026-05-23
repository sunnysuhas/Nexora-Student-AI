import { Bell, CalendarClock, Clock3 } from "lucide-react";
import { AppShell } from "../layouts/AppShell";
import { Card } from "../components/ui/Card";
import { calendarEvents } from "../data/mock";

export function Calendar() {
  const days = Array.from({ length: 30 }, (_, index) => index + 1);

  return (
    <AppShell title="Calendar" eyebrow="Schedule and Deadline Radar">
      <div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-300">May 2026</p>
              <h2 className="font-display text-2xl font-bold">Academic calendar</h2>
            </div>
            <CalendarClock className="h-6 w-6 text-cyan-500" />
          </div>
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            {["M", "T", "W", "T", "F", "S", "S"].map((day) => <span key={day}>{day}</span>)}
          </div>
          <div className="mt-3 grid grid-cols-7 gap-2">
            {days.map((day) => {
              const event = calendarEvents.find((item) => item.date === day);
              return (
                <div
                  key={day}
                  className="min-h-24 rounded-lg border border-slate-300/60 bg-white/50 p-2 transition hover:border-cyan-400 dark:border-white/10 dark:!bg-slate-950/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">{day}</span>
                    {event && <span className={`h-2 w-2 rounded-full ${event.color}`} />}
                  </div>
                  {event && <p className="mt-3 text-xs font-semibold leading-5">{event.label}</p>}
                </div>
              );
            })}
          </div>
        </Card>

        <div className="grid gap-4">
          <Card>
            <h3 className="font-display text-xl font-bold">Exam countdown</h3>
            <div className="mt-5 space-y-3">
              {[
                ["AI Quiz", "3 days"],
                ["Math Exam", "12 days"],
                ["Project Review", "18 days"],
              ].map(([label, time]) => (
                <div key={label} className="flex items-center justify-between rounded-lg bg-slate-950/5 p-4 dark:!bg-slate-950/50">
                  <span className="font-semibold">{label}</span>
                  <span className="text-sm font-bold text-cyan-600 dark:text-cyan-300">{time}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h3 className="font-display text-xl font-bold">Smart reminders</h3>
            <div className="mt-5 space-y-3 text-sm text-slate-700 dark:text-slate-300">
              {["Assignment buffer: 2 hours before deadline", "Attendance reminder: DBMS lecture at 9 AM", "Study schedule: AI revision tonight"].map((item) => (
                <p key={item} className="flex gap-3 rounded-lg bg-slate-950/5 p-3 dark:!bg-slate-950/50">
                  <Bell className="h-4 w-4 shrink-0 text-cyan-500" />
                  {item}
                </p>
              ))}
            </div>
          </Card>
          <Card>
            <h3 className="font-display text-xl font-bold">Study scheduling</h3>
            <div className="mt-5 flex items-center gap-4 rounded-lg bg-gradient-to-r from-cyan-400/15 to-violet-500/15 p-4">
              <Clock3 className="h-8 w-8 text-violet-500" />
              <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">Tonight is best for one 90-minute focus block and one 20-minute recap.</p>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
