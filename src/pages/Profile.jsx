import { useState } from "react";
import { LogOut, Save, Trash2, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../layouts/AppShell";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useAppStore } from "../store/useAppStore";
import { assignmentStatus, completedCount, overallAttendance, productivityScore, taskStatus } from "../utils/productivity";

export function Profile() {
  const navigate = useNavigate();
  const { profile, updateProfile, uploadProfileImage, removeProfileImage, logout, tasks, assignments, subjects, goals, apiStatus } = useAppStore();
  const [draft, setDraft] = useState(profile);
  const [notice, setNotice] = useState("");
  const score = productivityScore({ tasks, assignments, subjects, goals });

  const save = async () => {
    const ok = await updateProfile(draft);
    setNotice(ok ? "Profile saved to MongoDB." : "Unable to save profile. Please check the API connection and try again.");
  };

  const upload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const result = await uploadProfileImage(file);
    setNotice(result.ok ? "Profile image uploaded." : result.reason);
  };

  const removeImage = async () => {
    const result = await removeProfileImage();
    setNotice(result.ok ? "Profile image removed." : result.reason);
  };

  const signOut = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppShell title="Profile" eyebrow="Productivity Profile">
      <div className="grid gap-4 xl:grid-cols-[0.75fr_1.25fr]">
        <Card className="text-center">
          {profile.profileImage ? (
            <img src={profile.profileImage} alt="" className="mx-auto h-24 w-24 rounded-full object-cover" />
          ) : (
            <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 text-3xl font-bold text-white">
              {profile.fullName?.slice(0, 1) || "N"}
            </div>
          )}
          <h2 className="mt-5 font-display text-2xl font-bold">{profile.fullName}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">@{profile.username}</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{profile.email}</p>
          <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{profile.college} / {profile.course} / {profile.semester}</p>
          <div className="mt-6 grid grid-cols-2 gap-2">
            {[
              ["Score", `${score}%`],
              ["Attendance", `${overallAttendance(subjects)}%`],
              ["Tasks", completedCount(tasks, taskStatus)],
              ["Assignments", completedCount(assignments, assignmentStatus)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-slate-950/5 p-3 dark:bg-white/10">
                <p className="font-display text-xl font-bold">{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            ))}
          </div>
          {apiStatus === "error" && (
            <p className="mt-4 rounded-lg bg-rose-400/10 p-3 text-xs font-bold text-rose-700 dark:text-rose-300">
              API connection needs attention. Recent changes may not save.
            </p>
          )}
        </Card>

        <Card>
          <h2 className="font-display text-2xl font-bold">Edit profile</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Field label="Full name" value={draft.fullName} onChange={(value) => setDraft({ ...draft, fullName: value })} />
            <Field label="Username" value={draft.username} onChange={(value) => setDraft({ ...draft, username: value })} />
            <Field label="Email" type="email" value={draft.email} onChange={(value) => setDraft({ ...draft, email: value })} />
            <Field label="College" value={draft.college} onChange={(value) => setDraft({ ...draft, college: value })} />
            <Field label="Course" value={draft.course} onChange={(value) => setDraft({ ...draft, course: value })} />
            <Field label="Semester" value={draft.semester} onChange={(value) => setDraft({ ...draft, semester: value })} />
          </div>
          <label className="mt-4 block">
            <span className="mb-2 block text-sm font-semibold">Bio</span>
            <textarea
              value={draft.bio || ""}
              onChange={(event) => setDraft({ ...draft, bio: event.target.value })}
              className="min-h-28 w-full rounded-lg border border-slate-300/70 bg-white/70 p-4 text-sm text-slate-950 outline-none focus:border-cyan-400 dark:border-white/15 dark:!bg-slate-950/60 dark:text-white"
            />
          </label>
          {notice && <p className="mt-4 rounded-lg bg-cyan-400/10 p-3 text-sm font-semibold text-cyan-700 dark:text-cyan-300">{notice}</p>}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button type="button" onClick={save}><Save className="h-4 w-4" /> Save Changes</Button>
            <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-300/70 bg-white/60 px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-cyan-400 hover:text-cyan-700 dark:border-white/15 dark:!bg-slate-950/60 dark:text-white">
              <Upload className="h-4 w-4" /> Upload Profile Image
              <input type="file" accept="image/*" onChange={upload} className="hidden" />
            </label>
            <Button type="button" variant="secondary" onClick={removeImage}><Trash2 className="h-4 w-4" /> Remove Image</Button>
            <Button type="button" variant="secondary" onClick={signOut}><LogOut className="h-4 w-4" /> Sign out</Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <Input type={type} value={value || ""} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
