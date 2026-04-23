/**
 * API Response Types
 */

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

/**
 * API Configuration
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

/**
 * Generic fetch wrapper with error handling
 */
async function fetchApi<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const data = await response.json() as ApiResponse<T>;

    // If server returned error response with error status
    if (!response.ok) {
      return data;
    }

    return data;
  } catch (error) {
    console.error("[API] Fetch error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to connect to server",
      code: "NETWORK_ERROR",
    };
  }
}

/**
 * Subscribe user to newsletter
 */
export async function subscribeToNewsletter(
  email: string
): Promise<ApiResponse<SubscribeResponse>> {
  return fetchApi<SubscribeResponse>("/api/subscribe", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}
