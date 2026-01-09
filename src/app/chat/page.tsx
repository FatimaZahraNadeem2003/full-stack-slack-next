'use client';

import Chat from '@/components/Chat';
import ProtectedRoute from '@/components/ProtectedRoute';

const ChatPage = () => {
  return (
    <ProtectedRoute>
      <Chat />
    </ProtectedRoute>
  );
};

export default ChatPage;
