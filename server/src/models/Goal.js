import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    target: { type: Number, required: true },
    current: { type: Number, default: 0 },
    unit: { type: String, default: "points" },
  },
  { timestamps: true }
);

export const Goal = mongoose.model("Goal", goalSchema);
