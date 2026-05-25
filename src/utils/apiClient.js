const RAW_API_BASE_URL = import.meta.env.VITE_API_URL?.trim().replace(/^VITE_API_URL\s*=\s*/i, "").replace(/\/+$/, "");

if (!RAW_API_BASE_URL) {
  throw new Error("VITE_API_URL is required for Nexora API integration.");
}

const API_BASE_URL = normalizeApiBaseUrl(RAW_API_BASE_URL);
const REQUEST_TIMEOUT_MS = 90000;
const RETRYABLE_STATUS_CODES = new Set([502, 503, 504]);

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

export async function apiRequest(path, options = {}, retryAuth = true) {
  const response = await sendWithRenderRetry(path, options);

  if (response.status === 401 && retryAuth && getRefreshToken()) {
    const refreshed = await refreshAccessToken();
    if (refreshed) return apiRequest(path, options, false);
  }

  if (!response.ok) {
    const payload = await parseResponseBody(response);
    throw new ApiError(payload.message || "Nexora API request failed", response.status, payload);
  }

  if (response.status === 204) return null;
  return parseResponseBody(response);
}

export async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await sendWithRenderRetry("/auth/refresh", {
      method: "POST",
      body: { refreshToken },
      skipAuth: true,
    });
    if (!response.ok) return false;
    const data = await parseResponseBody(response);
    saveTokens({ accessToken: data.accessToken }, Boolean(localStorage.getItem("nexora-refresh-token")));
    return true;
  } catch {
    return false;
  }
}

export async function apiAvailable() {
  try {
    const response = await sendWithRenderRetry("/health", { method: "GET", skipAuth: true, cache: "no-store" }, 3);
    return response.ok;
  } catch (error) {
    console.error("[Nexora API] health check failed:", error);
    return false;
  }
}

export async function assertApiAvailable() {
  const online = await apiAvailable();
  if (!online) {
    throw new Error(`Nexora backend server is offline or blocked by CORS. Confirm the API is running at ${API_BASE_URL}`);
  }
}

async function sendWithRenderRetry(path, options = {}, attempts = 2) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await sendOnce(path, options);
      if (!RETRYABLE_STATUS_CODES.has(response.status) || attempt === attempts) return response;
      console.warn(`[Nexora API] ${response.status} from ${buildApiUrl(path)}. Retrying ${attempt}/${attempts - 1}...`);
    } catch (error) {
      lastError = error;
      if (attempt === attempts) throw classifyNetworkError(error);
      console.warn(`[Nexora API] request failed for ${buildApiUrl(path)}. Retrying ${attempt}/${attempts - 1}...`, error);
    }
    await delay(attempt * 1500);
  }

  throw classifyNetworkError(lastError);
}

async function sendOnce(path, options = {}) {
  const { body, headers, skipAuth, ...requestOptions } = options;
  const token = getAccessToken();
  const isFormData = body instanceof FormData;
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const url = buildApiUrl(path);

  const request = {
    ...requestOptions,
    signal: controller.signal,
    headers: {
      ...(body !== undefined && !isFormData ? { "Content-Type": "application/json" } : {}),
      ...(!skipAuth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: serializeBody(body, isFormData),
  };

  console.info(`[Nexora API] ${request.method || "GET"} ${url}`);

  try {
    return await fetch(url, request);
  } finally {
    window.clearTimeout(timeout);
  }
}

async function parseResponseBody(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

function serializeBody(body, isFormData) {
  if (body === undefined || body === null) return undefined;
  if (isFormData || typeof body === "string") return body;
  return JSON.stringify(body);
}

function buildApiUrl(path) {
  const cleanPath = String(path || "").replace(/^\/+/, "");
  return `${API_BASE_URL}/${cleanPath}`;
}

function normalizeApiBaseUrl(url) {
  const clean = url.replace(/\/+$/, "");
  if (/\/api$/i.test(clean)) return clean;
  return `${clean}/api`;
}

function classifyNetworkError(error) {
  if (error?.name === "AbortError") {
    return new Error("Nexora backend request timed out. Render may still be waking up. Please try again.");
  }
  if (error instanceof TypeError) {
    return new Error(`Network connection failed. Check ${API_BASE_URL} and production CORS settings.`);
  }
  return error;
}

function delay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
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
