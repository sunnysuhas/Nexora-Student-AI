import { Activity, CalendarCheck, CheckCircle2, Clock, GraduationCap, Target, TrendingUp, Zap } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AppShell } from "../layouts/AppShell";
import { Card } from "../components/ui/Card";
import { StatCard } from "../components/StatCard";
import { PomodoroTimer } from "../components/PomodoroTimer";
import { deadlines, recommendations, weeklyProductivity } from "../data/mock";

export function Dashboard() {
  return (
    <AppShell title="Dashboard" eyebrow="Academic Command Center">
      <Card className="mb-4 overflow-hidden">
        <div className="relative grid gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-300">Welcome back, Suhas</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-balance">Your academic operating system is synced for today's study flow.</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              Nexora is tracking productivity, attendance risk, deadlines, habits, focus time, and AI recommendations in one workspace.
            </p>
          </div>
          <div className="grid min-w-52 place-items-center rounded-lg bg-gradient-to-br from-cyan-400/20 to-violet-500/20 p-5 text-center">
            <Target className="mb-3 h-7 w-7 text-cyan-500" />
            <p className="font-display text-3xl font-bold">7.8/10</p>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Study readiness</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Productivity Score" value="92%" detail="+12% this week" icon={Zap} />
        <StatCard label="Attendance" value="86%" detail="DBMS needs attention" icon={CalendarCheck} tone="violet" />
        <StatCard label="Tasks Completed" value="31" detail="8 ahead of pace" icon={CheckCircle2} tone="emerald" />
        <StatCard label="Focus Hours" value="24.6" detail="+4.2h this week" icon={Clock} tone="amber" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <Card className="min-h-96">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-300">Weekly productivity</p>
              <h2 className="font-display text-2xl font-bold">Focus and task velocity</h2>
            </div>
            <TrendingUp className="h-6 w-6 text-emerald-500" />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyProductivity}>
                <XAxis dataKey="day" stroke="currentColor" opacity={0.5} />
                <YAxis stroke="currentColor" opacity={0.35} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "0", background: "#0F172A", color: "#fff" }} />
                <Bar dataKey="tasks" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="focus" fill="#00D9FF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <PomodoroTimer />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card>
          <h3 className="font-display text-xl font-bold">Upcoming deadlines</h3>
          <div className="mt-5 space-y-3">
            {deadlines.map((item) => (
              <div key={item.title} className="rounded-lg border border-slate-300/60 bg-white/50 p-4 dark:border-white/10 dark:!bg-slate-950/50">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{item.title}</p>
                  <span className="rounded-full bg-cyan-400/15 px-2 py-1 text-xs font-bold text-cyan-600 dark:text-cyan-300">{item.type}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.due}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-display text-xl font-bold">Goal progress</h3>
          <div className="mt-6 space-y-5">
            {[
              ["Semester GPA target", 76],
              ["Assignment streak", 88],
              ["Habit consistency", 64],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="mb-2 flex justify-between text-sm font-semibold">
                  <span>{label}</span>
                  <span>{value}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200 dark:bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-display text-xl font-bold">Habit tracker</h3>
          <div className="mt-5 grid grid-cols-7 gap-2">
            {Array.from({ length: 21 }, (_, index) => (
              <span
                key={index}
                className={`aspect-square rounded-md ${index % 5 === 0 ? "bg-violet-400/30" : "bg-cyan-400/25"} shadow-sm`}
              />
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">21-day consistency map for revision, hydration, and focused study starts.</p>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-3">
          <h3 className="font-display text-xl font-bold">Smart reminders and AI recommendations</h3>
          <div className="mt-5 space-y-3">
            {recommendations.map((item) => (
              <div key={item} className="flex gap-3 rounded-lg bg-slate-950/5 p-3 dark:!bg-slate-950/50">
                <Activity className="mt-0.5 h-4 w-4 shrink-0 text-cyan-500" />
                <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{item}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="font-display text-xl font-bold">Attendance tracking</h3>
          <div className="mt-5 grid gap-3">
            {["Artificial Intelligence", "DBMS", "Operating Systems", "Mathematics"].map((subject, index) => {
              const value = [92, 74, 88, 81][index];
              return (
                <div key={subject} className="flex items-center gap-4">
                  <GraduationCap className="h-5 w-5 text-cyan-500" />
                  <div className="flex-1">
                    <div className="mb-1 flex justify-between text-sm font-semibold"><span>{subject}</span><span>{value}%</span></div>
                    <div className="h-2 rounded-full bg-slate-200 dark:bg-white/10"><div className="h-full rounded-full bg-cyan-400" style={{ width: `${value}%` }} /></div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
        <Card>
          <h3 className="font-display text-xl font-bold">Exam countdown</h3>
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            {[
              ["AI Midterm", "02", "days"],
              ["Math Finals", "14", "days"],
              ["Project Viva", "21", "days"],
            ].map(([label, value, unit]) => (
              <div key={label} className="rounded-lg bg-slate-950/5 p-4 dark:!bg-slate-950/50">
                <p className="font-display text-4xl font-bold text-cyan-600 dark:text-cyan-300">{value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">{unit}</p>
                <p className="mt-3 text-sm font-semibold">{label}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
