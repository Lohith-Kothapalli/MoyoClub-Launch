// API Configuration
// Set VITE_API_URL in your .env file to point to your backend
// For local development: VITE_API_URL=http://localhost:5000/api
// For production: VITE_API_URL=https://moyoclub-launch-production.up.railway.app/api

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://moyoclub-launch-production.up.railway.app/api";

// Log which API URL is being used (only in development)
if (import.meta.env.DEV) {
  console.log("🔗 Backend API URL:", API_BASE_URL);
  console.log("   (Set VITE_API_URL in .env to change this)");
}

export const API_ENDPOINTS = {
  AUTH: {
    REQUEST_OTP: `${API_BASE_URL}/auth/request-otp`,
    VERIFY_OTP: `${API_BASE_URL}/auth/verify-otp`,
    ME: `${API_BASE_URL}/auth/me`,
  },
  PRODUCTS: {
    LIST: `${API_BASE_URL}/products`,
    DETAIL: (id: string) => `${API_BASE_URL}/products/${id}`,
  },
  ORDERS: {
    CREATE: `${API_BASE_URL}/orders`,
    MY_ORDERS: `${API_BASE_URL}/orders/my-orders`,
    DETAIL: (orderId: string) => `${API_BASE_URL}/orders/${orderId}`,
  },
};

// ------------------------------
// AUTH TOKEN HELPERS
// ------------------------------

export function getAuthToken(): string | null {
  return localStorage.getItem("moyoclub_token");
}

export function setAuthToken(token: string): void {
  localStorage.setItem("moyoclub_token", token);
}

export function removeAuthToken(): void {
  localStorage.removeItem("moyoclub_token");
}

// ------------------------------
// FIXED API REQUEST FUNCTION
// ------------------------------

// ⭐ THIS VERSION RETURNS FULL BACKEND ERROR DETAILS ⭐
//    and allows Auth.tsx to detect `alreadyExists`
export async function apiRequest(
  url: string,
  options: RequestInit = {}
): Promise<any> {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (import.meta.env.DEV) {
    console.log(`🌐 API Request: ${options.method || "GET"} ${url}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  let data: any = null;

  // Try parsing JSON (or fallback)
  try {
    data = await response.json();
  } catch {
    data = { error: "Network error", details: "" };
  }

  // ------------------------------
  // HANDLE ERRORS
  // ------------------------------
  if (!response.ok) {
    const errorMessage = data.error || data.message || "Request failed";

    // ⭐ FIX: Create extended error with backend data
    const error: any = new Error(errorMessage);
    error.status = response.status;
    error.data = data; // <--- backend JSON is preserved
    error.response = { data }; // <--- axios-style compatibility

    if (import.meta.env.DEV) {
      console.error(
        `❌ API Error (${response.status}):`,
        data,
        "URL:",
        url
      );
    }

    throw error;
  }

  // ------------------------------
  // SUCCESS RESPONSE
  // ------------------------------
  return data;
}
