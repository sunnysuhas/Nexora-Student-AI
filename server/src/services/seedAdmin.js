import bcrypt from "bcryptjs";
import { User } from "../models/User.js";

export async function seedDevelopmentAdmin() {
  if (process.env.SEED_DEV_ADMIN === "false") return;

  const email = process.env.DEV_ADMIN_EMAIL || "sunnysuhas108@gmail.com";
  const password = process.env.DEV_ADMIN_PASSWORD || "suhas@2005";
  const existing = await User.findOne({ email });

  if (existing) {
    if (existing.role !== "admin" || !existing.emailVerified || !existing.isEmailVerified) {
      existing.role = "admin";
      existing.emailVerified = true;
      existing.isEmailVerified = true;
      await existing.save();
    }
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await User.create({
    name: "Nexora Development Admin",
    username: "nexora_admin",
    email,
    passwordHash,
    role: "admin",
    emailVerified: true,
    isEmailVerified: true,
  });
}
