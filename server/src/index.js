import "dotenv/config";
import express from "express";
import cors from "cors";
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

const app = express();
const port = process.env.PORT || 5000;
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://nexora-student-ai.vercel.app",
  process.env.CLIENT_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "",
  ...(process.env.ALLOWED_ORIGINS || "").split(","),
]
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  })
);
app.options("*", cors());
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

app.get("/test", (_request, response) => {
  response.json({
    success: true,
    message: "Backend working",
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

connectDatabase()
  .then(async () => {
    await seedDevelopmentAdmin();
    app.listen(port, () => {
      console.log(`✅ Nexora API Running: http://localhost:${port}`);
      console.log(`✅ Allowed frontend origins: ${allowedOrigins.join(", ")}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB Failed", error.message);
    process.exit(1);
  });
