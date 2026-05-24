import { Router } from "express";
import multer from "multer";
import {
  completeOnboarding,
  deleteProfileImage,
  forgotPassword,
  login,
  me,
  refresh,
  register,
  resendOtp,
  resetPassword,
  updateProfile,
  uploadProfileImage,
  verifyOtp,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 2 * 1024 * 1024 } });

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", requireAuth, me);
router.patch("/profile", requireAuth, updateProfile);
router.post("/onboarding", requireAuth, completeOnboarding);
router.post("/profile-image", requireAuth, upload.single("image"), uploadProfileImage);
router.delete("/profile-image", requireAuth, deleteProfileImage);

export default router;
