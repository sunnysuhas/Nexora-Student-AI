import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String },
    subject: { type: String },
    totalClasses: { type: Number, default: 0 },
    present: { type: Number, default: 0 },
    absent: { type: Number, default: 0 },
    holidays: { type: Number, default: 0 },
    goal: { type: Number, default: 85 },
  },
  { timestamps: true }
);

export const Attendance = mongoose.model("Attendance", attendanceSchema);
