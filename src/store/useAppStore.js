import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  aiService,
  adminService,
  assignmentService,
  attendanceService,
  authService,
  examService,
  goalService,
  noteService,
  notificationService,
  taskService,
} from "../services/api";
import { ApiError, clearTokens, getAccessToken } from "../utils/apiClient";
import { buildDailyNotifications, normalizeId } from "../utils/productivity";

const makeId = () => crypto.randomUUID();
const workspaceKeys = ["tasks", "assignments", "subjects", "exams", "notes", "goals", "notificationsList", "aiChats"];

const emptyWorkspace = () =>
  workspaceKeys.reduce((workspace, key) => {
    workspace[key] = [];
    return workspace;
  }, {});

const emptyProfile = {
  fullName: "",
  username: "",
  email: "",
  college: "",
  course: "",
  semester: "",
  bio: "",
  skills: [],
  socialLinks: { github: "", linkedin: "" },
  profileImage: "",
  attendanceGoal: 85,
  dailyStudyHoursGoal: 3,
  reminderTime: "19:00",
  focusSessionDuration: 25,
};

const services = {
  tasks: taskService,
  assignments: assignmentService,
  subjects: attendanceService,
  exams: examService,
  notes: noteService,
  goals: goalService,
  notificationsList: notificationService,
};

const mapUser = (user) => {
  if (!user) return null;
  const profile = {
    ...emptyProfile,
    fullName: user.name || user.profile?.fullName || "",
    username: user.username || "",
    email: user.email || "",
    college: user.college || "",
    course: user.course || "",
    semester: user.semester || "",
    bio: user.bio || "",
    profileImage: user.profileImageUrl || user.profileImage || "",
    attendanceGoal: user.attendanceGoal || 85,
    dailyStudyHoursGoal: user.dailyStudyHoursGoal || 3,
    reminderTime: user.reminderTime || "19:00",
    focusSessionDuration: user.focusSessionDuration || 25,
  };
  return {
    ...user,
    id: user.id || user._id,
    name: profile.fullName,
    profile,
    verified: Boolean(user.verified || user.isEmailVerified || user.emailVerified),
    onboardingComplete: Boolean(user.onboardingComplete),
  };
};

const workspacePatch = (state, overrides = {}) => {
  if (!state.currentUser?.id) return {};
  const workspace = workspaceKeys.reduce((snapshot, key) => {
    snapshot[key] = overrides[key] || state[key] || [];
    return snapshot;
  }, {});
  return {
    currentUser: { ...state.currentUser, workspace },
  };
};

async function withApi(set, action) {
  try {
    const result = await action();
    set({ apiStatus: "online", lastError: "" });
    return { ok: true, result };
  } catch (error) {
    if (error instanceof ApiError) {
      set({ apiStatus: "online", lastError: "" });
    } else {
      set({ apiStatus: "error", lastError: error.message || "API unavailable" });
    }
    return { ok: false, error };
  }
}

export const useAppStore = create(
  persist(
    (set, get) => ({
      theme: "dark",
      apiStatus: "checking",
      lastError: "",
      isAuthenticated: false,
      rememberSession: true,
      currentUser: null,
      pendingVerificationEmail: "",
      profile: emptyProfile,
      onboardingComplete: false,
      tasks: [],
      assignments: [],
      subjects: [],
      exams: [],
      notes: [],
      goals: [],
      notificationsList: [],
      aiChats: [],
      notifications: true,
      compactMode: false,
      accentColor: "cyan",
      widgets: {
        today: true,
        attendance: true,
        exams: true,
        reminders: true,
        progress: true,
        ai: true,
      },
      adminOverview: null,
      adminUsers: [],
      focusTimer: {
        duration: 25,
        remaining: 25 * 60,
        deadline: null,
        running: false,
        complete: false,
      },
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
      setAccentColor: (accentColor) => set({ accentColor }),
      bootstrapSession: async () => {
        if (!getAccessToken()) {
          set({ apiStatus: "checking", lastError: "", isAuthenticated: false, currentUser: null, onboardingComplete: false, ...emptyWorkspace() });
          return false;
        }
        const response = await withApi(set, () => authService.me());
        if (!response.ok) {
          clearTokens();
          set({ isAuthenticated: false, currentUser: null, onboardingComplete: false, ...emptyWorkspace() });
          return false;
        }
        const user = mapUser(response.result.user);
        set({
          isAuthenticated: true,
          currentUser: user,
          profile: user.profile,
          onboardingComplete: user.onboardingComplete,
        });
        await get().loadWorkspace();
        get().syncNotifications();
        return true;
      },
      loadWorkspace: async () => {
        const loaders = await Promise.allSettled([
          taskService.list(),
          assignmentService.list(),
          attendanceService.list(),
          examService.list(),
          noteService.list(),
          goalService.list(),
          notificationService.list(),
          aiService.chats(),
        ]);
        if (loaders.some((item) => item.status === "rejected")) {
          set({ apiStatus: "error", lastError: "Unable to load workspace data." });
          return false;
        }
        const [tasks, assignments, subjects, exams, notes, goals, notificationsList, aiChats] = loaders.map((item) => item.value);
        set((state) => ({
          apiStatus: "online",
          tasks: (tasks.items || []).map(normalizeId),
          assignments: (assignments.items || []).map(normalizeId),
          subjects: (subjects.items || []).map(normalizeId),
          exams: (exams.items || []).map(normalizeId),
          notes: (notes.items || []).map(normalizeId),
          goals: (goals.items || []).map(normalizeId),
          notificationsList: (notificationsList.items || []).map(normalizeId),
          aiChats: (aiChats.chats || []).map(normalizeId),
          ...workspacePatch(state, {
            tasks: (tasks.items || []).map(normalizeId),
            assignments: (assignments.items || []).map(normalizeId),
            subjects: (subjects.items || []).map(normalizeId),
            exams: (exams.items || []).map(normalizeId),
            notes: (notes.items || []).map(normalizeId),
            goals: (goals.items || []).map(normalizeId),
            notificationsList: (notificationsList.items || []).map(normalizeId),
            aiChats: (aiChats.chats || []).map(normalizeId),
          }),
        }));
        return true;
      },
      registerUser: async (user) => {
        const response = await withApi(set, () =>
          authService.register({ name: user.name, username: user.username, email: user.email, password: user.password })
        );
        if (response.ok) {
          const createdUser = mapUser(response.result.user);
          set({
            isAuthenticated: true,
            rememberSession: true,
            currentUser: createdUser,
            profile: createdUser.profile,
            onboardingComplete: createdUser.onboardingComplete,
            pendingVerificationEmail: createdUser.email,
            ...emptyWorkspace(),
          });
          await get().loadWorkspace();
          return { ok: true, via: "api", user: createdUser, emailDelivery: response.result.emailDelivery };
        }
        return { ok: false, reason: response.error?.message || "Registration failed." };
      },
      verifyUser: async (email, code) => {
        const response = await withApi(set, () => authService.verifyOtp({ email, otp: code }));
        if (response.ok) return { ok: true, via: "api" };
        return { ok: false, reason: response.error?.message || "Invalid verification code." };
      },
      resendOtp: async (email) => {
        const response = await withApi(set, () => authService.resendOtp({ email }));
        return response.ok ? { ok: true } : { ok: false, reason: response.error?.message || "Unable to resend OTP." };
      },
      sendVerificationEmail: async () => {
        const response = await withApi(set, () => authService.sendVerificationEmail());
        return response.ok
          ? { ok: true, emailDelivery: response.result.emailDelivery, message: response.result.message }
          : { ok: false, reason: response.error?.message || "Unable to send verification email." };
      },
      verifyEmail: async (otp) => {
        const response = await withApi(set, () => authService.verifyEmail({ otp }));
        if (!response.ok) return { ok: false, reason: response.error?.message || "Unable to verify email." };
        const user = mapUser(response.result.user);
        set({ currentUser: user, profile: user.profile });
        return { ok: true, user };
      },
      login: async (email, password, remember = true) => {
        const response = await withApi(set, () => authService.login({ email, password, remember }));
        if (response.ok) {
          const user = mapUser(response.result.user);
          set({
            isAuthenticated: true,
            rememberSession: remember,
            currentUser: user,
            profile: user.profile,
            onboardingComplete: user.onboardingComplete,
            ...emptyWorkspace(),
          });
          await get().loadWorkspace();
          get().syncNotifications();
          return { ok: true, user };
        }
        return { ok: false, reason: response.error?.message || "Invalid email or password." };
      },
      forgotPassword: async (email) => withApi(set, () => authService.forgotPassword({ email })),
      resetPassword: async (payload) => withApi(set, () => authService.resetPassword(payload)),
      logout: () => {
        authService.logout().catch(() => undefined);
        clearTokens();
        set({ apiStatus: "checking", lastError: "", isAuthenticated: false, rememberSession: true, currentUser: null, onboardingComplete: false, ...emptyWorkspace() });
      },
      completeOnboarding: async (profileUpdate) => {
        const profile = { ...get().profile, ...profileUpdate };
        const payload = {
          name: profile.fullName,
          username: profile.username,
          email: profile.email,
          college: profile.college,
          course: profile.course,
          semester: profile.semester,
          bio: profile.bio,
          attendanceGoal: Number(profile.attendanceGoal) || 85,
          dailyStudyHoursGoal: Number(profile.dailyStudyHoursGoal) || 3,
          reminderTime: profile.reminderTime,
          focusSessionDuration: Number(profile.focusSessionDuration) || 25,
        };
        const response = await withApi(set, () => authService.onboarding(payload));
        if (!response.ok) return { ok: false, reason: response.error?.message || "Unable to save onboarding." };
        const user = response.ok ? mapUser(response.result.user) : null;
        const nextProfile = user?.profile || { ...profile, ...payload };
        set((state) => ({
          profile: nextProfile,
          onboardingComplete: true,
          currentUser: state.currentUser ? { ...state.currentUser, ...(user || {}), profile: nextProfile, onboardingComplete: true } : state.currentUser,
        }));
        const subjectNames = String(profileUpdate.subjectsText || "")
          .split(",")
          .map((subject) => subject.trim())
          .filter(Boolean);
        await Promise.allSettled([
          goalService.create({ title: "Daily Study Hours", target: payload.dailyStudyHoursGoal, current: 0, unit: "hours" }),
          goalService.create({ title: "Attendance Goal", target: payload.attendanceGoal, current: 0, unit: "%" }),
          ...subjectNames.map((name) => attendanceService.create({ name, totalClasses: 0, present: 0, absent: 0, holidays: 0 })),
        ]);
        await get().loadWorkspace();
        return { ok: true };
      },
      updateProfile: async (profileUpdate) => {
        const profile = { ...get().profile, ...profileUpdate };
        const response = await withApi(set, () =>
          authService.profile({
            name: profile.fullName,
            username: profile.username,
            email: profile.email,
            college: profile.college,
            course: profile.course,
            semester: profile.semester,
            bio: profile.bio,
            attendanceGoal: profile.attendanceGoal,
            dailyStudyHoursGoal: profile.dailyStudyHoursGoal,
            reminderTime: profile.reminderTime,
            focusSessionDuration: profile.focusSessionDuration,
          })
        );
        if (!response.ok) return false;
        const nextProfile = mapUser(response.result.user).profile;
        set((state) => ({
          profile: nextProfile,
          currentUser: state.currentUser ? { ...state.currentUser, profile: nextProfile } : state.currentUser,
        }));
        return response.ok;
      },
      uploadProfileImage: async (file) => {
        const formData = new FormData();
        formData.append("image", file);
        const response = await withApi(set, () => authService.uploadProfileImage(formData));
        if (!response.ok) return { ok: false, reason: "Cloudinary upload is unavailable until backend env vars are configured." };
        const nextProfile = mapUser(response.result.user).profile;
        set({ profile: nextProfile, currentUser: mapUser(response.result.user) });
        return { ok: true, imageUrl: response.result.imageUrl };
      },
      removeProfileImage: async () => {
        const response = await withApi(set, () => authService.deleteProfileImage());
        if (!response.ok) return { ok: false, reason: response.error?.message || "Unable to remove profile image." };
        const user = mapUser(response.result.user);
        set({ profile: user.profile, currentUser: user });
        return { ok: true };
      },
      toggleNotifications: () => set((state) => ({ notifications: !state.notifications })),
      toggleCompactMode: () => set((state) => ({ compactMode: !state.compactMode })),
      toggleWidget: (key) => set((state) => ({ widgets: { ...state.widgets, [key]: !state.widgets[key] } })),
      syncNotifications: async () => {
        const state = get();
        const generated = buildDailyNotifications(state);
        const existingKeys = new Set(state.notificationsList.map((item) => `${item.type}-${item.title}-${item.body}`));
        const fresh = generated.filter((item) => !existingKeys.has(`${item.type}-${item.title}-${item.body}`));
        if (!fresh.length) return;
        const created = await Promise.allSettled(fresh.map((item) => notificationService.create({ ...item, read: false })));
        const items = created
          .filter((item) => item.status === "fulfilled")
          .map((item) => normalizeId(item.value.item));
        if (!items.length) return;
        set((current) => {
          const notificationsList = [...items, ...current.notificationsList].slice(0, 20);
          return { notificationsList, ...workspacePatch(current, { notificationsList }) };
        });
      },
      addTask: (task) => get().createResource("tasks", { ...task, status: task.status || "Pending", tags: task.tags || [] }),
      updateTask: (taskId, update) => get().updateResource("tasks", taskId, update),
      moveTask: (taskId, status) => get().updateResource("tasks", taskId, { status }),
      deleteTask: (taskId) => get().deleteResource("tasks", taskId),
      addAssignment: (assignment) => get().createResource("assignments", { ...assignment, status: assignment.status || "Not Started" }),
      updateAssignment: (assignmentId, update) => get().updateResource("assignments", assignmentId, update),
      deleteAssignment: (assignmentId) => get().deleteResource("assignments", assignmentId),
      addSubject: (subject) => get().createResource("subjects", { ...subject, name: subject.name || subject.subject, totalClasses: 0, present: 0, absent: 0, holidays: 0 }),
      updateSubject: (subjectId, update) => get().updateResource("subjects", subjectId, update),
      deleteSubject: (subjectId) => get().deleteResource("subjects", subjectId),
      markAttendance: (subjectId, type) => {
        const subject = get().subjects.find((item) => item.id === subjectId);
        if (!subject) return;
        const key = type === "present" ? "present" : type === "absent" ? "absent" : "holidays";
        get().updateResource("subjects", subjectId, {
          [key]: Number(subject[key] || 0) + 1,
          totalClasses: Number(subject.totalClasses || subject.present + subject.absent + subject.holidays || 0) + 1,
        });
      },
      addExam: (exam) => get().createResource("exams", { ...exam, reminder: true }),
      updateExam: (examId, update) => get().updateResource("exams", examId, update),
      deleteExam: (examId) => get().deleteResource("exams", examId),
      addNote: (note) => get().createResource("notes", { ...note, images: note.images || [] }),
      updateNote: (noteId, update) => get().updateResource("notes", noteId, update),
      deleteNote: (noteId) => get().deleteResource("notes", noteId),
      uploadNoteImage: async (noteId, file) => {
        const formData = new FormData();
        formData.append("image", file);
        const response = await withApi(set, () => noteService.uploadImage(noteId, formData));
        if (response.ok) {
          const item = normalizeId(response.result.item);
          set((state) => {
            const notes = state.notes.map((note) => (note.id === noteId ? item : note));
            return { notes, ...workspacePatch(state, { notes }) };
          });
          return { ok: true };
        }
        return { ok: false, reason: "Cloudinary note upload is unavailable until backend env vars are configured." };
      },
      addGoal: (goal) => get().createResource("goals", goal),
      updateGoal: (goalId, update) => get().updateResource("goals", goalId, update),
      deleteGoal: (goalId) => get().deleteResource("goals", goalId),
      addNotification: (notification) => get().createResource("notificationsList", { ...notification, read: false }),
      markNotificationRead: (notificationId) => get().updateResource("notificationsList", notificationId, { read: true }),
      deleteNotification: (notificationId) => get().deleteResource("notificationsList", notificationId),
      createResource: async (key, payload) => {
        const service = services[key];
        if (!service) throw new Error(`Missing service for ${key}`);
        const response = await withApi(set, () => service.create(payload));
        if (response.ok) {
          const item = normalizeId(response.result.item);
          set((state) => {
            const items = [item, ...state[key]];
            return { [key]: items, ...workspacePatch(state, { [key]: items }) };
          });
          return item;
        }
        throw response.error;
      },
      updateResource: async (key, id, update) => {
        const service = services[key];
        if (!service) return;
        const response = await withApi(set, () => service.update(id, update));
        if (response.ok) {
          const item = normalizeId(response.result.item);
          set((state) => {
            const items = state[key].map((entry) => (entry.id === id ? item : entry));
            return { [key]: items, ...workspacePatch(state, { [key]: items }) };
          });
        }
        if (!response.ok) throw response.error;
      },
      deleteResource: async (key, id) => {
        const previous = get()[key];
        set((state) => {
          const items = state[key].filter((item) => item.id !== id);
          return { [key]: items, ...workspacePatch(state, { [key]: items }) };
        });
        const service = services[key];
        if (service) {
          const response = await withApi(set, () => service.remove(id));
          if (!response.ok) {
            set((state) => ({ [key]: previous, ...workspacePatch(state, { [key]: previous }) }));
            throw response.error;
          }
        }
      },
      addChatMessage: (chatId, message) =>
        set((state) => {
          const aiChats = state.aiChats.map((chat) => (chat.id === chatId ? { ...chat, messages: [...chat.messages, message] } : chat));
          return { aiChats, ...workspacePatch(state, { aiChats }) };
        }),
      askAssistant: async (chatId, message) => {
        get().addChatMessage(chatId, { role: "user", text: message, content: message });
        const response = await withApi(set, () =>
          aiService.chat({ title: "Productivity plan", messages: [{ role: "user", content: message }] })
        );
        if (!response.ok) {
          get().addChatMessage(chatId, {
            role: "ai",
            text: response.error?.message || "Nexora AI is unavailable right now. Please try again when the API connection is restored.",
            content: response.error?.message || "Nexora AI is unavailable right now. Please try again when the API connection is restored.",
          });
          return;
        }
        get().addChatMessage(chatId, { role: "ai", text: response.result.answer, content: response.result.answer });
      },
      startAiChat: () => {
        const chat = { id: makeId(), userId: get().currentUser?.id, title: "Productivity plan", messages: [] };
        set((state) => {
          const aiChats = [chat, ...state.aiChats];
          return { aiChats, ...workspacePatch(state, { aiChats }) };
        });
        return chat.id;
      },
      setFocusDuration: (duration) =>
        set((state) => ({
          focusTimer: {
            ...state.focusTimer,
            duration,
            remaining: state.focusTimer.running ? state.focusTimer.remaining : duration * 60,
          },
        })),
      startFocusTimer: async () => {
        const remaining = Math.max(1, get().focusTimer.remaining || get().focusTimer.duration * 60);
        set((state) => ({
          focusTimer: {
            ...state.focusTimer,
            remaining,
            deadline: Date.now() + remaining * 1000,
            running: true,
            complete: false,
          },
        }));
      },
      pauseFocusTimer: () =>
        set((state) => ({
          focusTimer: {
            ...state.focusTimer,
            remaining: state.focusTimer.deadline ? Math.max(0, Math.ceil((state.focusTimer.deadline - Date.now()) / 1000)) : state.focusTimer.remaining,
            deadline: null,
            running: false,
          },
        })),
      resetFocusTimer: () =>
        set((state) => ({
          focusTimer: {
            ...state.focusTimer,
            remaining: state.focusTimer.duration * 60,
            deadline: null,
            running: false,
            complete: false,
          },
        })),
      tickFocusTimer: () => {
        const state = get();
        if (!state.focusTimer.running || !state.focusTimer.deadline) return false;
        const remaining = Math.max(0, Math.ceil((state.focusTimer.deadline - Date.now()) / 1000));
        set((current) => ({ focusTimer: { ...current.focusTimer, remaining } }));
        if (remaining > 0) return false;

        set((current) => ({
          focusTimer: {
            ...current.focusTimer,
            remaining: 0,
            deadline: null,
            running: false,
            complete: true,
          },
        }));
        return true;
      },
      loadAdminData: async () => {
        const [overview, users] = await Promise.all([adminService.overview(), adminService.users()]);
        set({
          adminOverview: overview,
          adminUsers: (users.users || []).map(mapUser),
          apiStatus: "online",
          lastError: "",
        });
        return { overview, users: users.users || [] };
      },
      deleteUser: async (userId) => {
        await adminService.removeUser(userId);
        set((state) => ({ adminUsers: state.adminUsers.filter((user) => user.id !== userId) }));
      },
    }),
    {
      name: "nexora-ai-saas-storage",
      partialize: (state) => ({
        theme: state.theme,
        rememberSession: state.rememberSession,
        isAuthenticated: state.rememberSession ? state.isAuthenticated : false,
        currentUser: state.rememberSession ? state.currentUser : null,
        pendingVerificationEmail: state.pendingVerificationEmail,
        profile: state.rememberSession ? state.profile : emptyProfile,
        onboardingComplete: state.rememberSession ? state.onboardingComplete : false,
        notifications: state.notifications,
        compactMode: state.compactMode,
        accentColor: state.accentColor,
        widgets: state.widgets,
        focusTimer: state.focusTimer,
      }),
    }
  )
);
