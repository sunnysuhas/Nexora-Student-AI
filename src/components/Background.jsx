import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

export function CursorGlow() {
  const [position, setPosition] = useState({ x: -500, y: -500 });

  useEffect(() => {
    const handleMove = (event) => setPosition({ x: event.clientX, y: event.clientY });
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  return <div className="cursor-glow hidden lg:block" style={{ left: position.x, top: position.y }} />;
}

export function ParticleField() {
  const particles = useMemo(
    () =>
      Array.from({ length: 38 }, (_, index) => ({
        id: index,
        left: `${(index * 29) % 100}%`,
        top: `${(index * 47) % 100}%`,
        duration: 7 + (index % 9),
        delay: (index % 6) * 0.35,
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-slate-50 text-slate-950 transition-colors duration-500 dark:bg-void dark:text-white">
      <div className="absolute inset-0 animated-grid animate-grid-shift opacity-45 dark:opacity-55" />
      <div className="absolute left-[-14%] top-[-18%] h-[34rem] w-[34rem] rounded-full bg-cyan-400/25 blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-[-20%] right-[-14%] h-[38rem] w-[38rem] rounded-full bg-violet-500/22 blur-3xl animate-pulse-glow" />
      <div className="absolute left-[35%] top-[28%] h-[24rem] w-[24rem] rounded-full bg-emerald-400/10 blur-3xl" />
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute h-1 w-1 rounded-full bg-cyan-400/70 shadow-[0_0_16px_rgba(0,217,255,0.9)]"
          style={{ left: particle.left, top: particle.top }}
          animate={{ y: [0, -22, 0], opacity: [0.25, 1, 0.25] }}
          transition={{ duration: particle.duration, delay: particle.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,transparent,rgba(248,251,255,0.82)_72%)] dark:bg-[radial-gradient(circle_at_top,transparent,rgba(5,5,5,0.92)_72%)]" />
    </div>
  );
}
