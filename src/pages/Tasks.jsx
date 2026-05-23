import { useMemo, useState } from "react";
import { CheckCircle2, Filter, Plus, SlidersHorizontal, Trash2 } from "lucide-react";
import { AppShell } from "../layouts/AppShell";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useAppStore } from "../store/useAppStore";

const columns = [
  { id: "todo", title: "To do" },
  { id: "doing", title: "In focus" },
  { id: "review", title: "Review" },
  { id: "done", title: "Done" },
];

const priorityStyles = {
  High: "bg-rose-400/15 text-rose-600 dark:text-rose-300",
  Medium: "bg-amber-400/15 text-amber-600 dark:text-amber-300",
  Low: "bg-emerald-400/15 text-emerald-600 dark:text-emerald-300",
};

export function Tasks() {
  const { tasks, addTask, moveTask, updateTask, deleteTask } = useAppStore();
  const [filter, setFilter] = useState("All");
  const [draft, setDraft] = useState("");

  const filteredTasks = useMemo(
    () => (filter === "All" ? tasks : tasks.filter((task) => task.priority === filter)),
    [filter, tasks]
  );

  const submit = (event) => {
    event.preventDefault();
    if (!draft.trim()) return;
    addTask({
      title: draft.trim(),
      subject: "General",
      priority: "Medium",
      deadline: "Upcoming",
      progress: 0,
      status: "todo",
    });
    setDraft("");
  };

  return (
    <AppShell title="Tasks" eyebrow="Drag-and-drop Task Engine">
      <Card className="mb-4">
        <form onSubmit={submit} className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <Input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Add a new task, assignment, or study goal..."
          />
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="min-h-11 rounded-lg border border-slate-300/70 bg-white/70 px-4 text-sm font-semibold text-slate-900 dark:border-white/15 dark:!bg-slate-950/60 dark:text-white"
          >
            {["All", "High", "Medium", "Low"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <Button type="submit">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </form>
      </Card>

      <div className="mb-4 flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-300">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-2 dark:!bg-slate-950/60">
          <Filter className="h-4 w-4" />
          Priority filter: {filter}
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-2 dark:!bg-slate-950/60">
          <SlidersHorizontal className="h-4 w-4" />
          CRUD + LocalStorage persistence enabled
        </span>
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        {columns.map((column) => (
          <Card
            key={column.id}
            className="min-h-[32rem]"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              const id = event.dataTransfer.getData("task-id");
              if (id) moveTask(id, column.id);
            }}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">{column.title}</h2>
              <span className="rounded-full bg-cyan-400/15 px-2 py-1 text-xs font-bold text-cyan-600 dark:text-cyan-300">
                {filteredTasks.filter((task) => task.status === column.id).length}
              </span>
            </div>
            <div className="space-y-3">
              {filteredTasks
                .filter((task) => task.status === column.id)
                .map((task) => (
                  <article
                    key={task.id}
                    draggable
                    onDragStart={(event) => event.dataTransfer.setData("task-id", task.id)}
                    className="cursor-grab rounded-lg border border-slate-300/60 bg-white/[0.65] p-4 shadow-sm transition hover:-translate-y-1 hover:border-cyan-400 dark:border-white/10 dark:!bg-slate-950/60"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold leading-6">{task.title}</h3>
                      <span className={`rounded-full px-2 py-1 text-[11px] font-bold ${priorityStyles[task.priority]}`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      {task.subject} / {task.deadline}
                    </p>
                    <div className="mt-4">
                      <div className="mb-1 flex justify-between text-xs font-semibold">
                        <span>Progress</span>
                        <span>{task.progress}%</span>
                      </div>
                      <input
                        aria-label={`Progress for ${task.title}`}
                        type="range"
                        min="0"
                        max="100"
                        value={task.progress}
                        onChange={(event) => updateTask(task.id, { progress: Number(event.target.value) })}
                        className="w-full accent-cyan-500"
                      />
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          updateTask(task.id, { progress: 100 });
                          moveTask(task.id, "done");
                        }}
                        className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-emerald-400/15 px-3 text-xs font-bold text-emerald-600 transition hover:bg-emerald-400/25 dark:text-emerald-300"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Complete
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
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
