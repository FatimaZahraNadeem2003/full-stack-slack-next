import { useState, useEffect } from 'react';
import { api, User } from '@/services/api';

export const useUserSearch = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchUsers = async (query: string, limit: number = 10) => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await api.searchUsers(query, limit);
      if (result.error) {
        setError(result.error);
        setUsers([]);
      } else {
        setUsers(result.data.users);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    error,
    searchUsers
  };
};