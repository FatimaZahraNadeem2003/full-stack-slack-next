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
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 animate-float">
        <div className="text-center animate-fade-in-up">
          <div className="p-4 rounded-full bg-indigo-100 inline-block mb-4">
            <svg className="mx-auto h-12 w-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="mt-2 text-lg font-semibold text-gray-800 gradient-text">Select a conversation</h3>
          <p className="mt-1 text-gray-600">Choose a direct message conversation from the sidebar to start chatting.</p>
        </div>
      </div>
    );
  }

  if (!activeConversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center animate-pulse-slow">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading conversation...</p>
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
    <div className="flex flex-col h-full bg-gradient-to-br from-indigo-50/30 to-purple-50/30">
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 p-4 flex items-center shadow-sm">
        <button 
          onClick={onBack}
          className="md:hidden mr-3 text-gray-500 hover:text-indigo-600 transition-colors duration-300 p-2 rounded-lg hover:bg-indigo-50"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center flex-1">
          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center shadow-md">
            <span className="text-sm font-bold text-indigo-600">
              {getInitials(otherUser?.username || '')}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-base font-bold text-gray-800">
              {otherUser?.username}
            </p>
            <p className="text-sm text-gray-600 flex items-center">
              {isConnected ? (
                <span className="inline-flex items-center">
                  <span className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
                  Online
                </span>
              ) : (
                <span className="inline-flex items-center">
                  <span className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-gray-400 mr-1.5"></span>
                  Offline
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="ml-auto">
          <NotificationDropdown />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-white/20 backdrop-blur-sm">
        {isLoading ? (
          <div className="text-center py-4 text-gray-500 animate-pulse">Loading messages...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500 bg-red-50 rounded-lg m-4 animate-shake">{error}</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8 animate-float">
            <div className="p-4 rounded-full bg-indigo-100 inline-block mb-4">
              <svg className="mx-auto h-12 w-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="mt-2 text-lg font-semibold text-gray-800 gradient-text">No messages yet</h3>
            <p className="mt-1 text-gray-600">Send a message to start the conversation.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedMessages).map(([date, dateMessages], groupIndex) => (
              <div key={date} className="space-y-4 animate-slide-in" style={{ animationDelay: `${groupIndex * 50}ms` }}>
                <div className="flex items-center justify-center my-4">
                  <div className="border-t border-gray-300/50 flex-grow"></div>
                  <span className="text-xs text-gray-500 bg-gradient-to-r from-indigo-100 to-purple-100 px-3 py-1 rounded-full mx-2 shadow-sm">
                    {formatDate(dateMessages[0].timestamp)}
                  </span>
                  <div className="border-t border-gray-300/50 flex-grow"></div>
                </div>
                
                {dateMessages.map((message, msgIndex) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.userId === currentUser?.id ? 'justify-end' : 'justify-start'} animate-scale-in`}
                    style={{ animationDelay: `${(groupIndex * 50) + (msgIndex * 20)}ms` }}
                  >
                    <div 
                      className={`max-w-xs sm:max-w-md md:max-w-lg ${message.userId === currentUser?.id ? 'order-2' : 'order-1'}`}
                    >
                      <div className={`px-4 py-3 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] ${
                        message.userId === currentUser?.id 
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-tr-none shadow-lg' 
                          : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-md hover:shadow-lg'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <div className={`text-xs mt-1 ${message.userId === currentUser?.id ? 'text-indigo-200' : 'text-gray-500'}`}>
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                    <div className={`flex-shrink-0 ${message.userId === currentUser?.id ? 'order-1 ml-2' : 'order-2 mr-2'}`}>
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
                        message.userId === currentUser?.id ? 'bg-gradient-to-r from-indigo-200 to-purple-200' : 'bg-gradient-to-r from-gray-200 to-gray-300'
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

      <div className="bg-white/80 backdrop-blur-sm border-t border-white/20 p-4 shadow-lg">
        <form onSubmit={handleSendMessage} className="flex items-end transition-all duration-300">
          <div className="flex-1 bg-white/70 backdrop-blur-sm border border-gray-300/50 rounded-xl shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all duration-300">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Message @${otherUser?.username}`}
              className="w-full px-4 py-3 resize-none focus:outline-none text-sm max-h-32 bg-transparent transition-all duration-300 placeholder:text-gray-400"
              rows={1}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !newMessage.trim()}
            className={`ml-3 inline-flex items-center justify-center h-12 w-12 rounded-full transition-all duration-300 flex-shrink-0 transform hover:scale-110 ${
              newMessage.trim() 
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
        <div className="mt-2 text-xs text-gray-500 flex justify-between transition-all duration-300">
          <div className="flex items-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-300 ${
              isConnected 
                ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800' 
                : 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800'
            }`}>
              <span className={`flex-shrink-0 w-2 h-2 rounded-full mr-1.5 transition-all duration-300 ${
                isConnected ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
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