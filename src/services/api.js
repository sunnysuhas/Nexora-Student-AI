import { apiRequest, apiRoutes, assertApiAvailable, saveTokens } from "../utils/apiClient";

export const authService = {
  register: async (payload) => {
    await assertApiAvailable();
    const data = await apiRequest(apiRoutes.auth.register, { method: "POST", body: payload });
    saveTokens(data, true);
    return data;
  },
  verifyOtp: async (payload) => {
    await assertApiAvailable();
    return apiRequest(apiRoutes.auth.verifyOtp, { method: "POST", body: payload });
  },
  resendOtp: async (payload) => {
    await assertApiAvailable();
    return apiRequest(apiRoutes.auth.resendOtp, { method: "POST", body: payload });
  },
  sendVerificationEmail: async () => {
    await assertApiAvailable();
    return apiRequest(apiRoutes.auth.sendVerificationEmail, { method: "POST" });
  },
  verifyEmail: async (payload) => {
    await assertApiAvailable();
    return apiRequest(apiRoutes.auth.verifyEmail, { method: "POST", body: payload });
  },
  login: async (payload) => {
    await assertApiAvailable();
    const data = await apiRequest(apiRoutes.auth.login, { method: "POST", body: payload });
    saveTokens(data, payload.remember !== false);
    return data;
  },
  logout: () => apiRequest(apiRoutes.auth.logout, { method: "POST" }),
  forgotPassword: async (payload) => {
    await assertApiAvailable();
    return apiRequest(apiRoutes.auth.forgotPassword, { method: "POST", body: payload });
  },
  resetPassword: async (payload) => {
    await assertApiAvailable();
    return apiRequest(apiRoutes.auth.resetPassword, { method: "POST", body: payload });
  },
  me: () => apiRequest(apiRoutes.auth.me),
  profile: (payload) => apiRequest(apiRoutes.auth.profile, { method: "PATCH", body: payload }),
  onboarding: (payload) => apiRequest(apiRoutes.auth.onboarding, { method: "POST", body: payload }),
  uploadProfileImage: (formData) => apiRequest(apiRoutes.auth.profileImage, { method: "POST", body: formData }),
  deleteProfileImage: () => apiRequest(apiRoutes.auth.profileImage, { method: "DELETE" }),
};

export function crudService(path) {
  return {
    list: () => apiRequest(path),
    create: (payload) => apiRequest(path, { method: "POST", body: payload }),
    update: (id, payload) => apiRequest(`${path}/${id}`, { method: "PATCH", body: payload }),
    remove: (id) => apiRequest(`${path}/${id}`, { method: "DELETE" }),
  };
}

export const taskService = crudService(apiRoutes.tasks);
export const noteService = crudService(apiRoutes.notes);
noteService.uploadImage = (id, formData) => apiRequest(`${apiRoutes.notes}/${id}/images`, { method: "POST", body: formData });
export const assignmentService = crudService(apiRoutes.assignments);
export const attendanceService = crudService(apiRoutes.attendance);
export const examService = crudService(apiRoutes.exams);
export const goalService = crudService(apiRoutes.goals);
export const notificationService = crudService(apiRoutes.notifications);

export const aiService = {
  chats: () => apiRequest("/ai/chats"),
  chat: (payload) => apiRequest("/ai/chat", { method: "POST", body: payload }),
};

export const adminService = {
  overview: () => apiRequest("/admin/overview"),
  users: () => apiRequest("/admin/users"),
  removeUser: (id) => apiRequest(`/admin/users/${id}`, { method: "DELETE" }),
};
