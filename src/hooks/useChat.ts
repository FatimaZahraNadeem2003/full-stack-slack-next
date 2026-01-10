import { useState, useEffect } from 'react';
import { api, Message } from '@/services/api';
import { useSocket } from './useSocket';

export const useChat = (spaceId: string = 'general', isDirectMessage: boolean = false) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    sendMessage: sendSocketMessage, 
    subscribeToReceiveMessage, 
    subscribeToMessageSent,
    subscribeToErrors,
    isConnected,
    joinSpaces,
    subscribeToReceiveDirectMessage
  } = useSocket();

  useEffect(() => {
    loadMessages();
  }, [spaceId]);

  const loadMessages = async () => {
    setIsLoading(true);
    setError(null);
    let result;
    
    if (isDirectMessage) {
      result = await api.getDirectMessages(spaceId);
    } else {
      result = await api.getMessages(spaceId); 
    }
    
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
      if (isDirectMessage) {
      } else {
        joinSpaces([spaceId]);
      }
    }
  }, [isConnected, spaceId, isDirectMessage]);

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

    if (isDirectMessage) {
      subscribeToReceiveDirectMessage(receiveMessageCallback);
    } else {
      subscribeToReceiveMessage(receiveMessageCallback);
    }
    
    subscribeToMessageSent(messageSentCallback);
    subscribeToErrors(errorCallback);

    return () => {
      setError(null);
    };
  }, [spaceId, isDirectMessage]);

  const sendMessage = async (content: string) => {
    setError(null);
    
    if (isConnected) {
      if (isDirectMessage) {
        sendSocketMessage({ content, spaceId });
      } else {
        sendSocketMessage({ content, spaceId });
      }
      return true;
    } else {
      let result;
      
      if (isDirectMessage) {
        result = await api.sendMessage(content, spaceId);
      } else {
        result = await api.sendMessage(content, spaceId);
      }
      
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

  const joinSpace = async (targetSpaceId: string) => {
    setError(null);
    try {
      const result = await api.joinSpace(targetSpaceId);
      if (result.error) {
        setError(result.error);
        console.error('Error joining space:', result.error);
        return false;
      } else {
        console.log('Successfully joined space:', result.data.message);
        return true;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error joining space:', err);
      return false;
    }
  };

  return {
    messages,
    isLoading,
    error,
    loadMessages,
    sendMessage,
    isConnected,
    joinSpace,
  };
};