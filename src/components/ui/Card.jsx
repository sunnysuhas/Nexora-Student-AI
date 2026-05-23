import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export function Card({ className, children, tilt = false, delay = 0, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay }}
      className={cn(
        "glass rounded-lg p-5 shadow-xl shadow-slate-950/10 dark:shadow-black/25",
        tilt && "tilt-card hover:border-cyan-300/50 hover:shadow-glow",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
