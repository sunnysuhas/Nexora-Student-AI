import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, CalendarCheck, CheckCircle2, Flame } from "lucide-react";
import { AppShell } from "../layouts/AppShell";
import { Card } from "../components/ui/Card";
import { StatCard } from "../components/StatCard";
import { useAppStore } from "../store/useAppStore";
import { assignmentStatus, attendancePercent, completedCount, overallAttendance, productivityScore, taskStatus } from "../utils/productivity";

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function Analytics() {
  const { tasks, assignments, subjects, goals } = useAppStore();
  const completedTasks = completedCount(tasks, taskStatus);
  const completedAssignments = completedCount(assignments, assignmentStatus);
  const score = productivityScore({ tasks, assignments, subjects, goals });
  const taskCompletionRate = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;
  const assignmentCompletionRate = assignments.length ? Math.round((completedAssignments / assignments.length) * 100) : 0;

  const weeklyTasks = dayLabels.map((day, index) => ({
    day,
    completed: tasks.filter((task) => taskStatus(task) === "Completed" && new Date(task.updatedAt || task.createdAt || Date.now()).getDay() === index).length,
    created: tasks.filter((task) => new Date(task.createdAt || Date.now()).getDay() === index).length,
  }));

  const attendanceData = subjects.map((subject) => ({
    subject: subject.name || subject.subject,
    attendance: attendancePercent(subject),
    goal: Number(subject.goal || 85),
  }));

  const goalData = goals.map((goal) => ({
    name: goal.title,
    progress: Math.min(100, Math.round(((Number(goal.current) || 0) / (Number(goal.target) || 1)) * 100)),
  }));

  return (
    <AppShell title="Analytics" eyebrow="Real Student Productivity Signals">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Productivity" value={`${score}%`} detail="from tasks, attendance, assignments, goals" icon={Activity} />
        <StatCard label="Task Completion" value={`${taskCompletionRate}%`} detail={`${completedTasks}/${tasks.length} completed`} icon={CheckCircle2} tone="emerald" />
        <StatCard label="Attendance" value={`${overallAttendance(subjects)}%`} detail={`${subjects.length} subjects tracked`} icon={CalendarCheck} tone="violet" />
        <StatCard label="Assignment Completion" value={`${assignmentCompletionRate}%`} detail={`${completedAssignments}/${assignments.length} completed`} icon={Flame} tone="amber" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="h-96">
          <h2 className="mb-4 font-display text-2xl font-bold">Weekly task completion</h2>
          {tasks.length ? (
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={weeklyTasks}>
                <CartesianGrid stroke="currentColor" opacity={0.08} />
                <XAxis dataKey="day" stroke="currentColor" opacity={0.5} />
                <YAxis stroke="currentColor" opacity={0.35} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "0", background: "#0F172A", color: "#fff" }} />
                <Bar dataKey="created" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="completed" fill="#00D9FF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart message="Complete tasks to build weekly productivity analytics." />
          )}
        </Card>
        <Card className="h-96">
          <h2 className="mb-4 font-display text-2xl font-bold">Attendance trends</h2>
          {attendanceData.length ? (
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={attendanceData}>
                <CartesianGrid stroke="currentColor" opacity={0.08} />
                <XAxis dataKey="subject" stroke="currentColor" opacity={0.5} />
                <YAxis stroke="currentColor" opacity={0.35} domain={[0, 100]} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "0", background: "#0F172A", color: "#fff" }} />
                <Line type="monotone" dataKey="attendance" stroke="#00D9FF" strokeWidth={3} />
                <Line type="monotone" dataKey="goal" stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart message="Add subjects and mark attendance to unlock trend analysis." />
          )}
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[0.75fr_1.25fr]">
        <Card className="h-80">
          <h2 className="mb-4 font-display text-2xl font-bold">Goal progress</h2>
          {goalData.length ? (
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie data={goalData} dataKey="progress" nameKey="name" innerRadius={55} outerRadius={95} fill="#06B6D4" label />
                <Tooltip contentStyle={{ borderRadius: 8, border: "0", background: "#0F172A", color: "#fff" }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart message="Set study goals to track progress." />
          )}
        </Card>
        <Card>
          <h2 className="font-display text-2xl font-bold">Productivity consistency</h2>
          <div className="mt-6 grid gap-3">
            {[
              ["Pending tasks", tasks.filter((task) => taskStatus(task) === "Pending").length],
              ["In-progress tasks", tasks.filter((task) => taskStatus(task) === "In Progress").length],
              ["Overdue tasks", tasks.filter((task) => taskStatus(task) === "Overdue").length],
              ["Overdue assignments", assignments.filter((assignment) => assignmentStatus(assignment) === "Overdue").length],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-lg bg-slate-950/5 p-4 text-sm font-semibold dark:bg-white/10">
                <span>{label}</span>
                <span className="font-display text-2xl font-bold text-cyan-600 dark:text-cyan-300">{value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

function EmptyChart({ message }) {
  return (
    <div className="grid h-[85%] place-items-center rounded-lg border border-dashed border-slate-300/80 text-center text-sm text-slate-500 dark:border-white/15 dark:text-slate-400">
      {message}
    </div>
  );
}
