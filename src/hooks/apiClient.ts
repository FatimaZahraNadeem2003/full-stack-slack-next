import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    cacheKey?: string;
  }
}

const cache = new Map();

const CACHE_TIMEOUT = 5 * 60 * 1000;

export const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const clearExpiredCache = () => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_TIMEOUT) {
      cache.delete(key);
    }
  }
};

setInterval(clearExpiredCache, 60 * 1000); 

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.method === 'get') {
      const url = config.url || '';
      const params = JSON.stringify(config.params || {});
      config.cacheKey = `${url}_${params}`;
    }
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.config.method === 'get' && response.config.cacheKey) {
      cache.set(response.config.cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Remove token and user data from localStorage when unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Also clear any potential cached data
      cache.clear();
      
      // Optionally redirect to login page
      if (typeof window !== 'undefined') {
        // Check if we're on a page that requires auth, if so redirect to login
        if (window.location.pathname !== '/' && !window.location.pathname.startsWith('/register')) {
          window.location.href = '/';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const clearApiCache = () => {
  cache.clear();
};