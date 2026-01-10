import { useState, useEffect } from 'react';
import { api, Space } from '@/services/api';
import { useDirectMessages } from '@/hooks/useDirectMessages';

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

  useEffect(() => {
    loadSpaces();
  }, []);

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
          <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'private':
        return (
          <svg className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        );
      case 'direct':
        return (
          <svg className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
    }
  };

  const filteredSpaces = spaces.filter(space => 
    space.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredConversations = conversations.filter(conversation => 
    conversation.otherUser?.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 w-full">
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search channels, users..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Channels</h2>
            <button className="text-indigo-600 hover:text-indigo-800">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
          {loading ? (
            <p className="text-sm text-gray-500 px-2 py-1">Loading spaces...</p>
          ) : error ? (
            <p className="text-sm text-red-500 px-2 py-1">Error: {error}</p>
          ) : filteredSpaces.length > 0 ? (
            <ul className="space-y-1">
              {filteredSpaces.map((space) => (
                <li key={space.id}>
                  <button
                    onClick={() => onSpaceSelect(space.id, space.type)}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                      selectedSpace === space.id
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {renderSpaceIcon(space.type)}
                    <span className="ml-2 truncate">{space.name}</span>
                    {space.type !== 'public' && (
                      <span className="ml-auto text-xs text-gray-500">
                        {space.members.length}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 px-2 py-1">No channels found</p>
          )}
        </div>

        <div className="px-4 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Direct Messages</h2>
            <button className="text-indigo-600 hover:text-indigo-800">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
          {filteredConversations.length > 0 ? (
            <ul className="space-y-1">
              {filteredConversations.map((conversation) => {
                const otherUser = conversation.otherUser;
                if (!otherUser) return null;
                
                return (
                  <li key={conversation.id}>
                    <button
                      onClick={() => onSpaceSelect(conversation.id, 'direct')}
                      className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                        selectedSpace === conversation.id
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-indigo-600">
                          {getInitials(otherUser.username)}
                        </span>
                      </div>
                      <span className="ml-2 truncate">{otherUser.username}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 px-2 py-1">No direct messages yet</p>
          )}
        </div>

        <div className="px-4 py-3 border-t border-gray-200">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Online</h2>
          <ul className="space-y-2">
            {conversations
              .filter(conv => conv.otherUser && conv.otherUser.id !== currentUserId)
              .slice(0, 5)
              .map(conv => {
                if (!conv.otherUser) return null;
                return (
                  <li key={conv.otherUser.id} className="flex items-center">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-xs text-green-800">●</span>
                    </div>
                    <span className="ml-2 text-sm text-gray-700 truncate">{conv.otherUser.username}</span>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-sm font-medium text-indigo-600">
              {currentUserId ? currentUserId.charAt(0).toUpperCase() : 'U'}
            </span>
          </div>
          <div className="ml-3 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {currentUserId ? 'You' : 'Guest'}
            </p>
            <p className="text-xs text-gray-500">Online</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;