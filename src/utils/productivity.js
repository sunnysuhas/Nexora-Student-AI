export function normalizeId(item) {
  if (!item) return item;
  return { ...item, id: item.id || item._id };
}

export function daysUntil(date) {
  if (!date) return Number.POSITIVE_INFINITY;
  const today = new Date();
  const target = new Date(date);
  if (Number.isNaN(target.getTime())) return Number.POSITIVE_INFINITY;
  const diff = target.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0);
  return Math.ceil(diff / 86400000);
}

export function isOverdue(date) {
  return Number.isFinite(daysUntil(date)) && daysUntil(date) < 0;
}

export function taskStatus(task) {
  const legacy = { todo: "Pending", doing: "In Progress", review: "In Progress", done: "Completed" };
  const status = legacy[task.status] || task.status;
  if (status === "Completed") return "Completed";
  if (isOverdue(task.deadline || task.dueDate)) return "Overdue";
  return status || "Pending";
}

export function assignmentStatus(assignment) {
  const legacy = { Pending: "Not Started", Submitted: "Completed" };
  const status = legacy[assignment.status] || assignment.status;
  if (status === "Completed") return "Completed";
  if (isOverdue(assignment.dueDate)) return "Overdue";
  return status || "Not Started";
}

export function attendanceTotal(subject) {
  const present = Number(subject.present || 0);
  const absent = Number(subject.absent || 0);
  const holidays = Number(subject.holidays || 0);
  return Number(subject.totalClasses || present + absent + holidays);
}

export function attendancePercent(subject) {
  const present = Number(subject.present || 0);
  const holidays = Number(subject.holidays || 0);
  const total = attendanceTotal(subject);
  const counted = Math.max(0, total - holidays);
  if (!counted) return 100;
  return Math.round((present / counted) * 100);
}

export function overallAttendance(subjects) {
  const totals = subjects.reduce(
    (acc, subject) => {
      acc.present += Number(subject.present || 0);
      acc.counted += Math.max(0, attendanceTotal(subject) - Number(subject.holidays || 0));
      return acc;
    },
    { present: 0, counted: 0 }
  );
  return totals.counted ? Math.round((totals.present / totals.counted) * 100) : 100;
}

export function attendanceRecoveryClasses(subject) {
  const goal = Number(subject.goal || subject.attendanceGoal || 85);
  const present = Number(subject.present || 0);
  const counted = Math.max(0, attendanceTotal(subject) - Number(subject.holidays || 0));
  if (!counted || attendancePercent(subject) >= goal) return 0;
  return Math.max(1, Math.ceil(((goal / 100) * counted - present) / (1 - goal / 100)));
}

export function attendancePrediction(subject) {
  const current = attendancePercent(subject);
  const goal = Number(subject.goal || subject.attendanceGoal || 85);
  if (current >= goal) return "Safe attendance";
  return `Attend next ${attendanceRecoveryClasses(subject)} classes to reach ${goal}%`;
}

export function completedCount(items, resolver = (item) => item.status) {
  return items.filter((item) => resolver(item) === "Completed").length;
}

export function productivityScore({ tasks, assignments, subjects, goals }) {
  const taskCompletion = tasks.length ? (completedCount(tasks, taskStatus) / tasks.length) * 100 : 0;
  const assignmentCompletion = assignments.length ? (completedCount(assignments, assignmentStatus) / assignments.length) * 100 : 0;
  const goalCompletion = goals.length
    ? goals.reduce((sum, goal) => sum + Math.min(100, ((Number(goal.current) || 0) / (Number(goal.target) || 1)) * 100), 0) / goals.length
    : 0;
  return Math.round(taskCompletion * 0.35 + assignmentCompletion * 0.25 + overallAttendance(subjects) * 0.2 + goalCompletion * 0.2);
}

export function greetingFor(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export function buildDailyNotifications({ tasks, assignments, subjects, exams, profile }) {
  const notices = [];
  tasks.forEach((task) => {
    const remaining = daysUntil(task.deadline || task.dueDate);
    if (taskStatus(task) === "Overdue") {
      notices.push({ type: "Task", priority: "High", title: "Overdue task", body: `${task.title} is overdue. Move it into today's focus block.` });
    } else if (remaining <= 1) {
      notices.push({ type: "Task", priority: "Medium", title: "Task reminder", body: `${task.title} is due ${remaining === 0 ? "today" : "tomorrow"}.` });
    }
  });
  assignments.forEach((assignment) => {
    const remaining = daysUntil(assignment.dueDate);
    if (assignmentStatus(assignment) === "Overdue") {
      notices.push({ type: "Assignment", priority: "High", title: "Overdue assignment", body: `${assignment.title} is overdue.` });
    } else if (remaining <= 2) {
      notices.push({ type: "Assignment", priority: "Medium", title: "Assignment deadline", body: `${assignment.title} is due in ${Math.max(0, remaining)} days.` });
    }
  });
  subjects.forEach((subject) => {
    const goal = Number(subject.goal || profile.attendanceGoal || 85);
    if (attendancePercent(subject) < goal) {
      notices.push({ type: "Attendance", priority: "High", title: "Attendance warning", body: `${subject.name || subject.subject} is below ${goal}%. ${attendancePrediction(subject)}.` });
    }
  });
  exams.forEach((exam) => {
    const remaining = daysUntil(exam.date);
    if (remaining <= 1) notices.push({ type: "Exam", priority: "High", title: "Exam reminder", body: `${exam.title} is ${remaining === 0 ? "today" : "tomorrow"}.` });
  });
  if (!notices.length) {
    notices.push({ type: "Productivity", priority: "Low", title: "Study reminder", body: `Protect one ${profile.focusSessionDuration || 25}-minute focus session today.` });
  }
  return notices.slice(0, 8);
}
