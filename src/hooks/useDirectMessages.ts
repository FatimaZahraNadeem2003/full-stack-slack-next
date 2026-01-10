import { useState, useEffect } from 'react';
import { api, Message, DirectMessageConversation } from '@/services/api';
import { useSocket } from './useSocket';

export const useDirectMessages = () => {
  const [conversations, setConversations] = useState<DirectMessageConversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<DirectMessageConversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { 
    sendMessage: sendSocketMessage, 
    subscribeToReceiveDirectMessage, 
    subscribeToMessageSent,
    subscribeToErrors,
    isConnected,
    joinDirectMessages
  } = useSocket();

  const loadConversations = async () => {
    setIsLoading(true);
    setError(null);
    const result = await api.getDirectMessageConversations();
    if (result.error) {
      setError(result.error);
      console.error('Error fetching direct message conversations:', result.error);
    } else {
      setConversations(result.data.conversations);
    }
    setIsLoading(false);
  };

  const loadMessages = async (conversationId: string) => {
    setIsLoading(true);
    setError(null);
    const result = await api.getDirectMessages(conversationId);
    if (result.error) {
      setError(result.error);
      console.error('Error fetching direct messages:', result.error);
    } else {
      setMessages(result.data.messages.reverse());
    }
    setIsLoading(false);
  };

  const setActiveConversationWithId = (conversationId: string) => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (conversation) {
      setActiveConversation(conversation);
      loadMessages(conversationId);
    }
  };

  const sendDirectMessage = async (content: string, recipientId: string) => {
    setError(null);
    
    if (isConnected) {
      sendSocketMessage({ content, recipientId });
      return true;
    } else {
      const result = await api.sendDirectMessage(content, recipientId);
      if (result.error) {
        setError(result.error);
        console.error('Error sending direct message:', result.error);
        return false;
      } else {
        setMessages(prev => [...prev, result.data]);
        return true;
      }
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    const receiveDirectMessageCallback = (data: Message) => {
      if (activeConversation && data.spaceId === activeConversation.id) {
        setMessages(prev => [...prev, data]);
      }
    };

    const messageSentCallback = (data: Message) => {
      if (activeConversation && data.spaceId === activeConversation.id) {
        setMessages(prev => [...prev, data]);
      }
    };

    const errorCallback = (error: { message: string }) => {
      setError(error.message);
    };

    subscribeToReceiveDirectMessage(receiveDirectMessageCallback);
    subscribeToMessageSent(messageSentCallback);
    subscribeToErrors(errorCallback);

    return () => {
      setError(null);
    };
  }, [activeConversation]);

  useEffect(() => {
    if (isConnected && activeConversation) {
      joinDirectMessages([activeConversation.otherUser?.id || '']);
    }
  }, [isConnected, activeConversation]);

  return {
    conversations,
    activeConversation,
    messages,
    isLoading,
    error,
    loadConversations,
    loadMessages,
    setActiveConversationWithId,
    sendDirectMessage,
    isConnected,
  };
};