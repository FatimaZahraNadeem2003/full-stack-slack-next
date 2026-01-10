import { useState, useEffect, useCallback } from 'react';
import { api, Message } from '@/services/api';
import { useSocket } from './useSocket';

export const useChat = (spaceId: string = 'general') => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    sendMessage: sendSocketMessage, 
    subscribeToReceiveMessage, 
    subscribeToMessageSent,
    subscribeToErrors,
    isConnected,
    joinSpaces
  } = useSocket();

  useEffect(() => {
    loadMessages();
  }, [spaceId]);

  const loadMessages = async () => {
    setIsLoading(true);
    setError(null);
    const result = await api.getMessages(spaceId); 
    if (result.error) {
      setError(result.error);
      console.error('Error fetching messages:', result.error);
    } else {
      setMessages(result.data.messages.reverse()); 
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isConnected && spaceId) {
      joinSpaces([spaceId]);
    }
  }, [isConnected, spaceId]);

  useEffect(() => {
    const receiveMessageCallback = (data: Message) => {
      if (data.spaceId === spaceId) {
        setMessages(prev => [...prev, data]);
      }
    };

    const messageSentCallback = (data: Message) => {
      if (data.spaceId === spaceId) {
        setMessages(prev => [...prev, data]);
      }
    };

    const errorCallback = (error: { message: string }) => {
      setError(error.message);
    };

    subscribeToReceiveMessage(receiveMessageCallback);
    subscribeToMessageSent(messageSentCallback);
    subscribeToErrors(errorCallback);

    return () => {
      setError(null);
    };
  }, [spaceId]);

  const sendMessage = async (content: string) => {
    setError(null);
    
    if (isConnected) {
      sendSocketMessage({ content, spaceId });
      return true;
    } else {
      const result = await api.sendMessage(content, spaceId);
      if (result.error) {
        setError(result.error);
        console.error('Error sending message:', result.error);
        return false;
      } else {
        setMessages(prev => [...prev, result.data]);
        return true;
      }
    }
  };

  return {
    messages,
    isLoading,
    error,
    loadMessages,
    sendMessage,
    isConnected,
  };
};