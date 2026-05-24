import { AIChat } from "../models/AIChat.js";
import { Task } from "../models/Task.js";
import { Assignment } from "../models/Assignment.js";
import { Attendance } from "../models/Attendance.js";
import { Exam } from "../models/Exam.js";
import { Goal } from "../models/Goal.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { askGroq } from "../services/groq.service.js";

export const chat = asyncHandler(async (request, response) => {
  const [tasks, assignments, attendance, exams, goals] = await Promise.all([
    Task.find({ userId: request.user.id }).sort({ deadline: 1 }).limit(20),
    Assignment.find({ userId: request.user.id }).sort({ dueDate: 1 }).limit(20),
    Attendance.find({ userId: request.user.id }).sort({ name: 1 }).limit(20),
    Exam.find({ userId: request.user.id }).sort({ date: 1 }).limit(10),
    Goal.find({ userId: request.user.id }).sort({ createdAt: -1 }).limit(10),
  ]);

  const context = JSON.stringify(
    {
      now: new Date().toISOString(),
      tasks: tasks.map((item) => ({
        title: item.title,
        status: item.status,
        priority: item.priority,
        deadline: item.deadline,
        subject: item.subject,
        tags: item.tags,
      })),
      assignments: assignments.map((item) => ({
        title: item.title,
        subject: item.subject,
        status: item.status,
        priority: item.priority,
        dueDate: item.dueDate,
      })),
      attendance: attendance.map((item) => ({
        subject: item.name,
        totalClasses: item.totalClasses,
        present: item.present,
        absent: item.absent,
        holidays: item.holidays,
      })),
      exams: exams.map((item) => ({ title: item.title, subject: item.subject, date: item.date, reminder: item.reminder })),
      goals: goals.map((item) => ({ title: item.title, target: item.target, current: item.current, unit: item.unit })),
    },
    null,
    2
  );
  const answer = await askGroq({ messages: request.body.messages || [], context });
  const chatDoc = await AIChat.create({
    userId: request.user.id,
    title: request.body.title || "Nexora AI Plan",
    messages: [...(request.body.messages || []), { role: "assistant", content: answer.text }],
  });
  response.status(201).json({ answer: answer.text, chat: chatDoc });
});

export const listChats = asyncHandler(async (request, response) => {
  const chats = await AIChat.find({ userId: request.user.id }).sort({ updatedAt: -1 });
  response.json({ chats });
});
