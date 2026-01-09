'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Register from '@/components/Register';
import { useAuth } from '@/hooks/useAuth';

const RegisterPage = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/chat');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null; 
  }

  return <Register />;
};

export default RegisterPage;