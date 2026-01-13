import { useState, useEffect, useRef } from 'react';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import ChatSidebar from './ChatSidebar';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import Link from 'next/link';
import NotificationDropdown from './NotificationDropdown';

const Chat = () => {
  const [newMessage, setNewMessage] = useState('');
  const [selectedSpace, setSelectedSpace] = useState('general');
  const [isDirectMessage, setIsDirectMessage] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { messages, isLoading, error, sendMessage, isConnected } = useChat(selectedSpace, isDirectMessage);
  const { user, logout, isAdmin } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const success = await sendMessage(newMessage);
    if (success) {
      setNewMessage('');
    }
  };

  const handleSpaceSelect = (spaceId: string, type: string) => {
    setSelectedSpace(spaceId);
    setIsDirectMessage(type === 'direct');
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex flex-col overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <header className="bg-white/80 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-white/20 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="md:hidden mr-2 text-gray-500 hover:text-indigo-600 transition-colors duration-300 p-2 rounded-lg hover:bg-indigo-50"
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
                <h2 className="text-sm font-semibold text-gray-800 capitalize animate-pulse-slow">
                  {selectedSpace === 'general' ? 'General' : selectedSpace.replace(/-/g, ' ')}
                </h2>
                <p className="text-xs text-gray-500">
                  {isDirectMessage ? 'Direct message' : 'Group chat'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/direct-messages" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors duration-300 hidden md:inline-block btn-hover">
                Direct Messages
              </Link>
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
        <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block absolute md:relative z-20 inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-all duration-300 ease-in-out w-64 bg-white/90 backdrop-blur-sm border-r border-white/20 shadow-xl`}>
          <ChatSidebar 
            onSpaceSelect={handleSpaceSelect} 
            currentUserId={user?.id} 
            selectedSpace={selectedSpace}
          />
          
          <button
            onClick={toggleSidebar}
            className="md:hidden absolute top-4 right-4 text-gray-500 hover:text-indigo-600 transition-colors duration-300 p-2 rounded-lg hover:bg-indigo-50"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {sidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 z-10 bg-black bg-opacity-30 transition-opacity duration-300"
            onClick={toggleSidebar}
          ></div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 p-4 hidden md:block transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 capitalize">
                  {selectedSpace === 'general' ? 'General' : selectedSpace.replace(/-/g, ' ')}
                </h2>
                <p className="text-sm text-gray-500 transition-colors duration-300">
                  {isDirectMessage ? 'Direct message conversation' : 'Group chat'}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/direct-messages" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors duration-300 btn-hover px-3 py-1 rounded-lg hover:bg-indigo-50">
                  Direct Messages
                </Link>
                <NotificationDropdown />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-white/30 backdrop-blur-sm">
            <MessageList 
              messages={messages} 
              currentUserId={user?.id} 
              isLoading={isLoading} 
              error={error} 
            />
            <div ref={messagesEndRef} />
          </div>

          <div className="bg-white/90 backdrop-blur-sm border-t border-white/20 p-4 shadow-lg">
            <MessageInput 
              newMessage={newMessage} 
              setNewMessage={setNewMessage} 
              handleSendMessage={handleSendMessage} 
              isLoading={false} 
              messageCount={messages.length}
              isConnected={isConnected}
            />
          </div>
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
  );
};

export default Chat;