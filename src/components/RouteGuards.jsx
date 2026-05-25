import { Navigate, useLocation } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";

export function ProtectedRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated, onboardingComplete } = useAppStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!onboardingComplete && !["/onboarding", "/verify-email"].includes(location.pathname)) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}

export function AdminRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated, currentUser } = useAppStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (currentUser?.role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export function PublicOnlyRoute({ children }) {
  const { isAuthenticated, onboardingComplete } = useAppStore();
  if (isAuthenticated) return <Navigate to={onboardingComplete ? "/dashboard" : "/onboarding"} replace />;
  return children;
}
