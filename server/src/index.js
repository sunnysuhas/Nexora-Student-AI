import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDatabase } from "./lib/db.js";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import noteRoutes from "./routes/note.routes.js";
import contactRoutes from "./routes/contact.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || "http://127.0.0.1:5173" }));
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({ ok: true, service: "nexora-ai-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/contact", contactRoutes);

connectDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Nexora API running on http://localhost:${port}`);
  });
});
