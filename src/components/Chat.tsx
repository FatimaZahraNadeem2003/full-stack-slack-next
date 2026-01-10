import { useState, useEffect } from 'react';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';

const Chat = () => {
  const [newMessage, setNewMessage] = useState('');
  const { messages, isLoading, error, sendMessage, isConnected } = useChat();
  const { user, logout } = useAuth();

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
                  </div>
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
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Channels</h2>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="flex items-center p-2 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-lg">
                    <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                    # general
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center p-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50">
                    <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                    # random
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center p-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50">
                    <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                    # announcements
                  </a>
                </li>
              </ul>
              
              <h3 className="text-md font-medium text-gray-900 mt-6 mb-3">Direct Messages</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="flex items-center p-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50">
                    <div className="h-6 w-6 rounded-full bg-green-400 flex items-center justify-center mr-2">
                      <span className="text-xs text-white">A</span>
                    </div>
                    Alex Johnson
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center p-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50">
                    <div className="h-6 w-6 rounded-full bg-yellow-400 flex items-center justify-center mr-2">
                      <span className="text-xs text-white">S</span>
                    </div>
                    Sarah Miller
                  </a>
                </li>
              </ul>
            </div>
          </div>

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
                        className={`flex ${msg.user === user?.username ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${msg.user === user?.username ? 'order-2' : 'order-1'}`}>
                          <div className="flex items-center mb-1">
                            <span className={`text-xs font-semibold ${msg.user === user?.username ? 'text-right' : 'text-left'} ${(msg.user === user?.username ? 'text-indigo-600' : 'text-gray-600')}`}>
                              {msg.user}
                            </span>
                            <span className="mx-2 text-gray-400">•</span>
                            <span className="text-xs text-gray-500">
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className={`px-4 py-2 rounded-2xl ${
                            msg.user === user?.username 
                              ? 'bg-indigo-500 text-white rounded-tr-none' 
                              : 'bg-gray-100 text-gray-800 rounded-tl-none'
                          }`}>
                            <p className="text-sm">{msg.content}</p>
                          </div>
                        </div>
                        <div className={`flex-shrink-0 ${msg.user === user?.username ? 'order-1 ml-2' : 'order-2 mr-2'}`}>
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            msg.user === user?.username ? 'bg-indigo-200' : 'bg-gray-200'
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

              <div className="border-t border-gray-200 p-4">
                <form onSubmit={handleSendMessage} className="flex items-center">
                  <div className="flex-1 bg-gray-100 rounded-full mr-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="w-full bg-transparent border-0 focus:ring-0 text-sm py-2 px-4 text-gray-900"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading || !newMessage.trim()}
                    className={`inline-flex items-center justify-center h-11 w-11 rounded-full ${
                      newMessage.trim() 
                        ? 'bg-indigo-500 hover:bg-indigo-600 text-white' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    } transition-colors duration-200`}
                  >
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </button>
                </form>
                <div className="mt-2 text-xs text-gray-500 flex justify-between">
                  <span>Press Enter to send</span>
                  <span>{messages.length} messages in this channel</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;