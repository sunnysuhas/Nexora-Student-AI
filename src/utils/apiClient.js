const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

if (!API_BASE_URL) {
  throw new Error("VITE_API_URL is required for Nexora API integration.");
}

const REQUEST_TIMEOUT_MS = 90000;

export class ApiError extends Error {
  constructor(message, status, payload = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = payload.code;
    this.payload = payload;
  }
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export function getAccessToken() {
  return localStorage.getItem("nexora-token") || sessionStorage.getItem("nexora-token");
}

export function getRefreshToken() {
  return localStorage.getItem("nexora-refresh-token") || sessionStorage.getItem("nexora-refresh-token");
}

export function saveTokens({ accessToken, refreshToken }, remember = true) {
  const storage = remember ? localStorage : sessionStorage;
  const otherStorage = remember ? sessionStorage : localStorage;
  otherStorage.removeItem("nexora-token");
  otherStorage.removeItem("nexora-refresh-token");
  if (accessToken) storage.setItem("nexora-token", accessToken);
  if (refreshToken) storage.setItem("nexora-refresh-token", refreshToken);
}

export function clearTokens() {
  localStorage.removeItem("nexora-token");
  localStorage.removeItem("nexora-refresh-token");
  sessionStorage.removeItem("nexora-token");
  sessionStorage.removeItem("nexora-refresh-token");
}

export async function apiRequest(path, options = {}, retry = true) {
  const token = getAccessToken();
  const isFormData = options.body instanceof FormData;
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch (error) {
    throw classifyNetworkError(error);
  } finally {
    window.clearTimeout(timeout);
  }

  if (response.status === 401 && retry && getRefreshToken()) {
    const refreshed = await refreshAccessToken();
    if (refreshed) return apiRequest(path, options, false);
  }

  // FIXED
if (!response.ok) {
    let message = "Nexora API request failed";
    let payload = {};
    try {
      const text = await response.text();   // read body ONCE
      payload = text ? JSON.parse(text) : {};
      message = payload.message || message;
    } catch {
      message = message;
    }
    throw new ApiError(message, response.status, payload);
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
    saveTokens({ accessToken: data.accessToken }, Boolean(localStorage.getItem("nexora-refresh-token")));
    return true;
  } catch {
    return false;
  }
}

export async function apiAvailable() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      cache: "no-store",
      signal: AbortSignal.timeout(30000), // increase to 30 seconds
    });
    return response.ok;
  } catch (error) {
    console.error("API health check failed:", error);
    return false;
  }
}

export async function assertApiAvailable() {
  for (let i = 0; i < 5; i++) {  // increase retries to 5
    const online = await apiAvailable();
    if (online) return;
    console.log(`Health check attempt ${i + 1} failed, retrying...`);
    if (i < 4) await new Promise((resolve) => setTimeout(resolve, 5000)); // 5s gap
  }
  throw new Error(
    `Nexora backend server is offline or blocked by CORS. Confirm the API is running at ${API_BASE_URL}`
  );
}

function classifyNetworkError(error) {
  if (error?.name === "AbortError") {
    return new Error("Nexora backend request timed out. Check that the API server and MongoDB connection are healthy.");
  }
  if (error instanceof TypeError) {
    return new Error(
      `Network connection failed. Start the backend at ${API_BASE_URL.replace(/\/api$/, "")}, or check CORS for this frontend origin.`
    );
  }
  return error;
}

export const apiRoutes = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    verifyOtp: "/auth/verify-otp",
    resendOtp: "/auth/resend-otp",
    logout: "/auth/logout",
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
