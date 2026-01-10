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
    // On mobile, close sidebar after selecting a space
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={toggleSidebar}
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
                <span className="ml-2 text-xl font-bold text-gray-900 hidden sm:block">Slack Clone</span>
              </div>
              
              {/* Space name on mobile */}
              <div className="ml-4 md:hidden">
                <h2 className="text-sm font-semibold text-gray-800 capitalize">
                  {selectedSpace === 'general' ? 'General' : selectedSpace.replace(/-/g, ' ')}
                </h2>
                <p className="text-xs text-gray-500">
                  {isDirectMessage ? 'Direct message' : 'Group chat'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/direct-messages" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hidden md:inline-block">
                Direct Messages
              </Link>
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
        {/* Sidebar - collapsible on mobile */}
        <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block absolute md:relative z-20 inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out w-64 bg-white border-r border-gray-200`}>
          <ChatSidebar 
            onSpaceSelect={handleSpaceSelect} 
            currentUserId={user?.id} 
            selectedSpace={selectedSpace}
          />
          
          {/* Close button for mobile */}
          <button
            onClick={toggleSidebar}
            className="md:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 z-10 bg-black bg-opacity-50"
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Main chat area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-white border-b border-gray-200 p-4 hidden md:block">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 capitalize">
                  {selectedSpace === 'general' ? 'General' : selectedSpace.replace(/-/g, ' ')}
                </h2>
                <p className="text-sm text-gray-500">
                  {isDirectMessage ? 'Direct message conversation' : 'Group chat'}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/direct-messages" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  Direct Messages
                </Link>
                <NotificationDropdown />
              </div>
            </div>
          </div>

          {/* Messages container */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <MessageList 
              messages={messages} 
              currentUserId={user?.id} 
              isLoading={isLoading} 
              error={error} 
            />
            <div ref={messagesEndRef} />
          </div>

          <div className="bg-white border-t border-gray-200 p-4">
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
    </div>
  );
};

export default Chat;