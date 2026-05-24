import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MailCheck, Sparkles } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useAppStore } from "../store/useAppStore";

export function VerifyEmail() {
  const navigate = useNavigate();
  const { pendingVerificationEmail, verifyUser, resendOtp } = useAppStore();
  const [email, setEmail] = useState(pendingVerificationEmail);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedCode = code.trim();
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setError("Enter the email address you registered with.");
      return;
    }
    if (!/^\d{6}$/.test(normalizedCode)) {
      setError("Enter the 6-digit OTP from your email.");
      return;
    }
    setLoading(true);
    setError("");
    setNotice("");
    const result = await verifyUser(normalizedEmail, normalizedCode);
    setLoading(false);
    if (!result.ok) {
      setError(result.reason || "Invalid verification code.");
      return;
    }
    navigate("/login");
  };

  const resend = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setError("Enter your registered email before requesting a new OTP.");
      return;
    }
    setError("");
    setNotice("");
    setResending(true);
    const result = await resendOtp(normalizedEmail);
    setResending(false);
    if (!result.ok) {
      setError(result.reason || "Unable to resend OTP.");
      return;
    }
    setNotice("A fresh 6-digit OTP has been sent to your email.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 text-slate-950 dark:text-white">
      <Card className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-cyan-500" />
          <span className="font-display text-xl font-bold">Nexora AI</span>
        </Link>
        <MailCheck className="mb-5 h-10 w-10 text-cyan-500" />
        <h1 className="font-display text-3xl font-bold">Verify your email</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          Enter the OTP sent by Nexora AI. Verification is required before you can sign in and unlock the planner workspace.
        </p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
          <Input
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            placeholder="6-digit verification code"
          />
          {notice && <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-300">{notice}</p>}
          {error && <p className="text-sm font-semibold text-rose-500">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">{loading ? "Verifying..." : "Verify and continue to login"}</Button>
          <Button type="button" variant="secondary" onClick={resend} disabled={resending} className="w-full">
            {resending ? "Sending..." : "Resend OTP"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
