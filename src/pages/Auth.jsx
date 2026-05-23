import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useAppStore } from "../store/useAppStore";

const copy = {
  login: {
    title: "Welcome back",
    subtitle: "Enter your Nexora command center.",
    cta: "Login",
    footer: "New here?",
    link: "Create an account",
    to: "/register",
  },
  register: {
    title: "Create your student OS",
    subtitle: "Start organizing tasks, notes, reminders, and focus.",
    cta: "Create account",
    footer: "Already have an account?",
    link: "Login",
    to: "/login",
  },
  forgot: {
    title: "Recover access",
    subtitle: "We will prepare a reset flow for your account.",
    cta: "Send reset link",
    footer: "Remembered it?",
    link: "Back to login",
    to: "/login",
  },
};

export function Auth({ mode }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { users, addUser } = useAppStore();
  const navigate = useNavigate();
  const details = copy[mode];

  const submit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = form.get("email")?.toString() || "";
    const password = form.get("password")?.toString() || "";
    const confirmPassword = form.get("confirmPassword")?.toString() || "";
    const name = form.get("name")?.toString() || "";
    const username = form.get("username")?.toString() || "";
    const role = form.get("role")?.toString() || "student";
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim().toLowerCase();
    const nextErrors = {};

    if (mode === "register" && name.trim().length < 2) nextErrors.name = "Enter your name.";
    if (mode === "register" && normalizedUsername.length < 3) nextErrors.username = "Username must be at least 3 characters.";
    if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = "Enter a valid email.";
    if (mode !== "forgot" && password.length < 6) nextErrors.password = "Password must be at least 6 characters.";
    if (mode === "register" && password !== confirmPassword) nextErrors.confirmPassword = "Passwords must match.";
    if (mode === "register" && users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
      nextErrors.email = "This email already exists in the Nexora demo auth system.";
    }
    if (mode === "register" && users.some((user) => user.username.toLowerCase() === normalizedUsername)) {
      nextErrors.username = "This username is already taken.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 700));
    if (mode === "register") {
      addUser({ name: name.trim(), email: normalizedEmail, username: normalizedUsername, role });
    }
    localStorage.setItem("nexora-token", `demo-${Date.now()}`);
    setLoading(false);
    navigate("/dashboard");
  };

  return (
    <div className="grid min-h-screen text-slate-950 dark:text-white lg:grid-cols-2">
      <section className="relative hidden items-center overflow-hidden px-12 lg:flex">
        <div className="absolute inset-0 animated-grid opacity-50" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative max-w-xl">
          <Link to="/" className="mb-12 inline-flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-slate-950 text-cyan-300 shadow-glow dark:bg-white dark:text-slate-950">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="font-display text-2xl font-bold">Nexora AI</span>
          </Link>
          <h1 className="font-display text-6xl font-bold leading-none text-balance">Your semester, orchestrated by AI.</h1>
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
            A cinematic command layer for tasks, deadlines, focus, notes, attendance, and academic clarity.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-3">
            {["JWT-ready", "MongoDB-ready", "Role-ready"].map((label) => (
              <div key={label} className="glass rounded-lg p-4 text-center font-semibold">
                {label}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <Link to="/" className="mb-8 flex items-center gap-3 lg:hidden">
            <Sparkles className="h-6 w-6 text-cyan-500" />
            <span className="font-display text-xl font-bold">Nexora AI</span>
          </Link>
          <h2 className="font-display text-3xl font-bold">{details.title}</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{details.subtitle}</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            {mode === "register" && (
              <>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold">Name</span>
                  <Input name="name" placeholder="Your name" />
                  {errors.name && <span className="mt-1 block text-xs text-rose-500">{errors.name}</span>}
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold">Username</span>
                  <Input name="username" placeholder="suhas" />
                  {errors.username && <span className="mt-1 block text-xs text-rose-500">{errors.username}</span>}
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold">Role</span>
                  <select
                    name="role"
                    className="min-h-11 w-full rounded-lg border border-slate-300/70 bg-white/70 px-4 text-sm font-semibold text-slate-950 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/40 dark:border-white/15 dark:!bg-slate-950/60 dark:text-white"
                  >
                    <option value="student">Student</option>
                    <option value="admin">Admin preview</option>
                  </select>
                </label>
              </>
            )}

            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Email</span>
              <Input name="email" type="email" placeholder="student@nexora.ai" />
              {errors.email && <span className="mt-1 block text-xs text-rose-500">{errors.email}</span>}
            </label>

            {mode !== "forgot" && (
              <label className="block">
                <span className="mb-2 block text-sm font-semibold">Password</span>
                <span className="relative block">
                  <Input name="password" type={showPassword ? "text" : "password"} placeholder="Password" className="pr-12" />
                  <button
                    type="button"
                    aria-label="Toggle password visibility"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </span>
                {errors.password && <span className="mt-1 block text-xs text-rose-500">{errors.password}</span>}
              </label>
            )}

            {mode === "register" && (
              <label className="block">
                <span className="mb-2 block text-sm font-semibold">Confirm password</span>
                <span className="relative block">
                  <Input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    className="pr-12"
                  />
                  <button
                    type="button"
                    aria-label="Toggle confirm password visibility"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </span>
                {errors.confirmPassword && <span className="mt-1 block text-xs text-rose-500">{errors.confirmPassword}</span>}
              </label>
            )}

            {mode === "login" && (
              <Link to="/forgot-password" className="block text-right text-sm font-semibold text-cyan-600 dark:text-cyan-300">
                Forgot password?
              </Link>
            )}

            {mode === "register" && (
              <p className="flex gap-2 rounded-lg bg-cyan-400/10 p-3 text-xs leading-5 text-slate-600 dark:text-slate-300">
                <ShieldCheck className="h-4 w-4 shrink-0 text-cyan-500" />
                Demo auth stores users locally now and is wired for future JWT, MongoDB, and role-based login.
              </p>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Processing..." : details.cta}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
            {details.footer}{" "}
            <Link to={details.to} className="font-semibold text-cyan-600 dark:text-cyan-300">
              {details.link}
            </Link>
          </p>
        </Card>
      </section>
    </div>
  );
}
