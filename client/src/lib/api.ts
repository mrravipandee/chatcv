export interface ApiError {
  success: false;
  message: string;
  code: string;
  details?: Record<string, any>;
}

export interface ApiSuccess<T = any> {
  success: true;
  message: string;
  data?: T;
}

export type ApiResponse<T = any> = ApiSuccess<T> | ApiError;

export interface SubscribeResponse {
  email: string;
  createdAt: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

// ✅ Timeout helper — Render free tier cold starts can take 30+ seconds
function withTimeout(ms: number): AbortSignal {
  return AbortSignal.timeout(ms);
}

async function fetchApi<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      // ✅ No 'credentials: include' unless you're using cookies/sessions
      // credentials: "include",
      signal: withTimeout(15000), // 15 second timeout for cold starts
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const data = (await response.json()) as ApiResponse<T>;

    if (!response.ok) {
      return data;
    }

    return data;
  } catch (error) {
    console.error("[API] Fetch error:", error);

    // ✅ More specific error messages
    if (error instanceof DOMException && error.name === "TimeoutError") {
      return {
        success: false,
        message: "Server is waking up, please try again in a moment.",
        code: "TIMEOUT",
      };
    }

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to connect to server",
      code: "NETWORK_ERROR",
    };
  }
}

export async function subscribeToNewsletter(
  email: string
): Promise<ApiResponse<SubscribeResponse>> {
  return fetchApi<SubscribeResponse>("/api/subscribe", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export interface CurrentUser {
  _id: string;
  name?: string;
  email: string;
  membership: "free" | "premium";
  freeChatUsed: boolean;
}

export async function getCurrentUser(
  token: string
): Promise<ApiResponse<CurrentUser>> {
  return fetchApi<CurrentUser>("/api/auth/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export async function registerUser(
  payload: RegisterPayload
) {
  return fetchApi("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function verifyOtp(
  payload: VerifyOtpPayload
) {
  return fetchApi("/api/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginUser(
  payload: LoginPayload
) {
  return fetchApi<LoginResponse>(
    "/api/auth/login",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}