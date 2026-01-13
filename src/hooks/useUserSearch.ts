import { useState, useCallback, useRef, useEffect } from 'react';
import { api, User } from '@/services/api';

export const useUserSearch = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const searchUsers = useCallback(async (query: string) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (!query.trim()) {
      setUsers([]);
      return;
    }

    debounceTimer.current = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await api.searchUsers(query);
        if (result.error) {
          setError(result.error);
          setUsers([]);
        } else {
          setUsers(result.data.users);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while searching users');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return {
    users,
    loading,
    error,
    searchUsers,
  };
};