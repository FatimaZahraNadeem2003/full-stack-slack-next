'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import DirectMessageSidebar from '@/components/DirectMessageSidebar';
import DirectMessageChat from '@/components/DirectMessageChat';
import Login from '@/components/Login';
import { User as ApiUser } from '@/services/api';

const DirectMessagesPage = () => {
  const { user, isLoading } = useAuth();
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex">
      {/* Mobile header */}
      <div className="md:hidden bg-white p-4 border-b border-gray-200 flex items-center">
        {(!selectedConversationId || !isMobileSidebarOpen) && (
          <button 
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="mr-3 text-gray-500 hover:text-gray-700"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <h1 className="text-xl font-bold text-gray-800">Direct Messages</h1>
      </div>

      {/* Sidebar - shown on desktop always, mobile conditionally */}
      {(isMobileSidebarOpen || window.innerWidth >= 768) && (
        <div className={`${isMobileSidebarOpen ? 'fixed inset-0 z-10 md:relative md:inset-auto md:block' : 'hidden'} md:block`}>
          <DirectMessageSidebar
            currentUser={user as unknown as ApiUser}
            onSelectConversation={(id: string) => {
              setSelectedConversationId(id);
              setIsMobileSidebarOpen(false); // Close sidebar on mobile after selection
            }}
            activeConversationId={selectedConversationId}
          />
        </div>
      )}

      {/* Chat area */}
      <div className={`${isMobileSidebarOpen ? 'hidden' : 'flex'} md:flex flex-1`}>
        <DirectMessageChat
          conversationId={selectedConversationId}
          currentUser={user as unknown as ApiUser}
          onBack={() => {
            setIsMobileSidebarOpen(true); // Show sidebar again on mobile
          }}
        />
      </div>

      {/* Overlay for mobile sidebar */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-0 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default DirectMessagesPage;