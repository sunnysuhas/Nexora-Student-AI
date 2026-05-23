import jwt from "jsonwebtoken";

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
