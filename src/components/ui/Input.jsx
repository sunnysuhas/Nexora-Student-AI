import { cn } from "../../utils/cn";

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "min-h-11 w-full rounded-lg border border-slate-300/70 bg-white/70 px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/40 dark:border-white/15 dark:!bg-slate-950/60 dark:text-white dark:placeholder:text-slate-400",
        className
      )}
      {...props}
    />
  );
}
