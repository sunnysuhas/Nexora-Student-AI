import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Card } from "./ui/Card";

export function StatCard({ label, value, detail, icon: Icon, tone = "cyan" }) {
  const toneMap = {
    cyan: "from-cyan-400/25 to-sky-400/10 text-cyan-600 dark:text-cyan-200",
    violet: "from-violet-500/25 to-fuchsia-500/10 text-violet-600 dark:text-violet-200",
    emerald: "from-emerald-400/25 to-teal-400/10 text-emerald-600 dark:text-emerald-200",
    amber: "from-amber-400/25 to-orange-400/10 text-amber-600 dark:text-amber-200",
  };

  return (
    <Card tilt className="relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${toneMap[tone]} opacity-80`} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-300">{label}</p>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 font-display text-3xl font-bold text-slate-950 dark:text-white"
          >
            {value}
          </motion.p>
          <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
            <ArrowUpRight className="h-3.5 w-3.5" />
            {detail}
          </p>
        </div>
        <span className="grid h-11 w-11 place-items-center rounded-lg bg-white/[0.55] text-slate-900 shadow-sm dark:bg-white/10 dark:text-white">
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </Card>
  );
}
