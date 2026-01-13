import { useState, useEffect } from 'react';
import { api, Space } from '@/services/api';
import { useDirectMessages } from '@/hooks/useDirectMessages';
import { useUserSearch } from '@/hooks/useUserSearch';

interface ChatSidebarProps {
  onSpaceSelect: (spaceId: string, type: string) => void;
  currentUserId: string | undefined;
  selectedSpace: string;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ onSpaceSelect, currentUserId, selectedSpace }) => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { conversations } = useDirectMessages();
  const { users: searchedUsers, loading: searchingUsers, error: userSearchError, searchUsers } = useUserSearch();

  useEffect(() => {
    loadSpaces();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() && searchTerm.length > 1) {
      const isChannelSearch = searchTerm.startsWith('#');
      if (!isChannelSearch) {
        searchUsers(searchTerm);
      }
    } else {
      if (!searchTerm.startsWith('#')) {
        searchUsers('');
      }
    }
  }, [searchTerm, searchUsers]);

  const loadSpaces = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.getSpaces();
      if (result.error) {
        setError(result.error);
      } else {
        const regularSpaces = result.data.spaces.filter(space => space.type !== 'direct');
        setSpaces(regularSpaces);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const renderSpaceIcon = (type: string) => {
    switch (type) {
      case 'public':
        return (
          <div className="p-1 rounded-lg bg-green-100">
            <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'private':
        return (
          <div className="p-1 rounded-lg bg-yellow-100">
            <svg className="h-4 w-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        );
      case 'direct':
        return (
          <div className="p-1 rounded-lg bg-indigo-100">
            <svg className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="p-1 rounded-lg bg-gray-100">
            <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        );
    }
  };

  const filteredSpaces = spaces.filter(space => 
    space.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredConversations = conversations.filter(conversation => 
    conversation.otherUser?.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startDirectMessage = async (userId: string) => {
    try {
      const result = await api.sendDirectMessage('', userId);
      if (!result.error && result.data.spaceId) {
        onSpaceSelect(result.data.spaceId, 'direct');
      }
    } catch (err) {
      console.error('Error starting direct message:', err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-indigo-50/30 backdrop-blur-sm border-r border-white/20 w-full shadow-lg transition-all duration-300">
      <div className="p-4 border-b border-white/20 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search channels, users..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300/50 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {searchTerm && !searchTerm.startsWith('#') && searchedUsers.length > 0 && (
          <div className="px-4 py-3 border-b border-white/20 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 animate-slide-in">
            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">Users</h2>
            <ul className="space-y-1">
              {searchedUsers.map((user, index) => (
                <li key={user.id} style={{ animationDelay: `${index * 50}ms` }}>
                  <button
                    onClick={() => startDirectMessage(user.id)}
                    className="w-full flex items-center px-3 py-2.5 rounded-xl text-left transition-all duration-300 hover:bg-indigo-100/70 text-gray-700 hover:translate-x-1"
                  >
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center shadow-sm">
                      <span className="text-xs font-medium text-indigo-600">
                        {getInitials(user.username)}
                      </span>
                    </div>
                    <span className="ml-2.5 truncate font-medium">{user.username}</span>
                    <span className="ml-auto text-xs text-indigo-500 font-medium">Start DM</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="px-4 py-3 animate-slide-in">
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Channels</h2>
            <button className="text-indigo-600 hover:text-indigo-700 p-1 rounded-lg hover:bg-indigo-100/50 transition-colors duration-300">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : error ? (
            <p className="text-sm text-red-500 px-2 py-1.5 rounded-lg bg-red-50">{error}</p>
          ) : filteredSpaces.length > 0 ? (
            <ul className="space-y-1">
              {filteredSpaces.map((space, index) => (
                <li key={space.id} style={{ animationDelay: `${index * 30}ms` }}>
                  <button
                    onClick={() => onSpaceSelect(space.id, space.type)}
                    className={`w-full flex items-center px-3 py-2.5 rounded-xl text-left transition-all duration-300 ${
                      selectedSpace === space.id
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md'
                        : 'hover:bg-indigo-100/70 text-gray-700 hover:translate-x-1'
                    }`}
                  >
                    {renderSpaceIcon(space.type)}
                    <span className="ml-2.5 truncate font-medium">{space.name}</span>
                    {space.type !== 'public' && (
                      <span className={`ml-auto text-xs ${
                        selectedSpace === space.id ? 'text-indigo-100' : 'text-gray-500'
                      }`}>
                        {space.members.length}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 px-2 py-1.5 rounded-lg bg-gray-50">No channels found</p>
          )}
        </div>

        <div className="px-4 py-3 border-t border-white/20 bg-gradient-to-r from-indigo-50/30 to-purple-50/30 animate-slide-in">
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Direct Messages</h2>
            <button className="text-indigo-600 hover:text-indigo-700 p-1 rounded-lg hover:bg-indigo-100/50 transition-colors duration-300">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
          {filteredConversations.length > 0 ? (
            <ul className="space-y-1">
              {filteredConversations.map((conversation, index) => {
                const otherUser = conversation.otherUser;
                if (!otherUser) return null;
                
                return (
                  <li key={conversation.id} style={{ animationDelay: `${index * 40}ms` }}>
                    <button
                      onClick={() => onSpaceSelect(conversation.id, 'direct')}
                      className={`w-full flex items-center px-3 py-2.5 rounded-xl text-left transition-all duration-300 ${
                        selectedSpace === conversation.id
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md'
                          : 'hover:bg-indigo-100/70 text-gray-700 hover:translate-x-1'
                      }`}
                    >
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center shadow-sm">
                        <span className="text-xs font-medium text-indigo-600">
                          {getInitials(otherUser.username)}
                        </span>
                      </div>
                      <span className="ml-2.5 truncate font-medium">{otherUser.username}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 px-2 py-1.5 rounded-lg bg-gray-50">No direct messages yet</p>
          )}
        </div>

        <div className="px-4 py-3 border-t border-white/20 animate-slide-in">
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2.5">Online</h2>
          <ul className="space-y-2">
            {conversations
              .filter(conv => conv.otherUser && conv.otherUser.id !== currentUserId)
              .slice(0, 5)
              .map((conv, index) => {
                if (!conv.otherUser) return null;
                return (
                  <li key={conv.otherUser.id} className="flex items-center animate-fade-in-left" style={{ animationDelay: `${index * 60}ms` }}>
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 flex items-center justify-center shadow-sm">
                      <span className="text-xs text-white">●</span>
                    </div>
                    <span className="ml-2.5 text-sm text-gray-700 font-medium truncate">{conv.otherUser.username}</span>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>

      <div className="p-4 border-t border-white/20 bg-gradient-to-r from-indigo-50 to-purple-50 animate-slide-in">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center shadow-sm">
            <span className="text-sm font-medium text-indigo-600">
              {currentUserId ? currentUserId.charAt(0).toUpperCase() : 'U'}
            </span>
          </div>
          <div className="ml-3 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {currentUserId ? 'You' : 'Guest'}
            </p>
            <p className="text-xs text-green-500 flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
              Online
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;