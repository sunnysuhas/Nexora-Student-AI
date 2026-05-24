import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateOtp, signAccessToken, signRefreshToken } from "../utils/tokens.js";
import { isEmail, requireFields } from "../validators/auth.validator.js";
import { otpTemplate, sendEmail } from "../services/email.service.js";
import cloudinary from "../config/cloudinary.js";

const OTP_TTL_MS = 5 * 60 * 1000;

export const register = asyncHandler(async (request, response) => {
  const error = requireFields(request.body, ["name", "username", "email", "password"]);
  if (error) return response.status(400).json({ message: error });
  if (!isEmail(request.body.email)) return response.status(400).json({ message: "Valid email required" });

  const existing = await User.findOne({ $or: [{ email: request.body.email }, { username: request.body.username }] });
  if (existing) return response.status(409).json({ message: "Email or username already exists" });

  const otp = generateOtp();
  const user = await User.create({
    name: request.body.name,
    username: request.body.username,
    email: request.body.email.toLowerCase(),
    passwordHash: await bcrypt.hash(request.body.password, 12),
    role: "student",
    college: request.body.college,
    course: request.body.course,
    semester: request.body.semester,
    otpHash: await bcrypt.hash(otp, 10),
    otpExpiresAt: new Date(Date.now() + OTP_TTL_MS),
  });

  await sendEmail({ to: user.email, subject: "Verify your Nexora AI account", html: otpTemplate(otp) });

  return response.status(201).json({ message: "User registered. Verification OTP sent.", user: sanitizeUser(user) });
});

export const resendOtp = asyncHandler(async (request, response) => {
  const user = await User.findOne({ email: request.body.email?.toLowerCase() });
  if (!user) return response.status(404).json({ message: "Account not found" });
  if (user.emailVerified) return response.json({ message: "Account is already verified." });

  const otp = generateOtp();
  user.otpHash = await bcrypt.hash(otp, 10);
  user.otpExpiresAt = new Date(Date.now() + OTP_TTL_MS);
  await user.save();

  await sendEmail({ to: user.email, subject: "Your new Nexora AI verification OTP", html: otpTemplate(otp) });
  return response.json({ message: "Verification OTP resent." });
});

export const verifyOtp = asyncHandler(async (request, response) => {
  const { email, otp } = request.body;
  const user = await User.findOne({ email: email?.toLowerCase() });
  if (!user || !user.otpHash || user.otpExpiresAt < new Date()) return response.status(400).json({ message: "Invalid or expired OTP" });

  const valid = await bcrypt.compare(otp, user.otpHash);
  if (!valid) return response.status(400).json({ message: "Invalid OTP" });

  user.emailVerified = true;
  user.otpHash = undefined;
  user.otpExpiresAt = undefined;
  await user.save();

  return response.json({ message: "Email verified", user: sanitizeUser(user) });
});

export const login = asyncHandler(async (request, response) => {
  const { email, password } = request.body;
  const user = await User.findOne({ email: email?.toLowerCase() });
  if (!user) return response.status(401).json({ message: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return response.status(401).json({ message: "Invalid credentials" });
  if (!user.emailVerified) return response.status(403).json({ message: "Please verify your email before logging in" });

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
  await user.save();

  return response.json({ accessToken, refreshToken, user: sanitizeUser(user) });
});

export const refresh = asyncHandler(async (request, response) => {
  const { refreshToken } = request.body;
  if (!refreshToken) return response.status(401).json({ message: "Refresh token required" });

  const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
  const user = await User.findById(payload.id);
  if (!user?.refreshTokenHash) return response.status(401).json({ message: "Invalid refresh token" });

  const valid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
  if (!valid) return response.status(401).json({ message: "Invalid refresh token" });

  return response.json({ accessToken: signAccessToken(user) });
});

export const forgotPassword = asyncHandler(async (request, response) => {
  const user = await User.findOne({ email: request.body.email?.toLowerCase() });
  if (!user) return response.json({ message: "If the email exists, an OTP was sent." });

  const otp = generateOtp();
  user.otpHash = await bcrypt.hash(otp, 10);
  user.otpExpiresAt = new Date(Date.now() + OTP_TTL_MS);
  await user.save();
  await sendEmail({ to: user.email, subject: "Nexora password reset OTP", html: otpTemplate(otp) });
  return response.json({ message: "Reset OTP sent." });
});

export const resetPassword = asyncHandler(async (request, response) => {
  const { email, otp, password } = request.body;
  const user = await User.findOne({ email: email?.toLowerCase() });
  if (!user || !user.otpHash || user.otpExpiresAt < new Date()) return response.status(400).json({ message: "Invalid or expired OTP" });
  const valid = await bcrypt.compare(otp, user.otpHash);
  if (!valid) return response.status(400).json({ message: "Invalid OTP" });
  user.passwordHash = await bcrypt.hash(password, 12);
  user.otpHash = undefined;
  user.otpExpiresAt = undefined;
  user.tokenVersion += 1;
  await user.save();
  return response.json({ message: "Password reset successful" });
});

export const me = asyncHandler(async (request, response) => {
  const user = await User.findById(request.user.id);
  return response.json({ user: sanitizeUser(user) });
});

export const updateProfile = asyncHandler(async (request, response) => {
  const allowed = [
    "name",
    "username",
    "email",
    "college",
    "course",
    "semester",
    "bio",
    "attendanceGoal",
    "dailyStudyHoursGoal",
    "reminderTime",
    "focusSessionDuration",
  ];
  const update = Object.fromEntries(Object.entries(request.body).filter(([key]) => allowed.includes(key)));
  if (update.email) update.email = update.email.toLowerCase();
  const user = await User.findByIdAndUpdate(request.user.id, update, { new: true, runValidators: true });
  return response.json({ user: sanitizeUser(user) });
});

export const completeOnboarding = asyncHandler(async (request, response) => {
  const required = ["name", "username", "college", "course", "semester"];
  const missing = required.filter((field) => !String(request.body[field] || "").trim());
  if (missing.length) return response.status(400).json({ message: `Missing required onboarding fields: ${missing.join(", ")}` });
  const user = await User.findByIdAndUpdate(
    request.user.id,
    {
      name: request.body.name,
      username: request.body.username,
      college: request.body.college,
      course: request.body.course,
      semester: request.body.semester,
      bio: request.body.bio,
      attendanceGoal: request.body.attendanceGoal,
      dailyStudyHoursGoal: request.body.dailyStudyHoursGoal,
      reminderTime: request.body.reminderTime,
      focusSessionDuration: request.body.focusSessionDuration,
      onboardingComplete: true,
    },
    { new: true, runValidators: true }
  );
  return response.json({ user: sanitizeUser(user) });
});

export const uploadProfileImage = asyncHandler(async (request, response) => {
  if (!request.file) return response.status(400).json({ message: "Image file required" });
  if (!process.env.CLOUDINARY_CLOUD_NAME) return response.status(503).json({ message: "Cloudinary is not configured" });

  const dataUri = `data:${request.file.mimetype};base64,${request.file.buffer.toString("base64")}`;
  const upload = await cloudinary.uploader.upload(dataUri, { folder: "nexora/profiles", resource_type: "image" });
  const existing = await User.findById(request.user.id);
  if (existing?.profileImagePublicId) {
    await cloudinary.uploader.destroy(existing.profileImagePublicId);
  }
  const user = await User.findByIdAndUpdate(
    request.user.id,
    { profileImageUrl: upload.secure_url, profileImagePublicId: upload.public_id },
    { new: true }
  );
  return response.json({ imageUrl: upload.secure_url, user: sanitizeUser(user) });
});

export const deleteProfileImage = asyncHandler(async (request, response) => {
  const user = await User.findById(request.user.id);
  if (!user) return response.status(404).json({ message: "User not found" });
  if (user.profileImagePublicId && process.env.CLOUDINARY_CLOUD_NAME) {
    await cloudinary.uploader.destroy(user.profileImagePublicId);
  }
  user.profileImageUrl = undefined;
  user.profileImagePublicId = undefined;
  await user.save();
  return response.json({ user: sanitizeUser(user) });
});

function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
    emailVerified: user.emailVerified,
    college: user.college,
    course: user.course,
    semester: user.semester,
    bio: user.bio,
    profileImageUrl: user.profileImageUrl,
    attendanceGoal: user.attendanceGoal,
    dailyStudyHoursGoal: user.dailyStudyHoursGoal,
    reminderTime: user.reminderTime,
    focusSessionDuration: user.focusSessionDuration,
    onboardingComplete: user.onboardingComplete,
  };
}
