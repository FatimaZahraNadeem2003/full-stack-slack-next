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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center overflow-hidden">
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="mt-4 text-lg text-gray-600 animate-pulse">Loading...</p>
        </div>
        
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 transition-all duration-500 ease-in-out transform hover:shadow-2xl">
          <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-8 animate-fade-in-up">
            Please Log In
          </h1>
          <Login />
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50/30 to-purple-50/30 flex flex-col overflow-hidden">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>
        
        <header className="bg-white/80 backdrop-blur-sm shadow-lg sticky top-0 z-10 border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <button
                  onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                  className="md:hidden mr-3 text-gray-500 hover:text-indigo-600 transition-colors duration-300 p-2 rounded-lg hover:bg-indigo-50"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                
                <div className="flex-shrink-0 flex items-center animate-float">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg">
                    <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <span className="ml-3 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 hidden sm:block">
                    Slack
                  </span>
                </div>
                
                <div className="ml-4 md:hidden">
                  <h2 className="text-sm font-semibold text-gray-800">Direct Messages</h2>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <NotificationDropdown />
                <div className="ml-3 relative">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-700 hidden md:inline-block transition-all duration-300 transform hover:scale-105">{user?.username}</span>
                    <button
                      onClick={logout}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors duration-300 btn-hover px-3 py-1 rounded-lg hover:bg-indigo-50"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden relative z-10">
          <div className={`${isMobileSidebarOpen ? 'block' : 'hidden'} md:block absolute md:relative z-20 inset-y-0 left-0 transform ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-all duration-300 ease-in-out w-80 bg-white/90 backdrop-blur-sm border-r border-white/20 shadow-xl`}>
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
              className="md:hidden absolute top-4 right-4 text-gray-500 hover:text-indigo-600 transition-colors duration-300 p-2 rounded-lg hover:bg-indigo-50"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {isMobileSidebarOpen && (
            <div 
              className="md:hidden fixed inset-0 z-10 bg-black bg-opacity-30 transition-opacity duration-300"
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
          
          .animate-blob {
            animation: blob 7s infinite;
          }
          
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          
          .btn-hover {
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
          }
          
          .btn-hover::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
          }
          
          .btn-hover:hover::before {
            left: 100%;
          }
        `}</style>
      </div>
    </ProtectedRoute>
  );
};

export default DirectMessagesPage;