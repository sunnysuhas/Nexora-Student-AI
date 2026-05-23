import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, Brain, Flame, Timer } from "lucide-react";
import { AppShell } from "../layouts/AppShell";
import { Card } from "../components/ui/Card";
import { StatCard } from "../components/StatCard";
import { heatmap, weeklyProductivity } from "../data/mock";

export function Analytics() {
  return (
    <AppShell title="Analytics" eyebrow="Productivity Intelligence">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Deep Work" value="18.2h" detail="+16% vs last week" icon={Timer} />
        <StatCard label="Study Energy" value="84" detail="stable trend" icon={Flame} tone="amber" />
        <StatCard label="AI Wins" value="27" detail="plans and summaries" icon={Brain} tone="violet" />
        <StatCard label="Completion" value="78%" detail="+9% sprint lift" icon={Activity} tone="emerald" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="h-96">
          <h2 className="mb-4 font-display text-2xl font-bold">Focus tracking</h2>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={weeklyProductivity}>
              <defs>
                <linearGradient id="analyticsFocus" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#00D9FF" stopOpacity={0.55} />
                  <stop offset="100%" stopColor="#00D9FF" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="currentColor" opacity={0.08} />
              <XAxis dataKey="day" stroke="currentColor" opacity={0.5} />
              <YAxis stroke="currentColor" opacity={0.35} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "0", background: "#0F172A", color: "#fff" }} />
              <Area type="monotone" dataKey="focus" stroke="#00D9FF" fill="url(#analyticsFocus)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card className="h-96">
          <h2 className="mb-4 font-display text-2xl font-bold">Task throughput</h2>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={weeklyProductivity}>
              <XAxis dataKey="day" stroke="currentColor" opacity={0.5} />
              <YAxis stroke="currentColor" opacity={0.35} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "0", background: "#0F172A", color: "#fff" }} />
              <Bar dataKey="tasks" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[0.75fr_1.25fr]">
        <Card>
          <h2 className="font-display text-2xl font-bold">Study heatmap</h2>
          <div className="mt-6 grid grid-cols-7 gap-2">
            {heatmap.map((cell) => (
              <span key={cell.id} className="aspect-square rounded-md" style={{ backgroundColor: `rgba(6, 182, 212, ${0.12 + cell.level * 0.14})` }} />
            ))}
          </div>
        </Card>
        <Card className="h-80">
          <h2 className="mb-4 font-display text-2xl font-bold">Energy vs tasks</h2>
          <ResponsiveContainer width="100%" height="80%">
            <LineChart data={weeklyProductivity}>
              <CartesianGrid stroke="currentColor" opacity={0.08} />
              <XAxis dataKey="day" stroke="currentColor" opacity={0.5} />
              <YAxis stroke="currentColor" opacity={0.35} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "0", background: "#0F172A", color: "#fff" }} />
              <Line type="monotone" dataKey="energy" stroke="#10B981" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="tasks" stroke="#F59E0B" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </AppShell>
  );
}
