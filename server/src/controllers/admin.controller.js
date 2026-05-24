import { User } from "../models/User.js";
import { Task } from "../models/Task.js";
import { Assignment } from "../models/Assignment.js";
import { Attendance } from "../models/Attendance.js";
import { Notification } from "../models/Notification.js";
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
  await User.findByIdAndDelete(request.params.id);
  response.status(204).send();
});
