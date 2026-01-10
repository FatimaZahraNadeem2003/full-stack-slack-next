'use client';

import { useAuth } from '@/hooks/useAuth';
import Chat from '@/components/Chat';
import Login from '@/components/Login';
import NotificationDropdown from '@/components/NotificationDropdown';

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {!user ? (
        <div className="container mx-auto px-4 py-8 max-w-md">
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex justify-end mb-4">
              <NotificationDropdown />
            </div>
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Welcome to Slack Clone</h1>
            <Login />
            <div className="mt-6 text-center">
              <p className="text-gray-600">Don't have an account?</p>
              <button 
                onClick={() => document.getElementById('register-tab')?.click()}
                className="text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Register here
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Chat />
      )}
    </div>
  );
}