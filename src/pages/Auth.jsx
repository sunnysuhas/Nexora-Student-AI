import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useAppStore } from "../store/useAppStore";

const copy = {
  login: {
    title: "Welcome back",
    subtitle: "Sign in to continue your student planning workspace.",
    cta: "Login",
    footer: "New to Nexora?",
    link: "Create an account",
    to: "/register",
  },
  register: {
    title: "Create your Nexora account",
    subtitle: "Register, verify your email, then complete onboarding.",
    cta: "Create account",
    footer: "Already verified?",
    link: "Login",
    to: "/login",
  },
  forgot: {
    title: "Recover access",
    subtitle: "Request a reset flow for your Nexora account.",
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
  const [notice, setNotice] = useState("");
  const [errors, setErrors] = useState({});
  const [resetRequested, setResetRequested] = useState(false);
  const { registerUser, login, forgotPassword, resetPassword, apiStatus, lastError } = useAppStore();
  const navigate = useNavigate();
  const details = copy[mode];
  const showApiBanner = apiStatus === "error" && isConnectionError(lastError);

  const submit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = form.get("email")?.toString().trim().toLowerCase() || "";
    const password = form.get("password")?.toString() || "";
    const confirmPassword = form.get("confirmPassword")?.toString() || "";
    const otp = form.get("otp")?.toString().trim() || "";
    const name = form.get("name")?.toString().trim() || "";
    const username = form.get("username")?.toString().trim().toLowerCase() || "";
    const remember = form.get("remember") === "on";
    const nextErrors = {};

    if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = "Enter a valid email.";
    if ((mode !== "forgot" || resetRequested) && password.length < 8) nextErrors.password = "Password must be at least 8 characters.";
    if (mode === "forgot" && resetRequested && otp.length < 4) nextErrors.otp = "Enter the reset OTP.";
    if (mode === "register") {
      if (name.length < 2) nextErrors.name = "Enter your full name.";
      if (username.length < 3) nextErrors.username = "Username must be at least 3 characters.";
      if (password !== confirmPassword) nextErrors.confirmPassword = "Passwords must match.";
    }

    setErrors(nextErrors);
    setNotice("");
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    if (mode === "forgot") {
      if (resetRequested) {
        const result = await resetPassword({ email, otp, password });
        setLoading(false);
        if (!result.ok) {
          setErrors({ form: result.error?.message || "Unable to reset password." });
          return;
        }
        setNotice("Password reset complete. You can log in now.");
        return;
      }
      const result = await forgotPassword(email);
      setLoading(false);
      if (!result.ok) {
        setErrors({ form: result.error?.message || "Unable to send reset OTP." });
        return;
      }
      setResetRequested(true);
      setNotice("If this email exists, a reset OTP has been sent.");
      return;
    }

    if (mode === "register") {
      const result = await registerUser({ name, username, email, password });
      setLoading(false);
      if (!result.ok) {
        setErrors({ form: result.reason || "Unable to register." });
        return;
      }
      navigate("/verify-email");
      return;
    }

    const result = await login(email, password, remember);
    setLoading(false);
    if (!result.ok) {
      if (result.verificationRequired) {
        navigate("/verify-email");
        return;
      }
      setErrors({ form: result.reason });
      return;
    }
    navigate(result.user.onboardingComplete ? "/dashboard" : "/onboarding");
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
          <h1 className="font-display text-6xl font-bold leading-none text-balance">Plan your semester before it plans you.</h1>
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
            Secure student accounts, onboarding-driven dashboards, attendance intelligence, and AI planning workflows.
          </p>
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
          {showApiBanner && (
            <p className="mt-4 rounded-lg bg-amber-400/15 p-3 text-sm font-semibold text-amber-700 dark:text-amber-200">
              Nexora API is unavailable: {lastError || "please confirm the backend is running."}
            </p>
          )}

          <form onSubmit={submit} className="mt-8 space-y-4">
            {mode === "register" && (
              <>
                <Field label="Full Name" name="name" placeholder="Your full name" error={errors.name} />
                <Field label="Username" name="username" placeholder="studentname" error={errors.username} />
              </>
            )}

            <Field label="Email" name="email" type="email" placeholder="student@example.com" error={errors.email} />

            {mode !== "forgot" && (
              <PasswordField
                label="Password"
                name="password"
                show={showPassword}
                setShow={setShowPassword}
                placeholder="Password"
                error={errors.password}
              />
            )}

            {mode === "forgot" && resetRequested && (
              <>
                <Field label="Reset OTP" name="otp" placeholder="Enter OTP" error={errors.otp} />
                <PasswordField
                  label="New password"
                  name="password"
                  show={showPassword}
                  setShow={setShowPassword}
                  placeholder="New password"
                  error={errors.password}
                />
              </>
            )}

            {mode === "register" && (
              <PasswordField
                label="Confirm password"
                name="confirmPassword"
                show={showConfirmPassword}
                setShow={setShowConfirmPassword}
                placeholder="Confirm password"
                error={errors.confirmPassword}
              />
            )}

            {mode === "login" && (
              <div className="flex items-center justify-between gap-3">
                <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                  <input
                    name="remember"
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 rounded border-slate-300 text-cyan-500 focus:ring-cyan-400"
                  />
                  Remember me
                </label>
                <Link to="/forgot-password" className="text-sm font-semibold text-cyan-600 dark:text-cyan-300">
                  Forgot password?
                </Link>
              </div>
            )}
            {notice && <p className="rounded-lg bg-emerald-400/15 p-3 text-sm font-semibold text-emerald-600 dark:text-emerald-300">{notice}</p>}
            {errors.form && <p className="rounded-lg bg-rose-400/15 p-3 text-sm font-semibold text-rose-600 dark:text-rose-300">{errors.form}</p>}
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

function isConnectionError(message = "") {
  return /backend|network|cors|offline|blocked|timeout|timed out|failed to fetch|server/i.test(message);
}

function Field({ label, error, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <Input {...props} />
      {error && <span className="mt-1 block text-xs text-rose-500">{error}</span>}
    </label>
  );
}

function PasswordField({ label, name, show, setShow, placeholder, error }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <span className="relative block">
        <Input name={name} type={show ? "text" : "password"} placeholder={placeholder} className="pr-12" />
        <button
          type="button"
          aria-label={`Toggle ${label.toLowerCase()} visibility`}
          onClick={() => setShow((value) => !value)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </span>
      {error && <span className="mt-1 block text-xs text-rose-500">{error}</span>}
    </label>
  );
}
