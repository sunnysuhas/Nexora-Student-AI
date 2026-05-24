import { apiRequest, apiRoutes, assertApiAvailable, saveTokens } from "../utils/apiClient";

export const authService = {
  register: async (payload) => {
    await assertApiAvailable();
    return apiRequest(apiRoutes.auth.register, { method: "POST", body: JSON.stringify(payload) });
  },
  verifyOtp: async (payload) => {
    await assertApiAvailable();
    return apiRequest(apiRoutes.auth.verifyOtp, { method: "POST", body: JSON.stringify(payload) });
  },
  resendOtp: async (payload) => {
    await assertApiAvailable();
    return apiRequest(apiRoutes.auth.resendOtp, { method: "POST", body: JSON.stringify(payload) });
  },
  login: async (payload) => {
    await assertApiAvailable();
    const data = await apiRequest(apiRoutes.auth.login, { method: "POST", body: JSON.stringify(payload) });
    saveTokens(data, payload.remember !== false);
    return data;
  },
  logout: () => apiRequest(apiRoutes.auth.logout, { method: "POST" }),
  forgotPassword: async (payload) => {
    await assertApiAvailable();
    return apiRequest(apiRoutes.auth.forgotPassword, { method: "POST", body: JSON.stringify(payload) });
  },
  resetPassword: async (payload) => {
    await assertApiAvailable();
    return apiRequest(apiRoutes.auth.resetPassword, { method: "POST", body: JSON.stringify(payload) });
  },
  me: () => apiRequest(apiRoutes.auth.me),
  profile: (payload) => apiRequest(apiRoutes.auth.profile, { method: "PATCH", body: JSON.stringify(payload) }),
  onboarding: (payload) => apiRequest(apiRoutes.auth.onboarding, { method: "POST", body: JSON.stringify(payload) }),
  uploadProfileImage: (formData) => apiRequest(apiRoutes.auth.profileImage, { method: "POST", body: formData }),
  deleteProfileImage: () => apiRequest(apiRoutes.auth.profileImage, { method: "DELETE" }),
};

export function crudService(path) {
  return {
    list: () => apiRequest(path),
    create: (payload) => apiRequest(path, { method: "POST", body: JSON.stringify(payload) }),
    update: (id, payload) => apiRequest(`${path}/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
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
  chat: (payload) => apiRequest("/ai/chat", { method: "POST", body: JSON.stringify(payload) }),
};

export const adminService = {
  overview: () => apiRequest("/admin/overview"),
  users: () => apiRequest("/admin/users"),
  removeUser: (id) => apiRequest(`/admin/users/${id}`, { method: "DELETE" }),
};
