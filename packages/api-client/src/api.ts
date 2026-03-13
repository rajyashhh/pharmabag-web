import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios';

// In-memory token storage
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

// Determine base URL dynamically
function getBaseURL(): string {
  if (typeof window !== 'undefined') {
    // Client-side: use the Next.js public env variable
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  }
  // Server-side: fallback
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
}

// Create the Axios instance
const api: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies for httpOnly refresh tokens
});

// Flag to prevent multiple refresh requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
}

// Request interceptor: inject Authorization header
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If 401 and we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request while refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the token (cookie-based)
        const { data } = await axios.post(
          `${getBaseURL()}/auth/refresh`,
          {},
          { withCredentials: true },
        );

        const newToken = data.accessToken;
        setAccessToken(newToken);
        processQueue(null, newToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        setAccessToken(null);
        // Redirect to login page on refresh failure
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Global error handling
    if (error.response) {
      const { status } = error.response;
      if (status === 403) {
        console.error('Access forbidden');
      } else if (status === 404) {
        console.error('Resource not found');
      } else if (status >= 500) {
        console.error('Server error');
      }
    } else if (error.request) {
      console.error('Network error: no response received');
    }

    return Promise.reject(error);
  },
);

export { api };
