import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, GraduationCap, Target, UserRound } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useAppStore } from "../store/useAppStore";

const steps = [
  { label: "Identity", icon: UserRound },
  { label: "Academic", icon: GraduationCap },
  { label: "Preferences", icon: Target },
];

export function Onboarding() {
  const navigate = useNavigate();
  const { profile, currentUser, completeOnboarding } = useAppStore();
  const [step, setStep] = useState(0);
  const [notice, setNotice] = useState("");
  const [draft, setDraft] = useState({
    ...profile,
    fullName: profile.fullName || currentUser?.name || "",
    username: profile.username || currentUser?.username || "",
    email: profile.email || currentUser?.email || "",
  });

  const missingFields = useMemo(() => {
    const required = step === 0 ? ["fullName", "username"] : step === 1 ? ["college", "course", "semester"] : [];
    return required.filter((key) => !String(draft[key] || "").trim());
  }, [draft, step]);

  const continueStep = () => {
    if (missingFields.length) {
      setNotice("Complete the required fields before continuing.");
      return;
    }
    setNotice("");
    setStep((value) => Math.min(value + 1, steps.length - 1));
  };

  const finish = async () => {
    const required = ["fullName", "username", "college", "course", "semester"];
    const missing = required.filter((key) => !String(draft[key] || "").trim());
    if (missing.length) {
      setNotice("Identity and academic details are required before the dashboard unlocks.");
      setStep(missing.some((key) => ["college", "course", "semester"].includes(key)) ? 1 : 0);
      return;
    }
    const result = await completeOnboarding({
      ...draft,
      attendanceGoal: Number(draft.attendanceGoal) || 85,
      dailyStudyHoursGoal: Number(draft.dailyStudyHoursGoal) || 3,
      focusSessionDuration: Number(draft.focusSessionDuration) || 25,
    });
    if (!result.ok) {
      setNotice(result.reason || "Unable to save onboarding. Please try again.");
      return;
    }
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 text-slate-950 dark:text-white">
      <Card className="w-full max-w-4xl">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-300">Mandatory onboarding</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-balance">Personalize your student planning system</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
          Nexora needs your academic context before it can unlock a useful dashboard. These details are saved to your account and can be edited later.
        </p>

        <div className="mt-6 grid grid-cols-3 gap-2">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={`rounded-lg p-3 text-center text-sm font-bold transition ${
                  index <= step ? "bg-cyan-400/15 text-cyan-700 dark:text-cyan-300" : "bg-slate-950/5 text-slate-500 dark:bg-white/10"
                }`}
              >
                <Icon className="mx-auto mb-2 h-4 w-4" />
                {item.label}
              </div>
            );
          })}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {step === 0 && (
            <>
              <Field required label="Full Name" value={draft.fullName} onChange={(value) => setDraft({ ...draft, fullName: value })} />
              <Field required label="Username" value={draft.username} onChange={(value) => setDraft({ ...draft, username: value })} />
              <Field label="Email" type="email" value={draft.email} onChange={(value) => setDraft({ ...draft, email: value })} />
              <Field label="Bio" value={draft.bio} onChange={(value) => setDraft({ ...draft, bio: value })} />
            </>
          )}
          {step === 1 && (
            <>
              <Field required label="College/School" value={draft.college} onChange={(value) => setDraft({ ...draft, college: value })} />
              <Field required label="Course/Branch" value={draft.course} onChange={(value) => setDraft({ ...draft, course: value })} />
              <Field required label="Semester/Year" value={draft.semester} onChange={(value) => setDraft({ ...draft, semester: value })} />
              <Field label="Attendance Goal %" type="number" value={draft.attendanceGoal} onChange={(value) => setDraft({ ...draft, attendanceGoal: value })} />
            </>
          )}
          {step === 2 && (
            <>
              <Field label="Daily Study Hours Goal" type="number" value={draft.dailyStudyHoursGoal} onChange={(value) => setDraft({ ...draft, dailyStudyHoursGoal: value })} />
              <Field label="Preferred Reminder Time" type="time" value={draft.reminderTime} onChange={(value) => setDraft({ ...draft, reminderTime: value })} />
              <Field label="Focus Session Duration" type="number" value={draft.focusSessionDuration} onChange={(value) => setDraft({ ...draft, focusSessionDuration: value })} />
              <Field label="Subjects" value={draft.subjectsText || ""} onChange={(value) => setDraft({ ...draft, subjectsText: value })} placeholder="Math, Physics, DBMS" />
            </>
          )}
        </div>

        {notice && <p className="mt-5 rounded-lg bg-amber-400/15 p-3 text-sm font-semibold text-amber-700 dark:text-amber-200">{notice}</p>}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Button type="button" variant="secondary" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          {step < steps.length - 1 ? (
            <Button type="button" onClick={continueStep}>
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="button" onClick={finish}>
              <CheckCircle2 className="h-4 w-4" /> Save and Open Dashboard
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required = false, placeholder = "" }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">
        {label} {required && <span className="text-cyan-500">*</span>}
      </span>
      <Input type={type} value={value || ""} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </label>
  );
}
