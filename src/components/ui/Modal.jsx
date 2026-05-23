import { X } from "lucide-react";
import { motion } from "framer-motion";

export function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/70 px-4 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass w-full max-w-xl rounded-lg p-5 text-slate-950 shadow-glow dark:text-white"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-2xl font-bold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="grid h-9 w-9 place-items-center rounded-lg bg-slate-950/5 text-slate-700 transition hover:bg-slate-950/10 dark:bg-white/10 dark:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </motion.div>
    </div>
  );
}
