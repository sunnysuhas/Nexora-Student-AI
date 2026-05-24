import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BellRing,
  Bot,
  CalendarCheck,
  CheckCircle2,
  Clock,
  GraduationCap,
  Layers3,
  LockKeyhole,
  NotebookText,
  Radar,
  Sparkles,
  Target,
  TimerReset,
  Zap,
} from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useActiveSection } from "../hooks/useActiveSection";

const typingWords = ["Smart Productivity", "AI Study Planning", "Attendance Tracking", "Intelligent Academic Management"];

const featureCards = [
  [CheckCircle2, "Task command center", "Plan assignments, subtasks, priority, recurring work, and reminders from one student-first workspace."],
  [CalendarCheck, "Attendance intelligence", "Track every subject, detect shortage risk, and see what needs attention before it becomes urgent."],
  [Bot, "AI planning assistant", "Generate study schedules, prioritize deadlines, and turn academic pressure into a focused next action."],
  [NotebookText, "Notes and knowledge", "Capture quick notes, organize categories, pin important material, and search your academic memory."],
];

const workflow = [
  ["Capture", "Add tasks, subjects, exams, assignments, and study goals as they appear."],
  ["Prioritize", "Nexora turns deadlines, attendance risk, and goals into a clean daily plan."],
  ["Focus", "Run focused sessions, complete work, and keep your week visible."],
  ["Reflect", "Use analytics and AI summaries to improve your next study cycle."],
];

const previewCards = [
  ["Today", "3 focus blocks", "Assignments, exams, and reminders collapse into a clean daily plan."],
  ["Attendance", "Risk-aware", "Subject-wise warnings help students protect minimum attendance."],
  ["AI Planner", "Contextual", "Suggestions are based on student workflows, not random chat."],
];

function TypingLine() {
  return (
    <span className="inline-flex h-8 overflow-hidden align-bottom text-cyan-500 dark:text-cyan-300">
      <motion.span
        animate={{ y: ["0%", "-25%", "-50%", "-75%", "0%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="flex flex-col"
      >
        {typingWords.map((word) => (
          <span key={word} className="h-8">
            {word}
          </span>
        ))}
        <span className="h-8">{typingWords[0]}</span>
      </motion.span>
    </span>
  );
}

export function Landing() {
  const navigate = useNavigate();
  const active = useActiveSection(["hero", "features", "workflow", "screenshots", "mobile", "testimonials", "cta"]);

  return (
    <div className="text-slate-950 dark:text-white">
      <Navbar landingActive={active} />

      <section id="hero" className="relative flex min-h-screen items-center overflow-hidden px-4 pb-20 pt-32">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-600 dark:text-cyan-200"
            >
              <Sparkles className="h-4 w-4" />
              AI-powered student planning operating system
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="font-display text-6xl font-bold leading-[0.95] tracking-normal text-balance sm:text-7xl lg:text-8xl"
            >
              Nexora AI
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="mt-7 max-w-2xl text-xl leading-8 text-slate-600 dark:text-slate-300"
            >
              AI-Powered Student Productivity Operating System for <TypingLine />.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <Button type="button" onClick={() => navigate("/register")}>
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
              <Button type="button" variant="secondary" onClick={() => document.getElementById("screenshots")?.scrollIntoView({ behavior: "smooth" })}>
                Explore Dashboard Preview
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.75 }}
            className="relative"
          >
            <div className="absolute -inset-10 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="glass relative overflow-hidden rounded-lg p-4 shadow-glow">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Student workspace preview</p>
                  <h2 className="font-display text-2xl font-bold">Planning OS</h2>
                </div>
                <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-300">Private</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {previewCards.map(([label, value, body]) => (
                  <div key={label} className="rounded-lg border border-slate-300/60 bg-white/60 p-4 dark:border-white/10 dark:!bg-slate-950/60">
                    <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
                    <p className="mt-2 font-display text-2xl font-bold">{value}</p>
                    <p className="mt-3 text-xs leading-5 text-slate-600 dark:text-slate-300">{body}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg border border-slate-300/60 bg-white/50 p-4 dark:border-white/10 dark:bg-black/20">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-bold">AI weekly planner</span>
                  <Radar className="h-5 w-5 text-cyan-500" />
                </div>
                <div className="grid gap-3">
                  {["Review attendance shortage before Friday", "Finish high-priority assignment first", "Schedule two 25-minute focus blocks"].map((item, index) => (
                    <div key={item} className="flex items-center gap-3 rounded-lg bg-slate-950/5 p-3 dark:bg-white/10">
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-400/15 text-sm font-bold text-cyan-600 dark:text-cyan-300">
                        {index + 1}
                      </span>
                      <p className="text-sm font-semibold">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="px-4 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeader eyebrow="Core Platform" title="A focused workspace for the academic work students actually do." />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {featureCards.map(([Icon, title, body], index) => (
              <Card key={title} tilt delay={index * 0.05}>
                <Icon className="mb-8 h-7 w-7 text-cyan-500" />
                <h3 className="font-display text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="px-4 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionHeader eyebrow="AI Productivity Workflow" title="From scattered academic pressure to one prioritized plan." align="left" />
            <p className="max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              Nexora AI is designed as a planner, not a generic chatbot. It reads the student workspace context and turns it into study schedules, reminder ideas, attendance warnings, and deadline decisions.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {workflow.map(([title, body], index) => (
              <Card key={title} delay={index * 0.06} className="relative overflow-hidden">
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-cyan-400/15 font-display text-lg font-bold text-cyan-600 dark:text-cyan-300">
                  {index + 1}
                </span>
                <h3 className="mt-6 font-display text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="screenshots" className="px-4 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeader eyebrow="Application Preview" title="Private SaaS screens designed for real student workflows." />
          <div className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
            <Card className="overflow-hidden p-0">
              <div className="border-b border-slate-200 px-5 py-4 dark:border-white/10">
                <p className="text-sm font-bold text-cyan-600 dark:text-cyan-300">Dashboard preview</p>
                <h3 className="font-display text-2xl font-bold">Student planning dashboard</h3>
              </div>
              <div className="grid gap-4 p-5 md:grid-cols-3">
                {[
                  [Target, "Today's Tasks", "Contextual task queue with empty states."],
                  [BellRing, "Reminders", "Deadline and attendance alerts."],
                  [TimerReset, "Focus Timer", "Pomodoro sessions for study blocks."],
                  [GraduationCap, "Subjects", "Attendance and shortage tracking."],
                  [Clock, "Exams", "Countdowns and calendar planning."],
                  [Bot, "AI Suggestions", "Student-specific planning prompts."],
                ].map(([Icon, title, body]) => (
                  <div key={title} className="rounded-lg border border-slate-300/60 bg-white/60 p-4 dark:border-white/10 dark:bg-slate-950/60">
                    <Icon className="mb-5 h-5 w-5 text-cyan-500" />
                    <p className="font-display font-bold">{title}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">{body}</p>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <LockKeyhole className="mb-6 h-7 w-7 text-cyan-500" />
              <h3 className="font-display text-2xl font-bold">Private by default</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Internal pages unlock only after verified login and onboarding. Student data stays isolated by account.
              </p>
              <div className="mt-6 grid gap-2">
                {["Protected dashboard", "Mandatory onboarding", "Role-based admin access"].map((item) => (
                  <p key={item} className="rounded-lg bg-slate-950/5 px-3 py-2 text-sm font-semibold dark:bg-white/10">{item}</p>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section id="mobile" className="px-4 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-2">
          <SectionHeader eyebrow="Mobile Experience" title="An app-like workspace for students on the move." align="left" />
          <Card className="mx-auto w-full max-w-sm">
            <div className="rounded-[2rem] border border-slate-300/60 bg-slate-950 p-4 text-white shadow-glow dark:border-white/10">
              <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-white/30" />
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Today</p>
                <h3 className="mt-2 font-display text-2xl font-bold">Plan the next block</h3>
                <div className="mt-5 grid gap-2">
                  {["Add Task", "Add Assignment", "Start Focus"].map((item) => (
                    <div key={item} className="rounded-xl bg-white/10 px-3 py-3 text-sm font-semibold">{item}</div>
                  ))}
                </div>
              </div>
              <div className="mt-4 grid grid-cols-5 gap-2 text-center text-[10px] text-slate-300">
                {["Dash", "Tasks", "AI", "Stats", "Profile"].map((item, index) => (
                  <span key={item} className={index === 0 ? "rounded-lg bg-cyan-400/20 py-2 text-cyan-200" : "py-2"}>{item}</span>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section id="testimonials" className="px-4 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeader eyebrow="Student Benefits" title="Built around practical habits, not dashboard noise." />
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Deadline confidence", "Students can see what matters today without opening multiple disconnected tools."],
              ["Attendance clarity", "Subject-wise tracking helps prevent shortage surprises near exams."],
              ["Focused planning", "AI suggestions stay tied to study schedules, priorities, and academic goals."],
            ].map(([title, body], index) => (
              <Card key={title} tilt delay={index * 0.07}>
                <Zap className="mb-6 h-5 w-5 text-cyan-500" />
                <h3 className="font-display text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="cta" className="px-4 py-24">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-300">Start Planning</p>
          <h2 className="mt-4 font-display text-4xl font-bold text-balance sm:text-6xl">Build a student workspace that remembers what matters.</h2>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/register">
              <Button className="w-full sm:w-auto">Create Account</Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" className="w-full sm:w-auto">Login</Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 px-4 py-8 text-center text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
        Nexora AI - AI-powered student planning, attendance, assignments, reminders, notes, and focus workflows.
      </footer>
    </div>
  );
}

function SectionHeader({ eyebrow, title, align = "center" }) {
  return (
    <div className={align === "center" ? "mx-auto mb-12 max-w-3xl text-center" : "mb-6 max-w-xl"}>
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-300">{eyebrow}</p>
      <h2 className="mt-4 font-display text-3xl font-bold text-balance sm:text-5xl">{title}</h2>
    </div>
  );
}
