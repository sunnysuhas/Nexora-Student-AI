import {
  BarChart3,
  Bot,
  CalendarDays,
  ClipboardList,
  Home,
  LayoutDashboard,
  ListTodo,
  Megaphone,
  NotebookText,
  Shield,
  Settings,
  User,
  Users,
} from "lucide-react";

export const navItems = [
  { label: "Home", path: "/", icon: Home },
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Tasks", path: "/tasks", icon: ListTodo },
  { label: "Assignments", path: "/assignments", icon: ClipboardList },
  { label: "Attendance", path: "/attendance", icon: Users },
  { label: "AI Assistant", path: "/assistant", icon: Bot },
  { label: "Analytics", path: "/analytics", icon: BarChart3 },
  { label: "Calendar", path: "/calendar", icon: CalendarDays },
  { label: "Notes", path: "/notes", icon: NotebookText },
  { label: "Notifications", path: "/notifications", icon: Megaphone },
  { label: "Profile", path: "/profile", icon: User },
  { label: "Settings", path: "/settings", icon: Settings },
  { label: "Admin", path: "/admin", icon: Shield, adminOnly: true },
];

export const mobileNavItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Tasks", path: "/tasks", icon: ListTodo },
  { label: "AI", path: "/assistant", icon: Bot },
  { label: "Analytics", path: "/analytics", icon: BarChart3 },
  { label: "Profile", path: "/profile", icon: User },
];
