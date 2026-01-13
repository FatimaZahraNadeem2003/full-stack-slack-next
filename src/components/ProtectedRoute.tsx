'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ReactNode } from 'react';
import CrossTabAuthListener from './CrossTabAuthListener';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean; 
  requireUser?: boolean;   
}

const ProtectedRoute = ({ children, requireAdmin = false, requireUser = false }: ProtectedRouteProps) => {
  const { user, isLoading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    } 
    else if (!isLoading && user) {
      if (requireAdmin && user.role !== 'admin') {
        router.push('/');
      }
      if (requireUser && user.role !== 'user') {
        router.push('/');
      }
    }
  }, [user, isLoading, isAdmin, router, requireAdmin, requireUser]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null; 
  }

  if (requireAdmin && user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Admin privileges required.</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (requireUser && user.role !== 'user') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Regular user account required.</p>
          <button
            onClick={() => router.push(user.role === 'admin' ? '/admin' : '/')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Go {user.role === 'admin' ? 'To Admin' : 'Home'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <CrossTabAuthListener />
      <>{children}</>
    </>
  );
};

export default ProtectedRoute;