import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Brain,
  CalendarCheck,
  Clock,
  Download,
  ExternalLink,
  Mail,
  Send,
  Server,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Navbar } from "../components/Navbar";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useActiveSection } from "../hooks/useActiveSection";
import { heatmap, testimonials, weeklyProductivity } from "../data/mock";
import { projects } from "../data/projects";
import { backendBlueprint } from "../data/backendBlueprint";
import { sendContactMessage } from "../utils/contactService";
import { useAppStore } from "../store/useAppStore";

const typingWords = ["Smart Productivity", "AI Study Assistant", "Focus Tracking", "Intelligent Academic Management"];
const resumeUrl = "/resume/N_Suhas_Resume.pdf";

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
  const active = useActiveSection([
    "hero",
    "features",
    "showcase",
    "analytics-preview",
    "testimonials",
    "stats",
    "projects",
    "resume",
    "contact",
    "stack",
    "cta",
  ]);

  return (
    <div className="text-slate-950 dark:text-white">
      <Navbar landingActive={active} />

      <section id="hero" className="relative flex min-h-screen items-center overflow-hidden px-4 pb-20 pt-32">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-600 dark:text-cyan-200"
            >
              <Sparkles className="h-4 w-4" />
              AI-powered student productivity operating system
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
              Your AI-Powered Student Productivity Operating System for <TypingLine />.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <Button onClick={() => document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" })}>
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
              <Link to="/dashboard">
                <Button variant="secondary" className="w-full sm:w-auto">
                  Explore Dashboard
                </Button>
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.75 }}
            className="relative"
          >
            <div className="absolute -inset-8 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="glass relative rounded-lg p-4 shadow-glow">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Today's academic pulse</p>
                  <h2 className="font-display text-2xl font-bold">Command Center</h2>
                </div>
                <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-300">Live</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["Productivity", "92%", Zap],
                  ["Attendance", "86%", CalendarCheck],
                  ["Focus", "4.5h", Clock],
                  ["AI Actions", "12", Brain],
                ].map(([label, value, Icon]) => (
                  <div key={label} className="rounded-lg border border-slate-300/60 bg-white/60 p-4 dark:border-white/10 dark:!bg-slate-950/60">
                    <Icon className="mb-5 h-5 w-5 text-cyan-500" />
                    <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
                    <p className="mt-1 font-display text-3xl font-bold">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 h-56 rounded-lg border border-slate-300/60 bg-white/50 p-3 dark:border-white/10 dark:bg-black/20">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyProductivity}>
                    <defs>
                      <linearGradient id="landingFocus" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#00D9FF" stopOpacity={0.55} />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="currentColor" opacity={0.5} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ borderRadius: 8, border: "0", background: "#0F172A", color: "#fff" }} />
                    <Area type="monotone" dataKey="energy" stroke="#00D9FF" fill="url(#landingFocus)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="px-4 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeader eyebrow="Core System" title="Everything students usually spread across six apps, unified." />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              [Bot, "AI academic assistant", "Ask, plan, summarize, and get next-best study actions."],
              [CalendarCheck, "Deadline intelligence", "Assignments, exams, attendance, and reminders in one pulse."],
              [BarChart3, "Productivity analytics", "Understand focus trends, completion velocity, and study load."],
              [ShieldCheck, "Local-first persistence", "Tasks, notes, users, contact messages, and preferences save locally now."],
            ].map(([Icon, title, body], index) => (
              <Card key={title} tilt delay={index * 0.05}>
                <Icon className="mb-8 h-7 w-7 text-cyan-500" />
                <h3 className="font-display text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="showcase" className="px-4 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-2">
          <SectionHeader eyebrow="AI Productivity Showcase" title="A study cockpit that thinks ahead." align="left" />
          <div className="grid gap-4">
            {["Prepare a 2-hour revision plan", "Convert notes into flashcards", "Detect attendance risk before it hurts"].map((text, index) => (
              <Card key={text} tilt delay={index * 0.07} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-lg bg-cyan-400/15 text-cyan-500">
                    <Brain className="h-5 w-5" />
                  </span>
                  <p className="font-semibold">{text}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-cyan-500" />
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="analytics-preview" className="px-4 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeader eyebrow="Smart Analytics Preview" title="Readable signals from your academic week." />
          <div className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
            <Card className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyProductivity}>
                  <defs>
                    <linearGradient id="previewFocus" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#38BDF8" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="#38BDF8" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="currentColor" opacity={0.5} />
                  <YAxis stroke="currentColor" opacity={0.35} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "0", background: "#0F172A", color: "#fff" }} />
                  <Area type="monotone" dataKey="focus" stroke="#38BDF8" fill="url(#previewFocus)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
            <Card>
              <p className="font-display text-xl font-bold">Focus Heatmap</p>
              <div className="mt-6 grid grid-cols-7 gap-2">
                {heatmap.map((cell) => (
                  <span
                    key={cell.id}
                    className="aspect-square rounded-md"
                    style={{ backgroundColor: `rgba(0, 217, 255, ${0.15 + cell.level * 0.14})` }}
                  />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section id="testimonials" className="px-4 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeader eyebrow="Student Proof" title="Built for the rhythm of real academic life." />
          <div className="grid gap-4 md:grid-cols-3">
            {testimonials.map((item, index) => (
              <Card key={item.name} tilt delay={index * 0.07}>
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">"{item.quote}"</p>
                <p className="mt-6 font-display font-bold">{item.name}</p>
                <p className="text-sm text-cyan-600 dark:text-cyan-300">{item.role}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="stats" className="px-4 py-24">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
          {[
            ["92%", "average productivity score"],
            ["4.5h", "daily focus tracked"],
            ["38", "tasks organized weekly"],
            ["86%", "attendance visibility"],
          ].map(([value, label]) => (
            <Card key={label} className="text-center">
              <p className="font-display text-5xl font-bold">{value}</p>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{label}</p>
            </Card>
          ))}
        </div>
      </section>

      <ProjectsSection />
      <ResumeSection />
      <ContactSection />
      <StackSection />

      <section id="cta" className="px-4 py-24">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-300">Launch Nexora</p>
          <h2 className="mt-4 font-display text-4xl font-bold text-balance sm:text-6xl">Turn your semester into a focused operating system.</h2>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/register">
              <Button className="w-full sm:w-auto">Create Account</Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="secondary" className="w-full sm:w-auto">
                Open Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 px-4 py-8 text-center text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
        Nexora AI - Student productivity, focus, analytics, reminders, and academic assistance.
      </footer>
    </div>
  );
}

function ProjectsSection() {
  return (
    <section id="projects" className="px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Project System" title="Capstone-ready project portfolio built for future editing." />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => {
            const Icon = project.icon;
            return (
              <Card key={project.title} tilt delay={index * 0.04}>
                <div className="flex items-start justify-between gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-lg bg-cyan-400/15 text-cyan-500">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="rounded-full bg-violet-400/15 px-3 py-1 text-xs font-bold text-violet-600 dark:text-violet-300">
                    {project.status}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-xl font-bold">{project.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{project.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-950/5 px-2 py-1 text-xs font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ResumeSection() {
  return (
    <section id="resume" className="px-4 py-24">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-300">Resume</p>
          <h2 className="mt-4 font-display text-4xl font-bold text-balance">Recruiter-ready resume preview and direct download.</h2>
          <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Add the PDF at <span className="font-semibold text-slate-950 dark:text-white">public/resume/N_Suhas_Resume.pdf</span>.
            The preview and download links are already wired for deployment.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a href={resumeUrl} download>
              <Button className="w-full sm:w-auto">
                <Download className="h-4 w-4" />
                Download Resume
              </Button>
            </a>
            <a href={resumeUrl} target="_blank" rel="noreferrer">
              <Button variant="secondary" className="w-full sm:w-auto">
                <ExternalLink className="h-4 w-4" />
                Open Preview
              </Button>
            </a>
          </div>
        </Card>
        <Card className="min-h-[28rem] overflow-hidden p-0">
          <div className="flex h-12 items-center justify-between border-b border-slate-200 px-4 text-sm font-semibold dark:border-white/10">
            <span>N_Suhas_Resume.pdf</span>
            <span className="text-cyan-600 dark:text-cyan-300">PDF preview</span>
          </div>
          <iframe title="N Suhas resume preview" src={resumeUrl} className="h-[28rem] w-full bg-white" />
        </Card>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="px-4 py-24">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <SectionHeader eyebrow="Contact" title="Send a message into the Nexora channel." align="left" />
          <Card className="mt-4">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-cyan-400/15 text-cyan-500">
                <Mail className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold">Target inbox</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">sunnysuhas108@gmail.com</p>
              </div>
            </div>
          </Card>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}

function ContactForm() {
  const addContactMessage = useAppStore((state) => state.addContactMessage);
  const [status, setStatus] = useState("idle");
  const [notice, setNotice] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const payload = {
      name: form.get("name")?.toString().trim(),
      email: form.get("email")?.toString().trim(),
      message: form.get("message")?.toString().trim(),
    };

    if (!payload.name || !/^\S+@\S+\.\S+$/.test(payload.email) || !payload.message) {
      setStatus("error");
      setNotice("Please enter a name, valid email, and message.");
      return;
    }

    setStatus("loading");
    setNotice("");
    try {
      const result = await sendContactMessage(payload);
      addContactMessage({ ...payload, destination: "sunnysuhas108@gmail.com", simulated: Boolean(result.simulated) });
      formElement.reset();
      setStatus("success");
      setNotice(result.simulated ? result.message : "Message sent successfully.");
    } catch (error) {
      setStatus("error");
      setNotice(error.message || "Unable to send message.");
    }
  };

  return (
    <Card>
      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold">Name</span>
          <input name="name" className="min-h-11 w-full rounded-lg border border-slate-300/70 bg-white/70 px-4 text-sm text-slate-950 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/40 dark:border-white/15 dark:!bg-slate-950/60 dark:text-white" placeholder="Your name" />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold">Email</span>
          <input name="email" type="email" className="min-h-11 w-full rounded-lg border border-slate-300/70 bg-white/70 px-4 text-sm text-slate-950 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/40 dark:border-white/15 dark:!bg-slate-950/60 dark:text-white" placeholder="you@example.com" />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold">Message</span>
          <textarea name="message" className="min-h-36 w-full rounded-lg border border-slate-300/70 bg-white/70 p-4 text-sm text-slate-950 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/40 dark:border-white/15 dark:!bg-slate-950/60 dark:text-white" placeholder="Tell me about an opportunity, feedback, or collaboration..." />
        </label>
        {notice && (
          <p className={`rounded-lg p-3 text-sm font-semibold ${status === "error" ? "bg-rose-400/15 text-rose-600 dark:text-rose-300" : "bg-emerald-400/15 text-emerald-600 dark:text-emerald-300"}`}>
            {notice}
          </p>
        )}
        <Button type="submit" disabled={status === "loading"} className="w-full">
          <Send className="h-4 w-4" />
          {status === "loading" ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </Card>
  );
}

function StackSection() {
  return (
    <section id="stack" className="px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Full-stack Ready" title="Frontend today, Node + Express + MongoDB tomorrow." />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {backendBlueprint.map((item, index) => (
            <Card key={item.title} tilt delay={index * 0.05}>
              <Server className="mb-6 h-6 w-6 text-cyan-500" />
              <h3 className="font-display text-xl font-bold">{item.title}</h3>
              <div className="mt-4 space-y-2">
                {item.items.map((entry) => (
                  <p key={entry} className="rounded-lg bg-slate-950/5 px-3 py-2 text-sm text-slate-600 dark:bg-white/10 dark:text-slate-300">
                    {entry}
                  </p>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
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
