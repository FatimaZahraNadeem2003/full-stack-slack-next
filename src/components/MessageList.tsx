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

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: 'calc(100vh - 350px)' }}>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : messages.length > 0 ? (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.userId === currentUserId ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${msg.userId === currentUserId ? 'order-2' : 'order-1'}`}>
                <div className="flex items-center mb-1">
                  <span className={`text-xs font-semibold ${msg.userId === currentUserId ? 'text-right' : 'text-left'} ${(msg.userId === currentUserId ? 'text-indigo-600' : 'text-gray-600')}`}>
                    {msg.user}
                    {msg.userRole && msg.userRole !== 'user' && (
                      <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {msg.userRole}
                      </span>
                    )}
                  </span>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="text-xs text-gray-500">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className={`px-4 py-2 rounded-2xl ${
                  msg.userId === currentUserId 
                    ? 'bg-indigo-500 text-white rounded-tr-none' 
                    : 'bg-gray-100 text-gray-800 rounded-tl-none'
                }`}>
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
              <div className={`flex-shrink-0 ${msg.userId === currentUserId ? 'order-1 ml-2' : 'order-2 mr-2'}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  msg.userId === currentUserId ? 'bg-indigo-200' : 'bg-gray-200'
                }`}>
                  <span className="text-xs font-medium text-gray-700">
                    {msg.user.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <svg className="h-16 w-16 text-gray-300 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No messages yet</h3>
          <p className="text-gray-500 max-w-md">
            Be the first to send a message in #{' '}<span className="font-medium text-indigo-600">general</span>
          </p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
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