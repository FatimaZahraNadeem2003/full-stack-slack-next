import { useState, useEffect } from 'react';
import { useDirectMessages } from '@/hooks/useDirectMessages';
import { User as ApiUser } from '@/services/api';

interface User {
  id: string;
  username: string;
  email: string;
  role?: 'admin' | 'user';
}

interface DirectMessageSidebarProps {
  currentUser: User | null;
  onSelectConversation: (conversationId: string) => void;
  activeConversationId: string | null;
}

const DirectMessageSidebar: React.FC<DirectMessageSidebarProps> = ({ 
  currentUser, 
  onSelectConversation, 
  activeConversationId 
}) => {
  const { conversations, loadConversations, isLoading, error } = useDirectMessages();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadConversations();
  }, []);

  const filteredConversations = conversations.filter(conversation => {
    if (!conversation.otherUser) return false;
    return conversation.otherUser.username.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="bg-white border-r border-gray-200 w-80 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Direct Messages</h2>
        <div className="mt-3">
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">Loading conversations...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No direct message conversations found</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredConversations.map(conversation => {
              const otherUser = conversation.otherUser;
              if (!otherUser) return null;
              
              return (
                <li 
                  key={conversation.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    activeConversationId === conversation.id ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''
                  }`}
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-indigo-600">
                        {getInitials(otherUser.username)}
                      </span>
                    </div>
                    <div className="ml-3 min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {otherUser.username}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {conversation.type === 'direct' ? 'Direct message' : conversation.spaceName}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="p-4 border-t border-gray-200">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Online</h3>
        <div className="space-y-2">
          {conversations
            .filter(conv => conv.otherUser && conv.otherUser.id !== currentUser?.id)
            .slice(0, 5)
            .map(conv => {
              if (!conv.otherUser) return null;
              return (
                <div key={conv.otherUser.id} className="flex items-center">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-xs text-green-800">●</span>
                  </div>
                  <span className="ml-2 text-sm text-gray-700">{conv.otherUser.username}</span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default DirectMessageSidebar;