import { motion } from "framer-motion";

export function LoadingScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-50 text-slate-950 dark:bg-void dark:text-white"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.55 } }}
    >
      <div className="text-center">
        <motion.div
          className="mx-auto mb-6 h-16 w-16 rounded-full border border-cyan-300/40 bg-cyan-300/10 shadow-glow"
          animate={{ scale: [1, 1.18, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <p className="font-display text-2xl font-bold tracking-normal">Nexora AI</p>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Booting your academic operating system</p>
      </div>
    </motion.div>
  );
}
