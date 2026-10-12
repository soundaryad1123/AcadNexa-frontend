const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("acadnexa_token");
}

export function getAuthRole(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("acadnexa_user");
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed.role || null;
    }
  } catch {
    // Ignore parse errors
  }
  return null;
}

export function setAuthSession(token: string, role: string, userData?: Record<string, any>): void {
  if (typeof window === "undefined") return;

  localStorage.setItem("acadnexa_token", token);
  if (userData) {
    localStorage.setItem("acadnexa_user", JSON.stringify(userData));
  }

  // Set cookies for Next.js Edge Middleware route guarding & SSR verification
  const isSecure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `acadnexa_token=${encodeURIComponent(token)}; path=/; max-age=86400; SameSite=Lax${isSecure}`;
  document.cookie = `acadnexa_role=${encodeURIComponent(role)}; path=/; max-age=86400; SameSite=Lax${isSecure}`;
}

export function clearAuthSession(): void {
  if (typeof window === "undefined") return;

  // 1. Purge client-side Web Storage
  localStorage.removeItem("acadnexa_token");
  localStorage.removeItem("acadnexa_user");
  sessionStorage.clear();

  // 2. Invalidate cookies with past expiry
  document.cookie = "acadnexa_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
  document.cookie = "acadnexa_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
}

// Backward compatibility aliases
export const setAuthToken = (token: string) => setAuthSession(token, "UNKNOWN");
export const clearAuthToken = clearAuthSession;

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    clearAuthSession();
    if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
      // Use replace instead of href so user cannot press Back to return
      window.location.replace("/login");
    }
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody?.detail || errorBody?.message || `HTTP error ${response.status}`;
    throw new Error(message);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}
