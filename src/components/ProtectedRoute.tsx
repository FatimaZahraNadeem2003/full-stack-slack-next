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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 overflow-hidden">
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium animate-pulse">Loading your workspace...</p>
          <div className="mt-8 flex space-x-2">
            <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce animation-delay-200"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce animation-delay-400"></div>
          </div>
        </div>
        
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>
        
        <style jsx global>{`
          @keyframes blob {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
          
          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-5px);
            }
          }
          
          .animate-blob {
            animation: blob 7s infinite;
          }
          
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          
          .animation-delay-400 {
            animation-delay: 0.4s;
          }
          
          .animation-delay-200 {
            animation-delay: 0.2s;
          }
          
          .animate-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          
          .animate-bounce {
            animation: bounce 1s infinite;
          }
        `}</style>
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