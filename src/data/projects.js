import { Bot, BrainCircuit, CalendarCheck, Hospital, PackageCheck, Workflow } from "lucide-react";

export const projects = [
  {
    title: "Smart AI Assistant APK App",
    status: "In Development",
    icon: Bot,
    description: "Mobile AI productivity companion with academic reminders, task suggestions, and voice-first actions.",
    tags: ["Android", "AI", "Productivity"],
  },
  {
    title: "Personal AI Assistant Tom",
    status: "Coming Soon",
    icon: BrainCircuit,
    description: "Personal assistant concept for daily planning, automation, reminders, and conversational workflows.",
    tags: ["Assistant", "Automation", "NLP"],
  },
  {
    title: "Hospital Appointment Booking System",
    status: "Ready",
    icon: Hospital,
    description: "Patient appointment flow with doctor availability, booking states, and admin-ready architecture.",
    tags: ["Healthcare", "CRUD", "Dashboard"],
  },
  {
    title: "Swift Recovery - FedEx",
    status: "In Development",
    icon: PackageCheck,
    description: "Logistics recovery workflow concept for tracking failed deliveries and operational resolution.",
    tags: ["Logistics", "Ops", "Tracking"],
  },
  {
    title: "Student Query System",
    status: "Ready",
    icon: CalendarCheck,
    description: "Academic query management system for student support, issue status, and staff response queues.",
    tags: ["Education", "Support", "CRUD"],
  },
  {
    title: "Automation Tools",
    status: "Coming Soon",
    icon: Workflow,
    description: "Reusable automation utilities for repetitive student and admin productivity workflows.",
    tags: ["Scripts", "Workflow", "Tools"],
  },
];
