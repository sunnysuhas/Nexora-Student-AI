import { useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Bell, ChevronLeft, Plus, Search, Sparkles } from "lucide-react";
import { navItems, mobileNavItems } from "../data/nav";
import { ThemeToggle } from "../components/ThemeToggle";
import { Button } from "../components/ui/Button";
import { useAppStore } from "../store/useAppStore";
import { cn } from "../utils/cn";

export function AppShell({ children, title, eyebrow }) {
  const [collapsed, setCollapsed] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const navigate = useNavigate();
  const currentUser = useAppStore((state) => state.currentUser);
  const notifications = useAppStore((state) => state.notificationsList);
  const unreadCount = notifications.filter((item) => !item.read).length;
  const privateNavItems = navItems.slice(1).filter((item) => !item.adminOnly || currentUser?.role === "admin");

  return (
    <div className="min-h-screen px-4 pb-24 pt-4 text-slate-950 dark:text-white lg:pb-8">
      <aside
        className={cn(
          "fixed bottom-4 left-4 top-4 z-40 hidden rounded-lg border border-slate-300/60 bg-white/70 p-4 shadow-2xl backdrop-blur-2xl transition-all dark:border-white/[0.12] dark:bg-black/[0.35] lg:block",
          collapsed ? "w-24" : "w-64"
        )}
      >
        <div className="mb-6 flex items-center justify-between gap-3">
          <NavLink to="/" className="flex min-w-0 items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-slate-950 text-cyan-300 shadow-glow dark:bg-white dark:text-slate-950">
              <Sparkles className="h-5 w-5" />
            </span>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate font-display text-lg font-bold">Nexora AI</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Student OS</p>
              </div>
            )}
          </NavLink>
          <button
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            aria-label="Collapse sidebar"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-950/5 text-slate-600 transition hover:bg-slate-950/10 dark:bg-white/10 dark:text-white"
          >
            <ChevronLeft className={cn("h-4 w-4 transition", collapsed && "rotate-180")} />
          </button>
        </div>

        <div className="max-h-[calc(100vh-13rem)] space-y-1 overflow-y-auto pr-1">
          {privateNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                title={item.label}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-950/5 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white",
                    collapsed && "justify-center px-2",
                    isActive && "bg-cyan-400/[0.12] text-cyan-700 shadow-glow dark:text-cyan-200"
                  )
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </div>

        {!collapsed && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="glass rounded-lg p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-300">AI Pulse</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {unreadCount} unread alerts, focus block ready.
              </p>
            </div>
          </div>
        )}
      </aside>

      <main className={cn("mx-auto max-w-7xl transition-all", collapsed ? "lg:ml-32" : "lg:ml-72")}>
        <header className="mb-6 flex flex-col gap-4 rounded-lg border border-slate-300/60 bg-white/[0.65] px-4 py-4 shadow-xl backdrop-blur-2xl dark:border-white/[0.12] dark:bg-black/30 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-600 dark:text-cyan-300">{eyebrow}</p>
            <h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => document.getElementById("nexora-global-search")?.focus()}
              className="grid h-10 w-10 place-items-center rounded-lg border border-slate-300/70 bg-white/70 text-slate-700 dark:border-white/15 dark:bg-white/10 dark:text-white"
              aria-label="Focus global search"
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate("/notifications")}
              className="relative grid h-10 w-10 place-items-center rounded-lg border border-slate-300/70 bg-white/70 text-slate-700 dark:border-white/15 dark:bg-white/10 dark:text-white"
              aria-label="Open notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-cyan-400" />}
            </button>
            <ThemeToggle />
          </div>
        </header>
        <GlobalSearch />
        {children}
      </main>

      <div className="fixed bottom-24 right-4 z-50 lg:hidden">
        {fabOpen && (
          <div className="mb-3 grid gap-2">
            {[
              ["Add Task", "/tasks"],
              ["Add Assignment", "/assignments"],
              ["Add Exam", "/calendar"],
            ].map(([label, path]) => (
              <button
                key={label}
                type="button"
                onClick={() => {
                  setFabOpen(false);
                  navigate(path);
                }}
                className="rounded-lg border border-slate-300/60 bg-white/90 px-4 py-2 text-sm font-bold text-slate-900 shadow-xl backdrop-blur-xl dark:border-white/15 dark:bg-black/80 dark:text-white"
              >
                {label}
              </button>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={() => setFabOpen((value) => !value)}
          aria-label="Open quick actions"
          className="grid h-14 w-14 place-items-center rounded-full bg-slate-950 text-white shadow-glow dark:bg-white dark:text-slate-950"
        >
          <Plus className={cn("h-6 w-6 transition", fabOpen && "rotate-45")} />
        </button>
      </div>

      <nav className="fixed bottom-3 left-3 right-3 z-50 grid grid-cols-5 rounded-lg border border-slate-300/60 bg-white/[0.85] p-2 shadow-2xl backdrop-blur-2xl dark:border-white/[0.12] dark:bg-black/75 lg:hidden">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-1 rounded-lg px-1 py-2 text-[10px] font-semibold text-slate-600 dark:text-slate-300",
                  isActive && "bg-cyan-400/[0.14] text-cyan-700 dark:text-cyan-200"
                )
              }
            >
              <Icon className="h-5 w-5" />
              <span className="max-w-full truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}

function GlobalSearch() {
  const navigate = useNavigate();
  const { tasks, assignments, notes, exams, subjects } = useAppStore();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return [
      ...tasks.map((item) => ({ type: "Task", title: item.title, subtitle: item.subject, path: "/tasks" })),
      ...assignments.map((item) => ({ type: "Assignment", title: item.title, subtitle: item.subject, path: "/assignments" })),
      ...notes.map((item) => ({ type: "Note", title: item.title, subtitle: item.category, path: "/notes" })),
      ...exams.map((item) => ({ type: "Exam", title: item.title, subtitle: item.subject, path: "/calendar" })),
      ...subjects.map((item) => ({ type: "Subject", title: item.name, subtitle: "Attendance", path: "/attendance" })),
    ]
      .filter((item) => `${item.title} ${item.subtitle}`.toLowerCase().includes(q))
      .slice(0, 8);
  }, [assignments, exams, notes, query, subjects, tasks]);

  return (
    <div className="mb-6 rounded-lg border border-slate-300/60 bg-white/85 p-3 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-black/75">
      <input
        value={query}
        id="nexora-global-search"
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search tasks, assignments, notes, exams, subjects..."
        className="min-h-11 w-full rounded-lg border border-slate-300/70 bg-white/70 px-4 text-sm text-slate-950 outline-none focus:border-cyan-400 dark:border-white/15 dark:bg-slate-950/70 dark:text-white"
      />
      {results.length > 0 && (
        <div className="mt-3 grid gap-2">
          {results.map((item) => (
            <button
              key={`${item.type}-${item.title}`}
              type="button"
              onClick={() => {
                setQuery("");
                navigate(item.path);
              }}
              className="flex items-center justify-between rounded-lg bg-slate-950/5 px-3 py-2 text-left text-sm transition hover:bg-cyan-400/10 dark:bg-white/10"
            >
              <span>
                <span className="font-bold">{item.title}</span>
                <span className="ml-2 text-slate-500 dark:text-slate-400">{item.subtitle}</span>
              </span>
              <span className="rounded-full bg-cyan-400/15 px-2 py-1 text-xs font-bold text-cyan-700 dark:text-cyan-300">{item.type}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
