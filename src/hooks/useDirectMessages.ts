import { useState, useEffect, useCallback } from 'react';
import { api, DirectMessageConversation, Message } from '@/services/api';
import { useSocket } from './useSocket';

export const useDirectMessages = () => {
  const [conversations, setConversations] = useState<DirectMessageConversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<DirectMessageConversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { joinDirectMessages, sendMessage, subscribeToReceiveDirectMessage, isConnected } = useSocket();

  const loadConversations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await api.getDirectMessageConversations();
      
      if (result.error) {
        setError(result.error);
        setConversations([]);
      } else {
        setConversations(result.data.conversations);
        
        const userIds = result.data.conversations.flatMap(conv => 
          conv.participants.map(p => p.id)
        );
        if (userIds.length > 0) {
          joinDirectMessages(userIds);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setConversations([]);
    } finally {
      setIsLoading(false);
    }
  }, [joinDirectMessages]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const loadMessages = useCallback(async (conversationId: string) => {
    setIsMessagesLoading(true);
    setError(null);
    
    try {
      const result = await api.getDirectMessages(conversationId);
      
      if (result.error) {
        setError(result.error);
      } else {
        setMessages(result.data.messages);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setMessages([]);
    } finally {
      setIsMessagesLoading(false);
    }
  }, []);

  const setActiveConversationWithId = useCallback((conversationId: string) => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (conversation) {
      setActiveConversation(conversation);
      loadMessages(conversationId);
      return conversation;
    }
    return null;
  }, [conversations, loadMessages]);

  const sendDirectMessage = useCallback(async (content: string, recipientId: string) => {
    try {
      const result = await api.sendDirectMessage(content, recipientId);
      
      if (result.error) {
        setError(result.error);
        return false;
      }
      
      setMessages(prev => [...prev, result.data]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      return false;
    }
  }, []);

  useEffect(() => {
    if (activeConversation) {
      const handleNewMessage = (message: Message) => {
        setMessages(prev => [...prev, message]);
      };

      subscribeToReceiveDirectMessage(handleNewMessage);

      return () => {
      };
    }
  }, [activeConversation, subscribeToReceiveDirectMessage]);

  return {
    conversations,
    activeConversation,
    messages,
    isLoading,
    isMessagesLoading,
    error,
    isConnected,
    loadConversations,
    setActiveConversationWithId,
    sendDirectMessage,
  };
};