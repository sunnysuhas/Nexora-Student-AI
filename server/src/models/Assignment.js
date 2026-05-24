import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    subject: { type: String, required: true },
    dueDate: { type: Date, required: true },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    status: { type: String, enum: ["Not Started", "In Progress", "Completed", "Overdue"], default: "Not Started" },
    notes: String,
    attachments: [
      {
        name: String,
        url: String,
        publicId: String,
      },
    ],
  },
  { timestamps: true }
);

export const Assignment = mongoose.model("Assignment", assignmentSchema);
