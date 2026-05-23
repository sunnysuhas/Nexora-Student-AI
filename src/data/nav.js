import {
  BarChart3,
  Bot,
  CalendarDays,
  Home,
  LayoutDashboard,
  ListTodo,
  NotebookText,
  Settings,
} from "lucide-react";

export const navItems = [
  { label: "Home", path: "/", icon: Home },
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "AI Assistant", path: "/assistant", icon: Bot },
  { label: "Tasks", path: "/tasks", icon: ListTodo },
  { label: "Analytics", path: "/analytics", icon: BarChart3 },
  { label: "Calendar", path: "/calendar", icon: CalendarDays },
  { label: "Notes", path: "/notes", icon: NotebookText },
  { label: "Settings", path: "/settings", icon: Settings },
];
