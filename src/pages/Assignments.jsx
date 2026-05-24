import { useState } from "react";
import { AlertTriangle, CalendarClock, CheckCircle2, Pencil, Plus, Trash2 } from "lucide-react";
import { AppShell } from "../layouts/AppShell";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useAppStore } from "../store/useAppStore";
import { assignmentStatus, daysUntil } from "../utils/productivity";

const statuses = ["Not Started", "In Progress", "Completed", "Overdue"];

export function Assignments() {
  const { assignments, addAssignment, updateAssignment, deleteAssignment, addNotification } = useAppStore();
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ title: "", subject: "", dueDate: "", priority: "Medium", notes: "", attachments: "" });

  const submit = async (event) => {
    event.preventDefault();
    if (!draft.title || !draft.subject || !draft.dueDate) return;
    const payload = {
      ...draft,
      status: draft.status || "Not Started",
      attachments: draft.attachments
        ? draft.attachments.split(",").map((name) => ({ name: name.trim(), url: "" })).filter((item) => item.name)
        : [],
    };
    if (editingId) await updateAssignment(editingId, payload);
    else {
      await addAssignment(payload);
      addNotification({ type: "Assignment", priority: "Medium", title: `Assignment added: ${draft.title}`, body: `${draft.subject} is due on ${draft.dueDate}.` });
    }
    setEditingId(null);
    setDraft({ title: "", subject: "", dueDate: "", priority: "Medium", notes: "", attachments: "" });
  };

  return (
    <AppShell title="Assignments" eyebrow="Deadline Intelligence">
      <Card className="mb-4">
        <form onSubmit={submit} className="grid gap-3 lg:grid-cols-3">
          <Input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="Assignment title" />
          <Input value={draft.subject} onChange={(event) => setDraft({ ...draft, subject: event.target.value })} placeholder="Subject" />
          <Input type="date" value={draft.dueDate} onChange={(event) => setDraft({ ...draft, dueDate: event.target.value })} />
          <select value={draft.priority} onChange={(event) => setDraft({ ...draft, priority: event.target.value })} className="min-h-11 rounded-lg border border-slate-300/70 bg-white/70 px-4 text-sm font-semibold text-slate-900 dark:border-white/15 dark:!bg-slate-950/60 dark:text-white">
            {["Low", "Medium", "High"].map((item) => <option key={item}>{item}</option>)}
          </select>
          <Input value={draft.notes} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} placeholder="Notes" />
          <Input value={draft.attachments} onChange={(event) => setDraft({ ...draft, attachments: event.target.value })} placeholder="Attachment names (optional)" />
          <Button type="submit"><Plus className="h-4 w-4" /> {editingId ? "Update" : "Add Assignment"}</Button>
        </form>
      </Card>

      <div className="grid gap-4 xl:grid-cols-4">
        {statuses.map((status) => {
          const items = assignments.filter((assignment) => assignmentStatus(assignment) === status);
          return (
            <Card
              key={status}
              className="min-h-[24rem]"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                const id = event.dataTransfer.getData("assignment-id");
                if (id && status !== "Overdue") updateAssignment(id, { status });
              }}
            >
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-display text-xl font-bold">{status}</h2>
                <span className="rounded-full bg-cyan-400/15 px-2 py-1 text-xs font-bold text-cyan-600 dark:text-cyan-300">{items.length}</span>
              </div>
              <div className="grid gap-3">
                {items.map((assignment) => {
                  const remaining = daysUntil(assignment.dueDate);
                  const urgent = assignmentStatus(assignment) === "Overdue" || remaining <= 2;
                  return (
                    <article
                      key={assignment.id}
                      draggable={status !== "Overdue"}
                      onDragStart={(event) => event.dataTransfer.setData("assignment-id", assignment.id)}
                      className="cursor-grab rounded-lg border border-slate-300/60 bg-white/60 p-4 dark:border-white/10 dark:bg-slate-950/60"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${urgent ? "bg-rose-400/15 text-rose-600 dark:text-rose-300" : "bg-cyan-400/15 text-cyan-700 dark:text-cyan-300"}`}>
                          {urgent ? "Deadline Warning" : assignment.priority}
                        </span>
                        {urgent && <AlertTriangle className="h-5 w-5 text-rose-500" />}
                      </div>
                      <h3 className="mt-5 font-display text-lg font-bold">{assignment.title}</h3>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{assignment.subject}</p>
                      <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-cyan-600 dark:text-cyan-300">
                        <CalendarClock className="h-4 w-4" />
                        {remaining < 0 ? `${Math.abs(remaining)} days overdue` : `${remaining} days left`}
                      </p>
                      {assignment.notes && <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{assignment.notes}</p>}
                      <div className="mt-5 grid grid-cols-3 gap-2">
                        <button type="button" onClick={() => updateAssignment(assignment.id, { status: "Completed" })} className="inline-flex min-h-9 items-center justify-center rounded-lg bg-emerald-400/15 text-xs font-bold text-emerald-600 dark:text-emerald-300">
                          <CheckCircle2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(assignment.id);
                            setDraft({
                              title: assignment.title,
                              subject: assignment.subject,
                              dueDate: String(assignment.dueDate).slice(0, 10),
                              priority: assignment.priority,
                              notes: assignment.notes || "",
                              attachments: assignment.attachments?.map((item) => item.name).join(", ") || "",
                            });
                          }}
                          className="inline-flex min-h-9 items-center justify-center rounded-lg bg-cyan-400/15 text-xs font-bold text-cyan-700 dark:text-cyan-300"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => deleteAssignment(assignment.id)} className="inline-flex min-h-9 items-center justify-center rounded-lg bg-rose-400/15 text-xs font-bold text-rose-600 dark:text-rose-300">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </article>
                  );
                })}
                {!items.length && (
                  <div className="rounded-lg border border-dashed border-slate-300/80 p-4 text-sm text-slate-500 dark:border-white/15 dark:text-slate-400">
                    {status === "Not Started" ? "Add your first assignment to activate deadline planning." : `No ${status.toLowerCase()} assignments.`}
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
