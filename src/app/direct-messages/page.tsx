'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import DirectMessageSidebar from '@/components/DirectMessageSidebar';
import DirectMessageChat from '@/components/DirectMessageChat';
import Login from '@/components/Login';
import { User as ApiUser } from '@/services/api';
import NotificationDropdown from '@/components/NotificationDropdown';
import ProtectedRoute from '@/components/ProtectedRoute';

const DirectMessagesPage = () => {
  const { user, isLoading, logout } = useAuth();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(true);

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

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Please Log In</h1>
          <Login />
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <button
                  onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                  className="md:hidden mr-2 text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                
                <div className="flex-shrink-0 flex items-center">
                  <svg className="h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="ml-2 text-xl font-bold text-gray-900">Slack</span>
                </div>
                
                <div className="ml-4 md:hidden">
                  <h2 className="text-sm font-semibold text-gray-800">Direct Messages</h2>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <NotificationDropdown />
                <div className="ml-3 relative">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-700 hidden md:inline-block">{user?.username}</span>
                    <button
                      onClick={logout}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <div className={`${isMobileSidebarOpen ? 'block' : 'hidden'} md:block absolute md:relative z-20 inset-y-0 left-0 transform ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out w-64 bg-white border-r border-gray-200`}>
            <DirectMessageSidebar
              currentUser={user as unknown as ApiUser}
              onSelectConversation={(id: string) => {
                setSelectedConversationId(id);
                setIsMobileSidebarOpen(false);
              }}
              activeConversationId={selectedConversationId}
            />
            
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="md:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {isMobileSidebarOpen && (
            <div 
              className="md:hidden fixed inset-0 z-10 bg-black bg-opacity-50"
              onClick={() => setIsMobileSidebarOpen(false)}
            ></div>
          )}

          <div className="flex-1 flex flex-col overflow-hidden">
            <DirectMessageChat
              conversationId={selectedConversationId}
              currentUser={user as unknown as ApiUser}
              onBack={() => {
                setIsMobileSidebarOpen(true);
              }}
            />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DirectMessagesPage;