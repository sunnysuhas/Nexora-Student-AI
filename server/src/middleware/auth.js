import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export function requireAuth(request, response, next) {
  const token = request.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return response.status(401).json({ message: "Authentication required" });
  }

  try {
    request.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return response.status(401).json({ message: "Invalid or expired token" });
  }
}

export function requireRole(role) {
  return (request, response, next) => {
    if (request.user?.role !== role) {
      return response.status(403).json({ message: "Insufficient permissions" });
    }
    return next();
  };
}

export async function requireVerifiedEmail(request, response, next) {
  const user = await User.findById(request.user?.id);
  if (!user?.isEmailVerified && !user?.emailVerified) {
    return response.status(403).json({
      message: "Email verification is required for this action.",
      code: "EMAIL_VERIFICATION_REQUIRED",
    });
  }
  return next();
}
