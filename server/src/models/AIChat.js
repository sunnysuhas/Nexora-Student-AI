import mongoose from "mongoose";

const aiChatSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, default: "Nexora chat" },
    messages: [
      {
        role: { type: String, enum: ["user", "assistant", "system"], required: true },
        content: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export const AIChat = mongoose.model("AIChat", aiChatSchema);
