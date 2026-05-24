import { useState } from "react";
import { Bell, CalendarClock, Clock3, Pencil, Plus, Trash2 } from "lucide-react";
import { AppShell } from "../layouts/AppShell";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useAppStore } from "../store/useAppStore";
import { daysUntil } from "../utils/productivity";

export function Calendar() {
  const { exams, assignments, addExam, updateExam, deleteExam, addNotification } = useAppStore();
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ title: "", subject: "", date: "" });
  const current = new Date();
  const daysInMonth = new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);

  const submit = (event) => {
    event.preventDefault();
    if (!draft.title || !draft.subject || !draft.date) return;
    if (editingId) updateExam(editingId, { ...draft, reminder: true });
    else {
      addExam({ ...draft, reminder: true });
      addNotification({ type: "Exam", title: `Exam added: ${draft.title}`, body: `${draft.subject} exam scheduled for ${draft.date}.` });
    }
    setDraft({ title: "", subject: "", date: "" });
    setEditingId(null);
  };

  return (
    <AppShell title="Calendar" eyebrow="Exams, Assignments, and Study Schedule">
      <div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-300">
                {current.toLocaleString("en", { month: "long", year: "numeric" })}
              </p>
              <h2 className="font-display text-2xl font-bold">Academic calendar</h2>
            </div>
            <CalendarClock className="h-6 w-6 text-cyan-500" />
          </div>
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            {["M", "T", "W", "T", "F", "S", "S"].map((day) => <span key={day}>{day}</span>)}
          </div>
          <div className="mt-3 grid grid-cols-7 gap-2">
            {days.map((day) => {
              const exam = exams.find((item) => new Date(item.date).getDate() === day);
              const assignment = assignments.find((item) => new Date(item.dueDate).getDate() === day);
              return (
                <div
                  key={day}
                  className="min-h-24 rounded-lg border border-slate-300/60 bg-white/50 p-2 transition hover:border-cyan-400 dark:border-white/10 dark:!bg-slate-950/50"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    const examId = event.dataTransfer.getData("exam-id");
                    if (examId) {
                      const date = formatDate(current.getFullYear(), current.getMonth(), day);
                      updateExam(examId, { date });
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">{day}</span>
                    {(exam || assignment) && <span className={`h-2 w-2 rounded-full ${exam ? "bg-rose-500" : "bg-cyan-500"}`} />}
                  </div>
                  {exam && <p className="mt-3 text-xs font-semibold leading-5">{exam.title}</p>}
                  {assignment && <p className="mt-1 text-xs leading-5 text-slate-500">{assignment.title}</p>}
                </div>
              );
            })}
          </div>
        </Card>

        <div className="grid gap-4">
          <Card>
            <h3 className="font-display text-xl font-bold">{editingId ? "Edit exam" : "Add exam"}</h3>
            <form onSubmit={submit} className="mt-5 space-y-3">
              <Input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="Exam title" />
              <Input value={draft.subject} onChange={(event) => setDraft({ ...draft, subject: event.target.value })} placeholder="Subject" />
              <Input type="date" value={draft.date} onChange={(event) => setDraft({ ...draft, date: event.target.value })} />
              <Button type="submit" className="w-full"><Plus className="h-4 w-4" /> {editingId ? "Update Exam" : "Add Exam"}</Button>
            </form>
          </Card>

          <Card>
            <h3 className="font-display text-xl font-bold">Exam countdown</h3>
            <div className="mt-5 space-y-3">
              {exams.map((exam) => (
                <div key={exam.id} draggable onDragStart={(event) => event.dataTransfer.setData("exam-id", exam.id)} className="cursor-grab rounded-lg bg-slate-950/5 p-4 dark:!bg-slate-950/50">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{exam.title}</p>
                      <p className="text-sm text-cyan-600 dark:text-cyan-300">{Math.max(0, daysUntil(exam.date))} days left</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(exam.id);
                          setDraft({ title: exam.title, subject: exam.subject, date: exam.date });
                        }}
                        className="grid h-9 w-9 place-items-center rounded-lg bg-cyan-400/15 text-cyan-700 dark:text-cyan-300"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => deleteExam(exam.id)} className="grid h-9 w-9 place-items-center rounded-lg bg-rose-400/15 text-rose-600 dark:text-rose-300">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h3 className="font-display text-xl font-bold">Smart reminders</h3>
            <div className="mt-5 space-y-3 text-sm text-slate-700 dark:text-slate-300">
              {[...assignments.slice(0, 2).map((item) => `${item.title} deadline: ${String(item.dueDate).slice(0, 10)}`), ...exams.slice(0, 2).map((item) => `${item.title} exam: ${String(item.date).slice(0, 10)}`)].map((item) => (
                <p key={item} className="flex gap-3 rounded-lg bg-slate-950/5 p-3 dark:!bg-slate-950/50">
                  <Bell className="h-4 w-4 shrink-0 text-cyan-500" />
                  {item}
                </p>
              ))}
              {!assignments.length && !exams.length && <p className="rounded-lg border border-dashed border-slate-300/80 p-4 dark:border-white/15">Add exams or assignments to generate reminders.</p>}
            </div>
          </Card>
          <Card>
            <h3 className="font-display text-xl font-bold">Study scheduling</h3>
            <div className="mt-5 flex items-center gap-4 rounded-lg bg-gradient-to-r from-cyan-400/15 to-violet-500/15 p-4">
              <Clock3 className="h-8 w-8 text-violet-500" />
              <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">Nexora recommends protecting the next focus block for your nearest exam or assignment deadline.</p>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function formatDate(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
