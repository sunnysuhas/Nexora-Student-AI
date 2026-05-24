import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bot, ChartNoAxesCombined, Menu, PanelsTopLeft, Sparkles, X, Zap } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/Button";
import { cn } from "../utils/cn";

const publicSections = [
  { id: "hero", label: "Home", icon: Sparkles },
  { id: "features", label: "Features", icon: PanelsTopLeft },
  { id: "workflow", label: "AI Planner", icon: Bot },
  { id: "screenshots", label: "Product", icon: ChartNoAxesCombined },
  { id: "cta", label: "Get Started", icon: Zap },
];

export function Navbar({ landingActive = "hero" }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    setOpen(false);
    const scroll = () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (location.pathname !== "/") {
      navigate("/");
      window.setTimeout(scroll, 80);
      return;
    }
    scroll();
  };

  return (
    <header className="fixed left-0 right-0 top-4 z-50 px-4">
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-lg border border-slate-300/60 bg-white/75 px-4 py-3 text-slate-900 shadow-2xl shadow-cyan-950/10 backdrop-blur-2xl transition dark:border-white/[0.12] dark:bg-black/[0.38] dark:text-white">
        <button type="button" onClick={() => scrollToSection("hero")} className="flex items-center gap-3 text-left">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-slate-950 text-cyan-300 shadow-glow dark:bg-white dark:text-slate-950">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold">Nexora AI</span>
        </button>

        <div className="hidden items-center gap-1 lg:flex">
          {publicSections.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === "/" && landingActive === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className={cn(
                  "relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white",
                  active && "text-slate-950 dark:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
                {active && (
                  <motion.span
                    layoutId="public-nav-glow"
                    className="absolute inset-x-2 -bottom-1 h-0.5 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 shadow-glow"
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <Link to="/login" className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white">
            Login
          </Link>
          <Button type="button" className="min-h-10 px-4" onClick={() => navigate("/register")}>
            Start Free
          </Button>
        </div>

        <button
          type="button"
          aria-label="Open navigation"
          onClick={() => setOpen((value) => !value)}
          className="grid h-10 w-10 place-items-center rounded-lg border border-slate-300/70 bg-white/70 lg:hidden dark:border-white/15 dark:bg-white/10"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-3 max-w-7xl rounded-lg border border-slate-300/60 bg-white/95 p-3 shadow-xl backdrop-blur-2xl lg:hidden dark:border-white/[0.12] dark:bg-black/85"
        >
          <div className="grid gap-1">
            {publicSections.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-950/5 dark:text-slate-200 dark:hover:bg-white/10"
                >
                  <Icon className="h-4 w-4 text-cyan-500" />
                  {item.label}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3 dark:border-white/10">
            <ThemeToggle />
            <div className="flex items-center gap-2">
              <Link onClick={() => setOpen(false)} to="/login" className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Login
              </Link>
              <Button type="button" onClick={() => navigate("/register")} className="min-h-10 px-4">
                Start
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
}
