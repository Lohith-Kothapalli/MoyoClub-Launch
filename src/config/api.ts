// API Configuration
// Set VITE_API_URL in your .env file to point to your backend
// For local development: VITE_API_URL=http://localhost:5000/api
// For production: VITE_API_URL=https://moyoclub-launch-production.up.railway.app/api
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://moyoclub-launch-production.up.railway.app/api';

// Log which API URL is being used (only in development)
if (import.meta.env.DEV) {
  console.log('🔗 Backend API URL:', API_BASE_URL);
  console.log('   (Set VITE_API_URL in .env to change this)');
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

// Helper function to get auth token
export function getAuthToken(): string | null {
  return localStorage.getItem('moyoclub_token');
}

// Helper function to set auth token
export function setAuthToken(token: string): void {
  localStorage.setItem('moyoclub_token', token);
}

// Helper function to remove auth token
export function removeAuthToken(): void {
  localStorage.removeItem('moyoclub_token');
}

// API request helper
export async function apiRequest(
  url: string,
  options: RequestInit = {}
): Promise<any> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (import.meta.env.DEV) {
    console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error', details: '' }));
    const errorMessage = error.error || error.message || 'Request failed';
    const errorDetails = error.details || '';
    const fullError = errorDetails ? `${errorMessage}: ${errorDetails}` : errorMessage;
    
    if (import.meta.env.DEV) {
      console.error(`❌ API Error (${response.status}):`, fullError, 'URL:', url);
    }
    
    throw new Error(fullError);
  }

  return response.json();
}

