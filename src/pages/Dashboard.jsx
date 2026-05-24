import { useNavigate } from "react-router-dom";
import { Activity, BellRing, Bot, CalendarCheck, CheckCircle2, Clock, GraduationCap, Plus, Target, TimerReset } from "lucide-react";
import { AppShell } from "../layouts/AppShell";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { PomodoroTimer } from "../components/PomodoroTimer";
import { useAppStore } from "../store/useAppStore";
import { attendancePercent, daysUntil, greetingFor, overallAttendance, productivityScore, taskStatus } from "../utils/productivity";

export function Dashboard() {
  const navigate = useNavigate();
  const { profile, tasks, assignments, subjects, exams, goals, notificationsList, widgets, toggleWidget } = useAppStore();
  const today = new Date().toISOString().slice(0, 10);
  const todaysTasks = tasks
    .filter((task) => task.deadline === today || task.dueDate === today || taskStatus(task) !== "Completed")
    .sort((a, b) => priorityWeight(b.priority) - priorityWeight(a.priority))
    .slice(0, 5);
  const attendanceWarnings = subjects
    .map((subject) => ({ ...subject, percent: attendancePercent(subject) }))
    .filter((subject) => subject.percent < Number(profile.attendanceGoal || 85));
  const upcomingExams = exams.map((exam) => ({ ...exam, remaining: daysUntil(exam.date) })).sort((a, b) => a.remaining - b.remaining).slice(0, 3);
  const upcomingAssignments = assignments
    .map((assignment) => ({ ...assignment, remaining: daysUntil(assignment.dueDate) }))
    .sort((a, b) => a.remaining - b.remaining)
    .slice(0, 3);
  const score = productivityScore({ tasks, assignments, subjects, goals });
  const completedTasks = tasks.filter((task) => taskStatus(task) === "Completed").length;
  const hasWorkspaceData = tasks.length || assignments.length || subjects.length || exams.length || goals.length || notificationsList.length;

  const aiSuggestions = buildSuggestions({ tasks, assignments: upcomingAssignments, attendanceWarnings, exams: upcomingExams, profile });

  return (
    <AppShell title="Dashboard" eyebrow="Student Planning Dashboard">
      <Card className="mb-4 overflow-hidden">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-300">{greetingFor()}, {profile.fullName || "Student"}</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-balance">Plan today from your own academic data.</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              Your dashboard only uses your saved tasks, assignments, attendance, exams, goals, reminders, and AI planning context.
            </p>
          </div>
          <div className="grid min-w-52 place-items-center rounded-lg bg-gradient-to-br from-cyan-400/20 to-violet-500/20 p-5 text-center">
            <Target className="mb-3 h-7 w-7 text-cyan-500" />
            <p className="font-display text-3xl font-bold">{score}%</p>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Live score</p>
          </div>
        </div>
      </Card>

      {!hasWorkspaceData && (
        <Card className="mb-4">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h3 className="font-display text-2xl font-bold">Start with one real academic item.</h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                Nexora is empty by design until you add your own data. Create a task, subject, assignment, or exam to activate planning suggestions.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button type="button" onClick={() => navigate("/tasks")}><Plus className="h-4 w-4" /> Add Task</Button>
              <Button type="button" variant="secondary" onClick={() => navigate("/attendance")}>Add Subject</Button>
            </div>
          </div>
        </Card>
      )}

      <Card className="mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-2 text-sm font-bold text-slate-600 dark:text-slate-300">Show widgets</span>
          {Object.entries(widgets).map(([key, enabled]) => (
            <button
              key={key}
              type="button"
              onClick={() => toggleWidget(key)}
              className={`rounded-full px-3 py-1 text-xs font-bold capitalize transition ${
                enabled ? "bg-cyan-400/15 text-cyan-700 dark:text-cyan-300" : "bg-slate-950/5 text-slate-500 dark:bg-white/10"
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={CheckCircle2} label="Tasks Completed" value={`${completedTasks}/${tasks.length}`} />
        <Metric icon={CalendarCheck} label="Attendance" value={`${overallAttendance(subjects)}%`} />
        <Metric icon={Clock} label="Upcoming Exams" value={upcomingExams.length} />
        <Metric icon={Target} label="Goals Active" value={goals.length} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        {widgets.today && (
          <Card>
            <SectionTitle icon={CheckCircle2} title="Today's Tasks" action="Tasks" onClick={() => navigate("/tasks")} />
            <div className="mt-5 grid gap-3">
              {todaysTasks.length ? (
                todaysTasks.map((task) => (
                  <div key={task.id} className="rounded-lg border border-slate-300/60 bg-white/50 p-4 dark:border-white/10 dark:!bg-slate-950/50">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-semibold">{task.title}</p>
                      <span className="rounded-full bg-cyan-400/15 px-2 py-1 text-xs font-bold text-cyan-700 dark:text-cyan-300">{task.priority || "Medium"}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                      {task.subject || "General"} / {taskStatus(task)} {task.deadline ? `- due ${String(task.deadline).slice(0, 10)}` : ""}
                    </p>
                  </div>
                ))
              ) : (
                <EmptyState title="Create your first task" body="Add deadlines, subtasks, and priorities so Nexora can plan your day." action="Add Task" onClick={() => navigate("/tasks")} />
              )}
            </div>
          </Card>
        )}

        {widgets.attendance && (
          <Card>
            <SectionTitle icon={GraduationCap} title="Attendance Warnings" action="Attendance" onClick={() => navigate("/attendance")} />
            <div className="mt-5 grid gap-3">
              {attendanceWarnings.length ? (
                attendanceWarnings.map((subject) => (
                  <div key={subject.id} className="rounded-lg bg-amber-400/10 p-4">
                    <div className="mb-2 flex justify-between text-sm font-semibold">
                      <span>{subject.name}</span>
                      <span>{subject.percent}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 dark:bg-white/10">
                      <div className="h-full rounded-full bg-amber-400" style={{ width: `${subject.percent}%` }} />
                    </div>
                    <p className="mt-2 text-xs font-semibold text-amber-700 dark:text-amber-200">Below your {profile.attendanceGoal || 85}% goal</p>
                  </div>
                ))
              ) : subjects.length ? (
                <EmptyState title="No attendance risks" body="Your tracked subjects are currently above the configured goal." />
              ) : (
                <EmptyState title="Add your first subject" body="Track present, absent, and holiday entries to unlock shortage warnings." action="Add Subject" onClick={() => navigate("/attendance")} />
              )}
            </div>
          </Card>
        )}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {widgets.exams && (
          <Card>
            <SectionTitle icon={Clock} title="Upcoming Exams" action="Calendar" onClick={() => navigate("/calendar")} />
            <div className="mt-5 grid gap-3">
              {upcomingExams.length ? (
                upcomingExams.map((exam) => (
                  <div key={exam.id} className="rounded-lg bg-slate-950/5 p-4 dark:bg-white/10">
                    <p className="font-display text-3xl font-bold text-cyan-600 dark:text-cyan-300">{Math.max(0, exam.remaining)} days</p>
                    <p className="mt-2 font-semibold">{exam.title}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{exam.subject}</p>
                  </div>
                ))
              ) : (
                <EmptyState title="Schedule your first exam" body="Exam countdowns will appear here and feed AI planning." action="Add Exam" onClick={() => navigate("/calendar")} />
              )}
            </div>
          </Card>
        )}

        {widgets.reminders && (
          <Card>
            <SectionTitle icon={BellRing} title="Reminders" action="Alerts" onClick={() => navigate("/notifications")} />
            <div className="mt-5 grid gap-3">
              {notificationsList.length ? (
                notificationsList.slice(0, 4).map((item) => (
                  <div key={item.id} className="flex gap-3 rounded-lg bg-slate-950/5 p-3 dark:bg-white/10">
                    <Activity className="mt-0.5 h-4 w-4 shrink-0 text-cyan-500" />
                    <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{item.body}</p>
                  </div>
                ))
              ) : (
                <EmptyState title="No reminders yet" body="Deadline, exam, and attendance alerts will appear here." />
              )}
            </div>
          </Card>
        )}

        {widgets.progress && (
          <Card>
            <SectionTitle icon={Target} title="Study Progress" action="Goals" onClick={() => navigate("/analytics")} />
            <div className="mt-5 grid gap-4">
              {goals.length ? (
                goals.map((goal) => {
                  const value = Math.min(100, Math.round(((Number(goal.current) || 0) / (Number(goal.target) || 1)) * 100));
                  return (
                    <div key={goal.id}>
                      <div className="mb-2 flex justify-between text-sm font-semibold">
                        <span>{goal.title}</span>
                        <span>{value}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200 dark:bg-white/10">
                        <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" style={{ width: `${value}%` }} />
                      </div>
                    </div>
                  );
                })
              ) : (
                <EmptyState title="Set a study goal" body="Daily study hours and attendance goals help Nexora measure progress." action="Open Settings" onClick={() => navigate("/settings")} />
              )}
            </div>
          </Card>
        )}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <PomodoroTimer />
        {widgets.ai && (
          <Card>
            <SectionTitle icon={Bot} title="AI Productivity Suggestions" action="Ask AI" onClick={() => navigate("/assistant")} />
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {aiSuggestions.map((item) => (
                <div key={item} className="rounded-lg border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm font-semibold leading-6 text-slate-700 dark:text-cyan-50">
                  {item}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </AppShell>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <Card>
      <Icon className="mb-5 h-5 w-5 text-cyan-500" />
      <p className="text-sm text-slate-600 dark:text-slate-300">{label}</p>
      <p className="mt-2 font-display text-4xl font-bold">{value}</p>
    </Card>
  );
}

function SectionTitle({ icon: Icon, title, action, onClick }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-cyan-500" />
        <h3 className="font-display text-xl font-bold">{title}</h3>
      </div>
      {action && (
        <button type="button" onClick={onClick} className="rounded-lg bg-slate-950/5 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-cyan-400/15 dark:bg-white/10 dark:text-slate-300">
          {action}
        </button>
      )}
    </div>
  );
}

function EmptyState({ title, body, action, onClick }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300/80 bg-white/45 p-5 text-center dark:border-white/15 dark:bg-slate-950/45">
      <TimerReset className="mx-auto mb-4 h-7 w-7 text-cyan-500" />
      <p className="font-display text-lg font-bold">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-300">{body}</p>
      {action && (
        <Button type="button" variant="secondary" className="mt-4" onClick={onClick}>
          {action}
        </Button>
      )}
    </div>
  );
}

function priorityWeight(priority) {
  return { High: 3, Medium: 2, Low: 1 }[priority] || 1;
}

function buildSuggestions({ tasks, assignments, attendanceWarnings, exams, profile }) {
  const suggestions = [];
  if (attendanceWarnings.length) suggestions.push(`Prioritize attendance recovery for ${attendanceWarnings[0].name}; it is below your ${profile.attendanceGoal || 85}% goal.`);
  if (assignments.length) suggestions.push(`Work on "${assignments[0].title}" first because it is the nearest assignment deadline.`);
  if (exams.length) suggestions.push(`Reserve a revision block for "${exams[0].title}" while there are ${Math.max(0, exams[0].remaining)} days left.`);
  if (tasks.some((task) => task.priority === "High")) suggestions.push("Complete high-priority tasks before starting optional study work today.");
  if (!suggestions.length) suggestions.push("Add tasks, attendance subjects, assignments, or exams to unlock personalized AI planning.");
  if (suggestions.length === 1) suggestions.push(`Schedule a ${profile.focusSessionDuration || 25}-minute focus session to build today's study momentum.`);
  return suggestions.slice(0, 4);
}
