'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setupAuthListener } from '@/utils/authUtils';

const CrossTabAuthListener = () => {
  const router = useRouter();

  useEffect(() => {
    const cleanup = setupAuthListener(() => {
      router.push('/');
      window.location.reload();
    });

    return cleanup;
  }, [router]);

  return null; 
};

export default CrossTabAuthListener;