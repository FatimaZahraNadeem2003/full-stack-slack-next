import { Message } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  currentUserId?: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading, error, currentUserId }) => {
  const { user } = useAuth();

  const groupedMessages = messages.reduce((acc, message) => {
    const date = new Date(message.timestamp).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(message);
    return acc;
  }, {} as Record<string, Message[]>);

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
    <div className="flex-1 overflow-y-auto p-4 space-y-6" style={{ maxHeight: 'calc(100vh - 200px)' }}>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500 mb-2"></div>
            <p className="text-gray-500 text-sm">Loading messages...</p>
          </div>
        </div>
      ) : messages.length > 0 ? (
        Object.entries(groupedMessages).map(([date, dateMessages], groupIndex) => (
          <div key={date} className="space-y-4 animate-slide-in" style={{ animationDelay: `${groupIndex * 50}ms` }}>
            <div className="flex items-center justify-center my-4">
              <div className="border-t border-gray-300 flex-grow"></div>
              <span className="text-xs text-gray-500 bg-gradient-to-r from-indigo-100 to-purple-100 px-3 py-1 rounded-full mx-2 shadow-sm">
                {formatDate(dateMessages[0].timestamp)}
              </span>
              <div className="border-t border-gray-300 flex-grow"></div>
            </div>
            
            {dateMessages.map((msg, msgIndex) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.userId === currentUserId ? 'justify-end' : 'justify-start'} animate-scale-in`}
                style={{ animationDelay: `${(groupIndex * 50) + (msgIndex * 20)}ms` }}
              >
                <div className={`max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl ${msg.userId === currentUserId ? 'order-2' : 'order-1'}`}>
                  {!msg.isDeleted && (
                    <>
                      <div className="flex items-center mb-1">
                        <span className={`text-xs font-semibold ${msg.userId === currentUserId ? 'text-right' : 'text-left'} ${(msg.userId === currentUserId ? 'text-indigo-600' : 'text-gray-600')}`}>
                          {msg.user}
                          {msg.userRole && msg.userRole !== 'user' && (
                            <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-red-100 to-red-200 text-red-800 shadow-sm">
                              {msg.userRole}
                            </span>
                          )}
                        </span>
                        <span className="mx-2 text-gray-400">•</span>
                        <span className="text-xs text-gray-500">
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>
                      <div className={`px-4 py-3 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] ${
                        msg.userId === currentUserId 
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-tr-none shadow-lg' 
                          : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-md hover:shadow-lg'
                      }`}>
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    </>
                  )}
                  
                  {msg.isDeleted && (
                    <div className={`px-4 py-2 rounded-2xl ${
                      msg.userId === currentUserId 
                        ? 'bg-gray-300 text-gray-500 rounded-tr-none' 
                        : 'bg-gray-100 text-gray-500 rounded-tl-none'
                    }`}>
                      <p className="text-sm italic">Message deleted</p>
                    </div>
                  )}
                </div>
                {!msg.isDeleted && (
                  <div className={`flex-shrink-0 ${msg.userId === currentUserId ? 'order-1 ml-2' : 'order-2 mr-2'}`}>
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
                      msg.userId === currentUserId ? 'bg-gradient-to-r from-indigo-200 to-purple-200' : 'bg-gradient-to-r from-gray-200 to-gray-300'
                    }`}>
                      <span className="text-xs font-medium text-gray-700">
                        {msg.user.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-center animate-float">
          <div className="p-4 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 mb-4 animate-pulse-slow">
            <svg className="h-12 w-12 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1 gradient-text">No messages yet</h3>
          <p className="text-gray-500 max-w-md">
            Be the first to send a message in #{' '}<span className="font-medium text-indigo-600">general</span>
          </p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-gradient-to-r from-red-50 to-pink-50 text-red-700 rounded-lg flex items-center animate-shake shadow-md">
          <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default MessageList;