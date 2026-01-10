import { useState, useEffect } from 'react';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import ChatSidebar from './ChatSidebar';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import Link from 'next/link';

const Chat = () => {
  const [newMessage, setNewMessage] = useState('');
  const [selectedSpace, setSelectedSpace] = useState('general');
  const [isDirectMessage, setIsDirectMessage] = useState(false);
  const { messages, isLoading, error, sendMessage, isConnected } = useChat(selectedSpace, isDirectMessage);
  const { user, logout, isAdmin } = useAuth();

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
  };

  useEffect(() => {
    const messagesContainer = document.querySelector('.overflow-y-auto');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <svg className="h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="ml-2 text-xl font-bold text-gray-900">Slack Clone</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/direct-messages" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                Direct Messages
              </Link>
              <div className="ml-3 relative">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700">{user?.username}</span>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar for spaces and direct messages */}
          <ChatSidebar 
            onSpaceSelect={handleSpaceSelect} 
            currentUserId={user?.id} 
            selectedSpace={selectedSpace}
          />

          {/* Main chat area */}
          <div className="flex-1 bg-white rounded-xl shadow p-6 flex flex-col">
            <div className="border-b border-gray-200 pb-4 mb-4">
              <h2 className="text-xl font-semibold text-gray-800 capitalize">
                {selectedSpace === 'general' ? 'General' : selectedSpace.replace(/-/g, ' ')}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {isDirectMessage ? 'Direct message conversation' : 'Group chat'}
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto max-h-[calc(100vh-300px)]">
              <MessageList 
                messages={messages} 
                currentUserId={user?.id} 
                isLoading={isLoading} 
                error={error} 
              />
            </div>

            {/* Message input */}
            <div className="mt-4">
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
      </main>
    </div>
  );
};

export default Chat;