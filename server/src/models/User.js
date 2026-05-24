import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["student", "admin"], default: "student" },
    profileImageUrl: String,
    profileImagePublicId: String,
    college: String,
    course: String,
    semester: String,
    bio: String,
    attendanceGoal: { type: Number, default: 85 },
    dailyStudyHoursGoal: { type: Number, default: 3 },
    reminderTime: { type: String, default: "19:00" },
    focusSessionDuration: { type: Number, default: 25 },
    onboardingComplete: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    otpHash: String,
    otpExpiresAt: Date,
    refreshTokenHash: String,
    tokenVersion: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
