import { useState, useEffect, useCallback } from 'react';
import { api, Notification } from '@/services/api';
import { useSocket } from './useSocket';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { subscribeToNewNotification } = useSocket();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    
    const fetchNotifications = async () => {
      try {
        const result = await api.getNotifications();
        
        if (result.error) {
          setError(result.error);
          setNotifications([]);
        } else {
          if (isMounted) {
            setNotifications(result.data.notifications);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'An error occurred');
          setNotifications([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchNotifications();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleNewNotification = (newNotification: any) => {
      setNotifications(prev => [newNotification, ...prev]);
    };

    subscribeToNewNotification(handleNewNotification);
  }, [subscribeToNewNotification]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      const result = await api.markNotificationAsRead(id);
      if (!result.error) {
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === id ? { ...notification, isRead: true } : notification
          )
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark notification as read');
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      const result = await api.markAllNotificationsAsRead();
      if (!result.error) {
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, isRead: true }))
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark all notifications as read');
    }
  }, []);

  const removeNotification = useCallback(async (id: string) => {
    try {
      const result = await api.deleteNotification(id);
      if (!result.error) {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove notification');
    }
  }, []);

  const clearAllNotifications = useCallback(async () => {
    try {
      const result = await api.deleteAllNotifications();
      if (!result.error) {
        setNotifications([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear all notifications');
    }
  }, []);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
  };
};