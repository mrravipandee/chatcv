import {
  ResumeData,
  Resume,
  ChatMessage,
  Experience,
  Project,
  SkillGroup,
  Education,
  Achievement,
  Link,
} from '@/types/resume';

// ==============================
// Shared API Types
// ==============================

export interface ApiError {
  success: false;
  message: string;
  code: string;
  details?: Record<string, unknown>;
}

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data?: T;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

export interface SubscribeResponse {
  email: string;
  createdAt: string;
}

export interface CurrentUser {
  _id: string;
  name: string;
  email: string;
  membership: 'free' | 'premium';
  chatTokensUsed: number;
  chatTokensLimit: number;
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

export interface ChangePasswordPayload {
  currentPassword?: string;
  newPassword?: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    membership: 'free' | 'premium';
    chatTokensUsed: number;
    chatTokensLimit: number;
  };
}

export interface ChatPayload {
  message: string;
  resumeId?: string;
}

export interface ChatResponse {
  reply: string;
  resumeId: string;
  resumeData: ResumeData;
  tokensUsed: number;
  tokensLimit: number;
}

// ── Payment Types ─────────────────────────────────────────────────────────────

export interface PaymentPlan {
  id: string;
  label: string;
  tokens: number;
  price: string;
}

export interface CreateOrderResponse {
  checkoutUrl: string;   // Dodo redirect URL
  sessionId: string;
  planLabel: string;
  tokens: number;
  amount: string;
}

export interface VerifyPaymentPayload {
  sessionId: string;
}

export interface VerifyPaymentResponse {
  tokensAdded: number;
  newLimit: number;
  newUsed: number;
}

// ── Upload Types ──────────────────────────────────────────────────────────────

export interface UploadResumeResponse {
  resumeId: string;
  resumeData: ResumeData;
}

// ==============================
// API Client
// ==============================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

function withTimeout(ms: number): AbortSignal {
  return AbortSignal.timeout(ms);
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        signal: withTimeout(30000),
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const data = (await response.json()) as ApiResponse<T>;
      return data;
    } catch (error) {
      const isTimeout = error instanceof DOMException && error.name === 'TimeoutError';

      if (isTimeout && attempt === 1) {
        console.warn('[API] Request timed out, retrying...');
        await new Promise((r) => setTimeout(r, 2000));
        continue;
      }

      console.error('[API] Fetch error:', error);

      if (isTimeout) {
        return {
          success: false,
          message: 'Server is taking too long to respond. Please try again.',
          code: 'TIMEOUT',
        };
      }

      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to connect to server',
        code: 'NETWORK_ERROR',
      };
    }
  }

  return { success: false, message: 'Unknown error', code: 'UNKNOWN' };
}

// ── Multipart fetch (for file uploads) ───────────────────────────────────────

async function fetchMultipart<T>(
  endpoint: string,
  formData: FormData,
  token: string
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
      signal: AbortSignal.timeout(60000),
    });
    return (await response.json()) as ApiResponse<T>;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Upload failed',
      code: 'UPLOAD_ERROR',
    };
  }
}

// ==============================
// Public Endpoints
// ==============================

export async function subscribeToNewsletter(
  email: string
): Promise<ApiResponse<SubscribeResponse>> {
  return fetchApi<SubscribeResponse>('/api/subscribe', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function registerUser(
  payload: RegisterPayload
): Promise<ApiResponse<unknown>> {
  return fetchApi('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function verifyOtp(
  payload: VerifyOtpPayload
): Promise<ApiResponse<unknown>> {
  return fetchApi('/api/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function loginUser(
  payload: LoginPayload
): Promise<ApiResponse<LoginResponse>> {
  return fetchApi<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ==============================
// Authenticated Endpoints
// ==============================

export async function getCurrentUser(
  token: string
): Promise<ApiResponse<CurrentUser>> {
  return fetchApi<CurrentUser>('/api/auth/me', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function updateProfile(
  name: string,
  token: string
): Promise<ApiResponse<CurrentUser>> {
  return fetchApi<CurrentUser>('/api/auth/update-profile', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });
}

export async function changePassword(
  payload: ChangePasswordPayload,
  token: string
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  return fetchApi<{ success: boolean; message: string }>('/api/auth/change-password', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export async function sendChatMessage(
  payload: ChatPayload,
  token: string
): Promise<ApiResponse<ChatResponse>> {
  return fetchApi<ChatResponse>('/api/chat/message', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function getResumes(
  token: string
): Promise<ApiResponse<Resume[]>> {
  return fetchApi<Resume[]>('/api/resume/my', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createResume(
  token: string
): Promise<ApiResponse<Resume>> {
  return fetchApi<Resume>('/api/resume/create', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({}),
  });
}

export async function uploadResume(
  file: File,
  token: string
): Promise<ApiResponse<UploadResumeResponse>> {
  const formData = new FormData();
  formData.append('resume', file);
  return fetchMultipart<UploadResumeResponse>('/api/resume/upload', formData, token);
}

// ── Payment ───────────────────────────────────────────────────────────────────

export async function getPaymentPlans(): Promise<ApiResponse<PaymentPlan[]>> {
  return fetchApi<PaymentPlan[]>('/api/payment/plans');
}

export async function createPaymentOrder(
  planId: string,
  token: string
): Promise<ApiResponse<CreateOrderResponse>> {
  return fetchApi<CreateOrderResponse>('/api/payment/create-order', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ planId }),
  });
}

export async function verifyPayment(
  payload: VerifyPaymentPayload,
  token: string
): Promise<ApiResponse<VerifyPaymentResponse>> {
  return fetchApi<VerifyPaymentResponse>('/api/payment/verify', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

// Re-export types
export type {
  ResumeData,
  Resume,
  ChatMessage,
  Experience,
  Project,
  SkillGroup,
  Education,
  Achievement,
  Link,
};