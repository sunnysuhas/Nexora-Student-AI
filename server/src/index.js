import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDatabase } from "./lib/db.js";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import noteRoutes from "./routes/note.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import assignmentRoutes from "./routes/assignment.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";
import examRoutes from "./routes/exam.routes.js";
import goalRoutes from "./routes/goal.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { seedDevelopmentAdmin } from "./services/seedAdmin.js";
import { errorHandler } from "./middleware/error.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || "http://127.0.0.1:5173" }));
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({ ok: true, service: "nexora-ai-api" });
});

app.get("/", (_request, response) => {
  response.json({
    success: true,
    message: "Nexora API Running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);
app.use(errorHandler);

connectDatabase().then(async (connection) => {
  if (connection) {
    await seedDevelopmentAdmin();
  }
  app.listen(port, () => {
    console.log(`Nexora API running on http://localhost:${port}`);
  });
});
