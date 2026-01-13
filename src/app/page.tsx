'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Login from '@/components/Login';
import NotificationDropdown from '@/components/NotificationDropdown';
import { useEffect } from 'react';
import CrossTabAuthListener from '@/components/CrossTabAuthListener';

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/user');
      }
    }
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <CrossTabAuthListener />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 overflow-hidden">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-60 h-60 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
        
        {!user ? (
          <div className="container mx-auto px-4 py-8 max-w-md relative z-10 transition-all duration-700 ease-in-out transform">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 transition-all duration-500 ease-in-out transform hover:scale-[1.02] hover:shadow-2xl">
              <div className="flex justify-end mb-4 transition-all duration-300">
                <NotificationDropdown />
              </div>
              <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-8 transition-all duration-500 transform hover:scale-105 animate-fade-in-up">
                Welcome to Slack
              </h1>
              <div className="animate-fade-in-up delay-100">
                <Login />
              </div>
            </div>
            
            <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-6 -right-6 w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 opacity-20 animate-pulse animation-delay-1000"></div>
            <div className="absolute top-1/2 -right-10 w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-30 animate-bounce"></div>
          </div>
        ) : null}
      </div>
      
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 20%;
            transform: scale(1);
          }
          50% {
            opacity: 30%;
            transform: scale(1.05);
          }
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(-0%);
          }
          50% {
            transform: translateY(-20%);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        .delay-100 {
          animation-delay: 0.1s;
        }
        
        .animate-pulse {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-bounce {
          animation: bounce 2s infinite;
        }
      `}</style>
    </>
  );
}