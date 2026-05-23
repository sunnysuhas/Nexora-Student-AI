import { create } from "zustand";
import { persist } from "zustand/middleware";

const defaultTasks = [
  {
    id: "task-1",
    title: "Finish AI assignment brief",
    subject: "Artificial Intelligence",
    priority: "High",
    deadline: "Tonight",
    progress: 70,
    status: "doing",
  },
  {
    id: "task-2",
    title: "Revise operating systems notes",
    subject: "OS",
    priority: "Medium",
    deadline: "Tomorrow",
    progress: 35,
    status: "todo",
  },
  {
    id: "task-3",
    title: "Submit DBMS mini project",
    subject: "Database Systems",
    priority: "High",
    deadline: "Friday",
    progress: 90,
    status: "review",
  },
  {
    id: "task-4",
    title: "Watch calculus lecture 12",
    subject: "Mathematics",
    priority: "Low",
    deadline: "Weekend",
    progress: 100,
    status: "done",
  },
];

const defaultNotes = [
  {
    id: "note-1",
    title: "AI exam signals",
    category: "Revision",
    body: "Focus on search algorithms, minimax, constraint satisfaction, and neural network basics.",
    color: "cyan",
  },
  {
    id: "note-2",
    title: "Project idea",
    category: "Build",
    body: "Add an attendance risk predictor using subject-wise attendance and future timetable data.",
    color: "violet",
  },
  {
    id: "note-3",
    title: "Daily routine",
    category: "Focus",
    body: "Start with one deep work block, then classes, then one cleanup block before dinner.",
    color: "emerald",
  },
];

const defaultUsers = [
  { id: "user-1", name: "Demo Student", email: "student@nexora.ai", username: "nexora" },
  { id: "user-2", name: "Suhas", email: "sunnysuhas108@gmail.com", username: "suhas" },
];

export const useAppStore = create(
  persist(
    (set) => ({
      theme: "dark",
      tasks: defaultTasks,
      notes: defaultNotes,
      users: defaultUsers,
      contactMessages: [],
      notifications: true,
      compactMode: false,
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
      toggleNotifications: () => set((state) => ({ notifications: !state.notifications })),
      toggleCompactMode: () => set((state) => ({ compactMode: !state.compactMode })),
      addTask: (task) => set((state) => ({ tasks: [{ ...task, id: crypto.randomUUID() }, ...state.tasks] })),
      updateTask: (id, update) =>
        set((state) => ({ tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...update } : task)) })),
      moveTask: (id, status) =>
        set((state) => ({ tasks: state.tasks.map((task) => (task.id === id ? { ...task, status } : task)) })),
      deleteTask: (id) => set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) })),
      addNote: (note) => set((state) => ({ notes: [{ ...note, id: crypto.randomUUID() }, ...state.notes] })),
      updateNote: (id, update) =>
        set((state) => ({ notes: state.notes.map((note) => (note.id === id ? { ...note, ...update } : note)) })),
      deleteNote: (id) => set((state) => ({ notes: state.notes.filter((note) => note.id !== id) })),
      addUser: (user) => set((state) => ({ users: [{ ...user, id: crypto.randomUUID() }, ...state.users] })),
      addContactMessage: (message) =>
        set((state) => ({
          contactMessages: [{ ...message, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...state.contactMessages],
        })),
    }),
    {
      name: "nexora-ai-storage",
      partialize: (state) => ({
        theme: state.theme,
        tasks: state.tasks,
        notes: state.notes,
        users: state.users,
        contactMessages: state.contactMessages,
        notifications: state.notifications,
        compactMode: state.compactMode,
      }),
    }
  )
);
