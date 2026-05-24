import { useMemo, useState } from "react";
import { CalendarClock, CheckCircle2, Filter, Plus, Trash2 } from "lucide-react";
import { AppShell } from "../layouts/AppShell";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useAppStore } from "../store/useAppStore";
import { daysUntil, taskStatus } from "../utils/productivity";

const statuses = ["Pending", "In Progress", "Completed", "Overdue"];
const priorities = ["Low", "Medium", "High"];

const priorityStyles = {
  High: "bg-rose-400/15 text-rose-600 dark:text-rose-300",
  Medium: "bg-amber-400/15 text-amber-600 dark:text-amber-300",
  Low: "bg-emerald-400/15 text-emerald-600 dark:text-emerald-300",
};

export function Tasks() {
  const { tasks, subjects, addTask, updateTask, deleteTask, addNotification } = useAppStore();
  const [filter, setFilter] = useState("All");
  const [draft, setDraft] = useState({
    title: "",
    description: "",
    subject: "",
    priority: "Medium",
    deadline: "",
    reminder: "",
    tags: "",
  });

  const filteredTasks = useMemo(
    () => (filter === "All" ? tasks : tasks.filter((task) => task.priority === filter || taskStatus(task) === filter)),
    [filter, tasks]
  );

  const submit = async (event) => {
    event.preventDefault();
    if (!draft.title.trim()) return;
    const task = {
      ...draft,
      title: draft.title.trim(),
      tags: draft.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      status: "Pending",
    };
    await addTask(task);
    if (task.deadline) {
      addNotification({
        type: "Task",
        priority: "Medium",
        title: `Task reminder: ${task.title}`,
        body: `${task.title} is due on ${task.deadline}.`,
      });
    }
    setDraft({ title: "", description: "", subject: "", priority: "Medium", deadline: "", reminder: "", tags: "" });
  };

  return (
    <AppShell title="Tasks" eyebrow="Realistic Student Task Workflow">
      <Card className="mb-4">
        <form onSubmit={submit} className="grid gap-3 lg:grid-cols-2">
          <Input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="Task title" />
          <Input value={draft.subject} onChange={(event) => setDraft({ ...draft, subject: event.target.value })} placeholder={subjects.length ? "Linked subject" : "Linked subject (optional)"} list="task-subjects" />
          <datalist id="task-subjects">
            {subjects.map((subject) => <option key={subject.id} value={subject.name || subject.subject} />)}
          </datalist>
          <Input value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} placeholder="Description" />
          <Input value={draft.tags} onChange={(event) => setDraft({ ...draft, tags: event.target.value })} placeholder="Tags, comma separated" />
          <Input type="date" value={draft.deadline} onChange={(event) => setDraft({ ...draft, deadline: event.target.value })} />
          <Input type="datetime-local" value={draft.reminder} onChange={(event) => setDraft({ ...draft, reminder: event.target.value })} />
          <select
            value={draft.priority}
            onChange={(event) => setDraft({ ...draft, priority: event.target.value })}
            className="min-h-11 rounded-lg border border-slate-300/70 bg-white/70 px-4 text-sm font-semibold text-slate-900 dark:border-white/15 dark:!bg-slate-950/60 dark:text-white"
          >
            {priorities.map((item) => <option key={item}>{item}</option>)}
          </select>
          <Button type="submit"><Plus className="h-4 w-4" /> Add Task</Button>
        </form>
      </Card>

      <div className="mb-4 flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-300">
        {["All", ...priorities, ...statuses].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`inline-flex items-center gap-2 rounded-full px-3 py-2 font-semibold ${filter === item ? "bg-cyan-400/15 text-cyan-700 dark:text-cyan-300" : "bg-white/60 dark:!bg-slate-950/60"}`}
          >
            <Filter className="h-4 w-4" />
            {item}
          </button>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        {statuses.map((status) => {
          const columnTasks = filteredTasks.filter((task) => taskStatus(task) === status);
          return (
            <Card
              key={status}
              className="min-h-[28rem]"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                const id = event.dataTransfer.getData("task-id");
                if (id && status !== "Overdue") updateTask(id, { status });
              }}
            >
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-display text-xl font-bold">{status}</h2>
                <span className="rounded-full bg-cyan-400/15 px-2 py-1 text-xs font-bold text-cyan-600 dark:text-cyan-300">{columnTasks.length}</span>
              </div>
              <div className="space-y-3">
                {columnTasks.map((task) => (
                  <article
                    key={task.id}
                    draggable={status !== "Overdue"}
                    onDragStart={(event) => event.dataTransfer.setData("task-id", task.id)}
                    className="cursor-grab rounded-lg border border-slate-300/60 bg-white/[0.65] p-4 shadow-sm transition hover:-translate-y-1 hover:border-cyan-400 dark:border-white/10 dark:!bg-slate-950/60"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold leading-6">{task.title}</h3>
                      <span className={`rounded-full px-2 py-1 text-[11px] font-bold ${priorityStyles[task.priority] || priorityStyles.Medium}`}>
                        {task.priority || "Medium"}
                      </span>
                    </div>
                    {task.description && <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{task.description}</p>}
                    <p className="mt-3 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <CalendarClock className="h-4 w-4" />
                      {task.subject || "General"} {task.deadline ? `/ ${deadlineCopy(task.deadline)}` : ""}
                    </p>
                    {!!task.tags?.length && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {task.tags.map((tag) => <span key={tag} className="rounded-full bg-slate-950/5 px-2 py-1 text-xs font-bold dark:bg-white/10">{tag}</span>)}
                      </div>
                    )}
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => updateTask(task.id, { status: taskStatus(task) === "Completed" ? "Pending" : "Completed" })}
                        className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-emerald-400/15 px-3 text-xs font-bold text-emerald-600 transition hover:bg-emerald-400/25 dark:text-emerald-300"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        {taskStatus(task) === "Completed" ? "Reopen" : "Complete"}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteTask(task.id)}
                        className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-rose-400/15 px-3 text-xs font-bold text-rose-600 transition hover:bg-rose-400/25 dark:text-rose-300"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
                {!columnTasks.length && (
                  <div className="rounded-lg border border-dashed border-slate-300/80 p-4 text-sm text-slate-500 dark:border-white/15 dark:text-slate-400">
                    {status === "Pending" ? "Create your first task to start planning." : `No ${status.toLowerCase()} tasks.`}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}

function deadlineCopy(date) {
  const remaining = daysUntil(date);
  if (!Number.isFinite(remaining)) return "no deadline";
  if (remaining < 0) return `${Math.abs(remaining)} days overdue`;
  if (remaining === 0) return "due today";
  if (remaining === 1) return "due tomorrow";
  return `${remaining} days left`;
}
