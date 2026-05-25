import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateOtp, signAccessToken, signRefreshToken } from "../utils/tokens.js";
import { isEmail, requireFields } from "../validators/auth.validator.js";
import { isEmailConfigured, otpTemplate, sendEmail } from "../services/email.service.js";
import { getCloudinary, isCloudinaryConfigured } from "../config/cloudinary.js";

const OTP_TTL_MS = 5 * 60 * 1000;

export const register = asyncHandler(async (request, response) => {
  const error = requireFields(request.body, ["name", "username", "email", "password"]);
  if (error) return response.status(400).json({ message: error });
  const email = normalizeEmail(request.body.email);
  const username = normalizeUsername(request.body.username);
  if (!isEmail(email)) return response.status(400).json({ message: "Valid email required", code: "INVALID_EMAIL" });
  if (!username || username.length < 3) return response.status(400).json({ message: "Username must be at least 3 characters", code: "INVALID_USERNAME" });

  const [existingByEmail, existingByUsername] = await Promise.all([User.findOne({ email }), User.findOne({ username })]);
  if (existingByUsername && existingByUsername.email !== email) {
    return response.status(409).json({ message: "Username already exists", code: "USERNAME_EXISTS" });
  }
  if (existingByEmail) {
    return response.status(409).json({ message: "Email already exists. Please login instead.", code: "EMAIL_EXISTS" });
  }

  const user = await User.create({
    name: String(request.body.name || "").trim(),
    username,
    email,
    passwordHash: await bcrypt.hash(request.body.password, 12),
    role: "student",
    college: request.body.college,
    course: request.body.course,
    semester: request.body.semester,
    isEmailVerified: false,
    emailVerified: false,
  });

  const emailDelivery = await queueVerificationOtp(user, "Your Nexora AI verification OTP");

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
  await user.save();

  return response.status(201).json({
    success: true,
    message: "Account created successfully",
    requiresEmailVerification: true,
    emailDelivery,
    accessToken,
    refreshToken,
    user: sanitizeUser(user),
  });
});

export const resendOtp = asyncHandler(async (request, response) => {
  const email = normalizeEmail(request.body.email);
  const user = await User.findOne({ email });
  if (!user) return response.status(404).json({ message: "Account not found", code: "ACCOUNT_NOT_FOUND" });
  if (isUserEmailVerified(user)) return response.json({ message: "Account is already verified.", emailSent: false });

  const emailDelivery = await sendVerificationOtp(user, "Your new Nexora AI verification OTP");
  return response.json({
    message: emailDelivery.sent ? "Verification OTP resent." : "Verification email could not be sent right now. You can continue using Nexora AI and retry later.",
    emailDelivery,
  });
});

export const verifyOtp = asyncHandler(async (request, response) => {
  const email = normalizeEmail(request.body.email);
  const otp = String(request.body.otp || "").trim();
  if (!isEmail(email)) return response.status(400).json({ message: "Valid email required", code: "INVALID_EMAIL" });
  if (!/^\d{6}$/.test(otp)) return response.status(400).json({ message: "Enter the 6-digit OTP", code: "INVALID_OTP_FORMAT" });

  const user = await User.findOne({ email });
  if (!user || !user.otpHash) return response.status(400).json({ message: "Verification code not found. Please resend OTP.", code: "OTP_NOT_FOUND" });
  if (user.otpExpiresAt < new Date()) return response.status(400).json({ message: "OTP expired. Please resend OTP.", code: "OTP_EXPIRED" });

  const valid = await bcrypt.compare(otp, user.otpHash);
  if (!valid) return response.status(400).json({ message: "Incorrect OTP", code: "INCORRECT_OTP" });

  user.isEmailVerified = true;
  user.emailVerified = true;
  user.otpHash = undefined;
  user.otpExpiresAt = undefined;
  await user.save();

  return response.json({ message: "Email verified", user: sanitizeUser(user) });
});

export const sendVerificationEmail = asyncHandler(async (request, response) => {
  const user = await User.findById(request.user.id);
  if (!user) return response.status(404).json({ message: "User not found", code: "USER_NOT_FOUND" });
  if (isUserEmailVerified(user)) return response.json({ message: "Email is already verified.", emailDelivery: { sent: false, skipped: true } });

  const emailDelivery = await sendVerificationOtp(user, "Your Nexora AI verification OTP");
  return response.status(emailDelivery.sent ? 200 : 202).json({
    message: emailDelivery.sent ? "Verification OTP sent." : "Email verification is temporarily unavailable. Please retry later.",
    emailDelivery,
  });
});

export const verifyEmail = asyncHandler(async (request, response) => {
  const otp = String(request.body.otp || "").trim();
  if (!/^\d{6}$/.test(otp)) return response.status(400).json({ message: "Enter the 6-digit OTP", code: "INVALID_OTP_FORMAT" });

  const user = await User.findById(request.user.id);
  if (!user || !user.otpHash) return response.status(400).json({ message: "Verification code not found. Please resend OTP.", code: "OTP_NOT_FOUND" });
  if (user.otpExpiresAt < new Date()) return response.status(400).json({ message: "OTP expired. Please resend OTP.", code: "OTP_EXPIRED" });

  const valid = await bcrypt.compare(otp, user.otpHash);
  if (!valid) return response.status(400).json({ message: "Incorrect OTP", code: "INCORRECT_OTP" });

  user.isEmailVerified = true;
  user.emailVerified = true;
  user.otpHash = undefined;
  user.otpExpiresAt = undefined;
  await user.save();

  return response.json({ message: "Email verified", user: sanitizeUser(user) });
});

export const login = asyncHandler(async (request, response) => {
  const email = normalizeEmail(request.body.email);
  const password = String(request.body.password || "");
  if (!isEmail(email) || !password) return response.status(400).json({ message: "Email and password are required", code: "LOGIN_FIELDS_REQUIRED" });

  const user = await User.findOne({ email });
  if (!user?.passwordHash) return response.status(401).json({ message: "Invalid email or password", code: "INVALID_CREDENTIALS" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return response.status(401).json({ message: "Invalid email or password", code: "INVALID_CREDENTIALS" });

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
  await user.save();

  return response.json({ accessToken, refreshToken, user: sanitizeUser(user) });
});

export const refresh = asyncHandler(async (request, response) => {
  const { refreshToken } = request.body;
  if (!refreshToken) return response.status(401).json({ message: "Refresh token required" });

  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
  } catch {
    return response.status(401).json({ message: "Refresh token expired. Please login again.", code: "REFRESH_EXPIRED" });
  }
  const user = await User.findById(payload.id);
  if (!user?.refreshTokenHash) return response.status(401).json({ message: "Invalid refresh token" });
  if (Number(payload.tokenVersion || 0) !== Number(user.tokenVersion || 0)) {
    return response.status(401).json({ message: "Refresh token has been revoked" });
  }

  const valid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
  if (!valid) return response.status(401).json({ message: "Invalid refresh token" });

  return response.json({ accessToken: signAccessToken(user) });
});

export const logout = asyncHandler(async (request, response) => {
  await User.findByIdAndUpdate(request.user.id, { $unset: { refreshTokenHash: "" } });
  return response.json({ message: "Logged out" });
});

export const forgotPassword = asyncHandler(async (request, response) => {
  const user = await User.findOne({ email: normalizeEmail(request.body.email) });
  if (!user) return response.json({ message: "If the email exists, an OTP was sent." });
  if (!isUserEmailVerified(user)) {
    return response.status(403).json({
      message: "Please verify your email from your logged-in account before using password recovery.",
      code: "EMAIL_VERIFICATION_REQUIRED",
    });
  }
  if (!isEmailConfigured()) {
    console.warn(`Password reset skipped for ${user.email}: SMTP is not configured`);
    return response.status(202).json({ message: "Password reset email could not be sent right now. Please try again later.", code: "EMAIL_SEND_DEFERRED" });
  }

  const otp = generateOtp();
  user.otpHash = await bcrypt.hash(otp, 10);
  user.otpExpiresAt = new Date(Date.now() + OTP_TTL_MS);
  await user.save();
  try {
    await sendEmail({ to: user.email, subject: "Nexora password reset OTP", html: otpTemplate(otp) });
  } catch (error) {
    console.warn(`Password reset skipped for ${user.email}: ${error.message}`);
    return response.status(202).json({ message: "Password reset email could not be sent right now. Please try again later.", code: "EMAIL_SEND_DEFERRED" });
  }
  return response.json({ message: "Reset OTP sent." });
});

export const resetPassword = asyncHandler(async (request, response) => {
  const { email, otp, password } = request.body;
  const user = await User.findOne({ email: normalizeEmail(email) });
  if (!user || !user.otpHash) return response.status(400).json({ message: "Verification code not found. Please resend OTP.", code: "OTP_NOT_FOUND" });
  if (user.otpExpiresAt < new Date()) return response.status(400).json({ message: "OTP expired. Please resend OTP.", code: "OTP_EXPIRED" });
  const valid = await bcrypt.compare(otp, user.otpHash);
  if (!valid) return response.status(400).json({ message: "Incorrect OTP", code: "INCORRECT_OTP" });
  user.passwordHash = await bcrypt.hash(password, 12);
  user.otpHash = undefined;
  user.otpExpiresAt = undefined;
  user.tokenVersion += 1;
  await user.save();
  return response.json({ message: "Password reset successful" });
});

export const me = asyncHandler(async (request, response) => {
  const user = await User.findById(request.user.id);
  if (!user) return response.status(401).json({ message: "Session user no longer exists" });
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
  if (!isCloudinaryConfigured()) return response.status(503).json({ message: "Cloudinary is not fully configured" });

  const dataUri = `data:${request.file.mimetype};base64,${request.file.buffer.toString("base64")}`;
  const cloudinary = getCloudinary();
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
  if (user.profileImagePublicId && isCloudinaryConfigured()) {
    await getCloudinary().uploader.destroy(user.profileImagePublicId);
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
    isEmailVerified: isUserEmailVerified(user),
    emailVerified: isUserEmailVerified(user),
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

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function normalizeUsername(username) {
  return String(username || "").trim().toLowerCase();
}

function isUserEmailVerified(user) {
  return Boolean(user?.isEmailVerified || user?.emailVerified);
}

async function sendVerificationOtp(user, subject) {
  if (!isEmailConfigured()) {
    console.warn(`Email verification skipped for ${user.email}: SMTP is not configured`);
    return { sent: false, skipped: true, reason: "SMTP_NOT_CONFIGURED" };
  }

  const otp = generateOtp();
  user.otpHash = await bcrypt.hash(otp, 10);
  user.otpExpiresAt = new Date(Date.now() + OTP_TTL_MS);
  await user.save();

  try {
    await sendEmail({ to: user.email, subject, html: otpTemplate(otp) });
    return { sent: true };
  } catch (error) {
    console.warn(`Email verification skipped for ${user.email}: ${error.message}`);
    return { sent: false, skipped: true, reason: "EMAIL_SEND_FAILED" };
  }
}

async function queueVerificationOtp(user, subject) {
  if (!isEmailConfigured()) {
    console.warn(`Email verification skipped for ${user.email}: SMTP is not configured`);
    return { sent: false, queued: false, skipped: true, reason: "SMTP_NOT_CONFIGURED" };
  }

  const otp = generateOtp();
  user.otpHash = await bcrypt.hash(otp, 10);
  user.otpExpiresAt = new Date(Date.now() + OTP_TTL_MS);
  await user.save();

  sendEmail({ to: user.email, subject, html: otpTemplate(otp) })
    .then(() => console.log(`Verification email queued successfully for ${user.email}`))
    .catch((error) => console.warn(`Email verification skipped for ${user.email}: ${error.message}`));

  return { sent: false, queued: true };
}
