import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './useAuth';
import { Message } from '@/services/api';

interface SendMessageData {
  content: string;
  spaceId?: string;
  recipientId?: string; 
}

export const useSocket = () => {
  const { user } = useAuth(); 
  const socketRef = useRef<any | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return; 
    
    const token = localStorage.getItem('token');
    if (!token) return;

    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
      auth: {
        token: token,
      },
      transports: ['websocket', 'polling'], 
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to server:', socket.id);
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [user]);

  const joinSpaces = (spaceIds: string[]) => {
    if (socketRef.current) {
      socketRef.current.emit('join_spaces', spaceIds);
    }
  };

  const joinDirectMessages = (userIds: string[]) => {
    if (socketRef.current) {
      socketRef.current.emit('join_direct_messages', userIds);
    }
  };

  const sendMessage = (data: SendMessageData) => {
    if (socketRef.current) {
      socketRef.current.emit('send_message', data);
    }
  };

  const subscribeToReceiveMessage = (callback: (data: Message) => void) => {
    if (socketRef.current) {
      socketRef.current.on('receive_message', callback);
    }
  };

  const subscribeToReceiveDirectMessage = (callback: (data: Message) => void) => {
    if (socketRef.current) {
      socketRef.current.on('receive_direct_message', callback);
    }
  };

  const subscribeToNewNotification = (callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on('new_notification', callback);
    }
  };

  const subscribeToMessageSent = (callback: (data: Message) => void) => {
    if (socketRef.current) {
      socketRef.current.on('message_sent', callback);
    }
  };

  const subscribeToErrors = (callback: (error: { message: string }) => void) => {
    if (socketRef.current) {
      socketRef.current.on('error', callback);
    }
  };

  return {
    joinSpaces,
    joinDirectMessages, 
    sendMessage,
    subscribeToReceiveMessage,
    subscribeToReceiveDirectMessage, 
    subscribeToNewNotification, 
    subscribeToMessageSent,
    subscribeToErrors,
    isConnected,
  };
};