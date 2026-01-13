import { useState, useEffect, useCallback } from 'react';
import { api, Message } from '@/services/api';
import { useSocket } from './useSocket';

export const useChat = (spaceId: string, isDirectMessage: boolean = false) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { 
    subscribeToReceiveMessage, 
    subscribeToReceiveDirectMessage, 
    sendMessage: sendSocketMessage, 
    isConnected 
  } = useSocket();

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    
    const fetchMessages = async () => {
      try {
        let result;
        if (isDirectMessage) {
          result = await api.getDirectMessages(spaceId);
        } else {
          result = await api.getMessages(spaceId);
        }
        
        if (result.error) {
          setError(result.error);
          setMessages([]);
        } else {
          const fetchedMessages = result.data.messages.reverse();
          if (isMounted) {
            setMessages(fetchedMessages);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'An error occurred');
          setMessages([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchMessages();

    return () => {
      isMounted = false;
    };
  }, [spaceId, isDirectMessage]);

  useEffect(() => {
    const handleMessage = (message: Message) => {
      setMessages(prev => [...prev, message]);
    };

    if (isDirectMessage) {
      subscribeToReceiveDirectMessage(handleMessage);
    } else {
      subscribeToReceiveMessage(handleMessage);
    }
  }, [subscribeToReceiveMessage, subscribeToReceiveDirectMessage, isDirectMessage]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return false;

    try {
      let result;
      if (isDirectMessage) {
       
        result = await api.sendDirectMessage(content, ""); 
      } else {
        result = await api.sendMessage(content, spaceId);
      }

      if (result.error) {
        setError(result.error);
        return false;
      }
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      return false;
    }
  }, [spaceId, isDirectMessage]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    isConnected,
  };
};