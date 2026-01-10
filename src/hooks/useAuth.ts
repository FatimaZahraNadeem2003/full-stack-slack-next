import { useState, useEffect } from 'react';
import { apiClient } from './apiClient';

interface User {
  id: string;
  username: string;
  email: string;
  role?: 'admin' | 'user';
}

const isBrowser = () => typeof window !== 'undefined';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      if (!isBrowser()) {
        // If we're on the server, skip initialization
        setIsLoading(false);
        return;
      }
      
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
          }
        } catch (err) {
          console.error('Error initializing auth:', err);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    if (!isBrowser()) {
      setError('Authentication is only available in the browser');
      return { success: false, error: 'Authentication is only available in the browser' };
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.post('/auth/', { email, password });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);

      return { success: true, user: response.data.user };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    if (!isBrowser()) {
      setError('Authentication is only available in the browser');
      return { success: false, error: 'Authentication is only available in the browser' };
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const adminCheck = await apiClient.get('/auth/check-admin');
      
      if (adminCheck.data.hasAdmin) {
        throw new Error('An admin account already exists. Registration is closed.');
      }

      const response = await apiClient.post('/auth/register', { 
        username, 
        email, 
        password 
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);

      return { success: true, user: response.data.user };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    if (isBrowser()) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    setUser(null);
  };

  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    token: isBrowser() ? localStorage.getItem('token') : null,
    isAdmin: user?.role === 'admin',
  };
};