import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    category: { type: String, default: "Quick Note" },
    color: { type: String, default: "cyan" },
    pinned: { type: Boolean, default: false },
    private: { type: Boolean, default: true },
    images: [String],
  },
  { timestamps: true }
);

export const Note = mongoose.model("Note", noteSchema);
