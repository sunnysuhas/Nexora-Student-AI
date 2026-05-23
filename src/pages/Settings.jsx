import { useState } from "react";
import { Bell, Database, Palette, Shield, SlidersHorizontal, User } from "lucide-react";
import { AppShell } from "../layouts/AppShell";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { ThemeToggle } from "../components/ThemeToggle";
import { useAppStore } from "../store/useAppStore";
import { backendBlueprint } from "../data/backendBlueprint";

export function Settings() {
  const [modalOpen, setModalOpen] = useState(false);
  const { notifications, compactMode, toggleNotifications, toggleCompactMode } = useAppStore();

  return (
    <AppShell title="Settings" eyebrow="Personalization and AI Preferences">
      <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <h2 className="font-display text-2xl font-bold">Profile</h2>
          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold"><User className="h-4 w-4 text-cyan-500" /> Student name</span>
              <Input defaultValue="Nexora Student" />
            </label>
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold"><Shield className="h-4 w-4 text-cyan-500" /> Academic stream</span>
              <Input defaultValue="Computer Science" />
            </label>
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-2xl font-bold">Interface</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <SettingRow icon={Palette} title="Theme" body="Switch between cinematic dark and clean light mode.">
              <ThemeToggle />
            </SettingRow>
            <SettingRow icon={Bell} title="Notifications" body="Enable deadline, attendance, and focus reminders.">
              <Switch checked={notifications} onClick={toggleNotifications} />
            </SettingRow>
            <SettingRow icon={SlidersHorizontal} title="Compact mode" body="Make dashboard spacing denser for repeated daily use.">
              <Switch checked={compactMode} onClick={toggleCompactMode} />
            </SettingRow>
            <SettingRow icon={Shield} title="Future AI settings" body="Control model memory, study tone, and personalization.">
              <span className="rounded-full bg-violet-400/15 px-3 py-1 text-xs font-bold text-violet-600 dark:text-violet-300">Soon</span>
            </SettingRow>
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <h2 className="font-display text-2xl font-bold">Notification preferences</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {["Assignment reminders", "Exam countdown alerts", "Attendance risk warnings"].map((item) => (
            <label key={item} className="flex items-center justify-between rounded-lg bg-slate-950/5 p-4 text-sm font-semibold dark:!bg-slate-950/50">
              {item}
              <input type="checkbox" defaultChecked className="h-5 w-5 accent-cyan-500" />
            </label>
          ))}
        </div>
      </Card>

      <Card className="mt-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">Backend integration plan</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Preview the future Node.js, Express, MongoDB, JWT, notifications, and admin dashboard architecture.
            </p>
          </div>
          <Button onClick={() => setModalOpen(true)} variant="secondary">
            <Database className="h-4 w-4" />
            View Plan
          </Button>
        </div>
      </Card>

      <Modal open={modalOpen} title="Nexora Full-stack Roadmap" onClose={() => setModalOpen(false)}>
        <div className="grid gap-3">
          {backendBlueprint.map((section) => (
            <div key={section.title} className="rounded-lg bg-slate-950/5 p-4 dark:bg-white/10">
              <p className="font-display font-bold">{section.title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{section.items.join(" / ")}</p>
            </div>
          ))}
        </div>
      </Modal>
    </AppShell>
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
