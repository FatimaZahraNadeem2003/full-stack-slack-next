import { useState, useEffect } from 'react';
import { api, Message } from '@/services/api';

export const useChat = (spaceId: string = 'general') => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMessages();
  }, [spaceId]);

  const loadMessages = async () => {
    setIsLoading(true);
    setError(null);
    const result = await api.getMessages();
    if (result.error) {
      setError(result.error);
      console.error('Error fetching messages:', result.error);
    } else {
      setMessages(result.data.messages);
    }
    setIsLoading(false);
  };

  const sendMessage = async (content: string) => {
    setError(null);
    const result = await api.sendMessage(content, spaceId);
    if (result.error) {
      setError(result.error);
      console.error('Error sending message:', result.error);
      return false;
    } else {
      setMessages(prev => [...prev, result.data]);
      return true;
    }
  };

  return {
    messages,
    isLoading,
    error,
    loadMessages,
    sendMessage,
  };
};