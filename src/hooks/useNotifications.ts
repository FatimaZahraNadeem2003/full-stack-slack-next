import { useState, useEffect, useRef } from 'react';
import { useSocket } from './useSocket';
import { useAuth } from './useAuth';

interface Notification {
  id: string;
  type: 'message' | 'mention' | 'direct_message' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  spaceId?: string;
  conversationId?: string;
  userId?: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const { subscribeToReceiveMessage, subscribeToReceiveDirectMessage } = useSocket();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const createBeepSound = () => {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.value = 800;
        gainNode.gain.value = 0.3;
        
        oscillator.start();
        setTimeout(() => {
          oscillator.stop();
        }, 150);
      } catch (e) {
        console.log("Web Audio API not supported", e);
      }
    };

    (window as any).playNotificationSound = createBeepSound;
  }, []);

  const playNotificationSound = () => {
    if ((window as any).playNotificationSound) {
      (window as any).playNotificationSound();
    }
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => {
    const newNotification: Notification = {
      id: Math.random().toString(36).substring(2, 9),
      ...notification,
      timestamp: new Date().toISOString(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
    playNotificationSound(); 
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  useEffect(() => {
    if (!user) return;

    const handleMessage = (data: any) => {
      const isMention = data.content.toLowerCase().includes(`@${user.username.toLowerCase()}`);
      
      if (isMention) {
        addNotification({
          type: 'mention',
          title: `@${data.user} mentioned you`,
          message: data.content,
          spaceId: data.spaceId
        });
      } else if (data.userId !== user.id) {
        addNotification({
          type: 'message',
          title: `New message in #${data.spaceName}`,
          message: `${data.user}: ${data.content}`,
          spaceId: data.spaceId
        });
      }
    };

    const handleDirectMessage = (data: any) => {
      if (data.userId !== user.id) {
        addNotification({
          type: 'direct_message',
          title: `Direct message from ${data.user}`,
          message: data.content,
          conversationId: data.spaceId
        });
      }
    };

    subscribeToReceiveMessage(handleMessage);
    subscribeToReceiveDirectMessage(handleDirectMessage);

    return () => {
    };
  }, [user, subscribeToReceiveMessage, subscribeToReceiveDirectMessage]);

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    playNotificationSound
  };
};