import { lazy, Suspense, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import { CursorGlow, ParticleField } from "./components/Background";
import { LoadingScreen } from "./components/LoadingScreen";
import { PageTransition } from "./components/PageTransition";
import { AdminRoute, ProtectedRoute, PublicOnlyRoute } from "./components/RouteGuards";
import { useAppStore } from "./store/useAppStore";

const Analytics = lazy(() => import("./pages/Analytics").then((module) => ({ default: module.Analytics })));
const Admin = lazy(() => import("./pages/Admin").then((module) => ({ default: module.Admin })));
const Assistant = lazy(() => import("./pages/Assistant").then((module) => ({ default: module.Assistant })));
const Assignments = lazy(() => import("./pages/Assignments").then((module) => ({ default: module.Assignments })));
const Attendance = lazy(() => import("./pages/Attendance").then((module) => ({ default: module.Attendance })));
const Auth = lazy(() => import("./pages/Auth").then((module) => ({ default: module.Auth })));
const Calendar = lazy(() => import("./pages/Calendar").then((module) => ({ default: module.Calendar })));
const Dashboard = lazy(() => import("./pages/Dashboard").then((module) => ({ default: module.Dashboard })));
const Landing = lazy(() => import("./pages/Landing").then((module) => ({ default: module.Landing })));
const Notes = lazy(() => import("./pages/Notes").then((module) => ({ default: module.Notes })));
const Notifications = lazy(() => import("./pages/Notifications").then((module) => ({ default: module.Notifications })));
const Onboarding = lazy(() => import("./pages/Onboarding").then((module) => ({ default: module.Onboarding })));
const Profile = lazy(() => import("./pages/Profile").then((module) => ({ default: module.Profile })));
const Settings = lazy(() => import("./pages/Settings").then((module) => ({ default: module.Settings })));
const Tasks = lazy(() => import("./pages/Tasks").then((module) => ({ default: module.Tasks })));
const Unauthorized = lazy(() => import("./pages/Unauthorized").then((module) => ({ default: module.Unauthorized })));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail").then((module) => ({ default: module.VerifyEmail })));

export default function App() {
  const location = useLocation();
  const theme = useAppStore((state) => state.theme);
  const bootstrapSession = useAppStore((state) => state.bootstrapSession);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  useEffect(() => {
    bootstrapSession().finally(() => {
      window.setTimeout(() => setLoading(false), 600);
    });
    const timer = window.setTimeout(() => setLoading(false), 1800);
    return () => window.clearTimeout(timer);
  }, [bootstrapSession]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <>
      <ParticleField />
      <CursorGlow />
      <AnimatePresence>{loading && <LoadingScreen />}</AnimatePresence>
      <AnimatePresence mode="wait">
        <PageTransition key={location.pathname}>
          <Suspense fallback={<LoadingScreen />}>
            <Routes location={location}>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<PublicOnlyRoute><Auth mode="login" /></PublicOnlyRoute>} />
              <Route path="/register" element={<PublicOnlyRoute><Auth mode="register" /></PublicOnlyRoute>} />
              <Route path="/forgot-password" element={<PublicOnlyRoute><Auth mode="forgot" /></PublicOnlyRoute>} />
              <Route path="/verify-email" element={<ProtectedRoute><VerifyEmail /></ProtectedRoute>} />
              <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/assistant" element={<ProtectedRoute><Assistant /></ProtectedRoute>} />
              <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
              <Route path="/assignments" element={<ProtectedRoute><Assignments /></ProtectedRoute>} />
              <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
              <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
              <Route path="/unauthorized" element={<Unauthorized />} />
            </Routes>
          </Suspense>
        </PageTransition>
      </AnimatePresence>
    </>
  );
}
