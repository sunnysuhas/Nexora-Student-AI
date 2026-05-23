import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    subject: String,
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    deadline: String,
    progress: { type: Number, default: 0 },
    status: { type: String, enum: ["todo", "doing", "review", "done"], default: "todo" },
  },
  { timestamps: true }
);

export const Task = mongoose.model("Task", taskSchema);
