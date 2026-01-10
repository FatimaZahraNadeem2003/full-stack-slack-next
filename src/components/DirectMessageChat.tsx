import { useState, useEffect, useRef } from 'react';
import { useDirectMessages } from '@/hooks/useDirectMessages';
import { User as ApiUser } from '@/services/api';
import NotificationDropdown from './NotificationDropdown';

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

  const groupedMessages = messages.reduce((acc, message) => {
    const date = new Date(message.timestamp).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(message);
    return acc;
  }, {} as Record<string, any[]>);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    }
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
        <div className="flex items-center flex-1">
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
              {isConnected ? (
                <span className="inline-flex items-center">
                  <span className="flex-shrink-0 w-2 h-2 rounded-full bg-green-400 mr-1"></span>
                  Online
                </span>
              ) : (
                'Offline'
              )}
            </p>
          </div>
        </div>
        <div className="ml-auto">
          <NotificationDropdown />
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
          <div className="space-y-6">
            {Object.entries(groupedMessages).map(([date, dateMessages]) => (
              <div key={date} className="space-y-4">
                <div className="flex items-center justify-center my-4">
                  <div className="border-t border-gray-300 flex-grow"></div>
                  <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full mx-2">
                    {formatDate(dateMessages[0].timestamp)}
                  </span>
                  <div className="border-t border-gray-300 flex-grow"></div>
                </div>
                
                {dateMessages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.userId === currentUser?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-xs sm:max-w-md md:max-w-lg ${message.userId === currentUser?.id ? 'order-2' : 'order-1'}`}
                    >
                      <div className={`px-4 py-3 rounded-2xl ${
                        message.userId === currentUser?.id 
                          ? 'bg-indigo-500 text-white rounded-tr-none' 
                          : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <div className={`text-xs mt-1 ${message.userId === currentUser?.id ? 'text-indigo-200' : 'text-gray-500'}`}>
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                    <div className={`flex-shrink-0 ${message.userId === currentUser?.id ? 'order-1 ml-2' : 'order-2 mr-2'}`}>
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        message.userId === currentUser?.id ? 'bg-indigo-200' : 'bg-gray-200'
                      }`}>
                        <span className="text-xs font-medium text-gray-700">
                          {message.user.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex items-end">
          <div className="flex-1 bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Message @${otherUser?.username}`}
              className="w-full px-4 py-3 resize-none focus:outline-none text-sm max-h-32"
              rows={1}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !newMessage.trim()}
            className={`ml-3 inline-flex items-center justify-center h-11 w-11 rounded-full ${
              newMessage.trim() 
                ? 'bg-indigo-500 hover:bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            } transition-colors duration-200 flex-shrink-0`}
          >
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
        <div className="mt-2 text-xs text-gray-500 flex justify-between">
          <div className="flex items-center">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              isConnected 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              <span className={`flex-shrink-0 w-2 h-2 rounded-full mr-1 ${
                isConnected ? 'bg-green-400' : 'bg-yellow-400'
              }`}></span>
              <span>{isConnected ? 'Connected' : 'Offline'}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectMessageChat;