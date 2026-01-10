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

  return (
    <div className="w-full md:w-64 bg-white rounded-xl shadow p-4 h-fit">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Channels</h2>
        {loading ? (
          <p className="text-sm text-gray-500">Loading spaces...</p>
        ) : error ? (
          <p className="text-sm text-red-500">Error: {error}</p>
        ) : (
          <ul className="space-y-2">
            {spaces.map((space) => (
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
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Direct Messages</h2>
        {conversations.length > 0 ? (
          <ul className="space-y-2">
            {conversations.map((conversation) => {
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
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center">
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
          <p className="text-sm text-gray-500">No direct messages yet</p>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;