import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    subject: { type: String, required: true },
    date: { type: Date, required: true },
    reminder: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Exam = mongoose.model("Exam", examSchema);
