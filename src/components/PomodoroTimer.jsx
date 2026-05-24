import { useEffect, useMemo } from "react";
import { Bell, Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";
import { useAppStore } from "../store/useAppStore";

export function PomodoroTimer() {
  const {
    profile,
    addNotification,
    updateGoal,
    goals,
    focusTimer,
    setFocusDuration,
    startFocusTimer,
    pauseFocusTimer,
    resetFocusTimer,
    tickFocusTimer,
  } = useAppStore();
  const duration = Number(focusTimer.duration || profile.focusSessionDuration || 25);
  const remaining = Number(focusTimer.remaining || duration * 60);
  const running = Boolean(focusTimer.running);
  const complete = Boolean(focusTimer.complete);

  useEffect(() => {
    if (running) {
      const timer = window.setInterval(() => {
        const finished = tickFocusTimer();
        if (finished) {
          window.clearInterval(timer);
          addNotification({ type: "Focus", priority: "Low", title: "Focus session complete", body: `${duration} minutes of focused study completed.` });
          const goal = goals.find((item) => item.title === "Daily Study Hours");
          if (goal) updateGoal(goal.id, { current: Number(goal.current || 0) + duration / 60 });
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("Nexora focus complete", { body: "Nice work. Log your progress and choose the next task." });
          }
        }
      }, 1000);
      return () => window.clearInterval(timer);
    }
    return undefined;
  }, [addNotification, duration, goals, running, tickFocusTimer, updateGoal]);

  useEffect(() => {
    if (!focusTimer.duration) setFocusDuration(Number(profile.focusSessionDuration) || 25);
  }, [focusTimer.duration, profile.focusSessionDuration, setFocusDuration]);

  const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
  const seconds = String(remaining % 60).padStart(2, "0");
  const total = duration * 60;
  const progress = useMemo(() => (total ? Math.round(100 - (remaining / total) * 100) : 0), [remaining, total]);

  const start = async () => {
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }
    startFocusTimer();
  };

  const pause = () => {
    pauseFocusTimer();
  };

  const reset = () => {
    resetFocusTimer();
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-300">Focus Timer</p>
          <p className="mt-2 font-display text-5xl font-bold">{minutes}:{seconds}</p>
        </div>
        <div className="grid h-24 w-24 place-items-center rounded-full bg-cyan-400/15 text-sm font-bold text-cyan-700 dark:text-cyan-200">
          {progress}%
        </div>
      </div>
      <label className="mt-5 block">
        <span className="mb-2 block text-sm font-semibold">Duration in minutes</span>
        <Input type="number" min="5" max="120" value={duration} disabled={running} onChange={(event) => setFocusDuration(Number(event.target.value) || 25)} />
      </label>
      {complete && (
        <p className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-400/15 p-3 text-sm font-semibold text-emerald-700 dark:text-emerald-200">
          <Bell className="h-4 w-4" /> Focus session complete.
        </p>
      )}
      <div className="mt-6 flex gap-3">
        <Button onClick={running ? pause : start} className="flex-1">
          {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {running ? "Pause" : "Start"}
        </Button>
        <Button variant="secondary" onClick={reset} aria-label="Reset timer" className="px-4">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
