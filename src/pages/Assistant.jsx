import { useEffect, useMemo, useState } from "react";
import { Bot, Mic, Send, Sparkles, Trash2, WandSparkles } from "lucide-react";
import { motion } from "framer-motion";
import { AppShell } from "../layouts/AppShell";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useAppStore } from "../store/useAppStore";
import { attendancePercent, daysUntil } from "../utils/productivity";

const prompts = [
  "Generate a study schedule for this week",
  "Suggest my task priorities",
  "Analyze my attendance shortage",
  "Create a daily productivity summary",
];

export function Assistant() {
  const { aiChats, askAssistant, startAiChat, tasks, assignments, subjects, exams } = useAppStore();
  const [activeChatId, setActiveChatId] = useState(aiChats[0]?.id || "");
  const [input, setInput] = useState("");
  const activeChat = aiChats.find((chat) => chat.id === activeChatId) || aiChats[0];

  useEffect(() => {
    if (!aiChats.length) {
      setActiveChatId(startAiChat());
    } else if (!activeChatId) {
      setActiveChatId(aiChats[0].id);
    }
  }, [activeChatId, aiChats, startAiChat]);

  const contextSuggestions = useMemo(() => {
    const urgentAssignment = assignments.map((item) => ({ ...item, remaining: daysUntil(item.dueDate) })).sort((a, b) => a.remaining - b.remaining)[0];
    const riskySubject = subjects.map((item) => ({ ...item, percent: attendancePercent(item) })).sort((a, b) => a.percent - b.percent)[0];
    const nextExam = exams.map((item) => ({ ...item, remaining: daysUntil(item.date) })).sort((a, b) => a.remaining - b.remaining)[0];
    return [
      urgentAssignment ? `You have ${urgentAssignment.title} due in ${urgentAssignment.remaining} days.` : "No urgent assignments detected.",
      riskySubject ? `${riskySubject.name || riskySubject.subject} attendance is ${riskySubject.percent}%; attend the next classes first.` : "Attendance is stable.",
      nextExam ? `${nextExam.title} exam is in ${Math.max(0, nextExam.remaining)} days.` : "No exams scheduled yet.",
      `${tasks.filter((task) => task.status !== "Completed").length} active tasks need scheduling.`,
    ];
  }, [assignments, exams, subjects, tasks]);

  const send = (text = input) => {
    if (!text.trim() || !activeChat) return;
    const allowed = /(study|schedule|task|assignment|attendance|deadline|exam|focus|productivity|reminder|weekly|daily|plan|priority|note|goal)/i;
    if (allowed.test(text)) askAssistant(activeChat.id, text);
    else askAssistant(activeChat.id, "off-topic request");
    setInput("");
  };

  return (
    <AppShell title="AI Assistant" eyebrow="Groq-ready Productivity Copilot">
      <div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <Card className="flex min-h-[72vh] flex-col">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-lg bg-cyan-400/15 text-cyan-500">
                <Bot className="h-6 w-6" />
              </span>
              <div>
                <h2 className="font-display text-2xl font-bold">Nexora Copilot</h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">Study planning, priority suggestions, attendance warnings, and weekly summaries</p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-300">
              Groq API ready
            </span>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto pr-1">
            {activeChat?.messages.map((message, index) => (
              <motion.div
                key={`${message.role}-${index}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[86%] rounded-lg px-4 py-3 text-sm leading-6 ${
                    message.role === "user"
                      ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                      : "border border-slate-300/60 bg-white/60 text-slate-800 dark:border-white/10 dark:!bg-slate-950/60 dark:text-slate-200"
                  }`}
                >
                  {message.text}
                </div>
              </motion.div>
            ))}
            <div className="flex items-center gap-2 text-sm text-cyan-600 dark:text-cyan-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
              Saved AI history active
            </div>
          </div>

          <div className="mt-5 flex gap-3">
            <Input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask for a study plan, attendance analysis, deadline priority, or focus schedule..." onKeyDown={(event) => event.key === "Enter" && send()} />
            <Button onClick={() => send()} aria-label="Send message" className="px-4">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        <div className="grid gap-4">
          <Card>
            <h3 className="font-display text-xl font-bold">Recent conversations</h3>
            <div className="mt-5 grid gap-2">
              {aiChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setActiveChatId(chat.id)}
                  className={`flex items-center justify-between rounded-lg p-3 text-left text-sm font-semibold ${activeChatId === chat.id ? "bg-cyan-400/15 text-cyan-700 dark:text-cyan-300" : "bg-slate-950/5 dark:bg-white/10"}`}
                >
                  {chat.title}
                  <Trash2 className="h-4 w-4 opacity-40" />
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-display text-xl font-bold">Suggested prompts</h3>
            <div className="mt-5 grid gap-3">
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => send(prompt)}
                  className="flex items-center gap-3 rounded-lg border border-slate-300/60 bg-white/50 p-3 text-left text-sm font-semibold transition hover:border-cyan-400 dark:border-white/10 dark:!bg-slate-950/50"
                >
                  <Sparkles className="h-4 w-4 text-cyan-500" />
                  {prompt}
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-display text-xl font-bold">Voice preview</h3>
            <div className="mt-6 flex items-center gap-4">
              <button className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 text-white shadow-glow">
                <Mic className="h-7 w-7" />
              </button>
              <div className="flex-1">
                <p className="font-semibold">Voice assistant shell</p>
                <div className="mt-3 flex h-9 items-end gap-1">
                  {Array.from({ length: 18 }, (_, index) => (
                    <motion.span
                      key={index}
                      className="w-1 flex-1 rounded-full bg-cyan-400"
                      animate={{ height: [8, 28 + ((index * 7) % 28), 10] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: index * 0.04 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-display text-xl font-bold">Smart suggestions</h3>
            <div className="mt-5 space-y-3 text-sm text-slate-700 dark:text-slate-300">
              {contextSuggestions.map((item) => (
                <p key={item} className="flex gap-3 rounded-lg bg-slate-950/5 p-3 dark:!bg-slate-950/50">
                  <WandSparkles className="h-4 w-4 shrink-0 text-violet-500" />
                  {item}
                </p>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
