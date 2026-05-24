import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    description: String,
    subject: String,
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    deadline: Date,
    reminder: Date,
    tags: [String],
    status: { type: String, enum: ["Pending", "In Progress", "Completed", "Overdue"], default: "Pending" },
  },
  { timestamps: true }
);

export const Task = mongoose.model("Task", taskSchema);
