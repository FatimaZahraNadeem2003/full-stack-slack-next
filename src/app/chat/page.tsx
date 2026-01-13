'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Chat from '@/components/Chat';
import ProtectedRoute from '@/components/ProtectedRoute';

const ChatPage = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // No need to redirect here since the ProtectedRoute and other components handle it
  // If user is admin, they should have been redirected elsewhere already

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is admin, redirect to admin dashboard
  if (user && user.role === 'admin') {
    useEffect(() => {
      router.push('/admin');
    }, [router]);
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <Chat />
    </ProtectedRoute>
  );
};

export default ChatPage;