import { User } from "../models/User.js";
import { Task } from "../models/Task.js";
import { Assignment } from "../models/Assignment.js";
import { Attendance } from "../models/Attendance.js";
import { Notification } from "../models/Notification.js";
import { Exam } from "../models/Exam.js";
import { Note } from "../models/Note.js";
import { Goal } from "../models/Goal.js";
import { AIChat } from "../models/AIChat.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const adminOverview = asyncHandler(async (_request, response) => {
  const [users, tasks, assignments, attendance, notifications] = await Promise.all([
    User.countDocuments(),
    Task.countDocuments(),
    Assignment.countDocuments(),
    Attendance.countDocuments(),
    Notification.countDocuments(),
  ]);

  response.json({ users, tasks, assignments, attendance, notifications });
});

export const listUsers = asyncHandler(async (_request, response) => {
  const users = await User.find().select("-passwordHash -refreshTokenHash -otpHash").sort({ createdAt: -1 });
  response.json({ users });
});

export const deleteUser = asyncHandler(async (request, response) => {
  const user = await User.findById(request.params.id);
  if (!user) return response.status(404).json({ message: "User not found" });
  if (String(user._id) === String(request.user.id)) {
    return response.status(400).json({ message: "Admins cannot delete their own account from this panel" });
  }

  await Promise.all([
    Task.deleteMany({ userId: user._id }),
    Assignment.deleteMany({ userId: user._id }),
    Attendance.deleteMany({ userId: user._id }),
    Exam.deleteMany({ userId: user._id }),
    Note.deleteMany({ userId: user._id }),
    Goal.deleteMany({ userId: user._id }),
    Notification.deleteMany({ userId: user._id }),
    AIChat.deleteMany({ userId: user._id }),
    User.findByIdAndDelete(user._id),
  ]);
  response.status(204).send();
});
