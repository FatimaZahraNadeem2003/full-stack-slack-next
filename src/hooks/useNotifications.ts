import { useState, useEffect, useRef } from 'react';
import { useSocket } from './useSocket';
import { useAuth } from './useAuth';
import { api, Notification as ApiNotification } from '@/services/api';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const { subscribeToReceiveMessage, subscribeToReceiveDirectMessage, subscribeToNewNotification } = useSocket();
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

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    const result = await api.getNotifications();
    if (!result.error) {
      setNotifications(result.data.notifications);
      const unread = result.data.notifications.filter(n => !n.isRead).length;
      setUnreadCount(unread);
    }
  };

  const playNotificationSound = () => {
    if ((window as any).playNotificationSound) {
      (window as any).playNotificationSound();
    }
  };

  const markAsRead = async (id: string) => {
    const result = await api.markNotificationAsRead(id);
    if (!result.error) {
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id ? { ...notification, isRead: true } : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = async () => {
    const result = await api.markAllNotificationsAsRead();
    if (!result.error) {
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      setUnreadCount(0);
    }
  };

  const removeNotification = async (id: string) => {
    const result = await api.deleteNotification(id);
    if (!result.error) {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const clearAllNotifications = async () => {
    const result = await api.deleteAllNotifications();
    if (!result.error) {
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    if (!user) return;

    const handleMessage = (data: any) => {
      const isMention = data.content.toLowerCase().includes(`@${user.username.toLowerCase()}`);
      
      if (isMention) {
      } else if (data.userId !== user.id) {
      }
    };

    const handleDirectMessage = (data: any) => {
      if (data.userId !== user.id) {
      }
    };

    const handleNewNotification = (data: any) => {
      setNotifications(prev => [{
        id: data.id,
        type: data.type,
        title: data.title,
        message: data.message,
        isRead: data.isRead,
        createdAt: data.timestamp || data.createdAt,
        updatedAt: data.timestamp || data.createdAt,
        spaceId: data.spaceId,
        conversationId: data.conversationId
      }, ...prev]);
      
      if (!data.isRead) {
        setUnreadCount(prev => prev + 1);
        playNotificationSound();
      }
    };

    subscribeToReceiveMessage(handleMessage);
    subscribeToReceiveDirectMessage(handleDirectMessage);
    subscribeToNewNotification(handleNewNotification);

    return () => {
    };
  }, [user, subscribeToReceiveMessage, subscribeToReceiveDirectMessage, subscribeToNewNotification]);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    playNotificationSound
  };
};