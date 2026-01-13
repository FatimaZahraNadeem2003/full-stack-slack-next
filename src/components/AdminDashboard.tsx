import { useState, useEffect } from 'react';
import { api, User, Message, AdminSpace } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import AdminUsersPanel from './AdminUsersPanel';
import AdminSpacesPanel from './AdminSpacesPanel';
import AdminMessagesPanel from './AdminMessagesPanel';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [spaces, setSpaces] = useState<AdminSpace[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role !== 'admin') {
      setError('Access denied. Admin privileges required.');
      return;
    }

    loadData();
  }, [user, selectedSpace]);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [usersRes, spacesRes, messagesRes] = await Promise.all([
        api.getUsers(),
        api.getAdminSpaces(),
        selectedSpace === 'all' 
          ? api.getAdminMessages() 
          : api.getAdminMessages(selectedSpace)
      ]);

      if (usersRes.error) throw new Error(usersRes.error);
      if (spacesRes.error) throw new Error(spacesRes.error);
      if (messagesRes.error) throw new Error(messagesRes.error);

      setUsers(usersRes.data.users);
      setSpaces(spacesRes.data.spaces);
      setMessages(messagesRes.data.messages);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center overflow-hidden">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-white/20 relative z-10 animate-fade-in-up">
          <h2 className="text-xl font-bold text-red-500 mb-4 gradient-text">Access Denied</h2>
          <p className="text-gray-600 mb-6">You must be an admin to access this page.</p>
          <button
            onClick={() => window.location.href = user?.role === 'user' ? '/user' : '/'}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Go {user?.role === 'user' ? 'To User Dashboard' : 'Home'}
          </button>
        </div>
        
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center overflow-hidden">
        <div className="text-center relative z-10 animate-float">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg animate-pulse">Loading admin dashboard...</p>
        </div>
        
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/30 to-purple-50/30 overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>
      
      <header className="bg-white/80 backdrop-blur-sm shadow-lg sticky top-0 z-10 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center animate-float">
                <div className="p-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 shadow-lg">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <span className="ml-3 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600">Admin Dashboard</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-red-100 to-pink-100 flex items-center justify-center shadow-md">
                  <span className="text-sm font-bold text-red-600">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">{user.username}</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-red-100 to-red-200 text-red-800 shadow-sm">
                  Admin
                </span>
              </div>
              <button
                onClick={logout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl btn-hover"
              >
                <svg className="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 text-red-700 rounded-xl flex items-center animate-shake shadow-md">
            <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 animate-fade-in-left">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 transition-all duration-300 hover:shadow-2xl">
              <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100/50 flex items-center">
                <svg className="mr-2 h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Users Management
              </h2>
              <AdminUsersPanel users={users} />
            </div>
          </div>
          
          <div className="lg:col-span-1 animate-fade-in-up">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 transition-all duration-300 hover:shadow-2xl">
              <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100/50 flex items-center">
                <svg className="mr-2 h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Spaces Management
              </h2>
              <AdminSpacesPanel 
                spaces={spaces} 
                selectedSpace={selectedSpace}
                onSpaceChange={setSelectedSpace}
              />
            </div>
          </div>
          
          <div className="lg:col-span-1 animate-fade-in-right">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 transition-all duration-300 hover:shadow-2xl">
              <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100/50 flex items-center">
                <svg className="mr-2 h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Messages
              </h2>
              <AdminMessagesPanel 
                messages={messages} 
                selectedSpace={selectedSpace}
                spaces={spaces}
              />
            </div>
          </div>
        </div>
      </main>
      
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
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .btn-hover {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .btn-hover::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }
        
        .btn-hover:hover::before {
          left: 100%;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;