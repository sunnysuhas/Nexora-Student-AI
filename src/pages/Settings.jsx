import { useState } from "react";
import { Bell, LogOut, Palette, Shield, SlidersHorizontal, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../layouts/AppShell";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { ThemeToggle } from "../components/ThemeToggle";
import { useAppStore } from "../store/useAppStore";

export function Settings() {
  const navigate = useNavigate();
  const {
    profile,
    notifications,
    compactMode,
    accentColor,
    updateProfile,
    toggleNotifications,
    toggleCompactMode,
    setAccentColor,
    logout,
  } = useAppStore();
  const [draft, setDraft] = useState(profile);
  const [saved, setSaved] = useState(false);

  const save = () => {
    updateProfile({
      ...draft,
      attendanceGoal: Number(draft.attendanceGoal) || 85,
      dailyStudyHoursGoal: Number(draft.dailyStudyHoursGoal) || 3,
      focusSessionDuration: Number(draft.focusSessionDuration) || 25,
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  const signOut = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppShell title="Settings" eyebrow="Account and Productivity Preferences">
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <h2 className="font-display text-2xl font-bold">Account settings</h2>
          <div className="mt-5 space-y-4">
            <Field icon={User} label="Full name" value={draft.fullName} onChange={(value) => setDraft({ ...draft, fullName: value })} />
            <Field icon={Shield} label="Username" value={draft.username} onChange={(value) => setDraft({ ...draft, username: value })} />
            <Field label="Email" type="email" value={draft.email} onChange={(value) => setDraft({ ...draft, email: value })} />
            <Field label="College/School" value={draft.college} onChange={(value) => setDraft({ ...draft, college: value })} />
            <Field label="Course/Branch" value={draft.course} onChange={(value) => setDraft({ ...draft, course: value })} />
            <Field label="Semester/Year" value={draft.semester} onChange={(value) => setDraft({ ...draft, semester: value })} />
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="button" onClick={save}>Save Profile</Button>
              <Button type="button" variant="secondary" onClick={signOut}>
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            </div>
            {saved && <p className="rounded-lg bg-emerald-400/15 p-3 text-sm font-semibold text-emerald-700 dark:text-emerald-200">Settings saved.</p>}
          </div>
        </Card>

        <div className="grid gap-4">
          <Card>
            <h2 className="font-display text-2xl font-bold">Interface</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <SettingRow icon={Palette} title="Theme" body="Switch between cinematic dark and clean light mode.">
                <ThemeToggle />
              </SettingRow>
              <SettingRow icon={Bell} title="Notifications" body="Deadline, exam, and attendance alerts.">
                <Switch checked={notifications} onClick={toggleNotifications} />
              </SettingRow>
              <SettingRow icon={SlidersHorizontal} title="Compact mode" body="Reduce spacing for daily repeated use.">
                <Switch checked={compactMode} onClick={toggleCompactMode} />
              </SettingRow>
              <SettingRow icon={Palette} title="Accent color" body="Choose a highlight color for product surfaces.">
                <div className="flex gap-2">
                  {["cyan", "violet", "sky"].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setAccentColor(color)}
                      className={`h-8 w-8 rounded-full border-2 ${accentColor === color ? "border-slate-950 dark:border-white" : "border-transparent"} ${swatchClass(color)}`}
                      aria-label={`Use ${color} accent`}
                    />
                  ))}
                </div>
              </SettingRow>
            </div>
          </Card>

          <Card>
            <h2 className="font-display text-2xl font-bold">Productivity preferences</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Field label="Daily study goal" type="number" value={draft.dailyStudyHoursGoal} onChange={(value) => setDraft({ ...draft, dailyStudyHoursGoal: value })} />
              <Field label="Focus duration" type="number" value={draft.focusSessionDuration} onChange={(value) => setDraft({ ...draft, focusSessionDuration: value })} />
              <Field label="Reminder time" type="time" value={draft.reminderTime} onChange={(value) => setDraft({ ...draft, reminderTime: value })} />
              <Field label="Attendance goal %" type="number" value={draft.attendanceGoal} onChange={(value) => setDraft({ ...draft, attendanceGoal: value })} />
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {["Deadline reminders", "Attendance alerts", "Email preferences"].map((item) => (
                <label key={item} className="flex items-center justify-between rounded-lg bg-slate-950/5 p-4 text-sm font-semibold dark:!bg-slate-950/50">
                  {item}
                  <input type="checkbox" defaultChecked className="h-5 w-5 accent-cyan-500" />
                </label>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function Field({ icon: Icon, label, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-sm font-semibold">
        {Icon && <Icon className="h-4 w-4 text-cyan-500" />}
        {label}
      </span>
      <Input type={type} value={value || ""} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function SettingRow({ icon: Icon, title, body, children }) {
  return (
    <div className="rounded-lg border border-slate-300/60 bg-white/50 p-4 dark:border-white/10 dark:!bg-slate-950/50">
      <Icon className="mb-5 h-5 w-5 text-cyan-500" />
      <h3 className="font-display text-lg font-bold">{title}</h3>
      <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600 dark:text-slate-300">{body}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Switch({ checked, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative h-8 w-14 rounded-full border transition ${checked ? "border-cyan-400 bg-cyan-400/30" : "border-slate-300 bg-slate-200 dark:border-white/15 dark:bg-white/10"}`}
    >
      <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${checked ? "left-7" : "left-1"}`} />
    </button>
  );
}

function swatchClass(color) {
  return {
    cyan: "bg-cyan-400",
    violet: "bg-violet-500",
    sky: "bg-sky-400",
  }[color];
}
