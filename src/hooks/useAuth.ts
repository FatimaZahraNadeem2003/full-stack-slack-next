import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from './apiClient';
import { broadcastLogout } from '@/utils/authUtils';

interface User {
  id: string;
  username: string;
  email: string;
  role?: 'admin' | 'user';
  isActive?: boolean;
  lastSeen?: string;
  createdAt?: string;
  updatedAt?: string;
}

const isBrowser = () => typeof window !== 'undefined';

// Helper function to decode JWT token and check expiration
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      if (!isBrowser()) {
        setIsLoading(false);
        return;
      }
      
      const token = localStorage.getItem('token');
      if (token && !isTokenExpired(token)) {
        try {
          const response = await apiClient.get('/auth/verify');
          if (response.data.valid) {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
              const parsedUser = JSON.parse(storedUser);
              setUser(parsedUser);
            }
          } else {
            // Token is invalid, remove it
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (err: any) {
          console.error('Error validating token:', err);
          // If the error is specifically about token verification, remove the token
          if (err.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (!isBrowser()) {
      setError('Authentication is only available in the browser');
      return { success: false, error: 'Authentication is only available in the browser' };
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.post('/auth/', { email, password });

      // Store token and user data in localStorage for persistent login
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);

      if (response.data.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/user');
      }
      
      return { success: true, user: response.data.user };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const register = useCallback(async (username: string, email: string, password: string) => {
    if (!isBrowser()) {
      setError('Authentication is only available in the browser');
      return { success: false, error: 'Authentication is only available in the browser' };
    }
    
    setIsLoading(true);
    setError(null);

    try {
      
      const response = await apiClient.post('/auth/register', {   
        username, 
        email, 
        password
      });

      // Store token and user data in localStorage for persistent login
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);

      if (response.data.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/user');
      }

      return { success: true, user: response.data.user };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const logout = useCallback(() => {
    if (isBrowser()) {
      broadcastLogout();
    }
    setUser(null);
    router.push('/');
  }, [router]);

  return useMemo(() => ({
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    token: isBrowser() ? localStorage.getItem('token') : null,
    isAdmin: user?.role === 'admin',
  }), [user, isLoading, error, login, register, logout]);
};