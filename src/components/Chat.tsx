import { useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';

const Chat = () => {
  const [newMessage, setNewMessage] = useState('');
  const { messages, isLoading, error, sendMessage } = useChat();
  const { user, logout } = useAuth();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const success = await sendMessage(newMessage);
    if (success) {
      setNewMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Chat App</h1>
          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.username}!</span>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          {/* Chat header */}
          <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Chat Room</h2>
            <span className="text-indigo-200 text-sm">{messages.length} messages</span>
          </div>
          
          {/* Messages container */}
          <div className="p-4 h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">Loading messages...</p>
              </div>
            ) : messages.length > 0 ? (
              <ul className="space-y-4">
                {messages.map((msg) => (
                  <li key={msg.id} className={`flex ${msg.user === user?.username ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex flex-col ${msg.user === user?.username ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs font-medium text-indigo-600">{msg.user}</span>
                        <span className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <div className={`rounded-lg p-3 max-w-xs sm:max-w-md ${
                        msg.user === user?.username 
                          ? 'bg-indigo-100 border border-indigo-300' 
                          : 'bg-gray-100 border border-gray-300'
                      }`}>
                        <p className="text-gray-800">{msg.content}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">No messages yet. Be the first to send one!</p>
              </div>
            )}
            
            {error && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
                Error: {error}
              </div>
            )}
          </div>
          
          {/* Message input form */}
          <div className="border-t p-4 bg-gray-50">
            <form onSubmit={handleSendMessage} className="flex flex-col space-y-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-500">
          <p>Frontend: Next.js • Backend: Express.js</p>
        </div>
      </div>
    </div>
  );
};

export default Chat;