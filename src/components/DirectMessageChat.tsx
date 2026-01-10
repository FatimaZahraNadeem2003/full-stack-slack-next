import { useState, useEffect, useRef } from 'react';
import { useDirectMessages } from '@/hooks/useDirectMessages';
import { User as ApiUser } from '@/services/api';

interface User {
  id: string;
  username: string;
  email: string;
  role?: 'admin' | 'user';
}

interface DirectMessageChatProps {
  conversationId: string | null;
  currentUser: User | null;
  onBack: () => void;
}

const DirectMessageChat: React.FC<DirectMessageChatProps> = ({ 
  conversationId, 
  currentUser,
  onBack
}) => {
  const {
    activeConversation,
    messages,
    sendDirectMessage,
    isLoading,
    error,
    isConnected
  } = useDirectMessages();
  
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversationId || !activeConversation?.otherUser) return;

    const success = await sendDirectMessage(newMessage, activeConversation.otherUser.id);
    if (success) {
      setNewMessage('');
    }
  };

  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Select a conversation</h3>
          <p className="mt-1 text-sm text-gray-500">Choose a direct message conversation from the sidebar to start chatting.</p>
        </div>
      </div>
    );
  }

  if (!activeConversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-sm text-gray-500">Loading conversation...</p>
        </div>
      </div>
    );
  }

  const otherUser = activeConversation.otherUser;
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-200 p-4 flex items-center">
        <button 
          onClick={onBack}
          className="md:hidden mr-3 text-gray-500 hover:text-gray-700"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-sm font-medium text-indigo-600">
              {getInitials(otherUser?.username || '')}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              {otherUser?.username}
            </p>
            <p className="text-xs text-gray-500">
              {isConnected ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {isLoading ? (
          <div className="text-center py-4 text-gray-500">Loading messages...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No messages yet</h3>
            <p className="mt-1 text-sm text-gray-500">Send a message to start the conversation.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.userId === currentUser?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                    message.userId === currentUser?.id 
                      ? 'bg-indigo-500 text-white' 
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  <p>{message.content}</p>
                  <div className={`text-xs mt-1 ${message.userId === currentUser?.id ? 'text-indigo-200' : 'text-gray-500'}`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Message @${otherUser?.username}`}
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            disabled={!newMessage.trim() || isLoading}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default DirectMessageChat;