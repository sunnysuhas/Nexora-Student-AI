export const weeklyProductivity = [
  { day: "Mon", focus: 3.2, tasks: 6, energy: 78 },
  { day: "Tue", focus: 4.5, tasks: 9, energy: 86 },
  { day: "Wed", focus: 2.8, tasks: 5, energy: 70 },
  { day: "Thu", focus: 5.1, tasks: 11, energy: 92 },
  { day: "Fri", focus: 4.1, tasks: 8, energy: 84 },
  { day: "Sat", focus: 3.7, tasks: 7, energy: 81 },
  { day: "Sun", focus: 2.2, tasks: 4, energy: 66 },
];

export const deadlines = [
  { title: "Data Structures lab report", due: "Today, 8:00 PM", type: "Assignment", tone: "rose" },
  { title: "AI midterm revision", due: "Tomorrow, 10:00 AM", type: "Exam", tone: "amber" },
  { title: "DBMS attendance recovery", due: "Friday", type: "Attendance", tone: "cyan" },
];

export const recommendations = [
  "Protect a 90-minute focus block before the AI midterm.",
  "Move low-priority tasks after your 4 PM class window.",
  "Attendance risk detected in DBMS: attend the next two lectures.",
];

export const calendarEvents = [
  { date: 3, label: "AI Quiz", color: "bg-violet-500" },
  { date: 8, label: "OS Lab", color: "bg-cyan-500" },
  { date: 12, label: "Math Exam", color: "bg-rose-500" },
  { date: 18, label: "Project Review", color: "bg-emerald-500" },
  { date: 25, label: "Hackathon", color: "bg-amber-500" },
];

export const testimonials = [
  {
    name: "Aarav M.",
    role: "Computer Science student",
    quote: "Nexora feels like my academic command center. I know what matters before the day gets noisy.",
  },
  {
    name: "Maya S.",
    role: "Engineering student",
    quote: "The focus timer, reminders, and AI prompts made my exam week feel planned instead of chaotic.",
  },
  {
    name: "Dev R.",
    role: "Design student",
    quote: "It has the polish of a real SaaS product and the usefulness of a student dashboard I actually open.",
  },
];

export const heatmap = Array.from({ length: 35 }, (_, index) => ({
  id: index,
  level: [1, 2, 3, 4, 5][(index * 7 + 3) % 5],
}));
