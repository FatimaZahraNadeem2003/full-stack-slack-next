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
    <div className="bg-gradient-to-b from-white to-indigo-50/30 backdrop-blur-sm border-r border-white/20 w-80 flex flex-col shadow-lg">
      <div className="p-4 border-b border-white/20 bg-gradient-to-r from-indigo-50 to-purple-50">
        <h2 className="text-xl font-bold text-gray-800 gradient-text">Direct Messages</h2>
        <div className="mt-3">
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full px-4 py-2.5 border border-gray-300/50 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500 animate-pulse">Loading conversations...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500 bg-red-50 rounded-lg m-4 animate-shake">{error}</div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500 animate-float">No direct message conversations found</div>
        ) : (
          <ul className="divide-y divide-gray-100/50">
            {filteredConversations.map((conversation, index) => {
              const otherUser = conversation.otherUser;
              if (!otherUser) return null;
              
              return (
                <li 
                  key={conversation.id}
                  className={`p-4 hover:bg-indigo-100/50 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                    activeConversationId === conversation.id ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-l-4 border-indigo-500 shadow-md' : ''
                  }`}
                  onClick={() => onSelectConversation(conversation.id)}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="flex items-center animate-fade-in-left">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center shadow-md">
                      <span className="text-sm font-bold text-indigo-600">
                        {getInitials(otherUser.username)}
                      </span>
                    </div>
                    <div className="ml-3 min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {otherUser.username}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
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

      <div className="p-4 border-t border-white/20 bg-gradient-to-r from-indigo-50/30 to-purple-50/30 animate-slide-in">
        <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2.5">Online</h3>
        <div className="space-y-2">
          {conversations
            .filter(conv => conv.otherUser && conv.otherUser.id !== currentUser?.id)
            .slice(0, 5)
            .map((conv, index) => {
              if (!conv.otherUser) return null;
              return (
                <div key={conv.otherUser.id} className="flex items-center animate-fade-in-left" style={{ animationDelay: `${index * 60}ms` }}>
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 flex items-center justify-center shadow-sm">
                    <span className="text-xs text-white">●</span>
                  </div>
                  <span className="ml-2.5 text-sm text-gray-700 font-medium">{conv.otherUser.username}</span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default DirectMessageSidebar;