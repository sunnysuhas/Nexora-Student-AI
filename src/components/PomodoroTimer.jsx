import { useEffect, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";

const initialSeconds = 25 * 60;

export function PomodoroTimer() {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return undefined;
    const timer = window.setInterval(() => {
      setSeconds((value) => {
        if (value <= 1) {
          setRunning(false);
          return initialSeconds;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const remainder = String(seconds % 60).padStart(2, "0");
  const progress = 100 - (seconds / initialSeconds) * 100;

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-300">Focus Timer</p>
          <p className="mt-2 font-display text-5xl font-bold">{minutes}:{remainder}</p>
        </div>
        <div className="relative h-24 w-24 rounded-full bg-slate-200 dark:bg-white/10">
          <div
            className="absolute inset-0 rounded-full bg-cyan-400/30"
            style={{ clipPath: `polygon(50% 50%, 50% 0, ${50 + progress / 2}% 0, 100% 100%, 0 100%, 0 0)` }}
          />
          <div className="absolute inset-3 grid place-items-center rounded-full bg-white/80 text-sm font-bold dark:bg-slate-950/80">
            {Math.round(progress)}%
          </div>
        </div>
      </div>
      <div className="mt-6 flex gap-3">
        <Button onClick={() => setRunning((value) => !value)} className="flex-1">
          {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {running ? "Pause" : "Start"}
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            setSeconds(initialSeconds);
            setRunning(false);
          }}
          aria-label="Reset timer"
          className="px-4"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
