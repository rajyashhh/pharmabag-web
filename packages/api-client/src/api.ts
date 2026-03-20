import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios';

// In-memory + LocalStorage token storage
let accessToken: string | null = typeof window !== 'undefined' ? localStorage.getItem('pb_access_token') : null;
let refreshTokenStored: string | null = typeof window !== 'undefined' ? localStorage.getItem('pb_refresh_token') : null;

export function setAccessToken(token: string | null, refreshToken?: string | null) {
  accessToken = token;
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('pb_access_token', token);
    } else {
      localStorage.removeItem('pb_access_token');
    }
    
    if (refreshToken !== undefined) {
      refreshTokenStored = refreshToken;
      if (refreshToken) {
        localStorage.setItem('pb_refresh_token', refreshToken);
      } else {
        localStorage.removeItem('pb_refresh_token');
      }
    }
  }
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function getRefreshToken(): string | null {
  return refreshTokenStored;
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
  withCredentials: true,
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
        // Attempt to refresh the token
        const rt = getRefreshToken();
        if (!rt) throw new Error('No refresh token');

        // Use a clean axios instance to avoid infinite loops
        const { data } = await axios.post(
          `${getBaseURL()}/auth/refresh`,
          { refreshToken: rt },
          { withCredentials: true }
        );

        const newToken = data.accessToken;
        const newRefreshToken = data.refreshToken;
        setAccessToken(newToken, newRefreshToken);
        processQueue(null, newToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        setAccessToken(null, null);
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
