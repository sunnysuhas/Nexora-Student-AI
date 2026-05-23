import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useAppStore } from "../store/useAppStore";

export function ThemeToggle() {
  const { theme, toggleTheme } = useAppStore();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative flex h-10 w-20 items-center rounded-full border border-slate-300/70 bg-white/70 p-1 text-slate-800 transition dark:border-white/15 dark:bg-white/10 dark:text-white"
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
        className="absolute h-8 w-8 rounded-full bg-slate-950 shadow-glow dark:bg-white"
        animate={{ x: isDark ? 38 : 0 }}
      />
      <span className="relative z-10 flex w-full items-center justify-between px-1">
        <Sun className="h-4 w-4" />
        <Moon className="h-4 w-4" />
      </span>
    </button>
  );
}
