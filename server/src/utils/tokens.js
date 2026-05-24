import jwt from "jsonwebtoken";

export function signAccessToken(user) {
  return jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: "15m" });
}

export function signRefreshToken(user) {
  return jwt.sign({ id: user._id, tokenVersion: user.tokenVersion || 0 }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}
