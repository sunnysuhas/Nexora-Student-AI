import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { navItems } from "../data/nav";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/Button";
import { cn } from "../utils/cn";

export function Navbar({ landingActive = "hero" }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (item) => {
    if (item.path === "/") return location.pathname === "/" && landingActive === "hero";
    return location.pathname === item.path;
  };

  const goHome = (event) => {
    event.preventDefault();
    setOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      return;
    }
    document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed left-0 right-0 top-4 z-50 px-4">
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-lg border border-slate-300/60 bg-white/70 px-4 py-3 text-slate-900 shadow-2xl shadow-cyan-950/10 backdrop-blur-2xl transition dark:border-white/[0.12] dark:bg-black/[0.35] dark:text-white">
        <Link to="/" onClick={goHome} className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-slate-950 text-cyan-300 shadow-glow dark:bg-white dark:text-slate-950">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold">Nexora AI</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            const props = item.path === "/" ? { onClick: goHome } : {};
            return (
              <Link
                key={item.path}
                to={item.path}
                {...props}
                className={cn(
                  "relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white",
                  active && "text-slate-950 dark:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
                {active && (
                  <motion.span
                    layoutId="nav-glow"
                    className="absolute inset-x-2 -bottom-1 h-0.5 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 shadow-glow"
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <Button as="a" className="min-h-10 px-4" onClick={() => navigate("/login")}>
            Login
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
          className="mx-auto mt-3 max-w-7xl rounded-lg border border-slate-300/60 bg-white/90 p-3 shadow-xl backdrop-blur-2xl lg:hidden dark:border-white/[0.12] dark:bg-black/75"
        >
          <div className="grid gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const props = item.path === "/" ? { onClick: goHome } : { onClick: () => setOpen(false) };
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  {...props}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-950/5 dark:text-slate-200 dark:hover:bg-white/10"
                >
                  <Icon className="h-4 w-4 text-cyan-500" />
                  {item.label}
                </Link>
              );
            })}
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3 dark:border-white/10">
            <ThemeToggle />
            <Button onClick={() => navigate("/login")} className="min-h-10 px-4">
              Login
            </Button>
          </div>
        </motion.div>
      )}
    </header>
  );
}
