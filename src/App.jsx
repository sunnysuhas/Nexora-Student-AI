import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import { CursorGlow, ParticleField } from "./components/Background";
import { LoadingScreen } from "./components/LoadingScreen";
import { PageTransition } from "./components/PageTransition";
import { useAppStore } from "./store/useAppStore";
import { Analytics } from "./pages/Analytics";
import { Assistant } from "./pages/Assistant";
import { Auth } from "./pages/Auth";
import { Calendar } from "./pages/Calendar";
import { Dashboard } from "./pages/Dashboard";
import { Landing } from "./pages/Landing";
import { Notes } from "./pages/Notes";
import { Settings } from "./pages/Settings";
import { Tasks } from "./pages/Tasks";

export default function App() {
  const location = useLocation();
  const theme = useAppStore((state) => state.theme);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 900);
    return () => window.clearTimeout(timer);
  }, []);

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
          <Routes location={location}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Auth mode="login" />} />
            <Route path="/register" element={<Auth mode="register" />} />
            <Route path="/forgot-password" element={<Auth mode="forgot" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </PageTransition>
      </AnimatePresence>
    </>
  );
}
