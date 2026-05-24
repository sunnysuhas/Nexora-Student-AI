const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_URL is required for Nexora API integration.");
}

export function getAccessToken() {
  return localStorage.getItem("nexora-token");
}

export function getRefreshToken() {
  return localStorage.getItem("nexora-refresh-token");
}

export function saveTokens({ accessToken, refreshToken }) {
  if (accessToken) localStorage.setItem("nexora-token", accessToken);
  if (refreshToken) localStorage.setItem("nexora-refresh-token", refreshToken);
}

export function clearTokens() {
  localStorage.removeItem("nexora-token");
  localStorage.removeItem("nexora-refresh-token");
}

export async function apiRequest(path, options = {}, retry = true) {
  const token = getAccessToken();
  const isFormData = options.body instanceof FormData;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (response.status === 401 && retry && getRefreshToken()) {
    const refreshed = await refreshAccessToken();
    if (refreshed) return apiRequest(path, options, false);
  }

  if (!response.ok) {
    let message = "Nexora API request failed";
    try {
      const payload = await response.json();
      message = payload.message || message;
    } catch {
      message = (await response.text()) || message;
    }
    throw new Error(message);
  }

  return response.status === 204 ? null : response.json();
}

export async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!response.ok) return false;
    const data = await response.json();
    saveTokens({ accessToken: data.accessToken });
    return true;
  } catch {
    return false;
  }
}

export async function apiAvailable() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

export const apiRoutes = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    verifyOtp: "/auth/verify-otp",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    me: "/auth/me",
    profile: "/auth/profile",
    onboarding: "/auth/onboarding",
    profileImage: "/auth/profile-image",
  },
  tasks: "/tasks",
  assignments: "/assignments",
  attendance: "/attendance",
  exams: "/exams",
  notes: "/notes",
  goals: "/goals",
  notifications: "/notifications",
  ai: "/ai",
  contact: "/contact",
  admin: "/admin",
};
