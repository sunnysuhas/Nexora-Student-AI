import { useState } from "react";
import { Plus, Trash2, TrendingUp } from "lucide-react";
import { AppShell } from "../layouts/AppShell";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useAppStore } from "../store/useAppStore";
import { attendancePercent, attendancePrediction, attendanceTotal, overallAttendance } from "../utils/productivity";

export function Attendance() {
  const { subjects, addSubject, deleteSubject, markAttendance, updateSubject } = useAppStore();
  const [name, setName] = useState("");

  return (
    <AppShell title="Attendance" eyebrow="Manual Entry + Smart Analytics">
      <div className="mb-4 grid gap-4 lg:grid-cols-[0.6fr_1.4fr]">
        <Card>
          <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-300">Overall Attendance</p>
          <p className="mt-3 font-display text-6xl font-bold">{overallAttendance(subjects)}%</p>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Goal-aware shortage prediction is calculated subject-wise.</p>
        </Card>
        <Card>
          <form
            className="grid gap-3 sm:grid-cols-[1fr_auto]"
            onSubmit={(event) => {
              event.preventDefault();
              if (!name.trim()) return;
              addSubject({ name: name.trim(), subject: name.trim(), goal: 85 });
              setName("");
            }}
          >
            <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Add subject" />
            <Button type="submit"><Plus className="h-4 w-4" /> Add Subject</Button>
          </form>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {!subjects.length && (
          <Card className="md:col-span-2 xl:col-span-3">
            <p className="font-display text-xl font-bold">Add your first subject</p>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Subject-wise attendance, shortage warnings, and predictions start once you add your own classes.
            </p>
          </Card>
        )}
        {subjects.map((subject) => {
          const percent = attendancePercent(subject);
          const risk = percent < subject.goal;
          return (
            <Card key={subject.id} tilt>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-bold">{subject.name || subject.subject}</h2>
                  <p className={`mt-2 text-sm font-bold ${risk ? "text-rose-500" : "text-emerald-500"}`}>
                    {risk ? attendancePrediction(subject) : "Safe attendance"}
                  </p>
                </div>
                <TrendingUp className="h-5 w-5 text-cyan-500" />
              </div>
              <p className="mt-5 font-display text-5xl font-bold">{percent}%</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {subject.present || 0} present / {subject.absent || 0} absent / {subject.holidays || 0} holidays / {attendanceTotal(subject)} total
              </p>
              <div className="mt-4 h-2 rounded-full bg-slate-200 dark:bg-white/10">
                <div className={`h-full rounded-full ${risk ? "bg-rose-400" : "bg-cyan-400"}`} style={{ width: `${percent}%` }} />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2">
                {[
                  ["Present", "present", "bg-emerald-400/15 text-emerald-600 dark:text-emerald-300"],
                  ["Absent", "absent", "bg-rose-400/15 text-rose-600 dark:text-rose-300"],
                  ["Holiday", "holiday", "bg-violet-400/15 text-violet-600 dark:text-violet-300"],
                ].map(([label, type, className]) => (
                  <button key={type} type="button" onClick={() => markAttendance(subject.id, type)} className={`min-h-9 rounded-lg text-xs font-bold ${className}`}>
                    {label}
                  </button>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
                <Input
                  type="number"
                  min="50"
                  max="100"
                  value={subject.goal}
                  onChange={(event) => updateSubject(subject.id, { goal: Number(event.target.value) })}
                  aria-label={`Goal for ${subject.name}`}
                />
                <button type="button" onClick={() => deleteSubject(subject.id)} className="grid h-11 w-11 place-items-center rounded-lg bg-rose-400/15 text-rose-600 dark:text-rose-300">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
