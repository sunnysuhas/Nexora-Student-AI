import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

const variants = {
  primary:
    "bg-slate-950 text-white shadow-glow hover:bg-slate-900 dark:bg-white dark:text-slate-950 dark:hover:bg-cyan-50",
  secondary:
    "border border-slate-300/70 bg-white/60 text-slate-900 hover:border-cyan-400 hover:text-cyan-700 dark:border-white/15 dark:!bg-slate-950/60 dark:text-white dark:hover:border-cyan-300 dark:hover:text-cyan-100",
  ghost:
    "text-slate-700 hover:bg-slate-950/5 dark:text-slate-200 dark:hover:bg-white/10",
};

export function Button({ className, variant = "primary", children, ...props }) {
  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
