'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import { sendOtp, verifyOtp, logout as apiLogout, getProfile, type User } from '../modules/auth.api';
import { getAccessToken, setAccessToken } from '../api';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, check if we have a token and fetch the user profile
  useEffect(() => {
    async function initAuth() {
      const token = getAccessToken();
      if (token) {
        try {
          const profile = await getProfile();
          setUser(profile);
        } catch {
          setAccessToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    }
    initAuth();
  }, []);

  const handleSendOtp = useCallback(async (phone: string) => {
    await sendOtp(phone);
  }, []);

  const handleVerifyOtp = useCallback(async (phone: string, otp: string) => {
    const response = await verifyOtp(phone, otp);
    setUser(response.user);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await apiLogout();
    } catch {
      // Ignore logout API errors
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        sendOtp: handleSendOtp,
        verifyOtp: handleVerifyOtp,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
