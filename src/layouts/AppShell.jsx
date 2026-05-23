import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { navItems } from "../data/nav";
import { ThemeToggle } from "../components/ThemeToggle";
import { cn } from "../utils/cn";

export function AppShell({ children, title, eyebrow }) {
  return (
    <div className="min-h-screen px-4 pb-24 pt-4 text-slate-950 dark:text-white lg:pb-8">
      <aside className="fixed bottom-4 left-4 top-4 z-40 hidden w-64 rounded-lg border border-slate-300/60 bg-white/70 p-4 shadow-2xl backdrop-blur-2xl dark:border-white/[0.12] dark:bg-black/[0.35] lg:block">
        <NavLink to="/" className="mb-8 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-slate-950 text-cyan-300 shadow-glow dark:bg-white dark:text-slate-950">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <p className="font-display text-lg font-bold">Nexora AI</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Student OS</p>
          </div>
        </NavLink>

        <div className="space-y-1">
          {navItems.slice(1).map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-950/5 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white",
                    isActive && "bg-cyan-400/[0.12] text-cyan-700 shadow-glow dark:text-cyan-200"
                  )
                }
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            );
          })}
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="glass rounded-lg p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-300">AI Pulse</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">3 deadlines, 1 attendance risk, 2 focus blocks ready.</p>
          </div>
        </div>
      </aside>

      <main className="mx-auto max-w-7xl lg:ml-72">
        <header className="mb-6 flex items-center justify-between rounded-lg border border-slate-300/60 bg-white/[0.65] px-4 py-4 shadow-xl backdrop-blur-2xl dark:border-white/[0.12] dark:bg-black/30">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-600 dark:text-cyan-300">{eyebrow}</p>
            <h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">{title}</h1>
          </div>
          <ThemeToggle />
        </header>
        {children}
      </main>

      <nav className="fixed bottom-3 left-3 right-3 z-50 grid grid-cols-5 rounded-lg border border-slate-300/60 bg-white/[0.85] p-2 shadow-2xl backdrop-blur-2xl dark:border-white/[0.12] dark:bg-black/75 lg:hidden">
        {navItems.slice(1, 6).map((item) => {
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
              <span className="max-w-full truncate">{item.label.split(" ")[0]}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
