import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import CrossTabAuthListener from './CrossTabAuthListener';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');
  const { login, error, isLoading } = useAuth();
  const [adminExists, setAdminExists] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch('/api/auth/check-admin');
        const data = await response.json();
        setAdminExists(data.hasAdmin);
      } catch (err) {
        console.error('Error checking admin status:', err);
      }
    };

    checkAdmin();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === 'user') {
      await login(email, password);
    } 
    else if (activeTab === 'admin') {
      await login(email, password);
    }
  };

  return (
    <>
      <CrossTabAuthListener />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-60 h-60 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="max-w-md w-full space-y-8 relative z-10 transition-all duration-500 ease-in-out transform">
          <div className="text-center animate-fade-in-up">
            <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-110">
              <svg className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M14 20H6a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2zM12 14v4" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 transition-all duration-300 transform hover:scale-105">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-gray-600 transition-opacity duration-300 hover:text-gray-800">
              Sign in to your account to continue
            </p>
            
            <div className="mt-6 flex justify-center animate-fade-in-up delay-100">
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl shadow-inner">
                <button
                  type="button"
                  className={`px-5 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                    activeTab === 'user'
                      ? 'bg-white text-indigo-600 shadow-md transform -translate-y-0.5'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                  }`}
                  onClick={() => setActiveTab('user')}
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span>User</span>
                  </div>
                </button>
                <button
                  type="button"
                  className={`px-5 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                    activeTab === 'admin'
                      ? 'bg-white text-indigo-600 shadow-md transform -translate-y-0.5'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                  }`}
                  onClick={() => setActiveTab('admin')}
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>Admin</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
          
          <form className="mt-8 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 transition-all duration-500 ease-in-out transform hover:shadow-2xl" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-lg bg-red-50 p-4 mb-4 animate-shake border border-red-100">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}
            <div className="space-y-4">
              <div className="transition-all duration-300 hover:scale-[1.02]">
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1 transition-colors duration-300">
                  Email address
                </label>
                <div className="relative">
                  <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-300 group-hover:border-indigo-400"
                  placeholder="Enter your email"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                </div>
              </div>
              <div className="transition-all duration-300 hover:scale-[1.02]">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 transition-colors duration-300">
                  Password
                </label>
                <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-300 group-hover:border-indigo-400"
                  placeholder="Enter your password"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                </div>
              </div>
            </div>

            <div className="mt-6 transition-all duration-300">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              >
                <span className="absolute left-0 inset-y-0 w-full h-full -skew-x-12 bg-white opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300"></span>
                {isLoading ? (
                  <span className="flex items-center z-10">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <span className="z-10">
                    Sign in {activeTab === 'admin' ? 'as Admin' : 'as User'}
                  </span>
                )}
              </button>
            </div>
          </form>
          
          <div className="text-center mt-6 animate-fade-in-up delay-200">
            <p className="text-sm text-gray-600 transition-colors duration-300">
              Don't have an account?{' '}
              <Link 
                href={adminExists && activeTab === 'admin' ? '#' : "/register"} 
                className={`font-semibold ${
                  adminExists && activeTab === 'admin' 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-indigo-600 hover:text-indigo-700 underline decoration-indigo-600/50 hover:decoration-indigo-700'
                } transition-all duration-300`}
                onClick={(e) => {
                  if (adminExists && activeTab === 'admin') {
                    e.preventDefault();
                    alert('Admin account already exists. Only the first registered user can be admin.');
                  }
                }}
              >
                Sign up
              </Link>
            </p>
            
            {adminExists && activeTab === 'admin' && (
              <p className="text-xs text-red-500 mt-2 bg-red-50 p-2 rounded-lg border border-red-100 animate-fade-in-up delay-300">
                Admin account already exists. Only the first registered user can be admin.
              </p>
            )}
          </div>
          
          <div className="mt-8 text-center animate-fade-in-up delay-400">
            <p className="text-xs text-gray-500 transition-colors duration-300 hover:text-gray-700">
              © 2026 Slack. All rights reserved.
            </p>
          </div>
        </div>
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
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
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
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        .delay-100 {
          animation-delay: 0.1s;
        }
        
        .delay-200 {
          animation-delay: 0.2s;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
        }
        
        .delay-400 {
          animation-delay: 0.4s;
        }
        
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </>
  );
};

export default Login;