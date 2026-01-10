import { useState, useEffect } from 'react';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import ChatSidebar from './ChatSidebar';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const Chat = () => {
  const [newMessage, setNewMessage] = useState('');
  const { messages, isLoading, error, sendMessage, isConnected } = useChat();
  const { user, logout, isAdmin } = useAuth();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const success = await sendMessage(newMessage);
    if (success) {
      setNewMessage('');
    }
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
            <div className="flex items-center">
              <div className="flex items-center space-x-4">
                {/* Connection status indicator */}
                <div className="flex items-center">
                  <div className={`h-2 w-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-xs text-gray-500">
                    {isConnected ? 'Online' : 'Offline'}
                  </span>
                </div>
                
                {user && (
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-indigo-600">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{user.username}</span>
                    {isAdmin && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Admin
                      </span>
                    )}
                  </div>
                )}
                
                {isAdmin && (
                  <a
                    href="/admin"
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                  >
                    <svg className="-ml-0.5 mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    Admin
                  </a>
                )}
                
                <button
                  onClick={logout}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                >
                  <svg className="-ml-0.5 mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <ChatSidebar isAdmin={isAdmin} />
          
          <div className="flex-1 flex flex-col">
            <div className="bg-white rounded-xl shadow mb-6">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-indigo-600">#</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <h2 className="text-lg font-semibold text-gray-900"># general</h2>
                    <p className="text-sm text-gray-500">General discussion for team members</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow flex-1 flex flex-col">
              <MessageList messages={messages} isLoading={isLoading} error={error} />
              <MessageInput 
                newMessage={newMessage} 
                handleSendMessage={handleSendMessage} 
                setNewMessage={setNewMessage} 
                isLoading={isLoading} 
                messageCount={messages.length} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;