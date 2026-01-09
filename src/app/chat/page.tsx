'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Chat from '@/components/Chat';
import { useAuth } from '@/hooks/useAuth';

const ChatPage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; 
  }

  return <Chat />;
};

export default ChatPage;